from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from db.database import get_db
from db.models.medications import Medication
from db.models.dosages import Dosage
from db.schemas.medications import MedicationResponse, DosageResponse

router = APIRouter(tags=["medications"])


@router.get("/medications", response_model=List[MedicationResponse])
def get_medications(db: Session = Depends(get_db)):
    return db.query(Medication).all()


@router.get("/dosages", response_model=List[DosageResponse])
def get_dosages(db: Session = Depends(get_db)):
    return db.query(Dosage).all()
