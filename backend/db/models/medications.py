from sqlalchemy import Column, Integer, String

from db.database import Base


class Medication(Base):
    __tablename__ = "medications"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
