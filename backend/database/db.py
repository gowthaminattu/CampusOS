# database/db.py
# Sets up the SQLAlchemy database engine and session factory.
# We use SQLite for simplicity - easily swappable with PostgreSQL.

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLite database file will be created in /tmp on serverless environments
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:////tmp/campusos.db")

# Create the SQLAlchemy engine
# check_same_thread=False is needed for SQLite to work with FastAPI's async nature
engine = create_engine(
        DATABASE_URL, connect_args={"check_same_thread": False}
)

# SessionLocal is the database session factory
# Each request will get its own session and close it after
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class that all ORM models will inherit from
Base = declarative_base()

# Dependency to get db session
def get_db():
        db = SessionLocal()
        try:
                    yield db
finally:
        db.close()
    
