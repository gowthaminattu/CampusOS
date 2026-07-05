# routers/auth.py
# Handles all authentication-related endpoints:
# - POST /auth/register  → Create a new student account
# - POST /auth/login     → Login and receive a JWT token
# - GET  /auth/me        → Get the currently logged-in user

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timedelta
from jose import JWTError, jwt
import bcrypt

import os

from database.db import get_db
from models.user import User

# ---------------------------------------------------------------------------
# Configuration — change SECRET_KEY in production!
# ---------------------------------------------------------------------------
SECRET_KEY = os.environ.get("SECRET_KEY", "campusos-super-secret-key-2024")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# OAuth2 scheme — looks for "Authorization: Bearer <token>" header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

router = APIRouter(prefix="/auth", tags=["Authentication"])


# ---------------------------------------------------------------------------
# Pydantic schemas — define the shape of request/response bodies
# ---------------------------------------------------------------------------
class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    roll_number: str
    password: str
    department: Optional[str] = None
    year: Optional[int] = None
    role: Optional[str] = "student"  # 'student' or 'staff'


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    roll_number: str
    department: Optional[str]
    year: Optional[int]
    role: str
    gpa: Optional[float]
    attendance: Optional[float]
    phone: Optional[str]

    class Config:
        from_attributes = True  # Allows converting SQLAlchemy objects to Pydantic


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


# ---------------------------------------------------------------------------
# Helper functions
# ---------------------------------------------------------------------------
def hash_password(password: str) -> str:
    """Hash a plain-text password using bcrypt."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Check if a plain-text password matches the stored hash."""
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT token with an expiration time."""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    """
    FastAPI dependency — decodes the JWT token and returns the current user.
    Used to protect any endpoint that requires authentication.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception
    return user


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new student account."""

    # Check if email already exists
    if db.query(User).filter(User.email == request.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Check if roll number already exists
    if db.query(User).filter(User.roll_number == request.roll_number).first():
        raise HTTPException(status_code=400, detail="Roll number already registered")

    # Create new user with hashed password
    new_user = User(
        name=request.name,
        email=request.email,
        roll_number=request.roll_number,
        hashed_password=hash_password(request.password),
        department=request.department,
        year=request.year,
        role=request.role or "student",
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Login with email + password. Returns a JWT access token.
    Note: OAuth2PasswordRequestForm uses 'username' field — we treat it as email.
    """
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return {"access_token": token, "token_type": "bearer", "user": user}


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Return the currently authenticated user's profile."""
    return current_user


# ---------------------------------------------------------------------------
# Change password
# ---------------------------------------------------------------------------
class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


@router.put("/change-password")
def change_password(
    request: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Change the authenticated user's password after verifying the current one."""
    if not verify_password(request.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )
    if len(request.new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 6 characters",
        )
    current_user.hashed_password = hash_password(request.new_password)
    db.commit()
    return {"message": "Password changed successfully"}
