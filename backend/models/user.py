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
    roll_number = Column(String, unique=True, index=True, nullable=True) # Optional for staff/admin
    hashed_password = Column(String, nullable=False)       # Bcrypt hashed
    department = Column(String, nullable=True)
    year = Column(Integer, nullable=True)
    section = Column(String, nullable=True, default="A")
    
    # CampusOS 2.0 4-Tier Roles: 'student', 'faculty', 'tpo', 'admin'
    role = Column(String, default="student", nullable=False)
    gpa = Column(Float, nullable=True, default=0.0)
    attendance = Column(Float, nullable=True, default=0.0)
    arrears = Column(Integer, nullable=True, default=0)
    phone = Column(String, nullable=True)
    address = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    target_role = Column(String, nullable=True, default="Software Developer")
    github_url = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    portfolio_url = Column(String, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    hostel_bookings = relationship("HostelBooking", back_populates="student")
    lab_bookings = relationship("LabBooking", back_populates="student")
    admissions = relationship("AdmissionApplication", back_populates="student")
    meetings = relationship("Meeting", back_populates="creator")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    skills = relationship("StudentSkill", back_populates="student", cascade="all, delete-orphan")
    applications = relationship("JobApplication", back_populates="student", cascade="all, delete-orphan")
    mock_interviews = relationship("MockInterview", back_populates="student", cascade="all, delete-orphan")
    resumes = relationship("ResumeAnalysis", back_populates="student", cascade="all, delete-orphan")
    library_transactions = relationship("LibraryTransaction", back_populates="student", cascade="all, delete-orphan")
    certificates = relationship("Certificate", back_populates="student", cascade="all, delete-orphan")

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
# HostelRoom model
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
# HostelBooking model
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
# Lab model
# ---------------------------------------------------------------------------
class Lab(Base):
    __tablename__ = "labs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    location = Column(String, nullable=False)
    capacity = Column(Integer, nullable=False, default=30)
    equipment = Column(String, nullable=True)
    is_restricted = Column(Boolean, default=False)             # Staff-only lab restriction
    is_active = Column(Boolean, default=True)

    bookings = relationship("LabBooking", back_populates="lab")

# ---------------------------------------------------------------------------
# LabBooking model
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
    time = Column(String, nullable=False)
    category = Column(String, default="system")                # placement, attendance, lab, hostel, system
    read = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")

# ---------------------------------------------------------------------------
# Skill & StudentSkill models
# ---------------------------------------------------------------------------
class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    category = Column(String, nullable=False, default="Technical") # Technical, Coding, Aptitude, Soft

class StudentSkill(Base):
    __tablename__ = "student_skills"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill_name = Column(String, nullable=False)
    category = Column(String, nullable=False, default="Technical")
    score = Column(Float, nullable=False, default=70.0)         # 0 - 100 proficiency rating

    student = relationship("User", back_populates="skills")

# ---------------------------------------------------------------------------
# Placement Models: Company, JobDrive, JobApplication, Offer
# ---------------------------------------------------------------------------
class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    industry = Column(String, nullable=True)
    website = Column(String, nullable=True)
    location = Column(String, nullable=True)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    drives = relationship("JobDrive", back_populates="company", cascade="all, delete-orphan")

class JobDrive(Base):
    __tablename__ = "job_drives"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    title = Column(String, nullable=False)
    role = Column(String, nullable=False)
    description = Column(String, nullable=True)
    min_cgpa = Column(Float, nullable=False, default=6.0)
    max_backlogs = Column(Integer, nullable=False, default=0)
    allowed_branches = Column(String, nullable=False, default="CSE,ECE,EEE,MECH,CIVIL,IT") # CSV
    required_skills = Column(String, nullable=False)                                        # CSV
    package_lpa = Column(Float, nullable=False, default=5.0)
    location = Column(String, nullable=True)
    drive_date = Column(String, nullable=False)
    status = Column(String, default="Active")                                                # Active, Closed, Draft
    created_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("Company", back_populates="drives")
    applications = relationship("JobApplication", back_populates="drive", cascade="all, delete-orphan")

class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    drive_id = Column(Integer, ForeignKey("job_drives.id"), nullable=False)
    stage = Column(String, default="Applied", nullable=False) # Applied, Eligible, Aptitude, Coding, Tech Interview, HR Interview, Offered, Rejected
    status = Column(String, default="In Process", nullable=False) # In Process, Offered, Rejected
    rejection_reason = Column(String, nullable=True)
    match_score = Column(Float, nullable=True, default=75.0)
    applied_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("User", back_populates="applications")
    drive = relationship("JobDrive", back_populates="applications")
    offers = relationship("Offer", back_populates="application", cascade="all, delete-orphan")

class Offer(Base):
    __tablename__ = "offers"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("job_applications.id"), nullable=False)
    package_lpa = Column(Float, nullable=False)
    offer_letter_url = Column(String, nullable=True)
    status = Column(String, default="Accepted") # Accepted, Declined, Pending
    issued_at = Column(DateTime, default=datetime.utcnow)

    application = relationship("JobApplication", back_populates="offers")

