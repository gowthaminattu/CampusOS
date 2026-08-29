// src/components/PerformanceUI.jsx
// Academic Performance & ML Risk Analysis Visualization

import React, { useState } from "react";
import { Award, Brain, Info, HelpCircle, CheckCircle2, TrendingUp, AlertCircle, X } from "lucide-react";

const SUBJECT_PERFORMANCE = [
  { subject: "Data Structures & Algorithms", code: "CS301", grade: "A+", points: 10, gpa: 9.6, status: "Excellent" },
  { subject: "Database Management Systems", code: "CS302", grade: "A", points: 9, gpa: 8.8, status: "Good" },
  { subject: "Digital Electronics", code: "CS303", grade: "B+", points: 8, gpa: 7.6, status: "Average" },
  { subject: "Operating Systems", code: "CS304", grade: "A", points: 9, gpa: 9.0, status: "Good" },
  { subject: "Full Stack Development", code: "CS305", grade: "O", points: 10, gpa: 9.8, status: "Outstanding" },
];

export default function PerformanceUI() {
  const [showWhyModal, setShowWhyModal] = useState(false);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-heading">
            Academic Performance & Intelligence
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Grade analytics, CGPA trajectory, and AI-predicted academic performance risk.
          </p>
        </div>
      </div>

      {/* Top Metrics Row: GPA, CGPA, ML Risk Prediction */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current GPA */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">CURRENT SEMESTER GPA</span>
            <Award className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="mt-4">
            <div className="text-4xl font-extrabold text-white font-heading">8.70</div>
            <div className="text-xs text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +0.27 higher than Sem V
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex justify-between">
            <span>Rank: <strong>4th / 120</strong></span>
            <span>Credits: <strong>24 / 24</strong></span>
          </div>
        </div>

        {/* Cumulative CGPA */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">CUMULATIVE CGPA</span>
            <TrendingUp className="w-5 h-5 text-sky-400" />
          </div>
          <div className="mt-4">
            <div className="text-4xl font-extrabold text-white font-heading">8.43</div>
            <div className="text-xs text-slate-400 font-semibold mt-1">
              Consistent First Class with Distinction
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex justify-between">
            <span>Total Credits: <strong>132</strong></span>
            <span>Backlogs: <strong className="text-emerald-400">0</strong></span>
          </div>
        </div>

        {/* ML Performance Risk Card */}
        <div className="glass-panel rounded-2xl p-6 border-indigo-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-indigo-400" /> ML PERFORMANCE RISK
            </span>
            <button
              onClick={() => setShowWhyModal(true)}
              className="text-xs text-indigo-400 hover:text-indigo-200 flex items-center gap-1 font-semibold underline underline-offset-2"
            >
              Why? <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" /> LOW RISK
            </div>
            <div className="text-xs text-slate-300 mt-2 font-mono">
              Model Confidence: <strong className="text-white">87%</strong>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
            High probability of securing &gt;8.5 GPA based on assignment scores and attendance.
          </div>
        </div>
      </div>

      {/* Subject Performance Breakdown */}
      <div className="glass-panel rounded-2xl p-6">
        <h3 className="text-base font-bold text-white font-heading mb-4">
          Subject Grade & Performance Breakdown
        </h3>
        <div className="space-y-4">
          {SUBJECT_PERFORMANCE.map((item) => (
            <div key={item.code} className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                    {item.code}
                  </span>
                  <h4 className="text-sm font-bold text-white">{item.subject}</h4>
                </div>
                <div className="text-xs text-slate-400 mt-1">Predicted Score: {item.gpa * 10}%</div>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-32">
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 rounded-full"
                      style={{ width: `${item.gpa * 10}%` }}
                    />
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-extrabold text-white">{item.grade}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{item.gpa} / 10</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* "Why?" Factors Explanation Modal */}
      {showWhyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-indigo-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
                <Brain className="w-4 h-4 text-indigo-400" /> ML Model Risk Factors Explanation
              </h3>
              <button onClick={() => setShowWhyModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Our Academic Performance ML model evaluates student risk based on historical data, continuous assessments, and attendance velocity.
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-200">High Attendance Velocity (86%)</div>
                  <div className="text-slate-400 text-[11px]">Regular lecture attendance correlates strongly with exam performance.</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-200">Mid-Term Exam Score (91%)</div>
                  <div className="text-slate-400 text-[11px]">Consistently top marks in core Computer Science courses.</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-200">Digital Electronics Attention Needed</div>
                  <div className="text-slate-400 text-[11px]">Slight dip in lab practical submissions in CS303.</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowWhyModal(false)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition"
            >
              Got it, close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
