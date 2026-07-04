# services/orchestrator.py
# The AI Orchestrator service — the brain of CampusOS.
# It parses natural language input and routes it to the appropriate service.
#
# How it works:
# 1. The user sends a plain-English message (e.g. "Book Lab 2 tomorrow at 2 PM")
# 2. We run intent detection using keyword matching + regex
# 3. Based on the intent, we extract entities (lab name, date, time, etc.)
# 4. We call the corresponding database query or service
# 5. Return a unified, structured JSON response

import re
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from models.user import User, HostelRoom, HostelBooking, Lab, LabBooking


# ---------------------------------------------------------------------------
# Intent detection — returns one of the intent strings below
# ---------------------------------------------------------------------------
INTENTS = {
    "book_lab":         ["book lab", "reserve lab", "book me lab", "schedule lab"],
    "check_lab":        ["available labs", "lab availability", "show labs", "list labs", "which labs"],
    "book_hostel":      ["book hostel", "book room", "reserve hostel", "need a room", "hostel room"],
    "check_hostel":     ["hostel availability", "available rooms", "show rooms", "list rooms", "hostel rooms"],
    "my_bookings":      ["my bookings", "my reservations", "show bookings", "booking history", "what did i book"],
    "cancel_booking":   ["cancel booking", "cancel my booking", "cancel reservation"],
    "suggest_slots":    ["suggest", "free slot", "available slot", "when can i", "recommend"],
    "help":             ["help", "what can you do", "commands", "options"],
}


def detect_intent(message: str) -> str:
    """
    Detect the user's intent from natural language.
    Iterates through known intent patterns and returns the first match.
    Returns 'unknown' if no intent matches.
    """
    msg = message.lower()
    for intent, patterns in INTENTS.items():
        if any(pat in msg for pat in patterns):
            return intent
    return "unknown"


# ---------------------------------------------------------------------------
# Entity extractors — pull structured data from the message text
# ---------------------------------------------------------------------------
def extract_lab_name(message: str) -> str | None:
    """Extract a lab name like 'Lab 2', 'Lab A', 'CS Lab' from the message."""
    match = re.search(r"lab\s+(\w+)", message, re.IGNORECASE)
    if match:
        return f"Lab {match.group(1)}"
    return None


def extract_date(message: str) -> str:
    """
    Extract a date from the message.
    Supports: 'today', 'tomorrow', 'YYYY-MM-DD', or day names (Monday, etc.)
    Returns a YYYY-MM-DD string.
    """
    today = datetime.now().date()
    msg = message.lower()

    if "today" in msg:
        return str(today)
    if "tomorrow" in msg:
        return str(today + timedelta(days=1))
    if "day after tomorrow" in msg:
        return str(today + timedelta(days=2))

    # Try to find day names
    day_map = {
        "monday": 0, "tuesday": 1, "wednesday": 2, "thursday": 3,
        "friday": 4, "saturday": 5, "sunday": 6
    }
    for day_name, weekday in day_map.items():
        if day_name in msg:
            days_ahead = (weekday - today.weekday()) % 7
            if days_ahead == 0:
                days_ahead = 7  # Next occurrence
            return str(today + timedelta(days=days_ahead))

    # Try YYYY-MM-DD pattern
    match = re.search(r"\d{4}-\d{2}-\d{2}", message)
    if match:
        return match.group(0)

    # Default to tomorrow
    return str(today + timedelta(days=1))


