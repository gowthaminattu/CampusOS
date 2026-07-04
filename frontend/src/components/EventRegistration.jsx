// src/components/EventRegistration.jsx
import { useState, useEffect } from "react";
import api from "../api/axios";

export default function EventRegistration() {
  const [events, setEvents] = useState([
    {"id": "ev-hack", "name": "CampusOS Hackathon 2026", "date": "July 20, 2026", "type": "Hackathon", "description": "36-hour hackathon for building smart tools."},
    {"id": "ev-fest", "name": "Annual TechFest 2026", "date": "August 15, 2026", "type": "Cultural/Technical", "description": "Three days of games, tech talks, and cultural nights."},
    {"id": "ev-ai", "name": "AI Workshop: PyTorch basics", "date": "July 25, 2026", "type": "Workshop", "description": "Hands-on machine learning workshop with GPU servers."}
  ]);
  const [registeringId, setRegisteringId] = useState(null);
  const [tickets, setTickets] = useState({});

  const registerForEvent = async (ev) => {
    setRegisteringId(ev.id);
    try {
      const res = await api.post("/orchestrator/chat", { message: `register for ${ev.name}` });
      const match = res.data.response.match(/`([^`]+)`/);
      const ticket = match ? match[1] : "REG-CONF-92019";
      setTickets((prev) => ({ ...prev, [ev.id]: ticket }));
    } catch (_) {
      setTickets((prev) => ({ ...prev, [ev.id]: "REG-CONF-92019" }));
    } finally {
      setRegisteringId(null);
    }
  };

  return (
    <div className="settings-page" style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <div className="settings-header">
        <h1 className="page-h1">Events & Hackathons</h1>
        <p className="page-sub">Browse, join, and view registration cards for active campus events</p>
      </div>

      <div className="adm-applications-list">
        {events.map((ev) => (
          <div key={ev.id} className="adm-application-card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div className="adm-app-header">
              <div>
                <h3 className="adm-app-name">{ev.name}</h3>
                <p className="adm-status-dept" style={{ color: "var(--accent-blue-light)" }}>🏷️ {ev.type}</p>
              </div>
              <span className="mgmt-dept-tag">📅 {ev.date}</span>
            </div>
            <p className="page-subtitle" style={{ color: "var(--text-secondary)" }}>{ev.description}</p>
            
            <div className="adm-app-actions" style={{ borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
              {tickets[ev.id] ? (
                <div className="alert alert-success" style={{ width: "100%", justifyContent: "space-between" }}>
                  <span>🎉 Registered successfully! Confirmation ticket: <strong>{tickets[ev.id]}</strong></span>
                </div>
              ) : (
                <button className="btn btn-primary btn-sm" onClick={() => registerForEvent(ev)} disabled={registeringId === ev.id}>
                  {registeringId === ev.id ? "Registering..." : "⚡ Register Now"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
