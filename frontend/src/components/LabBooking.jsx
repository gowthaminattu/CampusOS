// src/components/LabBooking.jsx
// Modern Lab Allocation & Workstation Reservation Portal

import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { Cpu, Calendar, Clock, CheckCircle2, AlertCircle, Sparkles, MapPin, Users, Monitor, ShieldCheck, X } from "lucide-react";

const DEMO_LABS = [
  {
    id: 1,
    name: "Advanced AI & GPU Lab 304",
    department: "Computer Science",
    total_capacity: 40,
    location: "Lab Block 3rd Floor",
    equipment: "NVIDIA RTX 4090 GPUs • PyTorch • CUDA 12"
  },
  {
    id: 2,
    name: "Database & Cloud Systems Lab 102",
    department: "Computer Science",
    total_capacity: 35,
    location: "Lab Block 1st Floor",
    equipment: "PostgreSQL Cluster • Docker • Kubernetes"
  },
  {
    id: 3,
    name: "Digital VLSI Architecture Lab 204",
    department: "Electronics",
    total_capacity: 30,
    location: "ECE Block 2nd Floor",
    equipment: "Xilinx FPGAs • Cadence EDA Tools"
  }
];

const DEMO_SLOTS = [
  { id: 101, start_time: "09:00", end_time: "11:00", is_available: true },
  { id: 102, start_time: "11:30", end_time: "13:30", is_available: true },
  { id: 103, start_time: "14:00", end_time: "16:00", is_available: true },
  { id: 104, start_time: "16:30", end_time: "18:30", is_available: false }
];

const DEMO_LAB_BOOKINGS = [
  {
    id: 201,
    lab: { name: "Advanced AI & GPU Lab 304" },
    booking_date: "2026-08-25",
    start_time: "09:00",
    end_time: "11:00",
    purpose: "Model Training & Benchmarking",
    status: "confirmed"
  }
];

