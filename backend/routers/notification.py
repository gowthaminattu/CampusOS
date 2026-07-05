# routers/notification.py
# Handles user notification endpoints:
# - GET /notification           → Get list of notifications for currently logged in user
# - POST /notification/read-all  → Mark all notifications as read

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from datetime import datetime

from database.db import get_db
from models.user import User, Notification
from routers.auth import get_current_user

router = APIRouter(prefix="/notification", tags=["Notifications"])

# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------
class NotificationOut(BaseModel):
    id: int
    text: str
    time: str
    read: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Helper — compute relative time from datetime
# ---------------------------------------------------------------------------
def get_relative_time(dt: datetime) -> str:
    now = datetime.utcnow()
    diff = now - dt
    if diff.days > 0:
        return f"{diff.days}d ago"
    hours = diff.seconds // 3600
    if hours > 0:
        return f"{hours}h ago"
    minutes = diff.seconds // 60
    if minutes > 0:
        return f"{minutes}m ago"
    return "Just now"


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@router.get("", response_model=List[NotificationOut])
def get_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return all notifications for the currently logged-in user, ordered by most recent."""
    notifications = (
        db.query(Notification)
        .filter(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
        .all()
    )
    
    # Dynamically compute relative time string
    result = []
    for n in notifications:
        result.append(
            NotificationOut(
                id=n.id,
                text=n.text,
                time=get_relative_time(n.created_at),
                read=n.read,
                created_at=n.created_at
            )
        )
    return result


@router.post("/read-all")
def mark_all_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Mark all notifications for the logged-in user as read."""
    db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.read == False
    ).update({"read": True}, synchronize_session=False)
    db.commit()
    return {"message": "All notifications marked as read"}
