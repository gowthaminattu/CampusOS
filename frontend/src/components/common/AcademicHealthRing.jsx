// src/components/common/AcademicHealthRing.jsx
// Radial progress ring for Academic & Attendance Health

import React from "react";

export default function AcademicHealthRing({ percentage = 86, size = 160, strokeWidth = 12 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let colorClass = "#10B981"; // emerald for >80
  let statusText = "Good Attendance";
  let statusBg = "rgba(16, 185, 129, 0.15)";
  let statusBorder = "rgba(16, 185, 129, 0.3)";

  if (percentage < 75) {
    colorClass = "#EF4444"; // red
    statusText = "Critical Risk";
    statusBg = "rgba(239, 68, 68, 0.15)";
    statusBorder = "rgba(239, 68, 68, 0.3)";
  } else if (percentage < 85) {
    colorClass = "#F59E0B"; // amber
    statusText = "Needs Attention";
    statusBg = "rgba(245, 158, 11, 0.15)";
    statusBorder = "rgba(245, 158, 11, 0.3)";
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="academic-health-ring">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colorClass}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="academic-health-ring-circle"
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold tracking-tight text-white font-heading">
            {percentage}%
          </span>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
            Attendance
          </span>
        </div>
      </div>

      <div
        className="mt-3 px-3 py-1 rounded-full text-xs font-semibold"
        style={{
          backgroundColor: statusBg,
          color: colorClass,
          border: `1px solid ${statusBorder}`,
        }}
      >
        {statusText}
      </div>
    </div>
  );
}
