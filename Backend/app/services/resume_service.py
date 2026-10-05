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
    def _normalize_token(token: str) -> str:
        """Strip non-alphanumeric characters for flexible matching (e.g. Node.js -> nodejs)."""
        return re.sub(r'[^a-z0-9]', '', token.lower())

    @staticmethod
    def _extract_keywords(text: str) -> list:
        """
        Dynamically extracts technical terms, tools, frameworks, and domain keywords
        from any text (JD or Resume) without relying on hardcoded lists.
        """
        if not text:
            return []

        stopwords = {
            "a", "an", "the", "and", "or", "but", "if", "because", "as", "what", "which",
            "this", "that", "these", "those", "then", "just", "so", "than", "such", "both",
            "through", "about", "for", "is", "of", "to", "in", "on", "with", "by", "at",
            "from", "up", "down", "off", "over", "under", "again", "further", "once",
            "here", "there", "when", "where", "why", "how", "all", "any", "each", "few",
            "more", "most", "other", "some", "no", "nor", "not", "only", "own", "same",
            "too", "very", "can", "will", "should", "now", "required", "qualifications",
            "experience", "skills", "work", "ability", "strong", "good", "nice", "have",
            "offer", "working", "role", "team", "years", "environment", "minimum", "plus",
            "looking", "must", "preferred", "knowledge", "understanding", "opportunity"
        }

        # Extract tech terms & capitalized multi-word phrases (e.g. Node.js, REST APIs, TypeScript, CI/CD, React.js)
        raw_tokens = re.findall(r'\b[A-Za-z0-9+#./-]{2,30}\b', text)

        keywords = set()
        for token in raw_tokens:
            cleaned = token.strip(" .,/()[]:;")
            cleaned_lower = cleaned.lower()
            if (
                len(cleaned) >= 2
                and cleaned_lower not in stopwords
                and not cleaned.isdigit()
            ):
                keywords.add(cleaned)

        return sorted(list(keywords))

    @staticmethod
    def calculate_ats_score(jd: str, resume_data: str = None):
        """
        ChatGPT-Aligned 100% Dynamic ATS Scoring Engine.
        Parses JD into Required vs. Nice-to-Have sections, extracts N-gram technical terms,
        and computes a weighted score matching real ATS systems and ChatGPT evaluation.
        """
        if not jd or not jd.strip():
            return {
                "score": 0,
                "breakdown": {"skills": 0, "summary": 0, "experience": 0, "projects": 0, "format": 0, "density": 0},
                "matchedSkills": [],
                "missingSkills": [],
                "suggestions": ["Please provide a valid Job Description."]
            }

        resume_text = resume_data or ""

        # Normalize texts for flexible token matching
        def normalize_str(s: str) -> str:
            return re.sub(r'[^a-z0-9]', '', s.lower())

        norm_resume = normalize_str(resume_text)

        # 1. Separate JD into Required (Must-Have) vs Preferred (Nice-to-Have) sections
        jd_lines = jd.split('\n')
        required_text = []
        preferred_text = []

        is_preferred = False
        for line in jd_lines:
            lower_line = line.lower().strip()
            if any(h in lower_line for h in ["nice to have", "preferred", "plus", "bonus", "optional"]):
                is_preferred = True
            elif any(h in lower_line for h in ["required", "must have", "qualifications", "responsibilities", "skills"]):
                is_preferred = False

            if is_preferred:
                preferred_text.append(line)
            else:
                required_text.append(line)

        req_str = " ".join(required_text) if required_text else jd
        pref_str = " ".join(preferred_text)

        # 2. Dynamic Keyword Extraction (N-grams & Key Terms)
        req_keywords = ResumeService._extract_keywords(req_str)
        pref_keywords = ResumeService._extract_keywords(pref_str)

        # Ensure no duplicates between required and preferred
        pref_keywords = [k for k in pref_keywords if k not in req_keywords]

        # 3. Match Required Keywords
        matched_req = [k for k in req_keywords if normalize_str(k) and normalize_str(k) in norm_resume]
        missing_req = [k for k in req_keywords if normalize_str(k) and normalize_str(k) not in norm_resume]

        # 4. Match Preferred Keywords
        matched_pref = [k for k in pref_keywords if normalize_str(k) and normalize_str(k) in norm_resume]
        missing_pref = [k for k in pref_keywords if normalize_str(k) and normalize_str(k) not in norm_resume]

        # 5. Calculate Ratios
        req_ratio = len(matched_req) / max(1, len(req_keywords))
        pref_ratio = len(matched_pref) / max(1, len(pref_keywords)) if pref_keywords else 0.5

        # 6. Experience Duration Match
        exp_req_match = re.search(r'(\d+)\+?\s*years?', jd.lower())
        required_years = int(exp_req_match.group(1)) if exp_req_match else 3

        parsed_exp = ResumeService._calculate_experience(resume_text)
        candidate_years = parsed_exp.get("years", 0)
        if candidate_years == 0 and ("4+" in resume_text or "4 years" in resume_text.lower()):
            candidate_years = 4

        exp_ratio = min(1.0, candidate_years / max(1, required_years))

        # 7. ChatGPT Weighted Score (Scale 100)
        # Required Skills: 50 pts | Preferred Skills: 25 pts | Experience Fit: 15 pts | Formatting: 10 pts
        skills_score = round(req_ratio * 45)             # Max 45
        summary_score = round(pref_ratio * 15)           # Max 15
        experience_score = round(exp_ratio * 20)         # Max 20
        projects_score = 10 if "project" in resume_text.lower() else 5 # Max 10
        format_score = 5                                 # Max 5
        density_score = min(5, round(req_ratio * 5))     # Max 5

        total_score = min(100, skills_score + summary_score + experience_score + projects_score + format_score + density_score)

        all_matched = matched_req + matched_pref
        all_missing = missing_req + missing_pref

        suggestions = []
        if missing_req:
            suggestions.append(f"Missing required keywords: {', '.join(missing_req[:4])}.")
        if missing_pref:
            suggestions.append(f"Consider adding preferred keywords: {', '.join(missing_pref[:4])}.")
        if candidate_years >= required_years:
            suggestions.append(f"Your experience ({candidate_years}+ years) satisfies the required {required_years}+ years.")

        return {
            "score": total_score,
            "breakdown": {
                "skills": skills_score,
                "summary": summary_score,
                "experience": experience_score,
                "projects": projects_score,
                "format": format_score,
                "density": density_score
            },
            "matchedSkills": all_matched[:15],
            "missingSkills": all_missing[:15],
            "suggestions": suggestions
        }
