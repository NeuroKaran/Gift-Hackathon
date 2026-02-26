"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";

const faqs = [
    {
        q: "How does TradeQuest work?",
        a: "TradeQuest presents you with real-world trading scenarios. You analyze historical chart data and breaking news, then predict whether the stock will go UP or DOWN. Your prediction is compared against an AI model, and you earn XP based on your accuracy.",
        icon: "🎮",
    },
    {
        q: "How is XP calculated?",
        a: "You earn full XP for correct predictions (e.g., +150 XP for a beginner scenario). If both you and the AI are wrong, you earn a small consolation XP. Bonus XP is awarded for streaks and beating the AI consistently.",
        icon: "⚡",
    },
    {
        q: "What is the Practice Zone?",
        a: "The Practice Zone offers flashcard-style trading challenges. Each card presents a different scenario with unique chart patterns. Flip the card to see the description, then challenge the AI to a head-to-head prediction battle.",
        icon: "🏋️",
    },
    {
        q: "How does the AI make predictions?",
        a: "The AI model uses a combination of sentiment analysis from the news text and pattern recognition from historical chart data. It evaluates the scenario context and makes an independent UP/DOWN prediction, just like you.",
        icon: "🤖",
    },
    {
        q: "Are these real stock prices?",
        a: "The scenarios use simulated data inspired by real-world events. No real money is involved — TradeQuest is a paper trading platform designed purely for learning and entertainment.",
        icon: "📊",
    },
    {
        q: "How do I unlock new scenarios?",
        a: "Complete available scenarios to unlock more advanced ones. As you level up, harder scenarios with higher XP rewards become available. Some scenarios require reaching a specific level or win streak.",
        icon: "🔓",
    },
    {
        q: "Can I reset my progress?",
        a: "Yes, you can reset your progress from the Settings page. This will clear all your trade history, XP, and level. This action is irreversible.",
        icon: "🔄",
    },
];

export default function HelpPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    return (
        <DashboardLayout>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-[#1a1a2e] mb-1">Help Centre</h1>
                <p className="text-sm text-[#6b7280] mb-6">Everything you need to know about TradeQuest</p>
            </motion.div>

            {/* Quick links */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                    { title: "Getting Started", desc: "Learn the basics of TradeQuest", icon: "🚀", color: "from-[#22c55e] to-[#16a34a]" },
                    { title: "Trading Guide", desc: "Master chart analysis techniques", icon: "📈", color: "from-[#6366f1] to-[#4f46e5]" },
                    { title: "Contact Support", desc: "Reach out to our team", icon: "💬", color: "from-[#f97316] to-[#ea580c]" },
                ].map((card) => (
                    <div key={card.title}
                        className={`rounded-2xl bg-gradient-to-br ${card.color} p-5 text-white cursor-pointer hover:shadow-lg transition-shadow`}>
                        <div className="text-3xl mb-2">{card.icon}</div>
                        <div className="font-bold text-base mb-1">{card.title}</div>
                        <div className="text-sm opacity-80">{card.desc}</div>
                    </div>
                ))}
            </motion.div>

            {/* FAQ accordion */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}>
                <h2 className="text-lg font-bold text-[#1a1a2e] mb-4">Frequently Asked Questions</h2>
                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <motion.div key={i}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            transition={{ delay: 0.25 + i * 0.05 }}
                            className="dash-card overflow-hidden">
                            <button
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                className="w-full flex items-center gap-3 px-5 py-4 text-left cursor-pointer hover:bg-[#f9f6f3] transition-colors"
                            >
                                <span className="text-xl">{faq.icon}</span>
                                <span className="flex-1 text-sm font-semibold text-[#1a1a2e]">{faq.q}</span>
                                <svg
                                    className={`w-4 h-4 text-[#9ca3af] transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <AnimatePresence>
                                {openFaq === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="px-5 pb-4 pl-12 text-sm text-[#6b7280] leading-relaxed">
                                            {faq.a}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </DashboardLayout>
    );
}
