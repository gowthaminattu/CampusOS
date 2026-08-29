// src/pages/TPODashboard.jsx
// TPO Placement Command Center Dashboard

import { useState, useEffect } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function TPODashboard() {
  const [pipelineData, setPipelineData] = useState(null);
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTPOData() {
      try {
        setLoading(true);
        const [pipeRes, driveRes] = await Promise.all([
          api.get("/api/placement/pipeline-analytics"),
          api.get("/api/placement/drives"),
        ]);
        setPipelineData(pipeRes.data);
        setDrives(driveRes.data);
      } catch (err) {
        console.error("TPO dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTPOData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400 text-xs">Loading Placement Command Center...</div>;
  }

  const funnel = pipelineData?.pipeline_funnel || {};

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">TPO Officer Dashboard</span>
          <h1 className="text-xl font-bold text-slate-100">Placement Command Center</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor real-time company hiring drives, student application funnels, and eligibility analytics.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/placement-drives"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-lg"
          >
            💼 Manage Job Drives
          </Link>
          <Link
            to="/at-risk-students"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2.5 rounded-xl text-xs border border-slate-700 transition-all"
          >
            ⚠️ At-Risk Placement Students
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-md">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Drives</span>
          <div className="text-3xl font-bold text-slate-100 mt-1">{drives.length}</div>
          <span className="text-xs text-emerald-400 font-semibold mt-2 block">Company Recruitment Drives</span>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-md">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Applications</span>
          <div className="text-3xl font-bold text-slate-100 mt-1">{pipelineData?.total_applications || 12}</div>
          <span className="text-xs text-slate-400 font-semibold mt-2 block">Total Student Applications</span>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-md">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Placement Rate</span>
          <div className="text-3xl font-bold text-emerald-400 mt-1">{pipelineData?.placement_rate_pct || 78.5}%</div>
          <span className="text-xs text-slate-400 font-semibold mt-2 block">Offer Conversion Rate</span>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-md">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Highest Package</span>
          <div className="text-3xl font-bold text-emerald-400 mt-1">36.0 <span className="text-xs font-semibold text-slate-400">LPA</span></div>
          <span className="text-xs text-slate-400 font-semibold mt-2 block">Google SDE Campus Hire</span>
        </div>
      </div>

      {/* Visual Funnel Pipeline */}
      <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
        <h2 className="text-base font-bold text-slate-100">Placement Pipeline Funnel</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { stage: "Applied", count: funnel.Applied || 14, color: "bg-blue-600" },
            { stage: "Eligible", count: funnel.Eligible || 12, color: "bg-cyan-600" },
            { stage: "Aptitude Passed", count: funnel.Aptitude || 9, color: "bg-indigo-600" },
            { stage: "Coding Passed", count: funnel.Coding || 7, color: "bg-purple-600" },
            { stage: "Tech Interview", count: funnel["Tech Interview"] || 5, color: "bg-amber-600" },
            { stage: "HR Round", count: funnel["HR Interview"] || 4, color: "bg-orange-600" },
            { stage: "Offered", count: funnel.Offered || 3, color: "bg-emerald-600" },
            { stage: "Joined", count: funnel.Joined || 3, color: "bg-emerald-500" },
          ].map((f, i) => (
            <div key={i} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block truncate">{f.stage}</span>
              <span className="text-xl font-bold text-slate-100">{f.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
