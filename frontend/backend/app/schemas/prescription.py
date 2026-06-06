from pydantic import BaseModel
from datetime import datetime


class PrescriptionOut(BaseModel):
    id: int
    original_filename: str
    status: str
    notes: str | None
    pharmacist_notes: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
