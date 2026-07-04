// src/components/layout/Sidebar.jsx
// Collapsible sidebar — role-based menu items, smooth animations.

import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const STUDENT_NAV = [
  { path: "/dashboard", icon: "⊞", label: "Dashboard" },
  { path: "/chat", icon: "✦", label: "AI Assistant" },
  { path: "/admission", icon: "📋", label: "Admission" },
  { path: "/hostel", icon: "🏨", label: "Hostel" },
  { path: "/settings", icon: "⚙", label: "Settings" },
];

const STAFF_NAV = [
  { path: "/dashboard", icon: "⊞", label: "Dashboard" },
  { path: "/chat", icon: "✦", label: "AI Assistant" },
  { path: "/students", icon: "👥", label: "Students" },
  { path: "/lab", icon: "🔬", label: "Lab Booking" },
  { path: "/analytics", icon: "📊", label: "Analytics" },
  { path: "/admission-mgmt", icon: "📋", label: "Admissions" },
  { path: "/settings", icon: "⚙", label: "Settings" },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user, isStaff, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = isStaff ? STAFF_NAV : STUDENT_NAV;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="sidebar-overlay"
          onClick={() => setCollapsed(true)}
        />
      )}

      <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🎓</div>
          {!collapsed && (
            <div className="sidebar-logo-text">
              <span className="sidebar-brand">CampusOS</span>
              <span className="sidebar-brand-ai"> AI</span>
            </div>
          )}
          <button
            className="sidebar-toggle"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? "›" : "‹"}
          </button>
        </div>

        {/* Role badge */}
        {!collapsed && (
          <div className="sidebar-role-badge">
            <span className={`role-pill ${isStaff ? "role-staff" : "role-student"}`}>
              {isStaff ? "👨‍🏫 Staff" : "🎒 Student"}
            </span>
          </div>
        )}

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
              }
              title={collapsed ? item.label : ""}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              {!collapsed && <span className="sidebar-link-label">{item.label}</span>}
              {!collapsed && (
                <span className="sidebar-link-arrow">›</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User profile at bottom */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{initials}</div>
            {!collapsed && (
              <div className="sidebar-user-info">
                <span className="sidebar-user-name">{user?.name || "User"}</span>
                <span className="sidebar-user-email">{user?.email || ""}</span>
              </div>
            )}
          </div>
          <button
            className="sidebar-logout"
            onClick={handleLogout}
            title="Logout"
          >
            {collapsed ? "⏻" : "⏻ Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}
