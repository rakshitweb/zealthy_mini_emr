from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.appointments.appointments_controller import get_patient_appointments
from db.database import get_db
from db.schemas.appointments import AppointmentResponse

router = APIRouter(prefix="/appointments", tags=["appointments"])


@router.get("/{patient_id}", response_model=List[AppointmentResponse])
def get_patient_appointments_route(patient_id: int, db: Session = Depends(get_db)):
    return get_patient_appointments(patient_id, db)
