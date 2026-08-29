# routers/skill_gap.py
# AI Skill Gap Engine & Personal Learning Roadmap
# POST /api/career/skill-gap

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Dict

from database.db import get_db
from models.user import User, StudentSkill
from routers.auth import get_current_user

router = APIRouter(prefix="/api/career", tags=["Skill Gap Engine"])

# Predefined role taxonomy with required skills & benchmark scores (0-100)
ROLE_BENCHMARKS: Dict[str, Dict[str, float]] = {
    "Java Developer": {
        "Java": 80,
        "OOP": 85,
        "DSA": 75,
        "SQL": 70,
        "REST API": 75,
        "Spring Boot": 70,
        "Git": 70,
    },
    "Software Developer": {
        "Python": 80,
        "DSA": 80,
        "SQL": 75,
        "REST API": 75,
        "System Design": 65,
        "Git": 75,
    },
    "Backend Developer": {
        "Node.js": 75,
        "Express": 75,
        "SQL": 80,
        "MongoDB": 70,
        "REST API": 85,
        "Docker": 65,
        "Git": 75,
    },
    "Frontend Developer": {
        "JavaScript": 85,
        "React": 80,
        "HTML/CSS": 85,
        "TypeScript": 70,
        "REST API": 75,
        "Git": 75,
    },
    "Full Stack Developer": {
        "JavaScript": 80,
        "React": 75,
        "Node.js": 75,
        "SQL": 75,
        "REST API": 80,
        "DSA": 70,
        "Git": 75,
    },
    "Data Analyst": {
        "Python": 80,
        "SQL": 85,
        "PowerBI / Tableau": 75,
        "Pandas": 80,
        "Statistics": 75,
        "Excel": 85,
    },
    "QA Automation Engineer": {
        "Java": 75,
        "Selenium": 80,
        "TestNG": 75,
        "REST API Testing": 75,
        "SQL": 70,
        "Git": 70,
    },
}


class SkillGapRequest(BaseModel):
    target_role: str


class SkillScoreDetail(BaseModel):
    skill_name: str
    required_score: float
    student_score: float
    gap: float
    status: str  # Matched, Weak, Missing


class RoadmapWeek(BaseModel):
    week: int
    focus_topic: str
    action_items: List[str]


class SkillGapResponse(BaseModel):
    target_role: str
    match_percentage: float
    matched_skills: List[SkillScoreDetail]
    critical_gaps: List[SkillScoreDetail]
    high_priority_gaps: List[SkillScoreDetail]
    medium_priority_gaps: List[SkillScoreDetail]
    learning_sequence: List[RoadmapWeek]


@router.post("/skill-gap", response_model=SkillGapResponse)
def evaluate_skill_gap(
    request: SkillGapRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    target_role = request.target_role.strip()
    if target_role not in ROLE_BENCHMARKS:
        # Default fallback benchmark if role not in predefined list
        benchmark = ROLE_BENCHMARKS["Software Developer"]
    else:
        benchmark = ROLE_BENCHMARKS[target_role]

    # Update user's target role preference in DB
    current_user.target_role = target_role
    db.commit()

    # Query current student skills
    db_skills = db.query(StudentSkill).filter(StudentSkill.student_id == current_user.id).all()
    skill_map = {s.skill_name.lower(): s.score for s in db_skills}

    matched = []
    critical_gaps = []
    high_priority = []
    medium_priority = []

    total_req_points = sum(benchmark.values())
    achieved_points = 0.0

    for req_skill, req_score in benchmark.items():
        stud_score = skill_map.get(req_skill.lower(), 0.0)
        gap = req_score - stud_score

        # Calculate achieved points capped at req_score
        achieved_points += min(stud_score, req_score)

        if gap <= 0:
            status_str = "Matched"
            detail = SkillScoreDetail(
                skill_name=req_skill,
                required_score=req_score,
                student_score=stud_score,
                gap=0.0,
                status=status_str
            )
            matched.append(detail)
        else:
            status_str = "Weak" if stud_score > 0 else "Missing"
            detail = SkillScoreDetail(
                skill_name=req_skill,
                required_score=req_score,
                student_score=stud_score,
                gap=round(gap, 1),
                status=status_str
            )
            if gap > 35:
                critical_gaps.append(detail)
            elif gap > 20:
                high_priority.append(detail)
            else:
                medium_priority.append(detail)

    match_pct = round((achieved_points / total_req_points) * 100, 1)

    # Generate 8-week personalized learning sequence
    all_gaps = critical_gaps + high_priority + medium_priority
    learning_sequence = []
    
    if all_gaps:
        gaps_to_cover = [g.skill_name for g in all_gaps]
    else:
        gaps_to_cover = ["Advanced System Design", "Production CI/CD & Cloud Deployment"]

    for w in range(1, 9):
        skill_index = (w - 1) % len(gaps_to_cover)
        target_topic = gaps_to_cover[skill_index]
        learning_sequence.append(RoadmapWeek(
            week=w,
            focus_topic=f"Mastering {target_topic} (Phase {((w-1)//len(gaps_to_cover)) + 1})",
            action_items=[
                f"Study core theory & concepts of {target_topic}",
                f"Complete 3 hands-on practical exercises/projects focused on {target_topic}",
                f"Take an AI Mock Interview module testing {target_topic} proficiency"
            ]
        ))

    return SkillGapResponse(
        target_role=target_role,
        match_percentage=match_pct,
        matched_skills=matched,
        critical_gaps=critical_gaps,
        high_priority_gaps=high_priority,
        medium_priority_gaps=medium_priority,
        learning_sequence=learning_sequence
    )

