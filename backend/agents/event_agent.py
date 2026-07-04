# agents/event_agent.py
import re
from datetime import datetime

class EventAgent:
    def __init__(self):
        self.events = [
            {"id": "ev-hack", "name": "CampusOS Hackathon 2026", "date": "July 20, 2026", "type": "Hackathon", "description": "36-hour hackathon for building smart tools."},
            {"id": "ev-fest", "name": "Annual TechFest 2026", "date": "August 15, 2026", "type": "Cultural/Technical", "description": "Three days of games, tech talks, and cultural nights."},
            {"id": "ev-ai", "name": "AI Workshop: PyTorch basics", "date": "July 25, 2026", "type": "Workshop", "description": "Hands-on machine learning workshop with GPU servers."}
        ]

    def handle(self, message: str, user_name: str) -> dict:
        msg = message.lower()
        
        is_register_intent = any(w in msg for w in ["register", "join", "sign up", "confirm"])
        
        # 1. REGISTER
        if is_register_intent:
            selected_event = self.events[0] # Default to hackathon
            for ev in self.events:
                if ev["id"] in msg or ev["name"].lower().split()[0] in msg:
                    selected_event = ev
                    break
            
            confirmation_code = f"REG-{selected_event['id'].upper().replace('EV-', '')}-{int(datetime.now().timestamp()) % 100000}"
            resp = (
                f"🎉 **Registration Confirmed!**\n"
                f"Hello {user_name}, you have successfully registered for **{selected_event['name']}**.\n\n"
                f"• **Event Date:** {selected_event['date']}\n"
                f"• **Confirmation Ticket:** `{confirmation_code}`\n\n"
                f"A calendar invite has been sent to your student email. Don't forget to prepare!"
            )
            return {
                "agent": "event",
                "response": resp,
                "data": {
                    "topic": "registration",
                    "event": selected_event["name"],
                    "ticket": confirmation_code
                }
            }

        # 2. SHOW EVENTS
        resp = "🏆 **Upcoming Campus Events & Hackathons:**\n\n"
        for ev in self.events:
            resp += f"• **{ev['name']}** ({ev['type']})\n  📅 {ev['date']}\n  📄 {ev['description']}\n\n"
        resp += "*Type 'Register for Hackathon' to join the main tech event!*"

        return {
            "agent": "event",
            "response": resp,
            "data": {
                "topic": "list",
                "events": self.events
            }
        }
