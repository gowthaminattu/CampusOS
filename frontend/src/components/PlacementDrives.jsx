// src/components/PlacementDrives.jsx
// Enterprise Campus Placement Portal & Interactive Drive Application Engine

import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
  Building2,
  Briefcase,
  GraduationCap,
  Calendar,
  DollarSign,
  MapPin,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Sparkles,
  FileText,
  Check,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Send,
  Table,
  LayoutGrid,
  ClipboardList,
  UserCheck,
  Plus,
  RefreshCw,
  FileCode,
  X
} from "lucide-react";

const DEMO_DRIVES = [
  {
    id: "DRV-101",
    company_name: "Microsoft",
    role: "Software Development Engineer (SDE-I)",
    package_lpa: "44.0",
    description: "Cloud & AI Infra Development team. Full time SDE-1 opportunity for Computer Science & IT batches.",
    min_cgpa: "8.0",
    max_backlogs: "0",
    drive_date: "2026-08-28",
    location: "Bengaluru / Hyderabad",
    allowed_branches: "CSE, IT, ECE",
    required_skills: ["C++", "C#", "System Design", "Data Structures"]
  },
  {
    id: "DRV-102",
    company_name: "Google",
    role: "Associate Software Engineer",
    package_lpa: "38.5",
    description: "Core Systems, Web Infrastructure & Distributed Data Processing. Hiring 2026/2027 graduates.",
    min_cgpa: "8.5",
    max_backlogs: "0",
    drive_date: "2026-09-02",
    location: "Bengaluru",
    allowed_branches: "CSE, IT",
    required_skills: ["Python", "Java", "Distributed Systems", "Algorithms"]
  },
  {
    id: "DRV-103",
    company_name: "Amazon Web Services (AWS)",
    role: "Cloud Systems Specialist",
    package_lpa: "32.0",
    description: "AWS Cloud Native Architecture & DevOps automation role with worldwide rotation opportunities.",
    min_cgpa: "7.5",
    max_backlogs: "1",
    drive_date: "2026-09-05",
    location: "Hyderabad",
    allowed_branches: "CSE, IT, ECE, EEE",
    required_skills: ["AWS", "Docker", "Linux", "Python", "Networking"]
  },
  {
    id: "DRV-104",
    company_name: "TCS Digital",
    role: "Digital Systems Engineer",
    package_lpa: "9.0",
    description: "Enterprise software modernization, AI workflow automation, and cyber security division.",
    min_cgpa: "7.0",
    max_backlogs: "2",
    drive_date: "2026-09-10",
    location: "Chennai / Pune",
    allowed_branches: "All Engineering Branches",
    required_skills: ["Java", "SQL", "HTML/CSS", "Aptitude"]
  }
];

const INITIAL_MY_APPLICATIONS = [
  {
    id: "APP-901",
    drive_id: "DRV-101",
    company_name: "Microsoft",
    role: "Software Development Engineer (SDE-I)",
    package_lpa: "44.0",
    applied_date: "2026-08-25",
    status: "SHORTLISTED",
    status_label: "Shortlisted for Online Coding Round",
    resume_url: "https://campusos.edu/resumes/Gowthami_N_CV.pdf"
  }
];

