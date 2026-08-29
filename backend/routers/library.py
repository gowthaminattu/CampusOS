# routers/library.py
# Library System — Search, Issue, Return, Due Dates, and Automated Fine Calculation

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta

from database.db import get_db
from models.user import User, LibraryBook, LibraryTransaction
from routers.auth import get_current_user, require_roles

router = APIRouter(prefix="/api/library", tags=["Library System"])


class IssueBookRequest(BaseModel):
    book_id: int


class ReturnBookRequest(BaseModel):
    transaction_id: int


@router.get("/books")
def search_books(
    query: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    q = db.query(LibraryBook)
    if query:
        q = q.filter(LibraryBook.title.ilike(f"%{query}%") | LibraryBook.author.ilike(f"%{query}%"))
    if category:
        q = q.filter(LibraryBook.category.ilike(f"%{category}%"))
    return q.order_by(LibraryBook.title).all()


@router.post("/issue", status_code=status.HTTP_201_CREATED)
def issue_book(
    request: IssueBookRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    book = db.query(LibraryBook).filter(LibraryBook.id == request.book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    if book.available_copies <= 0:
        raise HTTPException(status_code=400, detail="No copies currently available for issue")

    # Prevent duplicate active issue of same book
    active_tx = db.query(LibraryTransaction).filter(
        LibraryTransaction.student_id == current_user.id,
        LibraryTransaction.book_id == book.id,
        LibraryTransaction.status == "Issued"
    ).first()

    if active_tx:
        raise HTTPException(status_code=400, detail="You already have an active issue for this book.")

    today = datetime.now().date()
    due = today + timedelta(days=14)

    tx = LibraryTransaction(
        student_id=current_user.id,
        book_id=book.id,
        issue_date=str(today),
        due_date=str(due),
        status="Issued",
        fine_amount=0.0
    )

    book.available_copies -= 1
    db.add(tx)
    db.commit()
    db.refresh(tx)

    return {"message": f"Book '{book.title}' issued successfully. Return due by {due}.", "transaction_id": tx.id}


@router.post("/return")
def return_book(
    request: ReturnBookRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    tx = db.query(LibraryTransaction).filter(LibraryTransaction.id == request.transaction_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction record not found")

    if tx.status == "Returned":
        raise HTTPException(status_code=400, detail="Book has already been returned")

    today = datetime.now().date()
    tx.return_date = str(today)
    tx.status = "Returned"

    # Fine calculation: Rs 5 per day overdue
    due = datetime.strptime(tx.due_date, "%Y-%m-%d").date()
    if today > due:
        overdue_days = (today - due).days
        tx.fine_amount = float(overdue_days * 5)

    book = db.query(LibraryBook).filter(LibraryBook.id == tx.book_id).first()
    if book:
        book.available_copies += 1

    db.commit()
    return {"message": f"Book returned successfully.", "fine_amount": tx.fine_amount}


@router.get("/my-transactions")
def get_my_transactions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    txs = db.query(LibraryTransaction).filter(LibraryTransaction.student_id == current_user.id).all()
    res = []
    for t in txs:
        res.append({
            "id": t.id,
            "book_title": t.book.title if t.book else "Book",
            "author": t.book.author if t.book else "Author",
            "issue_date": t.issue_date,
            "due_date": t.due_date,
            "return_date": t.return_date,
            "fine_amount": t.fine_amount,
            "status": t.status,
        })
    return res
