// src/pages/StudentSuccessDashboard.jsx
// Student Command Center with Academic Health Ring, Today's Flow timeline, Attention Required cards, and Campus Pulse.

import React from "react";
import { useNavigate } from "react-router-dom";
import AcademicHealthRing from "../components/common/AcademicHealthRing";
import QRIDCard from "../components/common/QRIDCard";
import { useAuth } from "../context/AuthContext";
import { Sparkles, Calendar, AlertTriangle, Clock, Award, BookOpen, ChevronRight, Bell, Zap, ArrowRight, ShieldAlert, CreditCard } from "lucide-react";

export default function StudentSuccessDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userName = user?.name || "Gowthami";

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Personalized Top Command Header */}
      <div className="glass-panel rounded-3xl p-6 lg:p-8 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" /> STUDENT COMMAND CENTER
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-heading">
            Good morning, {userName}
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Here's what needs your attention today across academics, attendance, and campus services.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/chat")}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Ask Campus AI
          </button>
        </div>
      </div>

      {/* Grid Row 1: Academic Health & Today's Flow Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Academic Health Card */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col items-center text-center justify-between">
          <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">ACADEMIC HEALTH</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <AcademicHealthRing percentage={86} size={155} strokeWidth={12} />
          <div className="w-full pt-3 border-t border-slate-800 flex justify-between text-xs text-slate-400 font-mono">
            <span>GPA: <strong className="text-white">8.70</strong></span>
            <span>CGPA: <strong className="text-white">8.43</strong></span>
            <span>Credits: <strong className="text-emerald-400">132</strong></span>
          </div>
        </div>

        {/* Today's Flow Interactive Schedule Timeline */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" /> Today's Schedule & Flow — Mon, Aug 24
            </h3>
            <button onClick={() => navigate("/timetable")} className="text-xs text-indigo-400 hover:underline font-mono">
              Full Timetable →
            </button>
          </div>

          <div className="space-y-3 timeline-track pl-2">
            {[
              { time: "08:30 AM", title: "Data Structures & Algorithms (Lab)", room: "Lab Block 304", status: "COMPLETED", color: "text-emerald-400" },
              { time: "10:30 AM", title: "Digital Electronics & Architecture", room: "Hall B-12", status: "IN PROGRESS", color: "text-indigo-400" },
              { time: "01:30 PM", title: "Database Systems & SQL Optimization", room: "Hall C-08", status: "UPCOMING", color: "text-slate-400" },
            ].map((slot, i) => (
              <div key={i} className="flex items-start gap-4 bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
                <div className="text-xs font-mono font-bold text-indigo-400 shrink-0 min-w-[70px]">
                  {slot.time}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-white">{slot.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{slot.room}</div>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${slot.color} bg-slate-800`}>
                  {slot.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Row 2: Attention Required Dynamic Cards */}
      <div className="glass-panel rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white font-heading mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400" /> Attention Required
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Low Attendance Card */}
          <div
            onClick={() => navigate("/attendance")}
            className="bg-slate-900/80 border border-rose-500/30 hover:border-rose-500/60 p-4 rounded-xl cursor-pointer transition flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-xs font-bold text-rose-400">
              <span className="flex items-center gap-1.5"><ShieldAlert className="w-4 h-4" /> LOW ATTENDANCE ALERT</span>
              <span className="font-mono">76%</span>
            </div>
            <p className="text-xs text-slate-300 mt-2 font-semibold">
              Digital Electronics (CS303) is below the 80% threshold.
            </p>
            <div className="text-[11px] text-indigo-400 font-mono mt-3 font-semibold flex items-center gap-1">
              Resolve Attendance →
            </div>
          </div>

          {/* Upcoming Exam Card */}
          <div
            onClick={() => navigate("/performance")}
            className="bg-slate-900/80 border border-amber-500/30 hover:border-amber-500/60 p-4 rounded-xl cursor-pointer transition flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-xs font-bold text-amber-400">
              <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> UPCOMING MID-TERM</span>
              <span className="font-mono">Aug 28</span>
            </div>
            <p className="text-xs text-slate-300 mt-2 font-semibold">
              DBMS Mid-Sem Examination scheduled for Friday.
            </p>
            <div className="text-[11px] text-indigo-400 font-mono mt-3 font-semibold flex items-center gap-1">
              View Syllabus & Prep →
            </div>
          </div>

          {/* Pending Fee Card */}
          <div
            onClick={() => navigate("/fees")}
            className="bg-slate-900/80 border border-indigo-500/30 hover:border-indigo-500/60 p-4 rounded-xl cursor-pointer transition flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-xs font-bold text-indigo-400">
              <span className="flex items-center gap-1.5"><CreditCard className="w-4 h-4" /> PENDING FEE DUE</span>
              <span className="font-mono">₹25,000</span>
            </div>
            <p className="text-xs text-slate-300 mt-2 font-semibold">
              Final Tuition Fee Installment due on March 15.
            </p>
            <div className="text-[11px] text-indigo-400 font-mono mt-3 font-semibold flex items-center gap-1">
              Pay Online Gateway →
            </div>
          </div>
        </div>
      </div>

      {/* Grid Row 3: Campus Pulse & Digital QR ID Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campus Pulse (Events, Notices, Clubs) */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
              <Bell className="w-4 h-4 text-sky-400" /> Campus Pulse & Notices
            </h3>
            <span className="text-xs text-slate-400 font-mono">Live Feed</span>
          </div>

          <div className="space-y-3">
            {[
              { title: "Annual Hackathon 2026 Registration Open", tag: "EVENT", date: "Today", desc: "Form 4-member teams for 36-hour build challenge." },
              { title: "Placement Drive: Microsoft & Google Software Engineer Roles", tag: "CAREER", date: "Aug 26", desc: "Batch 2027 eligible for pre-placement talks." },
              { title: "Library Extended Hours for Exam Preparation", tag: "NOTICE", date: "Aug 22", desc: "Central Library open 24/7 till end of mid-terms." },
            ].map((n, i) => (
              <div key={i} className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                      {n.tag}
                    </span>
                    <h4 className="text-xs font-bold text-white">{n.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{n.desc}</p>
                </div>
                <span className="text-[10px] font-mono text-slate-500 shrink-0">{n.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Digital Student QR ID Card */}
        <div className="glass-panel rounded-2xl p-4 flex flex-col justify-center">
          <QRIDCard />
        </div>
      </div>
    </div>
  );
}
