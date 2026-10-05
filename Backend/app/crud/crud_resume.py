"""
Resume CRUD operations.
Extends the generic CRUDBase to provide specific database interactions for the Resume model.
"""

from app.crud.base import CRUDBase
from app.models.resume import Resume
from app.schemas.resume import ResumeCreate, ResumeUpdate

class CRUDResume(CRUDBase[Resume, ResumeCreate, ResumeUpdate]):
    pass

resume = CRUDResume(Resume)
