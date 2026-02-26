"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

/* ── Slide data ─────────────────────────────────────── */
const slides = [
  {
    id: 0,
    icon: null,        // uses logo
    title: "Welcome to TradeQuest",
    subtitle: "Predict. Compete. Conquer.",
    description:
      "Step into the AI-powered finance arena where every decision counts. Paper-trade real scenarios and sharpen your instincts.",
    gradient: "from-[#6B1D3A] via-[#8B2D4A] to-[#D4A417]",
  },
  {
    id: 1,
    icon: "📈",
    title: "AI-Powered Challenges",
    subtitle: "Battle a Real ML Model",
    description:
      "Predict whether a stock will go up or down — then watch as our machine-learning engine makes its own call. Beat the AI to earn bonus XP.",
    gradient: "from-[#22c55e] via-[#16a34a] to-[#2EC4B6]",
  },
  {
    id: 2,
    icon: "🏆",
    title: "Climb the Leaderboard",
    subtitle: "Earn XP & Unlock Badges",
    description:
      "Complete scenarios, maintain streaks, and rack up experience points. Rise through the ranks and prove you've got what it takes.",
    gradient: "from-[#D4A417] via-[#f97316] to-[#ec4899]",
  },
  {
    id: 3,
    icon: "🚀",
    title: "Ready to Trade?",
    subtitle: "Your Journey Starts Now",
    description:
      "Create your free account in seconds and enter the arena. No real money needed — just pure skill and strategy.",
    gradient: "from-[#6366f1] via-[#8b5cf6] to-[#ec4899]",
  },
];

/* ── Floating particles ────────────────────────────── */
function Particles() {
  return (
    <div className="particles-container">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="particle"
          initial={{
            x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
            y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
            opacity: 0,
          }}
          animate={{
            y: [null, Math.random() * -400 - 100],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 6 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: "easeInOut",
          }}
          style={{
            width: 4 + Math.random() * 8,
            height: 4 + Math.random() * 8,
            borderRadius: "50%",
            background: `hsla(${330 + Math.random() * 60}, 70%, 60%, 0.4)`,
            position: "absolute",
          }}
        />
      ))}
    </div>
  );
}

/* ── Main component ───────────────────────────────── */
export default function OnboardingPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const goTo = useCallback((idx: number) => {
    setCurrent((prev) => {
      setDirection(idx > prev ? 1 : -1);
      return idx;
    });
    resetTimer();
  }, [resetTimer]);

  const next = useCallback(() => {
    setCurrent((prev) => {
      if (prev >= slides.length - 1) return prev;
      setDirection(1);
      return prev + 1;
    });
  }, []);

  // auto-advance every 5 s
  useEffect(() => {
    if (current >= slides.length - 1) {
      resetTimer();
      return;
    }
    timerRef.current = setTimeout(next, 5000);
    return () => { resetTimer(); };
  }, [current, next, resetTimer]);

  const handleGetStarted = () => router.push("/auth");

  const slide = slides[current];

  /* ── Framer variants ──────────────────────────────── */
  const cardVariants = {
    enter: (d: number) => ({
      x: d > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.92,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
    exit: (d: number) => ({
      x: d > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.92,
      transition: { duration: 0.35 },
    }),
  };

  return (
    <div className="onboarding-root">
      {/* Animated gradient background */}
      <div className={`onboarding-bg bg-gradient-to-br ${slide.gradient}`} />
      <div className="onboarding-noise" />

      <Particles />

      {/* Skip button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        onClick={handleGetStarted}
        className="onboarding-skip"
      >
        Skip →
      </motion.button>

      {/* Center content */}
      <div className="onboarding-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="onboarding-card"
          >
            {/* Icon / Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.15 }}
              className="onboarding-icon"
            >
              {slide.icon ? (
                <span className="text-6xl">{slide.icon}</span>
              ) : (
                <Image
                  src="/logo.png"
                  alt="TradeQuest"
                  width={88}
                  height={88}
                  className="rounded-2xl shadow-lg"
                  priority
                />
              )}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="onboarding-title"
            >
              {slide.title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="onboarding-subtitle"
            >
              {slide.subtitle}
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="onboarding-desc"
            >
              {slide.description}
            </motion.p>

            {/* CTA on last slide */}
            {current === slides.length - 1 && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleGetStarted}
                className="onboarding-cta"
              >
                <span>Get Started</span>
                <span className="ml-2">→</span>
              </motion.button>
            )}

            {/* Next button on other slides */}
            {current < slides.length - 1 && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={next}
                className="onboarding-next"
              >
                Next
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Dot indicators */}
        <div className="onboarding-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`onboarding-dot ${i === current ? "active" : ""}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
