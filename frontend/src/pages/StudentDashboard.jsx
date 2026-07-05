// src/pages/StudentDashboard.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import AIChat from "../components/AIChat";
import Timetable from "../components/Timetable";
import AdmissionForm from "../components/AdmissionForm";
import Hostel from "../components/Hostel";
import Placement from "../components/Placement";
import EventRegistration from "../components/EventRegistration";
import Library from "../components/Library";
import FeeInquiry from "../components/FeeInquiry";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const renderContent = () => {
    switch (activeTab) {
      case "chat":
        return <AIChat />;
      case "timetable":
        return <Timetable />;
      case "admission":
        return <AdmissionForm />;
      case "hostel":
        return <Hostel />;
      case "placement":
        return <Placement />;
      case "events":
        return <EventRegistration />;
      case "library":
        return <Library />;
      case "fees":
        return <FeeInquiry />;
      default:
        return (
          <div className="dash-page">
            {/* Quick Actions */}
            <h2 className="dash-section-title">Campus Features</h2>
            <div className="student-actions-grid">
              {[
                { id: "chat", icon: "✦", label: "AI Chat Assistant", desc: "Ask helpdesk, fees, timetable agents", color: "var(--accent-blue)" },
                { id: "timetable", icon: "📅", label: "Class Timetable", desc: "View your classes and subject rooms", color: "var(--accent-green)" },
                { id: "admission", icon: "📋", label: "Admission Status", desc: "Fill and track admission form", color: "var(--accent-purple)" },
                { id: "placement", icon: "💼", label: "Placement Cell", desc: "Check drive eligibility and resumes", color: "var(--accent-amber)" },
                { id: "events", icon: "🏆", label: "Events & Hackathons", desc: "Browse upcoming events and register", color: "var(--accent-cyan)" },
                { id: "library", icon: "📖", label: "Central Library", desc: "Search catalog and due dates", color: "var(--accent-purple)" },
                { id: "hostel", icon: "🏨", label: "Hostel Lodge", desc: "Rules and room complaints", color: "var(--accent-green)" },
                { id: "fees", icon: "💰", label: "Fees & Dues", desc: " Tuitions, hostel invoices", color: "var(--accent-red)" }
              ].map((act) => (
                <button
                  key={act.id}
                  className="student-action-card"
                  onClick={() => setActiveTab(act.id)}
                  style={{ "--card-color": act.color }}
                >
                  <div className="action-card-icon">{act.icon}</div>
                  <div className="action-card-body">
                    <h3 className="action-card-title">{act.label}</h3>
                    <p className="action-card-desc">{act.desc}</p>
                  </div>
                  <span className="action-card-arrow">→</span>
                </button>
              ))}
            </div>

            {/* AI Assistant Help */}
            <div className="ai-suggestions-section">
              <div className="ai-suggestions-header">
                <div className="ai-suggestions-title-wrap">
                  <span className="ai-suggestions-icon">✦</span>
                  <h2 className="dash-section-title" style={{ margin: 0 }}>Try Multi-Agent Orchestration Commands</h2>
                </div>
              </div>
              <div className="ai-chips-grid">
                {[
                  "Book Chem Lab tomorrow and check my fee balance",
                  "What is my pending fee and suggest books for AI?",
                  "Show upcoming events and tell me my due dates",
                  "Am I eligible for Google and list hostel rules?"
                ].map((s, i) => (
                  <button
                    key={i}
                    className="ai-chip"
                    onClick={() => {
                      // Navigate to AI Chat Tab
                      setActiveTab("chat");
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dash-page">
      {/* Student Profile Card (Hero Section) */}
      <div className="student-hero">
        <div className="student-hero-bg" />
        <div className="student-hero-content">
          <div className="student-hero-text">
            <p className="hero-greeting-line">{greeting}, 👋</p>
            <h1 className="hero-name">{user?.name || "Student"}</h1>
            <p className="hero-meta">
              <span className="hero-meta-chip">{user?.department || "Computer Science"}</span>
              <span className="hero-meta-chip">Year {user?.year || "2"}</span>
              <span className="hero-meta-chip">#{user?.roll_number || "922523106026"}</span>
            </p>
          </div>
          
          {/* Profile Card */}
          <div className="student-id-card">
            <div className="id-card-shine" />
            <div className="id-card-top">
              <span className="id-card-logo">🎓</span>
              <span className="id-card-institute">CampusOS Smart University</span>
            </div>
            <div className="id-card-avatar">{user?.name?.[0] || "S"}</div>
            <div className="id-card-name">{user?.name}</div>
            <div className="id-card-roll">ID: {user?.roll_number || "—"}</div>
            <div className="id-card-dept">{user?.department || "General Sciences"}</div>
            <div className="id-card-footer">
              <div className="id-card-stat">
                <span className="id-stat-label">GPA</span>
                <span className="id-stat-val">{user?.gpa?.toFixed(2) || "8.50"}</span>
              </div>
              <div className="id-card-divider" />
              <div className="id-card-stat">
                <span className="id-stat-label">Attendance</span>
                <span className="id-stat-val">{user?.attendance ? `${user.attendance}%` : "82%"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="adm-mgmt-tabs" style={{ marginBottom: "24px" }}>
        {[
          { id: "overview", label: "🏠 Dashboard Overview" },
          { id: "chat", label: "✦ AI Chat Assistant" },
          { id: "timetable", label: "📅 Timetable" },
          { id: "admission", label: "📋 Admission Application" },
          { id: "hostel", label: "🏨 Hostel" },
          { id: "placement", label: "💼 Placement Cell" },
          { id: "events", label: "🏆 Events" },
          { id: "library", label: "📖 Library" },
          { id: "fees", label: "💰 Fees" }
        ].map((tab) => (
          <button
            key={tab.id}
            className={`adm-mgmt-tab ${activeTab === tab.id ? "adm-mgmt-tab-active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dynamic Content Pane */}
      {renderContent()}
    </div>
  );
}
