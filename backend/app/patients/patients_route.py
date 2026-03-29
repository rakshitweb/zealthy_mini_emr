from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.patients.patients_controller import create_patient, update_patient, get_patient, get_patients
from db.database import get_db
from db.schemas.patients import PatientCreate, PatientUpdate, PatientResponse, PaginatedPatientsResponse

router = APIRouter(prefix="/patients", tags=["patients"])


@router.get("", response_model=PaginatedPatientsResponse)
def get_patients_route(
    page: int = Query(1, ge=1),
    page_size: int = Query(15, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return get_patients(page, page_size, db)


@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient_route(patient_id: int, day_interval: int = Query(None), db: Session = Depends(get_db)):
    return get_patient(patient_id, db, day_interval)


@router.post("", response_model=PatientResponse, status_code=201)
def create_patient_route(body: PatientCreate, db: Session = Depends(get_db)):
    return create_patient(body, db)


@router.put("/{patient_id}", response_model=PatientResponse)
def update_patient_route(patient_id: int, body: PatientUpdate, db: Session = Depends(get_db)):
    return update_patient(patient_id, body, db)
