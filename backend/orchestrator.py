# orchestrator.py
# The Main controller that implements the Multi-Agent controller logic.
# It splits joint queries, routes them to specific agents, aggregates the results, and returns it.

import re
from sqlalchemy.orm import Session
from models.user import User

# Import all agents
from agents.helpdesk_agent import HelpdeskAgent
from agents.timetable_agent import TimetableAgent
from agents.lab_agent import LabAgent
from agents.placement_agent import PlacementAgent
from agents.event_agent import EventAgent
from agents.library_agent import LibraryAgent
from agents.hostel_agent import HostelAgent
from agents.fee_agent import FeeAgent

# Instantiate agents
helpdesk_agent = HelpdeskAgent()
timetable_agent = TimetableAgent()
lab_agent = LabAgent()
placement_agent = PlacementAgent()
event_agent = EventAgent()
library_agent = LibraryAgent()
hostel_agent = HostelAgent()
fee_agent = FeeAgent()

# Context Memory (in-memory chat session/context memory)
MEMORY = {}

def update_memory(user_id: int, key: str, value: str):
    if user_id not in MEMORY:
        MEMORY[user_id] = {}
    MEMORY[user_id][key] = value

def get_memory(user_id: int, key: str, default=None):
    return MEMORY.get(user_id, {}).get(key, default)

def parse_intents(message: str) -> list:
    """
    Check the query to see which specialized agents are requested.
    Returns a list of tuples: (agent_name, query_segment)
    Supports multiple intents separated by 'and', 'also', or comma.
    """
    msg = message.lower()
    
    # Split query segments
    delimiters = [r"\band\b", r"\balso\b", r",", r"\bthen\b"]
    pattern = "|".join(delimiters)
    segments = re.split(pattern, message)
    segments = [s.strip() for s in segments if s.strip()]

    routes = []
    for seg in segments:
        s_lower = seg.lower()
        
        # 1. Timetable Agent
        if any(w in s_lower for w in ["timetable", "schedule", "class", "classes", "tomorrow schedule", "faculty"]):
            routes.append(("timetable", seg))
        # 2. Lab Booking Agent
        elif any(w in s_lower for w in ["lab", "labs", "book lab", "cancel lab"]):
            routes.append(("lab", seg))
        # 3. Placement Coordinator Agent
        elif any(w in s_lower for w in ["placement", "job", "career", "eligible", "tcs", "google", "amazon", "resume", "aptitude", "mock"]):
            routes.append(("placement", seg))
        # 4. Event Registration Agent
        elif any(w in s_lower for w in ["event", "events", "hackathon", "register event"]):
            routes.append(("event", seg))
        # 5. Library Assistant Agent
        elif any(w in s_lower for w in ["library", "due date", "borrowed", "return book", "renew book"]):
            routes.append(("library", seg))
        # Also catch standalone "books" keyword (not part of lab/hostel booking)
        elif "book" in s_lower and not any(x in s_lower for x in ["lab", "room", "hostel", "book lab", "book room", "book hostel"]):
            routes.append(("library", seg))
        # 6. Hostel Management Agent
        elif any(w in s_lower for w in ["hostel", "room", "complaint", "warden", "maintenance"]):
            # Avoid hostel clash with "book lab" or "book room" where room might refer to lab
            if "lab" not in s_lower:
                routes.append(("hostel", seg))
        # 7. Fee Inquiry Agent
        elif any(w in s_lower for w in ["fee", "fees", "pending", "balance", "due date of fee"]):
            routes.append(("fee", seg))
        # 8. Helpdesk Agent (general/fallback)
        elif any(w in s_lower for w in ["admission", "rule", "guideline", "policy", "semester start", "how to"]):
            routes.append(("helpdesk", seg))
        else:
            routes.append(("helpdesk", seg))

    # If no segments, default to helpdesk
    if not routes:
        routes.append(("helpdesk", message))

    # Deduplicate agents to prevent calling same agent multiple times on tiny overlapping words
    unique_routes = []
    seen_agents = set()
    for r in routes:
        if r[0] not in seen_agents:
            unique_routes.append(r)
            seen_agents.add(r[0])

    return unique_routes

def process_message(message: str, db: Session, user: User) -> dict:
    """
    Main controller of the Multi-Agent architecture.
    1. Parse the intents and splits
    2. Route to specialized agents
    3. Aggregate response and data fields
    """
    routes = parse_intents(message)
    
    responses = []
    aggregated_data = {}
    primary_intent = "unknown"

    for idx, (agent_name, seg_query) in enumerate(routes):
        if idx == 0:
            primary_intent = agent_name

        if agent_name == "timetable":
            res = timetable_agent.handle(seg_query, user.department)
        elif agent_name == "lab":
            res = lab_agent.handle(seg_query, db, user)
        elif agent_name == "placement":
            res = placement_agent.handle(seg_query, user)
        elif agent_name == "event":
            res = event_agent.handle(seg_query, user.name)
        elif agent_name == "library":
            res = library_agent.handle(seg_query)
        elif agent_name == "hostel":
            res = hostel_agent.handle(seg_query, user.id)
        elif agent_name == "fee":
            res = fee_agent.handle(seg_query)
        else:
            res = helpdesk_agent.handle(seg_query)

        responses.append(res["response"])
        aggregated_data[agent_name] = res.get("data", None)
        
        # Save last agent used in context memory
        update_memory(user.id, "last_agent", agent_name)

    # Combine results
    unified_response = "\n\n---\n\n".join(responses)

    return {
        "intent": primary_intent,
        "response": unified_response,
        "data": aggregated_data
    }
