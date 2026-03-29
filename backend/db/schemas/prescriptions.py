from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel
from db.models.appointments import RepeatInterval


class PrescriptionCreate(BaseModel):
    patient_id: int
    medication_id: int
    dosage_id: int
    quantity: int
    refill_on: date
    refill_schedule: RepeatInterval


class PrescriptionUpdate(BaseModel):
    medication_id: Optional[int] = None
    dosage_id: Optional[int] = None
    quantity: Optional[int] = None
    refill_on: Optional[date] = None
    refill_schedule: Optional[RepeatInterval] = None


class MedicationResponse(BaseModel):
    id: int
    name: str

    model_config = {"from_attributes": True}


class DosageResponse(BaseModel):
    id: int
    value: str

    model_config = {"from_attributes": True}


class PrescriptionResponse(BaseModel):
    id: int
    quantity: int
    refill_on: date
    refill_schedule: str
    medication: MedicationResponse
    dosage: DosageResponse
    latest_occurrence: datetime

    model_config = {"from_attributes": True}
