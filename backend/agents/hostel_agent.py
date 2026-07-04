# agents/hostel_agent.py
import re
from datetime import datetime

class HostelAgent:
    def __init__(self):
        self.complaints = []
        self.rules = (
            "🏢 **Hostel Rules & Regulations:**\n"
            "• **Curfew:** All students must enter the hostel block by **10:00 PM**.\n"
            "• **Guests:** No visitors allowed in the rooms after 8:00 PM.\n"
            "• **Silence Hours:** From 10:30 PM to 6:00 AM.\n"
            "• **Appliances:** High-power electrical items (heaters, irons) are prohibited."
        )

    def handle(self, message: str, user_id: int) -> dict:
        msg = message.lower()
        
        is_complaint = any(w in msg for w in ["complaint", "maintenance", "repair", "not working", "broken", "leak"])
        
        # 1. COMPLAINT REGISTER
        if is_complaint:
            issue = "Maintenance request registered"
            match = re.search(r"(?:complaint|register|repair|fix)\s*:\s*(.*)", msg)
            if match:
                issue = match.group(1)
            elif "fan" in msg:
                issue = "Fan not working / requires repair"
            elif "light" in msg:
                issue = "Tube light / bulb fuse issue"
            elif "water" in msg or "leak" in msg:
                issue = "Plumbing maintenance request"
            
            ticket_id = f"HOS-TKT-{len(self.complaints) + 101}"
            self.complaints.append({"ticket_id": ticket_id, "issue": issue, "status": "Pending"})
            
            resp = (
                f"🔧 **Complaint Registered!**\n"
                f"Your maintenance request has been submitted to the Warden's Office.\n\n"
                f"• **Ticket ID:** `{ticket_id}`\n"
                f"• **Issue Category:** {issue.capitalize()}\n"
                f"• **Status:** Pending Allocation (usually resolved in 24 hours)."
            )
            return {
                "agent": "hostel",
                "response": resp,
                "data": {
                    "topic": "complaint",
                    "ticket_id": ticket_id,
                    "issue": issue,
                    "status": "Pending"
                }
            }

        # 2. RULES
        if "rule" in msg or "curfew" in msg:
            return {
                "agent": "hostel",
                "response": self.rules,
                "data": {"topic": "rules"}
            }

        # 3. Default: room info
        resp = (
            "🏨 **Hostel Information:**\n"
            "• Rooms: Block A (Boys AC), Block B (Boys Non-AC), Block C (Girls AC/Non-AC).\n"
            "• Amenities: Gym, 24/7 power backup, high-speed WiFi, laundry services.\n\n"
            "To report an issue, type: 'Register complaint: Fan not working'."
        )
        return {
            "agent": "hostel",
            "response": resp,
            "data": {"topic": "general"}
        }
