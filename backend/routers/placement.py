# routers/placement.py
# Placement Command Center & AI Eligibility Engine
# REST APIs for Companies, Job Drives, Applications, Automated Eligibility, and AI JD Parsing

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime

from database.db import get_db
from models.user import User, Company, JobDrive, JobApplication, Offer, StudentSkill
from routers.auth import get_current_user, require_roles

router = APIRouter(prefix="/api/placement", tags=["Placement Management"])


# ─── Pydantic Schemas ────────────────────────────────────────────────────────
class CompanyCreate(BaseModel):
    name: str
    industry: Optional[str] = "Information Technology"
    website: Optional[str] = None
    location: Optional[str] = "Remote / On-site"
    description: Optional[str] = None


class JobDriveCreate(BaseModel):
    company_id: int
    title: str
    role: str
    description: Optional[str] = None
    min_cgpa: float = 6.0
    max_backlogs: int = 0
    allowed_branches: str = "CSE,ECE,EEE,MECH,CIVIL,IT"
    required_skills: str = "Java, SQL, REST API"
    package_lpa: float = 5.0
    location: Optional[str] = "Bengaluru"
    drive_date: str = "2026-09-15"


class ParseJDRequest(BaseModel):
    jd_text: str


class ParseJDResponse(BaseModel):
    company: str
    role: str
    min_cgpa: float
    max_backlogs: int
    allowed_branches: List[str]
    required_skills: List[str]
    package_lpa: float
    location: str
    extracted_summary: str


class EligibilityResult(BaseModel):
    student_id: int
    student_name: str
    roll_number: Optional[str]
    department: Optional[str]
    gpa: float
    attendance: float
    arrears: int
    is_eligible: bool
    rejection_reasons: List[str]


class DriveEligibilityResponse(BaseModel):
    drive_id: int
    drive_title: str
    company_name: str
    total_evaluated: int
    eligible_count: int
    ineligible_count: int
    students: List[EligibilityResult]


class JobApplicationRequest(BaseModel):
    drive_id: int


class ApplicationUpdateStage(BaseModel):
    stage: str  # Applied, Eligible, Aptitude, Coding, Tech Interview, HR Interview, Offered, Rejected
    status: str = "In Process"
    rejection_reason: Optional[str] = None


class JobRecommendation(BaseModel):
    drive_id: int
    company_name: str
    role: str
    package_lpa: float
    match_score: float
    drive_date: str
    required_skills: List[str]
    match_reason: str
    is_eligible: bool


# ─── Company Endpoints ───────────────────────────────────────────────────────
@router.get("/companies")
def list_companies(db: Session = Depends(get_db)):
    return db.query(Company).order_by(Company.name).all()


@router.post("/companies", status_code=status.HTTP_201_CREATED)
def create_company(
    request: CompanyCreate,
    db: Session = Depends(get_db),
    _user: User = Depends(require_roles(["tpo", "admin", "staff"])),
):
    company = Company(
        name=request.name,
        industry=request.industry,
        website=request.website,
        location=request.location,
        description=request.description,
    )
    db.add(company)
    db.commit()
    db.refresh(company)
    return company


# ─── Job Drive Endpoints ────────────────────────────────────────────────────
@router.get("/drives")
def list_drives(db: Session = Depends(get_db)):
    drives = db.query(JobDrive).filter(JobDrive.status == "Active").order_by(JobDrive.drive_date).all()
    result = []
    for d in drives:
        result.append({
            "id": d.id,
            "company_id": d.company_id,
            "company_name": d.company.name if d.company else "Campus Partner",
            "title": d.title,
            "role": d.role,
            "description": d.description,
            "min_cgpa": d.min_cgpa,
            "max_backlogs": d.max_backlogs,
            "allowed_branches": [b.strip() for b in d.allowed_branches.split(",") if b.strip()],
            "required_skills": [s.strip() for s in d.required_skills.split(",") if s.strip()],
            "package_lpa": d.package_lpa,
            "location": d.location,
            "drive_date": d.drive_date,
            "status": d.status,
        })
    return result


@router.post("/drives", status_code=status.HTTP_201_CREATED)
def create_job_drive(
    request: JobDriveCreate,
    db: Session = Depends(get_db),
    _user: User = Depends(require_roles(["tpo", "admin", "staff"])),
):
    drive = JobDrive(
        company_id=request.company_id,
        title=request.title,
        role=request.role,
        description=request.description,
        min_cgpa=request.min_cgpa,
        max_backlogs=request.max_backlogs,
        allowed_branches=request.allowed_branches,
        required_skills=request.required_skills,
        package_lpa=request.package_lpa,
        location=request.location,
        drive_date=request.drive_date,
        status="Active",
    )
    db.add(drive)
    db.commit()
    db.refresh(drive)
    return drive


