// src/components/HostelBooking.jsx
// Displays all hostel rooms, their availability, and allows booking.

import { useEffect, useState } from "react";
import api from "../api/axios";

export default function HostelBooking() {
  const [rooms, setRooms] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingState, setBookingState] = useState({}); // Per-room loading state
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [filterType, setFilterType] = useState("All");

  // Fetch rooms and existing bookings
  const fetchData = async () => {
    setLoading(true);
    try {
      const [roomsRes, bookingsRes] = await Promise.all([
        api.get("/hostel/rooms"),
        api.get("/hostel/bookings"),
      ]);
      setRooms(roomsRes.data);
      setMyBookings(bookingsRes.data);
    } catch (err) {
      setError("Failed to load hostel data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBook = async (roomId) => {
    if (!checkIn) {
      setError("Please select a check-in date.");
      return;
    }
    setBookingState({ ...bookingState, [roomId]: true });
    setError("");
    setSuccess("");

    try {
      await api.post("/hostel/book", { room_id: roomId, check_in_date: checkIn });
      setSuccess("🎉 Room booked successfully!");
      setSelectedRoom(null);
      fetchData(); // Refresh rooms
    } catch (err) {
      setError(err.response?.data?.detail || "Booking failed.");
    } finally {
      setBookingState({ ...bookingState, [roomId]: false });
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      await api.delete(`/hostel/cancel/${bookingId}`);
      setSuccess("Booking cancelled.");
      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || "Cancel failed.");
    }
  };

  const roomTypes = ["All", "Single", "Double", "Triple"];
  const filteredRooms =
    filterType === "All" ? rooms : rooms.filter((r) => r.room_type === filterType);

  const activeBooking = myBookings.find((b) => b.status === "confirmed");

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">🏨 Hostel Booking</h1>
          <p className="page-subtitle">Browse and book your hostel room</p>
        </div>
        <div className="room-stats">
          <div className="stat-pill stat-available">
            ✅ {rooms.filter((r) => r.is_available).length} Available
          </div>
          <div className="stat-pill stat-occupied">
            🔴 {rooms.filter((r) => !r.is_available).length} Occupied
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && <div className="alert alert-error">⚠️ {error}</div>}
      {success && <div className="alert alert-success">✅ {success}</div>}

      {/* Active booking banner */}
      {activeBooking && activeBooking.room && (
        <div className="active-booking-banner">
          <div>
            <p className="banner-label">Your Current Room</p>
            <p className="banner-room">{activeBooking.room.room_number} — {activeBooking.room.block}</p>
            <p className="banner-date">Check-in: {activeBooking.check_in_date}</p>
          </div>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleCancel(activeBooking.id)}
          >
            Cancel Booking
          </button>
        </div>
      )}

      {/* Filter tabs */}
      <div className="filter-tabs">
        {roomTypes.map((type) => (
          <button
            key={type}
            className={`filter-tab ${filterType === type ? "filter-tab-active" : ""}`}
            onClick={() => setFilterType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Booking date picker (shown when a room is selected) */}
      {selectedRoom && (
        <div className="booking-panel">
          <h3>📅 Book Room {selectedRoom.room_number}</h3>
          <div className="booking-panel-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Check-in Date</label>
              <input
                type="date"
                className="form-input"
                value={checkIn}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
            <button
              id={`book-room-${selectedRoom.id}`}
              className="btn btn-primary"
              onClick={() => handleBook(selectedRoom.id)}
              disabled={bookingState[selectedRoom.id]}
            >
              {bookingState[selectedRoom.id] ? "Booking..." : "Confirm Booking"}
            </button>
            <button className="btn btn-ghost" onClick={() => setSelectedRoom(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Room grid */}
      {loading ? (
        <div className="loading-grid">
          {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton-card" />)}
        </div>
      ) : (
        <div className="rooms-grid">
          {filteredRooms.map((room) => (
            <div key={room.id} className={`room-card ${!room.is_available ? "room-card-occupied" : ""}`}>
              <div className="room-card-header">
                <span className="room-number">{room.room_number}</span>
                <span className={`room-status-badge ${room.is_available ? "badge-available" : "badge-occupied"}`}>
                  {room.is_available ? "Available" : "Occupied"}
                </span>
              </div>

              <div className="room-details">
                <div className="room-detail-item">
                  <span className="detail-icon">🏠</span>
                  <span>{room.room_type} Room</span>
                </div>
                <div className="room-detail-item">
                  <span className="detail-icon">🏢</span>
                  <span>{room.block} — Floor {room.floor}</span>
                </div>
                <div className="room-detail-item">
                  <span className="detail-icon">💰</span>
                  <span>₹{room.monthly_rent}/month</span>
                </div>
                <div className="room-detail-item">
                  <span className="detail-icon">✨</span>
                  <span className="amenities-text">{room.amenities}</span>
                </div>
              </div>

              {room.is_available && !activeBooking && (
                <button
                  id={`select-room-${room.id}`}
                  className="btn btn-primary btn-full"
                  onClick={() => { setSelectedRoom(room); setError(""); setSuccess(""); }}
                >
                  Book This Room
                </button>
              )}
              {room.is_available && activeBooking && (
                <p className="room-hint">Cancel your current booking first</p>
              )}
              {!room.is_available && (
                <div className="room-occupied-label">Currently Occupied</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Booking history */}
      {myBookings.length > 0 && (
        <div className="history-section">
          <h2 className="section-title">📋 My Booking History</h2>
          <div className="history-table">
            <div className="history-header">
              <span>Room</span>
              <span>Block</span>
              <span>Check-in</span>
              <span>Status</span>
              <span>Action</span>
            </div>
            {myBookings.map((b) => (
              <div key={b.id} className="history-row">
                <span className="font-mono">{b.room?.room_number ?? "—"}</span>
                <span>{b.room?.block ?? "—"}</span>
                <span>{b.check_in_date}</span>
                <span className={`status-badge ${b.status === "confirmed" ? "status-confirmed" : "status-cancelled"}`}>
                  {b.status}
                </span>
                <span>
                  {b.status === "confirmed" && (
                    <button
                      className="btn btn-danger btn-xs"
                      onClick={() => handleCancel(b.id)}
                    >
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
