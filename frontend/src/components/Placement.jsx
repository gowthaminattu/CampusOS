// src/components/Placement.jsx
import { useState, useEffect } from "react";
import api from "../api/axios";

export default function Placement() {
  const [drives, setDrives] = useState([]);
  const [eligibilityResult, setEligibilityResult] = useState("");
  const [checking, setChecking] = useState(false);
  const [company, setCompany] = useState("");

  const companies = ["Google", "Amazon", "TCS", "Infosys"];

  const checkEligibility = async (compName) => {
    setChecking(true);
    setCompany(compName);
    try {
      const res = await api.post("/orchestrator/chat", { message: `Am I eligible for ${compName}?` });
      setEligibilityResult(res.data.response);
    } catch (_) {
      setEligibilityResult("Unable to verify eligibility with placement agent right now.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="settings-page" style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <div className="settings-header">
        <h1 className="page-h1">Placement Portal</h1>
        <p className="page-sub">Eligibility tracker, drive list, and mock interviews</p>
      </div>

      <div className="student-stats-row" style={{ marginBottom: "24px" }}>
        {companies.map((comp) => (
          <div key={comp} className="student-stat-card" style={{ cursor: "pointer" }} onClick={() => checkEligibility(comp)}>
            <div className="student-stat-icon" style={{ background: "rgba(168,85,247,0.15)", color: "var(--accent-purple)" }}>💼</div>
            <div>
              <p className="student-stat-val" style={{ fontSize: "16px" }}>{comp}</p>
              <p className="student-stat-label">Verify Eligibility</p>
            </div>
          </div>
        ))}
      </div>

      <div className="settings-layout">
        <div className="settings-content" style={{ gridColumn: "1 / -1" }}>
          {company && (
            <div className="settings-card" style={{ marginBottom: "20px" }}>
              <h2 className="settings-card-title">🔍 Eligibility Check: {company}</h2>
              {checking ? (
                <div className="mgmt-loading">
                  <span className="spinner" /> Checking...
                </div>
              ) : (
                <div className="chat-bubble-text" style={{ padding: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: "8px" }}>
                  {eligibilityResult.split("\n").map((line, i) => <p key={i}>{line}</p>)}
                </div>
              )}
            </div>
          )}

          <div className="settings-card">
            <h2 className="settings-card-title">📝 Resume Suggestions & Tips</h2>
            <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <li><strong>One-Page Constraint:</strong> Keep your resume to exactly one page to ensure recruiter interest.</li>
              <li><strong>STAR Method:</strong> Phrase project accomplishments using Situation, Task, Action, and Result formats.</li>
              <li><strong>Keywords Optimization:</strong> Include matching keywords (e.g. Python, React) from target job descriptions.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
