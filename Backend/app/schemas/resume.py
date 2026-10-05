"""
Resume Pydantic schemas.
Defines data transfer objects (DTOs) for request validation and response serialization.
"""

from pydantic import BaseModel, ConfigDict
from typing import Optional, Any

class ResumeBase(BaseModel):
    resume_data: Any
    candidate_name: Optional[str] = None

class ResumeCreate(ResumeBase):
    pass

class ResumeUpdate(ResumeBase):
    pass

class ResumeInDBBase(ResumeBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)

class Resume(ResumeInDBBase):
    pass
