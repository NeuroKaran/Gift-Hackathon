"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { useSettings } from "@/lib/SettingsContext";

export default function SettingsPage() {
    const { settings, updateSettings, resetProgress, deleteAccount, loading } = useSettings();

    // Local form state — initialised from context
    const [name, setName] = useState(settings.name);
    const [email, setEmail] = useState(settings.email);
    const [notifications, setNotifications] = useState(settings.notifications);
    const [soundEffects, setSoundEffects] = useState(settings.soundEffects);
    const [difficulty, setDifficulty] = useState(settings.difficulty);
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Sync local state when context finishes loading
    useEffect(() => {
        if (!loading) {
            setName(settings.name);
            setEmail(settings.email);
            setNotifications(settings.notifications);
            setSoundEffects(settings.soundEffects);
            setDifficulty(settings.difficulty);
        }
    }, [loading, settings]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateSettings({ name, email, notifications, soundEffects, difficulty });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (err) {
            console.error("Failed to save settings:", err);
        } finally {
            setSaving(false);
        }
    };

    const handleReset = async () => {
        await resetProgress();
        setShowResetConfirm(false);
    };

    const handleDelete = async () => {
        await deleteAccount();
        setShowDeleteConfirm(false);
        // Sync local form to reset defaults
        setName("Karan");
        setEmail("karan@example.com");
        setNotifications(true);
        setSoundEffects(true);
        setDifficulty("intermediate");
    };

    const hasChanges =
        name !== settings.name ||
        email !== settings.email ||
        notifications !== settings.notifications ||
        soundEffects !== settings.soundEffects ||
        difficulty !== settings.difficulty;

    return (
        <DashboardLayout>
            {/* Success Toast */}
            <AnimatePresence>
                {saved && (
                    <motion.div
                        initial={{ opacity: 0, y: -40, x: 0 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        transition={{ type: "spring", stiffness: 300, damping: 24 }}
                        className="toast-container"
                    >
                        <div className="toast">
                            <div className="toast-icon">✓</div>
                            Settings saved successfully!
                            <div className="toast-bar" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-[#1a1a2e] mb-1">Settings</h1>
                <p className="text-sm text-[#6b7280] mb-6">Manage your account and preferences</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }} className="dash-card p-6">
                    <h3 className="text-base font-bold text-[#1a1a2e] mb-4 flex items-center gap-2">
                        👤 Profile
                    </h3>
                    <div className="flex items-center gap-4 mb-5">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#6B1D3A] to-[#D4A417] flex items-center justify-center text-white text-2xl font-bold">
                            {name[0] || "?"}
                        </div>
                        <button className="px-4 py-2 rounded-xl text-sm font-medium text-[#6B1D3A] bg-[#6B1D3A]/8 hover:bg-[#6B1D3A]/15 transition-colors cursor-pointer">
                            Change Avatar
                        </button>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-semibold text-[#6b7280] mb-1">Display Name</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-[rgba(0,0,0,0.08)] bg-[#f9f6f3] text-sm text-[#1a1a2e] outline-none focus:border-[#6B1D3A] focus:ring-2 focus:ring-[#6B1D3A]/10 transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-[#6b7280] mb-1">Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-[rgba(0,0,0,0.08)] bg-[#f9f6f3] text-sm text-[#1a1a2e] outline-none focus:border-[#6B1D3A] focus:ring-2 focus:ring-[#6B1D3A]/10 transition-all" />
                        </div>
                    </div>
                </motion.div>

                {/* Preferences */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }} className="dash-card p-6">
                    <h3 className="text-base font-bold text-[#1a1a2e] mb-4 flex items-center gap-2">
                        ⚙️ Preferences
                    </h3>
                    <div className="space-y-4">
                        {/* Toggles */}
                        {[
                            { label: "Push Notifications", desc: "Get notified about new scenarios", value: notifications, set: setNotifications },
                            { label: "Sound Effects", desc: "Play sounds during trading", value: soundEffects, set: setSoundEffects },
                        ].map(toggle => (
                            <div key={toggle.label} className="flex items-center justify-between py-2">
                                <div>
                                    <div className="text-sm font-medium text-[#1a1a2e]">{toggle.label}</div>
                                    <div className="text-xs text-[#9ca3af]">{toggle.desc}</div>
                                </div>
                                <button onClick={() => toggle.set(!toggle.value)}
                                    className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative ${toggle.value ? "bg-[#6B1D3A]" : "bg-[#e5e2df]"}`}>
                                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${toggle.value ? "translate-x-5.5" : "translate-x-0.5"}`} />
                                </button>
                            </div>
                        ))}
                        {/* Difficulty */}
                        <div className="pt-2">
                            <div className="text-sm font-medium text-[#1a1a2e] mb-2">Default Difficulty</div>
                            <div className="flex gap-2">
                                {["beginner", "intermediate", "advanced"].map(d => (
                                    <button key={d} onClick={() => setDifficulty(d)}
                                        className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-all cursor-pointer ${difficulty === d
                                            ? "bg-[#6B1D3A] text-white shadow-lg shadow-[#6B1D3A]/20"
                                            : "bg-[#f3f0ed] text-[#6b7280] hover:bg-[#ebe7e3]"}`}>
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Danger zone */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }} className="dash-card p-6 border-l-4 border-l-[#ef4444]">
                    <h3 className="text-base font-bold text-[#1a1a2e] mb-2 flex items-center gap-2">
                        ⚠️ Danger Zone
                    </h3>
                    <p className="text-sm text-[#6b7280] mb-4">These actions are irreversible.</p>
                    <div className="flex gap-3">
                        <button onClick={() => setShowResetConfirm(true)}
                            className="px-4 py-2 rounded-xl text-sm font-medium text-[#ef4444] bg-[#fef2f2] hover:bg-[#fee2e2] transition-colors cursor-pointer">
                            Reset Progress
                        </button>
                        <button onClick={() => setShowDeleteConfirm(true)}
                            className="px-4 py-2 rounded-xl text-sm font-medium text-[#ef4444] bg-[#fef2f2] hover:bg-[#fee2e2] transition-colors cursor-pointer">
                            Delete Account
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Save button */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="mt-6 flex items-center gap-4">
                <button onClick={handleSave} disabled={saving || (!hasChanges && !saved)}
                    className={`px-8 py-3 rounded-xl font-semibold text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${saved
                        ? "bg-[#22c55e] shadow-lg shadow-[#22c55e]/20"
                        : "bg-gradient-to-r from-[#6B1D3A] to-[#a855f7] hover:shadow-lg hover:shadow-[#6B1D3A]/20"}`}>
                    {saving ? "⏳ Saving..." : saved ? "✅ Saved!" : "💾 Save Changes"}
                </button>
                {hasChanges && !saved && (
                    <span className="text-xs text-[#f97316] font-medium animate-pulse">● Unsaved changes</span>
                )}
            </motion.div>

            {/* Reset Confirmation Modal */}
            <AnimatePresence>
                {showResetConfirm && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
                        onClick={() => setShowResetConfirm(false)}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-2xl"
                            onClick={e => e.stopPropagation()}>
                            <h3 className="text-lg font-bold text-[#1a1a2e] mb-2">Reset Progress?</h3>
                            <p className="text-sm text-[#6b7280] mb-5">
                                This will reset your XP to 0 and level to 1. Your profile information will be kept.
                            </p>
                            <div className="flex gap-3 justify-end">
                                <button onClick={() => setShowResetConfirm(false)}
                                    className="px-4 py-2 rounded-xl text-sm font-medium text-[#6b7280] bg-[#f3f0ed] hover:bg-[#ebe7e3] transition-colors cursor-pointer">
                                    Cancel
                                </button>
                                <button onClick={handleReset}
                                    className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-[#ef4444] hover:bg-[#dc2626] transition-colors cursor-pointer">
                                    Yes, Reset
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
                        onClick={() => setShowDeleteConfirm(false)}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-2xl"
                            onClick={e => e.stopPropagation()}>
                            <h3 className="text-lg font-bold text-[#1a1a2e] mb-2">Delete Account?</h3>
                            <p className="text-sm text-[#6b7280] mb-5">
                                This will permanently reset all data including your profile, progress, and preferences to defaults.
                            </p>
                            <div className="flex gap-3 justify-end">
                                <button onClick={() => setShowDeleteConfirm(false)}
                                    className="px-4 py-2 rounded-xl text-sm font-medium text-[#6b7280] bg-[#f3f0ed] hover:bg-[#ebe7e3] transition-colors cursor-pointer">
                                    Cancel
                                </button>
                                <button onClick={handleDelete}
                                    className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-[#ef4444] hover:bg-[#dc2626] transition-colors cursor-pointer">
                                    Yes, Delete Everything
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}
