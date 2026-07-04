// src/components/AdmissionForm.jsx
// Student admission application form + status tracker.

import { useState, useEffect } from "react";
import api from "../api/axios";

const DEPARTMENTS = [
  "Computer Science & Engineering",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Information Technology",
  "Artificial Intelligence & ML",
  "MBA",
  "BCA",
  "MCA",
];

const STATUS_CONFIG = {
  Pending: { color: "var(--accent-amber)", bg: "rgba(245,158,11,0.12)", icon: "⏳", label: "Under Review" },
  Approved: { color: "var(--accent-green)", bg: "rgba(16,185,129,0.12)", icon: "✅", label: "Approved" },
  Rejected: { color: "var(--accent-red)", bg: "rgba(239,68,68,0.12)", icon: "❌", label: "Rejected" },
};

const STEPS = ["Personal Info", "Academic Details", "Review & Submit"];

export default function AdmissionForm() {
  const [step, setStep] = useState(0);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [activeView, setActiveView] = useState("form"); // "form" | "status"

  const [form, setForm] = useState({
    full_name: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
    department: "",
    marks_10th: "",
    marks_12th: "",
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admission/my");
      setApplications(res.data);
    } catch (_) {}
    finally { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const validateStep = () => {
    if (step === 0) {
      if (!form.full_name || !form.dob || !form.gender || !form.email || !form.phone || !form.address) {
        setError("Please fill in all personal details.");
        return false;
      }
    }
    if (step === 1) {
      if (!form.department || !form.marks_10th || !form.marks_12th) {
        setError("Please fill in all academic details.");
        return false;
      }
      if (parseFloat(form.marks_10th) > 100 || parseFloat(form.marks_12th) > 100) {
        setError("Marks cannot exceed 100%.");
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setError("");
      setStep((s) => s + 1);
    }
  };

  const prevStep = () => {
    setError("");
    setStep((s) => s - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.post("/admission/apply", {
        ...form,
        marks_10th: parseFloat(form.marks_10th),
        marks_12th: parseFloat(form.marks_12th),
      });
      setSuccess(true);
      await fetchApplications();
      setActiveView("status");
      setStep(0);
      setForm({ full_name: "", dob: "", gender: "", email: "", phone: "", address: "", department: "", marks_10th: "", marks_12th: "" });
    } catch (err) {
      setError(err.response?.data?.detail || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const marksColor = (val) => {
    const n = parseFloat(val);
    if (n >= 80) return "var(--accent-green)";
    if (n >= 60) return "var(--accent-amber)";
    return "var(--accent-red)";
  };

  return (
    <div className="admission-page">
      {/* Page Header */}
      <div className="admission-page-header">
        <div>
          <h1 className="page-h1">Admission Portal</h1>
          <p className="page-sub">Apply for admission and track your application status</p>
        </div>
        <div className="admission-tabs">
          <button
            className={`adm-tab ${activeView === "form" ? "adm-tab-active" : ""}`}
            onClick={() => setActiveView("form")}
          >
            📝 Apply
          </button>
          <button
            className={`adm-tab ${activeView === "status" ? "adm-tab-active" : ""}`}
            onClick={() => setActiveView("status")}
          >
            📋 My Applications ({applications.length})
          </button>
        </div>
      </div>

      {/* Success banner */}
      {success && (
        <div className="admission-success-banner">
          <span>🎉</span>
          <div>
            <strong>Application Submitted!</strong>
            <p>Your application is now under review. Track it in the "My Applications" tab.</p>
          </div>
          <button onClick={() => setSuccess(false)}>✕</button>
        </div>
      )}

      {/* ── FORM VIEW ── */}
      {activeView === "form" && (
        <div className="admission-form-wrap">
          {/* Step indicator */}
          <div className="admission-steps">
            {STEPS.map((s, i) => (
              <div key={i} className={`adm-step ${i === step ? "adm-step-active" : i < step ? "adm-step-done" : ""}`}>
                <div className="adm-step-num">{i < step ? "✓" : i + 1}</div>
                <span className="adm-step-label">{s}</span>
                {i < STEPS.length - 1 && <div className="adm-step-line" />}
              </div>
            ))}
          </div>

          <div className="admission-card">
            <form onSubmit={handleSubmit}>
              {/* Step 0: Personal Info */}
              {step === 0 && (
                <div className="adm-step-content">
                  <h2 className="adm-step-title">👤 Personal Information</h2>
                  <div className="adm-form-grid">
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input id="adm-fullname" name="full_name" value={form.full_name} onChange={handleChange} className="form-input" placeholder="Your full name" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Date of Birth *</label>
                      <input id="adm-dob" type="date" name="dob" value={form.dob} onChange={handleChange} className="form-input" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Gender *</label>
                      <select id="adm-gender" name="gender" value={form.gender} onChange={handleChange} className="form-input" required>
                        <option value="">Select gender</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Non-binary</option>
                        <option>Prefer not to say</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input id="adm-email" type="email" name="email" value={form.email} onChange={handleChange} className="form-input" placeholder="your@email.com" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input id="adm-phone" type="tel" name="phone" value={form.phone} onChange={handleChange} className="form-input" placeholder="+91 98765 43210" required />
                    </div>
                    <div className="form-group adm-full-col">
                      <label className="form-label">Address *</label>
                      <textarea id="adm-address" name="address" value={form.address} onChange={handleChange} className="form-input" placeholder="Your full address" rows={3} required />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Academic Details */}
              {step === 1 && (
                <div className="adm-step-content">
                  <h2 className="adm-step-title">📚 Academic Details</h2>
                  <div className="adm-form-grid">
                    <div className="form-group adm-full-col">
                      <label className="form-label">Department / Program *</label>
                      <select id="adm-department" name="department" value={form.department} onChange={handleChange} className="form-input" required>
                        <option value="">Select department</option>
                        {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">10th Grade Marks (%) *</label>
                      <input id="adm-marks10" type="number" name="marks_10th" value={form.marks_10th} onChange={handleChange} className="form-input" placeholder="e.g. 88.5" min={0} max={100} step={0.01} required />
                      {form.marks_10th && (
                        <div className="marks-bar">
                          <div className="marks-bar-fill" style={{ width: `${form.marks_10th}%`, background: marksColor(form.marks_10th) }} />
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label className="form-label">12th Grade Marks (%) *</label>
                      <input id="adm-marks12" type="number" name="marks_12th" value={form.marks_12th} onChange={handleChange} className="form-input" placeholder="e.g. 92.0" min={0} max={100} step={0.01} required />
                      {form.marks_12th && (
                        <div className="marks-bar">
                          <div className="marks-bar-fill" style={{ width: `${form.marks_12th}%`, background: marksColor(form.marks_12th) }} />
                        </div>
                      )}
                    </div>
                    {/* Document upload (UI only) */}
                    <div className="form-group adm-full-col">
                      <label className="form-label">Upload Documents (Optional)</label>
                      <div className="adm-upload-zone">
                        <span className="adm-upload-icon">📂</span>
                        <p>Drag & drop or <span className="adm-upload-link">click to upload</span></p>
                        <p className="adm-upload-hint">10th/12th Marksheets, ID Proof (PDF/JPG, max 5MB each)</p>
                        <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" style={{ display: "none" }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Review */}
              {step === 2 && (
                <div className="adm-step-content">
                  <h2 className="adm-step-title">🔍 Review Your Application</h2>
                  <div className="adm-review-grid">
                    <div className="adm-review-section">
                      <h3 className="adm-review-section-title">Personal Information</h3>
                      {[
                        ["Full Name", form.full_name],
                        ["Date of Birth", form.dob],
                        ["Gender", form.gender],
                        ["Email", form.email],
                        ["Phone", form.phone],
                        ["Address", form.address],
                      ].map(([label, val]) => (
                        <div key={label} className="adm-review-row">
                          <span className="adm-review-label">{label}</span>
                          <span className="adm-review-val">{val || "—"}</span>
                        </div>
                      ))}
                    </div>
                    <div className="adm-review-section">
                      <h3 className="adm-review-section-title">Academic Details</h3>
                      {[
                        ["Department", form.department],
                        ["10th Marks", form.marks_10th ? `${form.marks_10th}%` : "—"],
                        ["12th Marks", form.marks_12th ? `${form.marks_12th}%` : "—"],
                      ].map(([label, val]) => (
                        <div key={label} className="adm-review-row">
                          <span className="adm-review-label">{label}</span>
                          <span className="adm-review-val">{val || "—"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="adm-declaration">
                    <input type="checkbox" id="adm-declare" required />
                    <label htmlFor="adm-declare">
                      I declare that all the information provided is accurate and truthful to the best of my knowledge.
                    </label>
                  </div>
                </div>
              )}

              {error && <div className="login-error" style={{ marginTop: "12px" }}>⚠ {error}</div>}

              {/* Navigation buttons */}
              <div className="adm-nav-buttons">
                {step > 0 && (
                  <button type="button" className="btn btn-ghost" onClick={prevStep}>
                    ← Back
                  </button>
                )}
                {step < 2 ? (
                  <button type="button" className="btn btn-primary" onClick={nextStep}>
                    Continue →
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? <><span className="spinner" /> Submitting…</> : "🚀 Submit Application"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── STATUS VIEW ── */}
      {activeView === "status" && (
        <div className="admission-status-wrap">
          {loading ? (
            <div className="adm-loading">Loading applications…</div>
          ) : applications.length === 0 ? (
            <div className="adm-empty">
              <span className="adm-empty-icon">📭</span>
              <h3>No Applications Yet</h3>
              <p>You haven't submitted any applications. Click "Apply" to get started.</p>
              <button className="btn btn-primary" onClick={() => setActiveView("form")}>
                Start Application →
              </button>
            </div>
          ) : (
            <div className="adm-status-list">
              {applications.map((app, i) => {
                const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.Pending;
                return (
                  <div key={app.id} className="adm-status-card">
                    <div className="adm-status-card-header">
                      <div>
                        <h3 className="adm-status-name">{app.full_name}</h3>
                        <p className="adm-status-dept">{app.department}</p>
                      </div>
                      <div
                        className="adm-status-badge"
                        style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.color + "40" }}
                      >
                        {cfg.icon} {app.status}
                      </div>
                    </div>
                    <div className="adm-status-details">
                      <span>📧 {app.email}</span>
                      <span>📱 {app.phone}</span>
                      <span>🏫 10th: {app.marks_10th}% · 12th: {app.marks_12th}%</span>
                      <span>📅 Submitted: {new Date(app.submitted_at).toLocaleDateString("en-IN")}</span>
                    </div>
                    {/* Timeline */}
                    <div className="adm-timeline">
                      <div className={`adm-timeline-step adm-tl-done`}>
                        <div className="adm-tl-dot" />
                        <div className="adm-tl-text">Application Submitted</div>
                      </div>
                      <div className={`adm-timeline-step ${app.status !== "Pending" ? "adm-tl-done" : "adm-tl-current"}`}>
                        <div className="adm-tl-dot" />
                        <div className="adm-tl-text">Under Review</div>
                      </div>
                      <div className={`adm-timeline-step ${app.status === "Approved" ? "adm-tl-done" : app.status === "Rejected" ? "adm-tl-rejected" : ""}`}>
                        <div className="adm-tl-dot" />
                        <div className="adm-tl-text">{app.status === "Rejected" ? "Rejected" : "Decision"}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
