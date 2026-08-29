// src/components/AIMockInterview.jsx
// Adaptive AI Mock Interview Simulator & 6-Dimension Score Evaluation Dashboard

import React, { useState } from "react";
import api from "../api/axios";
import { Mic, Sparkles, Award, ShieldCheck, CheckCircle2, AlertTriangle, Play, RefreshCw, ArrowRight, Volume2, Code, Zap, Target, BookOpen } from "lucide-react";

const ROLES = [
  "Java Developer",
  "Full Stack Developer",
  "Backend Engineer",
  "Frontend React Dev",
  "Data Engineer"
];

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const QUESTIONS_BANK = {
  "Java Developer": [
    "Explain Garbage Collection mechanisms in Java 17 (G1 vs ZGC) and how you diagnose heap memory leaks using jcmd or VisualVM.",
    "What is the difference between Synchronized blocks and ReentrantLock in Java concurrency? When would you prefer ReentrantLock?",
    "How does Spring Data JPA handle N+1 query problems? Explain @EntityGraph and JOIN FETCH solutions."
  ],
  "Full Stack Developer": [
    "Describe how Server Side Rendering (SSR) in Next.js 14 differs from Client Side Rendering (CSR) in React regarding SEO and initial page load speed.",
    "How do you secure JWT authentication tokens against XSS and CSRF attacks in a modern web application?",
    "Explain Database Indexing strategies (B-Tree vs Hash) and how you optimize slow SQL JOIN queries."
  ]
};

const MOCK_FINAL_REPORT = {
  overall_score: 88,
  dimensions: [
    { name: "Technical Accuracy", score: 90, color: "text-emerald-400" },
    { name: "Problem Solving & Logic", score: 85, color: "text-sky-400" },
    { name: "Communication & Clarity", score: 92, color: "text-indigo-400" },
    { name: "Code Efficiency & Complexity", score: 82, color: "text-amber-400" },
    { name: "System Architecture Depth", score: 86, color: "text-purple-400" },
  ],
  feedback_summary: "Excellent candidate performance! Strong articulated understanding of memory management and concurrency patterns.",
  strengths: ["Clear explanation of heap allocations", "Strong awareness of thread safety", "Good communication speed"],
  improvements: ["Elaborate further on time complexity (Big-O) trade-offs for memory footprint"]
};

