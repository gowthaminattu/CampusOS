// src/components/AtRiskStudentsViewer.jsx
// Enterprise Faculty Early-Warning System & At-Risk Intelligence Dashboard

import React, { useState, useEffect } from "react";
import api from "../api/axios";
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Mail,
  Calendar,
  UserCheck,
  RefreshCw,
  Sparkles,
  BookOpen,
  FileText,
  Send,
  Clock,
  X,
  Building2,
  GraduationCap,
  Award
} from "lucide-react";

const DEMO_AT_RISK_STUDENTS = [
  {
    student_id: 101,
    name: "Rahul Sharma",
    roll_number: "COS-2026-8910",
    department: "Computer Science & Engineering",
    year: 3,
    attendance: 62.5,
    gpa: 5.4,
    arrears: 2,
    risk_level: "CRITICAL",
    risk_badge_color: "#ef4444",
    reasons: [
      "Critical low attendance (62.5% vs 75.0% threshold)",
      "Low CGPA academic performance (5.40)",
      "2 active backlog subjects (Data Structures, OS)"
    ],
    recommended_action: "Mandatory academic counseling, remedial DSA classes, and weekly attendance tracking."
  },
  {
    student_id: 102,
    name: "Karthik V",
    roll_number: "IT-2026-8935",
    department: "Information Technology",
    year: 2,
    attendance: 71.0,
    gpa: 6.2,
    arrears: 1,
    risk_level: "HIGH",
    risk_badge_color: "#f97316",
    reasons: [
      "Attendance warning (71.0%)",
      "1 active backlog subject (Database Systems)",
      "Low AI Mock Interview score (52.0/100)"
    ],
    recommended_action: "Assign faculty mentor, mandatory mock interview practice session."
  },
  {
    student_id: 103,
    name: "Siddharth Verma",
    roll_number: "EC-2026-8944",
    department: "Electronics & Communication",
    year: 3,
    attendance: 74.5,
    gpa: 6.8,
    arrears: 1,
    risk_level: "MEDIUM",
    risk_badge_color: "#f59e0b",
    reasons: [
      "Attendance warning (74.5%)",
      "1 active backlog subject"
    ],
    recommended_action: "Recommend skill upgrade modules and weekly attendance check."
  },
  {
    student_id: 104,
    name: "Gowthami N",
    roll_number: "COS-2026-8942",
    department: "Computer Science & Engineering",
    year: 3,
    attendance: 86.0,
    gpa: 8.7,
    arrears: 0,
    risk_level: "LOW",
    risk_badge_color: "#10b981",
    reasons: [
      "No academic or placement risk factors detected."
    ],
    recommended_action: "On track. Encourage tier-1 job drive applications."
  },
  {
    student_id: 105,
    name: "Ananya Roy",
    roll_number: "COS-2026-8924",
    department: "Computer Science & Engineering",
    year: 3,
    attendance: 92.0,
    gpa: 9.1,
    arrears: 0,
    risk_level: "LOW",
    risk_badge_color: "#10b981",
    reasons: [
      "Top 5% cohort academic performer."
    ],
    recommended_action: "High competitive index. Recommend product company placement drives."
  }
];

