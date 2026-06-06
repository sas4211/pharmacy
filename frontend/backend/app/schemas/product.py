from pydantic import BaseModel
from decimal import Decimal
from datetime import datetime


class CategoryOut(BaseModel):
    id: int
    name: str
    slug: str
    emoji: str | None
    item_count: int

    model_config = {"from_attributes": True}


class BrandOut(BaseModel):
    id: int
    name: str
    slug: str
    emoji: str | None
    product_count: int

    model_config = {"from_attributes": True}


class ConditionOut(BaseModel):
    id: int
    name: str
    slug: str
    category: str
    medication_count: int

    model_config = {"from_attributes": True}


class ProductOut(BaseModel):
    id: int
    name: str
    slug: str
    emoji: str | None
    description: str | None
    price: Decimal
    original_price: Decimal | None
    stock: int
    rating: Decimal
    review_count: int
    is_featured: bool
    is_flash_sale: bool
    flash_discount_pct: int | None
    requires_prescription: bool
    tags: list | None
    brand: BrandOut | None
    category: CategoryOut | None
    created_at: datetime

    model_config = {"from_attributes": True}


class ProductCreate(BaseModel):
    name: str
    slug: str
    brand_id: int | None = None
    category_id: int | None = None
    emoji: str | None = None
    description: str | None = None
    price: Decimal
    original_price: Decimal | None = None
    stock: int = 0
    is_featured: bool = False
    is_flash_sale: bool = False
    flash_discount_pct: int | None = None
    requires_prescription: bool = False
    tags: list | None = None


class ProductUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    price: Decimal | None = None
    original_price: Decimal | None = None
    stock: int | None = None
    is_featured: bool | None = None
    is_flash_sale: bool | None = None
    flash_discount_pct: int | None = None
    is_active: bool | None = None
