from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker, declarative_base
from config.Config import config

DATABASE_URL = config.DATABASE_URL

engine = create_engine(DATABASE_URL, echo=config.DB_ECHO)

SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()

def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
