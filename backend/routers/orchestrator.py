# routers/orchestrator.py
# The AI chat endpoint — receives a natural language message and returns a structured response.
# POST /orchestrator/chat

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, Any

from database.db import get_db
from models.user import User
from routers.auth import get_current_user
from orchestrator import process_message

router = APIRouter(prefix="/orchestrator", tags=["AI Orchestrator"])


class ChatRequest(BaseModel):
    message: str  # Plain English message from the user


class ChatResponse(BaseModel):
    intent: str                # Detected intent (e.g., "book_lab")
    response: str              # Human-readable response message
    data: Optional[Any] = None # Structured data (depends on intent)


@router.post("/chat", response_model=ChatResponse)
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    AI Orchestrator endpoint.
    Send a natural language message and get a structured response back.

    Example inputs:
    - "Book Lab 2 tomorrow at 2 PM"
    - "Check hostel availability"
    - "Show my bookings"
    - "Suggest free slots for Lab 3 tomorrow"
    """
    result = process_message(request.message, db, current_user)
    return result
