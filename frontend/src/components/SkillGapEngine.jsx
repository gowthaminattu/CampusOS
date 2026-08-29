// src/components/SkillGapEngine.jsx
// Modern AI Skill Matrix & Career Radar Dashboard

import React, { useState, useEffect } from "react";
import { Sparkles, Target, CheckCircle2, AlertCircle, BookOpen, ArrowRight, Award, Zap, Code, ShieldCheck, Cpu } from "lucide-react";

const ROLE_PROFILES = {
  "Frontend Developer": {
    title: "Frontend Developer",
    match: 88,
    summary: "Strong proficiency in modern UI frameworks, responsive layouts, and state handling.",
    skills: [
      { name: "React.js & Component Architecture", category: "Frameworks", status: "MASTERED", score: 95 },
      { name: "HTML5 / Modern CSS3 / Tailwind", category: "Core Web", status: "MASTERED", score: 92 },
      { name: "JavaScript (ES6+) Core Concepts", category: "Languages", status: "MASTERED", score: 88 },
      { name: "TypeScript & Static Type Checking", category: "Languages", status: "GAP", score: 45, priority: "HIGH" },
      { name: "Next.js (App Router & SSR)", category: "Frameworks", status: "GAP", score: 50, priority: "HIGH" },
      { name: "Global State (Redux / Zustand)", category: "Architecture", status: "IN_PROGRESS", score: 70 },
      { name: "Web Vitals & Performance Tuning", category: "Optimization", status: "GAP", score: 40, priority: "MEDIUM" },
    ],
    phases: [
      { phase: "Phase 1", title: "TypeScript Mastery", duration: "Week 1", desc: "Types, Interfaces, Generics, and strict React prop typings." },
      { phase: "Phase 2", title: "Next.js 14 App Router", desc: "Server Components, Server Actions, Dynamic Routes, and SSR." , duration: "Week 2" },
      { phase: "Phase 3", title: "State Management", desc: "Zustand store architecture, slices, and middleware persistence.", duration: "Week 3" },
      { phase: "Phase 4", title: "Production Optimization", desc: "Lighthouse audit >95, image optimization, bundle splitting.", duration: "Week 4" },
    ]
  },
  "Java Developer": {
    title: "Java Developer",
    match: 78,
    summary: "Solid foundation in core object-oriented principles, algorithms, and SQL databases.",
    skills: [
      { name: "Core Java (JDK 17/21 Features)", category: "Languages", status: "MASTERED", score: 90 },
      { name: "Object-Oriented Design & Patterns", category: "Core CS", status: "MASTERED", score: 85 },
      { name: "Data Structures & Algorithms", category: "Core CS", status: "MASTERED", score: 82 },
      { name: "Spring Boot 3.0 & Spring Data JPA", category: "Frameworks", status: "GAP", score: 42, priority: "HIGH" },
      { name: "Spring Security & OAuth2/JWT", category: "Security", status: "GAP", score: 35, priority: "HIGH" },
      { name: "Microservices & Eureka Gateway", category: "Architecture", status: "GAP", score: 30, priority: "HIGH" },
      { name: "Docker Containerization", category: "DevOps", status: "IN_PROGRESS", score: 60 },
    ],
    phases: [
      { phase: "Phase 1", title: "Spring Boot Essentials", duration: "Week 1", desc: "Dependency Injection, Spring Data JPA, REST controllers." },
      { phase: "Phase 2", title: "Authentication & Security", duration: "Week 2", desc: "Spring Security 6 filters, JWT validation, role authorization." },
      { phase: "Phase 3", title: "Microservices Architecture", duration: "Week 3", desc: "Service discovery, Spring Cloud Gateway, Feign clients." },
      { phase: "Phase 4", title: "Containerization & K8s", duration: "Week 4", desc: "Multi-stage Docker builds, Kubernetes manifests deployment." },
    ]
  },
  "Full Stack Developer": {
    title: "Full Stack Developer",
    match: 82,
    summary: "Balanced skill distribution across frontend UIs, REST APIs, and database design.",
    skills: [
      { name: "React.js UIs & Styling", category: "Frontend", status: "MASTERED", score: 92 },
      { name: "RESTful API Integration", category: "Architecture", status: "MASTERED", score: 88 },
      { name: "SQL & PostgreSQL Database Design", category: "Databases", status: "MASTERED", score: 85 },
      { name: "Node.js / Express.js Backend", category: "Backend", status: "IN_PROGRESS", score: 68 },
      { name: "Prisma ORM & Migrations", category: "Databases", status: "GAP", score: 40, priority: "HIGH" },
      { name: "Docker & Container Workflows", category: "DevOps", status: "GAP", score: 45, priority: "MEDIUM" },
      { name: "Redis Caching & Queue Management", category: "Performance", status: "GAP", score: 30, priority: "MEDIUM" },
    ],
    phases: [
      { phase: "Phase 1", title: "Express.js REST Microservices", duration: "Week 1", desc: "Build secure REST API layers with input validation." },
      { phase: "Phase 2", title: "Prisma ORM & Relational DBs", duration: "Week 2", desc: "Complex queries, transaction management, indexing." },
      { phase: "Phase 3", title: "Redis Caching & Queue", duration: "Week 3", desc: "Redis pub/sub, BullMQ background job processing." },
      { phase: "Phase 4", title: "Full Stack CI/CD Deployment", duration: "Week 4", desc: "Automated GitHub Actions deployment to cloud hosts." },
    ]
  },
  "Data Analyst": {
    title: "Data Analyst",
    match: 80,
    summary: "Proficient in Python data wrangling, SQL queries, and statistical reporting.",
    skills: [
      { name: "Python (Pandas, NumPy)", category: "Data Science", status: "MASTERED", score: 90 },
      { name: "SQL Querying & Aggregations", category: "Databases", status: "MASTERED", score: 86 },
      { name: "Data Visualization (Matplotlib, Seaborn)", category: "Analytics", status: "MASTERED", score: 84 },
      { name: "PowerBI / Tableau Dashboards", category: "Business Intelligence", status: "GAP", score: 45, priority: "HIGH" },
      { name: "Machine Learning (Scikit-Learn)", category: "AI/ML", status: "IN_PROGRESS", score: 62 },
      { name: "ETL Data Pipeline Automation", category: "Data Eng", status: "GAP", score: 38, priority: "MEDIUM" },
    ],
    phases: [
      { phase: "Phase 1", title: "PowerBI Business Dashboards", duration: "Week 1", desc: "DAX formulas, interactive data modeling, executive reports." },
      { phase: "Phase 2", title: "Machine Learning Regression", duration: "Week 2", desc: "Supervised learning models, classification, model metrics." },
      { phase: "Phase 3", title: "Automated Data Pipelines", duration: "Week 3", desc: "Airflow scheduling, automated data scraping & ingestion." },
      { phase: "Phase 4", title: "Executive Storytelling Project", duration: "Week 4", desc: "End-to-end data story report with actionable insights." },
    ]
  }
};

