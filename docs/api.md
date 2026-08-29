# CampusOS 2.0 REST API Documentation

Base URL: `http://localhost:8000` (Local) / `https://campusos-2.onrender.com` (Production)

---

## Authentication (`/auth`)

### `POST /auth/register`
Creates a new student account.
- **Request Body**: `{ "name": "...", "email": "...", "roll_number": "...", "password": "...", "department": "CSE", "year": 4, "role": "student" }`
- **Response**: `UserResponse` object

### `POST /auth/login`
Authenticates user and returns JWT bearer token.
- **Form Data**: `username` (email), `password`
- **Response**: `{ "access_token": "...", "token_type": "bearer", "user": { ... } }`

---

## Employability Index (`/api/students`)

### `GET /api/students/{student_id}/employability`
Computes student employability index across 9 weighted parameters.
- **Response**: Overall score (0-100), readiness tier, category breakdown list, strengths, weaknesses, and AI recommendations.

---

## Skill Gap Engine (`/api/career`)

### `POST /api/career/skill-gap`
Compares student skills against target role benchmarks (Java Developer, Full Stack, Data Analyst, etc.).
- **Request Body**: `{ "target_role": "Java Developer" }`
- **Response**: Match %, matched skills, critical gaps, high priority gaps, and 8-week learning sequence.

---

## Placement & Eligibility (`/api/placement`)

### `GET /api/placement/drives`
Lists active campus recruitment job drives.

### `POST /api/placement/parse-jd`
AI service parsing raw Job Description text into structured fields.
- **Request Body**: `{ "jd_text": "..." }`

### `GET /api/placement/drives/{id}/eligibility`
Automated eligibility engine evaluating all students for a specific drive.

### `GET /api/placement/recommendations`
Returns scored job matches for the authenticated student.

---

## AI Mock Interview (`/api/mock-interviews`)

### `POST /api/mock-interviews`
Initializes adaptive interview session.

### `POST /api/mock-interviews/{id}/answer`
Evaluates student answer and adjusts difficulty adaptively.

### `GET /api/mock-interviews/{id}/result`
Returns 6-dimension evaluation report card.

---

## At-Risk Engine (`/api/faculty`)

### `GET /api/faculty/at-risk-students`
Early warning system evaluating attendance, CGPA, backlogs, and mock interview performance.
