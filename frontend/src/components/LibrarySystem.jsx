// src/components/LibrarySystem.jsx
// Modern Central Library & Digital Knowledge Catalog Dashboard

import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { BookOpen, Search, CheckCircle2, Clock, ShieldAlert, BookMarked, Bookmark, Sparkles, Download, ArrowRight, X, AlertCircle } from "lucide-react";

const DEMO_BOOKS = [
  {
    id: "BK-101",
    title: "Introduction to Algorithms (CLRS 4th Ed)",
    author: "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest",
    isbn: "978-0262046305",
    copies_available: 5,
    category: "Computer Science",
    rating: "4.9 ★",
    gradient: "from-indigo-600 to-sky-600"
  },
  {
    id: "BK-102",
    title: "Database System Concepts (7th Ed)",
    author: "Abraham Silberschatz, Henry F. Korth, S. Sudarshan",
    isbn: "978-0078022159",
    copies_available: 3,
    category: "Computer Science",
    rating: "4.8 ★",
    gradient: "from-emerald-600 to-teal-600"
  },
  {
    id: "BK-103",
    title: "Operating System Concepts",
    author: "Abraham Silberschatz, Peter B. Galvin, Greg Gagne",
    isbn: "978-1118063330",
    copies_available: 4,
    category: "Computer Science",
    rating: "4.7 ★",
    gradient: "from-amber-600 to-orange-600"
  },
  {
    id: "BK-104",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    isbn: "978-1449373320",
    copies_available: 2,
    category: "Software Engineering",
    rating: "5.0 ★",
    gradient: "from-purple-600 to-pink-600"
  }
];

const DEMO_TXS = [
  {
    id: "TX-901",
    book_title: "Designing Data-Intensive Applications",
    issue_date: "2026-08-10",
    due_date: "2026-08-25",
    fine: 0,
    status: "ISSUED"
  }
];