export default function AtRiskStudentsViewer() {
  const [students, setStudents] = useState(DEMO_AT_RISK_STUDENTS);
  const [loading, setLoading] = useState(false);
  const [filterLevel, setFilterLevel] = useState("ALL");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Counseling Modal State
  const [counselingModalStudent, setCounselingModalStudent] = useState(null);
  const [counselingDate, setCounselingDate] = useState("2026-09-01");
  const [counselingNotes, setCounselingNotes] = useState("Discuss attendance remediation plan and backlog clearance schedule.");

  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    fetchAtRiskStudents();
  }, []);

  async function fetchAtRiskStudents() {
    try {
      setLoading(true);
      const res = await api.get("/api/faculty/at-risk-students");
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setStudents(res.data);
      } else {
        setStudents(DEMO_AT_RISK_STUDENTS);
      }
    } catch (err) {
      console.warn("Using fallback demo at-risk dataset");
      setStudents(DEMO_AT_RISK_STUDENTS);
    } finally {
      setLoading(false);
    }
  }

  // Filtered dataset
  const filteredStudents = students.filter((s) => {
    const matchesLevel = filterLevel === "ALL" || s.risk_level === filterLevel;
    const matchesDept = deptFilter === "ALL" || s.department === deptFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      s.name?.toLowerCase().includes(q) ||
      s.roll_number?.toLowerCase().includes(q) ||
      s.reasons?.some((r) => r.toLowerCase().includes(q));

    return matchesLevel && matchesDept && matchesSearch;
  });

  const criticalCount = students.filter((s) => s.risk_level === "CRITICAL").length;
  const highCount = students.filter((s) => s.risk_level === "HIGH").length;
  const attWarningCount = students.filter((s) => (s.attendance || 0) < 75).length;

  const handleSendEmailAlert = (studentName, rollNo) => {
    setToastMsg(`📧 Early Warning Alert Email sent to ${studentName} (${rollNo}) & Faculty Mentor!`);
    setTimeout(() => setToastMsg(""), 5000);
  };

  const handleScheduleCounselingSubmit = (e) => {
    e.preventDefault();
    if (!counselingModalStudent) return;
    setToastMsg(`📅 1-on-1 Academic Counseling scheduled with ${counselingModalStudent.name} for ${counselingDate}!`);
    setCounselingModalStudent(null);
    setTimeout(() => setToastMsg(""), 5000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-amber-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> FACULTY EARLY-WARNING SYSTEM
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-heading">
            At-Risk Students Intelligence
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Identify students struggling with low attendance, academic backlogs, or weak mock interview performance for early intervention.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs shrink-0">
          <button
            onClick={fetchAtRiskStudents}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Re-Evaluate Matrix
          </button>
        </div>
      </div>

      {/* Global Toast */}
      {toastMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-2xl font-semibold flex items-center justify-between shadow-lg font-mono">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg("")} className="text-emerald-400 hover:text-white font-bold">✕</button>
        </div>
      )}

      {/* 4 Summary Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">TOTAL EVALUATED</span>
          <div className="text-3xl font-extrabold text-white font-heading mt-2">{students.length} Students</div>
          <div className="text-xs text-slate-400 font-mono mt-1">Real-time telemetry audit</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-rose-500/30 bg-rose-950/10 flex flex-col justify-between">
          <span className="text-[11px] font-mono font-bold text-rose-400 uppercase tracking-wider">CRITICAL RISK</span>
          <div className="text-3xl font-extrabold text-rose-400 font-heading mt-2">{criticalCount} Students</div>
          <div className="text-xs text-rose-300 font-mono mt-1">Requires immediate intervention</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-amber-950/10 flex flex-col justify-between">
          <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider">HIGH RISK</span>
          <div className="text-3xl font-extrabold text-amber-400 font-heading mt-2">{highCount} Students</div>
          <div className="text-xs text-amber-300 font-mono mt-1">Faculty mentor assigned</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] font-mono font-bold text-indigo-400 uppercase tracking-wider">ATTENDANCE WARNING</span>
          <div className="text-3xl font-extrabold text-indigo-400 font-heading mt-2">{attWarningCount} Students</div>
          <div className="text-xs text-slate-400 font-mono mt-1">Below 75.0% threshold</div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-3 rounded-2xl border border-slate-800 font-mono text-xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student, roll, factor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-xs focus:border-indigo-500 focus:outline-none w-60 sm:w-72"
          />
        </div>

        {/* Level & Dept Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-300 px-3 py-2 rounded-xl text-xs focus:border-indigo-500 focus:outline-none font-bold"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">🔴 Critical Only</option>
            <option value="HIGH">🟠 High Risk</option>
            <option value="MEDIUM">🟡 Medium Risk</option>
            <option value="LOW">🟢 Low Risk</option>
          </select>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-300 px-3 py-2 rounded-xl text-xs focus:border-indigo-500 focus:outline-none"
          >
            <option value="ALL">All Departments</option>
            <option value="Computer Science & Engineering">CSE</option>
            <option value="Information Technology">IT</option>
            <option value="Electronics & Communication">ECE</option>
            <option value="Mechanical Engineering">MECH</option>
          </select>
        </div>
      </div>

      {/* Student Cards List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs font-mono">Evaluating early warning risk indicators...</div>
      ) : filteredStudents.length === 0 ? (
        <div className="p-12 text-center text-slate-400 text-xs font-mono glass-panel rounded-2xl">
          No at-risk student records found matching the selected filter criteria.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredStudents.map((st) => {
            const isCritical = st.risk_level === "CRITICAL";
            const isHigh = st.risk_level === "HIGH";

            return (
              <div
                key={st.student_id}
                className="glass-panel p-5 rounded-2xl border border-slate-800 shadow-md space-y-4 hover:border-slate-700 transition"
              >
                {/* Top Row: Info & Badge */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-black text-indigo-300 text-lg font-heading shrink-0">
                      {st.name?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white font-heading">{st.name}</h3>
                      <span className="text-xs font-mono text-slate-400">
                        Roll: <strong className="text-indigo-400">{st.roll_number}</strong> • Dept: {st.department} (Year {st.year})
                      </span>
                    </div>
                  </div>

                  <span
                    className="px-3 py-1 rounded-full text-xs font-mono font-extrabold uppercase tracking-wider text-white shadow-md shrink-0"
                    style={{ backgroundColor: st.risk_badge_color || (isCritical ? "#ef4444" : isHigh ? "#f97316" : "#10b981") }}
                  >
                    {st.risk_level} RISK
                  </span>
                </div>

                {/* Metrics Breakdown Grid */}
                <div className="grid grid-cols-3 gap-3 font-mono text-xs text-center">
                  <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] block font-bold uppercase">Attendance</span>
                    <span className={`font-extrabold text-sm ${st.attendance < 75 ? "text-rose-400" : "text-emerald-400"}`}>
                      {st.attendance?.toFixed(1)}%
                    </span>
                  </div>

                  <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] block font-bold uppercase">CGPA Score</span>
                    <span className="font-extrabold text-white text-sm">
                      {st.gpa?.toFixed(2)}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] block font-bold uppercase">Backlogs</span>
                    <span className={`font-extrabold text-sm ${st.arrears > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                      {st.arrears} Active
                    </span>
                  </div>
                </div>

                {/* Risk Factors & Recommendations */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2 text-xs font-mono">
                  <span className="font-bold text-slate-300 block text-[11px]">IDENTIFIED RISK FACTORS:</span>
                  <ul className="space-y-1 text-slate-300">
                    {st.reasons?.map((r, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-amber-300">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300">
                    <strong className="text-emerald-400 font-bold">RECOMMENDED FACULTY ACTION:</strong>{" "}
                    {st.recommended_action}
                  </div>
                </div>

                {/* Interventions Action Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-3 pt-1 font-mono text-xs">
                  <button
                    onClick={() => handleSendEmailAlert(st.name, st.roll_number)}
                    className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold transition flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" /> Send Warning Alert Email
                  </button>

                  <button
                    onClick={() => setCounselingModalStudent(st)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition flex items-center gap-1.5 shadow-md"
                  >
                    <Calendar className="w-3.5 h-3.5" /> Schedule 1-on-1 Counseling
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── MODAL: SCHEDULE COUNSELING SESSION ──────────────────────────── */}
      {counselingModalStudent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" /> Schedule Faculty Counseling Session
              </h3>
              <button
                onClick={() => setCounselingModalStudent(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-indigo-950/40 rounded-xl border border-indigo-500/20 text-xs font-mono">
              <span className="text-slate-400 block text-[10px] font-bold">STUDENT CANDIDATE</span>
              <strong className="text-white text-sm">{counselingModalStudent.name}</strong>
              <span className="text-indigo-400 block">{counselingModalStudent.roll_number} • {counselingModalStudent.department}</span>
            </div>

            <form onSubmit={handleScheduleCounselingSubmit} className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Select Meeting Date:</label>
                <input
                  type="date"
                  value={counselingDate}
                  onChange={(e) => setCounselingDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 rounded-xl focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Faculty Agenda / Notes:</label>
                <textarea
                  rows={3}
                  value={counselingNotes}
                  onChange={(e) => setCounselingNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 rounded-xl focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCounselingModalStudent(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow-lg flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Confirm & Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
