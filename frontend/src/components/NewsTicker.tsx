"use client";

import { motion } from "framer-motion";

interface Props {
    headline: string;
    body: string;
    assetName: string;
}

export default function NewsTicker({ headline, body, assetName }: Props) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="dash-card overflow-hidden"
        >
            {/* Breaking news bar */}
            <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-[#6B1D3A]/8 via-[#6B1D3A]/4 to-transparent border-b border-[rgba(0,0,0,0.06)]">
                <span className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ef4444] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ef4444]"></span>
                    </span>
                    <span className="text-[#6B1D3A] font-bold text-xs tracking-widest uppercase">
                        Breaking
                    </span>
                </span>
                <span className="text-[10px] font-mono text-[#9ca3af]">{assetName}</span>
            </div>

            {/* Headline */}
            <div className="px-5 py-4">
                <h3 className="text-base font-semibold text-[#1a1a2e] leading-relaxed mb-2">
                    {headline}
                </h3>
                <p className="text-sm text-[#6b7280] leading-relaxed">
                    {body}
                </p>
            </div>

            {/* Scrolling ticker bar */}
            <div className="relative overflow-hidden h-8 bg-[#f9f6f3] border-t border-[rgba(0,0,0,0.04)]">
                <div className="ticker-animate absolute whitespace-nowrap flex items-center h-full gap-8 text-xs font-mono text-[#9ca3af]">
                    <span>⚡ {headline}</span>
                    <span className="text-[#ef4444]">▼ {assetName} -8.42%</span>
                    <span>📊 Volume surge detected</span>
                    <span className="text-[#D4A417]">⚠ Analyst downgrade imminent</span>
                    <span>🔒 SEC investigation pending</span>
                    <span>⚡ {headline}</span>
                </div>
            </div>
        </motion.div>
    );
}
