"""
Resume SQLAlchemy model.
Defines the database schema for storing candidate resumes.
"""

from sqlalchemy import Column, Integer, String, JSON
from app.db.database import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    candidate_name = Column(String, index=True, nullable=True)
    resume_data = Column(JSON, nullable=False)
