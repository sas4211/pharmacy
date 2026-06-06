from pydantic import BaseModel
from decimal import Decimal
from datetime import datetime


class WishlistItemAdd(BaseModel):
    product_id: int | None = None
    product_name: str
    product_emoji: str | None = None
    unit_price: Decimal


class WishlistItemOut(BaseModel):
    id: int
    product_id: int | None
    product_name: str
    product_emoji: str | None
    unit_price: Decimal
    added_at: datetime

    model_config = {"from_attributes": True}
