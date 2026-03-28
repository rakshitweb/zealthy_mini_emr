import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    PORT: int = int(os.getenv("PORT")) or 8080
    RELOAD: str = os.getenv("RELOAD", "false").lower() == "true"
    JWT_SECRET: str = os.getenv("JWT_SECRET")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_HOURS: int = 24
    DB_ECHO: bool = os.getenv("DB_ECHO", "false").lower() == "true"
    
config = Config()