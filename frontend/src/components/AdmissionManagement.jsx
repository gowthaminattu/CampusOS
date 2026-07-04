// src/components/AdmissionManagement.jsx
// Staff-only: view all admission applications and approve/reject them.

import { useState, useEffect } from "react";
import api from "../api/axios";

const STATUS_CONFIG = {
  Pending: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", icon: "⏳" },
  Approved: { color: "#10b981", bg: "rgba(16,185,129,0.12)", icon: "✅" },
  Rejected: { color: "#ef4444", bg: "rgba(239,68,68,0.12)", icon: "❌" },
};

export default function AdmissionManagement() {
  const [applications, setApplications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
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
        (a) => a.full_name?.toLowerCase().includes(q) || a.department?.toLowerCase().includes(q) || a.email?.toLowerCase().includes(q)
      );
    }
    setFiltered(res);
  }, [applications, statusFilter, search]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admission/all");
      setApplications(res.data);
    } catch (_) {}
    finally { setLoading(false); }
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updateStatus = async (id, status) => {
    setUpdating(id + status);
    try {
      await api.put(`/admission/${id}/status`, { status });
      setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
      showToast(`Application ${status.toLowerCase()} successfully!`);
    } catch {
      showToast("Failed to update status.", "error");
    } finally { setUpdating(null); }
  };

  const counts = {
    All: applications.length,
    Pending: applications.filter((a) => a.status === "Pending").length,
    Approved: applications.filter((a) => a.status === "Approved").length,
    Rejected: applications.filter((a) => a.status === "Rejected").length,
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
            return (
              <div key={app.id} className="adm-application-card">
                <div className="adm-app-header">
                  <div className="adm-app-student-info">
                    <div className="adm-app-avatar">{app.full_name?.[0]?.toUpperCase()}</div>
                    <div>
                      <h3 className="adm-app-name">{app.full_name}</h3>
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
                    <span className="adm-detail-val">{app.marks_10th}%</span>
                  </div>
                  <div className="adm-detail-item">
                    <span className="adm-detail-label">12th Marks</span>
                    <span className="adm-detail-val">{app.marks_12th}%</span>
                  </div>
                  <div className="adm-detail-item">
                    <span className="adm-detail-label">Gender</span>
                    <span className="adm-detail-val">{app.gender}</span>
                  </div>
                  <div className="adm-detail-item">
                    <span className="adm-detail-label">DOB</span>
                    <span className="adm-detail-val">{app.dob}</span>
                  </div>
                  <div className="adm-detail-item">
                    <span className="adm-detail-label">Submitted</span>
                    <span className="adm-detail-val">{new Date(app.submitted_at).toLocaleDateString("en-IN")}</span>
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
