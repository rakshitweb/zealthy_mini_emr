from datetime import date, datetime
from pydantic import BaseModel


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
