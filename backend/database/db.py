# database/db.py
# Sets up the SQLAlchemy database engine and session factory.
# - Locally: uses SQLite (campusos.db) for zero-configuration development.
# - Production (Render/Railway): reads DATABASE_URL environment variable
#   which should point to a PostgreSQL database (e.g. Supabase, Neon, Railway Postgres).

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# ---------------------------------------------------------------------------
# Database URL
# ---------------------------------------------------------------------------
# Set DATABASE_URL as an environment variable in production.
# Example PostgreSQL URL: postgresql://user:password@host:5432/dbname
DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./campusos.db")

# Render/Vercel may inject postgres:// but SQLAlchemy requires postgresql://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# ---------------------------------------------------------------------------
# Engine — connect_args only needed for SQLite
# ---------------------------------------------------------------------------
is_sqlite = DATABASE_URL.startswith("sqlite")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if is_sqlite else {},
    # Pool settings for PostgreSQL (ignored for SQLite)
    pool_pre_ping=True,
)

# SessionLocal is the database session factory
# Each request will get its own session and close it after
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class that all ORM models will inherit from
Base = declarative_base()


def get_db():
    """
    FastAPI dependency that provides a database session per request.
    Always closes the session when the request is done (via finally).
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
