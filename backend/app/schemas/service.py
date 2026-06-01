from pydantic import BaseModel
from datetime import datetime, date, time


class ServiceBookingCreate(BaseModel):
    service_type: str
    service_name: str
    booking_date: date | None = None
    booking_time: time | None = None
    patient_name: str | None = None
    patient_phone: str | None = None
    notes: str | None = None
    is_online: bool = False


class ServiceBookingOut(BaseModel):
    id: int
    service_type: str
    service_name: str
    booking_date: date | None
    booking_time: time | None
    status: str
    patient_name: str | None
    patient_phone: str | None
    notes: str | None
    is_online: bool
    created_at: datetime

    model_config = {"from_attributes": True}
