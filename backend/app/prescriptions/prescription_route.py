from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from db.database import get_db
from db.schemas.prescriptions import PrescriptionResponse
from .prescription_controller import get_patient_prescriptions

router = APIRouter(prefix="/prescriptions", tags=["prescription"])


@router.get("/{patient_id}", response_model=List[PrescriptionResponse])
def get_patient_prescriptions_route(patient_id: int, db: Session = Depends(get_db)):
    return get_patient_prescriptions(patient_id, db)
