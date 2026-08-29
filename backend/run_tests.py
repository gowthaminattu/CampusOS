# backend/run_tests.py
# Test runner using FastAPI TestClient

from database.db import engine, Base
from main import _seed_data
from tests.test_api import (
    test_health_check,
    test_employability_calculation,
    test_skill_gap_engine,
    test_job_drive_eligibility_engine,
    test_mock_interview_adaptive,
)

if __name__ == "__main__":
    print("Initializing Database & Seeding Demo Accounts...")
    Base.metadata.create_all(bind=engine)
    _seed_data()

    print("Running CampusOS 2.0 Backend Core Engine Tests...")
    test_health_check()
    print("[OK] Health Check Passed")
    test_employability_calculation()
    print("[OK] Employability Index Engine Passed")
    test_skill_gap_engine()
    print("[OK] Skill Gap Engine Passed")
    test_job_drive_eligibility_engine()
    print("[OK] Job Drive Eligibility Engine Passed")
    test_mock_interview_adaptive()
    print("[OK] Adaptive AI Mock Interview Engine Passed")
    print("ALL BACKEND CORE TESTS PASSED SUCCESSFULLY!")
