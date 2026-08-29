// src/App.jsx
// Root component — CampusOS 3.0 layout, Command Palette (Ctrl+K), SaaS landing, protected routes, Error Boundary.

import React, { useState, useEffect, Component } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import CommandPalette from "./components/common/CommandPalette";

// Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./components/Register";

// Dashboards
import StudentSuccessDashboard from "./pages/StudentSuccessDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";

// Feature Components
import Attendance from "./components/Attendance";
import PerformanceUI from "./components/PerformanceUI";
import Timetable from "./components/Timetable";
import FeeManagement from "./components/FeeManagement";
import Complaints from "./components/Complaints";
import QRIDCard from "./components/common/QRIDCard";

import SkillGapEngine from "./components/SkillGapEngine";
import AIMockInterview from "./components/AIMockInterview";
import ResumeAnalyzer from "./components/ResumeAnalyzer";
import PlacementDrives from "./components/PlacementDrives";
import LibrarySystem from "./components/LibrarySystem";
import AtRiskStudentsViewer from "./components/AtRiskStudentsViewer";
import AuditLogsViewer from "./components/AuditLogsViewer";
import AIChat from "./components/AIChat";
import AdmissionForm from "./components/AdmissionForm";
import HostelBooking from "./components/HostelBooking";
import LabBooking from "./components/LabBooking";
import StudentManagement from "./components/StudentManagement";
import Analytics from "./components/Analytics";
import AdmissionManagement from "./components/AdmissionManagement";
import Settings from "./components/Settings";

// ─── Error Boundary ─────────────────────────────────────────────────────────
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("CampusOS Platform Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-indigo-500/30 space-y-4 shadow-2xl">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-2xl font-bold font-mono">
              🎓
            </div>
            <h1 className="text-xl font-extrabold text-white font-heading">CampusOS Platform</h1>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              The application encountered a transient session update. Click below to reload the digital workspace.
            </p>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/30"
            >
              Reload & Launch Session
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Dashboard Router (Student vs Faculty) ──────────────────────────────────
function DashboardRouter() {
  const { isFaculty, isStaff } = useAuth();

  if (isFaculty || isStaff) return <FacultyDashboard />;

  return <StudentSuccessDashboard />;
}

// ─── Protected Route Guard ───────────────────────────────────────────────────
function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role, isStaff } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = role?.toLowerCase() || "student";
    const isAllowed = allowedRoles.includes(userRole) || (isStaff && allowedRoles.includes("staff"));
    if (!isAllowed) return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// ─── Sidebar Layout ──────────────────────────────────────────────────────────
function SidebarLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className={`app-shell ${collapsed ? "sidebar-is-collapsed" : ""}`}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="app-main-area">
        <Navbar
          onMenuToggle={() => setCollapsed((c) => !c)}
          onOpenCommandPalette={() => setCmdOpen(true)}
        />
        <main className="app-content min-h-[calc(100vh-60px)] bg-slate-950 text-slate-100 font-sans">
          {children}
        </main>
      </div>
      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  );
}

