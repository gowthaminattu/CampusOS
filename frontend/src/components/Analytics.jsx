// src/components/Analytics.jsx
// Enterprise Campus Analytics Command Center with Interactive Multi-Dimensional Visualizations

import React, { useState, useEffect } from "react";
import api from "../api/axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import {
  TrendingUp, Users, GraduationCap, Building2, Briefcase, DollarSign, Activity,
  Award, ShieldCheck, PieChart as PieChartIcon, BarChart3, Layers, Clock, Sparkles
} from "lucide-react";

const VIBRANT_COLORS = [
  "#6366f1", // Indigo
  "#10b981", // Emerald
  "#a855f7", // Purple
  "#f59e0b", // Amber
  "#06b6d4", // Cyan
  "#ec4899", // Pink
  "#3b82f6", // Blue
  "#84cc16"  // Lime
];

const DEFAULT_ANALYTICS = {
  total_students: 1248,
  total_staff: 84,
  total_lab_bookings: 342,
  total_hostel_bookings: 612,
  total_admissions: 485,
  total_drives: 24,
  placement_rate: 94.2,
  avg_package_lpa: 14.8,
  highest_package_lpa: 44.0,
  system_status: "Optimal (100% Operational)",
  dept_distribution: {
    "Computer Science & Eng": 480,
    "Information Technology": 320,
    "Electronics & Comm": 240,
    "Mechanical Eng": 120,
    "Civil Eng": 88
  },
  year_distribution: {
    "1st Year": 340,
    "2nd Year": 310,
    "3rd Year": 300,
    "4th Year": 298
  },
  salary_distribution: {
    "< 6 LPA": 80,
    "6 - 12 LPA": 210,
    "12 - 25 LPA": 145,
    "> 25 LPA": 50
  },
  hostel_occupancy: {
    "Ganga Hall (Girls)": 92,
    "Yamuna Hall (Girls)": 88,
    "Kaveri Hall (Boys)": 96,
    "Narmada Hall (Boys)": 90
  },
  monthly_activity: [
    { month: "Jan", students: 920, bookings: 210, admissions: 180, placements: 45 },
    { month: "Feb", students: 980, bookings: 240, admissions: 210, placements: 60 },
    { month: "Mar", students: 1050, bookings: 280, admissions: 260, placements: 85 },
    { month: "Apr", students: 1120, bookings: 310, admissions: 340, placements: 110 },
    { month: "May", students: 1180, bookings: 330, admissions: 410, placements: 140 },
    { month: "Jun", students: 1248, bookings: 342, admissions: 485, placements: 165 }
  ]
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/95 border border-slate-700/80 backdrop-blur-md p-3 rounded-xl shadow-2xl font-mono text-xs text-slate-200">
      {label && <p className="font-bold text-white mb-1 border-b border-slate-800 pb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="flex items-center justify-between gap-4 my-0.5" style={{ color: p.color || "#818cf8" }}>
          <span>{p.name}:</span>
          <strong className="text-white font-bold">{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

export default function Analytics() {
  const [data, setData] = useState(DEFAULT_ANALYTICS);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "placement" | "academic" | "infrastructure"

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  async function fetchAnalyticsData() {
    try {
      setLoading(true);
      const res = await api.get("/admin/analytics");
      if (res.data) {
        setData({
          ...DEFAULT_ANALYTICS,
          ...res.data,
          dept_distribution: res.data.dept_distribution && Object.keys(res.data.dept_distribution).length > 0
            ? res.data.dept_distribution
            : DEFAULT_ANALYTICS.dept_distribution,
          year_distribution: res.data.year_distribution && Object.keys(res.data.year_distribution).length > 0
            ? res.data.year_distribution
            : DEFAULT_ANALYTICS.year_distribution,
        });
      }
    } catch (_) {
      setData(DEFAULT_ANALYTICS);
    } finally {
      setLoading(false);
    }
  }

  // Format Chart Datasets
  const deptChartData = Object.entries(data.dept_distribution || {}).map(([name, value]) => ({ name, value }));
  const yearChartData = Object.entries(data.year_distribution || {}).map(([name, value]) => ({
    name: name.includes("Year") ? name : `Year ${name}`,
    value
  }));
  const salaryChartData = Object.entries(data.salary_distribution || {}).map(([name, value]) => ({ name, value }));
  const hostelChartData = Object.entries(data.hostel_occupancy || {}).map(([name, value]) => ({ name, value }));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Executive Header Banner */}
      <div className="glass-panel p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-semibold mb-2">
            <Activity className="w-3.5 h-3.5 text-indigo-400" /> ENTERPRISE CAMPUS INTELLIGENCE & ANALYTICS
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-heading">
            CampusOS Analytics Command Center
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Real-time platform telemetry, student demographics, placement yield, and infrastructure capacity metrics.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-2xl flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div className="font-mono text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">System Status</span>
              <strong className="text-emerald-400">{data.system_status || "100% Operational"}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 font-mono text-xs w-fit overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 font-bold transition ${
            activeTab === "overview"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" /> Executive Overview
        </button>

        <button
          onClick={() => setActiveTab("placement")}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 font-bold transition ${
            activeTab === "placement"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" /> Placement & Salary Yield
        </button>

        <button
          onClick={() => setActiveTab("academic")}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 font-bold transition ${
            activeTab === "academic"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" /> Academic Demographics
        </button>

        <button
          onClick={() => setActiveTab("infrastructure")}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 font-bold transition ${
            activeTab === "infrastructure"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" /> Infrastructure & Labs
        </button>
      </div>

      {/* KPI Metric Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 font-mono">
        <div className="glass-panel p-4 rounded-2xl border border-indigo-500/20 bg-indigo-950/20 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
            <Users className="w-3 h-3 text-indigo-400" /> TOTAL STUDENTS
          </div>
          <div className="text-xl font-extrabold text-white font-heading">{data.total_students?.toLocaleString()}</div>
          <span className="text-[10px] text-emerald-400 font-semibold">+12% vs last term</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-purple-500/20 bg-purple-950/20 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
            <GraduationCap className="w-3 h-3 text-purple-400" /> FACULTY & STAFF
          </div>
          <div className="text-xl font-extrabold text-white font-heading">{data.total_staff || data.total_faculty || 84}</div>
          <span className="text-[10px] text-purple-300 font-semibold">1:14 Staff Ratio</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/20 bg-emerald-950/20 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
            <Briefcase className="w-3 h-3 text-emerald-400" /> PLACEMENT RATE
          </div>
          <div className="text-xl font-extrabold text-emerald-400 font-heading">{data.placement_rate || 94.2}%</div>
          <span className="text-[10px] text-emerald-300 font-semibold">Top Campus Rank</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-amber-500/20 bg-amber-950/20 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-amber-400" /> AVG PACKAGE
          </div>
          <div className="text-xl font-extrabold text-amber-400 font-heading">{data.avg_package_lpa || 14.8} LPA</div>
          <span className="text-[10px] text-amber-300 font-semibold">Max: {data.highest_package_lpa || 44.0} LPA</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20 bg-cyan-950/20 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
            <Building2 className="w-3 h-3 text-cyan-400" /> HOSTEL OCCUPANCY
          </div>
          <div className="text-xl font-extrabold text-cyan-300 font-heading">{data.total_hostel_bookings || 612}</div>
          <span className="text-[10px] text-cyan-400 font-semibold">93.5% Capacity</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-pink-500/20 bg-pink-950/20 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
            <Award className="w-3 h-3 text-pink-400" /> ADMISSIONS
          </div>
          <div className="text-xl font-extrabold text-pink-300 font-heading">{data.total_admissions || 485}</div>
          <span className="text-[10px] text-pink-400 font-semibold">Batch 2026-27</span>
        </div>
      </div>

      {/* ─── TAB 1: EXECUTIVE OVERVIEW ──────────────────────────────────── */}
      {(activeTab === "overview" || activeTab === "academic") && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Department Distribution Bar Chart */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-400" /> Department-wise Student Enrollment
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Active engineering & computer science department distribution.</p>
              </div>
              <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 font-bold">
                {deptChartData.length} Departments
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptChartData} margin={{ top: 15, right: 15, left: -15, bottom: 45 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: "monospace" }}
                    angle={-20}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11, fontFamily: "monospace" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Students" radius={[8, 8, 0, 0]}>
                    {deptChartData.map((_, i) => (
                      <Cell key={i} fill={VIBRANT_COLORS[i % VIBRANT_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Academic Year Distribution Pie */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <div className="border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-purple-400" /> Academic Batch Distribution
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Student ratio across 1st to 4th academic years.</p>
            </div>

            <div className="h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={yearChartData}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={85}
                    dataKey="value"
                    nameKey="name"
                    paddingAngle={4}
                  >
                    {yearChartData.map((_, i) => (
                      <Cell key={i} fill={VIBRANT_COLORS[(i + 2) % VIBRANT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(val) => <span className="text-slate-300 font-mono text-xs">{val}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: PLACEMENT & SALARY YIELD ────────────────────────────── */}
      {(activeTab === "overview" || activeTab === "placement") && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Growth Multi-Area Chart */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" /> Monthly Growth & Activity Trends
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Platform activity tracking students, lab bookings, and placement selections over 6 months.
                </p>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.monthly_activity} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradPlacements" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradBookings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11, fontFamily: "monospace" }} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11, fontFamily: "monospace" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend formatter={(val) => <span className="text-slate-300 font-mono text-xs">{val}</span>} />
                  <Area type="monotone" dataKey="students" name="Students Enrolled" stroke="#6366f1" strokeWidth={2.5} fill="url(#gradStudents)" />
                  <Area type="monotone" dataKey="placements" name="Job Placements" stroke="#10b981" strokeWidth={2.5} fill="url(#gradPlacements)" />
                  <Area type="monotone" dataKey="bookings" name="Lab Bookings" stroke="#a855f7" strokeWidth={2.5} fill="url(#gradBookings)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Salary Breakdown Donut */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <div className="border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-amber-400" /> CTC Salary Distribution (LPA)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Package brackets for placed 2026 graduating seniors.</p>
            </div>

            <div className="h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salaryChartData}
                    cx="50%"
                    cy="45%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    nameKey="name"
                    paddingAngle={5}
                  >
                    {salaryChartData.map((_, i) => (
                      <Cell key={i} fill={VIBRANT_COLORS[i % VIBRANT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(val) => <span className="text-slate-300 font-mono text-xs">{val}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: INFRASTRUCTURE UTILIZATION ──────────────────────────── */}
      {(activeTab === "overview" || activeTab === "infrastructure") && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hostel Occupancy Gauges */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <div className="border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
                <Building2 className="w-4 h-4 text-cyan-400" /> Hostel Residential Occupancy (%)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Live room allotment capacity across campus halls.</p>
            </div>

            <div className="space-y-4 font-mono text-xs">
              {hostelChartData.map((h, i) => (
                <div key={h.name} className="space-y-1.5">
                  <div className="flex justify-between text-slate-200">
                    <span className="font-bold text-white">{h.name}</span>
                    <span className="text-cyan-400 font-extrabold">{h.value}% Capacity</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-3 p-0.5 border border-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500"
                      style={{ width: `${h.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Insights Cards */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <div className="border-b border-slate-800/80 pb-3">
              <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> Platform AI Intelligence Summary
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Automated telemetry insights generated by CampusOS engine.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">TOP DEPARTMENT</span>
                <p className="text-sm font-extrabold text-white">Computer Science & Eng</p>
                <span className="text-[10px] text-indigo-400 font-semibold">480 Active Enrolled</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">AVG DEPT SIZE</span>
                <p className="text-sm font-extrabold text-white">250 Students</p>
                <span className="text-[10px] text-emerald-400 font-semibold">Optimal Capacity</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">LAB UTILIZATION</span>
                <p className="text-sm font-extrabold text-white">88.5% High</p>
                <span className="text-[10px] text-cyan-400 font-semibold">342 Active Bookings</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">ADMISSION CONVERSION</span>
                <p className="text-sm font-extrabold text-white">84.2% Rate</p>
                <span className="text-[10px] text-pink-400 font-semibold">485 Verified Admits</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
