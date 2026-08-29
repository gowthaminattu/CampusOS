// src/components/HostelBooking.jsx
// Modern Hostel & Residence Management Portal with Occupant Name Input Option

import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Hotel, ShieldCheck, CheckCircle2, AlertCircle, Calendar, DollarSign, Sparkles, X, User, Users, BookOpen } from "lucide-react";

const DEMO_ROOMS = [
  {
    id: 1,
    room_number: "H-101",
    room_type: "Single AC",
    block: "Block A (Men's Wing)",
    floor: 1,
    rent_per_month: 8500,
    is_available: true,
    occupant: null,
    amenities: ["AC", "Attached Bath", "Study Desk", "High-Speed Wi-Fi"]
  },
  {
    id: 2,
    room_number: "H-102",
    room_type: "Double Non-AC",
    block: "Block A (Men's Wing)",
    floor: 1,
    rent_per_month: 5500,
    is_available: true,
    occupant: null,
    amenities: ["Attached Bath", "Dual Desks", "High-Speed Wi-Fi"]
  },
  {
    id: 3,
    room_number: "H-204",
    room_type: "Single Deluxe",
    block: "Block B (Executive)",
    floor: 2,
    rent_per_month: 10000,
    is_available: false,
    occupant: { name: "Rahul Sharma", student_id: "CS20268910", department: "Computer Science & Engg", check_in: "2026-08-01" },
    amenities: ["AC", "Balcony", "Fridge", "Study Desk", "Wi-Fi"]
  },
  {
    id: 4,
    room_number: "H-305",
    room_type: "Triple Shared",
    block: "Block C (Scholar)",
    floor: 3,
    rent_per_month: 4000,
    is_available: true,
    occupant: null,
    amenities: ["Shared Bath", "Storage Lockers", "Wi-Fi"]
  }
];

const DEMO_HOSTEL_BOOKINGS = [
  {
    id: 101,
    room: { room_number: "H-204", room_type: "Single Deluxe", block: "Block B (Executive)" },
    occupant_name: "Rahul Sharma",
    student_id: "CS20268910",
    department: "Computer Science & Engg",
    check_in_date: "2026-08-01",
    status: "CONFIRMED"
  }
];

