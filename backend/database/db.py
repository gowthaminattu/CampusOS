# database/db.py
# Sets up the SQLAlchemy database engine and session factory.
# We use SQLite for simplicity — easily swappable with PostgreSQL.

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLite database file will be created in the backend/ directory
DATABASE_URL = "sqlite:///./campusos.db"

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
