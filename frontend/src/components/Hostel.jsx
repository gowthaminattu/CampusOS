// src/components/Hostel.jsx
import { useState } from "react";
import api from "../api/axios";
import HostelBooking from "./HostelBooking";

export default function Hostel() {
  const [activeSubTab, setActiveSubTab] = useState("booking"); // "booking" | "complaints"
  const [complaint, setComplaint] = useState("");
  const [ticket, setTicket] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [rules, setRules] = useState("");

  const submitComplaint = async (e) => {
    e.preventDefault();
    if (!complaint.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.post("/orchestrator/chat", { message: `Register complaint: ${complaint}` });
      setTicket(res.data.response);
      setComplaint("");
    } catch (_) {
      setTicket("Failed to submit request.");
    } finally {
      setSubmitting(false);
    }
  };

  const showRules = async () => {
    try {
      const res = await api.post("/orchestrator/chat", { message: "hostel rules" });
      setRules(res.data.response);
    } catch (_) {}
  };

  return (
    <div className="settings-page" style={{ maxWidth: "1000px", margin: "0 auto", padding: "0" }}>
      {/* Sub tabs inside hostel block */}
      <div className="filter-tabs" style={{ marginBottom: "20px" }}>
        <button
          type="button"
          className={`filter-tab ${activeSubTab === "booking" ? "filter-tab-active" : ""}`}
          onClick={() => setActiveSubTab("booking")}
        >
          🏨 Browse & Book Rooms
        </button>
        <button
          type="button"
          className={`filter-tab ${activeSubTab === "complaints" ? "filter-tab-active" : ""}`}
          onClick={() => setActiveSubTab("complaints")}
        >
          🔧 Maintenance & Hostel Rules
        </button>
      </div>

      {activeSubTab === "booking" ? (
        <HostelBooking />
      ) : (
        <div className="settings-layout">
          {/* Left: Lodging a Maintenance Request */}
          <div className="settings-content">
            <div className="settings-card" style={{ marginBottom: "20px" }}>
              <h2 className="settings-card-title">🔧 Lodge Complaint / Maintenance Ticket</h2>
              <form onSubmit={submitComplaint} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div className="form-group">
                  <label className="form-label">Describe the Issue</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Fan not working in Room B-102"
                    value={complaint}
                    onChange={(e) => setComplaint(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Complaint"}
                </button>
              </form>

              {ticket && (
                <div className="chat-bubble-text" style={{ marginTop: "20px", padding: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: "8px" }}>
                  {ticket.split("\n").map((line, i) => <p key={i}>{line}</p>)}
                </div>
              )}
            </div>
          </div>

          {/* Right: Rules */}
          <div className="settings-content">
            <div className="settings-card">
              <h2 className="settings-card-title">🏢 Block Rules & Regulations</h2>
              <button className="btn btn-ghost btn-sm" type="button" onClick={showRules} style={{ marginBottom: "12px" }}>
                Show Rules
              </button>
              {rules && (
                <div className="chat-bubble-text" style={{ padding: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: "8px" }}>
                  {rules.split("\n").map((line, i) => <p key={i}>{line}</p>)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
