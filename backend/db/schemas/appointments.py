import datetime as dt
from pydantic import BaseModel
from typing import Optional
from db.models.appointments import RepeatInterval


class AppointmentCreate(BaseModel):
    provider: str
    datetime: dt.datetime
    repeat: RepeatInterval


class AppointmentUpdate(BaseModel):
    provider: Optional[str] = None
    datetime: Optional[dt.datetime] = None
    repeat: Optional[RepeatInterval] = None


class AppointmentResponse(BaseModel):
    id: int
    patient_id: int
    provider: str
    datetime: dt.datetime
    repeat: RepeatInterval
    latest_occurrence: dt.date

    model_config = {"from_attributes": True}
