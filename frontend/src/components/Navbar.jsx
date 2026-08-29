// src/components/Navbar.jsx
// Fixed Topbar for CampusOS with Ctrl + K Command Palette Trigger

import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Search, Command, Bell, User, LogOut, Settings, Menu, Sparkles, CheckCircle2 } from "lucide-react";
import api from "../api/axios";

const PAGE_TITLES = {
  "/dashboard": "Command Center",
  "/attendance": "Attendance & Academic Health",
  "/performance": "Academic Performance & GPA",
  "/timetable": "Smart Timetable",
  "/chat": "Campus Intelligence AI",
  "/id-card": "Digital Student ID",
  "/fees": "Fee Management & Receipts",
  "/complaints": "Campus Helpdesk & Issues",
  "/placement": "Placement Drives",
  "/hostel": "Hostel Management",
  "/library": "Library System",
  "/lab": "Lab Allocations",
  "/students": "Student Directory",
  "/settings": "Settings",
};

export default function Navbar({ onMenuToggle, onOpenCommandPalette }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Attendance Health: Digital Electronics is at 76%", time: "10m ago", read: false },
    { id: 2, text: "New Notice: Annual Hackathon 2026 Registration Open", time: "1h ago", read: false },
  ]);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pageTitle = PAGE_TITLES[location.pathname] || "CampusOS Intelligence";

  return (
    <header className="topbar flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
      {/* Left: Menu toggle + Page Title */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuToggle}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
        >
          <Menu className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-base font-bold text-white font-heading">{pageTitle}</h2>
          <span className="text-[10px] font-mono text-slate-500">
            CampusOS AI › {pageTitle}
          </span>
        </div>
      </div>

      {/* Middle: Command Palette Trigger Button (Ctrl + K) */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 text-slate-400 hover:text-slate-200 text-xs transition font-mono shadow-inner"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-indigo-400" /> Search commands, courses, fees...
          </span>
          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] border border-slate-700">
            Ctrl K
          </span>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Command Palette Mobile Trigger Icon */}
        <button
          onClick={onOpenCommandPalette}
          className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl space-y-3 z-50">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-white font-heading">Notifications</span>
                <span className="text-[10px] font-mono text-indigo-400">2 New</span>
              </div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                    <p className="text-slate-200">{n.text}</p>
                    <span className="text-[10px] font-mono text-slate-500 mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              {(user?.name || "Gowthami").charAt(0)}
            </div>
            <span className="text-xs font-bold text-white hidden sm:inline">{user?.name || "Gowthami"}</span>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl space-y-1 z-50 text-xs">
              <button
                onClick={() => { setShowProfile(false); navigate("/settings"); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition"
              >
                <Settings className="w-4 h-4 text-slate-400" /> Account Settings
              </button>
              <button
                onClick={() => { setShowProfile(false); navigate("/id-card"); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition"
              >
                <User className="w-4 h-4 text-slate-400" /> Digital Student ID
              </button>
              <div className="border-t border-slate-800 my-1" />
              <button
                onClick={() => { logout(); navigate("/login"); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition font-semibold"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
