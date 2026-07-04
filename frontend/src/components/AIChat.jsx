// src/components/AIChat.jsx
// College AI Assistant — answers campus questions with suggested chips and typing animation.

import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const COLLEGE_SUGGESTIONS = [
  "When are semester exams?",
  "What are the hostel fees?",
  "Tell me about placement statistics",
  "What courses are offered in CSE?",
  "Timetable for 3rd year students",
  "Scholarship eligibility criteria",
  "Library hours and access",
  "Sports facilities on campus",
  "Club and event information",
  "Show available labs",
];

const COLLEGE_KB = {
  "exam|semester exam|exams": {
    intent: "exam_info",
    response: "📅 **Semester Exam Schedule:**\n\n• **Even Semester Exams** start on **August 10, 2026**\n• **Internal Assessment** exams: July 20–25, 2026\n• Hall tickets will be available 7 days before exams on the student portal\n• Exam fee last date: July 15, 2026\n\nAll the best for your exams! 🎯",
  },
  "hostel fee|hostel fees|hostel cost|hostel charges": {
    intent: "hostel_info",
    response: "🏨 **Hostel Fee Structure:**\n\n| Room Type | Monthly Rent | Facilities |\n|-----------|-------------|------------|\n| Single AC | ₹5,500/mo | WiFi, AC, Bathroom |\n| Double | ₹4,000/mo | WiFi, AC |\n| Triple | ₹2,500/mo | WiFi, Fan |\n\n• Mess charges: ₹3,000/month (optional)\n• Security deposit: ₹10,000 (refundable)\n• Apply via the Hostel section in the portal",
  },
  "placement|placements|job|career": {
    intent: "placement_info",
    response: "💼 **Placement Statistics 2025–26:**\n\n• **Highest Package:** ₹42 LPA (Google)\n• **Average Package:** ₹12.5 LPA\n• **Students Placed:** 94%\n\n**Top Recruiters:** TCS, Infosys, Wipro, Amazon, Google, Microsoft, Accenture\n\nTraining & Placement Cell is in Block D, Room 101. Contact: tpc@campus.edu",
  },
  "course|courses|curriculum|syllabus": {
    intent: "course_info",
    response: "📚 **Courses Offered:**\n\n**Engineering:**\n• B.Tech CSE, ECE, Mechanical, Civil, EEE\n• M.Tech (AI/ML, VLSI, Thermal)\n\n**Science & Arts:**\n• BCA, MCA, B.Sc (Physics, Chemistry, Maths)\n• MBA, BBA\n\nFor detailed syllabus, visit the academic section or contact your department HOD.",
  },
  "timetable|time table|schedule|class schedule": {
    intent: "timetable_info",
    response: "📋 **Timetable Information:**\n\nCurrently, timetables are distributed by class coordinators at the start of each semester.\n\n• **CSE 3rd Year:** Monday–Saturday, 9AM–5PM\n• **Morning shift:** 9AM – 1PM\n• **Afternoon shift:** 2PM – 5PM\n\nFor exact schedules, contact your class coordinator or check the department notice board.",
  },
  "scholarship|scholarship eligibility|financial aid": {
    intent: "scholarship_info",
    response: "🏅 **Scholarship Opportunities:**\n\n• **Merit Scholarship:** Top 10% students — ₹20,000/year\n• **SC/ST Scholarship:** Government funded — Full tuition waiver\n• **Sports Scholarship:** For state-level athletes\n• **Need-based Aid:** Income below ₹3L/year — up to 75% fee reduction\n\nApply before September 30. Contact scholarship cell: scholar@campus.edu",
  },
  "library|library hours|library timing": {
    intent: "library_info",
    response: "📖 **Central Library:**\n\n• **Timings:** Monday–Saturday, 8AM–9PM\n• Sunday: 10AM–5PM\n• **Location:** Main Block, Ground Floor\n\n• 50,000+ books, 200+ journals\n• 24/7 digital library access via library portal\n• Maximum 3 books, 14-day lending period\n• Fine: ₹5/day per book",
  },
  "sports|gym|ground|basketball|cricket": {
    intent: "sports_info",
    response: "⚽ **Sports Facilities:**\n\n• Cricket Ground, Football Field, Basketball Courts\n• Indoor Badminton, Table Tennis, Chess Room\n• **Gymnasium:** Open 6AM–8PM daily\n• Swimming Pool: 7AM–9PM (Mon–Sat)\n\nSports Day: November 15–20. Register with Sports Secretary by November 1.",
  },
  "club|events|fest|activities|cultural": {
    intent: "events_info",
    response: "🎭 **Clubs & Events:**\n\n**Active Clubs:**\n• Coding Club (TechBytes)\n• Cultural Club (Spandan)\n• Robotics Club, Music Club, Drama Club\n\n**Upcoming Events:**\n• 🎉 **TechFest 2026:** August 15–17\n• 🎨 **Cultural Fest (Spandan):** September 5–7\n• 🏆 **Hackathon:** July 20–21\n\nJoin via clubs portal or contact Student Affairs Office.",
  },
  "fee|fees|tuition|payment": {
    intent: "fees_info",
    response: "💰 **Fee Structure (Annual):**\n\n| Program | Tuition | Other Fees | Total |\n|---------|---------|------------|-------|\n| B.Tech | ₹80,000 | ₹15,000 | ₹95,000 |\n| M.Tech | ₹60,000 | ₹12,000 | ₹72,000 |\n| MBA | ₹1,20,000 | ₹20,000 | ₹1,40,000 |\n\n• **Due dates:** June 30 (Sem 1), December 31 (Sem 2)\n• **Late fee:** ₹500/week after due date\n• Pay online via ERP portal or campus bank",
  },
  "department|departments|dept": {
    intent: "dept_info",
    response: "🏛️ **Departments at CampusOS University:**\n\n• **CSE** — Block A (HOD: Dr. R. Sharma)\n• **ECE** — Block B (HOD: Dr. P. Kumar)\n• **Mechanical** — Block C\n• **Civil** — Block D\n• **MBA/BBA** — Admin Block\n• **Science Dept** — Block E\n\nEach department has its own lab, faculty room, and student coordinator.",
  },
};

