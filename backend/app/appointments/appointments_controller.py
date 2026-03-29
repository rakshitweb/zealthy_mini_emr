from datetime import date
from sqlalchemy.orm import Session

from config.logger import get_logger
from db.models.appointments import Appointment
from app.patients.utils import find_next_occurrence

logger = get_logger(__name__)


def get_patient_appointments(patient_id: int, db: Session) -> list:
    logger.info(f"Fetching appointments for patient_id={patient_id}")
    today = date.today()
    month = today.month - 1 + 3
    end_date = today.replace(year=today.year + month // 12, month=month % 12 + 1)

    all_appointments = db.query(Appointment).filter(Appointment.patient_id == patient_id).all()
    upcoming = [
        {**a.__dict__, "latest_occurrence": find_next_occurrence(a.datetime.date(), a.repeat, today)}
        for a in all_appointments
        if find_next_occurrence(a.datetime.date(), a.repeat, today) <= end_date
    ]

    return upcoming
