"use client";

import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";

const leaderboardData = [
    { rank: 1, name: "Alex T.", xp: 4250, wins: 38, streak: 12, avatar: "🧑‍💼", level: 8, badge: "🥇" },
    { rank: 2, name: "Priya M.", xp: 3980, wins: 35, streak: 8, avatar: "👩‍💻", level: 7, badge: "🥈" },
    { rank: 3, name: "Sam W.", xp: 3640, wins: 31, streak: 15, avatar: "🧑‍🎓", level: 7, badge: "🥉" },
    { rank: 4, name: "Maya R.", xp: 3120, wins: 27, streak: 6, avatar: "👩‍🔬", level: 6, badge: "" },
    { rank: 5, name: "Raj K.", xp: 2850, wins: 24, streak: 9, avatar: "🧑‍💻", level: 5, badge: "" },
    { rank: 6, name: "Emily C.", xp: 2340, wins: 20, streak: 4, avatar: "👩‍🎨", level: 5, badge: "" },
    { rank: 7, name: "Jordan L.", xp: 1980, wins: 18, streak: 7, avatar: "🧑‍🚀", level: 4, badge: "" },
    { rank: 8, name: "Karan", xp: 850, wins: 9, streak: 3, avatar: "🎯", level: 1, badge: "", isUser: true },
    { rank: 9, name: "Anna B.", xp: 720, wins: 7, streak: 2, avatar: "👩‍🏫", level: 1, badge: "" },
    { rank: 10, name: "Chris D.", xp: 480, wins: 4, streak: 1, avatar: "🧑‍🎤", level: 1, badge: "" },
];

const topThree = leaderboardData.slice(0, 3);

export default function LeaderboardPage() {
    return (
        <DashboardLayout>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-[#1a1a2e] mb-1">Leaderboard</h1>
                <p className="text-sm text-[#6b7280] mb-6">Compete with traders worldwide — climb the ranks!</p>
            </motion.div>

            {/* Top 3 podium */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-3 gap-4 mb-8">
                {[topThree[1], topThree[0], topThree[2]].map((player, i) => {
                    const podiumOrder = [2, 1, 3];
                    const heights = ["h-28", "h-36", "h-24"];
                    const gradients = [
                        "from-[#C0C0C0] to-[#a8a8a8]",
                        "from-[#D4A417] to-[#f59e0b]",
                        "from-[#CD7F32] to-[#b8722e]",
                    ];
                    return (
                        <motion.div key={player.rank}
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                            className="dash-card p-5 text-center flex flex-col items-center">
                            <div className="text-4xl mb-2">{player.avatar}</div>
                            <div className="text-2xl mb-1">{player.badge}</div>
                            <div className="font-bold text-[#1a1a2e] text-base">{player.name}</div>
                            <div className="text-xs text-[#9ca3af] mb-3">Level {player.level}</div>
                            <div className={`w-full ${heights[i]} rounded-xl bg-gradient-to-t ${gradients[i]} flex items-end justify-center pb-3`}>
                                <span className="text-white font-bold text-lg">#{podiumOrder[i]}</span>
                            </div>
                            <div className="mt-3 text-sm font-bold text-[#D4A417]">{player.xp} XP</div>
                            <div className="text-xs text-[#9ca3af]">{player.wins} wins • 🔥 {player.streak}</div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Full rankings table */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }} className="dash-card overflow-hidden">
                <div className="px-5 py-3 border-b border-[rgba(0,0,0,0.06)]">
                    <h3 className="text-sm font-semibold text-[#1a1a2e]">All Rankings</h3>
                </div>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-[rgba(0,0,0,0.06)]">
                            {["Rank", "Trader", "Level", "XP", "Wins", "Streak"].map(h => (
                                <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboardData.map((player, i) => (
                            <motion.tr key={player.rank}
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 + i * 0.04 }}
                                className={`border-b border-[rgba(0,0,0,0.03)] transition-colors ${player.isUser ? "bg-[#6B1D3A]/5" : "hover:bg-[#f9f6f3]"
                                    }`}>
                                <td className="px-5 py-3 font-bold text-[#D4A417]">
                                    {player.badge || `#${player.rank}`}
                                </td>
                                <td className="px-5 py-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{player.avatar}</span>
                                        <span className={`font-medium ${player.isUser ? "text-[#6B1D3A] font-bold" : "text-[#1a1a2e]"}`}>
                                            {player.name} {player.isUser && <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#6B1D3A] text-white ml-1">YOU</span>}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-5 py-3 text-[#6b7280]">Lv. {player.level}</td>
                                <td className="px-5 py-3 font-semibold text-[#D4A417]">{player.xp}</td>
                                <td className="px-5 py-3 text-[#22c55e] font-semibold">{player.wins}</td>
                                <td className="px-5 py-3">🔥 {player.streak}</td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>
        </DashboardLayout>
    );
}
