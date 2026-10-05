"""
Application configuration settings.
Uses Pydantic BaseSettings to securely load and validate environment variables.
"""

import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Resume ATS API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://postgres:postgres@localhost:5432/resumedb"
    )

    class Config:
        case_sensitive = True

settings = Settings()
