"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSettings } from "@/lib/SettingsContext";

interface SidebarProps {
    xp: number;
}

const tradingLinks = [
    { label: "Dashboard", icon: "📊", href: "/" },
    { label: "Scenarios", icon: "🎯", href: "/scenarios" },
    { label: "History", icon: "📜", href: "/history" },
];

const learningLinks = [
    { label: "Practice Zone", icon: "🏋️", href: "/practice-zone" },
    { label: "Leaderboard", icon: "🏆", href: "/leaderboard" },
];

const accountLinks = [
    { label: "Settings", icon: "⚙️", href: "/settings" },
    { label: "Help Centre", icon: "❓", href: "/help" },
];

export default function Sidebar({ xp }: SidebarProps) {
    const pathname = usePathname();
    const { settings } = useSettings();

    const renderLinks = (links: { label: string; icon: string; href: string }[]) =>
        links.map((link) => (
            <Link
                key={link.label}
                href={link.href}
                className={`sidebar-link ${pathname === link.href ? "active" : ""}`}
            >
                <span className="text-base">{link.icon}</span>
                <span>{link.label}</span>
            </Link>
        ));

    return (
        <motion.aside
            initial={{ x: -240, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="sidebar"
        >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 px-2 mb-6 no-underline">
                <Image
                    src="/logo.png"
                    alt="TradeQuest Logo"
                    width={52}
                    height={52}
                    className="rounded-xl shadow-lg"
                    priority
                />
                <div>
                    <h1 className="text-lg font-bold text-[#1a1a2e] tracking-tight leading-none">
                        Trade<span className="font-extrabold">QUEST</span>
                    </h1>
                    <p className="text-[10px] text-[#9ca3af] font-medium">
                        AI Trading Arena
                    </p>
                </div>
            </Link>

            {/* XP Badge */}
            <div className="mx-2 mb-4 px-4 py-3 rounded-xl bg-gradient-to-r from-[#fef3c7] to-[#fde68a] border border-[#D4A417]/20">
                <div className="flex items-center gap-2">
                    <span className="text-lg">⚡</span>
                    <div>
                        <div className="text-xs font-medium text-[#92400e]">Your XP</div>
                        <div className="text-lg font-bold text-[#78350f]">{xp}</div>
                    </div>
                </div>
            </div>

            {/* Trading Section */}
            <div className="sidebar-section-title">Trading</div>
            {renderLinks(tradingLinks)}

            {/* Learning Section */}
            <div className="sidebar-section-title">Learning</div>
            {renderLinks(learningLinks)}

            {/* Account Section */}
            <div className="sidebar-section-title">Account</div>
            {renderLinks(accountLinks)}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Level indicator at bottom */}
            <div className="mx-2 mt-4 px-4 py-3 rounded-xl bg-[#f3f0ed]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6B1D3A] to-[#D4A417] flex items-center justify-center text-white text-xs font-bold">
                        {settings.level}
                    </div>
                    <div>
                        <div className="text-xs font-semibold text-[#1a1a2e]">Level {settings.level}</div>
                        <div className="text-[10px] text-[#9ca3af]">{settings.levelTitle}</div>
                    </div>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-[#e5e2df] overflow-hidden">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-[#6B1D3A] to-[#D4A417]"
                        style={{ width: `${Math.min((settings.xp / 500) * 100, 100)}%` }}
                    />
                </div>
            </div>
        </motion.aside>
    );
}

