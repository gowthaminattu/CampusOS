# CampusOS 2.0 System Architecture & Engineering Design

CampusOS 2.0 is an enterprise-grade AI-powered campus management and student placement intelligence platform. It bridges academic performance, skill acquisition, career tracking, and tier-1 campus recruitment into a unified multi-persona SaaS environment.

---

## 1. High-Level System Architecture

```
                               ┌────────────────────────────────────────┐
                               │            React 18 + Vite             │
                               │          Single Page App (SPA)         │
                               └──────────────────┬─────────────────────┘
                                                  │
                                          HTTPS / REST APIs
                                          JWT Authorization
                                                  │
                                                  ▼
                               ┌────────────────────────────────────────┐
                               │           FastAPI Backend App          │
                               │       Uvicorn ASGI High Performance     │
                               └──────┬───────────┬───────────┬─────────┘
                                      │           │           │
                 ┌────────────────────┴─┐   ┌─────┴──────┐   ┌┴────────────────────┐
                 │ Employability Engine │   │ AI Services│   │ Automated Eligibility│
                 │   (9 Weighted Metrics)│   │ (Mock, JD) │   │   & Placement Pipeline│
                 └──────────────────────┘   └────────────┘   └─────────────────────┘
                                                  │
                                                  ▼
                               ┌────────────────────────────────────────┐
                               │       SQLAlchemy ORM Data Access       │
                               │    (SQLite Local / PostgreSQL Prod)    │
                               └────────────────────────────────────────┘
```

---

## 2. Multi-Persona User Roles & RBAC Matrix

CampusOS 2.0 implements strict role-based access control (RBAC) across 4 discrete user personas:

| Feature / Resource | Student | Faculty | TPO Officer | Admin |
| :--- | :---: | :---: | :---: | :---: |
| Employability Score & Radar | View Own | View Department | View All | View All |
| Skill Gap & Learning Roadmap | Yes | View Department | View All | View All |
| AI Adaptive Mock Interview | Take | View Results | View Analytics | Full Access |
| Resume ATS Analyzer | Analyze | - | - | Full Access |
| Placement Job Drives | Apply | View Drives | Create & Manage | Full Access |
| AI JD Parser | - | - | Create & Parse | Full Access |
| Automated Eligibility Engine | View Eligibility | - | Execute & Filter | Full Access |
| At-Risk Early Warning System | - | Full Roster | Placement Risk | Full Access |
| Library Book System | Issue / Return | View Catalog | View Catalog | Full Access |
| Immutable Audit Logs | - | - | - | Full Access |

---

## 3. Core Engine Mechanics

### A. Employability Index Engine
Calculates weighted composite employability rating out of 100:
- **Academic Performance (GPA/CGPA)**: 15%
- **Attendance Percentage**: 10%
- **Technical Skills Matrix**: 15%
- **Coding Skills (DSA, Problem Solving)**: 15%
- **Quantitative & Logical Aptitude**: 10%
- **Communication Skills**: 10%
- **Mock Interview Performance**: 10%
- **Resume Strength (ATS Rating)**: 5%
- **Hands-on Projects & Experience**: 10%

Readiness Tiers:
- `0 - 39`: Needs Improvement
- `40 - 59`: Developing
- `60 - 74`: Almost Ready
- `75 - 89`: Placement Ready
- `90 - 100`: Highly Competitive

### B. Automated Eligibility Engine
Backend decision logic evaluating student eligibility against company cutoff rules:
- `CGPA >= min_cgpa`
- `Active Backlogs <= max_backlogs`
- `Department IN allowed_branches`

Returns detailed pass/fail status alongside precise failure reasons.

### C. Adaptive AI Mock Interview Simulator
Dynamically adjusts question difficulty (Easy → Medium → Hard) based on student technical depth and STAR technique keywords. Generates 6-dimension evaluation reports:
- Technical Accuracy
- Relevance
- Communication
- Completeness
- Confidence
- Clarity
