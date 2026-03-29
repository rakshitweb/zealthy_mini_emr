from datetime import date
from fastapi import HTTPException
from sqlalchemy.orm import Session

from config.logger import get_logger
from db.models.appointments import Appointment
from db.models.patients import Patient
from db.schemas.appointments import AppointmentCreate, AppointmentUpdate
from app.patients.utils import find_next_occurrence

logger = get_logger(__name__)


def create_appointment(patient_id: int, body: AppointmentCreate, db: Session) -> dict:
    logger.info(f"Creating appointment for patient_id={patient_id}")
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    appointment = Appointment(**body.model_dump(), patient_id=patient_id)
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    today = date.today()
    return {**appointment.__dict__, "latest_occurrence": find_next_occurrence(appointment.datetime.date(), appointment.repeat, today)}


def update_appointment(appointment_id: int, body: AppointmentUpdate, db: Session) -> dict:
    logger.info(f"Updating appointment id={appointment_id}, body={body}")
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    for field, value in body.model_dump(exclude_none=True).items():
        setattr(appointment, field, value)
    db.commit()
    db.refresh(appointment)
    today = date.today()
    return {**appointment.__dict__, "latest_occurrence": find_next_occurrence(appointment.datetime.date(), appointment.repeat, today)}


def delete_appointment(appointment_id: int, db: Session) -> None:
    logger.info(f"Deleting appointment id={appointment_id}")
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    appointment.is_active = False
    db.commit()


def get_patient_appointments(patient_id: int, db: Session) -> list:
    logger.info(f"Fetching appointments for patient_id={patient_id}")
    today = date.today()
    month = today.month - 1 + 3
    end_date = today.replace(year=today.year + month // 12, month=month % 12 + 1)

    all_appointments = db.query(Appointment).filter(Appointment.patient_id == patient_id, Appointment.is_active == True).all()
    upcoming = [
        {**a.__dict__, "latest_occurrence": find_next_occurrence(a.datetime.date(), a.repeat, today)}
        for a in all_appointments
        if find_next_occurrence(a.datetime.date(), a.repeat, today) <= end_date
    ]

    return upcoming
