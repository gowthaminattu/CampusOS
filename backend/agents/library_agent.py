# agents/library_agent.py
import re

class LibraryAgent:
    def __init__(self):
        self.books = [
            {"title": "Digital Communication Systems", "author": "Simon Haykin", "subject": "Digital Communication", "copies": 4},
            {"title": "Introduction to Algorithms", "author": "Thomas H. Cormen", "subject": "Computer Science", "copies": 7},
            {"title": "Artificial Intelligence: A Modern Approach", "author": "Stuart Russell", "subject": "AI/ML", "copies": 3},
            {"title": "Computer Networking: A Top-Down Approach", "author": "James Kurose", "subject": "Networks", "copies": 5}
        ]
        self.borrowed = [
            {"title": "Introduction to Algorithms", "due_date": "July 15, 2026"},
            {"title": "Computer Networking", "due_date": "July 20, 2026"}
        ]

    def handle(self, message: str) -> dict:
        msg = message.lower()
        
        # 1. Borrowed books / Due dates
        if any(w in msg for w in ["due date", "borrowed", "my books", "return date"]):
            if not self.borrowed:
                return {
                    "agent": "library",
                    "response": "📚 You do not have any borrowed books currently.",
                    "data": {"topic": "borrowed", "books": []}
                }
            resp = "📖 **Your Borrowed Books & Due Dates:**\n\n"
            for b in self.borrowed:
                resp += f"• **{b['title']}**\n  📅 Due on or before: **{b['due_date']}**\n\n"
            return {
                "agent": "library",
                "response": resp,
                "data": {"topic": "borrowed", "books": self.borrowed}
            }

        # 2. Recommendations or search
        search_query = None
        for b in self.books:
            subj = b["subject"].lower()
            title = b["title"].lower()
            if subj in msg or title in msg or any(w in msg for w in b["subject"].lower().split()):
                search_query = b
                break

        if search_query:
            resp = (
                f"📚 **Recommended Books for your query:**\n\n"
                f"• **{search_query['title']}** by {search_query['author']}\n"
                f"  📍 Subject: {search_query['subject']}\n"
                f"  🟢 Available Copies: {search_query['copies']} in central rack."
            )
            return {
                "agent": "library",
                "response": resp,
                "data": {"topic": "recommendation", "books": [search_query]}
            }

        # 3. Default: catalog list
        catalog = "\n".join([f"• **{b['title']}** ({b['author']}) - Copies: {b['copies']}" for b in self.books])
        return {
            "agent": "library",
            "response": f"📖 **Central Library Catalog (Recommended Books):**\n\n{catalog}\n\nSearch by typing 'Suggest books for Digital Communication' or 'What are my due dates?'.",
            "data": {"topic": "general"}
        }