// ─── Routes Configuration ───────────────────────────────────────────────────
function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* SaaS Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Public Authentication */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
      />

      {/* Protected Main Command Center */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <SidebarLayout><DashboardRouter /></SidebarLayout>
        </ProtectedRoute>
      } />

      {/* Protected Student Success Engines */}
      <Route path="/student-success" element={
        <ProtectedRoute>
          <SidebarLayout><StudentSuccessDashboard /></SidebarLayout>
        </ProtectedRoute>
      } />
      <Route path="/employability" element={
        <ProtectedRoute>
          <SidebarLayout><StudentSuccessDashboard /></SidebarLayout>
        </ProtectedRoute>
      } />
      <Route path="/skill-gap" element={
        <ProtectedRoute>
          <SidebarLayout><SkillGapEngine /></SidebarLayout>
        </ProtectedRoute>
      } />
      <Route path="/mock-interview" element={
        <ProtectedRoute>
          <SidebarLayout><AIMockInterview /></SidebarLayout>
        </ProtectedRoute>
      } />
      <Route path="/resume-analyzer" element={
        <ProtectedRoute>
          <SidebarLayout><ResumeAnalyzer /></SidebarLayout>
        </ProtectedRoute>
      } />

      {/* Placement Drives & Corporate Intelligence */}
      <Route path="/placement" element={
        <ProtectedRoute>
          <SidebarLayout><PlacementDrives /></SidebarLayout>
        </ProtectedRoute>
      } />

      {/* Faculty & Staff Intelligence Roster */}
      <Route path="/faculty-dashboard" element={
        <ProtectedRoute allowedRoles={["faculty", "staff"]}>
          <SidebarLayout><FacultyDashboard /></SidebarLayout>
        </ProtectedRoute>
      } />
      <Route path="/at-risk-students" element={
        <ProtectedRoute allowedRoles={["faculty", "staff"]}>
          <SidebarLayout><AtRiskStudentsViewer /></SidebarLayout>
        </ProtectedRoute>
      } />
      <Route path="/students" element={
        <ProtectedRoute allowedRoles={["faculty", "staff"]}>
          <SidebarLayout><StudentManagement /></SidebarLayout>
        </ProtectedRoute>
      } />

      {/* Operations & Campus Infrastructure */}
      <Route path="/hostel-booking" element={
        <ProtectedRoute>
          <SidebarLayout><HostelBooking /></SidebarLayout>
        </ProtectedRoute>
      } />
      <Route path="/lab-booking" element={
        <ProtectedRoute>
          <SidebarLayout><LabBooking /></SidebarLayout>
        </ProtectedRoute>
      } />
      <Route path="/library" element={
        <ProtectedRoute>
          <SidebarLayout><LibrarySystem /></SidebarLayout>
        </ProtectedRoute>
      } />

      {/* Core Academic & Assistance Tools */}
      <Route path="/attendance" element={
        <ProtectedRoute>
          <SidebarLayout><Attendance /></SidebarLayout>
        </ProtectedRoute>
      } />
      <Route path="/performance" element={
        <ProtectedRoute>
          <SidebarLayout><PerformanceUI /></SidebarLayout>
        </ProtectedRoute>
      } />
      <Route path="/timetable" element={
        <ProtectedRoute>
          <SidebarLayout><Timetable /></SidebarLayout>
        </ProtectedRoute>
      } />
      <Route path="/fees" element={
        <ProtectedRoute>
          <SidebarLayout><FeeManagement /></SidebarLayout>
        </ProtectedRoute>
      } />
      <Route path="/complaints" element={
        <ProtectedRoute>
          <SidebarLayout><Complaints /></SidebarLayout>
        </ProtectedRoute>
      } />
      <Route path="/id-card" element={
        <ProtectedRoute>
          <SidebarLayout><QRIDCard /></SidebarLayout>
        </ProtectedRoute>
      } />
      <Route path="/ai-chat" element={
        <ProtectedRoute>
          <SidebarLayout><AIChat /></SidebarLayout>
        </ProtectedRoute>
      } />

      {/* Enterprise Analytics & System Administration */}
      <Route path="/analytics" element={
        <ProtectedRoute allowedRoles={["faculty", "staff"]}>
          <SidebarLayout><Analytics /></SidebarLayout>
        </ProtectedRoute>
      } />
      <Route path="/audit-logs" element={
        <ProtectedRoute allowedRoles={["faculty", "staff"]}>
          <SidebarLayout><AuditLogsViewer /></SidebarLayout>
        </ProtectedRoute>
      } />
      <Route path="/admission-mgmt" element={
        <ProtectedRoute allowedRoles={["faculty", "staff"]}>
          <SidebarLayout><AdmissionManagement /></SidebarLayout>
        </ProtectedRoute>
      } />
      <Route path="/admission" element={
        <ProtectedRoute>
          <SidebarLayout><AdmissionForm /></SidebarLayout>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <SidebarLayout><Settings /></SidebarLayout>
        </ProtectedRoute>
      } />

      {/* Default Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
