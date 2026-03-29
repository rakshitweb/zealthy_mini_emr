from sqlalchemy import Boolean, Column, Integer, Enum, Date, ForeignKey
from sqlalchemy.orm import relationship
from db.database import Base
from .appointments import RepeatInterval


class Prescription(Base):
    __tablename__ = "prescriptions"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    medication_id = Column(Integer, ForeignKey("medications.id"), nullable=False)
    dosage_id = Column(Integer, ForeignKey("dosages.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    refill_on = Column(Date, nullable=False)
    refill_schedule = Column(Enum(RepeatInterval), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    patient = relationship("Patient", back_populates="prescriptions")
    medication = relationship("Medication")
    dosage = relationship("Dosage")
