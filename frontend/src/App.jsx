// src/App.jsx
// Root component — sidebar layout, protected routes, role-based access.

import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./components/Register";
import StudentDashboard from "./pages/StudentDashboard";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import AIChat from "./components/AIChat";
import AdmissionForm from "./components/AdmissionForm";
import HostelBooking from "./components/HostelBooking";
import LabBooking from "./components/LabBooking";
import StudentManagement from "./components/StudentManagement";
import Analytics from "./components/Analytics";
import AdmissionManagement from "./components/AdmissionManagement";
import Settings from "./components/Settings";

// ─── Dashboard Router ────────────────────────────────────────────────────────
function DashboardRouter() {
  const { isStaff } = useAuth();
  return isStaff ? <ProfessorDashboard /> : <StudentDashboard />;
}

// ─── Protected Route ──────────────────────────────────────────────────────────
function ProtectedRoute({ children, staffOnly = false }) {
  const { isAuthenticated, isStaff } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (staffOnly && !isStaff) return <Navigate to="/dashboard" replace />;
  return children;
}

// ─── Sidebar Layout ──────────────────────────────────────────────────────────
function SidebarLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`app-shell ${collapsed ? "sidebar-is-collapsed" : ""}`}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="app-main-area">
        <Navbar onMenuToggle={() => setCollapsed((c) => !c)} />
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}

// ─── Routes ──────────────────────────────────────────────────────────────────
function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
      />

      {/* Protected — all authenticated users */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <SidebarLayout><DashboardRouter /></SidebarLayout>
        </ProtectedRoute>
      } />
      <Route path="/chat" element={
        <ProtectedRoute>
          <SidebarLayout><AIChat /></SidebarLayout>
        </ProtectedRoute>
      } />
      <Route path="/admission" element={
        <ProtectedRoute>
          <SidebarLayout><AdmissionForm /></SidebarLayout>
        </ProtectedRoute>
      } />
      <Route path="/hostel" element={
        <ProtectedRoute>
          <SidebarLayout><HostelBooking /></SidebarLayout>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <SidebarLayout><Settings /></SidebarLayout>
        </ProtectedRoute>
      } />
      {/* Lab — accessible to both, but shows staff-only guard inside */}
      <Route path="/lab" element={
        <ProtectedRoute>
          <SidebarLayout><LabBooking /></SidebarLayout>
        </ProtectedRoute>
      } />

      {/* Protected — staff only */}
      <Route path="/students" element={
        <ProtectedRoute staffOnly>
          <SidebarLayout><StudentManagement /></SidebarLayout>
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute staffOnly>
          <SidebarLayout><Analytics /></SidebarLayout>
        </ProtectedRoute>
      } />
      <Route path="/admission-mgmt" element={
        <ProtectedRoute staffOnly>
          <SidebarLayout><AdmissionManagement /></SidebarLayout>
        </ProtectedRoute>
      } />

      {/* Default */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
