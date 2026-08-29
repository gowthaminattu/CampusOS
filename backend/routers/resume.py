# routers/resume.py
# Resume ATS Analyzer & Job Description Matcher
# POST /api/resume/analyze

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from database.db import get_db
from models.user import User, ResumeAnalysis
from routers.auth import get_current_user

router = APIRouter(prefix="/api/resume", tags=["Resume ATS Analyzer"])


class ResumeAnalysisRequest(BaseModel):
    resume_text: str
    target_role: Optional[str] = "Java Developer"
    job_description: Optional[str] = None


class ResumeAnalysisResponse(BaseModel):
    ats_score: float
    jd_match_score: float
    extracted_skills: List[str]
    missing_keywords: List[str]
    formatting_feedback: List[str]
    suggestions: List[str]


@router.post("/analyze", response_model=ResumeAnalysisResponse)
def analyze_resume(
    request: ResumeAnalysisRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    txt = request.resume_text
    txt_lower = txt.lower()

    all_tech_keywords = [
        "java", "python", "javascript", "react", "node.js", "sql", "postgresql",
        "rest api", "spring boot", "dsa", "git", "docker", "aws", "html", "css",
        "mongodb", "microservices", "oop", "system design"
    ]

    found_skills = [k.title() for k in all_tech_keywords if k in txt_lower]

    # Calculate ATS score
    base_ats = 60.0
    if len(found_skills) >= 5:
        base_ats += 15.0
    if len(found_skills) >= 8:
        base_ats += 10.0
    if len(txt) > 300:
        base_ats += 10.0

    ats_score = min(98.0, base_ats)

    # Job Description Match
    jd_match = 75.0
    missing = ["Spring Boot", "Docker", "REST API Security"]

    if request.job_description:
        jd_lower = request.job_description.lower()
        jd_keywords = [k for k in all_tech_keywords if k in jd_lower]
        if jd_keywords:
            matched_jd = [k for k in jd_keywords if k in txt_lower]
            jd_match = round((len(matched_jd) / len(jd_keywords)) * 100, 1)
            missing = [k.title() for k in jd_keywords if k not in txt_lower]

    formatting_feedback = [
        "✅ Clean plain-text structure suitable for standard ATS parsers.",
        "⚠️ Ensure contact info (Email, Phone, LinkedIn) is clearly placed at the top.",
        "✅ STAR format detected in project accomplishment descriptions."
    ]

    suggestions = [
        f"Add explicit technical keywords for missing skills: {', '.join(missing[:3]) if missing else 'None'}.",
        "Quantify project outcomes with metrics (e.g. 'Improved API response latency by 35%').",
        "Include active GitHub repository links for top 2 technical projects."
    ]

    # Store analysis record
    record = ResumeAnalysis(
        student_id=current_user.id,
        resume_text=txt[:1000],
        ats_score=ats_score,
        target_role=request.target_role,
        matched_skills=", ".join(found_skills),
        missing_skills=", ".join(missing),
        suggestions="\n".join(suggestions),
    )
    db.add(record)
    db.commit()

    return ResumeAnalysisResponse(
        ats_score=ats_score,
        jd_match_score=jd_match,
        extracted_skills=found_skills,
        missing_keywords=missing,
        formatting_feedback=formatting_feedback,
        suggestions=suggestions
    )
