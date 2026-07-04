# agents/lab_agent.py
import re
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from models.user import Lab, LabBooking, User

class LabAgent:
    def __init__(self):
        pass

    def extract_lab_name(self, message: str) -> str | None:
        match = re.search(r"lab\s+(\w+)", message, re.IGNORECASE)
        if match:
            return f"Lab {match.group(1)}"
        if "networks lab" in message.lower():
            return "Networks Lab"
        if "ai/ml lab" in message.lower():
            return "AI/ML Lab"
        if "electronics lab" in message.lower():
            return "Electronics Lab"
        return None

    def extract_date(self, message: str) -> str:
        today = datetime.now().date()
        msg = message.lower()
        if "today" in msg:
            return str(today)
        if "tomorrow" in msg:
            return str(today + timedelta(days=1))
        match = re.search(r"\d{4}-\d{2}-\d{2}", message)
        if match:
            return match.group(0)
        return str(today + timedelta(days=1))

    def extract_time(self, message: str) -> tuple[str, str] | tuple[None, None]:
        msg = message.lower()
        range_match = re.search(r"(\d{1,2})\s*(am|pm)\s*(?:to|-)\s*(\d{1,2})\s*(am|pm)", msg)
        if range_match:
            start_h = int(range_match.group(1))
            start_period = range_match.group(2)
            end_h = int(range_match.group(3))
            end_period = range_match.group(4)
            
            if start_period == "pm" and start_h != 12:
                start_h += 12
            if start_period == "am" and start_h == 12:
                start_h = 0
            if end_period == "pm" and end_h != 12:
                end_h += 12
            if end_period == "am" and end_h == 12:
                end_h = 0
            return f"{start_h:02d}:00", f"{end_h:02d}:00"
        
        single_match = re.search(r"(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)?", msg)
        if single_match:
            hour = int(single_match.group(1))
            minute = int(single_match.group(2) or 0)
            period = single_match.group(3)
            if period == "pm" and hour != 12:
                hour += 12
            elif period == "am" and hour == 12:
                hour = 0
            elif not period and hour < 8:
                hour += 12
            return f"{hour:02d}:{minute:02d}", f"{hour + 1:02d}:{minute:02d}"
        return None, None

    def handle(self, message: str, db: Session, user: User) -> dict:
        msg = message.lower()
        
        is_view_request = any(w in msg for w in ["view", "check", "show", "list", "available"])
        is_book_request = any(w in msg for w in ["book", "reserve", "schedule"])
        is_cancel_request = any(w in msg for w in ["cancel", "delete", "remove"])

        # 1. VIEW LABS
        if is_view_request and not is_book_request:
            lab_name = self.extract_lab_name(message)
            booking_date = self.extract_date(message)
            
            if lab_name:
                lab = db.query(Lab).filter(Lab.name.ilike(f"%{lab_name}%")).first()
                if not lab:
                    return {
                        "agent": "lab",
                        "response": f"Sorry, I couldn't find '{lab_name}'. Please select another lab.",
                        "data": None
                    }
                
                booked = db.query(LabBooking).filter(
                    LabBooking.lab_id == lab.id,
                    LabBooking.booking_date == booking_date,
                    LabBooking.status == "confirmed"
                ).all()
                
                free_slots = []
                for hour in range(8, 20):
                    s, e = f"{hour:02d}:00", f"{hour + 1:02d}:00"
                    if not any(s < b.end_time and b.start_time < e for b in booked):
                        free_slots.append(f"{s}–{e}")
                
                slots_str = ", ".join(free_slots[:5]) if free_slots else "No free slots"
                return {
                    "agent": "lab",
                    "response": f"Available slots for {lab.name} on {booking_date}: {slots_str}",
                    "data": {"lab": lab.name, "date": booking_date, "free_slots": free_slots}
                }
            
            else:
                labs = db.query(Lab).filter(Lab.is_active == True).all()
                lab_list = "\n".join([f"• **{l.name}** - 📍 {l.location} (Capacity: {l.capacity})" for l in labs])
                return {
                    "agent": "lab",
                    "response": f"🔬 **Available Labs on Campus:**\n\n{lab_list}",
                    "data": {"labs": [{"id": l.id, "name": l.name} for l in labs]}
                }

        # 2. BOOK LAB
        if is_book_request:
            # Check permissions
            if user.role != "staff":
                return {
                    "agent": "lab",
                    "response": "🚫 **Access Denied:** Only professors and staff members can create or modify lab bookings. Students are only allowed to view schedules.",
                    "data": {"error": "unauthorized"}
                }
            
            lab_name = self.extract_lab_name(message)
            booking_date = self.extract_date(message)
            start_time, end_time = self.extract_time(message)

            if not lab_name:
                return {
                    "agent": "lab",
                    "response": "I couldn't identify which lab you want to book. Please mention a lab (e.g. 'Book Lab 2 tomorrow at 2 PM').",
                    "data": None
                }
            
            if not start_time:
                start_time, end_time = "14:00", "15:00"

            lab = db.query(Lab).filter(Lab.name.ilike(f"%{lab_name}%")).first()
            if not lab:
                return {
                    "agent": "lab",
                    "response": f"Sorry, '{lab_name}' does not exist or is inactive.",
                    "data": None
                }

            # Conflict check
            conflict = db.query(LabBooking).filter(
                LabBooking.lab_id == lab.id,
                LabBooking.booking_date == booking_date,
                LabBooking.status == "confirmed",
                LabBooking.start_time < end_time,
                LabBooking.end_time > start_time
            ).first()

            if conflict:
                return {
                    "agent": "lab",
                    "response": f"❌ Conflict detected: {lab.name} is already booked on {booking_date} during {conflict.start_time}–{conflict.end_time}.",
                    "data": {"conflict": True}
                }

            # Create booking
            booking = LabBooking(
                student_id=user.id,
                lab_id=lab.id,
                booking_date=booking_date,
                start_time=start_time,
                end_time=end_time,
                purpose="AI Agent Booking",
                status="confirmed"
            )
            db.add(booking)
            db.commit()
            db.refresh(booking)

            return {
                "agent": "lab",
                "response": f"✅ **Lab Booked Successfully!**\n• Lab: **{lab.name}**\n• Date: {booking_date}\n• Time: {start_time} to {end_time}\n\n*Notification sent to HOD / Department Professor.*",
                "data": {
                    "booking_id": booking.id,
                    "lab": lab.name,
                    "date": booking_date,
                    "start_time": start_time,
                    "end_time": end_time
                }
            }

        # 3. CANCEL BOOKING
        if is_cancel_request:
            if user.role != "staff":
                return {
                    "agent": "lab",
                    "response": "🚫 **Access Denied:** Only professors and staff members can cancel bookings.",
                    "data": {"error": "unauthorized"}
                }
            
            # Find last booking of this staff
            last_booking = db.query(LabBooking).filter(
                LabBooking.student_id == user.id,
                LabBooking.status == "confirmed"
            ).order_by(LabBooking.booked_at.desc()).first()

            if not last_booking:
                return {
                    "agent": "lab",
                    "response": "You don't have any active lab bookings to cancel.",
                    "data": None
                }

            last_booking.status = "cancelled"
            db.commit()

            return {
                "agent": "lab",
                "response": f"🗑️ Lab booking for **{last_booking.lab.name}** on {last_booking.booking_date} has been cancelled successfully.",
                "data": {"cancelled_id": last_booking.id}
            }

        return {
            "agent": "lab",
            "response": "I am the Lab Booking Agent. Tell me which lab, date, or slot you are inquiring about.",
            "data": None
        }
