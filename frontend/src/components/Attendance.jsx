// src/components/Attendance.jsx
// Modern Attendance Management Dashboard with Academic Health Ring

import React, { useState } from "react";
import AcademicHealthRing from "./common/AcademicHealthRing";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { CheckCircle2, AlertTriangle, Calendar, TrendingUp, Filter } from "lucide-react";

const ATTENDANCE_DATA = [
  { id: 1, subject: "Data Structures & Algorithms", code: "CS301", attended: 36, total: 39, percentage: 92, status: "Good" },
  { id: 2, subject: "Database Management Systems", code: "CS302", attended: 35, total: 40, percentage: 88, status: "Good" },
  { id: 3, subject: "Digital Electronics & Architecture", code: "CS303", attended: 29, total: 38, percentage: 76, status: "Warning" },
  { id: 4, subject: "Operating Systems & Kernel Dev", code: "CS304", attended: 34, total: 37, percentage: 91, status: "Good" },
  { id: 5, subject: "Full Stack Web Development", code: "CS305", attended: 33, total: 35, percentage: 94, status: "Good" },
];

const TREND_DATA = [
  { day: "Aug 01", percentage: 80 },
  { day: "Aug 05", percentage: 82 },
  { day: "Aug 10", percentage: 78 },
  { day: "Aug 15", percentage: 84 },
  { day: "Aug 20", percentage: 85 },
  { day: "Aug 24", percentage: 86 },
];

export default function Attendance() {
  const [filter, setFilter] = useState("ALL");

  const filteredSubjects = ATTENDANCE_DATA.filter((s) => {
    if (filter === "WARNING") return s.percentage < 80;
    if (filter === "GOOD") return s.percentage >= 80;
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-heading">
            Academic & Attendance Health
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time track of lecture attendance, minimum requirements, and monthly trends.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              filter === "ALL"
                ? "bg-indigo-600 border-indigo-500 text-white"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            All Courses ({ATTENDANCE_DATA.length})
          </button>
          <button
            onClick={() => setFilter("WARNING")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              filter === "WARNING"
                ? "bg-rose-600/20 border-rose-500 text-rose-300"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            At Risk (&lt;80%)
          </button>
        </div>
      </div>

      {/* Top Banner: Ring + Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Academic Health Ring Card */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
            OVERALL ATTENDANCE HEALTH
          </h3>
          <AcademicHealthRing percentage={86} size={170} strokeWidth={14} />
          <p className="text-xs text-slate-400 mt-3">
            You need to attend <strong className="text-emerald-400">4 more lectures</strong> in Digital Electronics to reach 80%.
          </p>
        </div>

        {/* 30-Day Attendance Trend Chart */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" /> Attendance Trend — Last 30 Days
              </h3>
              <p className="text-xs text-slate-400">Consolidated progress curve across all registered modules.</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              +4% Improvement
            </span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} domain={[60, 100]} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "10px", color: "#FFF" }}
                />
                <Area type="monotone" dataKey="percentage" stroke="#818CF8" strokeWidth={3} fillOpacity={1} fill="url(#trendGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Subject Wise Attendance List */}
      <div className="glass-panel rounded-2xl p-6">
        <h3 className="text-base font-bold text-white font-heading mb-4">
          Subject Attendance Breakdown
        </h3>
        <div className="space-y-4">
          {filteredSubjects.map((subj) => {
            const isWarning = subj.percentage < 80;
            return (
              <div
                key={subj.id}
                className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 p-4 rounded-xl transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-bold text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                      {subj.code}
                    </span>
                    <h4 className="text-sm font-bold text-white">{subj.subject}</h4>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Attended {subj.attended} of {subj.total} conducted sessions
                  </div>
                </div>

                <div className="flex items-center gap-4 min-w-[240px]">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-300">{subj.percentage}%</span>
                      {isWarning ? (
                        <span className="text-rose-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Below Threshold</span>
                      ) : (
                        <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Good</span>
                      )}
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isWarning ? "bg-rose-500" : "bg-gradient-to-r from-indigo-500 to-emerald-400"
                        }`}
                        style={{ width: `${subj.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
