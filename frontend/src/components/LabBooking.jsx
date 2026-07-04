// src/components/LabBooking.jsx
// Lab booking interface — staff only. Students are blocked with a message.

import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function LabBookingInner() {
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [bookingDate, setBookingDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [purpose, setPurpose] = useState("");
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch labs and user's booking history
  const fetchData = async () => {
    setLoading(true);
    try {
      const [labsRes, bookingsRes] = await Promise.all([
        api.get("/lab/labs"),
        api.get("/lab/bookings"),
      ]);
      setLabs(labsRes.data);
      setMyBookings(bookingsRes.data);
    } catch {
      setError("Failed to load lab data.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch available slots when lab or date changes
  const fetchSlots = async (labId, date) => {
    setSlotsLoading(true);
    setSlots([]);
    setSelectedSlot(null);
    try {
      const res = await api.get(`/lab/slots/${labId}?booking_date=${date}`);
      setSlots(res.data);
    } catch {
      setError("Failed to load slots.");
    } finally {
      setSlotsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedLab && bookingDate) {
      fetchSlots(selectedLab.id, bookingDate);
    }
  }, [selectedLab, bookingDate]);

  const handleBook = async () => {
    if (!selectedLab || !selectedSlot) {
      setError("Please select a lab and a time slot.");
      return;
    }
    setBookingLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/lab/book", {
        lab_id: selectedLab.id,
        booking_date: bookingDate,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
        purpose: purpose || "Study session",
      });
      setSuccess(`🎉 ${selectedLab.name} booked for ${bookingDate} at ${selectedSlot.start_time}!`);
      setSelectedSlot(null);
      setPurpose("");
      fetchData();
      fetchSlots(selectedLab.id, bookingDate); // Refresh slots
    } catch (err) {
      setError(err.response?.data?.detail || "Booking failed.");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      await api.delete(`/lab/cancel/${bookingId}`);
      setSuccess("Lab booking cancelled.");
      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || "Cancel failed.");
    }
  };

  // Format time like "14:00" → "2:00 PM"
  const formatTime = (time) => {
    const [h, m] = time.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">🔬 Lab Booking</h1>
          <p className="page-subtitle">Reserve a lab slot for your session</p>
        </div>
      </div>

      {error && <div className="alert alert-error">⚠️ {error}</div>}
      {success && <div className="alert alert-success">✅ {success}</div>}

      <div className="lab-layout">
        {/* Left panel — lab selection */}
        <div className="lab-sidebar">
          <h2 className="sidebar-title">Select a Lab</h2>
          {loading ? (
            <div>{[1, 2, 3].map((i) => <div key={i} className="skeleton-card skeleton-sm" />)}</div>
          ) : (
            labs.map((lab) => (
              <button
                key={lab.id}
                id={`lab-${lab.id}`}
                className={`lab-item ${selectedLab?.id === lab.id ? "lab-item-active" : ""}`}
                onClick={() => { setSelectedLab(lab); setError(""); setSuccess(""); }}
              >
                <div className="lab-item-name">{lab.name}</div>
                <div className="lab-item-loc">📍 {lab.location}</div>
                <div className="lab-item-cap">👥 {lab.capacity} seats</div>
                <div className="lab-item-equip">🖥 {lab.equipment}</div>
              </button>
            ))
          )}
        </div>

        {/* Right panel — slots and booking */}
        <div className="lab-main">
          {!selectedLab ? (
            <div className="lab-empty">
              <div className="lab-empty-icon">🔬</div>
              <p>Select a lab on the left to view available slots</p>
            </div>
          ) : (
            <>
              <div className="lab-selected-header">
                <h2>{selectedLab.name}</h2>
                <div className="form-group" style={{ minWidth: "200px" }}>
                  <label className="form-label">Date</label>
                  <input
                    id="lab-date-picker"
                    type="date"
                    className="form-input"
                    value={bookingDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setBookingDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Time slots grid */}
              <h3 className="slots-title">Available Time Slots</h3>
              {slotsLoading ? (
                <div className="slots-loading">Loading slots...</div>
              ) : (
                <div className="slots-grid">
                  {slots.map((slot) => (
                    <button
                      key={slot.start_time}
                      id={`slot-${slot.start_time}`}
                      className={`slot-btn ${
                        !slot.is_available
                          ? "slot-btn-taken"
                          : selectedSlot?.start_time === slot.start_time
                          ? "slot-btn-selected"
                          : "slot-btn-free"
                      }`}
                      disabled={!slot.is_available}
                      onClick={() => setSelectedSlot(slot.is_available ? slot : null)}
                    >
                      <span className="slot-time">{formatTime(slot.start_time)}</span>
                      <span className="slot-status">
                        {slot.is_available ? "Free" : "Booked"}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Booking form */}
              {selectedSlot && (
                <div className="booking-panel">
                  <h3>
                    📅 Book {selectedLab.name} — {formatTime(selectedSlot.start_time)} to{" "}
                    {formatTime(selectedSlot.end_time)}
                  </h3>
                  <div className="form-group">
                    <label className="form-label">Purpose (optional)</label>
                    <input
                      id="lab-purpose"
                      type="text"
                      className="form-input"
                      placeholder="e.g., AI project, Networking assignment..."
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                    />
                  </div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      id="lab-book-confirm"
                      className="btn btn-primary"
                      onClick={handleBook}
                      disabled={bookingLoading}
                    >
                      {bookingLoading ? "Booking..." : "Confirm Booking"}
                    </button>
                    <button className="btn btn-ghost" onClick={() => setSelectedSlot(null)}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Booking history */}
      {myBookings.length > 0 && (
        <div className="history-section">
          <h2 className="section-title">📋 My Lab Bookings</h2>
          <div className="history-table">
            <div className="history-header">
              <span>Lab</span>
              <span>Date</span>
              <span>Time</span>
              <span>Purpose</span>
              <span>Status</span>
              <span>Action</span>
            </div>
            {myBookings.map((b) => (
              <div key={b.id} className="history-row">
                <span className="font-mono">{b.lab.name}</span>
                <span>{b.booking_date}</span>
                <span>{b.start_time}–{b.end_time}</span>
                <span>{b.purpose || "—"}</span>
                <span className={`status-badge ${b.status === "confirmed" ? "status-confirmed" : "status-cancelled"}`}>
                  {b.status}
                </span>
                <span>
                  {b.status === "confirmed" && (
                    <button className="btn btn-danger btn-xs" onClick={() => handleCancel(b.id)}>
                      Cancel
                    </button>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Export default wrapper handles the staff guard before rendering the inner component
export default function LabBooking() {
  const { isStaff } = useAuth();

  if (!isStaff) {
    return (
      <div className="access-denied-page">
        <div className="access-denied-card">
          <div className="access-denied-icon">🚫</div>
          <h2 className="access-denied-title">Access Restricted</h2>
          <p className="access-denied-msg">
            Lab booking is only available for <strong>staff and faculty</strong>.
            <br />
            Students can request lab access through the AI Assistant or contact your professor.
          </p>
          <a href="/chat" className="btn btn-primary" style={{ marginTop: 20, textDecoration: "none" }}>
            ✦ Ask AI Assistant
          </a>
        </div>
      </div>
    );
  }

  return <LabBookingInner />;
}
