// src/pages/LandingPage.jsx
// Premium SaaS Landing Page for CampusOS

import React from "react";
import { useNavigate } from "react-router-dom";
import CampusOSLogo from "../components/common/CampusOSLogo";
import { Sparkles, ArrowRight, ShieldCheck, Cpu, Users, Award, Calendar, BookOpen, Hotel, MessageSquare } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Top SaaS Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <CampusOSLogo variant="dark" height={42} />
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition flex items-center gap-2"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Glowing Background Radial Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-sky-500/15 rounded-full blur-[120px] pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" /> CAMPUS INTELLIGENCE PLATFORM 3.0
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-heading max-w-4xl leading-[1.1]">
          One Campus. <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-indigo-300 to-sky-400">
            One Intelligent Platform.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl font-normal leading-relaxed">
          Connect students, faculty, academics, administration and campus services through one unified, intelligent digital operating system.
        </p>

        {/* CTA Group */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            Launch Command Center <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate("/login")}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-bold text-sm transition"
          >
            Explore Platform Demo
          </button>
        </div>

        {/* Animated Connected Ecosystem Graph Visual */}
        <div className="mt-16 w-full max-w-4xl glass-panel rounded-3xl p-8 border border-slate-700/60 shadow-2xl relative">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center justify-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" /> CAMPUSOS INTELLIGENT MODULE NETWORK
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { label: "Student", color: "indigo", icon: Users },
              { label: "Attendance", color: "emerald", icon: Award },
              { label: "Academics", color: "sky", icon: BookOpen },
              { label: "AI Engine", color: "violet", icon: Sparkles },
              { label: "Faculty", color: "amber", icon: Users },
              { label: "Administration", color: "rose", icon: ShieldCheck },
              { label: "Services", color: "cyan", icon: Hotel },
            ].map((node, i) => {
              const Icon = node.icon;
              return (
                <div
                  key={node.label}
                  className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 hover:border-indigo-500/50 transition group"
                >
                  <div className="p-2.5 rounded-xl bg-slate-800 group-hover:bg-indigo-600/20 text-indigo-400 transition">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-200 font-heading">{node.label}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>● Status: <strong className="text-emerald-400">100% Operational</strong></span>
            <span>Latency: <strong>&lt;14ms</strong></span>
            <span>Security: <strong>RBAC 256-Bit Encrypted</strong></span>
          </div>
        </div>
      </main>

      {/* Footer Statement */}
      <footer className="w-full border-t border-slate-800/80 py-6 text-center text-xs text-slate-400 font-mono">
        CampusOS SaaS Platform — "Your Campus, Connected."
      </footer>
    </div>
  );
}
