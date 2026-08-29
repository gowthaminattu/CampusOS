# main.py
# Entry point for the CampusOS FastAPI backend.
# Run with: uvicorn main:app --reload

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

load_dotenv()
from pydantic import BaseModel
from typing import Optional

from database.db import engine, Base
from models import user as models_user   # noqa: F401 — import triggers table creation
from routers import (
    auth, hostel, lab, orchestrator, admission, admin, notification, meeting,
    employability, skill_gap, placement, mock_interview, resume, at_risk, library, audit
)

# ---------------------------------------------------------------------------
# Seed function — runs once on startup to populate rooms, labs, companies, and books
# ---------------------------------------------------------------------------
def _seed_data():
    """
    Seed the database with sample hostel rooms, labs, companies, job drives, and library books.
    """
    from database.db import SessionLocal
    from models.user import HostelRoom, Lab, Company, JobDrive, LibraryBook, User, StudentSkill
    from routers.auth import hash_password

    db = SessionLocal()
    try:
        # Seed hostel rooms only if none exist
        if db.query(HostelRoom).count() == 0:
            rooms = [
                HostelRoom(room_number="A-101", room_type="Single", floor=1, block="A Block",
                           amenities="WiFi, AC, Attached Bathroom", monthly_rent=5000, is_available=True),
                HostelRoom(room_number="A-102", room_type="Double", floor=1, block="A Block",
                           amenities="WiFi, Fan, Shared Bathroom", monthly_rent=3500, is_available=True),
                HostelRoom(room_number="A-201", room_type="Single", floor=2, block="A Block",
                           amenities="WiFi, AC, Attached Bathroom, Balcony", monthly_rent=5500, is_available=True),
                HostelRoom(room_number="B-101", room_type="Triple", floor=1, block="B Block",
                           amenities="WiFi, Fan, Shared Bathroom", monthly_rent=2500, is_available=True),
                HostelRoom(room_number="B-102", room_type="Double", floor=1, block="B Block",
                           amenities="WiFi, AC", monthly_rent=4000, is_available=True),
                HostelRoom(room_number="B-201", room_type="Single", floor=2, block="B Block",
                           amenities="WiFi, AC, Attached Bathroom", monthly_rent=5000, is_available=True),
                HostelRoom(room_number="C-101", room_type="Double", floor=1, block="C Block",
                           amenities="WiFi, AC, Study Table", monthly_rent=4200, is_available=True),
                HostelRoom(room_number="C-102", room_type="Single", floor=1, block="C Block",
                           amenities="WiFi, Fan", monthly_rent=3000, is_available=True),
            ]
            db.add_all(rooms)

        # Seed labs only if none exist
        if db.query(Lab).count() == 0:
            labs = [
                Lab(name="Lab 1", location="Block A, Room 101", capacity=30,
                    equipment="Python, C++, Java IDEs, 30 PCs", is_active=True),
                Lab(name="Lab 2", location="Block A, Room 102", capacity=25,
                    equipment="MATLAB, Simulink, Signal Processing Tools", is_active=True),
                Lab(name="Lab 3", location="Block B, Room 201", capacity=40,
                    equipment="Web Development Tools, Node.js, React", is_active=True),
                Lab(name="Networks Lab", location="Block B, Room 202", capacity=20,
                    equipment="Cisco Routers, Packet Tracer, Wireshark", is_active=True),
                Lab(name="AI/ML Lab", location="Block C, Room 301", capacity=20,
                    equipment="GPU Workstations, TensorFlow, PyTorch, CUDA", is_restricted=True, is_active=True),
                Lab(name="Electronics Lab", location="Block C, Room 302", capacity=30,
                    equipment="Oscilloscopes, Multimeters, Breadboards, Arduino", is_active=True),
            ]
            db.add_all(labs)

        # Seed Companies & Placement Drives
        if db.query(Company).count() == 0:
            c1 = Company(name="Amazon", industry="Cloud & E-Commerce", location="Bengaluru", website="https://amazon.jobs")
            c2 = Company(name="Google", industry="Software & Internet", location="Hyderabad", website="https://careers.google.com")
            c3 = Company(name="TCS", industry="IT Services", location="Mumbai", website="https://tcs.com")
            db.add_all([c1, c2, c3])
            db.commit()

            d1 = JobDrive(company_id=c1.id, title="SDE-1 Graduate Drive 2026", role="Software Development Engineer",
                          description="Looking for strong algorithms, Java/Python, and Distributed Systems basics.",
                          min_cgpa=7.5, max_backlogs=0, allowed_branches="CSE,ECE,IT", required_skills="Java, OOP, DSA, SQL, REST API", package_lpa=28.5, location="Bengaluru", drive_date="2026-09-10", status="Active")
            d2 = JobDrive(company_id=c2.id, title="Software Engineer Campus Hire", role="Software Engineer",
                          description="Focus on System Design, Data Structures, and Clean Code principles.",
                          min_cgpa=8.0, max_backlogs=0, allowed_branches="CSE,IT", required_skills="Python, C++, DSA, System Design", package_lpa=36.0, location="Hyderabad", drive_date="2026-09-25", status="Active")
            d3 = JobDrive(company_id=c3.id, title="Ninja & Digital Hiring", role="System Engineer",
                          description="Core software development and IT infrastructure roles.",
                          min_cgpa=6.0, max_backlogs=1, allowed_branches="CSE,ECE,EEE,MECH,CIVIL,IT", required_skills="Java, SQL, Git", package_lpa=7.0, location="Pan India", drive_date="2026-08-30", status="Active")
            db.add_all([d1, d2, d3])

        # Seed Library Books
        if db.query(LibraryBook).count() == 0:
            books = [
                LibraryBook(title="Introduction to Algorithms (CLRS)", author="Cormen, Leiserson, Rivest, Stein", isbn="9780262033848", category="Computer Science", total_copies=6, available_copies=5),
                LibraryBook(title="Clean Code: A Handbook of Agile Software Craftsmanship", author="Robert C. Martin", isbn="9780132350884", category="Software Engineering", total_copies=4, available_copies=4),
                LibraryBook(title="Design Patterns: Elements of Reusable Object-Oriented Software", author="Erich Gamma et al.", isbn="9780201633610", category="Software Architecture", total_copies=5, available_copies=3),
                LibraryBook(title="Database System Concepts", author="Silberschatz, Korth, Sudarshan", isbn="9780073523323", category="Database", total_copies=8, available_copies=7),
            ]
            db.add_all(books)

        # Seed demo users for 4 roles if none exist
        if db.query(User).filter(User.email == "student@campusos.com").count() == 0:
            demo_student = User(
                name="Aarav Sharma", email="student@campusos.com", roll_number="21CS001",
                hashed_password=hash_password("student123"), department="CSE", year=4, role="student",
                gpa=8.4, attendance=88.5, arrears=0, target_role="Java Developer"
            )
            demo_faculty = User(
                name="Dr. Rajesh Kumar", email="faculty@campusos.com", roll_number="FAC01",
                hashed_password=hash_password("faculty123"), department="CSE", year=None, role="faculty"
            )
            demo_tpo = User(
                name="Priya Nair (TPO Officer)", email="tpo@campusos.com", roll_number="TPO01",
                hashed_password=hash_password("tpo123"), department="Placement Cell", year=None, role="tpo"
            )
            demo_admin = User(
                name="System Administrator", email="admin@campusos.com", roll_number="ADM01",
                hashed_password=hash_password("admin123"), department="Administration", year=None, role="admin"
            )
            db.add_all([demo_student, demo_faculty, demo_tpo, demo_admin])
            db.commit()

            # Seed skills for demo student
            skills_data = [
                ("Java", "Technical", 82.0),
                ("OOP", "Technical", 86.0),
                ("DSA", "Coding", 68.0),
                ("SQL", "Technical", 76.0),
                ("REST API", "Technical", 65.0),
                ("Spring Boot", "Technical", 48.0),
                ("Git", "Technical", 72.0),
                ("Quantitative Aptitude", "Aptitude", 74.0),
                ("Communication", "Soft", 80.0),
            ]
            for sk_name, sk_cat, sk_score in skills_data:
                db.add(StudentSkill(student_id=demo_student.id, skill_name=sk_name, category=sk_cat, score=sk_score))

        db.commit()
        print("Database seeded with rooms, labs, companies, books, and demo accounts.")
    except Exception as e:
        print(f"Seeding error: {e}")
        db.rollback()
    finally:
        db.close()


