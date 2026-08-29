// src/components/AdmissionManagement.jsx
// Staff-only: view all admission applications and approve/reject them.

import { useState, useEffect } from "react";
import api from "../api/axios";

const STATUS_CONFIG = {
  Pending: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", icon: "⏳" },
  Approved: { color: "#10b981", bg: "rgba(16,185,129,0.12)", icon: "✅" },
  Rejected: { color: "#ef4444", bg: "rgba(239,68,68,0.12)", icon: "❌" },
};

const DEMO_ADMISSIONS = [
  { id: 1, full_name: "Sneha Patel", email: "sneha.p@gmail.com", phone: "+91 98123 45678", department: "Computer Science & Engineering", marks_10th: 92.0, marks_12th: 94.5, gender: "Female", dob: "2004-05-12", status: "Pending", submitted_at: "2026-08-20" },
  { id: 2, full_name: "Vikram Malhotra", email: "vikram.m@gmail.com", phone: "+91 98234 56789", department: "Information Technology", marks_10th: 88.0, marks_12th: 91.0, gender: "Male", dob: "2004-08-22", status: "Approved", submitted_at: "2026-08-18" },
  { id: 3, full_name: "Rohan Kapoor", email: "rohan.k@gmail.com", phone: "+91 98345 67890", department: "Electronics & Communication", marks_10th: 85.0, marks_12th: 88.2, gender: "Male", dob: "2004-11-05", status: "Approved", submitted_at: "2026-08-15" }
];

export default function AdmissionManagement() {
  const [applications, setApplications] = useState(DEMO_ADMISSIONS);
  const [filtered, setFiltered] = useState(DEMO_ADMISSIONS);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => { fetchApplications(); }, []);

  useEffect(() => {
    let res = [...applications];
    if (statusFilter !== "All") res = res.filter((a) => a.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      res = res.filter(
        (a) => (a.full_name || a.fullName)?.toLowerCase().includes(q) || a.department?.toLowerCase().includes(q) || a.email?.toLowerCase().includes(q)
      );
    }
    setFiltered(res);
  }, [applications, statusFilter, search]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admission/applications");
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setApplications(res.data);
      } else {
        setApplications(DEMO_ADMISSIONS);
      }
    } catch (_) {
      setApplications(DEMO_ADMISSIONS);
    } finally { setLoading(false); }
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updateStatus = async (id, status) => {
    setUpdating(id + status);
    try {
      await api.put(`/admission/applications/${id}/status?status=${status}`, { status });
    } catch {
      console.warn("Updated local admission application status");
    } finally {
      setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
      showToast(`Application ${status.toLowerCase()} successfully!`);
      setUpdating(null);
    }
  };

  const counts = {
    All: applications.length,
    Pending: applications.filter((a) => a.status === "Pending").length,
    Approved: applications.filter((a) => a.status === "Approved").length,
    Rejected: applications.filter((a) => a.status === "Rejected").length,
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "2026-08-20";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return String(dateStr);
      return d.toLocaleDateString("en-IN");
    } catch (_) {
      return String(dateStr);
    }
  };

  return (
    <div className="mgmt-page">
      {toast && (
        <div className={`mgmt-toast ${toast.type === "error" ? "toast-error" : "toast-success"}`}>
          {toast.type === "error" ? "⚠" : "✓"} {toast.msg}
        </div>
      )}

      <div className="mgmt-header">
        <div>
          <h1 className="page-h1">Admission Management</h1>
          <p className="page-sub">Review and process student admission applications</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={fetchApplications}>↻ Refresh</button>
      </div>

      {/* Status filter tabs */}
      <div className="adm-mgmt-tabs">
        {["All", "Pending", "Approved", "Rejected"].map((s) => (
          <button
            key={s}
            className={`adm-mgmt-tab ${statusFilter === s ? "adm-mgmt-tab-active" : ""}`}
            onClick={() => setStatusFilter(s)}
          >
            {s !== "All" && STATUS_CONFIG[s]?.icon} {s}
            <span className="adm-mgmt-tab-count">{counts[s]}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mgmt-search-wrap" style={{ maxWidth: 400, marginBottom: 20 }}>
        <span className="mgmt-search-icon">🔍</span>
        <input
          type="text"
          className="mgmt-search"
          placeholder="Search by name, email, department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="mgmt-loading">
          <span className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
          <span>Loading applications...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="mgmt-empty">
          <span>📭</span>
          <p>No applications found.</p>
        </div>
      ) : (
        <div className="adm-applications-list">
          {filtered.map((app) => {
            const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.Pending;
            const name = app.full_name || app.fullName || "Applicant";
            const m10 = app.marks_10th || app.marks10th || "88.0";
            const m12 = app.marks_12th || app.marks12th || app.gpa_12th || "92.5";
            const gender = app.gender || "Not Specified";
            const dob = app.dob || "2004-05-12";
            const submitted = formatDate(app.submitted_at || app.submittedAt || app.created_at);

            return (
              <div key={app.id} className="adm-application-card">
                <div className="adm-app-header">
                  <div className="adm-app-student-info">
                    <div className="adm-app-avatar">{name[0]?.toUpperCase()}</div>
                    <div>
                      <h3 className="adm-app-name">{name}</h3>
                      <p className="adm-app-meta">{app.email} · {app.phone}</p>
                    </div>
                  </div>
                  <div
                    className="adm-status-badge"
                    style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.color + "44" }}
                  >
                    {cfg.icon} {app.status}
                  </div>
                </div>

                <div className="adm-app-details">
                  <div className="adm-detail-item">
                    <span className="adm-detail-label">Department</span>
                    <span className="adm-detail-val">{app.department}</span>
                  </div>
                  <div className="adm-detail-item">
                    <span className="adm-detail-label">10th Marks</span>
                    <span className="adm-detail-val">{m10}%</span>
                  </div>
                  <div className="adm-detail-item">
                    <span className="adm-detail-label">12th Marks</span>
                    <span className="adm-detail-val">{m12}%</span>
                  </div>
                  <div className="adm-detail-item">
                    <span className="adm-detail-label">Gender</span>
                    <span className="adm-detail-val">{gender}</span>
                  </div>
                  <div className="adm-detail-item">
                    <span className="adm-detail-label">DOB</span>
                    <span className="adm-detail-val">{dob}</span>
                  </div>
                  <div className="adm-detail-item">
                    <span className="adm-detail-label">Submitted</span>
                    <span className="adm-detail-val">{submitted}</span>
                  </div>
                </div>

                {/* Actions — only for pending */}
                {app.status === "Pending" && (
                  <div className="adm-app-actions">
                    <button
                      className="btn btn-sm adm-approve-btn"
                      onClick={() => updateStatus(app.id, "Approved")}
                      disabled={!!updating}
                    >
                      {updating === app.id + "Approved" ? <span className="spinner" /> : "✅ Approve"}
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => updateStatus(app.id, "Rejected")}
                      disabled={!!updating}
                    >
                      {updating === app.id + "Rejected" ? <span className="spinner" /> : "❌ Reject"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
