"""
Resume business logic.
Encapsulates complex operations like PDF parsing and ATS scoring, keeping route handlers lean.
"""

class ResumeService:
    @staticmethod
    def process_uploaded_resume(filename: str):
        # Dummy implementation mirroring earlier logic
        return {
            "name": "Jane Doe",
            "email": "jane@example.com",
            "phone": "555-123-4567",
            "skillCount": 14,
            "experienceCount": 3
        }

    @staticmethod
    def calculate_ats_score(jd: str, resume_data: str = None):
        # Dummy scoring logic
        return {
            "score": 96,
            "breakdown": {
                "skills": 94,
                "summary": 90,
                "experience": 100,
                "projects": 95,
                "format": 100,
                "density": 88
            },
            "matchedSkills": ["React", "TypeScript", "Node.js"],
            "missingSkills": ["Docker", "Kubernetes"]
        }