# ---------------------------------------------------------------------------
# AI Mock Interview & Resume Analysis
# ---------------------------------------------------------------------------
class MockInterview(Base):
    __tablename__ = "mock_interviews"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    target_role = Column(String, nullable=False)
    difficulty = Column(String, default="Medium")              # Easy, Medium, Hard
    overall_score = Column(Float, default=0.0)
    technical_accuracy = Column(Float, default=0.0)
    relevance_score = Column(Float, default=0.0)
    communication_score = Column(Float, default=0.0)
    completeness_score = Column(Float, default=0.0)
    confidence_score = Column(Float, default=0.0)
    clarity_score = Column(Float, default=0.0)
    status = Column(String, default="Completed")                # In Progress, Completed
    feedback = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("User", back_populates="mock_interviews")
    answers = relationship("InterviewAnswer", back_populates="interview", cascade="all, delete-orphan")

class InterviewAnswer(Base):
    __tablename__ = "interview_answers"

    id = Column(Integer, primary_key=True, index=True)
    interview_id = Column(Integer, ForeignKey("mock_interviews.id"), nullable=False)
    question_number = Column(Integer, nullable=False)
    question = Column(String, nullable=False)
    student_answer = Column(String, nullable=False)
    ai_evaluation = Column(String, nullable=True)
    score = Column(Float, default=70.0)
    difficulty = Column(String, default="Medium")

    interview = relationship("MockInterview", back_populates="answers")

class ResumeAnalysis(Base):
    __tablename__ = "resume_analyses"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    resume_text = Column(String, nullable=False)
    ats_score = Column(Float, default=75.0)
    target_role = Column(String, nullable=True)
    matched_skills = Column(String, nullable=True)              # CSV
    missing_skills = Column(String, nullable=True)              # CSV
    suggestions = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("User", back_populates="resumes")

# ---------------------------------------------------------------------------
# Library Models
# ---------------------------------------------------------------------------
class LibraryBook(Base):
    __tablename__ = "library_books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    author = Column(String, nullable=False)
    isbn = Column(String, unique=True, nullable=False)
    category = Column(String, nullable=False, default="Computer Science")
    total_copies = Column(Integer, nullable=False, default=5)
    available_copies = Column(Integer, nullable=False, default=5)

    transactions = relationship("LibraryTransaction", back_populates="book")

class LibraryTransaction(Base):
    __tablename__ = "library_transactions"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    book_id = Column(Integer, ForeignKey("library_books.id"), nullable=False)
    issue_date = Column(String, nullable=False)                # YYYY-MM-DD
    due_date = Column(String, nullable=False)                  # YYYY-MM-DD
    return_date = Column(String, nullable=True)
    fine_amount = Column(Float, default=0.0)
    status = Column(String, default="Issued")                  # Issued, Returned, Overdue

    student = relationship("User", back_populates="library_transactions")
    book = relationship("LibraryBook", back_populates="transactions")

# ---------------------------------------------------------------------------
# Audit Logs & Certificates
# ---------------------------------------------------------------------------
class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    user_name = Column(String, nullable=True)
    role = Column(String, nullable=True)
    action = Column(String, nullable=False)
    resource = Column(String, nullable=False)
    ip_address = Column(String, nullable=True, default="127.0.0.1")
    status = Column(String, default="SUCCESS")
    timestamp = Column(DateTime, default=datetime.utcnow)

class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    issuer = Column(String, nullable=False)
    issue_date = Column(String, nullable=False)
    category = Column(String, default="Workshop")
    credential_url = Column(String, nullable=True)

    student = relationship("User", back_populates="certificates")

