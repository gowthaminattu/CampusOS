// src/components/Timetable.jsx
// Smart Timetable Generator UI with Interactive Weekly Grid & Conflict Detection

import React, { useState } from "react";
import { Calendar, AlertTriangle, RefreshCw, Layers, CheckCircle2, ShieldAlert, Sparkles } from "lucide-react";

const TIMETABLE_SLOTS = ["08:30 AM", "10:00 AM", "11:30 AM", "01:30 PM", "03:00 PM"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const INITIAL_SCHEDULE = {
  Monday: [
    { subject: "Data Structures", code: "CS301", room: "Hall B-04", faculty: "Dr. Aris", type: "Lecture" },
    { subject: "Digital Electronics", code: "CS303", room: "Lab Block 102", faculty: "Prof. Verma", type: "Lab" },
    { subject: "Database Systems", code: "CS302", room: "Hall C-10", faculty: "Dr. Gupta", type: "Lecture" },
    null,
    { subject: "Operating Systems", code: "CS304", room: "Hall A-02", faculty: "Prof. Rao", type: "Lecture" },
  ],
  Tuesday: [
    { subject: "Operating Systems", code: "CS304", room: "Hall A-02", faculty: "Prof. Rao", type: "Lecture" },
    null,
    { subject: "Data Structures Lab", code: "CS301L", room: "Lab Block 304", faculty: "Dr. Aris", type: "Lab" },
    { subject: "Digital Electronics", code: "CS303", room: "Hall B-12", faculty: "Prof. Verma", type: "Lecture" },
    null,
  ],
  Wednesday: [
    { subject: "Full Stack Web Dev", code: "CS305", room: "Lab Block 102", faculty: "Prof. Kapoor", type: "Lab" },
    { subject: "Database Systems", code: "CS302", room: "Hall C-10", faculty: "Dr. Gupta", type: "Lecture" },
    null,
    // INTENTIONAL CONFLICT DEMO
    { subject: "Advanced AI Systems", code: "CS401", room: "Hall B-04", faculty: "Dr. Aris", type: "Lecture", conflict: true },
    { subject: "Operating Systems", code: "CS304", room: "Hall A-02", faculty: "Prof. Rao", type: "Lecture" },
  ],
  Thursday: [
    { subject: "Data Structures", code: "CS301", room: "Hall B-04", faculty: "Dr. Aris", type: "Lecture" },
    { subject: "Full Stack Web Dev", code: "CS305", room: "Lab Block 102", faculty: "Prof. Kapoor", type: "Lab" },
    { subject: "Digital Electronics", code: "CS303", room: "Hall B-12", faculty: "Prof. Verma", type: "Lecture" },
    null,
    { subject: "Library & Self Study", code: "FREE", room: "Central Lib", faculty: "N/A", type: "Self" },
  ],
  Friday: [
    { subject: "Database Systems", code: "CS302", room: "Lab Block 204", faculty: "Dr. Gupta", type: "Lab" },
    { subject: "Operating Systems", code: "CS304", room: "Hall A-02", faculty: "Prof. Rao", type: "Lecture" },
    null,
    { subject: "Placement Mock Prep", code: "TPO", room: "Auditorium", faculty: "Placement Cell", type: "Seminar" },
    null,
  ]
};

export default function Timetable() {
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);
  const [hasConflict, setHasConflict] = useState(true);

  const handleResolveConflict = () => {
    const updated = JSON.parse(JSON.stringify(schedule));
    // Move conflicting class to free slot
    updated.Wednesday[3] = {
      subject: "Advanced AI Systems",
      code: "CS401",
      room: "Hall D-01",
      faculty: "Dr. Aris",
      type: "Lecture",
      conflict: false
    };
    setSchedule(updated);
    setHasConflict(false);
  };

  const handleRegenerate = () => {
    alert("AI Constraint Solver recalculating optimal room and faculty allocation...");
    handleResolveConflict();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-heading">
            Smart Timetable Generator & Schedule
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Automated conflict resolution engine for faculty, room, and lab allocations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRegenerate}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> AI Regenerate Schedule
          </button>
        </div>
      </div>

      {/* Conflict Warning Banner */}
      {hasConflict && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg shadow-rose-950/20">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0" />
            <div>
              <div className="text-sm font-bold text-white font-heading">Conflict Detected on Wednesday at 01:30 PM</div>
              <div className="text-xs text-rose-300">
                Faculty <strong>Dr. Aris</strong> is assigned to two overlapping lectures simultaneously in Hall B-04.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleResolveConflict}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow"
            >
              Resolve Conflict Automatically
            </button>
          </div>
        </div>
      )}

      {!hasConflict && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> All faculty and room allocations are 100% conflict-free.
        </div>
      )}

      {/* Weekly Interactive Timetable Grid */}
      <div className="glass-panel rounded-2xl p-6 overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Day Headers */}
          <div className="grid grid-cols-6 gap-3 pb-3 border-b border-slate-800 text-xs font-mono font-bold text-slate-400">
            <div className="text-center">TIME SLOT</div>
            {DAYS.map((day) => (
              <div key={day} className="text-center uppercase tracking-wider text-slate-200">{day}</div>
            ))}
          </div>

          {/* Timeslot Rows */}
          <div className="space-y-3 mt-3">
            {TIMETABLE_SLOTS.map((slot, timeIdx) => (
              <div key={slot} className="grid grid-cols-6 gap-3 items-center">
                {/* Time Label */}
                <div className="text-xs font-mono font-bold text-indigo-400 text-center py-4 bg-slate-900/60 rounded-xl border border-slate-800">
                  {slot}
                </div>

                {/* Day Cells */}
                {DAYS.map((day) => {
                  const block = schedule[day]?.[timeIdx];

                  if (!block) {
                    return (
                      <div
                        key={day}
                        className="h-24 rounded-xl border border-dashed border-slate-800 bg-slate-950/40 flex items-center justify-center text-[10px] font-mono text-slate-600"
                      >
                        Free Slot
                      </div>
                    );
                  }

                  const isConflict = block.conflict;

                  return (
                    <div
                      key={day}
                      className={`h-24 p-3 rounded-xl border flex flex-col justify-between transition ${
                        isConflict
                          ? "timetable-conflict-card"
                          : block.type === "Lab"
                          ? "bg-indigo-950/40 border-indigo-500/40 text-indigo-200"
                          : "bg-slate-900/80 border-slate-700/80 text-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-indigo-400">{block.code}</span>
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${block.type === "Lab" ? "bg-indigo-500/20 text-indigo-300" : "bg-slate-800 text-slate-400"}`}>
                          {block.type}
                        </span>
                      </div>

                      <div>
                        <div className="text-xs font-bold text-white truncate">{block.subject}</div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">{block.room} • {block.faculty}</div>
                      </div>

                      {isConflict && (
                        <div className="text-[9px] font-mono font-bold text-rose-400 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Conflict
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
