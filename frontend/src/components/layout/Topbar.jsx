// src/components/layout/Topbar.jsx
// Fixed top navbar — page title, notifications, profile.

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/chat": "AI Assistant",
  "/admission": "Admission Application",
  "/hostel": "Hostel Booking",
  "/students": "Student Management",
  "/lab": "Lab Booking",
  "/analytics": "Analytics",
  "/admission-mgmt": "Admission Management",
  "/settings": "Settings",
};

const NOTIFICATIONS = [
  { id: 1, text: "Your admission application is under review", time: "2h ago", read: false },
  { id: 2, text: "Lab booking confirmed for tomorrow 2 PM", time: "5h ago", read: false },
  { id: 3, text: "New semester schedule released", time: "1d ago", read: true },
];

export default function Topbar({ onMenuToggle }) {
  const { user, logout, isStaff } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const pageTitle = PAGE_TITLES[location.pathname] || "CampusOS AI";

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="topbar">
      {/* Left: hamburger + page title */}
      <div className="topbar-left">
        <button className="topbar-menu-btn" onClick={onMenuToggle}>
          <span /><span /><span />
        </button>
        <div className="topbar-title-wrap">
          <h2 className="topbar-title">{pageTitle}</h2>
          <span className="topbar-breadcrumb">
            CampusOS AI › {pageTitle}
          </span>
        </div>
      </div>

      {/* Right: actions */}
      <div className="topbar-right">
        {/* Notifications */}
        <div className="topbar-dropdown-wrap">
          <button
            id="topbar-notifications"
            className="topbar-icon-btn"
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
          >
            🔔
            {unreadCount > 0 && (
              <span className="topbar-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="topbar-dropdown notif-dropdown">
              <div className="notif-header">
                <span>Notifications</span>
                <button onClick={markAllRead} className="notif-mark-read">
                  Mark all read
                </button>
              </div>
              {notifications.map((n) => (
                <div key={n.id} className={`notif-item ${!n.read ? "notif-unread" : ""}`}>
                  <div className="notif-dot" />
                  <div className="notif-body">
                    <p className="notif-text">{n.text}</p>
                    <span className="notif-time">{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="topbar-dropdown-wrap">
          <button
            id="topbar-profile"
            className="topbar-avatar-btn"
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
          >
            <div className="topbar-avatar">{initials}</div>
            <div className="topbar-user-meta">
              <span className="topbar-username">{user?.name?.split(" ")[0] || "User"}</span>
              <span className={`topbar-role ${isStaff ? "role-staff-text" : "role-student-text"}`}>
                {isStaff ? "Staff" : "Student"}
              </span>
            </div>
            <span className="topbar-chevron">▾</span>
          </button>

          {showProfile && (
            <div className="topbar-dropdown profile-dropdown">
              <div className="profile-dd-header">
                <div className="profile-dd-avatar">{initials}</div>
                <div>
                  <p className="profile-dd-name">{user?.name}</p>
                  <p className="profile-dd-email">{user?.email}</p>
                </div>
              </div>
              <div className="profile-dd-divider" />
              <button
                className="profile-dd-item"
                onClick={() => { navigate("/settings"); setShowProfile(false); }}
              >
                ⚙ Settings
              </button>
              <button
                className="profile-dd-item profile-dd-logout"
                onClick={handleLogout}
              >
                ⏻ Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
