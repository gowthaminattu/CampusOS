// src/components/Settings.jsx
// Profile settings page — account info, password change, preferences.

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Settings() {
  const { user, isStaff } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const handlePwChange = (e) => {
    setPwForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setPwError("");
  };

  const handlePwSubmit = async (e) => {
    e.preventDefault();
    if (pwForm.newPw !== pwForm.confirm) {
      setPwError("New passwords don't match.");
      return;
    }
    if (pwForm.newPw.length < 6) {
      setPwError("Password must be at least 6 characters.");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    setPwSuccess(true);
    setPwForm({ current: "", newPw: "", confirm: "" });
    setTimeout(() => setPwSuccess(false), 3000);
  };

  const settingsTabs = [
    { id: "profile", label: "👤 Profile", icon: "👤" },
    { id: "security", label: "🔒 Security", icon: "🔒" },
    { id: "notifications", label: "🔔 Notifications", icon: "🔔" },
    { id: "appearance", label: "🎨 Appearance", icon: "🎨" },
  ];

  const initials = user?.name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "U";

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1 className="page-h1">Settings</h1>
        <p className="page-sub">Manage your account preferences and security</p>
      </div>

      <div className="settings-layout">
        {/* Sidebar tabs */}
        <div className="settings-sidebar">
          {settingsTabs.map((t) => (
            <button
              key={t.id}
              className={`settings-tab ${activeTab === t.id ? "settings-tab-active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span>{t.icon}</span>
              {t.label.split(" ")[1]}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="settings-content">
          {/* Profile tab */}
          {activeTab === "profile" && (
            <div className="settings-card">
              <h2 className="settings-card-title">Profile Information</h2>
              <div className="profile-avatar-section">
                <div className="settings-avatar">{initials}</div>
                <div>
                  <h3 className="settings-user-name">{user?.name}</h3>
                  <p className="settings-user-role">
                    {isStaff ? "👨‍🏫 Faculty / Staff" : "🎒 Student"}
                  </p>
                  <button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }}>
                    Change Avatar
                  </button>
                </div>
              </div>

              <div className="settings-info-grid">
                {[
                  { label: "Full Name", value: user?.name },
                  { label: "Email Address", value: user?.email },
                  { label: "Roll Number / ID", value: user?.roll_number || "—" },
                  { label: "Department", value: user?.department || "—" },
                  { label: "Year", value: user?.year ? `Year ${user.year}` : "—" },
                  { label: "Role", value: user?.role || "student" },
                  { label: "GPA", value: user?.gpa?.toFixed(2) || "—" },
                  { label: "Attendance", value: user?.attendance ? `${user.attendance}%` : "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="settings-info-item">
                    <span className="settings-info-label">{label}</span>
                    <span className="settings-info-val">{value}</span>
                  </div>
                ))}
              </div>

              <div className="settings-note">
                <span>ℹ</span>
                Contact your administrator to update personal information.
              </div>
            </div>
          )}

          {/* Security tab */}
          {activeTab === "security" && (
            <div className="settings-card">
              <h2 className="settings-card-title">Security Settings</h2>
              {pwSuccess && (
                <div className="login-error" style={{ background: "rgba(16,185,129,0.1)", borderColor: "rgba(16,185,129,0.3)", color: "#6ee7b7", marginBottom: 20 }}>
                  ✓ Password changed successfully!
                </div>
              )}
              <form onSubmit={handlePwSubmit} className="settings-pw-form">
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    name="current"
                    className="form-input"
                    value={pwForm.current}
                    onChange={handlePwChange}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    name="newPw"
                    className="form-input"
                    value={pwForm.newPw}
                    onChange={handlePwChange}
                    placeholder="Minimum 6 characters"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirm"
                    className="form-input"
                    value={pwForm.confirm}
                    onChange={handlePwChange}
                    placeholder="Repeat new password"
                    required
                  />
                </div>
                {pwError && <div className="login-error">⚠ {pwError}</div>}
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <><span className="spinner" /> Saving…</> : "🔒 Change Password"}
                </button>
              </form>

              <div className="settings-security-info">
                <h3 className="settings-card-title" style={{ fontSize: 16, marginTop: 32 }}>Session Info</h3>
                <div className="settings-session">
                  <span>🖥 Current session</span>
                  <span className="session-active">● Active now</span>
                </div>
              </div>
            </div>
          )}

          {/* Notifications tab */}
          {activeTab === "notifications" && (
            <div className="settings-card">
              <h2 className="settings-card-title">Notification Preferences</h2>
              {[
                { label: "Exam Reminders", desc: "Get notified 3 days before exams", def: true },
                { label: "Lab Booking Confirmations", desc: "Email & in-app confirmation", def: true },
                { label: "Hostel Announcements", desc: "News from hostel administration", def: false },
                { label: "Placement Updates", desc: "New job openings and campus drives", def: true },
                { label: "Event Notifications", desc: "Upcoming college events and fests", def: true },
                { label: "Fee Reminders", desc: "Due date alerts for fee payment", def: true },
              ].map(({ label, desc, def }) => (
                <div key={label} className="settings-toggle-row">
                  <div>
                    <p className="settings-toggle-label">{label}</p>
                    <p className="settings-toggle-desc">{desc}</p>
                  </div>
                  <label className="settings-toggle">
                    <input type="checkbox" defaultChecked={def} />
                    <span className="settings-toggle-track" />
                  </label>
                </div>
              ))}
            </div>
          )}

          {/* Appearance tab */}
          {activeTab === "appearance" && (
            <div className="settings-card">
              <h2 className="settings-card-title">Appearance</h2>
              <div className="settings-theme-grid">
                {[
                  { id: "dark", label: "Dark Mode", icon: "🌙", active: true },
                  { id: "darker", label: "Deep Dark", icon: "✨", active: false },
                  { id: "midnight", label: "Midnight Blue", icon: "🌊", active: false },
                ].map((t) => (
                  <button
                    key={t.id}
                    className={`settings-theme-card ${t.active ? "settings-theme-active" : ""}`}
                  >
                    <span className="settings-theme-icon">{t.icon}</span>
                    <span>{t.label}</span>
                    {t.active && <span className="settings-theme-check">✓</span>}
                  </button>
                ))}
              </div>
              <div className="settings-note" style={{ marginTop: 16 }}>
                <span>ℹ</span>
                More themes coming soon!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
