# agents/placement_agent.py
import re
from models.user import User

class PlacementAgent:
    def __init__(self):
        self.companies = {
            "tcs": {"gpa": 6.0, "salary": "4.5 LPA", "date": "15th Aug 2026", "role": "System Engineer"},
            "infosys": {"gpa": 6.0, "salary": "4.0 LPA", "date": "18th Aug 2026", "role": "Systems Associate"},
            "amazon": {"gpa": 8.0, "salary": "32.0 LPA", "date": "5th Sep 2026", "role": "SDE Intern"},
            "google": {"gpa": 8.5, "salary": "42.0 LPA", "date": "10th Sep 2026", "role": "Software Engineer"}
        }

    def check_eligibility(self, user: User, company_name: str) -> str:
        comp = company_name.lower()
        if comp not in self.companies:
            return f"Company '{company_name}' is not listed in active campus drives."
        
        info = self.companies[comp]
        required_gpa = info["gpa"]
        user_gpa = user.gpa or 0.0

        if user_gpa >= required_gpa:
            return (
                f"✅ **You are eligible for {company_name.upper()}!**\n"
                f"• **Role:** {info['role']}\n"
                f"• **Package:** {info['salary']}\n"
                f"• **Drive Date:** {info['date']}\n"
                f"• **GPA Requirement:** {required_gpa} (Your GPA: {user_gpa:.2f})"
            )
        else:
            return (
                f"❌ **You are not currently eligible for {company_name.upper()}.**\n"
                f"• **Required GPA:** {required_gpa}\n"
                f"• **Your GPA:** {user_gpa:.2f}\n"
                f"Try to improve your GPA in the upcoming semester exams to qualify."
            )

    def handle(self, message: str, user: User) -> dict:
        msg = message.lower()

        # 1. Eligibility check
        for comp in self.companies.keys():
            if comp in msg:
                return {
                    "agent": "placement",
                    "response": self.check_eligibility(user, comp),
                    "data": {"topic": "eligibility", "company": comp}
                }

        # 2. Resume suggestions
        if "resume" in msg or "cv" in msg:
            resp = (
                "📝 **Resume Optimization Tips:**\n"
                "1. Keep it to a single page.\n"
                "2. Highlight 2-3 key technical projects using the STAR method (Situation, Task, Action, Result).\n"
                "3. List core skills first (e.g. Python, SQL, React, Data Structures).\n"
                "4. Make sure your GitHub and LinkedIn profile links are updated at the top.\n"
                "5. Tailor the description matching keywords in the job description."
            )
            return {
                "agent": "placement",
                "response": resp,
                "data": {"topic": "resume"}
            }

        # 3. Aptitude practice / Mock interviews
        if "aptitude" in msg or "practice" in msg or "mock" in msg or "interview" in msg:
            resp = (
                "🎯 **Aptitude & Interview Preparation Resource:**\n"
                "• **Aptitude practice:** Daily tests available on ERP under placement cell tab.\n"
                "• **Topics:** Quantitative, Logical Reasoning, Verbal Ability.\n"
                "• **Mock Interviews:** Click 'Mock Interview' in the Placement page to start an interactive AI interview prep simulator."
            )
            return {
                "agent": "placement",
                "response": resp,
                "data": {"topic": "preparation"}
            }

        # 4. Fallback: general info
        drive_list = "\n".join([f"• **{name.upper()}**: {info['role']} ({info['salary']}) - Date: {info['date']}" for name, info in self.companies.items()])
        return {
            "agent": "placement",
            "response": f"💼 **Upcoming Placement Drives:**\n\n{drive_list}\n\nAsk me 'Am I eligible for Google?' or 'Give resume suggestions' to learn more.",
            "data": {"topic": "general"}
        }
