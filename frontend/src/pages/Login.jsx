// src/pages/Login.jsx
// Premium dual-tab login — Student | Professor/Staff
// Animated background, glassmorphism card, remember me, forgot password.

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState("student"); // "student" | "staff"
  const [formData, setFormData] = useState({ email: "", password: "", remember: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  // Pre-fill remembered email
  useEffect(() => {
    const saved = localStorage.getItem("remembered_email");
    if (saved) setFormData((prev) => ({ ...prev, email: saved, remember: true }));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      params.append("username", formData.email);
      params.append("password", formData.password);

      const res = await api.post("/auth/login", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const { access_token, user } = res.data;

      // Role validation per tab
      if (activeTab === "student" && user.role === "staff") {
        setError("Please use the Staff/Professor tab to login as professor.");
        setLoading(false);
        return;
      }
      if (activeTab === "staff" && user.role !== "staff") {
        setError("Please use the Student tab to login as a student.");
        setLoading(false);
        return;
      }

      if (formData.remember) {
        localStorage.setItem("remembered_email", formData.email);
      } else {
        localStorage.removeItem("remembered_email");
      }

      login(access_token, user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Animated particle background */}
      <div className="login-bg">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="login-particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${6 + Math.random() * 8}s`,
            width: `${4 + Math.random() * 8}px`,
            height: `${4 + Math.random() * 8}px`,
            opacity: 0.1 + Math.random() * 0.3,
          }} />
        ))}
        <div className="login-bg-orb login-bg-orb-1" />
        <div className="login-bg-orb login-bg-orb-2" />
        <div className="login-bg-orb login-bg-orb-3" />
        <div className="login-grid" />
      </div>

      {/* Card */}
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo-wrap">
          <div className="login-logo-icon">🎓</div>
          <div>
            <h1 className="login-brand">CampusOS<span className="login-brand-ai"> AI</span></h1>
            <p className="login-tagline">Intelligent Smart Campus Platform</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="login-tabs">
          <button
            id="tab-student"
            type="button"
            className={`login-tab ${activeTab === "student" ? "login-tab-active" : ""}`}
            onClick={() => { setActiveTab("student"); setError(""); }}
          >
            <span>🎒</span>
            Student
          </button>
          <button
            id="tab-staff"
            type="button"
            className={`login-tab ${activeTab === "staff" ? "login-tab-active" : ""}`}
            onClick={() => { setActiveTab("staff"); setError(""); }}
          >
            <span>👨‍🏫</span>
            Professor
          </button>
        </div>

        {/* Tab indicator text */}
        <p className="login-tab-hint">
          {activeTab === "student"
            ? "Sign in to access your student dashboard"
            : "Sign in to access the faculty dashboard"}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label className="login-label" htmlFor="login-email">
              📧 Email Address
            </label>
            <input
              id="login-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="login-input"
              placeholder={activeTab === "student" ? "student@campus.edu" : "professor@campus.edu"}
              required
              autoComplete="email"
            />
          </div>

          <div className="login-field">
            <div className="login-label-row">
              <label className="login-label" htmlFor="login-password">🔒 Password</label>
              <button
                type="button"
                className="login-forgot"
                onClick={() => alert("Password reset link will be sent to your email.")}
              >
                Forgot password?
              </button>
            </div>
            <div className="login-password-wrap">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="login-input"
                placeholder="••••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-eye"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <div className="login-remember">
            <label className="login-checkbox-label">
              <input
                id="login-remember"
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                className="login-checkbox"
              />
              <span className="login-checkbox-custom" />
              Remember me
            </label>
          </div>

          {error && (
            <div className="login-error">
              <span>⚠</span> {error}
            </div>
          )}

          <button
            id="login-submit"
            type="submit"
            className={`login-btn ${activeTab === "staff" ? "login-btn-staff" : ""}`}
            disabled={loading}
          >
            {loading ? (
              <span className="login-btn-loading">
                <span className="spinner" /> Signing in...
              </span>
            ) : (
              <>
                Sign In as {activeTab === "student" ? "Student" : "Professor"}
                <span className="login-btn-arrow">→</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <p>
            Don't have an account?{" "}
            <a href="/register" className="login-footer-link">
              Register here
            </a>
          </p>
          <p className="login-footer-note">
            🔒 Secured with JWT authentication
          </p>
        </div>
      </div>
    </div>
  );
}
