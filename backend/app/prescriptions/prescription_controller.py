from datetime import date
from sqlalchemy.orm import Session, joinedload

from config.logger import get_logger
from db.models.prescriptions import Prescription
from app.patients.utils import find_next_occurrence

logger = get_logger(__name__)


def get_patient_prescriptions(patient_id: int, db: Session) -> list:
    logger.info(f"Fetching prescriptions for patient_id={patient_id}")
    today = date.today()
    month = today.month - 1 + 3
    end_date = today.replace(year=today.year + month // 12, month=month % 12 + 1)

    all_prescriptions = (
        db.query(Prescription)
        .filter(Prescription.patient_id == patient_id)
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
