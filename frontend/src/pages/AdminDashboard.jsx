// src/pages/AdminDashboard.jsx
// Campus Command Center — Admin Overview Dashboard

import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, GraduationCap, Award, DollarSign, MessageSquare, ShieldCheck, Activity, TrendingUp, AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 lg:p-8 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-semibold mb-2">
            ADMINISTRATION PLATFORM
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-heading">
            Campus Command Center
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Real-time telemetry on academic health, financial collections, attendance, and campus operations.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 font-bold flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" /> All Systems Nominal
          </span>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "TOTAL STUDENTS", val: "15,240", icon: Users, color: "text-indigo-400" },
          { label: "FACULTY MEMBERS", val: "480", icon: GraduationCap, color: "text-sky-400" },
          { label: "ATTENDANCE AVG", val: "91%", icon: Award, color: "text-emerald-400" },
          { label: "FEE COLLECTION", val: "71%", icon: DollarSign, color: "text-amber-400" },
          { label: "AVERAGE GPA", val: "8.42", icon: TrendingUp, color: "text-indigo-300" },
          { label: "COMPLAINTS OPEN", val: "14", icon: MessageSquare, color: "text-rose-400" },
        ].map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="glass-panel rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">{m.label}</span>
              <div className="text-2xl font-extrabold text-white font-heading mt-2">{m.val}</div>
              <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono">
                <Icon className={`w-3.5 h-3.5 ${m.color}`} />
                <span className="text-slate-400">Live</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Campus Health Overview Visualizations */}
      <div className="glass-panel rounded-2xl p-6">
        <h3 className="text-base font-bold text-white font-heading mb-4">
          Campus Operational Health Overview
        </h3>

        <div className="space-y-4">
          {/* Academic Health */}
          <div>
            <div className="flex justify-between text-xs font-bold font-mono mb-1.5">
              <span className="text-slate-200">Academic Health (Pass Rate & Mid-Term Performance)</span>
              <span className="text-indigo-400">82%</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 rounded-full" style={{ width: "82%" }} />
            </div>
          </div>

          {/* Financial Health */}
          <div>
            <div className="flex justify-between text-xs font-bold font-mono mb-1.5">
              <span className="text-slate-200">Financial Health (Fee Realization & Dues Cleared)</span>
              <span className="text-amber-400">71%</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full" style={{ width: "71%" }} />
            </div>
          </div>

          {/* Overall Attendance */}
          <div>
            <div className="flex justify-between text-xs font-bold font-mono mb-1.5">
              <span className="text-slate-200">Overall Campus Attendance (30-Day Average)</span>
              <span className="text-emerald-400">91%</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-sky-400 rounded-full" style={{ width: "91%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Real-time System Telemetry & Audit Log Snapshot */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Audit Log & Security Telemetry
          </h3>
          <button onClick={() => navigate("/audit-logs")} className="text-xs text-indigo-400 font-mono hover:underline">
            Full Audit Logs →
          </button>
        </div>

        <div className="space-y-2 font-mono text-xs text-slate-300">
          {[
            { time: "15:20:10", action: "ATTENDANCE_SYNC", details: "Automated QR Turnstile batch #904 processed (1,240 records).", status: "SUCCESS" },
            { time: "15:14:02", action: "FEE_GATEWAY", details: "Payment receipt #TXN-9843 verified for ₹15,000.", status: "SUCCESS" },
            { time: "14:50:33", action: "RBAC_CHECK", details: "User #COS-8942 updated student profile preferences.", status: "SUCCESS" },
          ].map((log, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-slate-500">{log.time}</span>
                <span className="text-[10px] font-bold text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                  {log.action}
                </span>
                <span className="text-xs text-slate-200">{log.details}</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
