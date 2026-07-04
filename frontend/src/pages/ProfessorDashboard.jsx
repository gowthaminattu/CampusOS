// src/pages/ProfessorDashboard.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import StudentManagement from "../components/StudentManagement";
import LabBooking from "../components/LabBooking";
import Analytics from "../components/Analytics";
import AdmissionManagement from "../components/AdmissionManagement";

export default function ProfessorDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const renderContent = () => {
    switch (activeTab) {
      case "students":
        return <StudentManagement />;
      case "labs":
        return <LabBooking />;
      case "analytics":
        return <Analytics />;
      case "admissions":
        return <AdmissionManagement />;
      default:
        return (
          <div className="dash-page">
            <div className="staff-hero">
              <div className="staff-hero-bg" />
              <div className="staff-hero-content">
                <div>
                  <p className="hero-greeting-line">Welcome Back, Professor 👋</p>
                  <h1 className="hero-name">{user?.name || "Faculty Coordinator"}</h1>
                  <p className="hero-meta">
                    <span className="hero-meta-chip hero-chip-staff">Staff Admin Console</span>
                    <span className="hero-meta-chip">{user?.department || "CSE Department"}</span>
                  </p>
                </div>
              </div>
            </div>

            <h2 className="dash-section-title">Console Management Sections</h2>
            <div className="staff-quick-grid">
              {[
                { id: "students", icon: "👥", label: "Student Management", color: "#6366f1" },
                { id: "labs", icon: "🔬", label: "Lab Reservation Control", color: "#10b981" },
                { id: "analytics", icon: "📊", label: "Platform Analytics & Usage", color: "#a855f7" },
                { id: "admissions", icon: "📋", label: "Admission Application Processing", color: "#f59e0b" }
              ].map((act) => (
                <button
                  key={act.id}
                  className="staff-quick-card"
                  onClick={() => setActiveTab(act.id)}
                  style={{ "--link-color": act.color }}
                >
                  <span className="staff-quick-icon">{act.icon}</span>
                  <span className="staff-quick-label">{act.label}</span>
                  <span className="staff-quick-arrow">→</span>
                </button>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dash-page">
      {/* Tabs Menu */}
      <div className="adm-mgmt-tabs" style={{ marginBottom: "24px" }}>
        {[
          { id: "overview", label: "🏠 Overview Dashboard" },
          { id: "students", label: "👥 Student Management" },
          { id: "labs", label: "🔬 Lab Booking Management" },
          { id: "analytics", label: "📊 System Analytics" },
          { id: "admissions", label: "📋 Admission Approvals" }
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

      {renderContent()}
    </div>
  );
}
