"use client";

import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";

const tradeHistory = [
    { id: 1, date: "Feb 26, 2026", scenario: "The Zero-Day Vulnerability", asset: "CBFT", prediction: "DOWN", actual: "DOWN", result: "correct", xp: 150, aiPrediction: "DOWN", aiResult: "correct" },
    { id: 2, date: "Feb 25, 2026", scenario: "Earnings Surprise Rally", asset: "NVDA", prediction: "UP", actual: "UP", result: "correct", xp: 100, aiPrediction: "DOWN", aiResult: "wrong" },
    { id: 3, date: "Feb 24, 2026", scenario: "Interest Rate Shock", asset: "SPY", prediction: "UP", actual: "DOWN", result: "wrong", xp: 25, aiPrediction: "DOWN", aiResult: "correct" },
    { id: 4, date: "Feb 23, 2026", scenario: "Oil Supply Disruption", asset: "CL", prediction: "UP", actual: "UP", result: "correct", xp: 200, aiPrediction: "UP", aiResult: "correct" },
    { id: 5, date: "Feb 22, 2026", scenario: "Crypto Flash Crash", asset: "BTC", prediction: "DOWN", actual: "DOWN", result: "correct", xp: 350, aiPrediction: "UP", aiResult: "wrong" },
    { id: 6, date: "Feb 21, 2026", scenario: "Tech IPO Frenzy", asset: "AIUP", prediction: "UP", actual: "DOWN", result: "wrong", xp: 25, aiPrediction: "DOWN", aiResult: "correct" },
    { id: 7, date: "Feb 20, 2026", scenario: "Currency War", asset: "EUR/USD", prediction: "DOWN", actual: "DOWN", result: "correct", xp: 400, aiPrediction: "DOWN", aiResult: "correct" },
];

export default function HistoryPage() {
    const wins = tradeHistory.filter(t => t.result === "correct").length;
    const total = tradeHistory.length;
    const aiWins = tradeHistory.filter(t => t.aiResult === "correct").length;
    const totalXp = tradeHistory.reduce((s, t) => s + t.xp, 0);

    return (
        <DashboardLayout>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-[#1a1a2e] mb-1">Trade History</h1>
                <p className="text-sm text-[#6b7280] mb-6">Review your past predictions and performance</p>
            </motion.div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                    { label: "Total Trades", value: total, icon: "📊", color: "#6366f1" },
                    { label: "Your Win Rate", value: `${Math.round((wins / total) * 100)}%`, icon: "🎯", color: "#22c55e" },
                    { label: "AI Win Rate", value: `${Math.round((aiWins / total) * 100)}%`, icon: "🤖", color: "#f97316" },
                    { label: "Total XP", value: totalXp, icon: "⚡", color: "#D4A417" },
                ].map((stat) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="dash-card p-4 text-center">
                        <div className="text-2xl mb-1">{stat.icon}</div>
                        <div className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                        <div className="text-xs text-[#9ca3af] font-medium">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Trade table */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }} className="dash-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[rgba(0,0,0,0.06)]">
                                {["Date", "Scenario", "Asset", "Your Call", "AI Call", "Actual", "Result", "XP"].map(h => (
                                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tradeHistory.map((trade, i) => (
                                <motion.tr key={trade.id}
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 + i * 0.05 }}
                                    className="border-b border-[rgba(0,0,0,0.03)] hover:bg-[#f9f6f3] transition-colors">
                                    <td className="px-4 py-3 text-[#6b7280] whitespace-nowrap">{trade.date}</td>
                                    <td className="px-4 py-3 font-medium text-[#1a1a2e] max-w-[200px] truncate">{trade.scenario}</td>
                                    <td className="px-4 py-3 font-mono text-[#6b7280] text-xs">{trade.asset}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${trade.prediction === "UP" ? "bg-[#f0fdf4] text-[#22c55e]" : "bg-[#fef2f2] text-[#ef4444]"}`}>
                                            {trade.prediction === "UP" ? "▲" : "▼"} {trade.prediction}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${trade.aiPrediction === "UP" ? "bg-[#f0fdf4] text-[#22c55e]" : "bg-[#fef2f2] text-[#ef4444]"}`}>
                                            {trade.aiPrediction === "UP" ? "▲" : "▼"} {trade.aiPrediction}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${trade.actual === "UP" ? "bg-[#f0f0ff] text-[#6366f1]" : "bg-[#f0f0ff] text-[#6366f1]"}`}>
                                            {trade.actual === "UP" ? "▲" : "▼"} {trade.actual}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs font-bold ${trade.result === "correct" ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                                            {trade.result === "correct" ? "✅ Win" : "❌ Loss"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-[#D4A417]">+{trade.xp}</td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </DashboardLayout>
    );
}
