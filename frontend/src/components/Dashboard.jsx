// src/components/Dashboard.jsx
// Role-based dashboard — Student sees profile + quick stats; Staff sees analytics overview.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

// ─── Student Dashboard ──────────────────────────────────────────────────────
function StudentDashboard({ user }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ labBookings: 0, hostelBooking: null, admissions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [labRes, admRes] = await Promise.all([
          api.get("/lab/bookings"),
          api.get("/admission/my"),
        ]);
        setStats({
          labBookings: labRes.data.filter((b) => b.status === "confirmed").length,
          admissions: admRes.data.length,
        });
      } catch (_) {}
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const quickActions = [
    { id: "qa-chat", icon: "✦", label: "AI Assistant", desc: "Ask any college question instantly", path: "/chat", color: "var(--accent-blue)", glow: "rgba(99,102,241,0.3)" },
    { id: "qa-admission", icon: "📋", label: "Apply for Admission", desc: "Submit your admission application", path: "/admission", color: "var(--accent-purple)", glow: "rgba(168,85,247,0.3)" },
    { id: "qa-hostel", icon: "🏨", label: "Hostel Booking", desc: "Browse and book hostel rooms", path: "/hostel", color: "var(--accent-green)", glow: "rgba(16,185,129,0.3)" },
  ];

  const suggestions = [
    "When are semester exams?",
    "Hostel fees details",
    "Placement statistics",
    "Available courses this semester",
    "Timetable for CSE 3rd year",
    "Scholarship information",
  ];

  return (
    <div className="dash-page">
      {/* Hero */}
      <div className="student-hero">
        <div className="student-hero-bg" />
        <div className="student-hero-content">
          <div className="student-hero-text">
            <p className="hero-greeting-line">{greeting}, 👋</p>
            <h1 className="hero-name">{user?.name || "Student"}</h1>
            <p className="hero-meta">
              {user?.department && <span className="hero-meta-chip">{user.department}</span>}
              {user?.year && <span className="hero-meta-chip">Year {user.year}</span>}
              {user?.roll_number && <span className="hero-meta-chip">#{user.roll_number}</span>}
            </p>
          </div>
          {/* ID card */}
          <div className="student-id-card">
            <div className="id-card-shine" />
            <div className="id-card-top">
              <span className="id-card-logo">🎓</span>
              <span className="id-card-institute">CampusOS University</span>
            </div>
            <div className="id-card-avatar">{user?.name?.[0] || "S"}</div>
            <div className="id-card-name">{user?.name}</div>
            <div className="id-card-roll">{user?.roll_number || "N/A"}</div>
            <div className="id-card-dept">{user?.department || "—"}</div>
            <div className="id-card-footer">
              <div className="id-card-stat">
                <span className="id-stat-label">GPA</span>
                <span className="id-stat-val">{user?.gpa?.toFixed(1) || "—"}</span>
              </div>
              <div className="id-card-divider" />
              <div className="id-card-stat">
                <span className="id-stat-label">Attendance</span>
                <span className="id-stat-val">{user?.attendance ? `${user.attendance}%` : "—"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="student-stats-row">
        <div className="student-stat-card">
          <div className="student-stat-icon" style={{ background: "rgba(99,102,241,0.15)", color: "var(--accent-blue-light)" }}>🔬</div>
          <div>
            <p className="student-stat-val">{loading ? "—" : stats.labBookings}</p>
            <p className="student-stat-label">Lab Bookings</p>
          </div>
        </div>
        <div className="student-stat-card">
          <div className="student-stat-icon" style={{ background: "rgba(168,85,247,0.15)", color: "var(--accent-purple)" }}>📋</div>
          <div>
            <p className="student-stat-val">{loading ? "—" : stats.admissions}</p>
            <p className="student-stat-label">Applications</p>
          </div>
        </div>
        <div className="student-stat-card">
          <div className="student-stat-icon" style={{ background: "rgba(16,185,129,0.15)", color: "var(--accent-green)" }}>📈</div>
          <div>
            <p className="student-stat-val">{user?.gpa?.toFixed(2) || "—"}</p>
            <p className="student-stat-label">Current GPA</p>
          </div>
        </div>
        <div className="student-stat-card">
          <div className="student-stat-icon" style={{ background: "rgba(245,158,11,0.15)", color: "var(--accent-amber)" }}>📅</div>
          <div>
            <p className="student-stat-val">{user?.attendance ? `${user.attendance}%` : "—"}</p>
            <p className="student-stat-label">Attendance</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="dash-section-title">Quick Actions</h2>
      <div className="student-actions-grid">
        {quickActions.map((a) => (
          <button
            key={a.id}
            id={a.id}
            className="student-action-card"
            onClick={() => navigate(a.path)}
            style={{ "--card-glow": a.glow, "--card-color": a.color }}
          >
            <div className="action-card-icon">{a.icon}</div>
            <div className="action-card-body">
              <h3 className="action-card-title">{a.label}</h3>
              <p className="action-card-desc">{a.desc}</p>
            </div>
            <span className="action-card-arrow">→</span>
          </button>
        ))}
      </div>

      {/* AI Suggestions */}
      <div className="ai-suggestions-section">
        <div className="ai-suggestions-header">
          <div className="ai-suggestions-title-wrap">
            <span className="ai-suggestions-icon">✦</span>
            <h2 className="dash-section-title" style={{ margin: 0 }}>Ask the AI Assistant</h2>
          </div>
          <button className="btn-go-chat" onClick={() => navigate("/chat")}>
            Open Chat →
          </button>
        </div>
        <div className="ai-chips-grid">
          {suggestions.map((s, i) => (
            <button
              key={i}
              className="ai-chip"
              onClick={() => navigate("/chat", { state: { prefill: s } })}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Staff Dashboard ─────────────────────────────────────────────────────────
function StaffDashboard({ user }) {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentStudents, setRecentStudents] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [analyticsRes, studentsRes] = await Promise.all([
          api.get("/admin/analytics"),
          api.get("/admin/students"),
        ]);
        setAnalytics(analyticsRes.data);
        setRecentStudents(studentsRes.data.slice(0, 5));
      } catch (_) {}
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const statCards = [
    { id: "sc-students", icon: "👥", label: "Total Students", val: analytics?.total_students ?? "—", color: "#6366f1", bg: "rgba(99,102,241,0.12)" },
    { id: "sc-staff", icon: "👨‍🏫", label: "Total Staff", val: analytics?.total_staff ?? "—", color: "#a855f7", bg: "rgba(168,85,247,0.12)" },
    { id: "sc-labs", icon: "🔬", label: "Lab Bookings", val: analytics?.total_lab_bookings ?? "—", color: "#10b981", bg: "rgba(16,185,129,0.12)" },
    { id: "sc-admissions", icon: "📋", label: "Admissions", val: analytics?.total_admissions ?? "—", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  ];

  const quickLinks = [
    { id: "ql-students", icon: "👥", label: "Manage Students", path: "/students", color: "#6366f1" },
    { id: "ql-lab", icon: "🔬", label: "Lab Management", path: "/lab", color: "#10b981" },
    { id: "ql-analytics", icon: "📊", label: "View Analytics", path: "/analytics", color: "#a855f7" },
    { id: "ql-admissions", icon: "📋", label: "Admissions", path: "/admission-mgmt", color: "#f59e0b" },
  ];

  return (
    <div className="dash-page">
      {/* Staff Hero */}
      <div className="staff-hero">
        <div className="staff-hero-bg" />
        <div className="staff-hero-content">
          <div>
            <p className="hero-greeting-line">{greeting}, 👋</p>
            <h1 className="hero-name">{user?.name || "Faculty"}</h1>
            <p className="hero-meta">
              <span className="hero-meta-chip hero-chip-staff">Staff / Faculty</span>
              {user?.department && <span className="hero-meta-chip">{user.department}</span>}
            </p>
          </div>
          <div className="staff-hero-date">
            <span className="staff-date-day">{new Date().toLocaleDateString("en-IN", { weekday: "long" })}</span>
            <span className="staff-date-full">{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="staff-stats-grid">
        {statCards.map((c) => (
          <div key={c.id} id={c.id} className="staff-stat-card">
            <div className="staff-stat-icon-wrap" style={{ background: c.bg, color: c.color }}>
              {c.icon}
            </div>
            <div className="staff-stat-body">
              <p className="staff-stat-val" style={{ color: c.color }}>
                {loading ? <span className="stat-skeleton" /> : c.val}
              </p>
              <p className="staff-stat-label">{c.label}</p>
            </div>
            <div className="staff-stat-trend">↑ Active</div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <h2 className="dash-section-title">Management Console</h2>
      <div className="staff-quick-grid">
        {quickLinks.map((l) => (
          <button
            key={l.id}
            id={l.id}
            className="staff-quick-card"
            onClick={() => navigate(l.path)}
            style={{ "--link-color": l.color }}
          >
            <span className="staff-quick-icon">{l.icon}</span>
            <span className="staff-quick-label">{l.label}</span>
            <span className="staff-quick-arrow">→</span>
          </button>
        ))}
      </div>

      {/* Recent Students */}
      <div className="recent-students-section">
        <div className="recent-section-header">
          <h2 className="dash-section-title" style={{ margin: 0 }}>Recent Students</h2>
          <button className="btn-view-all" onClick={() => navigate("/students")}>
            View All →
          </button>
        </div>
        <div className="recent-table-wrap">
          <table className="recent-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Year</th>
                <th>Attendance</th>
                <th>GPA</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="table-loading">Loading…</td></tr>
              ) : recentStudents.length === 0 ? (
                <tr><td colSpan={5} className="table-empty">No students found</td></tr>
              ) : (
                recentStudents.map((s) => (
                  <tr key={s.id} className="recent-table-row">
                    <td>
                      <div className="table-student-name">
                        <div className="table-avatar">{s.name?.[0] || "?"}</div>
                        {s.name}
                      </div>
                    </td>
                    <td>{s.department || "—"}</td>
                    <td>{s.year ? `Year ${s.year}` : "—"}</td>
                    <td>
                      <div className="attendance-bar-wrap">
                        <div className="attendance-bar">
                          <div
                            className="attendance-fill"
                            style={{
                              width: `${s.attendance || 0}%`,
                              background: s.attendance >= 75 ? "var(--accent-green)" : "var(--accent-red)"
                            }}
                          />
                        </div>
                        <span>{s.attendance ?? 0}%</span>
                      </div>
                    </td>
                    <td>
                      <span className="gpa-badge">{s.gpa?.toFixed(1) || "—"}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dept Distribution */}
      {analytics?.dept_distribution && Object.keys(analytics.dept_distribution).length > 0 && (
        <div className="dept-dist-section">
          <h2 className="dash-section-title">Department Distribution</h2>
          <div className="dept-bars">
            {Object.entries(analytics.dept_distribution).map(([dept, count]) => {
              const total = analytics.total_students || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={dept} className="dept-bar-row">
                  <span className="dept-bar-label">{dept}</span>
                  <div className="dept-bar-track">
                    <div className="dept-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="dept-bar-count">{count} ({pct}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user, isStaff } = useAuth();
  return isStaff ? <StaffDashboard user={user} /> : <StudentDashboard user={user} />;
}
