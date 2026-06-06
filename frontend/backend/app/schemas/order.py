from pydantic import BaseModel
from decimal import Decimal
from datetime import datetime


class OrderItemIn(BaseModel):
    product_id: int | None = None
    product_name: str
    product_emoji: str | None = None
    unit_price: Decimal
    qty: int


class OrderCreate(BaseModel):
    items: list[OrderItemIn]
    delivery_address: str | None = None
    notes: str | None = None
    payment_method: str | None = None   # card, jazzcash, easypaisa, bank_transfer, cod
    payment_ref: str | None = None      # Stripe PI id, TxnID, bank ref, etc.


class OrderItemOut(BaseModel):
    id: int
    product_id: int | None
    product_name: str
    product_emoji: str | None
    unit_price: Decimal
    qty: int
    subtotal: Decimal

    model_config = {"from_attributes": True}


class OrderOut(BaseModel):
    id: int
    status: str
    total_amount: Decimal
    delivery_fee: Decimal
    delivery_address: str | None
    notes: str | None
    payment_method: str | None
    payment_status: str
    payment_ref: str | None
    items: list[OrderItemOut]
    created_at: datetime

    model_config = {"from_attributes": True}
