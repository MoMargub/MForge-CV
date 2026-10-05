"""
Resume business logic.
Encapsulates complex operations like PDF parsing and ATS scoring, keeping route handlers lean.
"""

import io
import re
from datetime import datetime
from dateutil import parser as date_parser
import pdfplumber


class ResumeService:

    @staticmethod
    def _extract_text_from_pdf(file_bytes: bytes) -> str:
        """Extract raw text from PDF bytes using pdfplumber."""
        text = ""
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text(x_tolerance=2, y_tolerance=2)
                if extracted:
                    text += extracted + "\n"
        return text

    @staticmethod
    def _calculate_experience(text: str) -> dict:
        """
        Parse all date ranges from resume text and compute total experience.
        Handles formats:
          - Jan 2020 - Present
          - January 2020 to Mar 2022
          - 01/2018 - 05/2021
          - 2018 - 2021 (year only)
        Merges overlapping intervals to avoid double-counting.
        """
        date_token = (
            r'(?:'
            r'(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|'
            r'Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)'
            r'[\s,./\-]*\d{4}'
            r'|\d{1,2}[/\-]\d{4}'
            r'|\d{4}'
            r')'
        )
        separator = r'\s*(?:\u2013|\u2014|-|to)\s*'
        end_token = r'(?:' + date_token + r'|Present|Current|Now)'
        pattern = f'({date_token}){separator}({end_token})'

        matches = re.findall(pattern, text, re.IGNORECASE)

        intervals = []
        raw_ranges = []

        for start_str, end_str in matches:
            try:
                start_clean = re.sub(r'([A-Za-z])(\d)', r'\1 \2', start_str.strip())
                end_clean = end_str.strip()

                start_date = date_parser.parse(start_clean, default=datetime(2000, 1, 1))

                if re.match(r'^(Present|Current|Now)$', end_clean, re.IGNORECASE):
                    end_date = datetime.now()
                else:
                    end_clean = re.sub(r'([A-Za-z])(\d)', r'\1 \2', end_clean)
                    end_date = date_parser.parse(end_clean, default=datetime(2000, 12, 1))

                if start_date < end_date and start_date.year >= 1990:
                    intervals.append((start_date, end_date))
                    raw_ranges.append(f"{start_str.strip()} -> {end_str.strip()}")

            except Exception:
                continue

        # Sort and merge overlapping intervals (avoids double-counting parallel roles)
        intervals.sort(key=lambda x: x[0])
        merged = []
        for start, end in intervals:
            if merged and start <= merged[-1][1]:
                merged[-1] = (merged[-1][0], max(merged[-1][1], end))
            else:
                merged.append([start, end])

        total_months = sum(
            (end.year - start.year) * 12 + (end.month - start.month)
            for start, end in merged
        )

        years = total_months // 12
        months = total_months % 12

        return {
            "years": years,
            "months": months,
            "totalMonths": total_months,
            "rangesFound": raw_ranges
        }

    @staticmethod
    def process_uploaded_resume(filename: str, file_bytes: bytes):
        """Main entry point: extract text, parse all fields, return structured data."""
        if not filename.lower().endswith('.pdf'):
            return {"error": "Only PDF files are supported at this time."}

        text = ResumeService._extract_text_from_pdf(file_bytes)

        if not text.strip():
            return {"error": "Could not extract text from PDF. It may be a scanned/image-based PDF."}

        # Name: first non-empty line heuristic
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        name = lines[0] if lines else "Unknown Candidate"

        # Email
        email_match = re.search(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', text)
        email = email_match.group(0) if email_match else "Not found"

        # Phone (supports international formats like +91 98765 43210)
        phone_match = re.search(
            r'(?:\+?\d{1,3}[\s\-.]?)?\(?\d{2,4}\)?[\s\-.]?\d{3,4}[\s\-.]?\d{4}', text
        )
        phone = phone_match.group(0).strip() if phone_match else "Not found"

        # Experience
        experience = ResumeService._calculate_experience(text)

        # Skills
        common_skills = [
            'python', 'javascript', 'react', 'node', 'typescript', 'java', 'c++',
            'aws', 'docker', 'sql', 'html', 'css', 'git', 'fastapi', 'django',
            'flutter', 'dart', 'kotlin', 'swift', 'mongodb', 'postgresql', 'redis',
            'graphql', 'rest', 'linux', 'azure', 'gcp', 'kubernetes', 'firebase'
        ]
        found_skills = [
            skill for skill in common_skills
            if re.search(r'\b' + re.escape(skill) + r'\b', text.lower())
        ]

        return {
            "name": name,
            "email": email,
            "phone": phone,
            "skillCount": len(found_skills),
            "skills": found_skills,
            "experience": experience
        }

    @staticmethod
    def calculate_ats_score(jd: str, resume_data: str = None):
        """Dummy ATS scoring logic — to be replaced with real AI scoring."""
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