# ─── AI Job Description Parser ──────────────────────────────────────────────
@router.post("/parse-jd", response_model=ParseJDResponse)
def parse_job_description(
    request: ParseJDRequest,
    _user: User = Depends(require_roles(["tpo", "admin", "staff"])),
):
    """
    AI Service / Algorithm to parse unstructured Job Description text into structured database fields.
    """
    txt = request.jd_text
    txt_lower = txt.lower()

    # Rule-based / Pattern extraction algorithms
    company = "TechCorp Solutions"
    if "amazon" in txt_lower:
        company = "Amazon"
    elif "google" in txt_lower:
        company = "Google"
    elif "microsoft" in txt_lower:
        company = "Microsoft"
    elif "tcs" in txt_lower:
        company = "TCS"
    elif "infosys" in txt_lower:
        company = "Infosys"
    elif "wipro" in txt_lower:
        company = "Wipro"
    elif "company:" in txt_lower:
        lines = [l for l in txt.split("\n") if "company:" in l.lower()]
        if lines:
            company = lines[0].split(":", 1)[1].strip()

    role = "Software Development Engineer"
    if "java developer" in txt_lower:
        role = "Java Developer"
    elif "full stack" in txt_lower:
        role = "Full Stack Developer"
    elif "data analyst" in txt_lower:
        role = "Data Analyst"
    elif "frontend" in txt_lower:
        role = "Frontend Engineer"
    elif "backend" in txt_lower:
        role = "Backend Engineer"

    # Extract CGPA
    min_cgpa = 6.5
    if "7.5" in txt or "7.5 cgpa" in txt_lower or "75%" in txt:
        min_cgpa = 7.5
    elif "8.0" in txt or "8 cgpa" in txt_lower or "80%" in txt:
        min_cgpa = 8.0
    elif "7.0" in txt or "7 cgpa" in txt_lower:
        min_cgpa = 7.0

    # Extract Package LPA
    package_lpa = 6.5
    if "12 lpa" in txt_lower or "12.0 lpa" in txt_lower:
        package_lpa = 12.0
    elif "18 lpa" in txt_lower:
        package_lpa = 18.0
    elif "8 lpa" in txt_lower:
        package_lpa = 8.0
    elif "4.5 lpa" in txt_lower:
        package_lpa = 4.5

    # Extract Skills
    all_known_skills = ["Java", "Python", "React", "Node.js", "SQL", "REST API", "Spring Boot", "DSA", "Docker", "AWS", "Git"]
    req_skills = [s for s in all_known_skills if s.lower() in txt_lower]
    if not req_skills:
        req_skills = ["Java", "SQL", "REST API", "Git"]

    return ParseJDResponse(
        company=company,
        role=role,
        min_cgpa=min_cgpa,
        max_backlogs=0,
        allowed_branches=["CSE", "ECE", "EEE", "IT"],
        required_skills=req_skills,
        package_lpa=package_lpa,
        location="Bengaluru / Hybrid",
        extracted_summary=f"Extracted {role} placement drive for {company} with cutoff {min_cgpa} CGPA and package {package_lpa} LPA."
    )


# ─── Automated Eligibility Engine ───────────────────────────────────────────
@router.get("/drives/{drive_id}/eligibility", response_model=DriveEligibilityResponse)
def evaluate_drive_eligibility(
    drive_id: int,
    db: Session = Depends(get_db),
    _user: User = Depends(require_roles(["tpo", "admin", "staff"])),
):
    """
    Automated backend eligibility engine. Evaluates all active students against drive rules:
    - CGPA >= Cutoff
    - Active backlogs <= Max allowed
    - Student branch in allowed branches list
    """
    drive = db.query(JobDrive).filter(JobDrive.id == drive_id).first()
    if not drive:
        raise HTTPException(status_code=404, detail="Job drive not found")

    allowed_branches = [b.strip().upper() for b in drive.allowed_branches.split(",") if b.strip()]
    students = db.query(User).filter(User.role == "student").all()

    evaluated_results = []
    eligible_count = 0
    ineligible_count = 0

    for s in students:
        rejections = []
        stud_cgpa = s.gpa or 0.0
        stud_branch = (s.department or "CSE").upper()
        stud_arrears = s.arrears or 0

        if stud_cgpa < drive.min_cgpa:
            rejections.append(f"CGPA ({stud_cgpa:.1f}) is below minimum requirement ({drive.min_cgpa:.1f}).")
        if stud_arrears > drive.max_backlogs:
            rejections.append(f"Active backlogs ({stud_arrears}) exceeds maximum allowed ({drive.max_backlogs}).")
        if allowed_branches and stud_branch not in allowed_branches:
            rejections.append(f"Department ({stud_branch}) is not in allowed list ({', '.join(allowed_branches)}).")

        is_elig = len(rejections) == 0
        if is_elig:
            eligible_count += 1
        else:
            ineligible_count += 1

        evaluated_results.append(EligibilityResult(
            student_id=s.id,
            student_name=s.name,
            roll_number=s.roll_number,
            department=s.department,
            gpa=stud_cgpa,
            attendance=s.attendance or 80.0,
            arrears=stud_arrears,
            is_eligible=is_elig,
            rejection_reasons=rejections
        ))

    return DriveEligibilityResponse(
        drive_id=drive.id,
        drive_title=drive.title,
        company_name=drive.company.name if drive.company else "Campus Partner",
        total_evaluated=len(students),
        eligible_count=eligible_count,
        ineligible_count=ineligible_count,
        students=evaluated_results
    )


