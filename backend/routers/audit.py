# routers/audit.py
# Admin Audit Logging Router
# GET /api/admin/audit-logs

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from database.db import get_db
from models.user import User, AuditLog
from routers.auth import get_current_user, require_roles

router = APIRouter(prefix="/api/admin", tags=["Audit Logging"])


@router.get("/audit-logs")
def get_audit_logs(
    limit: int = 50,
    db: Session = Depends(get_db),
    _user: User = Depends(require_roles(["admin", "staff"])),
):
    """
    Returns immutable system audit logs for administrative inspection.
    """
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit).all()
    res = []
    for l in logs:
        res.append({
            "id": l.id,
            "user_id": l.user_id,
            "user_name": l.user_name or "System User",
            "role": l.role or "N/A",
            "action": l.action,
            "resource": l.resource,
            "ip_address": l.ip_address or "127.0.0.1",
            "status": l.status,
            "timestamp": l.timestamp.isoformat(),
        })
    return res


def log_action(db: Session, user: User, action: str, resource: str, status_str: str = "SUCCESS"):
    """
    Helper function called across services to record immutable audit trail entries.
    """
    try:
        log_item = AuditLog(
            user_id=user.id if user else None,
            user_name=user.name if user else "Anonymous",
            role=user.role if user else "Guest",
            action=action,
            resource=resource,
            status=status_str,
            timestamp=datetime.utcnow(),
        )
        db.add(log_item)
        db.commit()
    except Exception as e:
        print(f"Audit log writing warning: {e}")
