// src/components/common/QRIDCard.jsx
// Modern Digital Campus Identity & Smart Pass Security Dashboard

import React, { useState } from "react";
import CampusOSLogo from "./CampusOSLogo";
import { QrCode, ShieldCheck, RefreshCw, Download, Printer, User, MapPin, CheckCircle2, Lock, Sparkles, Key, Building, BookOpen } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function QRIDCard() {
  const { user } = useAuth();
  const [isFlipped, setIsFlipped] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const name = user?.name || "Gowthami N";
  const email = user?.email || "gowthami@campusos.edu";
  const role = user?.role || "STUDENT";
  const studentId = "COS-2026-8942";
  const department = "Computer Science & Engineering";
  const batch = "2023 - 2027 (Semester VI)";

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      try {
        const passHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CampusOS Digital Identity Pass - ${name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: #090d16;
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      margin: 0;
    }
    .card {
      width: 440px;
      border-radius: 24px;
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%);
      border: 1px solid rgba(99, 102, 241, 0.4);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(99, 102, 241, 0.25);
      padding: 24px;
      box-sizing: border-box;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 12px;
    }
    .logo { font-size: 20px; font-weight: 800; color: #fff; }
    .logo span { color: #6366f1; }
    .badge {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(52, 211, 153, 0.3);
      padding: 4px 10px;
      border-radius: 99px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      font-weight: 700;
    }
    .profile {
      display: flex;
      align-items: center;
      gap: 16px;
      margin: 20px 0;
    }
    .avatar {
      width: 64px;
      height: 64px;
      border-radius: 18px;
      background: linear-gradient(135deg, #6366f1, #06b6d4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 800;
      color: #fff;
      flex-shrink: 0;
    }
    .details h2 { font-size: 18px; color: #fff; margin: 0 0 2px 0; }
    .id-tag { font-family: 'JetBrains Mono', monospace; color: #818cf8; font-size: 13px; font-weight: 700; }
    .meta { font-size: 12px; color: #94a3b8; margin-top: 4px; }
    .qr-box {
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
    }
    .qr-code {
      width: 80px;
      height: 80px;
      background: #fff;
      padding: 6px;
      border-radius: 12px;
      flex-shrink: 0;
    }
    .qr-info h4 { font-size: 13px; color: #fff; margin: 0 0 4px 0; }
    .qr-info p { font-size: 11px; color: #94a3b8; font-family: 'JetBrains Mono', monospace; margin: 0; }
    .status { color: #34d399; font-weight: 700; margin-top: 6px; font-size: 11px; font-family: 'JetBrains Mono', monospace; }
    .footer {
      display: flex;
      justify-content: space-between;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 12px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: #64748b;
    }
    .btn {
      margin-top: 24px;
      background: #6366f1;
      color: #fff;
      border: none;
      padding: 12px 24px;
      border-radius: 12px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
    }
    @media print { .btn { display: none; } body { background: #fff; color: #000; } }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="logo">Campus<span>OS</span></div>
      <div class="badge">VERIFIED ${role}</div>
    </div>
    <div class="profile">
      <div class="avatar">${name.charAt(0)}</div>
      <div class="details">
        <h2>${name}</h2>
        <div class="id-tag">${studentId}</div>
        <div class="meta">${department}</div>
        <div class="meta" style="font-family:'JetBrains Mono', monospace;">${batch}</div>
      </div>
    </div>
    <div class="qr-box">
      <div class="qr-code">
        <svg viewBox="0 0 100 100" style="width:100%;height:100%;fill:#090d16;">
          <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z" />
          <path d="M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z" />
          <path d="M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z" />
          <rect x="40" y="0" width="10" height="20" />
          <rect x="40" y="30" width="20" height="10" />
          <rect x="10" y="40" width="20" height="20" />
          <rect x="40" y="60" width="20" height="10" />
          <rect x="70" y="40" width="10" height="30" />
          <rect x="80" y="80" width="20" height="20" />
          <rect x="50" y="80" width="20" height="10" />
        </svg>
      </div>
      <div class="qr-info">
        <h4>Cryptographic Pass</h4>
        <p>Library • GPU Labs • Hostel Gate</p>
        <div class="status">● PASS ACTIVE & VERIFIED</div>
      </div>
    </div>
    <div class="footer">
      <div>Hostel: Block A • Room H-101</div>
      <div>VALID THRU: <strong style="color:#cbd5e1;">06/2027</strong></div>
    </div>
  </div>
  <button class="btn" onclick="window.print()">Print / Save as PDF</button>
</body>
</html>`;

        const blob = new Blob([passHtml], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `CampusOS_Digital_Pass_${studentId}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Failed to generate download pass:", err);
      } finally {
        setDownloading(false);
      }
    }, 600);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> DIGITAL CAMPUS PASS & SECURITY ACCESS
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-heading">
            Smart Digital Identity Card
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Official cryptographic identity pass for automated turnstile gate entry, library checkout, and lab access.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 font-mono text-xs shrink-0">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> {downloading ? "Exporting PDF..." : "Download Digital Pass"}
          </button>
          <button
            onClick={() => window.print()}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition"
            title="Print ID Card"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: ID Card Preview (Left) & Clearance Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive 3D Flip Card */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-800 space-y-5 flex flex-col items-center">
          <div className="w-full flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-indigo-400" /> 3D Pass Preview
            </span>
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="flex items-center gap-1.5 text-xs text-indigo-300 hover:text-white bg-indigo-600/20 hover:bg-indigo-600/30 px-3 py-1.5 rounded-xl border border-indigo-500/40 transition font-mono font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Flip to {isFlipped ? "Front" : "QR Back"}
            </button>
          </div>

          {/* 3D Perspective Card Container */}
          <div className="w-full max-w-sm h-[240px] perspective-1000 my-2">
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className={`relative w-full h-full transform-style-3d cursor-pointer rounded-2xl shadow-2xl transition-transform duration-700 ${
                isFlipped ? "rotate-y-180" : ""
              }`}
            >
              {/* FRONT SIDE */}
              <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 border border-indigo-500/40 p-5 flex flex-col justify-between backface-hidden shadow-2xl overflow-hidden glass-card-glow">
                {/* Top Bar */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <CampusOSLogo variant="dark" height={24} showTagline={false} />
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                    VERIFIED {role}
                  </span>
                </div>

                {/* Middle Section: Photo & Details */}
                <div className="flex items-center gap-4 py-2">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 p-0.5 shadow-lg">
                      <div className="w-full h-full rounded-[14px] bg-slate-800 flex items-center justify-center text-white font-black text-2xl overflow-hidden font-heading">
                        {name.charAt(0)}
                      </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-extrabold text-white truncate font-heading">{name}</h4>
                    <p className="text-xs text-indigo-300 font-mono font-bold">{studentId}</p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{department}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{batch}</p>
                  </div>
                </div>

                {/* Bottom Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono">
                  <span>VALID THRU: <strong className="text-slate-200">06/2027</strong></span>
                  <span className="text-indigo-400 font-semibold">Click to View QR Code →</span>
                </div>
              </div>

              {/* BACK SIDE */}
              <div className="absolute inset-0 w-full h-full rounded-2xl bg-slate-900 border border-indigo-500/40 p-5 flex flex-col justify-between rotate-y-180 backface-hidden shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-white font-heading">SECURITY QR ACCESS CODE</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>

                <div className="flex items-center gap-4 my-auto">
                  {/* QR Code Container */}
                  <div className="w-24 h-24 bg-white p-2 rounded-xl shrink-0 flex items-center justify-center shadow-lg">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950 fill-current">
                      <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z" />
                      <path d="M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z" />
                      <path d="M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z" />
                      <rect x="40" y="0" width="10" height="20" />
                      <rect x="40" y="30" width="20" height="10" />
                      <rect x="10" y="40" width="20" height="20" />
                      <rect x="40" y="60" width="20" height="10" />
                      <rect x="70" y="40" width="10" height="30" />
                      <rect x="80" y="80" width="20" height="20" />
                      <rect x="50" y="80" width="20" height="10" />
                    </svg>
                  </div>

                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-white">Cryptographic Gate Pass</p>
                    <p className="text-[11px] text-slate-400 font-mono">Scan at library turnstiles & lab doors.</p>
                    <span className="inline-block mt-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      ● PASS ACTIVE
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 font-mono text-center pt-2 border-t border-slate-800">
                  If found, please return to CampusOS Security Wing.
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center font-mono">
            Click the card to flip between front details and back security QR code.
          </p>
        </div>

        {/* Right Column: Identity Profile & Gate Access Clearances */}
        <div className="lg:col-span-7 space-y-6">
          {/* Identity Information Details Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white font-heading flex items-center justify-between">
              <span className="flex items-center gap-2"><User className="w-4 h-4 text-indigo-400" /> Student Verification Records</span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                ACTIVE STUDENT
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Full Student Name</span>
                <div className="font-bold text-white text-sm">{name}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Student ID / Roll No</span>
                <div className="font-bold text-indigo-400 text-sm">{studentId}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Academic Department</span>
                <div className="font-bold text-white">{department}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Hostel Residency</span>
                <div className="font-bold text-emerald-400">Block A • Room H-101</div>
              </div>
            </div>
          </div>

          {/* Smart Access & Gate Clearances */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-400" /> Automated Smart Gate Clearances
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300 font-bold flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Central Library Gate
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  GRANTED
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300 font-bold flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-indigo-400" /> CS AI GPU Labs
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  GRANTED
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300 font-bold flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-indigo-400" /> Hostel Gate (24x7)
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  GRANTED
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300 font-bold flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Exam Center Entry
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  VERIFIED
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
