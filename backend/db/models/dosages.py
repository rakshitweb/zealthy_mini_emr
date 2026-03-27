from sqlalchemy import Column, Integer, String

from db.database import Base


class Dosage(Base):
    __tablename__ = "dosages"

    id = Column(Integer, primary_key=True, index=True)
    value = Column(String, nullable=False, unique=True)
