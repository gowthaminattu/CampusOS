# routers/lab.py
# Handles lab booking endpoints:
# - GET  /lab/labs              → List all available labs
# - GET  /lab/slots/{lab_id}   → Get time slots for a specific lab on a date
# - POST /lab/book             → Book a lab slot (conflict-checked)
# - GET  /lab/bookings         → Get current user's lab booking history
# - DELETE /lab/cancel/{id}   → Cancel a lab booking

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date

from database.db import get_db
from models.user import User, Lab, LabBooking
from routers.auth import get_current_user

router = APIRouter(prefix="/lab", tags=["Lab Booking"])


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------
class LabResponse(BaseModel):
    id: int
    name: str
    location: str
    capacity: int
    equipment: Optional[str]
    is_active: bool

    class Config:
        from_attributes = True


class BookLabRequest(BaseModel):
    lab_id: int
    booking_date: str   # YYYY-MM-DD
    start_time: str     # HH:MM (24-hour format)
    end_time: str       # HH:MM
    purpose: Optional[str] = None


class LabBookingResponse(BaseModel):
    id: int
    lab_id: int
    booking_date: str
    start_time: str
    end_time: str
    purpose: Optional[str]
    status: str
    booked_at: datetime
    lab: LabResponse

    class Config:
        from_attributes = True


class SlotInfo(BaseModel):
    start_time: str
    end_time: str
    is_available: bool


# ---------------------------------------------------------------------------
# Helper — check if two time ranges overlap
# ---------------------------------------------------------------------------
def times_overlap(s1: str, e1: str, s2: str, e2: str) -> bool:
    """Return True if [s1, e1) overlaps with [s2, e2)."""
    return s1 < e2 and s2 < e1


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@router.get("/labs", response_model=List[LabResponse])
def get_labs(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Return all active labs."""
    return db.query(Lab).filter(Lab.is_active == True).all()


@router.get("/slots/{lab_id}", response_model=List[SlotInfo])
def get_available_slots(
    lab_id: int,
    booking_date: str = Query(..., description="Date in YYYY-MM-DD format"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Return hourly time slots for a lab on a given date.
    Each slot shows whether it's available or already booked.
    """
    lab = db.query(Lab).filter(Lab.id == lab_id).first()
    if not lab:
        raise HTTPException(status_code=404, detail="Lab not found")

    # Get all confirmed bookings for this lab on this date
    booked_slots = (
        db.query(LabBooking)
        .filter(
            LabBooking.lab_id == lab_id,
            LabBooking.booking_date == booking_date,
            LabBooking.status == "confirmed",
        )
        .all()
    )

    # Generate hourly slots from 8 AM to 8 PM
    slots = []
    for hour in range(8, 20):  # 08:00 to 19:00
        slot_start = f"{hour:02d}:00"
        slot_end = f"{hour + 1:02d}:00"

        # Check if this slot conflicts with any existing booking
        is_available = not any(
            times_overlap(slot_start, slot_end, b.start_time, b.end_time)
            for b in booked_slots
        )
        slots.append({"start_time": slot_start, "end_time": slot_end, "is_available": is_available})

    return slots


@router.post("/book", response_model=LabBookingResponse, status_code=status.HTTP_201_CREATED)
def book_lab(
    request: BookLabRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Book a lab slot.
    Prevents:
    - Booking a non-existent lab
    - Overlapping time slots for the same lab on the same date
    - User booking the same lab twice at the same time
    """
    # Validate lab
    lab = db.query(Lab).filter(Lab.id == request.lab_id, Lab.is_active == True).first()
    if not lab:
        raise HTTPException(status_code=404, detail="Lab not found or inactive")

    # Validate times
    if request.start_time >= request.end_time:
        raise HTTPException(status_code=400, detail="End time must be after start time")

    # Check for conflicts — any confirmed booking that overlaps this time slot
    conflicts = (
        db.query(LabBooking)
        .filter(
            LabBooking.lab_id == request.lab_id,
            LabBooking.booking_date == request.booking_date,
            LabBooking.status == "confirmed",
        )
        .all()
    )
    for conflict in conflicts:
        if times_overlap(request.start_time, request.end_time, conflict.start_time, conflict.end_time):
            raise HTTPException(
                status_code=409,
                detail=f"Slot conflicts with an existing booking ({conflict.start_time}–{conflict.end_time})",
            )

    # Create the booking
    booking = LabBooking(
        student_id=current_user.id,
        lab_id=request.lab_id,
        booking_date=request.booking_date,
        start_time=request.start_time,
        end_time=request.end_time,
        purpose=request.purpose,
        status="confirmed",
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


@router.get("/bookings", response_model=List[LabBookingResponse])
def get_my_lab_bookings(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Return all lab bookings for the current user."""
    return (
        db.query(LabBooking)
        .filter(LabBooking.student_id == current_user.id)
        .order_by(LabBooking.booked_at.desc())
        .all()
    )


@router.delete("/cancel/{booking_id}")
def cancel_lab_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Cancel a lab booking."""
    booking = (
        db.query(LabBooking)
        .filter(LabBooking.id == booking_id, LabBooking.student_id == current_user.id)
        .first()
    )
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.status == "cancelled":
        raise HTTPException(status_code=400, detail="Already cancelled")

    booking.status = "cancelled"
    db.commit()
    return {"message": "Lab booking cancelled", "booking_id": booking_id}
