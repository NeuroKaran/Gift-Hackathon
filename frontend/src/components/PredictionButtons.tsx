"use client";

import { motion } from "framer-motion";

interface Props {
    onPredict: (direction: "UP" | "DOWN") => void;
    disabled: boolean;
}

export default function PredictionButtons({ onPredict, disabled }: Props) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center gap-5"
        >
            <h3 className="text-lg font-semibold text-[#1a1a2e]">
                What&apos;s your call, Trader?
            </h3>
            <p className="text-sm text-[#6b7280] mb-1">
                How will the stock react to this news?
            </p>
            <div className="flex gap-5 w-full max-w-lg">
                {/* PREDICT UP — Green gradient card like SkillStreet challenge */}
                <motion.button
                    whileHover={{ scale: disabled ? 1 : 1.03 }}
                    whileTap={{ scale: disabled ? 1 : 0.97 }}
                    onClick={() => !disabled && onPredict("UP")}
                    disabled={disabled}
                    className={`
                        relative flex-1 rounded-2xl font-bold text-lg
                        transition-all duration-300 cursor-pointer overflow-hidden
                        ${disabled
                            ? "opacity-40 cursor-not-allowed"
                            : ""
                        }
                    `}
                >
                    <div className={`gradient-card-green p-6 ${disabled ? "opacity-50" : ""}`}>
                        <div className="text-left mb-3">
                            <div className="text-xl font-extrabold uppercase tracking-wide">
                                Predict UP
                            </div>
                            <div className="text-sm font-normal opacity-80 mt-1">
                                Bullish • Stock will rise
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                            <span className="px-3 py-1 rounded-lg bg-white/20 text-xs font-semibold backdrop-blur-sm">
                                ▲ Bullish
                            </span>
                            <span className="px-3 py-1 rounded-lg bg-white/20 text-xs font-semibold backdrop-blur-sm flex items-center gap-1">
                                🎯 Predict
                            </span>
                        </div>
                    </div>
                </motion.button>

                {/* PREDICT DOWN — Red gradient card like SkillStreet challenge */}
                <motion.button
                    whileHover={{ scale: disabled ? 1 : 1.03 }}
                    whileTap={{ scale: disabled ? 1 : 0.97 }}
                    onClick={() => !disabled && onPredict("DOWN")}
                    disabled={disabled}
                    className={`
                        relative flex-1 rounded-2xl font-bold text-lg
                        transition-all duration-300 cursor-pointer overflow-hidden
                        ${disabled
                            ? "opacity-40 cursor-not-allowed"
                            : ""
                        }
                    `}
                >
                    <div className={`gradient-card-red p-6 ${disabled ? "opacity-50" : ""}`}>
                        <div className="text-left mb-3">
                            <div className="text-xl font-extrabold uppercase tracking-wide">
                                Predict DOWN
                            </div>
                            <div className="text-sm font-normal opacity-80 mt-1">
                                Bearish • Stock will fall
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                            <span className="px-3 py-1 rounded-lg bg-white/20 text-xs font-semibold backdrop-blur-sm">
                                ▼ Bearish
                            </span>
                            <span className="px-3 py-1 rounded-lg bg-white/20 text-xs font-semibold backdrop-blur-sm flex items-center gap-1">
                                🎯 Predict
                            </span>
                        </div>
                    </div>
                </motion.button>
            </div>
        </motion.div>
    );
}
