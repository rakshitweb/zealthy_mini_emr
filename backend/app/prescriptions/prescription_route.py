from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from db.database import get_db
from db.schemas.prescriptions import PrescriptionCreate, PrescriptionUpdate, PrescriptionResponse
from .prescription_controller import get_patient_prescriptions, create_prescription, update_prescription, delete_prescription

router = APIRouter(prefix="/prescriptions", tags=["prescription"])


@router.get("/{patient_id}", response_model=List[PrescriptionResponse])
def get_patient_prescriptions_route(patient_id: int, db: Session = Depends(get_db)):
    return get_patient_prescriptions(patient_id, db)


@router.post("/{patient_id}", response_model=PrescriptionResponse, status_code=201)
def create_prescription_route(patient_id: int, body: PrescriptionCreate, db: Session = Depends(get_db)):
    return create_prescription(patient_id, body, db)


@router.put("/{prescription_id}", response_model=PrescriptionResponse)
def update_prescription_route(prescription_id: int, body: PrescriptionUpdate, db: Session = Depends(get_db)):
    return update_prescription(prescription_id, body, db)


@router.delete("/{prescription_id}", status_code=204)
def delete_prescription_route(prescription_id: int, db: Session = Depends(get_db)):
    delete_prescription(prescription_id, db)
