from datetime import datetime
from pydantic import BaseModel
from typing import Optional
from db.models.appointments import RepeatInterval


class AppointmentCreate(BaseModel):
    provider: str
    datetime: datetime
    repeat: RepeatInterval


class AppointmentUpdate(BaseModel):
    provider: Optional[str] = None
    datetime: Optional[datetime] = None
    repeat: Optional[RepeatInterval] = None


class AppointmentResponse(BaseModel):
    id: int
    patient_id: int
    provider: str
    datetime: datetime
    repeat: RepeatInterval

    model_config = {"from_attributes": True}
