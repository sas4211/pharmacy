from pydantic import BaseModel
from decimal import Decimal
from datetime import datetime


class CartItemAdd(BaseModel):
    product_id: int | None = None
    product_name: str
    product_emoji: str | None = None
    unit_price: Decimal
    qty: int = 1


class CartItemUpdate(BaseModel):
    qty: int


class CartItemOut(BaseModel):
    id: int
    product_id: int | None
    product_name: str
    product_emoji: str | None
    unit_price: Decimal
    qty: int
    added_at: datetime

    model_config = {"from_attributes": True}


class CartOut(BaseModel):
    items: list[CartItemOut]
    total: Decimal
    item_count: int
