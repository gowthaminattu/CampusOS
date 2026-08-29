// src/components/AuditLogsViewer.jsx
// Admin Immutable Audit Logs Component.

import { useState, useEffect } from "react";
import api from "../api/axios";

export default function AuditLogsViewer() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        setLoading(true);
        const res = await api.get("/api/admin/audit-logs");
        setLogs(res.data);
      } catch (err) {
        console.error("Audit log error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-md">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Security & Governance</span>
        <h1 className="text-xl font-bold text-slate-100">Immutable Audit Trail Logs</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Real-time record of administrative changes, student placement applications, and system security actions.
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-400 text-xs">Loading audit logs...</div>
      ) : (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-md overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Resource Target</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-950/40">
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="py-3 px-4 font-bold text-slate-200">{log.user_name}</td>
                  <td className="py-3 px-4 text-emerald-400">{log.role}</td>
                  <td className="py-3 px-4 text-slate-200">{log.action}</td>
                  <td className="py-3 px-4 text-slate-400">{log.resource}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded font-bold text-[10px]">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
