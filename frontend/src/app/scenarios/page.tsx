"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { useSettings } from "@/lib/SettingsContext";
import Link from "next/link";

const scenarios = [
    {
        slug: "zero-day-vulnerability",
        title: "The Zero-Day Vulnerability",
        asset: "CYBERFORT (CBFT)",
        difficulty: "Beginner",
        xp: 150,
        category: "Tech",
        status: "available",
        description: "A major cybersecurity breach threatens enterprise networks. How will the stock react?",
        gradient: "from-[#6366f1] to-[#4f46e5]",
    },
    {
        slug: "earnings-surprise",
        title: "Earnings Surprise Rally",
        asset: "NVIDIA (NVDA)",
        difficulty: "Beginner",
        xp: 100,
        category: "Earnings",
        status: "available",
        description: "Tech giant beats earnings estimates by 40%. Predict the market reaction.",
        gradient: "from-[#22c55e] to-[#16a34a]",
    },
    {
        slug: "fed-rate-shock",
        title: "Fed Rate Shock",
        asset: "S&P 500 (SPY)",
        difficulty: "Intermediate",
        xp: 250,
        category: "Macro",
        status: "locked",
        description: "An unexpected rate hike shakes the market. What happens next?",
        gradient: "from-[#f97316] to-[#ea580c]",
    },
    {
        slug: "oil-crisis",
        title: "Oil Supply Disruption",
        asset: "Crude Oil (CL)",
        difficulty: "Intermediate",
        xp: 200,
        category: "Commodities",
        status: "locked",
        description: "OPEC cuts production. Will oil prices spike?",
        gradient: "from-[#ef4444] to-[#dc2626]",
    },
    {
        slug: "crypto-crash",
        title: "Crypto Flash Crash",
        asset: "Bitcoin (BTC)",
        difficulty: "Advanced",
        xp: 350,
        category: "Crypto",
        status: "locked",
        description: "Exchange security breach triggers panic selling. Will BTC recover?",
        gradient: "from-[#a855f7] to-[#7c3aed]",
    },
    {
        slug: "ipo-frenzy",
        title: "Tech IPO Frenzy",
        asset: "AI Startup (AIUP)",
        difficulty: "Advanced",
        xp: 400,
        category: "IPO",
        status: "locked",
        description: "Hot AI startup goes public. Hype or substance?",
        gradient: "from-[#ec4899] to-[#db2777]",
    },
];

const difficultyColors: Record<string, string> = {
    Beginner: "bg-[#22c55e]/10 text-[#16a34a]",
    Intermediate: "bg-[#f97316]/10 text-[#ea580c]",
    Advanced: "bg-[#ef4444]/10 text-[#dc2626]",
};

export default function ScenariosPage() {
    const [filter, setFilter] = useState("All");
    const { settings } = useSettings();
    const cats = ["All", "Tech", "Earnings", "Macro", "Commodities", "Crypto", "IPO"];

    const filtered = filter === "All" ? scenarios : scenarios.filter(s => s.category === filter);

    return (
        <DashboardLayout>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-[#1a1a2e] mb-1">Scenarios</h1>
                <p className="text-sm text-[#6b7280] mb-6">Choose a real-world trading scenario to test your skills</p>
            </motion.div>

            {/* Filter */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {cats.map(c => (
                    <button key={c} onClick={() => setFilter(c)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${filter === c
                            ? "bg-[#6B1D3A] text-white shadow-lg shadow-[#6B1D3A]/20"
                            : "bg-white text-[#6b7280] hover:bg-[#f3f0ed] border border-[rgba(0,0,0,0.06)]"}`}>
                        {c}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filtered.map((s, i) => (
                    <motion.div key={s.slug} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className={`dash-card overflow-hidden ${s.status === "locked" ? "opacity-60" : ""}`}>
                        {/* Gradient top strip */}
                        <div className={`h-1.5 bg-gradient-to-r ${s.gradient}`} />
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${difficultyColors[s.difficulty]}`}>
                                        {s.difficulty}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-md bg-[#fef3c7] text-[#92400e] text-[10px] font-semibold">
                                        +{s.xp} XP
                                    </span>
                                </div>
                                {s.status === "locked" && (
                                    <span className="text-xs text-[#9ca3af] flex items-center gap-1">🔒 Locked</span>
                                )}
                            </div>
                            <h3 className="text-lg font-bold text-[#1a1a2e] mb-1">{s.title}</h3>
                            <p className="text-xs font-mono text-[#9ca3af] mb-2">{s.asset}</p>
                            <p className="text-sm text-[#6b7280] mb-4">{s.description}</p>
                            <div className="flex items-center gap-2">
                                {s.status === "available" ? (
                                    <Link href="/"
                                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6B1D3A] to-[#a855f7] text-center hover:shadow-lg transition-all no-underline">
                                        🎮 Play Now
                                    </Link>
                                ) : (
                                    <button disabled className="flex-1 py-2.5 rounded-xl text-sm font-medium text-[#9ca3af] bg-[#f3f0ed] cursor-not-allowed">
                                        🔒 Complete previous scenarios
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </DashboardLayout>
    );
}
