"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { useSettings } from "@/lib/SettingsContext";

// ── Mock data for practice zone challenges ──────────────────────────────────
const challenges = [
    {
        id: 1,
        slug: "earnings-surprise-rally",
        title: "Earnings Surprise Rally",
        asset: "NVIDIA (NVDA)",
        difficulty: "Beginner",
        duration: "5 min",
        xp: 100,
        gradient: "from-[#22c55e] to-[#16a34a]",
        bgLight: "bg-[#f0fdf4]",
        borderLight: "border-[#22c55e]/20",
        icon: "📊",
        chartPattern: "Bull Flag",
        description: "A tech giant beats earnings estimates by 40%. Predict the short-term market reaction.",
        category: "Earnings",
    },
    {
        id: 2,
        slug: "interest-rate-shock",
        title: "Interest Rate Shock",
        asset: "S&P 500 (SPY)",
        difficulty: "Intermediate",
        duration: "8 min",
        xp: 200,
        gradient: "from-[#f97316] to-[#ea580c]",
        bgLight: "bg-[#fff7ed]",
        borderLight: "border-[#f97316]/20",
        icon: "📈",
        chartPattern: "Head & Shoulders",
        description: "The Fed announces an unexpected rate hike. How will the broad market respond?",
        category: "Macro",
    },
    {
        id: 3,
        slug: "crypto-flash-crash",
        title: "Crypto Flash Crash",
        asset: "Bitcoin (BTC)",
        difficulty: "Advanced",
        duration: "10 min",
        xp: 350,
        gradient: "from-[#a855f7] to-[#7c3aed]",
        bgLight: "bg-[#faf5ff]",
        borderLight: "border-[#a855f7]/20",
        icon: "🪙",
        chartPattern: "Double Bottom",
        description: "A major exchange faces a security breach. Will Bitcoin bounce or continue falling?",
        category: "Crypto",
    },
    {
        id: 4,
        slug: "oil-supply-disruption",
        title: "Oil Supply Disruption",
        asset: "Crude Oil (CL)",
        difficulty: "Intermediate",
        duration: "7 min",
        xp: 250,
        gradient: "from-[#ef4444] to-[#dc2626]",
        bgLight: "bg-[#fef2f2]",
        borderLight: "border-[#ef4444]/20",
        icon: "🛢️",
        chartPattern: "Rising Wedge",
        description: "OPEC cuts production unexpectedly. Predict how oil prices will react over the next week.",
        category: "Commodities",
    },
    {
        id: 5,
        slug: "tech-ipo-frenzy",
        title: "Tech IPO Frenzy",
        asset: "AI Startup (AIUP)",
        difficulty: "Beginner",
        duration: "5 min",
        xp: 150,
        gradient: "from-[#ec4899] to-[#db2777]",
        bgLight: "bg-[#fdf2f8]",
        borderLight: "border-[#ec4899]/20",
        icon: "🚀",
        chartPattern: "Breakout",
        description: "A hot AI startup goes public. Will the hype sustain or is it a sell-the-news event?",
        category: "IPO",
    },
    {
        id: 6,
        slug: "currency-war",
        title: "Currency War",
        asset: "EUR/USD",
        difficulty: "Advanced",
        duration: "12 min",
        xp: 400,
        gradient: "from-[#2EC4B6] to-[#14b8a6]",
        bgLight: "bg-[#f0fdfa]",
        borderLight: "border-[#2EC4B6]/20",
        icon: "💱",
        chartPattern: "Descending Triangle",
        description: "EU and US trade tensions escalate. How will the Euro perform against the Dollar?",
        category: "Forex",
    },
];

const categories = ["All", "Earnings", "Macro", "Crypto", "Commodities", "IPO", "Forex"];

const leaderboard = [
    { rank: 1, name: "Alex T.", score: 2450, streak: 12, avatar: "🧑‍💼" },
    { rank: 2, name: "Priya M.", score: 2180, streak: 8, avatar: "👩‍💻" },
    { rank: 3, name: "Sam W.", score: 1940, streak: 15, avatar: "🧑‍🎓" },
    { rank: 4, name: "You", score: 850, streak: 3, avatar: "🎯", isUser: true },
];

