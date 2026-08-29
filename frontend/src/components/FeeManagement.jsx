// src/components/FeeManagement.jsx
// Modern Financial Dashboard & Fee Payment UI

import React from "react";
import { CreditCard, Download, CheckCircle2, Clock, FileText, ArrowUpRight, ShieldCheck } from "lucide-react";

const TRANSACTIONS = [
  { id: "TXN-9842", description: "Semester VI Tuition Fee (Installment 1)", amount: "₹45,000", date: "Jan 10, 2026", status: "SUCCESS", mode: "UPI / Net Banking" },
  { id: "TXN-9843", description: "Hostel & Mess Amenities Fee", amount: "₹15,000", date: "Jan 12, 2026", status: "SUCCESS", mode: "Credit Card" },
  { id: "TXN-PEND", description: "Semester VI Tuition Fee (Final Installment)", amount: "₹25,000", date: "Due Mar 15, 2026", status: "PENDING", mode: "Pending" },
];

export default function FeeManagement() {
  const totalFees = 85000;
  const paidFees = 60000;
  const pendingFees = 25000;
  const progressPercent = Math.round((paidFees / totalFees) * 100);

  const handleDownloadInvoice = (txnId) => {
    try {
      const invoiceHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CampusOS Official Tax Invoice - ${txnId}</title>
  <style>
    body { font-family: sans-serif; background: #090d16; color: #fff; padding: 40px; display: flex; justify-content: center; }
    .invoice { width: 500px; background: #0f172a; border: 1px solid #334155; border-radius: 16px; padding: 30px; }
    .header { font-size: 22px; font-weight: bold; border-bottom: 1px solid #334155; padding-bottom: 15px; margin-bottom: 20px; }
    .header span { color: #6366f1; }
    .row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; color: #cbd5e1; }
    .total { border-top: 1px solid #334155; padding-top: 15px; font-size: 18px; font-weight: bold; color: #34d399; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="invoice">
    <div class="header">Campus<span>OS</span> Fee Receipt</div>
    <div class="row"><span>Transaction Ref:</span> <strong>${txnId}</strong></div>
    <div class="row"><span>Student ID:</span> <strong>COS-2026-8942</strong></div>
    <div class="row"><span>Payment Status:</span> <strong style="color:#34d399;">SUCCESS</strong></div>
    <div class="row"><span>Payment Gateway:</span> <strong>CampusOS HDFC Portal</strong></div>
    <div class="row total"><span>Amount Received:</span> <span>₹45,000</span></div>
  </div>
</body>
</html>`;
      const blob = new Blob([invoiceHtml], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `CampusOS_Invoice_${txnId}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download invoice:", err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-heading">
            Fee Management & Financial Portal
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track tuition fee schedules, payment receipts, pending dues, and download official invoices.
          </p>
        </div>
        <button className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-600/20">
          <CreditCard className="w-4 h-4" /> Pay Pending Dues (₹25,000)
        </button>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">TOTAL ANNUAL FEES</span>
          <div className="text-3xl font-extrabold text-white font-heading mt-2">₹85,000</div>
          <div className="text-xs text-slate-400 mt-2">Academic Year 2025–2026</div>
        </div>

        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">PAID AMOUNT</span>
          <div className="text-3xl font-extrabold text-emerald-400 font-heading mt-2">₹60,000</div>
          <div className="text-xs text-slate-400 mt-2">Verified via Campus Gateway</div>
        </div>

        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">PENDING DUES</span>
          <div className="text-3xl font-extrabold text-rose-400 font-heading mt-2">₹25,000</div>
          <div className="text-xs text-rose-300 mt-2 font-semibold">Due Date: March 15, 2026</div>
        </div>
      </div>

      {/* Payment Progress Bar */}
      <div className="glass-panel rounded-2xl p-6 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-200">Fee Payment Completion Progress</span>
          <span className="text-indigo-400 font-mono">{progressPercent}% Paid</span>
        </div>
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-emerald-400 rounded-full transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-400 font-mono">
          <span>₹0</span>
          <span>₹60,000 Paid</span>
          <span>Target: ₹85,000</span>
        </div>
      </div>

      {/* Transaction History & Invoice Downloads */}
      <div className="glass-panel rounded-2xl p-6">
        <h3 className="text-base font-bold text-white font-heading mb-4 flex items-center justify-between">
          <span>Transaction History & Receipts</span>
          <span className="text-xs text-slate-400 font-normal">Updated in real-time</span>
        </h3>

        <div className="space-y-4">
          {TRANSACTIONS.map((txn) => (
            <div
              key={txn.id}
              className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl mt-0.5 ${txn.status === "SUCCESS" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{txn.description}</h4>
                    <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                      {txn.id}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {txn.date} • {txn.mode}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4">
                <div className="text-right">
                  <div className="text-sm font-extrabold text-white">{txn.amount}</div>
                  <span className={`text-[10px] font-bold ${txn.status === "SUCCESS" ? "text-emerald-400" : "text-amber-400"}`}>
                    {txn.status}
                  </span>
                </div>

                {txn.status === "SUCCESS" && (
                  <button
                    onClick={() => handleDownloadInvoice(txn.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 shrink-0"
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-400" /> Invoice
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
