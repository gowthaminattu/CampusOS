# routers/admin.py
# Staff-only endpoints for student management and platform analytics.
# All routes require role="staff" authentication.

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from database.db import get_db
from models.user import User, HostelBooking, LabBooking, AdmissionApplication
from routers.auth import get_current_user

router = APIRouter(prefix="/admin", tags=["Admin / Staff"])


# ---------------------------------------------------------------------------
# Auth guard — only staff can access these endpoints
# ---------------------------------------------------------------------------
def require_staff(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "staff":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Staff only.",
        )
    return current_user


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------
class StudentOut(BaseModel):
    id: int
    name: str
    email: str
    roll_number: Optional[str]
    department: Optional[str]
    year: Optional[int]
    gpa: Optional[float]
    attendance: Optional[float]
    phone: Optional[str]
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


class AnalyticsOut(BaseModel):
    total_students: int
    total_staff: int
    total_lab_bookings: int
    total_hostel_bookings: int
    total_admissions: int
    dept_distribution: dict
    year_distribution: dict


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@router.get("/students", response_model=List[StudentOut])
def get_all_students(
    db: Session = Depends(get_db),
    _staff: User = Depends(require_staff),
):
    """Return all registered students."""
    return db.query(User).filter(User.role == "student").all()


@router.get("/analytics", response_model=AnalyticsOut)
def get_analytics(
    db: Session = Depends(get_db),
    _staff: User = Depends(require_staff),
):
    """Return platform-wide analytics for the staff dashboard."""
    students = db.query(User).filter(User.role == "student").all()
    total_staff = db.query(User).filter(User.role == "staff").count()
    total_lab = db.query(LabBooking).count()
    total_hostel = db.query(HostelBooking).count()
    total_admissions = db.query(AdmissionApplication).count()

    # Department distribution
    dept_dist: dict[str, int] = {}
    year_dist: dict[str, int] = {}
    for s in students:
        dept = s.department or "Unknown"
        dept_dist[dept] = dept_dist.get(dept, 0) + 1
        yr = str(s.year) if s.year else "Unknown"
        year_dist[yr] = year_dist.get(yr, 0) + 1

    return {
        "total_students": len(students),
        "total_staff": total_staff,
        "total_lab_bookings": total_lab,
        "total_hostel_bookings": total_hostel,
        "total_admissions": total_admissions,
        "dept_distribution": dept_dist,
        "year_distribution": year_dist,
    }


@router.put("/students/{student_id}/gpa")
def update_student_gpa(
    student_id: int,
    gpa: float,
    db: Session = Depends(get_db),
    _staff: User = Depends(require_staff),
):
    """Update a student's GPA."""
    student = db.query(User).filter(User.id == student_id, User.role == "student").first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    student.gpa = gpa
    db.commit()
    return {"message": "GPA updated", "student_id": student_id, "gpa": gpa}


@router.put("/students/{student_id}/attendance")
def update_student_attendance(
    student_id: int,
    attendance: float,
    db: Session = Depends(get_db),
    _staff: User = Depends(require_staff),
):
    """Update a student's attendance percentage."""
    student = db.query(User).filter(User.id == student_id, User.role == "student").first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    student.attendance = attendance
    db.commit()
    return {"message": "Attendance updated", "student_id": student_id, "attendance": attendance}
