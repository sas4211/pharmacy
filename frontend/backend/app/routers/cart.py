from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from decimal import Decimal

from app.database import get_db
from app.models.cart import CartItem
from app.models.user import User
from app.schemas.cart import CartItemAdd, CartItemUpdate, CartItemOut, CartOut
from app.auth import get_current_user

router = APIRouter(prefix="/cart", tags=["cart"])


@router.get("", response_model=CartOut)
async def get_cart(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CartItem).where(CartItem.user_id == user.id))
    items = result.scalars().all()
    total = sum(i.unit_price * i.qty for i in items)
    item_count = sum(i.qty for i in items)
    return CartOut(items=items, total=total, item_count=item_count)


@router.post("/add", response_model=CartItemOut, status_code=201)
async def add_to_cart(
    body: CartItemAdd,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # If same product already in cart, increment qty
    if body.product_id:
        existing_result = await db.execute(
            select(CartItem).where(CartItem.user_id == user.id, CartItem.product_id == body.product_id)
        )
        existing = existing_result.scalar_one_or_none()
        if existing:
            existing.qty += body.qty
            await db.flush()
            return existing

    item = CartItem(
        user_id=user.id,
        product_id=body.product_id,
        product_name=body.product_name,
        product_emoji=body.product_emoji,
        unit_price=body.unit_price,
        qty=body.qty,
    )
    db.add(item)
    await db.flush()
    return item


@router.patch("/{item_id}", response_model=CartItemOut)
async def update_cart_item(
    item_id: int,
    body: CartItemUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(CartItem).where(CartItem.id == item_id, CartItem.user_id == user.id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    if body.qty <= 0:
        await db.delete(item)
        await db.flush()
        raise HTTPException(status_code=204, detail="Item removed")
    item.qty = body.qty
    await db.flush()
    return item


@router.delete("/{item_id}", status_code=204)
async def remove_cart_item(
    item_id: int,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(CartItem).where(CartItem.id == item_id, CartItem.user_id == user.id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    await db.delete(item)
    await db.flush()


@router.delete("", status_code=204)
async def clear_cart(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    await db.execute(delete(CartItem).where(CartItem.user_id == user.id))
    await db.flush()
