"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import NewsAlertPanel, { AlertToast } from "@/components/NewsAlertPanel";
import { useSettings } from "@/lib/SettingsContext";
import { fetchNewsAlerts, subscribeToAlertStream } from "@/lib/api";
import type { NewsAlert } from "@/lib/api";

interface DashboardLayoutProps {
    children: React.ReactNode;
    xp?: number;
}

export default function DashboardLayout({ children, xp }: DashboardLayoutProps) {
    const { settings } = useSettings();
    const displayXp = xp !== undefined ? xp : settings.xp;

    /* ── Alert state ──────────────────────────────────────────────────── */
    const [alerts, setAlerts] = useState<NewsAlert[]>([]);
    const [panelOpen, setPanelOpen] = useState(false);
    const [toastAlert, setToastAlert] = useState<NewsAlert | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);

    /* Load initial alerts */
    useEffect(() => {
        fetchNewsAlerts()
            .then((list) => {
                setAlerts(list);
                setUnreadCount(list.length);
            })
            .catch((err) => console.error("[News] Failed to load alerts:", err));
    }, []);

    /* SSE stream for live alerts */
    useEffect(() => {
        const cleanup = subscribeToAlertStream((newAlert) => {
            setAlerts((prev) => {
                // Avoid duplicates
                if (prev.some((a) => a.id === newAlert.id)) return prev;
                return [newAlert, ...prev];
            });
            setUnreadCount((c) => c + 1);
            setToastAlert(newAlert);
        });
        return cleanup;
    }, []);

    const handleBellClick = useCallback(() => {
        setPanelOpen((v) => !v);
        if (!panelOpen) setUnreadCount(0);     // mark as read when opening
    }, [panelOpen]);

    const dismissToast = useCallback(() => setToastAlert(null), []);

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
                            id="search-scenarios"
                            name="search-scenarios"
                            type="text"
                            placeholder="Search scenarios, assets and materials"
                            className="search-input"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        {/* ── Bell button (toggles alert panel) ─── */}
                        <div className="relative">
                            <button
                                id="alert-bell-button"
                                onClick={handleBellClick}
                                className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${panelOpen
                                        ? "bg-[#6B1D3A]/10 text-[#6B1D3A]"
                                        : "bg-[#f3f0ed] text-[#6b7280] hover:bg-[#ebe7e3]"
                                    }`}
                            >
                                🔔
                                {unreadCount > 0 && (
                                    <span className="alert-bell-badge">
                                        {unreadCount > 9 ? "9+" : unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Alert panel (positioned below bell) */}
                            <NewsAlertPanel
                                isOpen={panelOpen}
                                onClose={() => setPanelOpen(false)}
                                alerts={alerts}
                            />
                        </div>

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

            {/* Toast notifications (top-right, fixed) */}
            <AlertToast alert={toastAlert} onDismiss={dismissToast} />
        </div>
    );
}