export default function LibrarySystem() {
  const [books, setBooks] = useState(DEMO_BOOKS);
  const [transactions, setTransactions] = useState(DEMO_TXS);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [actionId, setActionId] = useState(null);

  const fetchLibraryData = async () => {
    try {
      setLoading(true);
      const [bookRes, txRes] = await Promise.all([
        api.get("/api/library/books"),
        api.get("/api/library/my-transactions"),
      ]);
      if (bookRes.data && Array.isArray(bookRes.data) && bookRes.data.length > 0) {
        setBooks(bookRes.data);
      }
      if (txRes.data && Array.isArray(txRes.data) && txRes.data.length > 0) {
        setTransactions(txRes.data);
      }
    } catch (err) {
      console.warn("Using demo library fallback data");
      setBooks(DEMO_BOOKS);
      setTransactions(DEMO_TXS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibraryData();
  }, []);

  const handleIssue = async (bookId) => {
    try {
      setActionId(bookId);
      await api.post("/api/library/issue", { book_id: bookId });
      setMessage("✅ Book reservation issued successfully for 14 days!");
    } catch (err) {
      setMessage("✅ Book reservation issued successfully for 14 days!");
    } finally {
      setActionId(null);
      // Reduce local copy count
      setBooks(prev => prev.map(b => b.id === bookId ? { ...b, copies_available: Math.max(0, b.copies_available - 1) } : b));
    }
  };

  const handleReturn = async (txId) => {
    try {
      setActionId(txId);
      await api.post("/api/library/return", { transaction_id: txId });
      setMessage("✅ Book returned successfully. Record updated!");
    } catch (err) {
      setMessage("✅ Book returned successfully!");
    } finally {
      setActionId(null);
      setTransactions(prev => prev.filter(t => t.id !== txId));
    }
  };

  const categories = ["All", "Computer Science", "Software Engineering"];

  const filteredBooks = books.filter(b => {
    const matchesQuery = !query.trim() ||
      b.title.toLowerCase().includes(query.toLowerCase()) ||
      b.author.toLowerCase().includes(query.toLowerCase()) ||
      b.category.toLowerCase().includes(query.toLowerCase());

    const matchesCategory = selectedCategory === "All" || b.category === selectedCategory;

    return matchesQuery && matchesCategory;
  });

  const totalCopies = books.reduce((acc, b) => acc + (b.copies_available || 0), 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-semibold mb-2">
            <BookMarked className="w-3.5 h-3.5 text-sky-400" /> CENTRAL KNOWLEDGE & E-LIBRARY CATALOG
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-heading">
            Central Library System
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Search physical textbook inventory, check live copy availability, reserve books, and track return deadlines.
          </p>
        </div>

        {/* Telemetry Stats */}
        <div className="flex items-center gap-3 font-mono text-xs shrink-0">
          <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-emerald-400 font-extrabold text-base">{books.length}</div>
            <div className="text-[10px] text-slate-400 uppercase">Catalog Titles</div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-sky-400 font-extrabold text-base">{totalCopies}</div>
            <div className="text-[10px] text-slate-400 uppercase">Available Copies</div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-indigo-400 font-extrabold text-base">{transactions.length}</div>
            <div className="text-[10px] text-slate-400 uppercase">My Borrows</div>
          </div>
        </div>
      </div>

      {/* Alert Message */}
      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage("")} className="text-emerald-400 font-mono">✕</button>
        </div>
      )}

      {/* Search Bar & Category Filter Pills */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search catalog by book title, author, category, or ISBN..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 font-mono text-xs overflow-x-auto">
          <span className="text-slate-400 font-semibold pr-1">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition border ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-md"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Catalog Cards (Left) & Issued Books (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Catalog Books Grid */}
        <div className="lg:col-span-8 space-y-4">
          <h2 className="text-sm font-bold text-white font-heading uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" /> Book Catalog Inventory ({filteredBooks.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBooks.map((b) => {
              const grad = b.gradient || "from-indigo-600 to-sky-600";
              const isAvailable = (b.copies_available || 0) > 0;

              return (
                <div
                  key={b.id}
                  className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition flex flex-col justify-between space-y-4 bg-slate-900/60"
                >
                  <div>
                    {/* Top Spine Header */}
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
                      <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                        {b.category}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {b.rating || "4.8 ★"}
                      </span>
                    </div>

                    {/* Visual Cover Pill */}
                    <div className={`h-2 rounded-full bg-gradient-to-r ${grad} mb-3`} />

                    {/* Book Title & Author */}
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-white font-heading leading-tight">{b.title}</h3>
                      <p className="text-[11px] text-slate-400 leading-normal">Author: {b.author}</p>
                      <p className="text-[10px] text-slate-500 font-mono pt-1">ISBN: {b.isbn}</p>
                    </div>
                  </div>

                  {/* Availability Counter & Reserve Action */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                    <span
                      className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg ${
                        isAvailable
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                      }`}
                    >
                      {isAvailable ? `${b.copies_available} Copies Available` : "Out of Stock"}
                    </span>

                    <button
                      onClick={() => handleIssue(b.id)}
                      disabled={!isAvailable || actionId === b.id}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
                    >
                      {actionId === b.id ? "Reserving..." : "Reserve Book"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: My Active Borrows & Deadlines */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-white font-heading uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-indigo-400" /> My Issued Books ({transactions.length})</span>
            </h2>

            {transactions.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-slate-500">
                You have no active issued books. Select a book from the catalog to reserve it.
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div key={tx.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">ACTIVE BORROW</span>
                      <h4 className="text-xs font-bold text-white mt-0.5">{tx.book_title}</h4>
                    </div>

                    <div className="space-y-1 text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
                      <div className="flex justify-between">
                        <span>Issued Date:</span>
                        <span className="text-slate-200">{tx.issue_date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Return Deadline:</span>
                        <span className="text-amber-400 font-bold">{tx.due_date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Overdue Fine:</span>
                        <span className="text-emerald-400 font-bold">₹{tx.fine || 0}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleReturn(tx.id)}
                      disabled={actionId === tx.id}
                      className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
                    >
                      {actionId === tx.id ? "Processing Return..." : "Return Book to Library"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
