"""
FastAPI dependency providers.
Contains reusable dependencies such as database session management to be injected into routes.
"""

from typing import Generator
from app.db.database import SessionLocal

def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()
