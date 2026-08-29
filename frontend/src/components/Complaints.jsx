// src/components/Complaints.jsx
// Modern Issue Tracking & Campus Complaints Portal

import React, { useState } from "react";
import { MessageSquare, Plus, Clock, CheckCircle2, AlertCircle, ShieldAlert, ArrowRight, User } from "lucide-react";

const INITIAL_COMPLAINTS = [
  {
    id: "TKT-8941",
    category: "Hostel & Infrastructure",
    subject: "Wi-Fi Access Point offline in B-Block 3rd Floor",
    priority: "HIGH",
    department: "IT Infrastructure",
    status: "IN PROGRESS",
    created: "2026-08-22",
    updated: "2026-08-24 10:30 AM",
    timeline: [
      { status: "OPEN", text: "Ticket submitted by Gowthami N", date: "Aug 22, 09:15 AM" },
      { status: "IN PROGRESS", text: "Assigned to Network Admin (Rajesh Kumar)", date: "Aug 23, 02:00 PM" },
    ]
  },
  {
    id: "TKT-8920",
    category: "Library Services",
    subject: "Request for IEEE Access Credentials Renewal",
    priority: "MEDIUM",
    department: "Central Library",
    status: "RESOLVED",
    created: "2026-08-18",
    updated: "2026-08-20 04:15 PM",
    timeline: [
      { status: "OPEN", text: "Ticket submitted", date: "Aug 18, 11:00 AM" },
      { status: "IN PROGRESS", text: "Verified by Chief Librarian", date: "Aug 19, 10:00 AM" },
      { status: "RESOLVED", text: "Credentials updated & emailed", date: "Aug 20, 04:15 PM" },
    ]
  }
];

export default function Complaints() {
  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [showNewModal, setShowNewModal] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Hostel & Infrastructure");
  const [priority, setPriority] = useState("MEDIUM");
  const [details, setDetails] = useState("");

  const handleCreate = (e) => {
    e.preventDefault();
    if (!subject || !details) return;

    const newTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      category,
      subject,
      priority,
      department: category.includes("Hostel") ? "Hostel Admin" : "Campus Services",
      status: "OPEN",
      created: "Just now",
      updated: "Just now",
      timeline: [
        { status: "OPEN", text: "Ticket submitted by Student", date: "Just now" }
      ]
    };

    setComplaints([newTicket, ...complaints]);
    setShowNewModal(false);
    setSubject("");
    setDetails("");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "OPEN":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">OPEN</span>;
      case "IN PROGRESS":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">IN PROGRESS</span>;
      case "RESOLVED":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">RESOLVED</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-800 text-slate-400">CLOSED</span>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-heading">
            Campus Helpdesk & Issue Tracker
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Transparent grievance tracking, SLAs, and direct resolution pipelines.
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" /> Submit New Ticket
        </button>
      </div>

      {/* Pipeline Visual Stepper */}
      <div className="glass-panel rounded-2xl p-6">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-4">
          WORKFLOW RESOLUTION PIPELINE
        </h3>
        <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold font-mono">
          <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/30 text-amber-400 flex flex-col items-center gap-1">
            <span>1. OPEN</span>
            <span className="text-[10px] text-slate-400 font-normal">Ticket Logged</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-indigo-500/30 text-indigo-400 flex flex-col items-center gap-1">
            <span>2. IN PROGRESS</span>
            <span className="text-[10px] text-slate-400 font-normal">Assigned Tech</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-400 flex flex-col items-center gap-1">
            <span>3. RESOLVED</span>
            <span className="text-[10px] text-slate-400 font-normal">Fixed & Verified</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 flex flex-col items-center gap-1">
            <span>4. CLOSED</span>
            <span className="text-[10px] text-slate-400 font-normal">Archived</span>
          </div>
        </div>
      </div>

      {/* Complaint Tickets List */}
      <div className="space-y-4">
        {complaints.map((ticket) => (
          <div key={ticket.id} className="glass-panel rounded-2xl p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-indigo-400 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  {ticket.id}
                </span>
                {getStatusBadge(ticket.status)}
                <span className="text-xs font-bold text-slate-300">{ticket.category}</span>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Assigned: <strong className="text-slate-200">{ticket.department}</strong>
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{ticket.subject}</h3>
              <p className="text-xs text-slate-400 mt-1">Created: {ticket.created} • Last update: {ticket.updated}</p>
            </div>

            {/* Timeline */}
            <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400">TICKET AUDIT TRAIL</span>
              {ticket.timeline.map((step, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{step.text}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{step.date}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* New Ticket Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <form onSubmit={handleCreate} className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white font-heading">Submit Campus Complaint / Request</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
              >
                <option value="Hostel & Infrastructure">Hostel & Infrastructure</option>
                <option value="Academic & Examinations">Academic & Examinations</option>
                <option value="Library Services">Library Services</option>
                <option value="IT & Wifi Network">IT & Wifi Network</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Subject / Summary</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Short descriptive title of the issue..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Description</label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder="Provide room numbers, dates, or error details..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
              >
                Submit Ticket
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
