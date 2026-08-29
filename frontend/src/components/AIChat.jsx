// src/components/AIChat.jsx
// Campus Intelligence AI Assistant with Contextual Interactive Data Cards

import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Bot, User, Award, Calendar, CreditCard, BookOpen, Bell, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: "ai",
    text: "Hello Gowthami! I'm Campus Intelligence, your connected AI assistant. How can I help you today?",
    card: null
  }
];

export default function AIChat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = (queryText) => {
    const textToSend = queryText || input;
    if (!textToSend.trim()) return;

    const userMsg = { id: Date.now(), sender: "user", text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput("");
    setLoading(true);

    setTimeout(() => {
      let aiResponseText = "Here is the information from your CampusOS digital records:";
      let responseCard = null;

      const lower = textToSend.toLowerCase();

      if (lower.includes("attendance") || lower.includes("low attendance")) {
        aiResponseText = "You currently have 86% overall attendance. Digital Electronics is your lowest at 76%.";
        responseCard = {
          type: "ATTENDANCE",
          title: "Attendance Health Card",
          overall: 86,
          lowestSubject: "Digital Electronics (CS303)",
          lowestPercent: 76,
          requiredLectures: 4
        };
      } else if (lower.includes("timetable") || lower.includes("schedule") || lower.includes("class")) {
        aiResponseText = "Here is your upcoming class schedule for today:";
        responseCard = {
          type: "TIMETABLE",
          title: "Today's Schedule Card",
          items: [
            { time: "08:30 AM", title: "Data Structures & Algo (Lab 304)" },
            { time: "10:30 AM", title: "Digital Electronics (Hall B-12)" },
            { time: "01:30 PM", title: "Database Systems (Hall C-08)" }
          ]
        };
      } else if (lower.includes("fee") || lower.includes("due") || lower.includes("payment")) {
        aiResponseText = "Here is your financial status report:";
        responseCard = {
          type: "FEE",
          title: "Fee Summary Card",
          total: "₹85,000",
          paid: "₹60,000",
          pending: "₹25,000",
          dueDate: "March 15, 2026"
        };
      } else if (lower.includes("exam") || lower.includes("gpa") || lower.includes("marks")) {
        aiResponseText = "Here is your current academic performance report:";
        responseCard = {
          type: "EXAM",
          title: "Academic Grade Card",
          gpa: "8.70",
          cgpa: "8.43",
          riskStatus: "LOW RISK (87% Confidence)"
        };
      } else {
        aiResponseText = `I have processed your query regarding "${textToSend}". All academic, hostel, and library modules are synchronized.`;
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "ai", text: aiResponseText, card: responseCard }
      ]);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto h-[calc(100vh-100px)] flex flex-col space-y-4">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-heading">Campus Intelligence AI</h2>
            <p className="text-xs text-slate-400">Context-aware campus copilot with interactive data cards.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-slate-400">Online</span>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          "Do I have low attendance?",
          "Show my timetable today",
          "What is my pending fee?",
          "Check my GPA & exams",
        ].map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-mono whitespace-nowrap transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 glass-panel rounded-2xl p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
              msg.sender === "user" ? "bg-indigo-600 text-white" : "bg-slate-800 text-indigo-400 border border-indigo-500/30"
            }`}>
              {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`max-w-md space-y-3 ${msg.sender === "user" ? "text-right" : ""}`}>
              <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                msg.sender === "user"
                  ? "bg-indigo-600 text-white rounded-tr-none"
                  : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none"
              }`}>
                {msg.text}
              </div>

              {/* Contextual Interactive Data Card Rendering */}
              {msg.card && (
                <div className="bg-slate-950/80 border border-indigo-500/30 p-4 rounded-2xl text-left space-y-3 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-white font-heading">{msg.card.title}</span>
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  </div>

                  {msg.card.type === "ATTENDANCE" && (
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-400">Overall Attendance:</span>
                        <strong className="text-emerald-400">{msg.card.overall}%</strong>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-400">Lowest Subject:</span>
                        <strong className="text-rose-400">{msg.card.lowestSubject} ({msg.card.lowestPercent}%)</strong>
                      </div>
                      <button
                        onClick={() => navigate("/attendance")}
                        className="w-full mt-2 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-semibold border border-indigo-500/30 transition flex items-center justify-center gap-1"
                      >
                        Open Attendance Health <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {msg.card.type === "TIMETABLE" && (
                    <div className="space-y-2 text-xs">
                      {msg.card.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between bg-slate-900 p-2 rounded-lg font-mono">
                          <span className="text-indigo-400 font-bold">{item.time}</span>
                          <span className="text-slate-200 font-sans">{item.title}</span>
                        </div>
                      ))}
                      <button
                        onClick={() => navigate("/timetable")}
                        className="w-full mt-2 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-semibold border border-indigo-500/30 transition flex items-center justify-center gap-1"
                      >
                        Open Full Timetable <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {msg.card.type === "FEE" && (
                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex justify-between"><span className="text-slate-400">Total:</span><strong className="text-white">{msg.card.total}</strong></div>
                      <div className="flex justify-between"><span className="text-slate-400">Paid:</span><strong className="text-emerald-400">{msg.card.paid}</strong></div>
                      <div className="flex justify-between"><span className="text-slate-400">Pending:</span><strong className="text-rose-400">{msg.card.pending}</strong></div>
                      <button
                        onClick={() => navigate("/fees")}
                        className="w-full mt-2 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center justify-center gap-1"
                      >
                        Pay Pending Dues <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {msg.card.type === "EXAM" && (
                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex justify-between"><span className="text-slate-400">Current GPA:</span><strong className="text-white">{msg.card.gpa}</strong></div>
                      <div className="flex justify-between"><span className="text-slate-400">CGPA:</span><strong className="text-sky-400">{msg.card.cgpa}</strong></div>
                      <div className="flex justify-between"><span className="text-slate-400">Risk Model:</span><strong className="text-emerald-400">{msg.card.riskStatus}</strong></div>
                      <button
                        onClick={() => navigate("/performance")}
                        className="w-full mt-2 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-semibold border border-indigo-500/30 transition flex items-center justify-center gap-1"
                      >
                        View Performance Analytics <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" /> Campus Intelligence AI thinking...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Campus Intelligence (e.g. 'Do I have low attendance?', 'Show fee dues')..."
          className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-2xl py-3.5 pl-4 pr-12 text-xs text-white placeholder-slate-400 focus:outline-none shadow-xl transition"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="absolute right-2 p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