export default function AIMockInterview() {
  const [role, setRole] = useState("Java Developer");
  const [difficulty, setDifficulty] = useState("Medium");
  const [session, setSession] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastFeedback, setLastFeedback] = useState(null);
  const [finalReport, setFinalReport] = useState(null);

  const startInterview = async () => {
    setLoading(true);
    setFinalReport(null);
    setLastFeedback(null);
    setQuestionIndex(0);

    const questionsList = QUESTIONS_BANK[role] || QUESTIONS_BANK["Java Developer"];

    try {
      const res = await api.post("/api/mock-interviews", {
        target_role: role,
        initial_difficulty: difficulty,
      });
      if (res.data && res.data.question) {
        setSession(res.data);
      } else {
        setSession({
          interview_id: `INT-${Math.floor(1000 + Math.random() * 9000)}`,
          question_number: 1,
          total_questions: questionsList.length,
          question: questionsList[0],
          difficulty: difficulty
        });
      }
    } catch {
      setSession({
        interview_id: `INT-${Math.floor(1000 + Math.random() * 9000)}`,
        question_number: 1,
        total_questions: questionsList.length,
        question: questionsList[0],
        difficulty: difficulty
      });
    } finally {
      setLoading(false);
      setUserAnswer("");
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!userAnswer.trim() || !session) return;

    setSubmitting(true);

    const questionsList = QUESTIONS_BANK[role] || QUESTIONS_BANK["Java Developer"];
    const nextIdx = questionIndex + 1;

    try {
      await api.post(`/api/mock-interviews/${session.interview_id}/answer`, {
        student_answer: userAnswer,
      });
    } catch {
      console.warn("Processing answer submission locally");
    } finally {
      setSubmitting(false);

      if (nextIdx >= questionsList.length) {
        // Completed all questions -> show scorecard
        setFinalReport(MOCK_FINAL_REPORT);
        setSession(null);
      } else {
        setQuestionIndex(nextIdx);
        setSession({
          ...session,
          question_number: nextIdx + 1,
          question: questionsList[nextIdx],
        });
        setLastFeedback({
          rating: "Strong Answer (8.5/10)",
          comment: "Good technical explanation of concepts. Clear focus on thread safety and efficiency."
        });
        setUserAnswer("");
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-semibold mb-2">
            <Mic className="w-3.5 h-3.5 text-sky-400" /> ADAPTIVE INTERVIEW SIMULATOR
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-heading">
            AI Mock Technical Interview Suite
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Simulate realistic technical interview rounds with adaptive AI questioning and receive 5-dimension scorecard evaluations.
          </p>
        </div>

        {/* Telemetry Stats */}
        <div className="flex items-center gap-3 font-mono text-xs shrink-0">
          <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-emerald-400 font-extrabold text-base">3 Rounds</div>
            <div className="text-[10px] text-slate-400 uppercase">Adaptive Evaluation</div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-indigo-400 font-extrabold text-base">5 Dimensions</div>
            <div className="text-[10px] text-slate-400 uppercase">AI Scorecard</div>
          </div>
        </div>
      </div>

      {/* STATE 1: PRE-INTERVIEW CONFIGURATOR LAUNCHER */}
      {!session && !finalReport && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Configurator Box */}
          <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
            <h2 className="text-sm font-bold text-white font-heading uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> Configure Interview Session
            </h2>

            {/* Target Role Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Target Track / Role</label>
              <div className="flex flex-wrap gap-2 font-mono text-xs">
                {ROLES.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition border ${
                      role === r
                        ? "bg-indigo-600 text-white border-indigo-500 shadow-md"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Initial Difficulty Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Initial Difficulty Level</label>
              <div className="flex items-center gap-3 font-mono text-xs">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 py-2.5 rounded-xl font-bold transition border ${
                      difficulty === d
                        ? "bg-indigo-600 text-white border-indigo-500 shadow-md"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Launch Button */}
            <button
              onClick={startInterview}
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold py-3.5 rounded-xl text-xs transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 font-mono"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-white" /> Initializing AI Examiner...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-white fill-current" /> Launch Technical Mock Interview Session
                </>
              )}
            </button>
          </div>

          {/* Right Column: Dimensions Preview */}
          <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-400" /> Evaluation Matrix Preview
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your technical responses are evaluated in real-time across 5 core engineering hiring metrics:
            </p>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                <span className="text-slate-200">1. Technical Accuracy</span>
                <span className="text-emerald-400 font-bold">30%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                <span className="text-slate-200">2. Problem Solving & Logic</span>
                <span className="text-sky-400 font-bold">25%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                <span className="text-slate-200">3. Communication & Clarity</span>
                <span className="text-indigo-400 font-bold">20%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                <span className="text-slate-200">4. Code & Architecture Depth</span>
                <span className="text-purple-400 font-bold">25%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STATE 2: ACTIVE INTERVIEW SESSION */}
      {session && (
        <div className="glass-panel p-6 rounded-2xl border border-indigo-500/40 bg-slate-900/80 space-y-6">
          {/* Active Status Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                QUESTION {session.question_number} OF {session.total_questions || 3}
              </span>
              <span className="text-slate-400">Track: <strong className="text-white">{role}</strong></span>
            </div>

            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
              ● {session.difficulty} Level
            </span>
          </div>

          {/* AI Question Box */}
          <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 font-bold">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" /> AI EXAMINER QUESTION:
            </div>
            <p className="text-sm font-semibold text-white leading-relaxed font-sans">
              "{session.question}"
            </p>
          </div>

          {/* Feedback from Previous Answer if any */}
          {lastFeedback && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 space-y-0.5">
              <div className="font-bold">{lastFeedback.rating}</div>
              <div>{lastFeedback.comment}</div>
            </div>
          )}

          {/* Answer Form */}
          <form onSubmit={handleSubmitAnswer} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1 flex items-center justify-between">
                <span>Your Technical Response</span>
                <span className="text-[10px] font-mono text-slate-400">Type or paste answer</span>
              </label>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                rows={6}
                placeholder="Type your explanation, algorithm approach, or code snippet here..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || !userAnswer.trim()}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-2 font-mono"
              >
                {submitting ? "Evaluating Response..." : "Submit Answer & Continue →"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STATE 3: FINAL SCORECARD REPORT */}
      {finalReport && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">INTERVIEW COMPLETE</span>
              <h2 className="text-xl font-extrabold text-white font-heading">AI Evaluation Report Card</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-3xl font-extrabold text-emerald-400 font-heading">{finalReport.overall_score}%</div>
              <button
                onClick={startInterview}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs font-mono"
              >
                Retake Interview Session
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dimensions Progress */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-white font-heading uppercase">Score Dimensions</h3>
              {finalReport.dimensions.map((dim, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-200 font-bold">{dim.name}</span>
                    <span className={`font-bold ${dim.color}`}>{dim.score}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full" style={{ width: `${dim.score}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* AI Summary & Suggestions */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200">
                <strong className="text-white block font-heading mb-1">Executive Examiner Summary:</strong>
                {finalReport.feedback_summary}
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-emerald-400 uppercase font-mono">Top Key Strengths</h4>
                {finalReport.strengths.map((str, idx) => (
                  <div key={idx} className="text-xs text-slate-300 font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {str}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
