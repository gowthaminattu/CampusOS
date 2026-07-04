# agents/fee_agent.py
import re

class FeeAgent:
    def __init__(self):
        # Sample fee details
        self.academic_fees = "₹95,000 / year"
        self.hostel_fees = "₹45,000 / year"
        self.due_date = "August 15, 2026"

    def handle(self, message: str) -> dict:
        msg = message.lower()
        
        # Determine pending balance mock
        pending_amount = "₹15,000"
        if "hostel" in msg:
            pending_amount = "₹5,000"
        elif "exam" in msg:
            pending_amount = "₹1,500"
        
        # 1. PENDING FEES
        if any(w in msg for w in ["pending", "balance", "due", "how much", "what is my"]):
            resp = (
                f"💰 **Fee Balance Details:**\n\n"
                f"• **Pending Tuition Fee:** {pending_amount}\n"
                f"• **Due Date:** **{self.due_date}**\n"
                f"• **Late Fee Penalty:** ₹500/week after the due date.\n\n"
                f"Payments can be made via debit card, credit card, netbanking, or UPI in the Fee section."
            )
            return {
                "agent": "fee",
                "response": resp,
                "data": {
                    "topic": "pending",
                    "balance": pending_amount,
                    "due_date": self.due_date
                }
            }

        # 2. FEE STRUCTURE / DETAILS
        resp = (
            f"💳 **CampusOS Fee Structure:**\n\n"
            f"• **B.Tech Tuition Fee:** {self.academic_fees}\n"
            f"• **Hostel & Mess Fee:** {self.hostel_fees}\n"
            f"• **Exam Registration Fee:** ₹1,500 / semester\n"
            f"• **Library Deposit:** ₹2,000 (Refundable)\n\n"
            f"Type 'What is my pending fee?' to view your personalized balance."
        )
        return {
            "agent": "fee",
            "response": resp,
            "data": {"topic": "structure"}
        }