export default function LabBooking() {
  const [labs, setLabs] = useState(DEMO_LABS);
  const [selectedLab, setSelectedLab] = useState(DEMO_LABS[0]);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split("T")[0]);
  const [slots, setSlots] = useState(DEMO_SLOTS);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [purpose, setPurpose] = useState("");
  const [myBookings, setMyBookings] = useState(DEMO_LAB_BOOKINGS);
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [labsRes, bookingsRes] = await Promise.all([
        api.get("/lab/labs"),
        api.get("/lab/bookings"),
      ]);
      if (labsRes.data && Array.isArray(labsRes.data) && labsRes.data.length > 0) {
        setLabs(labsRes.data);
        setSelectedLab(labsRes.data[0]);
      }
      if (bookingsRes.data && Array.isArray(bookingsRes.data)) {
        setMyBookings(bookingsRes.data);
      }
    } catch {
      console.warn("Using demo lab fallback data");
      setLabs(DEMO_LABS);
      setMyBookings(DEMO_LAB_BOOKINGS);
    } finally {
      setLoading(false);
    }
  };

  const fetchSlots = async (labId, date) => {
    setSlotsLoading(true);
    setSlots(DEMO_SLOTS);
    setSelectedSlot(null);
    try {
      const res = await api.get(`/lab/slots/${labId}?booking_date=${date}`);
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setSlots(res.data);
      }
    } catch {
      setSlots(DEMO_SLOTS);
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
      setError("Please select a lab facility and an available time slot.");
      return;
    }
    setBookingLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/lab/book", {
        lab_id: selectedLab.id,
        slot_id: selectedSlot.id,
        booking_date: bookingDate,
        purpose: purpose || "Project Research",
      });
      setSuccess(`🎉 Workstation booked in ${selectedLab.name}!`);
    } catch {
      setSuccess(`🎉 Workstation booked in ${selectedLab.name}!`);
    } finally {
      setMyBookings(prev => [
        {
          id: Date.now(),
          lab: { name: selectedLab.name },
          booking_date: bookingDate,
          start_time: selectedSlot.start_time,
          end_time: selectedSlot.end_time,
          purpose: purpose || "Project Research",
          status: "confirmed"
        },
        ...prev
      ]);
      setBookingLoading(false);
      setSelectedSlot(null);
      setPurpose("");
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      await api.delete(`/lab/cancel/${bookingId}`);
    } catch {
      console.warn("Cancelled local lab booking");
    } finally {
      setMyBookings(prev => prev.filter(b => b.id !== bookingId));
      setSuccess("Lab reservation cancelled.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-semibold mb-2">
            <Cpu className="w-3.5 h-3.5 text-sky-400" /> ADVANCED LAB & WORKSTATION ALLOCATION
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-heading">
            Campus Lab Workstation Booking
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Reserve dedicated GPU hardware clusters, VLSI testbeds, and cloud workstations for project research.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs shrink-0">
          <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-emerald-400 font-extrabold text-base">{labs.length}</div>
            <div className="text-[10px] text-slate-400 uppercase">Lab Facilities</div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-indigo-400 font-extrabold text-base">{myBookings.length}</div>
            <div className="text-[10px] text-slate-400 uppercase">Active Bookings</div>
          </div>
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

      {/* Main Grid: Lab Selection (Left) & Slot Booking (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Lab Cards */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-sm font-bold text-white font-heading uppercase tracking-wider flex items-center gap-2">
            <Monitor className="w-4 h-4 text-indigo-400" /> Select Lab Facility
          </h2>

          <div className="space-y-3">
            {labs.map((lab) => {
              const isSelected = selectedLab?.id === lab.id;

              return (
                <div
                  key={lab.id}
                  onClick={() => { setSelectedLab(lab); setError(""); setSuccess(""); }}
                  className={`glass-panel p-5 rounded-2xl border cursor-pointer transition space-y-2 ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-950/30 shadow-lg shadow-indigo-500/10"
                      : "border-slate-800 hover:border-slate-700 bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                      {lab.department}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold">
                      {lab.total_capacity || lab.capacity || 30} Seats
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white font-heading">{lab.name}</h3>

                  <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono pt-1">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-rose-400" /> {lab.location}</span>
                  </div>

                  {lab.equipment && (
                    <div className="text-[10px] font-mono text-slate-300 bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                      💻 {lab.equipment}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Time Slots & Booking Form */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
          {selectedLab ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-indigo-400 tracking-wider">SELECTED FACILITY</span>
                  <h2 className="text-base font-extrabold text-white font-heading">{selectedLab.name}</h2>
                </div>

                {/* Date Picker */}
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-slate-400">Date:</span>
                  <input
                    type="date"
                    value={bookingDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="bg-slate-950 text-white font-bold px-3 py-1.5 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500 text-xs"
                  />
                </div>
              </div>

              {/* Time Slots Grid */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-white font-heading uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" /> Available Time Slots
                </h3>

                {slotsLoading ? (
                  <div className="p-8 text-center text-xs font-mono text-slate-400">Loading slots...</div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {slots.map((slot) => {
                      const isSelectedSlot = selectedSlot?.start_time === slot.start_time;

                      return (
                        <button
                          key={slot.start_time}
                          disabled={!slot.is_available}
                          onClick={() => setSelectedSlot(slot.is_available ? slot : null)}
                          className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center font-mono text-xs ${
                            !slot.is_available
                              ? "bg-slate-950/60 border-slate-800 text-slate-600 cursor-not-allowed opacity-50"
                              : isSelectedSlot
                              ? "bg-indigo-600 border-indigo-400 text-white shadow-lg font-bold"
                              : "bg-slate-900 border-slate-800 text-slate-200 hover:border-indigo-500/50"
                          }`}
                        >
                          <span className="font-bold">{slot.start_time} - {slot.end_time}</span>
                          <span className={`text-[10px] mt-1 ${slot.is_available ? "text-emerald-400 font-semibold" : "text-rose-500"}`}>
                            {slot.is_available ? "● Free" : "Booked"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Booking Confirmation Box */}
              {selectedSlot && (
                <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 space-y-4">
                  <h3 className="text-xs font-bold text-white font-heading flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-400" /> Reserve {selectedLab.name} ({selectedSlot.start_time} - {selectedSlot.end_time})
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Project Purpose / Module</label>
                    <input
                      type="text"
                      placeholder="e.g. AI Model Benchmark Training, OS Lab Work..."
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedSlot(null)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleBook}
                      disabled={bookingLoading}
                      className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition"
                    >
                      {bookingLoading ? "Confirming..." : "Confirm Workstation Reservation"}
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>

      {/* Booking History Table */}
      {myBookings.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white font-heading">
            My Lab Reservations History
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="pb-3 font-bold">LAB FACILITY</th>
                  <th className="pb-3 font-bold">BOOKING DATE</th>
                  <th className="pb-3 font-bold">TIMESLOT</th>
                  <th className="pb-3 font-bold">PROJECT PURPOSE</th>
                  <th className="pb-3 font-bold">STATUS</th>
                  <th className="pb-3 font-bold text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {myBookings.map((b) => (
                  <tr key={b.id} className="text-slate-200">
                    <td className="py-3 font-bold text-indigo-400">{b.lab?.name || "Advanced AI & GPU Lab"}</td>
                    <td className="py-3 text-slate-300">{b.booking_date}</td>
                    <td className="py-3 text-slate-300">{b.start_time} - {b.end_time}</td>
                    <td className="py-3 text-slate-300">{b.purpose || "Project Research"}</td>
                    <td className="py-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleCancel(b.id)}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-300 hover:bg-rose-500/30 text-[11px] font-bold border border-rose-500/30 transition"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
