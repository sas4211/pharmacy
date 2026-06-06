from pydantic import BaseModel, EmailStr
from datetime import datetime


class NewsletterSubscribe(BaseModel):
    email: EmailStr


class NewsletterOut(BaseModel):
    id: int
    email: EmailStr
    is_active: bool
    subscribed_at: datetime

    model_config = {"from_attributes": True}