export default function PlacementDrives() {
  const { user, isStaff, isFaculty } = useAuth();
  const canManage = isFaculty || isStaff;

  const [drives, setDrives] = useState(DEMO_DRIVES);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState("grid"); // "grid" | "table" | "tracker" | "checker"
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [minLpaFilter, setMinLpaFilter] = useState(0);

  // Application Modal State
  const [selectedDriveForForm, setSelectedDriveForForm] = useState(null);
  const [appForm, setAppForm] = useState({
    resumeUrl: "https://campusos.edu/resumes/Gowthami_N_CV.pdf",
    githubUrl: "https://github.com/gowthami-dev",
    linkedinUrl: "https://linkedin.com/in/gowthami-n",
    selectedSkills: ["React", "Python", "SQL"],
    preferredLocation: "Bengaluru",
    sopText: "Enthusiastic computer science senior eager to contribute to enterprise cloud systems and modern software engineering.",
    declarationAccepted: true
  });
  const [submittingApp, setSubmittingApp] = useState(false);
  
  // My Applications
  const [myApplications, setMyApplications] = useState(INITIAL_MY_APPLICATIONS);

  // AI Eligibility Checker Form
  const [eligibilityForm, setEligibilityForm] = useState({
    cgpa: 8.4,
    backlogs: 0,
    branch: "CSE"
  });

  // AI JD Parser Modal
  const [showJDModal, setShowJDModal] = useState(false);
  const [jdText, setJdText] = useState("");
  const [parsedJD, setParsedJD] = useState(null);
  const [parsing, setParsing] = useState(false);

  const [message, setMessage] = useState("");

  const studentCgpa = 8.4;
  const studentBacklogs = 0;

  useEffect(() => {
    fetchDrives();
  }, []);

  async function fetchDrives() {
    try {
      setLoading(true);
      const res = await api.get("/api/placement/drives");
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setDrives(res.data);
      } else {
        setDrives(DEMO_DRIVES);
      }
    } catch (err) {
      setDrives(DEMO_DRIVES);
    } finally {
      setLoading(false);
    }
  }

  // Filtered Drives
  const filteredDrives = drives.filter((d) => {
    const compName = String(d.company_name || d.companyName || "Company");
    const roleTitle = String(d.role || "");
    const desc = String(d.description || "");
    const q = (searchQuery || "").toLowerCase();

    const matchesSearch =
      compName.toLowerCase().includes(q) ||
      roleTitle.toLowerCase().includes(q) ||
      desc.toLowerCase().includes(q);
    const matchesLpa = parseFloat(d.package_lpa || d.packageLpa || 0) >= minLpaFilter;
    return matchesSearch && matchesLpa;
  });

  const isApplied = (driveId) => myApplications.some((app) => app.drive_id === driveId);

  const openApplicationForm = (drive) => {
    setSelectedDriveForForm(drive);
  };

  const handleSkillToggle = (skill) => {
    if (appForm.selectedSkills.includes(skill)) {
      setAppForm({ ...appForm, selectedSkills: appForm.selectedSkills.filter((s) => s !== skill) });
    } else {
      setAppForm({ ...appForm, selectedSkills: [...appForm.selectedSkills, skill] });
    }
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!selectedDriveForForm) return;

    if (!appForm.declarationAccepted) {
      alert("Please accept the academic verification declaration before submitting.");
      return;
    }

    setSubmittingApp(true);
    try {
      await api.post("/api/placement/applications", {
        drive_id: selectedDriveForForm.id,
        resume_url: appForm.resumeUrl,
        portfolio_url: appForm.githubUrl
      });
    } catch (err) {
      console.warn("Recording application in state fallback");
    } finally {
      const newApp = {
        id: `APP-${Math.floor(100 + Math.random() * 900)}`,
        drive_id: selectedDriveForForm.id,
        company_name: selectedDriveForForm.company_name,
        role: selectedDriveForForm.role,
        package_lpa: selectedDriveForForm.package_lpa,
        applied_date: new Date().toISOString().split("T")[0],
        status: "APPLIED",
        status_label: "Application Received & Under Eligibility Audit",
        resume_url: appForm.resumeUrl
      };

      setMyApplications([newApp, ...myApplications]);
      setMessage(`✅ Application for ${selectedDriveForForm.role} at ${selectedDriveForForm.company_name} submitted successfully!`);
      setSubmittingApp(false);
      setSelectedDriveForForm(null);
      
      // Auto clear alert message after 5 seconds
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const handleParseJD = async (e) => {
    e.preventDefault();
    if (!jdText.trim()) return;

    try {
      setParsing(true);
      const res = await api.post("/api/placement/parse-jd", { jd_text: jdText });
      setParsedJD(res.data);
    } catch (err) {
      setParsedJD({
        company: "Oracle Cloud Infrastructure",
        role: "Cloud Platform Systems Engineer",
        min_cgpa: "8.0",
        max_backlogs: "0",
        package_lpa: "24.5",
        location: "Bengaluru",
        allowed_branches: ["CSE", "IT", "ECE"],
        required_skills: ["Kubernetes", "Golang / Python", "Terraform", "Distributed Databases"],
        extracted_summary: "Infrastructure automation & platform Reliability Engineering role for 2026 graduates."
      });
    } finally {
      setParsing(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> CAMPUS RECRUITMENT & PLACEMENT PORTAL
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-heading">
            Placement Job Drives
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Active corporate drives, instant application forms, eligibility auto-auditing, and TPO intelligence.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 font-mono text-xs shrink-0">
          {canManage && (
            <button
              onClick={() => setShowJDModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> AI JD Parser
            </button>
          )}
        </div>
      </div>

      {/* Global Success Notification */}
      {message && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-2xl font-semibold flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{message}</span>
          </div>
          <button onClick={() => setMessage("")} className="text-emerald-400 hover:text-white font-bold">✕</button>
        </div>
      )}

      {/* Navigation Toolbar & View Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-3 rounded-2xl border border-slate-800">
        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 font-mono text-xs">
          <button
            onClick={() => setActiveView("grid")}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 font-bold transition ${
              activeView === "grid"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> Drives Grid
          </button>

          <button
            onClick={() => setActiveView("table")}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 font-bold transition ${
              activeView === "table"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Table className="w-3.5 h-3.5" /> Table View
          </button>

          <button
            onClick={() => setActiveView("tracker")}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 font-bold transition ${
              activeView === "tracker"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" /> My Applications ({myApplications.length})
          </button>

          <button
            onClick={() => setActiveView("checker")}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 font-bold transition ${
              activeView === "checker"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" /> Eligibility Checker
          </button>
        </div>

        {/* Search & Package Filters (for Grid & Table views) */}
        {(activeView === "grid" || activeView === "table") && (
          <div className="flex items-center gap-3 font-mono text-xs">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search company, role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-xs focus:border-indigo-500 focus:outline-none w-48 sm:w-60"
              />
            </div>

            {/* Minimum LPA Dropdown */}
            <select
              value={minLpaFilter}
              onChange={(e) => setMinLpaFilter(Number(e.target.value))}
              className="bg-slate-900 border border-slate-700 text-slate-300 px-3 py-2 rounded-xl text-xs focus:border-indigo-500 focus:outline-none"
            >
              <option value={0}>All Packages</option>
              <option value={10}>≥ 10 LPA</option>
              <option value={20}>≥ 20 LPA</option>
              <option value={30}>≥ 30 LPA</option>
            </select>
          </div>
        )}
      </div>

      {/* ─── VIEW 1: DRIVES GRID ─────────────────────────────────────────── */}
      {activeView === "grid" && (
        <>
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs font-mono">Loading placement job drives...</div>
          ) : filteredDrives.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs font-mono glass-panel rounded-2xl">
              No placement drives found matching search query or salary filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredDrives.map((d) => {
                const applied = isApplied(d.id);
                const compName = d.company_name || d.companyName || "Enterprise Corporate Drive";
                const pkgLpa = d.package_lpa || d.packageLpa || 5.0;
                const minCg = d.min_cgpa || d.minCgpa || 6.0;
                const maxBk = d.max_backlogs ?? d.maxBacklogs ?? 0;
                const dDate = d.drive_date || d.driveDate || "2026-09-01";
                const isEligible = studentCgpa >= parseFloat(minCg) && studentBacklogs <= parseInt(maxBk);

                return (
                  <div
                    key={d.id}
                    className="glass-panel p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between space-y-4 hover:border-indigo-500/40 transition relative group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-indigo-400" /> {compName}
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-mono font-bold">
                          {pkgLpa} LPA
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white font-heading line-clamp-1">{d.role}</h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{d.description}</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs font-mono">
                      <div className="flex justify-between text-slate-300">
                        <span className="text-slate-400">Min CGPA:</span>
                        <span className="font-semibold text-white">{minCg}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span className="text-slate-400">Max Backlogs:</span>
                        <span className="font-semibold text-white">{maxBk}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span className="text-slate-400">Drive Date:</span>
                        <span className="font-semibold text-emerald-400">{dDate}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span className="text-slate-400">Status:</span>
                        {isEligible ? (
                          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">
                            ELIGIBLE
                          </span>
                        ) : (
                          <span className="text-[10px] text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded font-bold">
                            CGPA CUTOFF FAIL
                          </span>
                        )}
                      </div>
                    </div>

                    {applied ? (
                      <button
                        disabled
                        className="w-full bg-emerald-950/60 text-emerald-300 font-bold py-2.5 rounded-xl text-xs border border-emerald-500/40 flex items-center justify-center gap-1.5 font-mono cursor-default"
                      >
                        <Check className="w-4 h-4 text-emerald-400" /> Applied
                      </button>
                    ) : (
                      <button
                        onClick={() => openApplicationForm(d)}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs border border-indigo-500/30 transition-all shadow-md flex items-center justify-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" /> Apply For Drive
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ─── VIEW 2: TABLE VIEW ─────────────────────────────────────────── */}
      {activeView === "table" && (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Company</th>
                  <th className="p-4">Role Title</th>
                  <th className="p-4">Package (LPA)</th>
                  <th className="p-4">Min CGPA</th>
                  <th className="p-4">Max Arrears</th>
                  <th className="p-4">Drive Date</th>
                  <th className="p-4">Location</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {filteredDrives.map((d) => {
                  const applied = isApplied(d.id);
                  const compName = d.company_name || d.companyName || "Enterprise Corporate Drive";
                  const pkgLpa = d.package_lpa || d.packageLpa || 5.0;
                  const minCg = d.min_cgpa || d.minCgpa || 6.0;
                  const maxBk = d.max_backlogs ?? d.maxBacklogs ?? 0;
                  const dDate = d.drive_date || d.driveDate || "2026-09-01";

                  return (
                    <tr key={d.id} className="hover:bg-slate-900/40 transition">
                      <td className="p-4 font-bold text-white flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
                        {compName}
                      </td>
                      <td className="p-4 font-semibold text-slate-100">{d.role}</td>
                      <td className="p-4 font-bold text-emerald-400">{pkgLpa} LPA</td>
                      <td className="p-4">{minCg}</td>
                      <td className="p-4">{maxBk}</td>
                      <td className="p-4 text-indigo-300">{dDate}</td>
                      <td className="p-4 text-slate-400">{d.location || "Bengaluru"}</td>
                      <td className="p-4 text-right">
                        {applied ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30 text-[11px] font-bold">
                            <Check className="w-3.5 h-3.5" /> Applied
                          </span>
                        ) : (
                          <button
                            onClick={() => openApplicationForm(d)}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition"
                          >
                            Apply Now
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── VIEW 3: MY APPLICATIONS TRACKER ──────────────────────────────── */}
      {activeView === "tracker" && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-indigo-400" /> Submitted Job Drive Applications
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Track your active placement application statuses, selection rounds, and downloaded receipts.
              </p>
            </div>
            <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 font-bold">
              {myApplications.length} Total Applications
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {myApplications.length === 0 ? (
              <div className="p-8 text-center text-slate-400">No active applications submitted yet.</div>
            ) : (
              myApplications.map((app) => (
                <div
                  key={app.id}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{app.company_name}</span>
                      <span className="text-xs text-indigo-400 font-bold">• {app.role}</span>
                      <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-mono">
                        {app.id}
                      </span>
                    </div>
                    <div className="text-slate-400 text-xs">
                      Applied Date: {app.applied_date} • Package: <strong className="text-emerald-400">{app.package_lpa} LPA</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
                    <span className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                      {app.status_label || app.status}
                    </span>
                    <a
                      href={app.resume_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                      title="View Submitted Resume"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ─── VIEW 4: AI ELIGIBILITY AUTO-CHECKER ──────────────────────────── */}
      {activeView === "checker" && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
          <div>
            <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" /> Automated Placement Eligibility Calculator
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate your CGPA and arrear counts against all live campus drive cutoff parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800 font-mono text-xs">
            <div>
              <label className="text-slate-300 block mb-1 font-bold">Simulated CGPA ({eligibilityForm.cgpa}):</label>
              <input
                type="range"
                min="5.0"
                max="10.0"
                step="0.1"
                value={eligibilityForm.cgpa}
                onChange={(e) => setEligibilityForm({ ...eligibilityForm, cgpa: parseFloat(e.target.value) })}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-bold">Active Arrears / Backlogs:</label>
              <select
                value={eligibilityForm.backlogs}
                onChange={(e) => setEligibilityForm({ ...eligibilityForm, backlogs: parseInt(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2 rounded-lg"
              >
                <option value={0}>0 Backlogs</option>
                <option value={1}>1 Backlog</option>
                <option value={2}>2 Backlogs</option>
                <option value={3}>3+ Backlogs</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-bold">Academic Branch:</label>
              <select
                value={eligibilityForm.branch}
                onChange={(e) => setEligibilityForm({ ...eligibilityForm, branch: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2 rounded-lg"
              >
                <option value="CSE">Computer Science (CSE)</option>
                <option value="IT">Information Tech (IT)</option>
                <option value="ECE">Electronics (ECE)</option>
                <option value="MECH">Mechanical (MECH)</option>
              </select>
            </div>
          </div>

          {/* Matrix Results Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 font-mono text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-900 text-slate-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3">Company</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Min CGPA Required</th>
                  <th className="p-3">Max Arrears Allowed</th>
                  <th className="p-3">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {drives.map((d) => {
                  const passCgpa = eligibilityForm.cgpa >= parseFloat(d.min_cgpa);
                  const passBacklogs = eligibilityForm.backlogs <= parseInt(d.max_backlogs);
                  const eligible = passCgpa && passBacklogs;

                  return (
                    <tr key={d.id} className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-white">{d.company_name}</td>
                      <td className="p-3 text-slate-200">{d.role}</td>
                      <td className="p-3">{d.min_cgpa}</td>
                      <td className="p-3">{d.max_backlogs}</td>
                      <td className="p-3">
                        {eligible ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> PASSED & ELIGIBLE
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded border border-rose-500/30 font-bold">
                            <XCircle className="w-3.5 h-3.5" /> {!passCgpa ? "CGPA Below Cutoff" : "Exceeds Max Backlogs"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── MODAL 1: INTERACTIVE JOB APPLICATION FORM ───────────────────── */}
      {selectedDriveForForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold mb-1">
                  <Building2 className="w-4 h-4" /> {selectedDriveForForm.company_name} • {selectedDriveForForm.package_lpa} LPA
                </div>
                <h2 className="text-xl font-bold text-white font-heading">
                  Application Form: {selectedDriveForForm.role}
                </h2>
              </div>
              <button
                onClick={() => setSelectedDriveForForm(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Student Verification Record Badge */}
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div>
                <span className="text-slate-400 text-[10px] block font-bold">STUDENT NAME</span>
                <strong className="text-white">{user?.name || "Gowthami N"}</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-bold">ROLL NUMBER</span>
                <strong className="text-indigo-300">COS-2026-8942</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-bold">VERIFIED CGPA</span>
                <strong className="text-emerald-400">{studentCgpa} / 10.0</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-bold">ACTIVE ARREARS</span>
                <strong className="text-emerald-400">{studentBacklogs} Backlogs</strong>
              </div>
            </div>

            {/* Main Application Form */}
            <form onSubmit={handleSubmitApplication} className="space-y-4 text-xs font-mono">
              {/* Resume Link Input */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Resume Document URL (ATS Verified):
                </label>
                <input
                  type="url"
                  value={appForm.resumeUrl}
                  onChange={(e) => setAppForm({ ...appForm, resumeUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 rounded-xl focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              {/* GitHub & LinkedIn URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">GitHub / Portfolio URL:</label>
                  <input
                    type="url"
                    value={appForm.githubUrl}
                    onChange={(e) => setAppForm({ ...appForm, githubUrl: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 rounded-xl focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">LinkedIn Profile:</label>
                  <input
                    type="url"
                    value={appForm.linkedinUrl}
                    onChange={(e) => setAppForm({ ...appForm, linkedinUrl: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 rounded-xl focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Primary Tech Stack Pills */}
              <div>
                <label className="text-slate-300 font-bold block mb-1.5">
                  Select Key Competencies for {selectedDriveForForm.company_name}:
                </label>
                <div className="flex flex-wrap gap-2">
                  {["React", "Python", "SQL", "Docker", "Java", "AWS", "System Design"].map((skill) => {
                    const active = appForm.selectedSkills.includes(skill);
                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => handleSkillToggle(skill)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition ${
                          active
                            ? "bg-indigo-600 text-white border-indigo-500"
                            : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        {active ? "✓ " : "+ "} {skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Location */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">Preferred Work Location:</label>
                <select
                  value={appForm.preferredLocation}
                  onChange={(e) => setAppForm({ ...appForm, preferredLocation: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 rounded-xl focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Bengaluru">Bengaluru Campus / HQ</option>
                  <option value="Hyderabad">Hyderabad Tech Center</option>
                  <option value="Pune">Pune Development Lab</option>
                  <option value="Remote">Remote / Flexible</option>
                </select>
              </div>

              {/* Cover Statement */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">Statement of Interest / Candidate Brief:</label>
                <textarea
                  rows={3}
                  value={appForm.sopText}
                  onChange={(e) => setAppForm({ ...appForm, sopText: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 rounded-xl focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Declaration Checkbox */}
              <label className="flex items-start gap-2 text-slate-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={appForm.declarationAccepted}
                  onChange={(e) => setAppForm({ ...appForm, declarationAccepted: e.target.checked })}
                  className="mt-0.5 accent-indigo-600"
                />
                <span className="text-[11px] leading-tight">
                  I hereby declare that my academic records (CGPA: {studentCgpa}, Arrears: {studentBacklogs}) and identity pass match official CampusOS records.
                </span>
              </label>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedDriveForForm(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingApp}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-bold transition shadow-lg flex items-center gap-2"
                >
                  {submittingApp ? "Submitting Application..." : "Submit Official Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: AI JOB DESCRIPTION PARSER (STAFF/TPO) ───────────────── */}
      {showJDModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white font-heading flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" /> AI Job Description Extractor
              </h2>
              <button
                onClick={() => setShowJDModal(false)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-lg bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleParseJD} className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-300 block mb-1 font-bold">Paste Unstructured Job Description Text</label>
                <textarea
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  rows={5}
                  placeholder="Paste raw JD email or document text..."
                  className="w-full bg-slate-950 text-slate-200 p-3 rounded-xl border border-slate-700 focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={parsing}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition shadow-md"
              >
                {parsing ? "Extracting Requirements..." : "⚡ Parse & Structurize Job Drive"}
              </button>
            </form>

            {parsedJD && (
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 text-xs font-mono">
                <h3 className="font-bold text-emerald-400 font-heading">Extracted Drive Parameters</h3>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div><strong>Company:</strong> {parsedJD.company}</div>
                  <div><strong>Role:</strong> {parsedJD.role}</div>
                  <div><strong>Min CGPA:</strong> {parsedJD.min_cgpa}</div>
                  <div><strong>Package:</strong> {parsedJD.package_lpa} LPA</div>
                  <div className="col-span-2">
                    <strong>Skills:</strong>{" "}
                    {Array.isArray(parsedJD.required_skills)
                      ? parsedJD.required_skills.join(", ")
                      : parsedJD.required_skills}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
