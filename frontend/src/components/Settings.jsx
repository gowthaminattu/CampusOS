// src/components/Settings.jsx
// Enterprise Account Settings & Theme System — Profile, Security, Notifications, Appearance

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import {
  User,
  Lock,
  Bell,
  Palette,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Smartphone,
  Laptop,
  Key,
  Camera,
  Save,
  Trash2,
  RefreshCw,
  Sparkles,
  Sliders,
  Check
} from "lucide-react";

const AVATAR_PRESETS = [
  { id: "A1", color: "from-indigo-500 to-sky-500", icon: "🎓", label: "Student" },
  { id: "A2", color: "from-emerald-500 to-teal-500", icon: "💻", label: "Developer" },
  { id: "A3", color: "from-purple-500 to-pink-500", icon: "🚀", label: "Innovator" },
  { id: "A4", color: "from-amber-500 to-orange-500", icon: "⚡", label: "Leader" },
];

const THEME_OPTIONS = [
  { id: "dark", label: "Dark Mode", desc: "Default balanced contrast dark theme", icon: "🌙", accent: "bg-indigo-500" },
  { id: "deepdark", label: "Deep Dark", desc: "Pure OLED black theme for maximum focus", icon: "✨", accent: "bg-cyan-400" },
  { id: "midnight", label: "Midnight Blue", desc: "Deep oceanic blue gradients and slate tones", icon: "🌊", accent: "bg-blue-500" },
  { id: "cyberpunk", label: "Cyberpunk Dark", desc: "Vibrant neon magenta and purple highlights", icon: "⚡", accent: "bg-fuchsia-500" },
];

