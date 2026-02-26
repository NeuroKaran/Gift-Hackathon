/**
 * API client for communicating with the FastAPI backend.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export interface CandlestickBar {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
}

export interface Scenario {
    slug: string;
    title: string;
    description: string;
    asset_name: string;
    news_headline: string;
    news_body: string;
    difficulty: string;
    xp_reward: number;
    chart_days: number;
    reveal_days: number;
}

export interface ChartData {
    scenario_slug: string;
    asset_name: string;
    bars: CandlestickBar[];
    total_bars: number;
}

export interface MLPrediction {
    scenario_slug: string;
    prediction: string;
    confidence: number;
    model_name: string;
    reasoning: string;
}

export interface AIExplanation {
    winner: "user" | "ml" | "both" | "neither";
    outcome_summary: string;
    user_analysis: string;
    ml_analysis: string;
    learning_takeaway: string;
    fun_fact: string;
}

export interface PredictionResult {
    scenario_slug: string;
    user_prediction: string;
    ml_prediction: string;
    actual_outcome: string;
    is_user_correct: boolean;
    is_ml_correct: boolean;
    xp_earned: number;
    reveal_bars: CandlestickBar[];
    ai_explanation: AIExplanation | null;
}

// ── Fetch helpers ──────────────────────────────────────────────────────────

export async function fetchScenario(slug: string): Promise<Scenario> {
    const res = await fetch(`${API_URL}/api/scenarios/${slug}`);
    if (!res.ok) throw new Error("Failed to fetch scenario");
    return res.json();
}

export async function fetchChartData(
    slug: string,
    phase: "pre" | "post" = "pre"
): Promise<ChartData> {
    const res = await fetch(
        `${API_URL}/api/scenarios/${slug}/chart?phase=${phase}`
    );
    if (!res.ok) throw new Error("Failed to fetch chart data");
    return res.json();
}

export async function fetchMLPrediction(slug: string): Promise<MLPrediction> {
    const res = await fetch(`${API_URL}/api/ml/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario_slug: slug }),
    });
    if (!res.ok) throw new Error("Failed to fetch ML prediction");
    return res.json();
}

export async function submitPrediction(
    slug: string,
    userPrediction: "UP" | "DOWN"
): Promise<PredictionResult> {
    const res = await fetch(`${API_URL}/api/scenarios/${slug}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            scenario_slug: slug,
            user_prediction: userPrediction,
        }),
    });
    if (!res.ok) throw new Error("Failed to submit prediction");
    return res.json();
}

// ── Settings ───────────────────────────────────────────────────────────────

export interface UserSettings {
    name: string;
    email: string;
    notifications: boolean;
    soundEffects: boolean;
    difficulty: string;
    xp: number;
    level: number;
    levelTitle: string;
}

export async function fetchSettings(): Promise<UserSettings> {
    const res = await fetch(`${API_URL}/api/settings`);
    if (!res.ok) throw new Error("Failed to fetch settings");
    return res.json();
}

export async function updateSettings(
    data: Partial<UserSettings>
): Promise<UserSettings> {
    const res = await fetch(`${API_URL}/api/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update settings");
    return res.json();
}

export async function resetProgress(): Promise<UserSettings> {
    const res = await fetch(`${API_URL}/api/settings/reset`, {
        method: "POST",
    });
    if (!res.ok) throw new Error("Failed to reset progress");
    return res.json();
}

export async function deleteAccount(): Promise<UserSettings> {
    const res = await fetch(`${API_URL}/api/settings/delete`, {
        method: "POST",
    });
    if (!res.ok) throw new Error("Failed to delete account");
    return res.json();
}

// ── News Intelligence ─────────────────────────────────────────────────────

export interface NewsAlert {
    id: string;
    severity: "critical" | "high" | "medium";
    headline: string;
    impact_summary: string;
    affected_sectors: string[];
    recommended_action: string;
    asset_name: string;
    source: string;         // publisher name (e.g. "Reuters")
    url: string;            // link to original article
    image_url?: string;     // article thumbnail
    timestamp: string;
}

export async function fetchNewsAlerts(): Promise<NewsAlert[]> {
    const res = await fetch(`${API_URL}/api/news/alerts`);
    if (!res.ok) throw new Error("Failed to fetch news alerts");
    const data = await res.json();
    return data.alerts;
}

/**
 * Open an SSE connection to /api/news/alerts/stream.
 * Returns a cleanup function. Calls `onAlert` for each new event.
 */
export function subscribeToAlertStream(onAlert: (alert: NewsAlert) => void): () => void {
    const es = new EventSource(`${API_URL}/api/news/alerts/stream`);

    es.onmessage = (event) => {
        try {
            const alert: NewsAlert = JSON.parse(event.data);
            onAlert(alert);
        } catch {
            // ignore parse errors
        }
    };

    es.onerror = () => {
        // EventSource auto-reconnects; nothing to do
    };

    return () => es.close();
}

