// src/components/Library.jsx
import { useState, useEffect } from "react";
import api from "../api/axios";

export default function Library() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState("");
  const [loading, setLoading] = useState(false);
  const [borrowed, setBorrowed] = useState([]);

  useEffect(() => {
    // Fetch borrowed status
    const fetchBorrowed = async () => {
      try {
        const res = await api.post("/orchestrator/chat", { message: "What are my due dates?" });
        // Format response or show text
        setBorrowed(res.data.response);
      } catch (_) {}
    };
    fetchBorrowed();
  }, []);

  const searchBooks = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await api.post("/orchestrator/chat", { message: `Suggest books for ${query}` });
      setResults(res.data.response);
    } catch (_) {
      setResults("Unable to search catalog right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page" style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <div className="settings-header">
        <h1 className="page-h1">Central Library</h1>
        <p className="page-sub">Catalog search, book recommendations, and due dates checker</p>
      </div>

      <div className="settings-layout">
        {/* Left: Search */}
        <div className="settings-content">
          <div className="settings-card" style={{ marginBottom: "20px" }}>
            <h2 className="settings-card-title">🔍 Search Book Catalog</h2>
            <form onSubmit={searchBooks} className="mgmt-filters" style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                className="mgmt-search"
                placeholder="Type book name or subject (e.g. AI, Networks)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Searching..." : "Search"}
              </button>
            </form>

            {results && (
              <div className="chat-bubble-text" style={{ marginTop: "20px", padding: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: "8px" }}>
                {results.split("\n").map((line, i) => <p key={i}>{line}</p>)}
              </div>
            )}
          </div>
        </div>

        {/* Right: Borrowed status */}
        <div className="settings-content">
          <div className="settings-card">
            <h2 className="settings-card-title">📖 Borrowed History & Due Dates</h2>
            <div className="chat-bubble-text" style={{ padding: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: "8px" }}>
              {borrowed ? (
                borrowed.split("\n").map((line, i) => <p key={i}>{line}</p>)
              ) : (
                <p>No active borrowed books.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
