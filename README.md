# CampusOS 2.0 — AI-Powered Student Success & Campus Intelligence Platform 🎓

CampusOS 2.0 is an enterprise-grade SaaS student success, placement intelligence, and campus operations platform built with **Java (Spring Boot 3)**, **Spring Data JPA**, **Spring Security**, **JWT**, **React 18**, **Vite**, and **Tailwind CSS**. It connects:

```
ACADEMICS ──► SKILLS ──► CAREER ──► PLACEMENT ──► CAMPUS OPERATIONS
```

---

## 🎯 Key Features & Core Engines

- **Employability Index Engine**: Calculates student employability score (0-100) across 9 weighted parameters into 5 readiness tiers (*Needs Improvement*, *Developing*, *Almost Ready*, *Placement Ready*, *Highly Competitive*).
- **AI Skill Gap Engine**: Compares verified student skills against target role benchmarks (e.g. Java Dev, Full Stack, Data Analyst) and outputs a personalized 8-week learning sequence.
- **Adaptive AI Mock Interview Simulator**: Question progression dynamically scales in difficulty (Easy → Medium → Hard) based on student answer technical depth, outputting a 6-dimension evaluation report card.
- **AI Job Description Parser**: TPO tool that extracts structured requirements (Company, Role, Cutoff CGPA, Max Backlogs, Allowed Branches, Required Skills, Package) from plain text JDs.
- **Automated Eligibility Engine**: Evaluates student eligibility against job drive rules on the backend and returns exact pass/fail reasons.
- **Resume ATS Analyzer**: Resume extraction + Job Description keyword match score tool.
- **Faculty Early-Warning At-Risk Engine**: Flags Low/Medium/High/Critical risk students based on attendance, CGPA, backlogs, and mock interview performance.
- **Multi-Persona User Roles & Sidebars**: Dedicated navigation suites for **Student**, **Faculty**, **TPO Officer**, and **Admin**.
- **Campus Operations**: Hostel allocation, Lab slot booking with staff-only restrictions, Admission management, Library borrowing with automated overdue fine calculation.
- **Immutable Audit Trail & Analytics**: Campus-wide telemetry and security audit logging for administrative governance.

---

## 🔑 Demo Account Credentials

Use these pre-seeded demo accounts to test each role persona:

| Role Persona | Email | Password | Access Highlights |
| :--- | :--- | :--- | :--- |
| **Student** | `student@campusos.com` | `student123` | Employability Index, Skill Gap, AI Mock Interview, Resume ATS |
| **Faculty** | `faculty@campusos.com` | `faculty123` | Class Attendance, Student Performance, At-Risk Roster |
| **TPO Officer** | `tpo@campusos.com` | `tpo123` | Placement Command Center, AI JD Parser, Eligibility Engine, Funnel |
| **Admin** | `admin@campusos.com` | `admin123` | Campus Analytics, User Management, Immutable Audit Logs |

---

## 🚀 Quick Start Guide

### 1. Java Spring Boot Backend Setup & Test Execution
```bash
# Navigate to backend
cd backend

# Run automated backend core engine tests (Maven)
..\maven\apache-maven-3.9.6\bin\mvn.cmd test

# Start Java Spring Boot application (Port 8000)
..\maven\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
# → API Health: http://localhost:8000/health
```

### 2. Frontend Setup
```bash
# Open new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Run Vite dev server
npm run dev
# → App UI: http://localhost:5173
```

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: React 18, Vite 5, React Router v7, Recharts, Lucide React, Custom CSS Design System + Tailwind CSS.
- **Backend**: Java 17/21/25, Spring Boot 3.2, Spring Data JPA, Spring Security, H2 Database (`campusos_h2_db`) / PostgreSQL ready.
- **Authentication**: JWT Bearer Tokens (`jjwt`), 4-Tier RBAC authorization middleware.
- **Documentation**: Detailed system architecture in [`docs/architecture.md`](docs/architecture.md) and API contracts in [`docs/api.md`](docs/api.md).
