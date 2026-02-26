"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import DashboardLayout from "@/components/DashboardLayout";
import NewsTicker from "@/components/NewsTicker";
import PredictionButtons from "@/components/PredictionButtons";
import ResultsScreen from "@/components/ResultsScreen";
import {
  fetchScenario,
  fetchChartData,
  submitPrediction,
  Scenario,
  CandlestickBar,
  PredictionResult,
} from "@/lib/api";

// Dynamic import for chart (no SSR — uses canvas)
const CandlestickChart = dynamic(
  () => import("@/components/CandlestickChart"),
  { ssr: false }
);

type GamePhase = "loading" | "predict" | "revealing" | "results";

const SCENARIO_SLUG = "zero-day-vulnerability";

const streakDays = [
  { label: "Day 1", active: true },
  { label: "Day 2", active: true },
  { label: "Day 3", active: true },
  { label: "Day 4", active: false },
  { label: "Day 5", active: false },
  { label: "Day 6", active: false },
  { label: "Day 7", active: false },
];

export default function Playground() {
  const [phase, setPhase] = useState<GamePhase>("loading");
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [bars, setBars] = useState<CandlestickBar[]>([]);
  const [revealBars, setRevealBars] = useState<CandlestickBar[]>([]);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadScenario = useCallback(async () => {
    try {
      setPhase("loading");
      setResult(null);
      setRevealBars([]);
      setError(null);
      const [scenarioData, chartData] = await Promise.all([
        fetchScenario(SCENARIO_SLUG),
        fetchChartData(SCENARIO_SLUG, "pre"),
      ]);
      setScenario(scenarioData);
      setBars(chartData.bars);
      setPhase("predict");
    } catch (err) {
      setError("Failed to load scenario. Is the backend running on port 8000?");
      console.error(err);
    }
  }, []);

  useEffect(() => { loadScenario(); }, [loadScenario]);

  const handlePredict = async (direction: "UP" | "DOWN") => {
    if (!scenario) return;
    setPhase("revealing");
    try {
      const predictionResult = await submitPrediction(SCENARIO_SLUG, direction);
      setResult(predictionResult);
      setRevealBars(predictionResult.reveal_bars);
      setTimeout(() => { setPhase("results"); }, 5 * 600 + 800);
    } catch (err) {
      setError("Failed to submit prediction. Please try again.");
      setPhase("predict");
      console.error(err);
    }
  };

  const handlePlayAgain = () => { loadScenario(); };

  return (
    <DashboardLayout xp={result ? result.xp_earned : 0}>
      {/* Weekly Streaks */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="dash-card px-6 py-4 mb-6"
      >
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-sm font-semibold text-[#1a1a2e]">Weekly Streaks</h3>
          <span className="text-[#9ca3af] text-xs cursor-help">ⓘ</span>
        </div>
        <div className="flex items-center gap-6">
          {streakDays.map((day, i) => (
            <div key={i} className={`streak-day ${day.active ? "" : "inactive"}`}>
              <span className="flame">🔥</span>
              <span>{day.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Error state */}
      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="dash-card p-6 text-center mb-6 border-l-4 border-l-[#ef4444]">
          <p className="text-[#ef4444] mb-3 font-medium">{error}</p>
          <button onClick={loadScenario}
            className="px-4 py-2 rounded-xl bg-[#ef4444] text-white hover:bg-[#dc2626] transition-colors cursor-pointer font-medium text-sm">
            Retry
          </button>
        </motion.div>
      )}

      {/* Loading */}
      {phase === "loading" && !error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="w-12 h-12 border-3 border-[#f3f0ed] border-t-[#6B1D3A] rounded-full animate-spin" />
          <p className="text-sm text-[#9ca3af] font-medium">Loading scenario...</p>
        </motion.div>
      )}

      {/* Game content */}
      {phase !== "loading" && scenario && !error && (
        <AnimatePresence mode="wait">
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            {/* Scenario title bar */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }} className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-3 py-1 rounded-lg bg-[#6B1D3A]/10 text-[#6B1D3A] text-[11px] font-semibold uppercase tracking-wider">
                    {scenario.difficulty}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-[#fef3c7] text-[#92400e] text-[11px] font-semibold">
                    +{scenario.xp_reward} XP
                  </span>
                </div>
                <h2 className="text-xl font-bold text-[#1a1a2e]">{scenario.title}</h2>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-[#9ca3af] mb-0.5 font-medium">Trading</div>
                <div className="font-mono text-sm font-semibold text-[#1a1a2e]">{scenario.asset_name}</div>
              </div>
            </motion.div>

            {/* Chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <CandlestickChart bars={bars}
                revealBars={phase === "revealing" || phase === "results" ? revealBars : undefined}
                animateReveal={phase === "revealing"} />
            </motion.div>

            {/* Chart info */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
              className="flex items-center justify-between text-xs text-[#9ca3af] font-mono px-1">
              <span>📅 30-Day Historical Chart</span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#22c55e]" /> Bullish
                <span className="w-2 h-2 rounded-full bg-[#ef4444] ml-2" /> Bearish
              </span>
            </motion.div>

            {/* News ticker */}
            <NewsTicker headline={scenario.news_headline} body={scenario.news_body} assetName={scenario.asset_name} />

            {/* Prediction buttons */}
            {(phase === "predict" || phase === "revealing") && (
              <div className="py-4">
                <PredictionButtons onPredict={handlePredict} disabled={phase === "revealing"} />
              </div>
            )}

            {/* Revealing */}
            {phase === "revealing" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-[#f3f0ed] border-t-[#6B1D3A] rounded-full animate-spin" />
                  <span className="text-sm text-[#6b7280] font-medium">Fast-forwarding 5 days...</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Results overlay */}
      {result && (
        <ResultsScreen show={phase === "results"} userPrediction={result.user_prediction}
          mlPrediction={result.ml_prediction} actualOutcome={result.actual_outcome}
          isUserCorrect={result.is_user_correct} isMlCorrect={result.is_ml_correct}
          xpEarned={result.xp_earned} explanation={result.ai_explanation} onPlayAgain={handlePlayAgain} />
      )}
    </DashboardLayout>
  );
}
