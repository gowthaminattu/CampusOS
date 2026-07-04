// src/components/FeeInquiry.jsx
import { useState, useEffect } from "react";
import api from "../api/axios";

export default function FeeInquiry() {
  const [feeDetails, setFeeDetails] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const res = await api.post("/orchestrator/chat", { message: "What is my pending fee?" });
        setFeeDetails(res.data.response);
      } catch (_) {
        setFeeDetails("Failed to fetch pending fees.");
      } finally {
        setLoading(false);
      }
    };
    fetchFees();
  }, []);

  return (
    <div className="settings-card" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h2 className="settings-card-title">💰 Tuition & hostel fee inquiry</h2>
      <p className="page-subtitle" style={{ marginBottom: "20px" }}>Detailed balance invoice details</p>

      {loading ? (
        <div className="mgmt-loading">
          <span className="spinner" /> Loading fee balance...
        </div>
      ) : (
        <div className="chat-bubble-text" style={{ padding: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: "8px" }}>
          {feeDetails.split("\n").map((line, i) => <p key={i}>{line}</p>)}
        </div>
      )}
    </div>
  );
}
