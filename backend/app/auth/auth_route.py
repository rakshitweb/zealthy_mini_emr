from fastapi import APIRouter, Depends, Header
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.auth.auth_controller import login, get_current_patient
from db.database import get_db
from db.schemas.patients import PatientResponse

router = APIRouter(prefix="/auth", tags=["auth"])


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


@router.post("/login", response_model=TokenResponse)
def login_route(body: LoginRequest, db: Session = Depends(get_db)):
    return login(body.email, body.password, db)


@router.get("/info", response_model=PatientResponse)
def me_route(
    authorization: str = Header(..., description="Bearer <token>"),
    db: Session = Depends(get_db),
):
    if not authorization.startswith("Bearer "):
        from fastapi import HTTPException
        raise HTTPException(status_code=401, detail="Invalid authorization details")
    token = authorization.removeprefix("Bearer ")
    return get_current_patient(token, db)
