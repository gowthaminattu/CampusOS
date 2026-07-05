# routers/meeting.py
# Handles meeting endpoints:
# - POST /meeting  → Schedule a meeting, notify all staff members (staff only)
# - GET /meeting   → Get all scheduled meetings (staff only)

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from database.db import get_db
from models.user import User, Meeting, Notification
from routers.auth import get_current_user
from routers.admin import require_staff

router = APIRouter(prefix="/meeting", tags=["Meetings"])

# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------
class MeetingCreate(BaseModel):
    title: str
    description: Optional[str] = None
    date: str           # Format: YYYY-MM-DD
    time: str           # Format: HH:MM
    location: str


class MeetingOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    date: str
    time: str
    location: str
    created_by_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@router.post("", response_model=MeetingOut, status_code=status.HTTP_201_CREATED)
def create_meeting(
    request: MeetingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff), # Guarded: Staff only
):
    """Schedule a meeting and automatically send notification/message to all staff members."""
    # Create the meeting record
    new_meeting = Meeting(
        title=request.title,
        description=request.description,
        date=request.date,
        time=request.time,
        location=request.location,
        created_by_id=current_user.id
    )
    db.add(new_meeting)
    db.commit()
    db.refresh(new_meeting)

    # Send notification to all staff members
    staff_members = db.query(User).filter(User.role == "staff").all()
    for staff in staff_members:
        # Create a notification entry for each staff member
        notif = Notification(
            user_id=staff.id,
            text=f"New Staff Meeting scheduled: '{request.title}' on {request.date} at {request.time} in {request.location}.",
            time="Just now",
            read=False
        )
        db.add(notif)
    db.commit()

    return new_meeting


@router.get("", response_model=List[MeetingOut])
def get_meetings(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff), # Guarded: Staff only
):
    """Get all scheduled meetings, ordered by date and time."""
    return (
        db.query(Meeting)
        .order_by(Meeting.date.asc(), Meeting.time.asc())
        .all()
    )
