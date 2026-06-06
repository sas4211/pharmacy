import os
import uuid
from pathlib import Path

import aiofiles
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.config import settings
from app.database import get_db
from app.models.prescription import Prescription
from app.models.user import User
from app.schemas.prescription import PrescriptionOut
from app.auth import get_current_user

router = APIRouter(prefix="/prescriptions", tags=["prescriptions"])

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "application/pdf"}
MAX_BYTES = settings.MAX_FILE_SIZE_MB * 1024 * 1024


@router.get("", response_model=list[PrescriptionOut])
async def list_prescriptions(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Prescription)
        .where(Prescription.user_id == user.id, Prescription.is_active == True)  # noqa: E712
        .order_by(Prescription.created_at.desc())
    )
    return result.scalars().all()


@router.post("", response_model=PrescriptionOut, status_code=201)
async def upload_prescription(
    file: UploadFile = File(...),
    notes: str | None = None,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, WebP or PDF files are accepted")

    content = await file.read()
    if len(content) > MAX_BYTES:
        raise HTTPException(status_code=400, detail=f"File exceeds {settings.MAX_FILE_SIZE_MB} MB limit")

    upload_dir = Path(settings.UPLOAD_DIR) / "prescriptions"
    upload_dir.mkdir(parents=True, exist_ok=True)

    ext = Path(file.filename).suffix
    filename = f"{uuid.uuid4().hex}{ext}"
    file_path = upload_dir / filename

    async with aiofiles.open(file_path, "wb") as f:
        await f.write(content)

    rx = Prescription(
        user_id=user.id,
        file_path=str(file_path),
        original_filename=file.filename,
        notes=notes,
    )
    db.add(rx)
    await db.flush()
    return rx


@router.delete("/{rx_id}", status_code=204)
async def delete_prescription(
    rx_id: int,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Prescription).where(Prescription.id == rx_id, Prescription.user_id == user.id)
    )
    rx = result.scalar_one_or_none()
    if not rx:
        raise HTTPException(status_code=404, detail="Prescription not found")
    rx.is_active = False
    await db.flush()
