"use client";

import Sidebar from "@/components/Sidebar";
import { useSettings } from "@/lib/SettingsContext";

interface DashboardLayoutProps {
    children: React.ReactNode;
    xp?: number;
}

export default function DashboardLayout({ children, xp }: DashboardLayoutProps) {
    const { settings } = useSettings();
    const displayXp = xp !== undefined ? xp : settings.xp;

    return (
        <div className="min-h-screen bg-ambient flex">
            {/* Sidebar */}
            <Sidebar xp={displayXp} />

            {/* Main area */}
            <div className="flex-1 ml-[240px] relative z-10">
                {/* Top Header */}
                <div className="top-header">
                    <div className="relative">
                        <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search scenarios, assets and materials"
                            className="search-input"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative w-10 h-10 rounded-xl bg-[#f3f0ed] flex items-center justify-center text-[#6b7280] hover:bg-[#ebe7e3] transition-colors">
                            🔔
                            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ef4444] text-white text-[10px] flex items-center justify-center font-bold">
                                2
                            </span>
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-[rgba(0,0,0,0.06)]">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6B1D3A] to-[#D4A417] flex items-center justify-center text-white text-sm font-bold">
                                {settings.name[0]}
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-semibold text-[#1a1a2e]">{settings.name}</div>
                                <div className="text-[10px] text-[#9ca3af]">Trader</div>
                            </div>
                            <svg
                                className="w-4 h-4 text-[#9ca3af]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <div className="px-8 py-6 max-w-6xl">
                    {children}
                </div>
            </div>
        </div>
    );
}

