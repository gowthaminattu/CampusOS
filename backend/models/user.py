# models/user.py
# Defines all SQLAlchemy ORM models for the CampusOS database.
# Each class maps to a table in the SQLite database.

from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from database.db import Base

# ---------------------------------------------------------------------------
# User model — stores student and staff account information
# ---------------------------------------------------------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)                  # Full name
    email = Column(String, unique=True, index=True, nullable=False)
    roll_number = Column(String, unique=True, index=True, nullable=True) # Optional for staff
    hashed_password = Column(String, nullable=False)       # Bcrypt hashed
    department = Column(String, nullable=True)
    year = Column(Integer, nullable=True)
    
    # New fields for CampusOS AI
    role = Column(String, default="student", nullable=False) # 'student' or 'staff'
    gpa = Column(Float, nullable=True, default=0.0)
    attendance = Column(Float, nullable=True, default=0.0)
    phone = Column(String, nullable=True)
    address = Column(String, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships — makes it easy to access bookings from a user object
    hostel_bookings = relationship("HostelBooking", back_populates="student")
    lab_bookings = relationship("LabBooking", back_populates="student")
    admissions = relationship("AdmissionApplication", back_populates="student")
    meetings = relationship("Meeting", back_populates="creator")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")

# ---------------------------------------------------------------------------
# Admission Application model 
# ---------------------------------------------------------------------------
class AdmissionApplication(Base):
    __tablename__ = "admissions"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    full_name = Column(String, nullable=False)
    dob = Column(String, nullable=False)
    gender = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    address = Column(String, nullable=False)
    department = Column(String, nullable=False)
    
    marks_10th = Column(Float, nullable=False)
    marks_12th = Column(Float, nullable=False)
    
    status = Column(String, default="Pending", nullable=False) # Pending, Approved, Rejected
    submitted_at = Column(DateTime, default=datetime.utcnow)
    
    student = relationship("User", back_populates="admissions")

# ---------------------------------------------------------------------------
# HostelRoom model — represents a physical hostel room
# ---------------------------------------------------------------------------
class HostelRoom(Base):
    __tablename__ = "hostel_rooms"

    id = Column(Integer, primary_key=True, index=True)
    room_number = Column(String, unique=True, nullable=False)  # e.g. "A-101"
    room_type = Column(String, nullable=False)                  # Single / Double / Triple
    floor = Column(Integer, nullable=False)
    block = Column(String, nullable=False)                      # e.g. "A Block"
    amenities = Column(String, nullable=True)                   # Comma-separated list
    monthly_rent = Column(Integer, nullable=False, default=3000)
    is_available = Column(Boolean, default=True)

    bookings = relationship("HostelBooking", back_populates="room")

# ---------------------------------------------------------------------------
# HostelBooking model — tracks which student has booked which room
# ---------------------------------------------------------------------------
class HostelBooking(Base):
    __tablename__ = "hostel_bookings"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    room_id = Column(Integer, ForeignKey("hostel_rooms.id"), nullable=False)
    check_in_date = Column(String, nullable=False)
    check_out_date = Column(String, nullable=True)
    status = Column(String, default="confirmed")  # confirmed / cancelled / pending
    booked_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("User", back_populates="hostel_bookings")
    room = relationship("HostelRoom", back_populates="bookings")

# ---------------------------------------------------------------------------
# Lab model — represents a physical lab in the college
# ---------------------------------------------------------------------------
class Lab(Base):
    __tablename__ = "labs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)          # e.g. "Lab 2"
    location = Column(String, nullable=False)                   # e.g. "Block B, Room 204"
    capacity = Column(Integer, nullable=False, default=30)
    equipment = Column(String, nullable=True)                   # Comma-separated
    is_active = Column(Boolean, default=True)

    bookings = relationship("LabBooking", back_populates="lab")

# ---------------------------------------------------------------------------
# LabBooking model — tracks lab slot reservations
# ---------------------------------------------------------------------------
class LabBooking(Base):
    __tablename__ = "lab_bookings"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lab_id = Column(Integer, ForeignKey("labs.id"), nullable=False)
    booking_date = Column(String, nullable=False)               # YYYY-MM-DD
    start_time = Column(String, nullable=False)                 # HH:MM (24h)
    end_time = Column(String, nullable=False)                   # HH:MM (24h)
    purpose = Column(String, nullable=True)
    status = Column(String, default="confirmed")  # confirmed / cancelled
    booked_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("User", back_populates="lab_bookings")
    lab = relationship("Lab", back_populates="bookings")

# ---------------------------------------------------------------------------
# Meeting model
# ---------------------------------------------------------------------------
class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    date = Column(String, nullable=False)       # YYYY-MM-DD
    time = Column(String, nullable=False)       # HH:MM
    location = Column(String, nullable=False)
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    creator = relationship("User", back_populates="meetings")

# ---------------------------------------------------------------------------
# Notification model
# ---------------------------------------------------------------------------
class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    text = Column(String, nullable=False)
    time = Column(String, nullable=False)       # e.g., "Just now" or "2h ago"
    read = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")
