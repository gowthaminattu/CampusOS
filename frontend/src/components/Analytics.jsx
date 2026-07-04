// src/components/Analytics.jsx
// Staff-only: analytics dashboard with Recharts charts.

import { useState, useEffect } from "react";
import api from "../api/axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area,
} from "recharts";

const COLORS = ["#6366f1", "#a855f7", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#f97316", "#84cc16"];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      {label && <p className="chart-tooltip-label">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/admin/analytics");
        setAnalytics(res.data);
      } catch (_) {}
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="analytics-loading">
          <span className="spinner" style={{ width: 32, height: 32, borderWidth: 4 }} />
          <p>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  const deptData = analytics?.dept_distribution
    ? Object.entries(analytics.dept_distribution).map(([name, value]) => ({ name, value }))
    : [];

  const yearData = analytics?.year_distribution
    ? Object.entries(analytics.year_distribution).map(([name, value]) => ({ name: `Year ${name}`, value }))
    : [];

  // Simulated monthly data for area chart
  const monthlyData = [
    { month: "Jan", students: 45, bookings: 12, admissions: 8 },
    { month: "Feb", students: 52, bookings: 18, admissions: 14 },
    { month: "Mar", students: 61, bookings: 25, admissions: 19 },
    { month: "Apr", students: 67, bookings: 30, admissions: 23 },
    { month: "May", students: 74, bookings: 38, admissions: 28 },
    { month: "Jun", students: analytics?.total_students || 80, bookings: analytics?.total_lab_bookings || 42, admissions: analytics?.total_admissions || 35 },
  ];

  const statCards = [
    { id: "an-students", label: "Total Students", value: analytics?.total_students ?? 0, icon: "👥", color: "#6366f1", bg: "rgba(99,102,241,0.12)", trend: "+12% this month" },
    { id: "an-staff", label: "Total Staff", value: analytics?.total_staff ?? 0, icon: "👨‍🏫", color: "#a855f7", bg: "rgba(168,85,247,0.12)", trend: "Active faculty" },
    { id: "an-labs", label: "Lab Bookings", value: analytics?.total_lab_bookings ?? 0, icon: "🔬", color: "#10b981", bg: "rgba(16,185,129,0.12)", trend: "+5% this week" },
    { id: "an-hostel", label: "Hostel Bookings", value: analytics?.total_hostel_bookings ?? 0, icon: "🏨", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", trend: "Currently active" },
    { id: "an-admissions", label: "Total Admissions", value: analytics?.total_admissions ?? 0, icon: "📋", color: "#ef4444", bg: "rgba(239,68,68,0.12)", trend: "Applications received" },
  ];

  return (
    <div className="analytics-page">
      {/* Header */}
      <div className="analytics-header">
        <div>
          <h1 className="page-h1">Analytics Dashboard</h1>
          <p className="page-sub">Platform-wide insights and statistics for CampusOS AI</p>
        </div>
        <div className="analytics-date">
          <span className="analytics-date-label">Last updated</span>
          <span className="analytics-date-val">{new Date().toLocaleString("en-IN")}</span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="analytics-stats-grid">
        {statCards.map((c) => (
          <div key={c.id} id={c.id} className="analytics-stat-card">
            <div className="analytics-stat-left">
              <div className="analytics-stat-icon" style={{ background: c.bg, color: c.color }}>
                {c.icon}
              </div>
              <div>
                <p className="analytics-stat-val" style={{ color: c.color }}>{c.value.toLocaleString()}</p>
                <p className="analytics-stat-label">{c.label}</p>
              </div>
            </div>
            <div className="analytics-stat-trend">{c.trend}</div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="analytics-charts-row">
        {/* Department distribution bar chart */}
        <div className="analytics-chart-card analytics-chart-wide">
          <h3 className="chart-card-title">📊 Department-wise Student Distribution</h3>
          {deptData.length === 0 ? (
            <div className="chart-empty">No department data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={deptData} margin={{ top: 10, right: 10, left: -10, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#8892b0", fontSize: 11 }}
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fill: "#8892b0", fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Students" radius={[6, 6, 0, 0]}>
                  {deptData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Year distribution pie chart */}
        <div className="analytics-chart-card">
          <h3 className="chart-card-title">🎓 Year-wise Distribution</h3>
          {yearData.length === 0 ? (
            <div className="chart-empty">No year data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={yearData}
                  cx="50%"
                  cy="45%"
                  outerRadius={90}
                  innerRadius={50}
                  dataKey="value"
                  nameKey="name"
                  paddingAngle={4}
                >
                  {yearData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={10}
                  formatter={(val) => <span style={{ color: "#8892b0", fontSize: 12 }}>{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Charts row 2 — Monthly Trends */}
      <div className="analytics-chart-card analytics-chart-full">
        <h3 className="chart-card-title">📈 Monthly Platform Activity</h3>
        <p className="chart-card-sub">Students enrolled, lab bookings, and admission applications over time</p>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={monthlyData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="gradStudents" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradBookings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradAdmissions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="month" tick={{ fill: "#8892b0", fontSize: 12 }} />
            <YAxis tick={{ fill: "#8892b0", fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(val) => <span style={{ color: "#8892b0", fontSize: 12, textTransform: "capitalize" }}>{val}</span>}
            />
            <Area type="monotone" dataKey="students" name="Students" stroke="#6366f1" strokeWidth={2} fill="url(#gradStudents)" />
            <Area type="monotone" dataKey="bookings" name="Bookings" stroke="#10b981" strokeWidth={2} fill="url(#gradBookings)" />
            <Area type="monotone" dataKey="admissions" name="Admissions" stroke="#a855f7" strokeWidth={2} fill="url(#gradAdmissions)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Insights */}
      <div className="analytics-insights-grid">
        <div className="insight-card">
          <div className="insight-icon">🏆</div>
          <div className="insight-body">
            <p className="insight-label">Top Department</p>
            <p className="insight-val">
              {deptData.length > 0
                ? deptData.reduce((max, d) => d.value > max.value ? d : max).name
                : "N/A"}
            </p>
          </div>
        </div>
        <div className="insight-card">
          <div className="insight-icon">📊</div>
          <div className="insight-body">
            <p className="insight-label">Avg Students / Dept</p>
            <p className="insight-val">
              {deptData.length > 0
                ? Math.round(deptData.reduce((s, d) => s + d.value, 0) / deptData.length)
                : "N/A"}
            </p>
          </div>
        </div>
        <div className="insight-card">
          <div className="insight-icon">📅</div>
          <div className="insight-body">
            <p className="insight-label">Lab Utilization</p>
            <p className="insight-val">
              {analytics?.total_lab_bookings > 0 ? "Active" : "Low"}
            </p>
          </div>
        </div>
        <div className="insight-card">
          <div className="insight-icon">🎯</div>
          <div className="insight-body">
            <p className="insight-label">Admission Rate</p>
            <p className="insight-val">
              {analytics?.total_students && analytics?.total_admissions
                ? `${Math.round((analytics.total_admissions / (analytics.total_students + 1)) * 100)}%`
                : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
