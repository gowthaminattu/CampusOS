// src/pages/FacultyDashboard.jsx
// Faculty Workspace Command Center

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Calendar, CheckSquare, AlertTriangle, PlusCircle, CheckCircle2, Clock, BookOpen, ShieldAlert } from "lucide-react";

export default function FacultyDashboard() {
  const navigate = useNavigate();
  const [attendanceMarked, setAttendanceMarked] = useState(false);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Faculty Command Header */}
      <div className="glass-panel rounded-3xl p-6 lg:p-8 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-semibold mb-2">
            FACULTY WORKSPACE
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-heading">
            Faculty Command Center
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Manage course schedules, student attendance queues, grade entry, and performance insights.
          </p>
        </div>

        {/* Quick Action Trigger Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setAttendanceMarked(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center gap-1.5"
          >
            <CheckSquare className="w-4 h-4" /> Mark Attendance
          </button>
          <button
            onClick={() => navigate("/students")}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition flex items-center gap-1.5"
          >
            <Users className="w-4 h-4" /> Roster
          </button>
          <button
            onClick={() => alert("Create Student Poll modal triggered")}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" /> Create Poll
          </button>
        </div>
      </div>

      {attendanceMarked && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Attendance for CS301 (Data Structures) marked & synced to registry.
          </span>
          <button onClick={() => setAttendanceMarked(false)} className="text-emerald-400 font-mono underline">Dismiss</button>
        </div>
      )}

      {/* Grid Row 1: Today's Teaching Schedule & Attendance Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Teaching Timeline */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" /> Today's Teaching Schedule
            </h3>
            <span className="text-xs text-slate-400 font-mono">3 Sessions Assigned</span>
          </div>

          <div className="space-y-3">
            {[
              { time: "08:30 - 10:00 AM", course: "CS301: Data Structures (Sec A)", room: "Lab Block 304", status: "COMPLETED", students: 58 },
              { time: "10:30 - 11:30 AM", course: "CS303: Digital Electronics (Sec B)", room: "Hall B-12", status: "IN PROGRESS", students: 62 },
              { time: "01:30 - 03:00 PM", course: "CS305: Full Stack Web Dev (Sec A)", room: "Lab Block 102", status: "UPCOMING", students: 60 },
            ].map((cls, i) => (
              <div key={i} className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono font-bold text-indigo-400">{cls.time}</div>
                  <div className="text-sm font-bold text-white mt-0.5">{cls.course}</div>
                  <div className="text-xs text-slate-400 mt-1">{cls.room} • {cls.students} Enrolled</div>
                </div>
                <button
                  onClick={() => setAttendanceMarked(true)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold transition shrink-0"
                >
                  {cls.status === "COMPLETED" ? "Review Attendance" : "Take Attendance"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Queue Card */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <span className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">ATTENDANCE QUEUE</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xs text-slate-300 font-semibold mb-3">
              2 Classes pending attendance verification submission for registry.
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">CS303 (Sec B)</div>
                  <div className="text-[10px] text-slate-400">Recorded by QR Scanner</div>
                </div>
                <button onClick={() => setAttendanceMarked(true)} className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono text-[10px] font-bold">
                  Approve
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
            Auto-syncs with Registrar DB at 5:00 PM.
          </div>
        </div>
      </div>

      {/* Grid Row 2: Performance Insights — Students Requiring Attention */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" /> Performance Insights — At-Risk Students
          </h3>
          <button onClick={() => navigate("/at-risk-students")} className="text-xs text-indigo-400 font-mono hover:underline">
            View All At-Risk Roster →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "Rahul Sharma", id: "COS-8910", course: "CS303", issue: "Attendance 72%", risk: "HIGH" },
            { name: "Ananya Roy", id: "COS-8924", course: "CS301", issue: "Mid-Term Score <45%", risk: "MEDIUM" },
            { name: "Karthik V", id: "COS-8935", course: "CS303", issue: "Attendance 74%", risk: "HIGH" },
          ].map((s, idx) => (
            <div key={idx} className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-white">{s.name}</div>
                <div className="text-[11px] font-mono text-slate-400">{s.id} • {s.course}</div>
                <div className="text-xs text-rose-400 font-semibold mt-2">{s.issue}</div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                {s.risk}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
