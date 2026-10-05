"""
Resume API routes.
Defines HTTP endpoints for uploading, parsing, and scoring candidate resumes.
"""

from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.api.dependencies import get_db
from app.services.resume_service import ResumeService
from app import crud, schemas

router = APIRouter(prefix="/resume", tags=["resume"])

@router.post("/upload")
async def upload_resume(
    resumeFile: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    preview = ResumeService.process_uploaded_resume(resumeFile.filename)
    return {
        "status": "success",
        "message": f"File {resumeFile.filename} received and parsed.",
        "preview": preview
    }

@router.post("/score")
async def score_resume(
    jd: str = Form(...),
    resumeData: str = Form(None),
    db: Session = Depends(get_db)
):
    ats_result = ResumeService.calculate_ats_score(jd, resumeData)
    return {
        "status": "success",
        "ats": ats_result
    }
