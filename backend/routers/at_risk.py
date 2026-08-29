# routers/at_risk.py
# Faculty Early-Warning At-Risk Student Engine
# GET /api/faculty/at-risk-students

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from database.db import get_db
from models.user import User, StudentSkill, MockInterview
from routers.auth import get_current_user, require_roles

router = APIRouter(prefix="/api/faculty", tags=["Faculty At-Risk Engine"])


class AtRiskStudentOut(BaseModel):
    student_id: int
    name: str
    roll_number: Optional[str]
    department: Optional[str]
    year: Optional[int]
    attendance: float
    gpa: float
    arrears: int
    risk_level: str          # LOW, MEDIUM, HIGH, CRITICAL
    risk_badge_color: str
    reasons: List[str]
    recommended_action: str


@router.get("/at-risk-students", response_model=List[AtRiskStudentOut])
def get_at_risk_students(
    db: Session = Depends(get_db),
    _user: User = Depends(require_roles(["faculty", "admin", "tpo", "staff"])),
):
    """
    Early Warning Engine: Analyzes student attendance, GPA, backlogs, and mock interview performance.
    Flags students into LOW, MEDIUM, HIGH, or CRITICAL risk tiers with targeted intervention recommendations.
    """
    students = db.query(User).filter(User.role == "student").all()
    results = []

    for s in students:
        att = s.attendance if s.attendance is not None else 80.0
        gpa = s.gpa if s.gpa is not None else 7.0
        arr = s.arrears or 0

        reasons = []
        risk_score = 0  # Accumulator

        if att < 65.0:
            reasons.append(f"Critical low attendance ({att:.1f}%)")
            risk_score += 40
        elif att < 75.0:
            reasons.append(f"Attendance warning ({att:.1f}%)")
            risk_score += 20

        if gpa < 5.5:
            reasons.append(f"Low GPA academic performance ({gpa:.2f})")
            risk_score += 35
        elif gpa < 6.5:
            reasons.append(f"Moderate GPA ({gpa:.2f}) below tier-1 placement cutoff")
            risk_score += 15

        if arr >= 2:
            reasons.append(f"Multiple active backlogs ({arr})")
            risk_score += 35
        elif arr == 1:
            reasons.append("1 active backlog subject")
            risk_score += 15

        # Check last mock interview score if available
        last_mi = db.query(MockInterview).filter(MockInterview.student_id == s.id).order_by(MockInterview.created_at.desc()).first()
        if last_mi and last_mi.overall_score and last_mi.overall_score < 60.0:
            reasons.append(f"Low AI Mock Interview score ({last_mi.overall_score:.1f}/100)")
            risk_score += 15

        if risk_score >= 60:
            level = "CRITICAL"
            color = "#ef4444" # red
            action = "Mandatory academic counseling, remedial DSA classes, and attendance monitoring."
        elif risk_score >= 35:
            level = "HIGH"
            color = "#f97316" # orange
            action = "Assign faculty mentor, mandatory mock interview practice session."
        elif risk_score >= 15:
            level = "MEDIUM"
            color = "#f59e0b" # amber
            action = "Recommend skill upgrade modules and weekly attendance check."
        else:
            level = "LOW"
            color = "#10b981" # green
            action = "On track. Encourage tier-1 job drive applications."

        results.append(AtRiskStudentOut(
            student_id=s.id,
            name=s.name,
            roll_number=s.roll_number,
            department=s.department,
            year=s.year,
            attendance=att,
            gpa=gpa,
            arrears=arr,
            risk_level=level,
            risk_badge_color=color,
            reasons=reasons if reasons else ["No academic or placement risk factors detected."],
            recommended_action=action
        ))

    # Sort critical & high risk to top
    risk_order = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3}
    results.sort(key=lambda x: risk_order[x.risk_level])

    return results
