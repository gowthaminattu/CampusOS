// src/components/MeetingScheduler.jsx
// Staff-only: schedule a meeting, automatically notifies all staff, view upcoming meetings list.

import { useState, useEffect } from "react";
import api from "../api/axios";

export default function MeetingScheduler() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
  });

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/meeting");
      setMeetings(res.data);
    } catch (err) {
      showToast("Failed to load meetings", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.time || !form.location) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/meeting", form);
      setMeetings((prev) => [res.data, ...prev]);
      setForm({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
      });
      showToast("Meeting scheduled successfully! Live notifications sent to all staff members.");
    } catch (err) {
      showToast("Failed to schedule meeting", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mgmt-page" style={{ padding: "0" }}>
      {/* Toast Notification */}
      {toast && (
        <div 
          className={`mgmt-toast ${toast.type === "error" ? "toast-error" : "toast-success"}`}
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 9999,
            padding: "12px 20px",
            borderRadius: "var(--radius)",
            background: toast.type === "error" ? "var(--accent-red)" : "var(--accent-green)",
            color: "#fff",
            boxShadow: "var(--shadow-lg)",
            animation: "fadeIn 0.3s ease-out",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {toast.type === "error" ? "⚠️" : "✓"} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="mgmt-header" style={{ marginBottom: "24px" }}>
        <div>
          <h1 className="page-h1">Meeting Scheduler</h1>
          <p className="page-sub">Schedule staff meetings and broadcast automatic notifications to all coordinators</p>
        </div>
        <div className="mgmt-header-stats">
          <div className="mgmt-mini-stat">
            <span className="mgmt-mini-val">{meetings.length}</span>
            <span className="mgmt-mini-label">Total Meetings</span>
          </div>
          <div className="mgmt-mini-stat">
            <span className="mgmt-mini-val">🎒</span>
            <span className="mgmt-mini-label">Staff Broadcast</span>
          </div>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
        gap: "24px",
        alignItems: "start"
      }}>
        {/* Left Side: Schedule Form */}
        <div className="mgmt-table-card" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "18px", color: "var(--text-primary)" }}>
            📅 Create New Staff Meeting
          </h2>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label htmlFor="meet-title" style={{ display: "block", fontSize: "0.85rem", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "6px" }}>
                Meeting Title <span style={{ color: "var(--accent-red)" }}>*</span>
              </label>
              <input
                id="meet-title"
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. CSE Faculty Sync-up"
                required
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  color: "var(--text-primary)",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label htmlFor="meet-date" style={{ display: "block", fontSize: "0.85rem", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "6px" }}>
                  Date <span style={{ color: "var(--accent-red)" }}>*</span>
                </label>
                <input
                  id="meet-date"
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    color: "var(--text-primary)",
                    outline: "none",
                  }}
                />
              </div>
              <div>
                <label htmlFor="meet-time" style={{ display: "block", fontSize: "0.85rem", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "6px" }}>
                  Time <span style={{ color: "var(--accent-red)" }}>*</span>
                </label>
                <input
                  id="meet-time"
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    color: "var(--text-primary)",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="meet-location" style={{ display: "block", fontSize: "0.85rem", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "6px" }}>
                Location / Venue <span style={{ color: "var(--accent-red)" }}>*</span>
              </label>
              <input
                id="meet-location"
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Conference Room A / Zoom Link"
                required
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  color: "var(--text-primary)",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label htmlFor="meet-description" style={{ display: "block", fontSize: "0.85rem", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "6px" }}>
                Agenda / Description
              </label>
              <textarea
                id="meet-description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Details or meeting links..."
                rows={3}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  color: "var(--text-primary)",
                  outline: "none",
                  resize: "vertical"
                }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{
                width: "100%",
                padding: "12px",
                fontWeight: "600",
                fontSize: "0.95rem",
                marginTop: "10px"
              }}
            >
              {submitting ? "Scheduling..." : "🚀 Schedule & Notify Staff"}
            </button>
          </form>
        </div>

        {/* Right Side: Upcoming Meetings List */}
        <div className="mgmt-table-card" style={{ padding: "24px", minHeight: "350px" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "18px", color: "var(--text-primary)" }}>
            🛎️ Scheduled Meetings
          </h2>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "200px", color: "var(--text-secondary)", gap: "10px" }}>
              <span className="spinner" style={{ width: "30px", height: "30px" }}></span>
              <span>Loading meetings...</span>
            </div>
          ) : meetings.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "200px", color: "var(--text-secondary)", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: "10px" }}>💤</div>
              <p>No meetings scheduled yet.</p>
              <p style={{ fontSize: "0.85rem", opacity: 0.7 }}>Fill out the form on the left to set up a meeting.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxHeight: "400px", overflowY: "auto", paddingRight: "4px" }}>
              {meetings.map((m) => (
                <div
                  key={m.id}
                  style={{
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    padding: "16px",
                    transition: "var(--transition)",
                    position: "relative"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-hover)";
                    e.currentTarget.style.background = "var(--bg-card-hover)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                    <h3 style={{ fontSize: "0.95rem", fontWeight: "600", color: "var(--text-primary)" }}>
                      {m.title}
                    </h3>
                    <span style={{
                      fontSize: "0.75rem",
                      padding: "3px 8px",
                      borderRadius: "100px",
                      background: "rgba(99, 102, 241, 0.15)",
                      color: "var(--accent-blue-light)",
                      fontWeight: "600"
                    }}>
                      📆 {m.date}
                    </span>
                  </div>
                  {m.description && (
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "12px", lineHeight: "1.4" }}>
                      {m.description}
                    </p>
                  )}
                  <div style={{ display: "flex", gap: "16px", fontSize: "0.8rem", color: "var(--text-muted)", borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "10px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      ⏰ <b>{m.time}</b>
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      📍 <b>{m.location}</b>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
