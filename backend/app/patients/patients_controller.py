from datetime import datetime, timedelta, timezone
from fastapi import HTTPException
from sqlalchemy.orm import Session

from config.logger import get_logger
from db.models.appointments import Appointment
from db.models.patients import Patient
from db.schemas.patients import PatientCreate, PatientUpdate
from .utils import find_next_occurrence

logger = get_logger(__name__)

def create_patient(body: PatientCreate, db: Session) -> Patient:
    logger.info(f"Creating patient with email={body.email}")
    existing = db.query(Patient).filter(Patient.email == body.email).first()
    if existing:
        logger.warning(f"Patient with email={body.email} already exists")
        raise HTTPException(status_code=409, detail="Email already registered")
    patient = Patient(**body.model_dump())
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient


def update_patient(patient_id: int, body: PatientUpdate, db: Session) -> Patient:
    logger.info(f"Updating patient with id={patient_id}")
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        logger.warning(f"Patient with id={patient_id} not found")
        raise HTTPException(status_code=404, detail="Patient not found")
    for field, value in body.model_dump(exclude_none=True).items():
        setattr(patient, field, value)
    db.commit()
    db.refresh(patient)
    return patient


def get_patients(page: int, page_size: int, db: Session) -> dict:
    logger.info(f"Fetching patients page={page} page_size={page_size}")
    total = db.query(Patient).count()
    patients = db.query(Patient).offset((page - 1) * page_size).limit(page_size).all()
    return {
        "patients": patients,
        "total": total,
        "page": page,
        "page_size": page_size
    }


def get_patient(patient_id: int, db: Session) -> dict:
    logger.info(f"Fetching patient with id={patient_id}")
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        logger.warning(f"Patient with id={patient_id} not found")
        raise HTTPException(status_code=404, detail="Patient not found")

    now = datetime.now(timezone.utc)
    end_date = now + timedelta(days=7)
    all_appointments = db.query(Appointment).filter(Appointment.patient_id == patient_id).all()
    upcoming = [
        {**a.__dict__, "latest_occurrence": find_next_occurrence(a.datetime, a.repeat, now)}
        for a in all_appointments
        if find_next_occurrence(a.datetime, a.repeat, now) <= end_date
    ]

    return {**patient.__dict__, "appointments": upcoming}