def extract_time(message: str) -> tuple[str, str] | tuple[None, None]:
    """
    Extract start and end time from the message.
    Supports: '2 PM', '14:00', '9 AM to 11 AM', etc.
    Returns a tuple of (start_time, end_time) in HH:MM 24-hour format.
    """
    msg = message.lower()

    # Pattern: "9 AM to 11 AM" or "9am to 11am"
    range_match = re.search(
        r"(\d{1,2})\s*(am|pm)\s*(?:to|-)\s*(\d{1,2})\s*(am|pm)", msg
    )
    if range_match:
        start_h = int(range_match.group(1))
        start_period = range_match.group(2)
        end_h = int(range_match.group(3))
        end_period = range_match.group(4)
        start_h = _to_24h(start_h, start_period)
        end_h = _to_24h(end_h, end_period)
        return f"{start_h:02d}:00", f"{end_h:02d}:00"

    # Single time pattern: "at 2 PM", "at 14:00"
    single_match = re.search(r"(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)?", msg)
    if single_match:
        hour = int(single_match.group(1))
        minute = int(single_match.group(2) or 0)
        period = single_match.group(3)
        if period:
            hour = _to_24h(hour, period)
        elif hour < 8:
            hour += 12  # Assume PM for ambiguous hours (e.g., "at 2" → 14:00)
        return f"{hour:02d}:{minute:02d}", f"{hour + 1:02d}:{minute:02d}"

    return None, None


def _to_24h(hour: int, period: str) -> int:
    """Convert 12-hour time to 24-hour."""
    if period == "pm" and hour != 12:
        return hour + 12
    if period == "am" and hour == 12:
        return 0
    return hour


# ---------------------------------------------------------------------------
# Intent handlers — each function handles one intent
# ---------------------------------------------------------------------------
def handle_check_hostel(db: Session) -> dict:
    rooms = db.query(HostelRoom).all()
    available = [r for r in rooms if r.is_available]
    occupied = [r for r in rooms if not r.is_available]
    return {
        "intent": "check_hostel",
        "response": f"There are {len(available)} room(s) available out of {len(rooms)} total.",
        "data": {
            "total_rooms": len(rooms),
            "available": len(available),
            "occupied": len(occupied),
            "available_rooms": [
                {"id": r.id, "room_number": r.room_number, "type": r.room_type,
                 "block": r.block, "rent": r.monthly_rent}
                for r in available
            ],
        },
    }


def handle_check_lab(db: Session) -> dict:
    labs = db.query(Lab).filter(Lab.is_active == True).all()
    return {
        "intent": "check_lab",
        "response": f"There are {len(labs)} active lab(s) available.",
        "data": {
            "labs": [
                {"id": l.id, "name": l.name, "location": l.location, "capacity": l.capacity}
                for l in labs
            ]
        },
    }


def handle_book_lab(message: str, db: Session, user: User) -> dict:
    lab_name = extract_lab_name(message)
    booking_date = extract_date(message)
    start_time, end_time = extract_time(message)

    # Default time if none found
    if not start_time:
        start_time, end_time = "14:00", "15:00"

    if not lab_name:
        return {
            "intent": "book_lab",
            "response": "I couldn't identify the lab. Please mention the lab name (e.g., 'Book Lab 2 tomorrow at 2 PM').",
            "data": None,
        }

    # Find the lab (case-insensitive partial match)
    lab = db.query(Lab).filter(Lab.name.ilike(f"%{lab_name}%"), Lab.is_active == True).first()
    if not lab:
        return {
            "intent": "book_lab",
            "response": f"Sorry, I couldn't find '{lab_name}'. Use /lab to see available labs.",
            "data": None,
        }

    # Check for conflicts
    existing = (
        db.query(LabBooking)
        .filter(
            LabBooking.lab_id == lab.id,
            LabBooking.booking_date == booking_date,
            LabBooking.status == "confirmed",
        )
        .all()
    )
    for b in existing:
        if start_time < b.end_time and b.start_time < end_time:
            return {
                "intent": "book_lab",
                "response": f"Sorry, {lab.name} is already booked from {b.start_time} to {b.end_time} on {booking_date}.",
                "data": {"conflict": True, "conflicting_slot": f"{b.start_time}–{b.end_time}"},
            }

    # Create the booking
    booking = LabBooking(
        student_id=user.id,
        lab_id=lab.id,
        booking_date=booking_date,
        start_time=start_time,
        end_time=end_time,
        purpose="Booked via AI Assistant",
        status="confirmed",
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)

    return {
        "intent": "book_lab",
        "response": f"✅ Done! I've booked {lab.name} for you on {booking_date} from {start_time} to {end_time}.",
        "data": {
            "booking_id": booking.id,
            "lab": lab.name,
            "date": booking_date,
            "start_time": start_time,
            "end_time": end_time,
            "status": "confirmed",
        },
    }


