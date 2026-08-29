// src/components/common/CampusOSLogo.jsx
// Dynamic SVG logo component for CampusOS Design System

import React from "react";

export default function CampusOSLogo({
  variant = "primary", // "primary" | "dark" | "compact" | "compact-dark" | "monochrome"
  height = 40,
  showTagline = true,
  className = "",
  onClick,
}) {
  const isDark = variant === "dark" || variant === "compact-dark";
  const isCompact = variant === "compact" || variant === "compact-dark";
  const isMonochrome = variant === "monochrome";

  if (isCompact) {
    return (
      <svg
        width={height}
        height={height}
        viewBox="0 0 100 100"
        fill="none"
        className={`campusos-logo-icon ${className}`}
        onClick={onClick}
        style={{ cursor: onClick ? "pointer" : "default" }}
      >
        <defs>
          <linearGradient id={`cmp-grad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDark ? "#818CF8" : "#4F46E5"} />
            <stop offset="50%" stopColor={isDark ? "#6366F1" : "#6366F1"} />
            <stop offset="100%" stopColor={isDark ? "#38BDF8" : "#0EA5E9"} />
          </linearGradient>
          <linearGradient id={`cmp-acc-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={isDark ? "#38BDF8" : "#0EA5E9"} />
            <stop offset="100%" stopColor={isDark ? "#22D3EE" : "#06B6D4"} />
          </linearGradient>
        </defs>
        <path
          d="M 68,15 A 42,42 0 1,0 68,85"
          stroke={isMonochrome ? "#0F172A" : `url(#cmp-grad-${variant})`}
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 38,68 L 38,44 A 12,12 0 0,1 62,44 L 62,68"
          stroke={isDark ? "#F8FAFC" : "#0F172A"}
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 50,38 L 50,68"
          stroke={isMonochrome ? "#0F172A" : `url(#cmp-acc-${variant})`}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M 30,44 L 50,26 L 70,44"
          stroke={isMonochrome ? "#0F172A" : `url(#cmp-grad-${variant})`}
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="68" cy="15" r="6" fill={isMonochrome ? "#0F172A" : "#0EA5E9"} />
        <circle cx="68" cy="85" r="6" fill={isMonochrome ? "#0F172A" : "#6366F1"} />
        <circle cx="50" cy="26" r="5" fill={isMonochrome ? "#0F172A" : "#38BDF8"} />
      </svg>
    );
  }

  // Full Logo (Icon + Text)
  const calculatedWidth = showTagline ? height * 4.8 : height * 3.8;

  return (
    <div
      className={`campusos-logo-brand inline-flex items-center gap-3 select-none ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default", height }}
    >
      <svg
        height={height}
        viewBox="0 0 100 100"
        fill="none"
        className="shrink-0"
      >
        <defs>
          <linearGradient id={`lg-grad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDark ? "#818CF8" : "#4F46E5"} />
            <stop offset="50%" stopColor={isDark ? "#6366F1" : "#6366F1"} />
            <stop offset="100%" stopColor={isDark ? "#38BDF8" : "#0EA5E9"} />
          </linearGradient>
          <linearGradient id={`lg-acc-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={isDark ? "#38BDF8" : "#0EA5E9"} />
            <stop offset="100%" stopColor={isDark ? "#22D3EE" : "#06B6D4"} />
          </linearGradient>
        </defs>
        <path
          d="M 68,15 A 42,42 0 1,0 68,85"
          stroke={isMonochrome ? "#0F172A" : `url(#lg-grad-${variant})`}
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 38,68 L 38,44 A 12,12 0 0,1 62,44 L 62,68"
          stroke={isDark ? "#F8FAFC" : "#0F172A"}
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 50,38 L 50,68"
          stroke={isMonochrome ? "#0F172A" : `url(#lg-acc-${variant})`}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M 30,44 L 50,26 L 70,44"
          stroke={isMonochrome ? "#0F172A" : `url(#lg-grad-${variant})`}
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="68" cy="15" r="6" fill={isMonochrome ? "#0F172A" : "#0EA5E9"} />
        <circle cx="68" cy="85" r="6" fill={isMonochrome ? "#0F172A" : "#6366F1"} />
        <circle cx="50" cy="26" r="5" fill={isMonochrome ? "#0F172A" : "#38BDF8"} />
      </svg>
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-baseline">
          <span
            className={`font-black tracking-tight text-xl ${
              isDark ? "text-white" : "text-slate-900"
            }`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: `${height * 0.55}px` }}
          >
            Campus
          </span>
          <span
            className="font-black text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-indigo-400 to-sky-400"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: `${height * 0.55}px` }}
          >
            OS
          </span>
        </div>
        {showTagline && (
          <span
            className={`font-semibold tracking-wider text-[10px] uppercase mt-0.5 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
            style={{ fontSize: `${Math.max(9, height * 0.22)}px` }}
          >
            One Campus. One Intelligent Platform.
          </span>
        )}
      </div>
    </div>
  );
}
