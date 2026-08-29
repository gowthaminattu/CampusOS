// src/components/Sidebar.jsx
// Enterprise Role-Based Collapsible Sidebar — Student & Faculty profiles.

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CampusOSLogo from "./common/CampusOSLogo";
import {
  LayoutDashboard,
  Award,
  BookOpen,
  Calendar,
  Sparkles,
  IdCard,
  CreditCard,
  MessageSquare,
  Hotel,
  Library,
  FlaskConical,
  Briefcase,
  BarChart3,
  FileText,
  Mic,
  Users,
  AlertTriangle,
  FileCheck,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const STUDENT_GROUPS = [
  {
    title: "MAIN",
    items: [
      { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" }
    ]
  },
  {
    title: "ACADEMICS & HEALTH",
    items: [
      { path: "/attendance", icon: Award, label: "Attendance Health" },
      { path: "/performance", icon: BookOpen, label: "Performance & GPA" },
      { path: "/timetable", icon: Calendar, label: "Smart Timetable" },
    ]
  },
  {
    title: "AI ASSISTANTS",
    items: [
      { path: "/chat", icon: Sparkles, label: "Campus Intelligence" },
      { path: "/mock-interview", icon: Mic, label: "AI Mock Interview" },
      { path: "/resume-analyzer", icon: FileText, label: "Resume Analyzer" },
      { path: "/skill-gap", icon: BarChart3, label: "Skill Gap Engine" },
    ]
  },
  {
    title: "CAMPUS SERVICES",
    items: [
      { path: "/id-card", icon: IdCard, label: "Digital Student ID" },
      { path: "/fees", icon: CreditCard, label: "Fee Management" },
      { path: "/complaints", icon: MessageSquare, label: "Helpdesk & Issues" },
      { path: "/placement", icon: Briefcase, label: "Placement Drives" },
      { path: "/hostel", icon: Hotel, label: "Hostel Management" },
      { path: "/library", icon: Library, label: "Library System" },
    ]
  },
  {
    title: "ACCOUNT",
    items: [
      { path: "/settings", icon: Settings, label: "Settings" },
    ]
  }
];

const FACULTY_GROUPS = [
  {
    title: "MAIN",
    items: [
      { path: "/dashboard", icon: LayoutDashboard, label: "Command Center" }
    ]
  },
  {
    title: "STUDENT MANAGEMENT",
    items: [
      { path: "/students", icon: Users, label: "Student Roster" },
      { path: "/at-risk-students", icon: AlertTriangle, label: "At-Risk Students" },
    ]
  },
  {
    title: "ACADEMICS & PLACEMENT",
    items: [
      { path: "/timetable", icon: Calendar, label: "Class Timetable" },
      { path: "/placement", icon: Briefcase, label: "Placement Drives" },
      { path: "/admission-mgmt", icon: FileCheck, label: "Admissions Review" },
      { path: "/analytics", icon: BarChart3, label: "Campus Analytics" },
    ]
  },
  {
    title: "ACCOUNT",
    items: [
      { path: "/settings", icon: Settings, label: "Settings" }
    ]
  }
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user, logout, isFaculty, isStaff } = useAuth();
  const navigate = useNavigate();

  const groups = (isFaculty || isStaff) ? FACULTY_GROUPS : STUDENT_GROUPS;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
      {/* Sidebar Header with Logo */}
      <div className="sidebar-header flex items-center justify-between px-4 py-4 border-b border-slate-800">
        <div className="cursor-pointer overflow-hidden" onClick={() => navigate("/dashboard")}>
          <CampusOSLogo
            variant="dark"
            height={32}
            showTagline={!collapsed}
          />
        </div>
        <button
          type="button"
          className="sidebar-collapse-btn p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Groups */}
      <nav className="sidebar-nav p-3 space-y-6 overflow-y-auto">
        {groups.map((group, idx) => (
          <div key={idx} className="sidebar-group">
            {!collapsed && (
              <h4 className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">
                {group.title}
              </h4>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-bold"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                      }`
                    }
                    title={collapsed ? item.label : ""}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Footer */}
      <div className="sidebar-footer p-3 border-t border-slate-800">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="min-w-0 pr-2">
              <div className="text-xs font-bold text-white truncate font-heading">{user?.name || "User"}</div>
              <div className="text-[10px] font-mono text-slate-500 uppercase">{user?.role || "Student"}</div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