export default function SkillGapEngine() {
  const [selectedRoleKey, setSelectedRoleKey] = useState("Frontend Developer");
  const [activeTab, setActiveTab] = useState("ALL"); // "ALL" | "MASTERED" | "GAPS"
  const [copiedPlan, setCopiedPlan] = useState(false);

  const profile = ROLE_PROFILES[selectedRoleKey] || ROLE_PROFILES["Frontend Developer"];

  const filteredSkills = profile.skills.filter((s) => {
    if (activeTab === "MASTERED") return s.status === "MASTERED";
    if (activeTab === "GAPS") return s.status === "GAP" || s.status === "IN_PROGRESS";
    return true;
  });

  const masteredCount = profile.skills.filter((s) => s.status === "MASTERED").length;
  const gapCount = profile.skills.filter((s) => s.status === "GAP").length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Target Role Pills */}
      <div className="glass-panel p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" /> CAREER RADAR & SKILL MATRIX
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight font-heading">
              AI Skill Gap Engine
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Real-time benchmark evaluation comparing academic coursework against market job requirements.
            </p>
          </div>

          <button
            onClick={() => {
              setCopiedPlan(true);
              setTimeout(() => setCopiedPlan(false), 2500);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 shrink-0"
          >
            <Zap className="w-4 h-4 text-amber-300" /> {copiedPlan ? "AI Roadmap Generated!" : "Generate Personalized AI Roadmap"}
          </button>
        </div>

        {/* Role Selection Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-800 text-xs font-mono">
          <span className="text-slate-400 font-semibold pr-2">Target Role:</span>
          {Object.keys(ROLE_PROFILES).map((roleName) => (
            <button
              key={roleName}
              onClick={() => setSelectedRoleKey(roleName)}
              className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition border ${
                selectedRoleKey === roleName
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-md"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {roleName}
            </button>
          ))}
        </div>
      </div>

      {/* Role Compatibility Score Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-extrabold text-white font-heading">{profile.title}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              {profile.match}% Compatibility Match
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-xl">{profile.summary}</p>
        </div>

        <div className="flex items-center gap-6 font-mono text-xs shrink-0">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-xl font-extrabold text-emerald-400">{masteredCount}</div>
            <div className="text-[10px] text-slate-400 uppercase mt-0.5">Mastered</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-xl font-extrabold text-rose-400">{gapCount}</div>
            <div className="text-[10px] text-slate-400 uppercase mt-0.5">Priority Gaps</div>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Skill Matrix List & Learning Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Skill Matrix Breakdown */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" /> Skill Competency Matrix
            </h3>

            {/* Matrix Filter Tabs */}
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <button
                onClick={() => setActiveTab("ALL")}
                className={`px-2.5 py-1 rounded-lg transition ${activeTab === "ALL" ? "bg-indigo-600/30 text-indigo-300 font-bold border border-indigo-500/30" : "text-slate-400 hover:text-slate-200"}`}
              >
                All ({profile.skills.length})
              </button>
              <button
                onClick={() => setActiveTab("MASTERED")}
                className={`px-2.5 py-1 rounded-lg transition ${activeTab === "MASTERED" ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30" : "text-slate-400 hover:text-slate-200"}`}
              >
                Passed ({masteredCount})
              </button>
              <button
                onClick={() => setActiveTab("GAPS")}
                className={`px-2.5 py-1 rounded-lg transition ${activeTab === "GAPS" ? "bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30" : "text-slate-400 hover:text-slate-200"}`}
              >
                Gaps ({gapCount})
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredSkills.map((skill, idx) => {
              const isMastered = skill.status === "MASTERED";
              const isGap = skill.status === "GAP";

              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] font-mono font-bold text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                        {skill.category}
                      </span>
                      <h4 className="text-xs font-bold text-white">{skill.name}</h4>
                    </div>

                    <span
                      className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                        isMastered
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : isGap
                          ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                          : "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
                      }`}
                    >
                      {isMastered ? "MASTERED (100%)" : isGap ? `GAP (${skill.priority || "HIGH"})` : "IN PROGRESS"}
                    </span>
                  </div>

                  {/* Progress Score Bar */}
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isMastered
                          ? "bg-gradient-to-r from-indigo-500 to-emerald-400"
                          : isGap
                          ? "bg-rose-500"
                          : "bg-indigo-500"
                      }`}
                      style={{ width: `${skill.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: AI Recommended Phase Roadmap */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" /> AI 4-Week Study Roadmap
              </h3>
              <span className="text-[10px] font-mono text-emerald-400">Adaptive</span>
            </div>

            <div className="space-y-3 timeline-track pl-2">
              {profile.phases.map((p, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-indigo-400">{p.phase} • {p.duration}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                  </div>
                  <div className="text-xs font-bold text-white">{p.title}</div>
                  <p className="text-[11px] text-slate-400 leading-normal">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => alert(`Enrolling in AI Skill Bridge Track for ${profile.title}...`)}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-lg flex items-center justify-center gap-2"
          >
            Start Skill Bridge Plan <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
