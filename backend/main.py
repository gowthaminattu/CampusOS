# main.py
# Entry point for the CampusOS FastAPI backend.
# Run with: uvicorn main:app --reload

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional

from database.db import engine, Base
from models import user as models_user   # noqa: F401 — import triggers table creation
from routers import auth, hostel, lab, orchestrator, admission, admin, notification, meeting

# ---------------------------------------------------------------------------
# Seed function — runs once on startup to populate rooms and labs
# ---------------------------------------------------------------------------
def _seed_data():
    """
    Seed the database with sample hostel rooms and labs if they don't exist.
    This runs automatically when the server starts.
    """
    from database.db import SessionLocal
    from models.user import HostelRoom, Lab

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
                    equipment="GPU Workstations, TensorFlow, PyTorch, CUDA", is_active=True),
                Lab(name="Electronics Lab", location="Block C, Room 302", capacity=30,
                    equipment="Oscilloscopes, Multimeters, Breadboards, Arduino", is_active=True),
            ]
            db.add_all(labs)

        db.commit()
        print("Database seeded with rooms and labs.")
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
    title="CampusOS API",
    description="AI-powered campus management platform for college students.",
    version="1.0.0",
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
