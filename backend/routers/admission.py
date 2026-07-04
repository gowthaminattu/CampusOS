# routers/admission.py
# Handles student admission application endpoints:
# - POST /admission/apply         → Student submits an application
# - GET  /admission/my            → Student views their own applications
# - GET  /admission/all           → Staff views all applications
# - PUT  /admission/{id}/status   → Staff updates application status

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from database.db import get_db
from models.user import User, AdmissionApplication
from routers.auth import get_current_user
from routers.admin import require_staff

router = APIRouter(prefix="/admission", tags=["Admission"])


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------
class AdmissionRequest(BaseModel):
    full_name: str
    dob: str
    gender: str
    email: str
    phone: str
    address: str
    department: str
    marks_10th: float
    marks_12th: float


class AdmissionOut(BaseModel):
    id: int
    student_id: int
    full_name: str
    dob: str
    gender: str
    email: str
    phone: str
    address: str
    department: str
    marks_10th: float
    marks_12th: float
    status: str
    submitted_at: datetime

    class Config:
        from_attributes = True


class StatusUpdate(BaseModel):
    status: str  # "Pending" | "Approved" | "Rejected"


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@router.post("/apply", response_model=AdmissionOut, status_code=status.HTTP_201_CREATED)
def apply(
    request: AdmissionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Submit a new admission application."""
    application = AdmissionApplication(
        student_id=current_user.id,
        full_name=request.full_name,
        dob=request.dob,
        gender=request.gender,
        email=request.email,
        phone=request.phone,
        address=request.address,
        department=request.department,
        marks_10th=request.marks_10th,
        marks_12th=request.marks_12th,
        status="Pending",
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return application


@router.get("/my", response_model=List[AdmissionOut])
def get_my_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return all admission applications submitted by the current user."""
    return (
        db.query(AdmissionApplication)
        .filter(AdmissionApplication.student_id == current_user.id)
        .order_by(AdmissionApplication.submitted_at.desc())
        .all()
    )


@router.get("/all", response_model=List[AdmissionOut])
def get_all_applications(
    db: Session = Depends(get_db),
    _staff: User = Depends(require_staff),
):
    """Staff only — return all admission applications."""
    return (
        db.query(AdmissionApplication)
        .order_by(AdmissionApplication.submitted_at.desc())
        .all()
    )


@router.put("/{application_id}/status", response_model=AdmissionOut)
def update_status(
    application_id: int,
    body: StatusUpdate,
    db: Session = Depends(get_db),
    _staff: User = Depends(require_staff),
):
    """Staff only — approve or reject an admission application."""
    if body.status not in ("Pending", "Approved", "Rejected"):
        raise HTTPException(status_code=400, detail="Invalid status value")

    app = db.query(AdmissionApplication).filter(AdmissionApplication.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    app.status = body.status
    db.commit()
    db.refresh(app)
    return app