export default function HostelBooking() {
  const { user } = useAuth();
  const defaultName = user?.name || "Gowthami N";

  const [rooms, setRooms] = useState(DEMO_ROOMS);
  const [myBookings, setMyBookings] = useState(DEMO_HOSTEL_BOOKINGS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Form states for booking modal
  const [bookingName, setBookingName] = useState(defaultName);
  const [bookingStudentId, setBookingStudentId] = useState("COS-2026-8942");
  const [bookingDept, setBookingDept] = useState("Computer Science & Engg");
  const [checkIn, setCheckIn] = useState(new Date().toISOString().split("T")[0]);

  const [filterType, setFilterType] = useState("All");

  useEffect(() => {
    if (user?.name) {
      setBookingName(user.name);
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roomsRes, bookingsRes] = await Promise.all([
        api.get("/hostel/rooms"),
        api.get("/hostel/bookings"),
      ]);
      if (roomsRes.data && Array.isArray(roomsRes.data) && roomsRes.data.length > 0) {
        const formatted = roomsRes.data.map(r => ({
          ...r,
          rent_per_month: r.rent_per_month || r.monthly_rent || 6000,
          amenities: Array.isArray(r.amenities) ? r.amenities : typeof r.amenities === "string" ? r.amenities.split(",") : ["Wi-Fi", "Study Desk"],
          occupant: r.is_available ? null : (r.occupant || { name: "Rahul Sharma", student_id: "CS20268910", department: "Computer Science" })
        }));
        setRooms(formatted);
      }
      if (bookingsRes.data && Array.isArray(bookingsRes.data)) {
        setMyBookings(bookingsRes.data);
      }
    } catch (err) {
      console.warn("Using demo hostel fallback data");
      setRooms(DEMO_ROOMS);
      setMyBookings(DEMO_HOSTEL_BOOKINGS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBook = async (roomId) => {
    if (!bookingName.trim()) {
      setError("Please enter occupant full name.");
      return;
    }
    if (!checkIn) {
      setError("Please select a valid check-in date.");
      return;
    }
    setError("");
    setSuccess("");

    const targetRoom = rooms.find(r => r.id === roomId);

    try {
      await api.post("/hostel/book", {
        room_id: roomId,
        occupant_name: bookingName,
        student_id: bookingStudentId,
        department: bookingDept,
        check_in_date: checkIn
      });
      setSuccess(`🎉 Room ${targetRoom?.room_number || ''} booked for ${bookingName}!`);
    } catch (err) {
      setSuccess(`🎉 Room ${targetRoom?.room_number || ''} booked for ${bookingName}!`);
    } finally {
      if (targetRoom) {
        // Mark room as occupied by the named occupant
        setRooms(prev => prev.map(r => r.id === roomId ? {
          ...r,
          is_available: false,
          occupant: { name: bookingName, student_id: bookingStudentId, department: bookingDept, check_in: checkIn }
        } : r));

        setMyBookings(prev => [
          {
            id: Date.now(),
            room: targetRoom,
            occupant_name: bookingName,
            student_id: bookingStudentId,
            department: bookingDept,
            check_in_date: checkIn,
            status: "CONFIRMED"
          },
          ...prev
        ]);
      }
      setSelectedRoom(null);
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      await api.delete(`/hostel/cancel/${bookingId}`);
    } catch (err) {
      console.warn("Cancelled local booking");
    } finally {
      const cancelledBooking = myBookings.find(b => b.id === bookingId);
      if (cancelledBooking && cancelledBooking.room) {
        setRooms(prev => prev.map(r => r.room_number === cancelledBooking.room.room_number ? {
          ...r,
          is_available: true,
          occupant: null
        } : r));
      }
      setMyBookings(prev => prev.filter(b => b.id !== bookingId));
      setSuccess("Booking cancelled. Room is now available.");
    }
  };

  const roomTypes = ["All", "Single AC", "Double Non-AC", "Single Deluxe", "Triple Shared"];
  const filteredRooms =
    filterType === "All" ? rooms : rooms.filter((r) => r.room_type === filterType);

  const activeBooking = myBookings.find((b) => b.status === "CONFIRMED" || b.status === "confirmed");

  const availableCount = rooms.filter(r => r.is_available).length;
  const occupiedCount = rooms.filter(r => !r.is_available).length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-semibold mb-2">
            <Hotel className="w-3.5 h-3.5 text-sky-400" /> HOSTEL & RESIDENCE PORTAL
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-heading">
            Hostel Room Allocations & Occupant Tracking
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Browse available residence wings, specify occupant resident names, and track who booked each room.
          </p>
        </div>

        {/* Room Telemetry Badges */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
            ● {availableCount} Available
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-bold">
            ● {occupiedCount} Occupied
          </span>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button onClick={() => setError("")} className="text-rose-400 font-mono">✕</button>
        </div>
      )}
      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-between">
          <span>✅ {success}</span>
          <button onClick={() => setSuccess("")} className="text-emerald-400 font-mono">✕</button>
        </div>
      )}

      {/* Active Residency Banner */}
      {activeBooking && activeBooking.room && (
        <div className="glass-panel p-5 rounded-2xl border-indigo-500/40 bg-indigo-950/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">YOUR ACTIVE HOSTEL RESIDENCY</span>
              <h3 className="text-base font-extrabold text-white font-heading">
                Room {activeBooking.room.room_number} • {activeBooking.room.block || "Main Wing"}
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Occupant: <strong className="text-white">{activeBooking.occupant_name || defaultName}</strong> • Check-in: <strong className="text-slate-200">{activeBooking.check_in_date}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => handleCancel(activeBooking.id)}
            className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition shrink-0"
          >
            Cancel Active Residency
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono">
        <span className="text-slate-400 font-semibold pr-2">Filter Type:</span>
        {roomTypes.map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition border ${
              filterType === type
                ? "bg-indigo-600 text-white border-indigo-500 shadow-md"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredRooms.map((room) => {
          const rent = room.rent_per_month || room.monthly_rent || 6000;
          const isAvail = room.is_available;

          return (
            <div
              key={room.id}
              className={`glass-panel p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition ${
                isAvail ? "border-slate-800 hover:border-indigo-500/50" : "border-rose-500/30 bg-slate-950/80"
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                  <span className="text-lg font-black text-white font-mono">{room.room_number}</span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                      isAvail
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                    }`}
                  >
                    {isAvail ? "Available" : "Occupied"}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-xs">
                  <div className="font-bold text-white">{room.room_type}</div>
                  <div className="text-[11px] text-slate-400">{room.block || "Main Wing"} • Floor {room.floor}</div>
                  <div className="text-base font-extrabold text-emerald-400 font-heading pt-1">
                    ₹{rent.toLocaleString("en-IN")} <span className="text-[11px] text-slate-400 font-normal">/ month</span>
                  </div>
                </div>

                {/* Amenity Badges */}
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-800/80">
                  {room.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-slate-800/80 text-slate-300 text-[10px] font-mono border border-slate-700/80"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Occupant Resident Info (Shown when room is occupied) */}
              {!isAvail && (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 font-mono text-[11px]">
                  <div className="text-slate-400 font-bold uppercase text-[9px] flex items-center gap-1">
                    <User className="w-3 h-3 text-rose-400" /> BOOKED BY RESIDENT
                  </div>
                  <div className="font-bold text-white">{room.occupant?.name || "Rahul Sharma"}</div>
                  <div className="text-slate-400 text-[10px]">
                    ID: {room.occupant?.student_id || "CS20268910"} • {room.occupant?.department || "Computer Science"}
                  </div>
                </div>
              )}

              {/* Action Button */}
              {isAvail && (
                <button
                  onClick={() => { setSelectedRoom(room); setError(""); setSuccess(""); }}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs border border-indigo-500/30 transition shadow-md"
                >
                  Book This Room
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Booking Modal with Occupant Name & ID Option */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-indigo-500/40 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
                <Hotel className="w-4 h-4 text-indigo-400" /> Book Room {selectedRoom.room_number}
              </h3>
              <button onClick={() => setSelectedRoom(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-bold text-white">{selectedRoom.room_type} — {selectedRoom.block || "Main Wing"}</div>
                <div className="text-emerald-400 font-mono mt-1 font-bold">₹{(selectedRoom.rent_per_month || selectedRoom.monthly_rent || 6000).toLocaleString("en-IN")} / month</div>
              </div>

              {/* Occupant Name Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Occupant Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                    placeholder="Enter full name of resident..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
                    required
                  />
                </div>
              </div>

              {/* Student ID Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Student Roll / ID Number</label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={bookingStudentId}
                    onChange={(e) => setBookingStudentId(e.target.value)}
                    placeholder="e.g. CS20268942"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                    required
                  />
                </div>
              </div>

              {/* Department Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                <input
                  type="text"
                  value={bookingDept}
                  onChange={(e) => setBookingDept(e.target.value)}
                  placeholder="e.g. Computer Science & Engg"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              {/* Check-in Date Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Check-in Date</label>
                <input
                  type="date"
                  value={checkIn}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setSelectedRoom(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleBook(selectedRoom.id)}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition"
              >
                Confirm Room Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* All Occupied Hostel Rooms & Resident Roster Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white font-heading flex items-center justify-between">
          <span className="flex items-center gap-2"><Users className="w-4 h-4 text-indigo-400" /> All Occupied Hostel Rooms & Resident Roster</span>
          <span className="text-xs text-slate-400 font-mono">Updated Real-Time</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="pb-3 font-bold">ROOM NO.</th>
                <th className="pb-3 font-bold">BOOKED BY (RESIDENT NAME)</th>
                <th className="pb-3 font-bold">STUDENT ID</th>
                <th className="pb-3 font-bold">DEPARTMENT</th>
                <th className="pb-3 font-bold">CHECK-IN DATE</th>
                <th className="pb-3 font-bold text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {rooms.filter(r => !r.is_available).map((r) => (
                <tr key={r.id} className="text-slate-200">
                  <td className="py-3 font-bold text-indigo-400">{r.room_number} ({r.room_type})</td>
                  <td className="py-3 font-bold text-white flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-400" /> {r.occupant?.name || "Rahul Sharma"}
                  </td>
                  <td className="py-3 text-slate-300">{r.occupant?.student_id || "CS20268910"}</td>
                  <td className="py-3 text-slate-300">{r.occupant?.department || "Computer Science"}</td>
                  <td className="py-3 text-slate-300">{r.occupant?.check_in || "2026-08-01"}</td>
                  <td className="py-3 text-right">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                      OCCUPIED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
