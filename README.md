# CampusOS — AI-Powered Campus Platform 🎓

A full-stack platform for college students featuring hostel booking, lab scheduling, placement tracking, library management, fee inquiry, timetable, events, admin panel, analytics, and an AI assistant — built with **FastAPI** + **React + Vite**.

---

## 🚀 Quick Start

### Option A — Single URL (Recommended)

Run frontend + backend from **one link**: `http://localhost:8000`

```bash
# 1. Install backend dependencies
cd backend
pip install -r requirements.txt

# 2. Build the frontend
cd ../frontend
npm install
npm run build

# 3. Start the backend (serves React app + API together)
cd ../backend
uvicorn main:app --reload
```

Open **http://localhost:8000** — done!

---

### Option B — Separate Dev Servers

Better for active frontend development (hot reload).

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# → http://localhost:8000
```

**Frontend (in a new terminal):**
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

Swagger docs: **http://localhost:8000/docs**

---

## � Deploy to Hugging Face Spaces (Docker)

This project is ready for a Docker-based Hugging Face Space.

### What to use
- [Dockerfile](Dockerfile) builds the frontend and starts the FastAPI backend.
- [start.sh](start.sh) launches the app on the port provided by Hugging Face via $PORT.
- [docker-compose.yml](docker-compose.yml) is available for local testing.

### Space setup
1. Create a new Hugging Face Space.
2. Choose the Docker option.
3. Connect this repository or upload the project files.
4. Hugging Face will build from [Dockerfile](Dockerfile) automatically.
5. Set any required environment variables in the Space settings, such as:
   - DATABASE_URL
   - GOOGLE_API_KEY (if you use the AI features that depend on it)

The app will be served on port 7860, which is compatible with Hugging Face Spaces.

---

## �📁 Project Structure

```
CampusOS/
├── backend/
│   ├── main.py                     # FastAPI entry point + data seeding + static file serving
│   ├── requirements.txt
│   ├── orchestrator.py             # Top-level AI orchestrator
│   ├── database/
│   │   └── db.py                   # SQLAlchemy setup (SQLite)
│   ├── models/
│   │   └── user.py                 # ORM models: User, HostelRoom, Lab, Bookings
│   ├── routers/
│   │   ├── auth.py                 # /auth — register, login, me, change-password
│   │   ├── hostel.py               # /hostel — rooms, book, bookings, cancel
│   │   ├── lab.py                  # /lab — labs, slots, book, bookings, cancel
│   │   ├── admission.py            # /admission — apply, status, list
│   │   ├── admin.py                # /admin — student management, analytics
│   │   └── orchestrator.py         # /orchestrator — AI chat endpoint
│   ├── agents/
│   │   ├── hostel_agent.py         # Hostel booking AI agent
│   │   ├── lab_agent.py            # Lab scheduling AI agent
│   │   ├── placement_agent.py      # Placement & career AI agent
│   │   ├── library_agent.py        # Library AI agent
│   │   ├── fee_agent.py            # Fee inquiry AI agent
│   │   ├── timetable_agent.py      # Timetable AI agent
│   │   ├── event_agent.py          # Events AI agent
│   │   └── helpdesk_agent.py       # General helpdesk AI agent
│   └── services/
│       └── orchestrator.py         # AI intent detection + multi-agent routing
│
└── frontend/
    ├── index.html
    ├── vite.config.js              # Dev proxy → backend
    └── src/
        ├── main.jsx
        ├── App.jsx                 # Router + protected routes
        ├── index.css               # Global design system
        ├── api/
        │   └── axios.js            # Axios instance with JWT interceptor
        ├── context/
        │   └── AuthContext.jsx     # Auth state + token management
        ├── pages/                  # Page-level wrappers
        └── components/
            ├── Login.jsx           # Auth — login
            ├── Register.jsx        # Auth — register
            ├── Navbar.jsx          # Top navigation bar
            ├── Sidebar.jsx         # Side navigation
            ├── Dashboard.jsx       # Home dashboard with stats
            ├── HostelBooking.jsx   # Hostel room booking
            ├── Hostel.jsx          # Hostel overview
            ├── LabBooking.jsx      # Lab slot booking
            ├── AIChat.jsx          # AI assistant chat UI
            ├── Analytics.jsx       # Admin analytics & charts
            ├── AdmissionForm.jsx   # Student admission form
            ├── AdmissionManagement.jsx # Admin admission list
            ├── StudentManagement.jsx   # Admin student CRUD
            ├── Placement.jsx       # Placement tracker
            ├── Library.jsx         # Library management
            ├── FeeInquiry.jsx      # Fee inquiry
            ├── Timetable.jsx       # Class timetable
            ├── EventRegistration.jsx   # Campus event registration
            └── Settings.jsx        # User profile & settings
```

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new student |
| POST | `/auth/login` | Login, get JWT token |
| GET  | `/auth/me` | Get current user profile |
| PUT  | `/auth/change-password` | Change password |

### Hostel
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/hostel/rooms` | List all hostel rooms |
| POST | `/hostel/book` | Book a room |
| GET  | `/hostel/bookings` | My hostel bookings |
| DELETE | `/hostel/cancel/{id}` | Cancel hostel booking |

### Lab
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/lab/labs` | List all labs |
| GET  | `/lab/slots/{lab_id}` | Get time slots for a lab |
| POST | `/lab/book` | Book a lab slot |
| GET  | `/lab/bookings` | My lab bookings |
| DELETE | `/lab/cancel/{id}` | Cancel lab booking |

### Admission
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/admission/apply` | Submit admission application |
| GET  | `/admission/status` | Check my application status |
| GET  | `/admission/list` | List all applications (admin) |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/admin/students` | List all students |
| GET  | `/admin/analytics` | Platform analytics |

### AI Orchestrator
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/orchestrator/chat` | Natural language AI query |

---

## 🤖 AI Assistant Examples

Send to `POST /orchestrator/chat`:

```json
{ "message": "Check hostel availability" }
{ "message": "Book Lab 2 tomorrow at 2 PM" }
{ "message": "Show my bookings" }
{ "message": "What placement drives are happening?" }
{ "message": "Is the library open now?" }
{ "message": "What are my fees due?" }
{ "message": "Show my timetable for Monday" }
{ "message": "Register me for the tech fest event" }
```

The AI orchestrator automatically routes your query to the correct specialist agent.

---

## 🛡️ Authentication

All endpoints (except `/auth/register` and `/auth/login`) require a JWT Bearer token:

```
Authorization: Bearer <your_access_token>
```

Tokens expire after **24 hours**.

---

## 🌱 Seed Data

On first startup, the backend automatically seeds:
- **8 hostel rooms** across 3 blocks (A, B, C) with varying types and amenities
- **6 labs**: Lab 1, Lab 2, Lab 3, Networks Lab, AI/ML Lab, Electronics Lab

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI, SQLAlchemy, SQLite, JWT |
| Frontend | React 18, Vite, React Router, Recharts |
| AI Agents | Multi-agent orchestration with intent detection |
| Styling | Tailwind CSS, Lucide Icons |
| Deployment | Vercel (frontend) + Railway (backend) |
