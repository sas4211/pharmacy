from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.newsletter import NewsletterSubscriber
from app.schemas.newsletter import NewsletterSubscribe, NewsletterOut

router = APIRouter(prefix="/newsletter", tags=["newsletter"])


@router.post("/subscribe", response_model=NewsletterOut, status_code=201)
async def subscribe(body: NewsletterSubscribe, db: AsyncSession = Depends(get_db)):
    existing = await db.execute(
        select(NewsletterSubscriber).where(NewsletterSubscriber.email == body.email)
    )
    sub = existing.scalar_one_or_none()
    if sub:
        if sub.is_active:
            raise HTTPException(status_code=409, detail="Already subscribed")
        # Re-subscribe
        sub.is_active = True
        await db.flush()
        return sub

    sub = NewsletterSubscriber(email=body.email)
    db.add(sub)
    await db.flush()
    return sub


@router.post("/unsubscribe", status_code=204)
async def unsubscribe(body: NewsletterSubscribe, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(NewsletterSubscriber).where(NewsletterSubscriber.email == body.email)
    )
    sub = result.scalar_one_or_none()
    if not sub or not sub.is_active:
        raise HTTPException(status_code=404, detail="Subscription not found")
    sub.is_active = False
    await db.flush()