# ---------------------------------------------------------------------------
# Lifespan — modern replacement for deprecated @app.on_event("startup")
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables and seed data
    Base.metadata.create_all(bind=engine)
    _seed_data()
    yield
    # Shutdown: nothing to clean up


# ---------------------------------------------------------------------------
# Initialize FastAPI app
# ---------------------------------------------------------------------------
app = FastAPI(
    title="CampusOS API 2.0",
    description="AI-Powered Student Success & Placement Intelligence Platform",
    version="2.0.0",
    docs_url="/docs",      # Swagger UI at http://localhost:8000/docs
    redoc_url="/redoc",    # ReDoc UI at http://localhost:8000/redoc
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# CORS — allow the React frontend to call the API
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",                   # Local Vite dev server
        "http://localhost:8000",                   # Local combined server
        "https://campus-os-lr7r.vercel.app",       # Vercel production frontend
        "https://campus-os.vercel.app",            # Vercel alt domain
        "https://*.vercel.app",                    # Any Vercel preview deployments
        "https://campusos1.onrender.com",          # Render backend (self)
        "https://campusos-1.onrender.com",         # Render backend (hyphenated self)
        "https://campusos-2.onrender.com",         # Render backend (new hyphenated self)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Register all routers (each handles a feature area)
# ---------------------------------------------------------------------------
app.include_router(auth.router)
app.include_router(hostel.router)
app.include_router(lab.router)
app.include_router(orchestrator.router)
app.include_router(admission.router)
app.include_router(admin.router)
app.include_router(notification.router)
app.include_router(meeting.router)

# CampusOS 2.0 New Routers
app.include_router(employability.router)
app.include_router(skill_gap.router)
app.include_router(placement.router)
app.include_router(mock_interview.router)
app.include_router(resume.router)
app.include_router(at_risk.router)
app.include_router(library.router)
app.include_router(audit.router)



@app.get("/health", tags=["Health"])
def health():
    return {
        "message": "🎓 Welcome to CampusOS API!",
        "status": "running",
        "docs": "/docs",
    }


class DebugLogRequest(BaseModel):
    message: str
    stack: Optional[str] = None


@app.post("/debug/log", tags=["Debug"])
def debug_log(req: DebugLogRequest):
    print("======== BROWSER JS ERROR ========")
    print(req.message)
    if req.stack:
        print(req.stack)
    print("==================================")
    return {"status": "ok"}



# ---------------------------------------------------------------------------
# Serve React Frontend static assets on port 8000
# ---------------------------------------------------------------------------
frontend_dist_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../frontend/dist"))

if os.path.exists(frontend_dist_path):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist_path, "assets")), name="assets")

    @app.get("/{catchall:path}")
    def serve_frontend(catchall: str):
        file_path = os.path.join(frontend_dist_path, catchall)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist_path, "index.html"))
