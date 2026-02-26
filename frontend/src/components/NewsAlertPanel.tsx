"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Types ─────────────────────────────────────────────────────────────────── */

export interface NewsAlert {
    id: string;
    severity: "critical" | "high" | "medium";
    headline: string;
    impact_summary: string;
    affected_sectors: string[];
    recommended_action: string;
    asset_name: string;
    source: string;
    url: string;
    image_url?: string;
    timestamp: string;
}

/* ── Severity config ──────────────────────────────────────────────────────── */

const SEVERITY = {
    critical: {
        label: "CRITICAL",
        color: "#ef4444",
        bg: "rgba(239,68,68,0.08)",
        border: "rgba(239,68,68,0.25)",
        icon: "🔴",
    },
    high: {
        label: "HIGH",
        color: "#f59e0b",
        bg: "rgba(245,158,11,0.08)",
        border: "rgba(245,158,11,0.25)",
        icon: "🟠",
    },
    medium: {
        label: "MEDIUM",
        color: "#3b82f6",
        bg: "rgba(59,130,246,0.08)",
        border: "rgba(59,130,246,0.25)",
        icon: "🔵",
    },
};

/* ── Time helper ──────────────────────────────────────────────────────────── */

function timeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

/* ── Alert Card ───────────────────────────────────────────────────────────── */

function AlertCard({ alert, index }: { alert: NewsAlert; index: number }) {
    const sev = SEVERITY[alert.severity] || SEVERITY.medium;

    return (
        <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ delay: index * 0.06, duration: 0.3 }}
            className="alert-card"
            style={{ borderLeftColor: sev.color }}
        >
            {/* Header row */}
            <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                    <span
                        className="alert-severity-badge"
                        style={{ color: sev.color, background: sev.bg, borderColor: sev.border }}
                    >
                        {sev.icon} {sev.label}
                    </span>
                    {alert.source && (
                        <span className="text-[10px] text-[#9ca3af] font-medium truncate max-w-[100px]">
                            {alert.source}
                        </span>
                    )}
                </div>
                <span className="text-[10px] text-[#9ca3af] font-mono flex-shrink-0">{timeAgo(alert.timestamp)}</span>
            </div>

            {/* Content row with optional thumbnail */}
            <div className="flex gap-3">
                <div className="flex-1 min-w-0">
                    {/* Headline */}
                    <h4 className="text-[13px] font-semibold text-[#1a1a2e] leading-snug mb-1">
                        {alert.headline}
                    </h4>

                    {/* Impact */}
                    <p className="text-[12px] text-[#6b7280] leading-relaxed mb-2">
                        {alert.impact_summary}
                    </p>
                </div>

                {/* Thumbnail */}
                {alert.image_url && (
                    <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-[#f3f0ed]">
                        <img
                            src={alert.image_url}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                    </div>
                )}
            </div>

            {/* Footer: sectors + asset */}
            <div className="flex flex-wrap items-center gap-1.5">
                <span className="alert-sector-tag font-semibold">{alert.asset_name}</span>
                {alert.affected_sectors.map((s) => (
                    <span key={s} className="alert-sector-tag">{s}</span>
                ))}
            </div>

            {/* Recommended action */}
            <div className="mt-2 px-2.5 py-1.5 rounded-lg bg-[#f9f6f3] text-[11px] text-[#78350f] font-medium leading-snug flex items-center justify-between">
                <span>💡 {alert.recommended_action}</span>
                {alert.url && (
                    <a
                        href={alert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#6B1D3A] font-semibold hover:underline ml-2 flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                    >
                        Read →
                    </a>
                )}
            </div>
        </motion.div>
    );
}

/* ── Toast notification ───────────────────────────────────────────────────── */

export function AlertToast({ alert, onDismiss }: { alert: NewsAlert | null; onDismiss: () => void }) {
    useEffect(() => {
        if (!alert) return;
        const t = setTimeout(onDismiss, 5000);
        return () => clearTimeout(t);
    }, [alert, onDismiss]);

    return (
        <AnimatePresence>
            {alert && (
                <motion.div
                    initial={{ opacity: 0, y: -60, x: 20 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, y: -60 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    className="alert-toast"
                    onClick={onDismiss}
                >
                    <div className="flex items-center gap-2">
                        <span className="alert-toast-pulse" />
                        <span className="text-[11px] font-bold text-[#6B1D3A] uppercase tracking-wider">
                            Live Market Alert
                        </span>
                        {alert.source && (
                            <span className="text-[10px] text-[#9ca3af] font-medium">
                                via {alert.source}
                            </span>
                        )}
                    </div>
                    <p className="text-[12px] font-medium text-[#1a1a2e] leading-snug mt-1 line-clamp-2">
                        {alert.headline}
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/* ── Main Panel ───────────────────────────────────────────────────────────── */

interface Props {
    isOpen: boolean;
    onClose: () => void;
    alerts: NewsAlert[];
}

export default function NewsAlertPanel({ isOpen, onClose, alerts }: Props) {
    const panelRef = useRef<HTMLDivElement>(null);

    /* Click-outside dismiss */
    useEffect(() => {
        if (!isOpen) return;
        function handleClick(e: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                onClose();
            }
        }
        // Delay to prevent the open-click from immediately closing
        const t = setTimeout(() => document.addEventListener("mousedown", handleClick), 50);
        return () => {
            clearTimeout(t);
            document.removeEventListener("mousedown", handleClick);
        };
    }, [isOpen, onClose]);

    const criticalCount = alerts.filter((a) => a.severity === "critical").length;
    const highCount = alerts.filter((a) => a.severity === "high").length;

    // Collect unique sources
    const sources = [...new Set(alerts.map((a) => a.source).filter(Boolean))];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={panelRef}
                    initial={{ opacity: 0, y: -16, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -16, scale: 0.96 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="alert-panel"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-[rgba(0,0,0,0.06)]">
                        <div>
                            <h3 className="text-sm font-bold text-[#1a1a2e] flex items-center gap-2">
                                📡 Live News Intelligence
                            </h3>
                            <p className="text-[10px] text-[#9ca3af] mt-0.5">
                                {alerts.length} alert{alerts.length !== 1 ? "s" : ""} •{" "}
                                {criticalCount > 0 && <span className="text-[#ef4444] font-semibold">{criticalCount} critical</span>}
                                {criticalCount > 0 && highCount > 0 && " • "}
                                {highCount > 0 && <span className="text-[#f59e0b] font-semibold">{highCount} high</span>}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9ca3af] hover:bg-[#f3f0ed] hover:text-[#1a1a2e] transition-colors cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Alert list */}
                    <div className="alert-panel-body">
                        {alerts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <span className="text-3xl mb-3">📭</span>
                                <p className="text-sm text-[#9ca3af] font-medium">No alerts right now</p>
                                <p className="text-[11px] text-[#c4c0bc] mt-1">
                                    Market intelligence is monitoring live sources…
                                </p>
                            </div>
                        ) : (
                            alerts.map((alert, i) => (
                                <AlertCard key={alert.id} alert={alert} index={i} />
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-5 py-2.5 border-t border-[rgba(0,0,0,0.06)] text-center">
                        <span className="text-[10px] text-[#c4c0bc] font-medium">
                            Finnhub + Gemini AI • {sources.length > 0 ? `${sources.length} sources` : "Auto-refreshing"}
                        </span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