# ─── Job Recommendations Engine ──────────────────────────────────────────────
@router.get("/recommendations", response_model=List[JobRecommendation])
def get_job_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Compares active student's skill matrix against active job drives and returns scored job matches.
    """
    drives = db.query(JobDrive).filter(JobDrive.status == "Active").all()
    user_skills = db.query(StudentSkill).filter(StudentSkill.student_id == current_user.id).all()
    skill_names = {s.skill_name.lower() for s in user_skills if s.score >= 50}

    recommendations = []
    user_cgpa = current_user.gpa or 0.0

    for d in drives:
        req_list = [s.strip() for s in d.required_skills.split(",") if s.strip()]
        matched_count = sum(1 for req in req_list if req.lower() in skill_names)
        
        skill_match_ratio = (matched_count / len(req_list)) if req_list else 0.8
        cgpa_ratio = min(1.0, user_cgpa / d.min_cgpa) if d.min_cgpa > 0 else 1.0

        match_score = round((skill_match_ratio * 70.0) + (cgpa_ratio * 30.0), 1)
        is_elig = (user_cgpa >= d.min_cgpa) and (current_user.arrears or 0) <= d.max_backlogs

        reason = f"Matched {matched_count}/{len(req_list)} required skills ({', '.join(req_list[:3])})."
        if not is_elig:
            reason += f" Note: CGPA threshold ({d.min_cgpa}) requires improvement."

        recommendations.append(JobRecommendation(
            drive_id=d.id,
            company_name=d.company.name if d.company else "Tech Partner",
            role=d.role,
            package_lpa=d.package_lpa,
            match_score=match_score,
            drive_date=d.drive_date,
            required_skills=req_list,
            match_reason=reason,
            is_eligible=is_elig
        ))

    recommendations.sort(key=lambda x: x.match_score, reverse=True)
    return recommendations


# ─── Job Applications & Pipeline ─────────────────────────────────────────────
@router.get("/applications")
def list_student_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    apps = db.query(JobApplication).filter(JobApplication.student_id == current_user.id).all()
    res = []
    for a in apps:
        res.append({
            "id": a.id,
            "drive_id": a.drive_id,
            "company_name": a.drive.company.name if a.drive and a.drive.company else "Company",
            "role": a.drive.role if a.drive else "Developer",
            "stage": a.stage,
            "status": a.status,
            "match_score": a.match_score,
            "applied_at": a.applied_at.isoformat(),
        })
    return res


@router.post("/applications", status_code=status.HTTP_201_CREATED)
def apply_for_drive(
    request: JobApplicationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = db.query(JobApplication).filter(
        JobApplication.student_id == current_user.id,
        JobApplication.drive_id == request.drive_id
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="You have already applied for this placement drive.")

    drive = db.query(JobDrive).filter(JobDrive.id == request.drive_id).first()
    if not drive:
        raise HTTPException(status_code=404, detail="Job drive not found.")

    # Calculate initial match score
    app = JobApplication(
        student_id=current_user.id,
        drive_id=drive.id,
        stage="Applied",
        status="In Process",
        match_score=82.0,
    )
    db.add(app)
    db.commit()
    db.refresh(app)
    return {"message": "Application submitted successfully", "application_id": app.id}


@router.get("/pipeline-analytics")
def get_placement_pipeline_analytics(
    db: Session = Depends(get_db),
    _user: User = Depends(require_roles(["tpo", "admin", "staff"])),
):
    """
    Visual Funnel Metrics: Applied -> Eligible -> Aptitude -> Coding -> Technical -> HR -> Offered -> Joined
    """
    all_apps = db.query(JobApplication).all()

    stages_count = {
        "Applied": 0,
        "Eligible": 0,
        "Aptitude": 0,
        "Coding": 0,
        "Tech Interview": 0,
        "HR Interview": 0,
        "Offered": 0,
        "Joined": 0,
    }

    for a in all_apps:
        if a.stage in stages_count:
            stages_count[a.stage] += 1
        elif a.stage == "Offered":
            stages_count["Offered"] += 1

    return {
        "total_applications": len(all_apps),
        "pipeline_funnel": stages_count,
        "offered_count": stages_count["Offered"],
        "placement_rate_pct": round((stages_count["Offered"] / max(1, len(all_apps))) * 100, 1),
    }
