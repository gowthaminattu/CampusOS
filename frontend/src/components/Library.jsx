// src/components/Library.jsx
import { useState } from "react";
import api from "../api/axios";

const CATALOG = [
  { title: "Digital Communication Systems", author: "Simon Haykin", subject: "Digital Communication", copies: 4, icon: "📡" },
  { title: "Introduction to Algorithms", author: "Thomas H. Cormen", subject: "Computer Science", copies: 7, icon: "💻" },
  { title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell", subject: "AI/ML", copies: 3, icon: "🤖" },
  { title: "Computer Networking: A Top-Down Approach", author: "James Kurose", subject: "Networks", copies: 5, icon: "🌐" },
];

const BORROWED_BOOKS = [
  { title: "Introduction to Algorithms", due_date: "July 15, 2026", daysLeft: 10 },
  { title: "Computer Networking", due_date: "July 20, 2026", daysLeft: 15 },
];

export default function Library() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("catalog");

  const searchBooks = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResults("");
    try {
      const res = await api.post("/orchestrator/chat", {
        message: `library suggest books for ${query}`,
      });
      setResults(res.data.response || "No results found.");
    } catch (err) {
      setError("Unable to search catalog right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const quickSearch = (subject) => {
    setQuery(subject);
    setActiveTab("search");
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 8px" }}>
      {/* Header */}
      <div className="settings-header">
        <h1 className="page-h1">📚 Central Library</h1>
        <p className="page-sub">Browse catalog, get book recommendations, and check due dates</p>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "28px" }}>
        {[
          { label: "Total Books", value: "50,000+", icon: "📚", color: "#6366f1" },
          { label: "Available Now", value: "19", icon: "✅", color: "#22c55e" },
          { label: "Borrowed", value: "2", icon: "📖", color: "#f59e0b" },
          { label: "Library Hours", value: "8AM–9PM", icon: "🕗", color: "#ec4899" },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "18px 16px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "10px",
                background: stat.color + "22",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.4rem",
                flexShrink: 0,
              }}
            >
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: "1.3rem", fontWeight: 700, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "24px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "6px",
        }}
      >
        {[
          { id: "catalog", label: "📋 Book Catalog" },
          { id: "search", label: "🔍 Search & Recommend" },
          { id: "borrowed", label: "📖 My Borrowed Books" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: "10px 16px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.88rem",
              transition: "all 0.2s",
              background: activeTab === tab.id ? "var(--accent)" : "transparent",
              color: activeTab === tab.id ? "#fff" : "var(--text-muted)",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Catalog */}
      {activeTab === "catalog" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
          {CATALOG.map((book) => (
            <div
              key={book.title}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                padding: "22px 20px",
                transition: "border-color 0.2s, transform 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ fontSize: "2rem" }}>{book.icon}</div>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    background: book.copies > 5 ? "#22c55e22" : book.copies > 2 ? "#f59e0b22" : "#ef444422",
                    color: book.copies > 5 ? "#22c55e" : book.copies > 2 ? "#f59e0b" : "#ef4444",
                  }}
                >
                  {book.copies} copies
                </span>
              </div>
              <div style={{ marginTop: "14px" }}>
                <h3 style={{ margin: "0 0 6px", fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  {book.title}
                </h3>
                <p style={{ margin: "0 0 4px", fontSize: "0.83rem", color: "var(--text-muted)" }}>
                  ✍️ {book.author}
                </p>
                <p style={{ margin: "0 0 16px", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  🏷️ {book.subject}
                </p>
                <button
                  onClick={() => quickSearch(book.subject)}
                  className="btn btn-primary"
                  style={{ fontSize: "0.8rem", padding: "7px 14px" }}
                >
                  Find Similar →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Search */}
      {activeTab === "search" && (
        <div className="settings-card">
          <h2 className="settings-card-title">🔍 AI Book Recommendation</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "18px" }}>
            Type a subject or topic and get personalized book recommendations from our catalog.
          </p>

          <form onSubmit={searchBooks} style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <input
              type="text"
              className="mgmt-search"
              placeholder="e.g. AI, Networks, Algorithms, Digital Communication..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ whiteSpace: "nowrap" }}>
              {loading ? "Searching..." : "🔍 Search"}
            </button>
          </form>

          {/* Quick Tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
            {["AI", "Networks", "Algorithms", "Digital Communication"].map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                style={{
                  padding: "5px 14px",
                  border: "1px solid var(--border)",
                  borderRadius: "20px",
                  background: "transparent",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  fontSize: "0.82rem",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.color = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.color = "var(--text-muted)";
                }}
              >
                {tag}
              </button>
            ))}
          </div>

          {error && (
            <div
              style={{
                padding: "12px 16px",
                background: "#ef444422",
                border: "1px solid #ef4444",
                borderRadius: "8px",
                color: "#ef4444",
                fontSize: "0.88rem",
                marginBottom: "16px",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {results && (
            <div
              style={{
                padding: "18px",
                background: "rgba(99,102,241,0.06)",
                border: "1px solid rgba(99,102,241,0.3)",
                borderRadius: "12px",
              }}
            >
              {results.split("\n").map((line, i) => (
                <p
                  key={i}
                  style={{
                    margin: "4px 0",
                    fontSize: "0.9rem",
                    color:
                      line.startsWith("📚") || line.startsWith("•")
                        ? "var(--text-primary)"
                        : "var(--text-muted)",
                  }}
                >
                  {line}
                </p>
              ))}
            </div>
          )}

          {!results && !error && !loading && (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>📖</div>
              Enter a subject above to get AI-powered book recommendations.
            </div>
          )}
        </div>
      )}

      {/* Tab: Borrowed Books */}
      {activeTab === "borrowed" && (
        <div className="settings-card">
          <h2 className="settings-card-title">📖 Your Borrowed Books</h2>
          {BORROWED_BOOKS.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
              <div style={{ fontSize: "2rem", marginBottom: "10px" }}>✅</div>
              You have no borrowed books currently.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {BORROWED_BOOKS.map((book) => (
                <div
                  key={book.title}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "18px 20px",
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${book.daysLeft <= 7 ? "#ef4444" : "var(--border)"}`,
                    borderRadius: "12px",
                    gap: "16px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "10px",
                        background: book.daysLeft <= 7 ? "#ef444422" : "#22c55e22",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.4rem",
                        flexShrink: 0,
                      }}
                    >
                      📘
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                        {book.title}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 3 }}>
                        📅 Due: {book.due_date}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <span
                      style={{
                        padding: "5px 12px",
                        borderRadius: "20px",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        background: book.daysLeft <= 7 ? "#ef444422" : "#22c55e22",
                        color: book.daysLeft <= 7 ? "#ef4444" : "#22c55e",
                      }}
                    >
                      {book.daysLeft} days left
                    </span>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 6 }}>
                      Fine: ₹5/day overdue
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div
            style={{
              marginTop: "20px",
              padding: "14px 18px",
              background: "rgba(245,158,11,0.08)",
              border: "1px solid rgba(245,158,11,0.3)",
              borderRadius: "10px",
              fontSize: "0.84rem",
              color: "#f59e0b",
            }}
          >
            ℹ️ Maximum 3 books allowed simultaneously · 14-day lending period · Fine: ₹5/day per book
          </div>
        </div>
      )}
    </div>
  );
}
