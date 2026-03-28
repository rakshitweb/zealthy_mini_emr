from pydantic import BaseModel
from typing import Optional, List, TYPE_CHECKING

if TYPE_CHECKING:
    from db.schemas.appointments import AppointmentResponse
    from db.schemas.prescriptions import PrescriptionResponse


class PatientCreate(BaseModel):
    name: str
    email: str
    password: str


class PatientUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None


class PatientListItem(BaseModel):
    id: int
    name: str
    email: str

    model_config = {"from_attributes": True}


class PaginatedPatientsResponse(BaseModel):
    patients: List[PatientListItem]
    total: int
    page: int
    page_size: int


class PatientResponse(BaseModel):
    id: int
    name: str
    email: str
    appointments: List["AppointmentResponse"] = []
    prescriptions: List["PrescriptionResponse"] = []

    model_config = {"from_attributes": True}


from db.schemas.appointments import AppointmentResponse
from db.schemas.prescriptions import PrescriptionResponse
PatientResponse.model_rebuild()
