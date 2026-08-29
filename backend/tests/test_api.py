# backend/tests/test_api.py
# Automated Pytest Suite for CampusOS 2.0 Backend Core Engines

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "running"

def test_employability_calculation():
    # Login as student
    login_res = client.post("/auth/login", data={"username": "student@campusos.com", "password": "student123"})
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    user_id = login_res.json()["user"]["id"]

    # Fetch Employability score
    headers = {"Authorization": f"Bearer {token}"}
    emp_res = client.get(f"/api/students/{user_id}/employability", headers=headers)
    assert emp_res.status_code == 200
    data = emp_res.json()

    assert "overall_score" in data
    assert "readiness_level" in data
    assert data["overall_score"] >= 0 and data["overall_score"] <= 100
    assert len(data["breakdown"]) == 9

def test_skill_gap_engine():
    login_res = client.post("/auth/login", data={"username": "student@campusos.com", "password": "student123"})
    token = login_res.json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}
    gap_res = client.post("/api/career/skill-gap", json={"target_role": "Java Developer"}, headers=headers)
    assert gap_res.status_code == 200
    data = gap_res.json()

    assert data["target_role"] == "Java Developer"
    assert "match_percentage" in data
    assert len(data["learning_sequence"]) == 8

def test_job_drive_eligibility_engine():
    # Login as TPO
    login_res = client.post("/auth/login", data={"username": "tpo@campusos.com", "password": "tpo123"})
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}
    elig_res = client.get("/api/placement/drives/1/eligibility", headers=headers)
    assert elig_res.status_code == 200
    data = elig_res.json()

    assert "total_evaluated" in data
    assert "eligible_count" in data
    assert isinstance(data["students"], list)

def test_mock_interview_adaptive():
    login_res = client.post("/auth/login", data={"username": "student@campusos.com", "password": "student123"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Start mock interview
    start_res = client.post("/api/mock-interviews", json={"target_role": "Java Developer", "initial_difficulty": "Medium"}, headers=headers)
    assert start_res.status_code == 201
    interview_id = start_res.json()["interview_id"]

    # Submit detailed answer
    ans_res = client.post(f"/api/mock-interviews/{interview_id}/answer", json={
        "student_answer": "In Java, JVM handles bytecode execution and garbage collection using generational memory heaps. HashMap uses hashed keys and bucket arrays."
    }, headers=headers)
    assert ans_res.status_code == 200
    assert "current_score" in ans_res.json()
