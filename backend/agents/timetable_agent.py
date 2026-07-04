# agents/timetable_agent.py
import re
from datetime import datetime

class TimetableAgent:
    def __init__(self):
        # Sample timetables by department
        self.schedules = {
            "Computer Science": {
                "Monday": [
                    {"time": "09:00 AM–10:00 AM", "subject": "Digital Signal Processing", "room": "Block A, LH-101"},
                    {"time": "10:15 AM–11:15 AM", "subject": "Theory of Computation", "room": "Block A, LH-102"},
                    {"time": "11:30 AM–01:30 PM", "subject": "Microprocessor Lab", "room": "Lab 1"},
                ],
                "Tuesday": [
                    {"time": "09:00 AM–10:00 AM", "subject": "Computer Networks", "room": "Block A, LH-201"},
                    {"time": "10:15 AM–12:15 PM", "subject": "AI & Machine Learning", "room": "Block C, ML-Room"},
                    {"time": "02:00 PM–04:00 PM", "subject": "Operating Systems Lab", "room": "Lab 3"},
                ],
                "Wednesday": [
                    {"time": "09:00 AM–10:00 AM", "subject": "Software Engineering", "room": "Block A, LH-101"},
                    {"time": "11:00 AM–01:00 PM", "subject": "Database Management", "room": "Block A, LH-102"},
                ]
            }
        }
        # Fallback schedule
        self.default_schedule = [
            {"time": "09:00 AM–10:00 AM", "subject": "Professional Communication", "room": "Block A, LH-301"},
            {"time": "11:00 AM–01:00 PM", "subject": "Engineering Mathematics", "room": "Block B, LH-105"},
            {"time": "02:00 PM–04:00 PM", "subject": "Programming Lab", "room": "Lab 2"}
        ]
        self.faculty_info = (
            "👨‍🏫 **Faculty Information:**\n"
            "• **Dr. R. Sharma (HOD CSE):** Office: Block A-105 | Email: rsharma@campus.edu\n"
            "• **Prof. Amit Patel (AI/ML):** Office: Block C-303 | Email: apatel@campus.edu\n"
            "• **Dr. Priya Nair (Networks):** Office: Block B-202 | Email: pnair@campus.edu\n"
            "• **Dr. Rajesh Sen (Mathematics):** Office: Block E-102 | Email: rsen@campus.edu"
        )

    def handle(self, message: str, user_dept: str = "Computer Science") -> dict:
        msg = message.lower()
        dept = user_dept or "Computer Science"
        timetable = self.schedules.get(dept, self.schedules["Computer Science"])
        
        # Determine day
        target_day = "Monday"
        day_label = "today"
        
        if "tomorrow" in msg:
            target_day = "Tuesday"
            day_label = "tomorrow"
        elif "yesterday" in msg:
            target_day = "Monday"
            day_label = "yesterday"
        elif "wednesday" in msg:
            target_day = "Wednesday"
            day_label = "Wednesday"
        elif "tuesday" in msg:
            target_day = "Tuesday"
            day_label = "Tuesday"
        elif "monday" in msg:
            target_day = "Monday"
            day_label = "Monday"
        
        day_classes = timetable.get(target_day, self.default_schedule)

        # Build response
        if "faculty" in msg or "professor" in msg or "teacher" in msg:
            return {
                "agent": "timetable",
                "response": self.faculty_info,
                "data": {"topic": "faculty"}
            }
        
        resp = f"📅 **Timetable for {day_label.capitalize()} ({target_day}):**\n\n"
        for idx, c in enumerate(day_classes):
            resp += f"• **{c['subject']}**\n  ⏰ {c['time']} | 📍 {c['room']}\n\n"
        
        if "next lab" in msg or "lab timing" in msg:
            labs = [c for c in day_classes if "lab" in c["subject"].lower()]
            if labs:
                resp = f"🔬 **Next Lab Session:**\n• **{labs[0]['subject']}**\n  ⏰ {labs[0]['time']} | 📍 {labs[0]['room']}"
            else:
                resp = "🔬 No lab sessions scheduled for today."

        return {
            "agent": "timetable",
            "response": resp,
            "data": {
                "day": target_day,
                "classes": day_classes
            }
        }
