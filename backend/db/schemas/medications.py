from pydantic import BaseModel


class MedicationResponse(BaseModel):
    id: int
    name: str

    model_config = {"from_attributes": True}


class DosageResponse(BaseModel):
    id: int
    value: str

    model_config = {"from_attributes": True}
