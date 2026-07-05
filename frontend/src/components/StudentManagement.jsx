// src/components/StudentManagement.jsx
// Staff-only: student table, dept-wise stats, search, GPA/attendance update.

import { useState, useEffect } from "react";
import api from "../api/axios";

const DEPT_COLORS = [
  "#6366f1", "#a855f7", "#10b981", "#f59e0b", "#ef4444",
  "#06b6d4", "#f97316", "#84cc16", "#ec4899", "#14b8a6",
];

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ gpa: "", attendance: "" });
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => { fetchStudents(); }, []);

  useEffect(() => {
    let result = [...students];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.email?.toLowerCase().includes(q) ||
          s.roll_number?.toLowerCase().includes(q) ||
          s.department?.toLowerCase().includes(q)
      );
    }
    if (deptFilter !== "All") result = result.filter((s) => s.department === deptFilter);
    if (yearFilter !== "All") result = result.filter((s) => String(s.year) === yearFilter);
    setFiltered(result);
  }, [students, search, deptFilter, yearFilter]);

  const fetchStudents = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/students");
      setStudents(res.data);
      setFiltered(res.data);
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || "Failed to load students.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const startEdit = (student) => {
    setEditingId(student.id);
    setEditValues({ gpa: student.gpa ?? "", attendance: student.attendance ?? "" });
  };

  const saveEdit = async (studentId) => {
    setUpdating(true);
    try {
      await Promise.all([
        editValues.gpa !== "" && api.put(`/admin/students/${studentId}/gpa?gpa=${editValues.gpa}`),
        editValues.attendance !== "" && api.put(`/admin/students/${studentId}/attendance?attendance=${editValues.attendance}`),
      ].filter(Boolean));
      setStudents((prev) =>
        prev.map((s) =>
          s.id === studentId
            ? { ...s, gpa: parseFloat(editValues.gpa), attendance: parseFloat(editValues.attendance) }
            : s
        )
      );
      setEditingId(null);
      showToast("Student record updated successfully!");
    } catch {
      showToast("Update failed. Please try again.", "error");
    } finally { setUpdating(false); }
  };

  // Unique departments and years for filters
  const departments = ["All", ...new Set(students.map((s) => s.department).filter(Boolean))];
  const years = ["All", ...new Set(students.map((s) => String(s.year)).filter((y) => y && y !== "null")).sort()];

  // Dept-wise count for stat cards
  const deptStats = students.reduce((acc, s) => {
    if (s.department) acc[s.department] = (acc[s.department] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mgmt-page">
      {/* Toast */}
      {toast && (
        <div className={`mgmt-toast ${toast.type === "error" ? "toast-error" : "toast-success"}`}>
          {toast.type === "error" ? "⚠" : "✓"} {toast.msg}
        </div>
      )}

      {/* Page header */}
      <div className="mgmt-header">
        <div>
          <h1 className="page-h1">Student Management</h1>
          <p className="page-sub">View, search and manage all enrolled students</p>
        </div>
        <div className="mgmt-header-stats">
          <div className="mgmt-mini-stat">
            <span className="mgmt-mini-val">{students.length}</span>
            <span className="mgmt-mini-label">Total Students</span>
          </div>
          <div className="mgmt-mini-stat">
            <span className="mgmt-mini-val">{departments.length - 1}</span>
            <span className="mgmt-mini-label">Departments</span>
          </div>
          <div className="mgmt-mini-stat">
            <span className="mgmt-mini-val">
              {students.length > 0
                ? (students.reduce((a, s) => a + (s.attendance || 0), 0) / students.length).toFixed(0)
                : "—"}%
            </span>
            <span className="mgmt-mini-label">Avg Attendance</span>
          </div>
        </div>
      </div>

      {/* Dept overview chips */}
      <div className="dept-chips-row">
        {Object.entries(deptStats).map(([dept, count], i) => (
          <button
            key={dept}
            className={`dept-chip ${deptFilter === dept ? "dept-chip-active" : ""}`}
            style={{ "--chip-color": DEPT_COLORS[i % DEPT_COLORS.length] }}
            onClick={() => setDeptFilter(deptFilter === dept ? "All" : dept)}
          >
            <span className="dept-chip-dot" style={{ background: DEPT_COLORS[i % DEPT_COLORS.length] }} />
            {dept}
            <span className="dept-chip-count">{count}</span>
          </button>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="mgmt-filters">
        <div className="mgmt-search-wrap">
          <span className="mgmt-search-icon">🔍</span>
          <input
            id="student-search"
            type="text"
            className="mgmt-search"
            placeholder="Search by name, email, roll number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="mgmt-search-clear" onClick={() => setSearch("")}>✕</button>
          )}
        </div>
        <select
          className="mgmt-filter-select"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
        >
          <option value="All">All Years</option>
          {years.filter((y) => y !== "All").map((y) => (
            <option key={y} value={y}>Year {y}</option>
          ))}
        </select>
        <button className="btn btn-ghost btn-sm" onClick={fetchStudents}>
          ↻ Refresh
        </button>
      </div>

      {/* Results count */}
      <p className="mgmt-results-count">
        Showing <strong>{filtered.length}</strong> of <strong>{students.length}</strong> students
        {search && ` for "${search}"`}
      </p>

      {/* Error Banner */}
      {error && (
        <div style={{
          padding: "14px 18px",
          marginBottom: "16px",
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.5)",
          borderRadius: "10px",
          color: "#ef4444",
          fontSize: "0.9rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}>
          <span>⚠️ {error}</span>
          <button
            onClick={fetchStudents}
            style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: "6px", padding: "5px 12px", cursor: "pointer", fontSize: "0.82rem", whiteSpace: "nowrap" }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      <div className="mgmt-table-card">
        {loading ? (
          <div className="mgmt-loading">
            <span className="spinner" style={{ width: 24, height: 24, borderWidth: 3 }} />
            <span>Loading students...</span>
          </div>
        ) : error ? (
          <div className="mgmt-empty">
            <span>⚠️</span>
            <p>Could not load student data. Check that you are logged in as staff and try again.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mgmt-empty">
            <span>🔍</span>
            <p>No students found matching your criteria.</p>
          </div>
        ) : (
          <div className="mgmt-table-scroll">
            <table className="mgmt-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Department</th>
                  <th>Year</th>
                  <th>Attendance</th>
                  <th>GPA</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student, idx) => (
                  <tr key={student.id} className="mgmt-table-row">
                    <td className="mgmt-row-num">{idx + 1}</td>
                    <td>
                      <div className="mgmt-student-cell">
                        <div
                          className="mgmt-avatar"
                          style={{ background: `${DEPT_COLORS[departments.indexOf(student.department) % DEPT_COLORS.length]}22`, color: DEPT_COLORS[departments.indexOf(student.department) % DEPT_COLORS.length] }}
                        >
                          {student.name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <p className="mgmt-student-name">{student.name}</p>
                          <p className="mgmt-student-email">{student.email}</p>
                          {student.roll_number && (
                            <p className="mgmt-roll">#{student.roll_number}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="mgmt-dept-tag">{student.department || "—"}</span>
                    </td>
                    <td>
                      {student.year ? (
                        <span className="mgmt-year-badge">Year {student.year}</span>
                      ) : "—"}
                    </td>
                    <td>
                      {editingId === student.id ? (
                        <input
                          type="number"
                          className="mgmt-inline-input"
                          value={editValues.attendance}
                          onChange={(e) => setEditValues((prev) => ({ ...prev, attendance: e.target.value }))}
                          min={0} max={100} step={0.1}
                          placeholder="0–100"
                        />
                      ) : (
                        <div className="mgmt-attendance">
                          <div className="mgmt-att-bar">
                            <div
                              className="mgmt-att-fill"
                              style={{
                                width: `${student.attendance || 0}%`,
                                background: (student.attendance || 0) >= 75
                                  ? "var(--accent-green)"
                                  : "var(--accent-red)",
                              }}
                            />
                          </div>
                          <span className={`mgmt-att-val ${(student.attendance || 0) < 75 ? "att-low" : ""}`}>
                            {student.attendance ?? 0}%
                          </span>
                        </div>
                      )}
                    </td>
                    <td>
                      {editingId === student.id ? (
                        <input
                          type="number"
                          className="mgmt-inline-input mgmt-gpa-input"
                          value={editValues.gpa}
                          onChange={(e) => setEditValues((prev) => ({ ...prev, gpa: e.target.value }))}
                          min={0} max={10} step={0.01}
                          placeholder="0–10"
                        />
                      ) : (
                        <span className="mgmt-gpa-badge">{student.gpa?.toFixed(1) ?? "—"}</span>
                      )}
                    </td>
                    <td>
                      {editingId === student.id ? (
                        <div className="mgmt-action-btns">
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => saveEdit(student.id)}
                            disabled={updating}
                          >
                            {updating ? <span className="spinner" /> : "✓ Save"}
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => setEditingId(null)}
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          className="btn btn-ghost btn-sm mgmt-edit-btn"
                          onClick={() => startEdit(student)}
                        >
                          ✏ Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