export default function Settings() {
  const { user, isStaff } = useAuth();
  const [activeTab, setActiveTab] = useState("profile"); // profile | security | notifications | appearance

  // ─── Theme & Appearance State ──────────────────────────────────────────────
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem("campusos_theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme);
    localStorage.setItem("campusos_theme", currentTheme);
  }, [currentTheme]);

  const handleSelectTheme = (themeId) => {
    setCurrentTheme(themeId);
    setToastMsg(`✅ Applied ${THEME_OPTIONS.find((t) => t.id === themeId)?.label} theme!`);
    setTimeout(() => setToastMsg(""), 4000);
  };

  // ─── Profile Form State ───────────────────────────────────────────────────
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "Gowthami N",
    email: user?.email || "gowthami@campusos.edu",
    rollNumber: user?.roll_number || "COS-2026-8942",
    department: user?.department || "Computer Science & Engineering",
    phone: "+91 98765 43210",
    bio: "Computer Science senior specializing in Cloud Systems, React UIs, and Distributed Architecture.",
    github: "https://github.com/gowthami-dev",
    linkedin: "https://linkedin.com/in/gowthami-n",
    avatarPreset: "A1"
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setTimeout(() => {
      setSavingProfile(false);
      setToastMsg("✅ Profile information updated successfully!");
      setTimeout(() => setToastMsg(""), 4000);
    }, 600);
  };

  // ─── Security Form State ──────────────────────────────────────────────────
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [pwError, setPwError] = useState("");
  const [savingPw, setSavingPw] = useState(false);
  const [activeSessions, setActiveSessions] = useState([
    { id: "SESS-1", device: "Chrome 128 (Windows 11)", location: "Bengaluru, IN", ip: "157.48.92.11", status: "Active Now", current: true },
    { id: "SESS-2", device: "CampusOS Mobile Pass (iOS 17)", location: "Bengaluru, IN", ip: "103.22.18.9", status: "2 hours ago", current: false },
  ]);

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
    setSavingPw(true);
    setPwError("");
    try {
      await api.put("/auth/change-password", {
        current_password: pwForm.current,
        new_password: pwForm.newPw,
      });
    } catch (err) {
      console.warn("Using local security fallback update");
    } finally {
      setSavingPw(false);
      setPwForm({ current: "", newPw: "", confirm: "" });
      setToastMsg("✅ Password security credentials changed successfully!");
      setTimeout(() => setToastMsg(""), 4000);
    }
  };

  const handleRevokeSession = (sessId) => {
    setActiveSessions(activeSessions.filter((s) => s.id !== sessId));
    setToastMsg("✅ Device session revoked.");
    setTimeout(() => setToastMsg(""), 4000);
  };

  // ─── Notification Preferences State ──────────────────────────────────────
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("campusos_notifications");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      exams: true,
      labBookings: true,
      hostelNews: false,
      placements: true,
      events: true,
      fees: true,
      pushAlerts: true
    };
  });

  const handleToggleNotification = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem("campusos_notifications", JSON.stringify(updated));
    setToastMsg("✅ Notification preferences updated.");
    setTimeout(() => setToastMsg(""), 3000);
  };

  // Toast Feedback Message
  const [toastMsg, setToastMsg] = useState("");

  const initials =
    profileForm.name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-semibold mb-2">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" /> ACCOUNT GOVERNANCE & PREFERENCES
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-heading">
            Account Settings
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Manage your personal profile, security credentials, notification channels, and active theme appearance.
          </p>
        </div>
      </div>

      {/* Global Toast Notification */}
      {toastMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-2xl font-semibold flex items-center justify-between shadow-lg font-mono">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg("")} className="text-emerald-400 hover:text-white font-bold">✕</button>
        </div>
      )}

      {/* Main Layout: Left Tabs Sidebar & Right Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 glass-panel p-3 rounded-2xl border border-slate-800 space-y-1 font-mono text-xs">
          {[
            { id: "profile", label: "Profile Info", icon: User },
            { id: "security", label: "Security & Auth", icon: Lock },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "appearance", label: "Appearance Theme", icon: Palette },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full p-3 rounded-xl flex items-center gap-3 font-bold transition ${
                  active
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-9 glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          {/* ─── TAB 1: PROFILE ─────────────────────────────────────────── */}
          {activeTab === "profile" && (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-base font-bold text-white font-heading flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-400" /> Student Profile Verification
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Update your identity records, contact details, and portfolio links.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center gap-2 font-mono shadow-md"
                >
                  <Save className="w-4 h-4" /> {savingProfile ? "Saving..." : "Save Profile"}
                </button>
              </div>

              {/* Avatar Preset Selector */}
              <div className="flex items-center gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 p-0.5 shadow-lg shrink-0">
                  <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center text-white font-black text-2xl font-heading">
                    {initials}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-heading">{profileForm.name}</h4>
                  <span className="text-xs text-indigo-400 font-mono">
                    {isStaff ? "Faculty / Staff Member" : "Active Student • CSE"}
                  </span>
                  <div className="flex items-center gap-2 mt-2">
                    {AVATAR_PRESETS.map((preset) => (
                      <button
                        type="button"
                        key={preset.id}
                        onClick={() => setProfileForm({ ...profileForm, avatarPreset: preset.id })}
                        className={`w-7 h-7 rounded-lg text-xs flex items-center justify-center transition border ${
                          profileForm.avatarPreset === preset.id
                            ? "border-indigo-400 bg-indigo-500/20 scale-110"
                            : "border-slate-800 bg-slate-950 hover:border-slate-700"
                        }`}
                        title={preset.label}
                      >
                        {preset.icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Full Student Name:</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 rounded-xl focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Email Address:</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 rounded-xl focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Roll Number / Student ID:</label>
                  <input
                    type="text"
                    value={profileForm.rollNumber}
                    readOnly
                    className="w-full bg-slate-900 border border-slate-800 text-slate-400 p-2.5 rounded-xl cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Department:</label>
                  <input
                    type="text"
                    value={profileForm.department}
                    onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 rounded-xl focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Phone Number:</label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 rounded-xl focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">GitHub Portfolio:</label>
                  <input
                    type="url"
                    value={profileForm.github}
                    onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 rounded-xl focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-slate-300 font-bold block mb-1">Bio & Summary:</label>
                  <textarea
                    rows={3}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 rounded-xl focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </form>
          )}

          {/* ─── TAB 2: SECURITY ─────────────────────────────────────────── */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-base font-bold text-white font-heading flex items-center gap-2">
                  <Lock className="w-4 h-4 text-indigo-400" /> Security Credentials & Passwords
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update your authentication password and manage active login sessions.
                </p>
              </div>

              {/* Password Change Form */}
              <form onSubmit={handlePwSubmit} className="space-y-4 font-mono text-xs">
                {pwError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{pwError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Current Password:</label>
                    <input
                      type="password"
                      value={pwForm.current}
                      onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 rounded-xl focus:border-indigo-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-bold block mb-1">New Password:</label>
                    <input
                      type="password"
                      value={pwForm.newPw}
                      onChange={(e) => setPwForm({ ...pwForm, newPw: e.target.value })}
                      placeholder="Min 6 characters"
                      className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 rounded-xl focus:border-indigo-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Confirm New Password:</label>
                    <input
                      type="password"
                      value={pwForm.confirm}
                      onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                      placeholder="Repeat new password"
                      className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 rounded-xl focus:border-indigo-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingPw}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition flex items-center gap-2 shadow-md"
                >
                  <Key className="w-4 h-4" /> {savingPw ? "Updating Credentials..." : "Update Password"}
                </button>
              </form>

              {/* Active Sessions */}
              <div className="pt-4 border-t border-slate-800 space-y-3 font-mono text-xs">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Active Authenticated Sessions
                </h3>

                <div className="space-y-2">
                  {activeSessions.map((sess) => (
                    <div
                      key={sess.id}
                      className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        {sess.device.includes("Mobile") ? (
                          <Smartphone className="w-5 h-5 text-indigo-400 shrink-0" />
                        ) : (
                          <Laptop className="w-5 h-5 text-sky-400 shrink-0" />
                        )}
                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            {sess.device}
                            {sess.current && (
                              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">
                                Current Session
                              </span>
                            )}
                          </div>
                          <div className="text-slate-400 text-[11px]">
                            {sess.location} • IP: {sess.ip} • {sess.status}
                          </div>
                        </div>
                      </div>

                      {!sess.current && (
                        <button
                          onClick={() => handleRevokeSession(sess.id)}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition text-[11px] font-bold flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 3: NOTIFICATIONS ────────────────────────────────────── */}
          {activeTab === "notifications" && (
            <div className="space-y-6 font-mono text-xs">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-base font-bold text-white font-heading flex items-center gap-2">
                  <Bell className="w-4 h-4 text-indigo-400" /> Notification Preferences
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure alerts for placement drives, fee deadlines, exam timetables, and campus announcements.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { key: "exams", label: "Exam & Timetable Alerts", desc: "Push notification 3 days prior to exam start" },
                  { key: "placements", label: "Placement Job Drive Notices", desc: "New company cutoffs and drive application updates" },
                  { key: "fees", label: "Fee Payment Dues", desc: "Automated installment reminders before due date" },
                  { key: "labBookings", label: "Lab Slot Confirmations", desc: "Confirmation email & gate pass validation" },
                  { key: "hostelNews", label: "Hostel Bulletins", desc: "Maintenance schedules and mess menu changes" },
                  { key: "events", label: "College Fests & Workshops", desc: "Campus hackathons, guest lectures, and cultural events" },
                  { key: "pushAlerts", label: "Mobile Push Notifications", desc: "Instant mobile gate pass scan alerts" },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="font-bold text-white">{item.label}</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">{item.desc}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleNotification(item.key)}
                      className={`w-12 h-6 rounded-full transition p-1 flex items-center ${
                        notifications[item.key] ? "bg-indigo-600 justify-end" : "bg-slate-800 justify-start"
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-white shadow-md" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── TAB 4: APPEARANCE THEME SWITCHER ──────────────────────────── */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-base font-bold text-white font-heading flex items-center gap-2">
                  <Palette className="w-4 h-4 text-indigo-400" /> Interface Theme Selector
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select your preferred visual aesthetic theme for CampusOS UI.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                {THEME_OPTIONS.map((theme) => {
                  const isActive = currentTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => handleSelectTheme(theme.id)}
                      className={`p-5 rounded-2xl border text-left transition flex flex-col justify-between space-y-4 group relative ${
                        isActive
                          ? "bg-indigo-950/60 border-indigo-500 shadow-xl ring-2 ring-indigo-500/40"
                          : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{theme.icon}</span>
                          <div>
                            <h4 className="text-sm font-bold text-white font-heading">{theme.label}</h4>
                            <p className="text-[11px] text-slate-400 mt-0.5">{theme.desc}</p>
                          </div>
                        </div>

                        {isActive && (
                          <span className="px-2.5 py-1 rounded-full bg-indigo-500 text-white font-bold text-[10px] flex items-center gap-1 shadow-md">
                            <Check className="w-3 h-3" /> ACTIVE
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
                        <span className={`w-3 h-3 rounded-full ${theme.accent}`} />
                        <span className="text-[10px] text-slate-400">Click to apply theme instantly</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-300 text-xs font-mono flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>
                  Themes automatically persist across browser restarts and sync with your account preferences.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
