from datetime import datetime, timedelta, timezone
from fastapi import HTTPException
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from config.Config import config
from config.logger import get_logger
from db.models.patients import Patient

logger = get_logger(__name__)

def create_access_token(data: dict) -> str:
    payload = {
        "data": data,
        "exp": datetime.now(timezone.utc) + timedelta(hours=config.JWT_EXPIRE_HOURS),
    }
    return jwt.encode(payload, config.JWT_SECRET, algorithm=config.JWT_ALGORITHM)


def login(email: str, password: str, db: Session) -> dict:
    logger.info(f"Login attempt for email={email}")
    patient = db.query(Patient).filter(Patient.email == email).first()
    if not patient or patient.password != password:
        logger.warning(f"Failed login for email={email}")
        raise HTTPException(status_code=401, detail="Invalid email or password. Please try again.")
    token = create_access_token({"email": patient.email})
    logger.info(f"Login successful for patient id={patient.id}")
    return {"access_token": token, "token_type": "Bearer"}


def get_current_patient(token: str, db: Session) -> Patient:
    try:
        payload = jwt.decode(token, config.JWT_SECRET, algorithms=[config.JWT_ALGORITHM])
        email = payload["data"]["email"]
    except (JWTError, KeyError, ValueError):
        raise HTTPException(status_code=401, detail="Invalid or expired token. Please login again.")
    patient = db.query(Patient).filter(Patient.email == email).first()
    if not patient:
        raise HTTPException(status_code=401, detail="Patient not found")
    return patient
