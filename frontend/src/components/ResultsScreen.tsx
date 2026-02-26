"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AIExplanation } from "@/lib/api";

interface Props {
    show: boolean;
    userPrediction: string;
    mlPrediction: string;
    actualOutcome: string;
    isUserCorrect: boolean;
    isMlCorrect: boolean;
    xpEarned: number;
    explanation: AIExplanation | null;
    onPlayAgain: () => void;
}

export default function ResultsScreen({
    show,
    userPrediction,
    mlPrediction,
    actualOutcome,
    isUserCorrect,
    isMlCorrect,
    xpEarned,
    explanation,
    onPlayAgain,
}: Props) {
    if (!show) return null;

    const winnerLabel =
        explanation?.winner === "both"
            ? "🤝 Both Called It!"
            : explanation?.winner === "user"
                ? "🏆 You Beat the AI!"
                : explanation?.winner === "ml"
                    ? "🤖 AI Wins This Round"
                    : "😅 Nobody Got It Right";

    const winnerGradient =
        explanation?.winner === "user"
            ? "from-[#22c55e] to-[#16a34a]"
            : explanation?.winner === "ml"
                ? "from-[#ef4444] to-[#dc2626]"
                : explanation?.winner === "both"
                    ? "from-[#D4A417] to-[#f59e0b]"
                    : "from-[#9ca3af] to-[#6b7280]";

    const winnerColor =
        explanation?.winner === "user"
            ? "#22c55e"
            : explanation?.winner === "ml"
                ? "#ef4444"
                : explanation?.winner === "both"
                    ? "#D4A417"
                    : "#6b7280";

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: "rgba(245, 240, 235, 0.85)", backdropFilter: "blur(16px)" }}
                >
                    <motion.div
                        initial={{ scale: 0.85, opacity: 0, y: 40 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.85, opacity: 0, y: 40 }}
                        transition={{ type: "spring", damping: 20, stiffness: 200 }}
                        className="dash-card w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
                    >
                        {/* Top gradient accent */}
                        <div className={`h-1.5 rounded-t-[18px] bg-gradient-to-r ${winnerGradient}`} />

                        {/* Header */}
                        <div className="text-center pt-6 pb-4 px-6">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                                className="text-5xl mb-3"
                            >
                                {explanation?.winner === "user"
                                    ? "🏆"
                                    : explanation?.winner === "ml"
                                        ? "🤖"
                                        : explanation?.winner === "both"
                                            ? "🤝"
                                            : "💡"}
                            </motion.div>
                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-2xl font-bold mb-1"
                                style={{ color: winnerColor }}
                            >
                                {winnerLabel}
                            </motion.h2>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fef3c7] text-[#92400e] text-sm font-semibold"
                            >
                                <span>⚡</span>
                                <span>+{xpEarned} XP Earned</span>
                            </motion.div>
                        </div>

                        {/* Scoreboard */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="grid grid-cols-3 gap-3 px-6 mb-5"
                        >
                            <ScoreCard
                                label="You"
                                prediction={userPrediction}
                                correct={isUserCorrect}
                                emoji="👤"
                            />
                            <ScoreCard
                                label="Actual"
                                prediction={actualOutcome}
                                correct={true}
                                emoji="📊"
                                isActual
                            />
                            <ScoreCard
                                label="AI Model"
                                prediction={mlPrediction}
                                correct={isMlCorrect}
                                emoji="🤖"
                            />
                        </motion.div>

                        {/* AI Explanation */}
                        {explanation && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="px-6 pb-6 space-y-3"
                            >
                                <ExplanationBlock
                                    icon="📈"
                                    title="What Happened"
                                    content={explanation.outcome_summary}
                                />
                                <ExplanationBlock
                                    icon="👤"
                                    title="Your Analysis"
                                    content={explanation.user_analysis}
                                />
                                <ExplanationBlock
                                    icon="🤖"
                                    title="AI Analysis"
                                    content={explanation.ml_analysis}
                                />
                                <ExplanationBlock
                                    icon="🎓"
                                    title="Key Takeaway"
                                    content={explanation.learning_takeaway}
                                    highlight
                                />
                                <ExplanationBlock
                                    icon="💡"
                                    title="Fun Fact"
                                    content={explanation.fun_fact}
                                />

                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={onPlayAgain}
                                    className="w-full mt-4 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-[#6B1D3A] to-[#a855f7] hover:shadow-[0_0_30px_rgba(107,29,58,0.3)] transition-all cursor-pointer text-base"
                                >
                                    🔄 Play Again
                                </motion.button>
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ── Sub-components ───────────────────────────────────────────────────────────

function ScoreCard({
    label,
    prediction,
    correct,
    emoji,
    isActual = false,
}: {
    label: string;
    prediction: string;
    correct: boolean;
    emoji: string;
    isActual?: boolean;
}) {
    const bgColor = isActual
        ? "bg-[#f0f0ff]"
        : correct
            ? "bg-[#f0fdf4]"
            : "bg-[#fef2f2]";

    const borderColor = isActual
        ? "border-[#818cf8]/30"
        : correct
            ? "border-[#22c55e]/30"
            : "border-[#ef4444]/30";

    const textColor = isActual
        ? "text-[#6366f1]"
        : correct
            ? "text-[#22c55e]"
            : "text-[#ef4444]";

    return (
        <div
            className={`rounded-xl p-4 text-center border ${bgColor} ${borderColor}`}
        >
            <div className="text-2xl mb-1">{emoji}</div>
            <div className="text-[11px] text-[#6b7280] font-medium mb-1">{label}</div>
            <div
                className={`text-lg font-bold flex items-center justify-center gap-1 ${textColor}`}
            >
                {prediction === "DOWN" ? "▼" : "▲"} {prediction}
            </div>
            {!isActual && (
                <div className={`text-[11px] mt-1 font-medium ${textColor}`}>
                    {correct ? "✅ Correct" : "❌ Wrong"}
                </div>
            )}
        </div>
    );
}

function ExplanationBlock({
    icon,
    title,
    content,
    highlight = false,
}: {
    icon: string;
    title: string;
    content: string;
    highlight?: boolean;
}) {
    return (
        <div
            className={`rounded-xl p-4 ${highlight
                ? "bg-gradient-to-r from-[#fef3c7] to-[#fffbeb] border border-[#D4A417]/20"
                : "bg-[#f9f6f3] border border-[rgba(0,0,0,0.04)]"
                }`}
        >
            <div className="flex items-center gap-2 mb-2">
                <span className="text-base">{icon}</span>
                <span className="text-sm font-semibold text-[#1a1a2e]">{title}</span>
            </div>
            <p className="text-sm text-[#6b7280] leading-relaxed">{content}</p>
        </div>
    );
}
