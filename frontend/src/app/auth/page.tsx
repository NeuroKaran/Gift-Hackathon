"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

type AuthMode = "signin" | "signup";

export default function AuthPage() {
    const router = useRouter();
    const [mode, setMode] = useState<AuthMode>("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const toggleMode = () => {
        setMode(mode === "signin" ? "signup" : "signin");
        setError(null);
        setSuccess(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            if (mode === "signup") {
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { data: { display_name: name || email.split("@")[0] } },
                });
                if (signUpError) throw signUpError;
                setSuccess("Account created! Redirecting...");
                setTimeout(() => router.push("/playground"), 1200);
            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (signInError) throw signInError;
                router.push("/playground");
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Something went wrong";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-root">
            {/* Success Toast */}
            <AnimatePresence>
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -40, x: 0 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        transition={{ type: "spring", stiffness: 300, damping: 24 }}
                        className="toast-container"
                    >
                        <div className="toast">
                            <div className="toast-icon">✓</div>
                            {success}
                            <div className="toast-bar" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Gradient background */}
            <div className="auth-bg" />
            <div className="onboarding-noise" />

            {/* Floating orbs */}
            <motion.div
                className="auth-orb auth-orb-1"
                animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="auth-orb auth-orb-2"
                animate={{ y: [0, 25, 0], x: [0, -15, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="auth-orb auth-orb-3"
                animate={{ y: [0, -20, 0], x: [0, -25, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="auth-card"
            >
                {/* Logo */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.15 }}
                    className="flex flex-col items-center gap-3 mb-2"
                >
                    <Image
                        src="/logo.png"
                        alt="TradeQuest"
                        width={64}
                        height={64}
                        className="rounded-xl shadow-lg"
                        priority
                    />
                    <h1 className="text-2xl font-bold text-[#1a1a2e] tracking-tight">
                        Trade<span className="font-extrabold">QUEST</span>
                    </h1>
                </motion.div>

                {/* Mode tabs */}
                <div className="auth-tabs">
                    <button
                        onClick={() => { setMode("signin"); setError(null); setSuccess(null); }}
                        className={`auth-tab ${mode === "signin" ? "active" : ""}`}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => { setMode("signup"); setError(null); setSuccess(null); }}
                        className={`auth-tab ${mode === "signup" ? "active" : ""}`}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Form */}
                <AnimatePresence mode="wait">
                    <motion.form
                        key={mode}
                        initial={{ opacity: 0, x: mode === "signup" ? 30 : -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: mode === "signup" ? -30 : 30 }}
                        transition={{ duration: 0.3 }}
                        onSubmit={handleSubmit}
                        className="auth-form"
                    >
                        {mode === "signup" && (
                            <div className="auth-field">
                                <label htmlFor="auth-name">Display Name</label>
                                <input
                                    id="auth-name"
                                    type="text"
                                    placeholder="Your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="auth-input"
                                />
                            </div>
                        )}

                        <div className="auth-field">
                            <label htmlFor="auth-email">Email</label>
                            <input
                                id="auth-email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="auth-input"
                            />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="auth-password">Password</label>
                            <input
                                id="auth-password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="auth-input"
                            />
                        </div>

                        {/* Error / Success */}
                        <AnimatePresence>
                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="auth-error"
                                >
                                    {error}
                                </motion.p>
                            )}
                            {success && (
                                <motion.p
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="auth-success"
                                >
                                    {success}
                                </motion.p>
                            )}
                        </AnimatePresence>

                        {/* Submit */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            type="submit"
                            disabled={loading}
                            className="auth-submit"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : mode === "signin" ? (
                                "Sign In"
                            ) : (
                                "Create Account"
                            )}
                        </motion.button>
                    </motion.form>
                </AnimatePresence>

                {/* Toggle */}
                <p className="auth-toggle">
                    {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button onClick={toggleMode} className="auth-toggle-btn">
                        {mode === "signin" ? "Sign Up" : "Sign In"}
                    </button>
                </p>
            </motion.div>
        </div>
    );
}
