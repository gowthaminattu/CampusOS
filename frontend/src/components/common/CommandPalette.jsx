// src/components/common/CommandPalette.jsx
// Global Command Palette (Ctrl + K) for CampusOS

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Command, LayoutDashboard, Calendar, Award, BookOpen, Hotel, MessageSquare, CreditCard, IdCard, Sparkles, LogOut, X, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const COMMAND_ITEMS = [
  { id: "dash", title: "Go to Dashboard", category: "Navigation", path: "/dashboard", icon: LayoutDashboard },
  { id: "tt", title: "Open Timetable & Schedule", category: "Navigation", path: "/timetable", icon: Calendar },
  { id: "att", title: "Check Attendance & Health", category: "Academics", path: "/attendance", icon: Award },
  { id: "perf", title: "View Academic Performance & GPA", category: "Academics", path: "/performance", icon: BookOpen },
  { id: "ai", title: "Ask Campus Intelligence AI", category: "AI Assistant", path: "/chat", icon: Sparkles },
  { id: "id", title: "Digital Student ID Card", category: "Services", path: "/id-card", icon: IdCard },
  { id: "fee", title: "Fee Payments & Invoices", category: "Services", path: "/fees", icon: CreditCard },
  { id: "comp", title: "Campus Complaints & Helpdesk", category: "Services", path: "/complaints", icon: MessageSquare },
  { id: "host", title: "Hostel Management & Booking", category: "Services", path: "/hostel", icon: Hotel },
  { id: "lib", title: "Library Search & Reservations", category: "Services", path: "/library", icon: BookOpen },
];

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const filteredItems = COMMAND_ITEMS.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
      } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
        e.preventDefault();
        handleSelect(filteredItems[selectedIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex]);

  const handleSelect = (item) => {
    onClose();
    if (item.path) {
      navigate(item.path);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md cmd-palette-backdrop">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden cmd-palette-modal flex flex-col">
        {/* Search Header */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-800">
          <Search className="w-5 h-5 text-indigo-400 shrink-0 mr-3" />
          <input
            type="text"
            className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-sm font-medium focus:outline-none"
            placeholder="Type a command or search (e.g. attendance, timetable, fees)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No matching commands or actions found for "{query}".
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition ${
                    isSelected
                      ? "bg-indigo-600/20 text-indigo-200 border border-indigo-500/30"
                      : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isSelected ? "bg-indigo-500/30 text-indigo-300" : "bg-slate-800 text-slate-400"}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{item.title}</div>
                      <div className="text-[11px] text-slate-400 font-medium">{item.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 text-xs font-mono">
                    Jump <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Command Palette Footer */}
        <div className="px-4 py-2.5 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300">↵</kbd> Select</span>
            <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300">esc</kbd> Close</span>
          </div>
          <div className="flex items-center gap-1 text-indigo-400 font-semibold">
            <Command className="w-3 h-3" /> CampusOS Intelligence
          </div>
        </div>
      </div>
    </div>
  );
}