def handle_my_bookings(db: Session, user: User) -> dict:
    hostel_bookings = (
        db.query(HostelBooking)
        .filter(HostelBooking.student_id == user.id, HostelBooking.status == "confirmed")
        .all()
    )
    lab_bookings = (
        db.query(LabBooking)
        .filter(LabBooking.student_id == user.id, LabBooking.status == "confirmed")
        .order_by(LabBooking.booking_date.desc())
        .limit(5)
        .all()
    )

    total = len(hostel_bookings) + len(lab_bookings)
    return {
        "intent": "my_bookings",
        "response": f"You have {len(hostel_bookings)} hostel booking(s) and {len(lab_bookings)} active lab booking(s).",
        "data": {
            "hostel_bookings": [
                {"room": b.room.room_number, "check_in": b.check_in_date, "status": b.status}
                for b in hostel_bookings
            ],
            "lab_bookings": [
                {"lab": b.lab.name, "date": b.booking_date, "time": f"{b.start_time}–{b.end_time}", "status": b.status}
                for b in lab_bookings
            ],
        },
    }


def handle_suggest_slots(message: str, db: Session) -> dict:
    booking_date = extract_date(message)
    lab_name = extract_lab_name(message)

    query = db.query(Lab).filter(Lab.is_active == True)
    if lab_name:
        query = query.filter(Lab.name.ilike(f"%{lab_name}%"))
    lab = query.first()

    if not lab:
        return {
            "intent": "suggest_slots",
            "response": "No lab found. Please specify a lab name.",
            "data": None,
        }

    booked = (
        db.query(LabBooking)
        .filter(LabBooking.lab_id == lab.id, LabBooking.booking_date == booking_date, LabBooking.status == "confirmed")
        .all()
    )

    free_slots = []
    for hour in range(8, 20):
        s, e = f"{hour:02d}:00", f"{hour + 1:02d}:00"
        if not any(s < b.end_time and b.start_time < e for b in booked):
            free_slots.append(f"{s}–{e}")

    slots_str = ", ".join(free_slots[:5]) if free_slots else "No free slots"
    return {
        "intent": "suggest_slots",
        "response": f"Available slots for {lab.name} on {booking_date}: {slots_str}",
        "data": {"lab": lab.name, "date": booking_date, "free_slots": free_slots},
    }


def handle_help() -> dict:
    return {
        "intent": "help",
        "response": "Here's what I can do for you:",
        "data": {
            "commands": [
                "📚 'Check hostel availability' — See available rooms",
                "🏠 'Book hostel room' — Reserve a hostel room",
                "🔬 'Show available labs' — See all labs",
                "📅 'Book Lab 2 tomorrow at 2 PM' — Reserve a lab slot",
                "📋 'Show my bookings' — View all your reservations",
                "💡 'Suggest free slots for Lab 3 tomorrow' — Get slot suggestions",
            ]
        },
    }


# ---------------------------------------------------------------------------
# Main orchestrator entry point
# ---------------------------------------------------------------------------
def process_message(message: str, db: Session, user: User) -> dict:
    """
    Main function called by the orchestrator router.
    Detects intent, routes to the correct handler, and returns a unified response.
    """
    intent = detect_intent(message)

    if intent == "check_hostel":
        return handle_check_hostel(db)
    elif intent == "check_lab":
        return handle_check_lab(db)
    elif intent == "book_lab":
        return handle_book_lab(message, db, user)
    elif intent == "book_hostel":
        return {
            "intent": "book_hostel",
            "response": "To book a hostel room, please use the Hostel Booking page. I'll guide you there!",
            "data": {"redirect": "/hostel"},
        }
    elif intent == "my_bookings":
        return handle_my_bookings(db, user)
    elif intent == "suggest_slots":
        return handle_suggest_slots(message, db)
    elif intent == "help":
        return handle_help()
    else:
        return {
            "intent": "unknown",
            "response": "I'm not sure what you mean. Try saying 'help' to see what I can do!",
            "data": None,
        }
