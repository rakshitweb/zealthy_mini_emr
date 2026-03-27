from pydantic import BaseModel
from typing import Optional, List, TYPE_CHECKING

if TYPE_CHECKING:
    from db.schemas.appointments import AppointmentResponse


class PatientCreate(BaseModel):
    name: str
    email: str
    password: str


class PatientUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None


class PatientResponse(BaseModel):
    id: int
    name: str
    email: str
    appointments: List["AppointmentResponse"] = []

    model_config = {"from_attributes": True}


from db.schemas.appointments import AppointmentResponse
PatientResponse.model_rebuild()