export default function PracticeZonePage() {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [flippedCard, setFlippedCard] = useState<number | null>(null);
    const { settings } = useSettings();

    const filteredChallenges = selectedCategory === "All"
        ? challenges
        : challenges.filter(c => c.category === selectedCategory);

    return (
        <DashboardLayout>
            {/* Page header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1a1a2e]">Practice Zone</h1>
                        <p className="text-sm text-[#6b7280] mt-1">
                            Go head-to-head with AI • Master chart patterns • Earn XP
                        </p>
                    </div>
                    <div className="dash-card px-4 py-2 flex items-center gap-3">
                        <div className="text-center">
                            <div className="text-lg font-bold text-[#1a1a2e]">12</div>
                            <div className="text-[10px] text-[#9ca3af] font-medium">Completed</div>
                        </div>
                        <div className="w-px h-8 bg-[rgba(0,0,0,0.06)]" />
                        <div className="text-center">
                            <div className="text-lg font-bold text-[#22c55e]">75%</div>
                            <div className="text-[10px] text-[#9ca3af] font-medium">Win Rate</div>
                        </div>
                        <div className="w-px h-8 bg-[rgba(0,0,0,0.06)]" />
                        <div className="text-center">
                            <div className="text-lg font-bold text-[#D4A417]">850</div>
                            <div className="text-[10px] text-[#9ca3af] font-medium">XP</div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Mini leaderboard strip */}
            <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="dash-card px-5 py-3 mb-6 flex items-center gap-6"
            >
                <span className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider">Live Rankings</span>
                {leaderboard.map((entry) => (
                    <div
                        key={entry.rank}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${entry.isUser
                            ? "bg-[#6B1D3A]/10 text-[#6B1D3A] font-semibold"
                            : "text-[#6b7280]"
                            }`}
                    >
                        <span className="text-xs font-bold text-[#D4A417]">#{entry.rank}</span>
                        <span>{entry.avatar}</span>
                        <span className="font-medium">{entry.name}</span>
                        <span className="text-xs text-[#9ca3af]">{entry.score} XP</span>
                    </div>
                ))}
            </motion.div>

            {/* Category filter tabs */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="flex items-center gap-2 mb-6 overflow-x-auto pb-1"
            >
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${selectedCategory === cat
                            ? "bg-[#6B1D3A] text-white shadow-lg shadow-[#6B1D3A]/20"
                            : "bg-white text-[#6b7280] hover:bg-[#f3f0ed] border border-[rgba(0,0,0,0.06)]"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </motion.div>

            {/* Challenge flashcards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                <AnimatePresence mode="popLayout">
                    {filteredChallenges.map((challenge, i) => (
                        <motion.div
                            key={challenge.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: i * 0.08 }}
                            className="relative cursor-pointer group"
                            style={{ perspective: "1000px" }}
                            onClick={() => setFlippedCard(flippedCard === challenge.id ? null : challenge.id)}
                        >
                            <div
                                className="relative w-full transition-transform duration-500"
                                style={{
                                    transformStyle: "preserve-3d",
                                    transform: flippedCard === challenge.id ? "rotateY(180deg)" : "rotateY(0deg)",
                                }}
                            >
                                {/* FRONT — Challenge card */}
                                <div
                                    className={`rounded-2xl overflow-hidden bg-gradient-to-br ${challenge.gradient} p-5 text-white min-h-[220px] flex flex-col justify-between`}
                                    style={{ backfaceVisibility: "hidden" }}
                                >
                                    {/* Top row */}
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-3xl">{challenge.icon}</span>
                                            <span className="px-2 py-0.5 rounded-md bg-white/20 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                                                {challenge.difficulty}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-extrabold uppercase tracking-wide leading-tight mb-1">
                                            {challenge.title}
                                        </h3>
                                        <p className="text-sm opacity-80 font-medium">{challenge.asset}</p>
                                    </div>

                                    {/* Bottom row */}
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-3">
                                            <span className="px-3 py-1 rounded-lg bg-white/20 text-xs font-semibold backdrop-blur-sm">
                                                ⏱ {challenge.duration}
                                            </span>
                                            <span className="px-3 py-1 rounded-lg bg-white/20 text-xs font-semibold backdrop-blur-sm">
                                                +{challenge.xp} XP
                                            </span>
                                        </div>
                                        <span className="text-xs opacity-60 font-medium">Tap to flip →</span>
                                    </div>
                                </div>

                                {/* BACK — Chart pattern info */}
                                <div
                                    className={`absolute inset-0 rounded-2xl ${challenge.bgLight} border ${challenge.borderLight} p-5 flex flex-col justify-between min-h-[220px]`}
                                    style={{
                                        backfaceVisibility: "hidden",
                                        transform: "rotateY(180deg)",
                                    }}
                                >
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-2xl">{challenge.icon}</span>
                                            <div>
                                                <div className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">
                                                    Chart Pattern
                                                </div>
                                                <div className="text-base font-bold text-[#1a1a2e]">
                                                    {challenge.chartPattern}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-[#6b7280] leading-relaxed">
                                            {challenge.description}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 mt-4">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); router.push(`/practice-zone/${challenge.slug}`); }}
                                            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r ${challenge.gradient} hover:shadow-lg transition-all cursor-pointer`}>
                                            🎯 Challenge AI
                                        </button>
                                        <button className="px-4 py-2.5 rounded-xl text-sm font-medium text-[#6b7280] bg-white border border-[rgba(0,0,0,0.08)] hover:bg-[#f3f0ed] transition-all cursor-pointer">
                                            Flip ↩
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* How It Works section */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="dash-card p-6"
            >
                <h3 className="text-base font-bold text-[#1a1a2e] mb-4">How Practice Zone Works</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { step: "1", title: "Pick a Challenge", desc: "Choose from trading scenarios across categories", icon: "🎯" },
                        { step: "2", title: "Analyze the Chart", desc: "Study the historical chart and breaking news", icon: "📊" },
                        { step: "3", title: "Make Your Call", desc: "Predict if the stock goes UP or DOWN", icon: "⬆️" },
                        { step: "4", title: "Beat the AI", desc: "Compare your prediction against the AI model", icon: "🤖" },
                    ].map((item) => (
                        <div key={item.step} className="text-center p-3">
                            <div className="w-10 h-10 rounded-full bg-[#6B1D3A]/10 flex items-center justify-center text-xl mx-auto mb-2">
                                {item.icon}
                            </div>
                            <div className="text-sm font-semibold text-[#1a1a2e] mb-1">{item.title}</div>
                            <div className="text-xs text-[#9ca3af]">{item.desc}</div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </DashboardLayout>
    );
}
