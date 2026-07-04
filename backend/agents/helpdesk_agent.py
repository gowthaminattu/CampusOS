# agents/helpdesk_agent.py
import re

class HelpdeskAgent:
    def __init__(self):
        self.rules_info = (
            "🎓 **CampusOS Rules & Guidelines:**\n"
            "• **Attendance Rule:** Minimum 75% attendance is mandatory to appear for semester exams.\n"
            "• **Dress Code:** Smart casuals. ID cards must be worn at all times on campus.\n"
            "• **Library Rule:** Up to 3 books can be borrowed for a maximum period of 14 days."
        )
        self.admission_info = (
            "📋 **Admission Procedure & Documents Required:**\n"
            "1. Filled admission application form (can be submitted in the portal).\n"
            "2. 10th and 12th Grade Marksheets (scanned copies).\n"
            "3. Transfer Certificate & Migration Certificate.\n"
            "4. Identity Proof (Aadhar/Passport).\n"
            "5. 3 Passport size photographs."
        )
        self.academic_info = (
            "📅 **Academic Semester Details:**\n"
            "• **Semester Start:** Classes commence on **August 10, 2026**.\n"
            "• **Mid-Term Exams:** October 5–12, 2026.\n"
            "• **Practical Exams:** November 20–28, 2026.\n"
            "• **Semester End Exams:** December 5–22, 2026."
        )
        self.departments = (
            "🏛️ **Departments Available:**\n"
            "• Computer Science & Engineering (Block A)\n"
            "• Electronics & Communication Engineering (Block B)\n"
            "• Mechanical Engineering (Block C)\n"
            "• Civil Engineering (Block D)\n"
            "• Electrical Engineering (Block E)\n"
            "• Information Technology & MCA/BCA (IT Block)"
        )

    def handle(self, message: str) -> dict:
        msg = message.lower()
        if any(w in msg for w in ["admission", "apply", "document"]):
            return {
                "agent": "helpdesk",
                "response": self.admission_info,
                "data": {"topic": "admission"}
            }
        elif any(w in msg for w in ["rule", "guideline", "policy", "attendance"]):
            return {
                "agent": "helpdesk",
                "response": self.rules_info,
                "data": {"topic": "rules"}
            }
        elif any(w in msg for w in ["semester", "term", "start", "classes start"]):
            return {
                "agent": "helpdesk",
                "response": self.academic_info,
                "data": {"topic": "academics"}
            }
        elif any(w in msg for w in ["department", "dept", "hod", "branch"]):
            return {
                "agent": "helpdesk",
                "response": self.departments,
                "data": {"topic": "departments"}
            }
        else:
            return {
                "agent": "helpdesk",
                "response": "Hello! I am the Student Helpdesk Agent. I can guide you with admissions, college rules, departments, and semester details. Feel free to ask!",
                "data": {"topic": "general"}
            }
