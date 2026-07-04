# routers/hostel.py
# Handles hostel room browsing and booking endpoints:
# - GET  /hostel/rooms     → List all rooms with availability
# - POST /hostel/book      → Book a hostel room
# - GET  /hostel/bookings  → Get current user's booking history
# - DELETE /hostel/cancel/{booking_id} → Cancel a booking

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from database.db import get_db
from models.user import User, HostelRoom, HostelBooking
from routers.auth import get_current_user

router = APIRouter(prefix="/hostel", tags=["Hostel Booking"])


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------
class RoomResponse(BaseModel):
    id: int
    room_number: str
    room_type: str
    floor: int
    block: str
    amenities: Optional[str]
    monthly_rent: int
    is_available: bool

    class Config:
        from_attributes = True


class BookHostelRequest(BaseModel):
    room_id: int
    check_in_date: str   # Format: YYYY-MM-DD
    check_out_date: Optional[str] = None


class BookingResponse(BaseModel):
    id: int
    room_id: int
    check_in_date: str
    check_out_date: Optional[str]
    status: str
    booked_at: datetime
    room: RoomResponse

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@router.get("/rooms", response_model=List[RoomResponse])
def get_rooms(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Return all hostel rooms with their current availability status."""
    rooms = db.query(HostelRoom).all()
    return rooms


@router.post("/book", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def book_room(
    request: BookHostelRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Book a hostel room.
    Prevents:
    - Booking an unavailable room
    - Duplicate bookings (user already has an active booking)
    """
    # Check the room exists
    room = db.query(HostelRoom).filter(HostelRoom.id == request.room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    # Check room is available
    if not room.is_available:
        raise HTTPException(status_code=400, detail="Room is already occupied")

    # Prevent duplicate booking — check if user already has a confirmed hostel booking
    existing = (
        db.query(HostelBooking)
        .filter(
            HostelBooking.student_id == current_user.id,
            HostelBooking.status == "confirmed",
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"You already have an active hostel booking (Room {existing.room.room_number}). Cancel it first.",
        )

    # Create the booking
    booking = HostelBooking(
        student_id=current_user.id,
        room_id=request.room_id,
        check_in_date=request.check_in_date,
        check_out_date=request.check_out_date,
        status="confirmed",
    )
    db.add(booking)

    # Mark room as unavailable
    room.is_available = False
    db.commit()
    db.refresh(booking)
    return booking


@router.get("/bookings", response_model=List[BookingResponse])
def get_my_bookings(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Return all hostel bookings for the currently logged-in student."""
    bookings = (
        db.query(HostelBooking)
        .filter(HostelBooking.student_id == current_user.id)
        .order_by(HostelBooking.booked_at.desc())
        .all()
    )
    return bookings


@router.delete("/cancel/{booking_id}")
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Cancel a hostel booking and free up the room."""
    booking = (
        db.query(HostelBooking)
        .filter(HostelBooking.id == booking_id, HostelBooking.student_id == current_user.id)
        .first()
    )
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.status == "cancelled":
        raise HTTPException(status_code=400, detail="Booking is already cancelled")

    booking.status = "cancelled"
    booking.room.is_available = True  # Free the room
    db.commit()
    return {"message": "Booking cancelled successfully", "booking_id": booking_id}