function getLocalResponse(message) {
  const lower = message.toLowerCase();
  for (const [pattern, info] of Object.entries(COLLEGE_KB)) {
    const keys = pattern.split("|");
    if (keys.some((k) => lower.includes(k))) {
      return info;
    }
  }
  return null;
}

function formatMessage(text) {
  // Convert **bold** and newlines and tables to styled HTML-safe output
  return text
    .split("\n")
    .map((line, i) => {
      if (line.startsWith("• ")) {
        return <li key={i} className="msg-list-item">{renderInline(line.slice(2))}</li>;
      }
      if (line.startsWith("| ") && line.includes("|")) {
        return null; // tables handled below
      }
      if (line.trim() === "") return <br key={i} />;
      return <p key={i} className="msg-line">{renderInline(line)}</p>;
    });
}

function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : part
  );
}

export default function AIChat() {
  const { user } = useAuth();
  const location = useLocation();
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text: `👋 Hi **${user?.name?.split(" ")[0] || "there"}**! I'm your **CampusOS AI Assistant**.\n\nI can help you with:\n• Exam schedules and results\n• Hostel fees and booking\n• Placement information\n• Courses and timetables\n• Campus events and clubs\n• Scholarships and financial aid\n\nWhat would you like to know?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeSuggestions, setActiveSuggestions] = useState(COLLEGE_SUGGESTIONS.slice(0, 6));
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-fill from navigation state (e.g. from Dashboard chip)
  useEffect(() => {
    if (location.state?.prefill) {
      setInput(location.state.prefill);
      inputRef.current?.focus();
    }
  }, [location.state]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      role: "user",
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Check local college KB first
    const local = getLocalResponse(text.trim());
    if (local) {
      await new Promise((r) => setTimeout(r, 800));
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", text: local.response, intent: local.intent, timestamp: new Date() },
      ]);
      setLoading(false);
      return;
    }

    // Otherwise hit backend orchestrator
    try {
      const res = await api.post("/orchestrator/chat", { message: text.trim() });
      const { intent, response, data } = res.data;
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", text: response, intent, data, timestamp: new Date() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: "⚠️ I couldn't process your request right now. Please try asking again or rephrase your question.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const renderData = (data, intent) => {
    if (!data) return null;
    if (intent === "check_hostel" && data.available_rooms) {
      return (
        <div className="chat-data-block">
          <p className="chat-data-label">🏨 Available Rooms</p>
          {data.available_rooms.map((r) => (
            <div key={r.id} className="chat-data-row">
              <span className="chat-data-key">{r.room_number}</span>
              <span>{r.type} · {r.block}</span>
              <span className="chat-data-price">₹{r.rent}/mo</span>
            </div>
          ))}
        </div>
      );
    }
    if (intent === "check_lab" && data.labs) {
      return (
        <div className="chat-data-block">
          <p className="chat-data-label">🔬 Available Labs</p>
          {data.labs.map((l) => (
            <div key={l.id} className="chat-data-row">
              <span className="chat-data-key">{l.name}</span>
              <span>📍 {l.location} · 👥 {l.capacity} seats</span>
            </div>
          ))}
        </div>
      );
    }
    if (intent === "book_lab" && data && !data.conflict) {
      return (
        <div className="chat-data-block chat-success-block">
          <p>✅ Booking Confirmed!</p>
          <p>🔬 {data.lab} · 📅 {data.date}</p>
          <p>⏰ {data.start_time} – {data.end_time}</p>
        </div>
      );
    }
    if (intent === "suggest_slots" && data?.free_slots) {
      return (
        <div className="chat-data-block">
          <p className="chat-data-label">⏰ Free Slots</p>
          <div className="chat-slots-wrap">
            {data.free_slots.map((slot) => (
              <span key={slot} className="chat-slot-chip">{slot}</span>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const initials = user?.name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "S";

  return (
    <div className="chat-page">
      {/* Header */}
      <div className="chat-header-bar">
        <div className="chat-header-left">
          <div className="chat-ai-avatar">✦</div>
          <div>
            <h2 className="chat-header-title">CampusOS AI Assistant</h2>
            <div className="chat-status">
              <span className="chat-status-dot" />
              <span>Online · Ready to help</span>
            </div>
          </div>
        </div>
        <button
          className="chat-clear-btn"
          onClick={() =>
            setMessages([{
              id: Date.now(),
              role: "assistant",
              text: "Chat cleared! How can I help you?",
              timestamp: new Date(),
            }])
          }
        >
          🗑 Clear Chat
        </button>
      </div>

      {/* Messages */}
      <div className="chat-messages-area">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message-row ${msg.role === "user" ? "chat-row-user" : "chat-row-ai"}`}
          >
            {msg.role === "assistant" && (
              <div className="chat-ai-bubble-avatar">✦</div>
            )}
            <div className={`chat-bubble ${msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"}`}>
              <div className="chat-bubble-text">
                {msg.text.split("\n").map((line, i) => {
                  if (line.startsWith("• ")) {
                    return (
                      <li key={i} className="chat-list-item">
                        {line.slice(2).split(/(\*\*[^*]+\*\*)/).map((p, j) =>
                          p.startsWith("**") && p.endsWith("**")
                            ? <strong key={j}>{p.slice(2, -2)}</strong>
                            : p
                        )}
                      </li>
                    );
                  }
                  if (line.startsWith("| ")) return null;
                  if (line.trim() === "") return <br key={i} />;
                  return (
                    <span key={i} className="chat-text-line">
                      {line.split(/(\*\*[^*]+\*\*)/).map((p, j) =>
                        p.startsWith("**") && p.endsWith("**")
                          ? <strong key={j}>{p.slice(2, -2)}</strong>
                          : p
                      )}
                    </span>
                  );
                })}
              </div>
              {msg.role === "assistant" && renderData(msg.data, msg.intent)}
              <span className="chat-bubble-time">{formatTime(msg.timestamp)}</span>
            </div>
            {msg.role === "user" && (
              <div className="chat-user-bubble-avatar">{initials}</div>
            )}
          </div>
        ))}

        {loading && (
          <div className="chat-message-row chat-row-ai">
            <div className="chat-ai-bubble-avatar">✦</div>
            <div className="chat-bubble chat-bubble-ai">
              <div className="chat-typing-indicator">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <div className="chat-suggestions-bar">
        <p className="chat-suggestions-label">💡 Suggested questions:</p>
        <div className="chat-suggestions-scroll">
          {activeSuggestions.map((s, i) => (
            <button
              key={i}
              className="chat-suggestion-chip"
              onClick={() => sendMessage(s)}
              disabled={loading}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="chat-input-bar">
        <div className="chat-input-wrap">
          <input
            ref={inputRef}
            id="chat-input"
            type="text"
            className="chat-main-input"
            placeholder="Ask anything about college, exams, hostel, placement..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            id="chat-send"
            type="submit"
            className="chat-send-button"
            disabled={loading || !input.trim()}
          >
            {loading ? <span className="spinner" /> : "→"}
          </button>
        </div>
      </form>
    </div>
  );
}
