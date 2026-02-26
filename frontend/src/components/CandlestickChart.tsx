"use client";

import { useEffect, useRef } from "react";
import { createChart, CandlestickSeries, IChartApi, CandlestickData, Time } from "lightweight-charts";

interface CandlestickBar {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
}

interface Props {
    bars: CandlestickBar[];
    revealBars?: CandlestickBar[];
    animateReveal?: boolean;
}

export default function CandlestickChart({ bars, revealBars, animateReveal }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Clear previous chart
        if (chartRef.current) {
            chartRef.current.remove();
            chartRef.current = null;
        }

        const chart = createChart(containerRef.current, {
            width: containerRef.current.clientWidth,
            height: 420,
            layout: {
                background: { color: "#ffffff" },
                textColor: "#6b7280",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
            },
            grid: {
                vertLines: { color: "rgba(0, 0, 0, 0.04)" },
                horzLines: { color: "rgba(0, 0, 0, 0.04)" },
            },
            crosshair: {
                vertLine: { color: "rgba(107, 29, 58, 0.2)", labelBackgroundColor: "#6B1D3A" },
                horzLine: { color: "rgba(107, 29, 58, 0.2)", labelBackgroundColor: "#6B1D3A" },
            },
            rightPriceScale: {
                borderColor: "rgba(0, 0, 0, 0.06)",
            },
            timeScale: {
                borderColor: "rgba(0, 0, 0, 0.06)",
                timeVisible: false,
            },
        });

        chartRef.current = chart;

        // v5 API: use addSeries with CandlestickSeries type
        const candleSeries = chart.addSeries(CandlestickSeries, {
            upColor: "#22c55e",
            downColor: "#ef4444",
            borderDownColor: "#ef4444",
            borderUpColor: "#22c55e",
            wickDownColor: "#ef4444",
            wickUpColor: "#22c55e",
        });

        // Convert timestamps to chart data
        const chartData: CandlestickData<Time>[] = bars.map((b) => ({
            time: b.time as Time,
            open: b.open,
            high: b.high,
            low: b.low,
            close: b.close,
        }));

        candleSeries.setData(chartData);

        // Animate reveal bars one at a time
        if (revealBars && revealBars.length > 0 && animateReveal) {
            revealBars.forEach((bar, i) => {
                setTimeout(() => {
                    const newBar: CandlestickData<Time> = {
                        time: bar.time as Time,
                        open: bar.open,
                        high: bar.high,
                        low: bar.low,
                        close: bar.close,
                    };
                    candleSeries.update(newBar);
                    chart.timeScale().scrollToRealTime();
                }, (i + 1) * 600);
            });
        }

        chart.timeScale().fitContent();

        // Handle resize
        const handleResize = () => {
            if (containerRef.current && chartRef.current) {
                chartRef.current.applyOptions({
                    width: containerRef.current.clientWidth,
                });
            }
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            chart.remove();
            chartRef.current = null;
        };
    }, [bars, revealBars, animateReveal]);

    return (
        <div className="dash-card p-1 relative overflow-hidden">
            {/* Subtle top accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-gradient-to-r from-transparent via-[#6B1D3A]/30 to-transparent" />
            <div ref={containerRef} className="w-full" />
        </div>
    );
}
