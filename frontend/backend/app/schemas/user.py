from pydantic import BaseModel, EmailStr
from datetime import datetime


class AddressCreate(BaseModel):
    label: str = "Home"
    street: str
    city: str = "Karachi"
    postal_code: str | None = None
    is_default: bool = False


class AddressOut(AddressCreate):
    id: int

    model_config = {"from_attributes": True}


class UserOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    phone: str | None
    is_active: bool
    is_admin: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    full_name: str | None = None
    phone: str | None = None
