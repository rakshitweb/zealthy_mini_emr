from datetime import datetime, date
from config.logger import setup_logger, get_logger
from db.database import SessionLocal, engine, Base
from db.models.patients import Patient
from db.models.appointments import Appointment, RepeatInterval
from db.models.medications import Medication
from db.models.dosages import Dosage
from db.models.prescriptions import Prescription

setup_logger()
logger = get_logger(__name__)

Base.metadata.create_all(bind=engine)

patients = [
    Patient(name="Alice Johnson", email="alice.johnson@example.com", password="alice"),
    Patient(name="Bob Smith", email="bob.smith@example.com", password="bob"),
    Patient(name="Carol White", email="carol.white@example.com", password="carlo"),
    Patient(name="David Brown", email="david.brown@example.com", password="david"),
    Patient(name="Eva Martinez", email="eva.martinez@example.com", password="eva"),
]

appointments_data = [
    {
        "email": "alice.johnson@example.com",
        "provider": "Dr. Smith",
        "datetime": datetime(2026, 4, 1, 9, 0),
        "repeat": RepeatInterval.weekly,
    },
    {
        "email": "alice.johnson@example.com",
        "provider": "Dr. Adams",
        "datetime": datetime(2026, 4, 15, 10, 30),
        "repeat": RepeatInterval.monthly,
    },
    {
        "email": "bob.smith@example.com",
        "provider": "Dr. Lee",
        "datetime": datetime(2026, 4, 3, 14, 0),
        "repeat": RepeatInterval.daily,
    },
    {
        "email": "carol.white@example.com",
        "provider": "Dr. Patel",
        "datetime": datetime(2026, 4, 7, 11, 0),
        "repeat": RepeatInterval.weekly,
    },
    {
        "email": "david.brown@example.com",
        "provider": "Dr. Smith",
        "datetime": datetime(2026, 4, 10, 8, 0),
        "repeat": RepeatInterval.monthly,
    },
    {
        "email": "eva.martinez@example.com",
        "provider": "Dr. Lee",
        "datetime": datetime(2026, 4, 20, 15, 0),
        "repeat": RepeatInterval.weekly,
    },
]

medication_names = [
    "Diovan",
    "Lexapro",
    "Metformin",
    "Ozempic",
    "Prozac",
    "Seroquel",
    "Tegretol",
]
dosage_values = [
    "1mg",
    "2mg",
    "3mg",
    "5mg",
    "10mg",
    "25mg",
    "50mg",
    "100mg",
    "250mg",
    "500mg",
    "1000mg",
]

prescriptions_data = [
    {
        "email": "alice.johnson@example.com",
        "medication": "Metformin",
        "dosage": "500mg",
        "quantity": 2,
        "refill_on": date(2026, 4, 15),
        "refill_schedule": "monthly",
    },
    {
        "email": "alice.johnson@example.com",
        "medication": "Diovan",
        "dosage": "100mg",
        "quantity": 1,
        "refill_on": date(2026, 4, 25),
        "refill_schedule": "monthly",
    },
    {
        "email": "bob.smith@example.com",
        "medication": "Lexapro",
        "dosage": "10mg",
        "quantity": 1,
        "refill_on": date(2026, 4, 10),
        "refill_schedule": "monthly",
    },
    {
        "email": "carol.white@example.com",
        "medication": "Prozac",
        "dosage": "25mg",
        "quantity": 2,
        "refill_on": date(2026, 4, 5),
        "refill_schedule": "monthly",
    },
    {
        "email": "david.brown@example.com",
        "medication": "Ozempic",
        "dosage": "1mg",
        "quantity": 1,
        "refill_on": date(2026, 4, 20),
        "refill_schedule": "monthly",
    },
    {
        "email": "eva.martinez@example.com",
        "medication": "Seroquel",
        "dosage": "50mg",
        "quantity": 3,
        "refill_on": date(2026, 4, 12),
        "refill_schedule": "monthly",
    },
]

db = SessionLocal()

try:
    for patient in patients:
        exists = db.query(Patient).filter(Patient.email == patient.email).first()
        if not exists:
            db.add(patient)
    db.commit()
    logger.info(f"Seeded {len(patients)} patients successfully.")

    for appt in appointments_data:
        patient = db.query(Patient).filter(Patient.email == appt["email"]).first()
        if patient:
            db.add(
                Appointment(
                    patient_id=patient.id,
                    provider=appt["provider"],
                    datetime=appt["datetime"],
                    repeat=appt["repeat"],
                )
            )
    db.commit()
    logger.info(f"Seeded {len(appointments_data)} appointments successfully.")
    for name in medication_names:
        if not db.query(Medication).filter(Medication.name == name).first():
            db.add(Medication(name=name))
    db.commit()
    logger.info(f"Seeded {len(medication_names)} medications successfully.")

    for value in dosage_values:
        if not db.query(Dosage).filter(Dosage.value == value).first():
            db.add(Dosage(value=value))
    db.commit()
    logger.info(f"Seeded {len(dosage_values)} dosages successfully.")

    for rx in prescriptions_data:
        patient = db.query(Patient).filter(Patient.email == rx["email"]).first()
        medication = (
            db.query(Medication).filter(Medication.name == rx["medication"]).first()
        )
        dosage = db.query(Dosage).filter(Dosage.value == rx["dosage"]).first()
        if patient and medication and dosage:
            db.add(
                Prescription(
                    patient_id=patient.id,
                    medication_id=medication.id,
                    dosage_id=dosage.id,
                    quantity=rx["quantity"],
                    refill_on=rx["refill_on"],
                    refill_schedule=rx["refill_schedule"],
                )
            )
    db.commit()
    logger.info(f"Seeded {len(prescriptions_data)} prescriptions successfully.")
except Exception as e:
    db.rollback()
    logger.error(f"Seeding failed: {e}")
finally:
    db.close()
