from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.service import ServiceBooking
from app.models.user import User
from app.schemas.service import ServiceBookingCreate, ServiceBookingOut
from app.auth import get_current_user

router = APIRouter(prefix="/services", tags=["services"])


@router.get("", response_model=list[ServiceBookingOut])
async def list_bookings(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ServiceBooking)
        .where(ServiceBooking.user_id == user.id)
        .order_by(ServiceBooking.created_at.desc())
    )
    return result.scalars().all()


@router.post("", response_model=ServiceBookingOut, status_code=201)
async def book_service(
    body: ServiceBookingCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    booking = ServiceBooking(user_id=user.id, **body.model_dump())
    db.add(booking)
    await db.flush()
    await db.refresh(booking)
    return booking


@router.get("/{booking_id}", response_model=ServiceBookingOut)
async def get_booking(
    booking_id: int,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(ServiceBooking).where(ServiceBooking.id == booking_id, ServiceBooking.user_id == user.id)
    )
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking


@router.patch("/{booking_id}/cancel", response_model=ServiceBookingOut)
async def cancel_booking(
    booking_id: int,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(ServiceBooking).where(ServiceBooking.id == booking_id, ServiceBooking.user_id == user.id)
    )
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.status == "completed":
        raise HTTPException(status_code=400, detail="Cannot cancel a completed booking")
    booking.status = "cancelled"
    await db.flush()
    return booking
