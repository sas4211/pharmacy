from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.order import Order, OrderItem
from app.models.cart import CartItem
from app.models.user import User
from app.schemas.order import OrderCreate, OrderOut
from app.auth import get_current_user

router = APIRouter(prefix="/orders", tags=["orders"])

DELIVERY_FEE = Decimal("200.00")
FREE_DELIVERY_THRESHOLD = Decimal("5000.00")


@router.get("", response_model=list[OrderOut])
async def list_orders(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Order)
        .options(selectinload(Order.items))
        .where(Order.user_id == user.id)
        .order_by(Order.created_at.desc())
    )
    return result.scalars().all()


@router.get("/{order_id}", response_model=OrderOut)
async def get_order(order_id: int, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Order)
        .options(selectinload(Order.items))
        .where(Order.id == order_id, Order.user_id == user.id)
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.post("", response_model=OrderOut, status_code=201)
async def place_order(
    body: OrderCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not body.items:
        raise HTTPException(status_code=400, detail="Order must have at least one item")

    subtotal = sum(item.unit_price * item.qty for item in body.items)
    delivery_fee = Decimal("0.00") if subtotal >= FREE_DELIVERY_THRESHOLD else DELIVERY_FEE
    total = subtotal + delivery_fee

    # Determine payment status from method
    if body.payment_method == "cod":
        pay_status = "cod"
    elif body.payment_method == "card" and body.payment_ref:
        pay_status = "paid"          # Stripe payment was confirmed before order creation
    else:
        pay_status = "pending"       # Manual payments awaiting admin verification

    order = Order(
        user_id=user.id,
        total_amount=total,
        delivery_fee=delivery_fee,
        delivery_address=body.delivery_address,
        notes=body.notes,
        payment_method=body.payment_method,
        payment_status=pay_status,
        payment_ref=body.payment_ref,
    )
    db.add(order)
    await db.flush()

    for line in body.items:
        db.add(OrderItem(
            order_id=order.id,
            product_id=line.product_id,
            product_name=line.product_name,
            product_emoji=line.product_emoji,
            unit_price=line.unit_price,
            qty=line.qty,
            subtotal=line.unit_price * line.qty,
        ))

    # Clear the user's cart after order is placed
    await db.execute(delete(CartItem).where(CartItem.user_id == user.id))
    await db.flush()

    # Reload with items
    await db.refresh(order)
    result = await db.execute(
        select(Order).options(selectinload(Order.items)).where(Order.id == order.id)
    )
    return result.scalar_one()


@router.patch("/{order_id}/cancel", response_model=OrderOut)
async def cancel_order(
    order_id: int,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Order).options(selectinload(Order.items)).where(Order.id == order_id, Order.user_id == user.id)
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.status not in ("pending", "confirmed"):
        raise HTTPException(status_code=400, detail=f"Cannot cancel order in '{order.status}' status")
    order.status = "cancelled"
    await db.flush()
    return order
