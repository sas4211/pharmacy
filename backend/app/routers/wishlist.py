from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete

from app.database import get_db
from app.models.wishlist import WishlistItem
from app.models.user import User
from app.schemas.wishlist import WishlistItemAdd, WishlistItemOut
from app.auth import get_current_user

router = APIRouter(prefix="/wishlist", tags=["wishlist"])


@router.get("", response_model=list[WishlistItemOut])
async def get_wishlist(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(WishlistItem).where(WishlistItem.user_id == user.id))
    return result.scalars().all()


@router.post("/add", response_model=WishlistItemOut, status_code=201)
async def add_to_wishlist(
    body: WishlistItemAdd,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Prevent duplicates
    if body.product_id:
        exists = await db.execute(
            select(WishlistItem).where(WishlistItem.user_id == user.id, WishlistItem.product_id == body.product_id)
        )
        if exists.scalar_one_or_none():
            raise HTTPException(status_code=409, detail="Already in wishlist")

    item = WishlistItem(
        user_id=user.id,
        product_id=body.product_id,
        product_name=body.product_name,
        product_emoji=body.product_emoji,
        unit_price=body.unit_price,
    )
    db.add(item)
    await db.flush()
    return item


@router.delete("/{item_id}", status_code=204)
async def remove_from_wishlist(
    item_id: int,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(WishlistItem).where(WishlistItem.id == item_id, WishlistItem.user_id == user.id)
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Wishlist item not found")
    await db.delete(item)
    await db.flush()


@router.delete("", status_code=204)
async def clear_wishlist(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    await db.execute(delete(WishlistItem).where(WishlistItem.user_id == user.id))
    await db.flush()
