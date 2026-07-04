# CampusOS — AI-Powered Campus Platform 🎓

A full-stack platform for college students featuring hostel booking, lab scheduling, and an AI assistant — built with **FastAPI** + **React + Vite**.

---

## 🚀 Quick Start

### 1. Backend (FastAPI)

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Start the server (auto-reloads on file changes)
uvicorn main:app --reload
```

Backend runs at: **http://localhost:8000**  
Swagger docs: **http://localhost:8000/docs**

---

### 2. Frontend (React + Vite)

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## 📁 Project Structure

```
CampusOS/
├── backend/
│   ├── main.py                    # FastAPI entry point + data seeding
│   ├── requirements.txt
│   ├── database/
│   │   └── db.py                  # SQLAlchemy setup (SQLite)
│   ├── models/
│   │   └── user.py                # ORM models: User, HostelRoom, Lab, Bookings
│   ├── routers/
│   │   ├── auth.py                # POST /auth/register, /auth/login, GET /auth/me
│   │   ├── hostel.py              # GET /hostel/rooms, POST /hostel/book, etc.
│   │   ├── lab.py                 # GET /lab/labs, /lab/slots, POST /lab/book, etc.
│   │   └── orchestrator.py        # POST /orchestrator/chat
│   └── services/
│       └── orchestrator.py        # AI intent detection + routing logic
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx                # Router + protected routes
        ├── index.css              # Global design system
        ├── api/
        │   └── axios.js           # Axios instance with JWT interceptor
        └── components/
            ├── Navbar.jsx
            ├── Login.jsx
            ├── Register.jsx
            ├── Dashboard.jsx
            ├── HostelBooking.jsx
            ├── LabBooking.jsx
            └── AIChat.jsx
```

---

## 🔑 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new student |
| POST | `/auth/login` | Login, get JWT token |
| GET  | `/auth/me` | Get current user profile |
| GET  | `/hostel/rooms` | List all hostel rooms |
| POST | `/hostel/book` | Book a room |
| GET  | `/hostel/bookings` | My hostel bookings |
| DELETE | `/hostel/cancel/{id}` | Cancel hostel booking |
| GET  | `/lab/labs` | List all labs |
| GET  | `/lab/slots/{lab_id}` | Get time slots for a lab |
| POST | `/lab/book` | Book a lab slot |
| GET  | `/lab/bookings` | My lab bookings |
| DELETE | `/lab/cancel/{id}` | Cancel lab booking |
| POST | `/orchestrator/chat` | AI natural language query |

---

## 🤖 AI Assistant Examples

Send these to `POST /orchestrator/chat`:

```json
{ "message": "Check hostel availability" }
{ "message": "Book Lab 2 tomorrow at 2 PM" }
{ "message": "Show my bookings" }
{ "message": "Suggest free slots for Lab 3 tomorrow" }
{ "message": "Show available labs" }
```

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
