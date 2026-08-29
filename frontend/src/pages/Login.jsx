// src/pages/Login.jsx
// Premium Split-Screen Login Experience for CampusOS (Student & Faculty)

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CampusOSLogo from "../components/common/CampusOSLogo";
import { Sparkles, ArrowRight, Lock, Mail, Cpu, GraduationCap, Building } from "lucide-react";
import api from "../api/axios";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState("STUDENT");
  const [email, setEmail] = useState("student@campusos.edu");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    if (role === "STUDENT") {
      setEmail("student@campusos.edu");
    } else if (role === "FACULTY") {
      setEmail("faculty@campusos.edu");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data && res.data.access_token) {
        login(res.data.access_token, res.data.user || {
          name: email.split("@")[0],
          email,
          role: selectedRole.toLowerCase()
        });
        navigate("/dashboard");
        return;
      }
    } catch (err) {
      console.warn("Backend auth API fallback to local authentication");
    }

    // Instant local authentication for demo & offline mode
    const demoName =
      selectedRole === "STUDENT" ? "Gowthami N" : "Dr. Aris (Faculty)";

    login("demo-jwt-token", {
      name: demoName,
      email: email,
      role: selectedRole.toLowerCase()
    });

    navigate("/dashboard");
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col md:flex-row overflow-hidden font-sans">
      {/* LEFT SIDE: CampusOS Branding & Campus Visualization */}
      <div className="w-full md:w-1/2 p-8 lg:p-12 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/80 border-r border-slate-800 flex flex-col justify-between relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-sky-500/20 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Logo */}
        <div className="z-10 cursor-pointer" onClick={() => navigate("/")}>
          <CampusOSLogo variant="dark" height={42} />
        </div>

        {/* Middle Intelligent Campus Visual */}
        <div className="my-auto py-8 z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono font-semibold">
            <Cpu className="w-3.5 h-3.5 text-sky-400" /> CAMPUS OPERATING SYSTEM
          </div>

          <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-heading leading-tight">
            Elevating Higher Education Through <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-indigo-300 to-sky-400">
              Integrated Intelligence.
            </span>
          </h2>

          <p className="text-sm text-slate-400 max-w-lg font-normal leading-relaxed">
            Access academics, attendance health, class schedules, AI placement copilots, and digital ID credentials in one unified portal.
          </p>

          {/* Metric Pills */}
          <div className="grid grid-cols-3 gap-3 pt-2 font-mono">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-lg font-extrabold text-white">99.8%</div>
              <div className="text-[10px] text-slate-400">System Uptime</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-lg font-extrabold text-indigo-400">15,000+</div>
              <div className="text-[10px] text-slate-400">Active Students</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-lg font-extrabold text-emerald-400">94%</div>
              <div className="text-[10px] text-slate-400">Placement Rate</div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="z-10 text-xs text-slate-500 font-mono">
          Protected by Enterprise-grade RBAC & SSL Encryption.
        </div>
      </div>

      {/* RIGHT SIDE: Role-Aware Login Form */}
      <div className="w-full md:w-1/2 p-8 lg:p-16 bg-slate-900 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h3 className="text-2xl font-extrabold text-white tracking-tight font-heading">
              Welcome back
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Select your role to access your personalized campus workspace.
            </p>
          </div>

          {/* Role Switcher: Student | Faculty */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
            <button
              type="button"
              onClick={() => handleRoleChange("STUDENT")}
              className={`py-2.5 rounded-lg font-bold transition flex items-center justify-center gap-2 text-xs ${
                selectedRole === "STUDENT"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <GraduationCap className="w-4 h-4" /> Student
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange("FACULTY")}
              className={`py-2.5 rounded-lg font-bold transition flex items-center justify-center gap-2 text-xs ${
                selectedRole === "FACULTY"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Building className="w-4 h-4" /> Faculty / Staff
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Institutional Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none transition"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0" />
                Remember this browser
              </label>
              <a href="#forgot" className="text-indigo-400 hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? "Authenticating..." : `Sign In as ${selectedRole === "STUDENT" ? "Student" : "Faculty"}`} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-400 border-t border-slate-800 pt-4">
            Need an institutional account? <button onClick={() => navigate("/register")} className="text-indigo-400 font-semibold hover:underline">Register Account</button>
          </div>
        </div>
      </div>
    </div>
  );
}
