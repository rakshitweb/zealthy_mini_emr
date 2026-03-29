import enum
from sqlalchemy import Boolean, Column, Integer, String, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from db.database import Base


class RepeatInterval(str, enum.Enum):
    daily = "daily"
    weekly = "weekly"
    monthly = "monthly"


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    provider = Column(String, nullable=False)
    datetime = Column(DateTime, nullable=False)
    repeat = Column(Enum(RepeatInterval), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    patient = relationship("Patient", back_populates="appointments")
