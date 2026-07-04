// src/components/Register.jsx
// Dual-tab registration page — Student | Professor/Staff

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("student"); // "student" | "staff"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    roll_number: "",
    password: "",
    confirmPassword: "",
    department: "",
    year: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");

    try {
      await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        roll_number: formData.roll_number,
        password: formData.password,
        department: formData.department || null,
        year: activeTab === "student" && formData.year ? parseInt(formData.year) : null,
        role: activeTab, // "student" or "staff"
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      <div className="auth-card auth-card-wide">
        <div className="auth-header">
          <div className="auth-logo">🎓</div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join the CampusOS community</p>
        </div>

        {/* Tabs */}
        <div className="login-tabs" style={{ marginBottom: "24px" }}>
          <button
            type="button"
            className={`login-tab ${activeTab === "student" ? "login-tab-active" : ""}`}
            onClick={() => { setActiveTab("student"); setError(""); }}
          >
            <span>🎒</span>
            Student
          </button>
          <button
            type="button"
            className={`login-tab ${activeTab === "staff" ? "login-tab-active" : ""}`}
            style={activeTab === "staff" ? { background: "var(--grad-purple)", boxShadow: "0 4px 16px rgba(168,85,247,0.4)" } : {}}
            onClick={() => { setActiveTab("staff"); setError(""); }}
          >
            <span>👨‍🏫</span>
            Staff / Faculty
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                id="reg-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="John Doe"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                {activeTab === "student" ? "Roll Number" : "Staff ID / Employee ID"}
              </label>
              <input
                id="reg-roll"
                type="text"
                name="roll_number"
                value={formData.roll_number}
                onChange={handleChange}
                className="form-input"
                placeholder={activeTab === "student" ? "CS2024001" : "EMP202409"}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              id="reg-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="you@campus.edu"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group" style={{ gridColumn: activeTab === "staff" ? "1 / -1" : "auto" }}>
              <label className="form-label">Department</label>
              <select
                id="reg-dept"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Select Department</option>
                <option>Computer Science</option>
                <option>Electronics</option>
                <option>Mechanical</option>
                <option>Civil</option>
                <option>Electrical</option>
                <option>Information Technology</option>
              </select>
            </div>
            {activeTab === "student" && (
              <div className="form-group">
                <label className="form-label">Year</label>
                <select
                  id="reg-year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                id="reg-password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Min. 6 characters"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                id="reg-confirm"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-input"
                placeholder="Re-enter password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="alert alert-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <button
            id="reg-submit"
            type="submit"
            className="btn btn-primary btn-full"
            style={activeTab === "staff" ? { background: "var(--grad-purple)", boxShadow: "0 4px 20px rgba(168,85,247,0.4)" } : {}}
            disabled={loading}
          >
            {loading ? (
              <span className="btn-loading">
                <span className="spinner" /> Creating account...
              </span>
            ) : (
              `Create ${activeTab === "student" ? "Student" : "Staff"} Account`
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
