"""
Master API router.
Consolidates all sub-routers (e.g., resume, users, auth) into a single API router.
"""

from fastapi import APIRouter
from app.api.routes import resume

api_router = APIRouter()
api_router.include_router(resume.router)
