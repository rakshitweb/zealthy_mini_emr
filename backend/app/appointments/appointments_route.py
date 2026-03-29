from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.appointments.appointments_controller import get_patient_appointments, create_appointment, update_appointment, delete_appointment
from db.database import get_db
from db.schemas.appointments import AppointmentCreate, AppointmentUpdate, AppointmentResponse

router = APIRouter(prefix="/appointments", tags=["appointments"])


@router.get("/{patient_id}", response_model=List[AppointmentResponse])
def get_patient_appointments_route(patient_id: int, db: Session = Depends(get_db)):
    return get_patient_appointments(patient_id, db)


@router.post("/{patient_id}", response_model=AppointmentResponse, status_code=201)
def create_appointment_route(patient_id: int, body: AppointmentCreate, db: Session = Depends(get_db)):
    return create_appointment(patient_id, body, db)


@router.put("/{appointment_id}", response_model=AppointmentResponse)
def update_appointment_route(appointment_id: int, body: AppointmentUpdate, db: Session = Depends(get_db)):
    return update_appointment(appointment_id, body, db)


@router.delete("/{appointment_id}", status_code=204)
def delete_appointment_route(appointment_id: int, db: Session = Depends(get_db)):
    delete_appointment(appointment_id, db)
