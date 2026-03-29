from datetime import date
from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload

from config.logger import get_logger
from db.models.prescriptions import Prescription
from db.models.patients import Patient
from db.schemas.prescriptions import PrescriptionCreate, PrescriptionUpdate
from app.patients.utils import find_next_occurrence

logger = get_logger(__name__)


def create_prescription(patient_id: int, body: PrescriptionCreate, db: Session) -> dict:
    logger.info(f"Creating prescription for patient_id={patient_id}")
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    prescription = Prescription(**body.model_dump(), patient_id=patient_id)
    db.add(prescription)
    db.commit()
    db.refresh(prescription)
    prescription = (
        db.query(Prescription)
        .filter(Prescription.id == prescription.id)
        .options(joinedload(Prescription.medication), joinedload(Prescription.dosage))
        .first()
    )
    today = date.today()
    return {**prescription.__dict__, "medication": prescription.medication, "dosage": prescription.dosage, "latest_occurrence": find_next_occurrence(prescription.refill_on, prescription.refill_schedule, today)}


def update_prescription(prescription_id: int, body: PrescriptionUpdate, db: Session) -> dict:
    logger.info(f"Updating prescription id={prescription_id}")
    prescription = db.query(Prescription).filter(Prescription.id == prescription_id).first()
    if not prescription:
        raise HTTPException(status_code=404, detail="Prescription not found")
    for field, value in body.model_dump(exclude_none=True).items():
        setattr(prescription, field, value)
    db.commit()
    prescription = (
        db.query(Prescription)
        .filter(Prescription.id == prescription_id)
        .options(joinedload(Prescription.medication), joinedload(Prescription.dosage))
        .first()
    )
    today = date.today()
    return {**prescription.__dict__, "medication": prescription.medication, "dosage": prescription.dosage, "latest_occurrence": find_next_occurrence(prescription.refill_on, prescription.refill_schedule, today)}


def delete_prescription(prescription_id: int, db: Session) -> None:
    logger.info(f"Deleting prescription id={prescription_id}")
    prescription = db.query(Prescription).filter(Prescription.id == prescription_id).first()
    if not prescription:
        raise HTTPException(status_code=404, detail="Prescription not found")
    prescription.is_active = False
    db.commit()


def get_patient_prescriptions(patient_id: int, db: Session) -> list:
    logger.info(f"Fetching prescriptions for patient_id={patient_id}")
    today = date.today()
    month = today.month - 1 + 3
    end_date = today.replace(year=today.year + month // 12, month=month % 12 + 1)

    all_prescriptions = (
        db.query(Prescription)
        .filter(Prescription.patient_id == patient_id, Prescription.is_active == True)
        .options(joinedload(Prescription.medication), joinedload(Prescription.dosage))
        .all()
    )
    upcoming = [
        {
            **a.__dict__,
            "medication": a.medication,
            "dosage": a.dosage,
            "latest_occurrence": find_next_occurrence(
                a.refill_on, a.refill_schedule, today
            ),
        }
        for a in all_prescriptions
        if find_next_occurrence(a.refill_on, a.refill_schedule, today) <= end_date
    ]

    return upcoming
