"""Scenario routes — serve scenario metadata and chart data."""

from fastapi import APIRouter, HTTPException

from app.models.schemas import (
    ScenarioResponse,
    ScenarioListResponse,
    ChartDataResponse,
    PredictionResultResponse,
    PredictionSubmitRequest,
)
from app.data.mock_chart_data import get_pre_event_data, get_post_event_data
from app.services.gemini_service import generate_game_master_explanation

router = APIRouter(prefix="/api/scenarios", tags=["scenarios"])

# ── In-memory scenario registry ─────────────────────────────────────────────

SCENARIOS: dict[str, dict] = {
    "zero-day-vulnerability": {
        "slug": "zero-day-vulnerability",
        "title": "The Zero-Day Vulnerability",
        "description": (
            "A major cybersecurity breach rocks the tech industry. A zero-day "
            "exploit has been discovered in enterprise defense networks, "
            "compromising critical infrastructure worldwide."
        ),
        "asset_name": "CYBERFORT (CBFT)",
        "news_headline": (
            "🚨 BREAKING: Major cybersecurity breach. Hackers exploit a "
            "zero-day vulnerability, compromising enterprise defense networks."
        ),
        "news_body": (
            "Security researchers have confirmed that a sophisticated threat "
            "actor has exploited a previously unknown vulnerability in "
            "CyberFort's flagship enterprise defense platform. The breach has "
            "affected over 2,000 organizations globally, including Fortune 500 "
            "companies and government agencies. CyberFort's stock is under "
            "intense scrutiny as investors assess the damage."
        ),
        "difficulty": "beginner",
        "actual_outcome": "DOWN",
        "ml_prediction": "DOWN",
        "ml_confidence": 0.87,
        "xp_reward": 150,
        "chart_days": 30,
        "reveal_days": 5,
    },
    "earnings-surprise-rally": {
        "slug": "earnings-surprise-rally",
        "title": "Earnings Surprise Rally",
        "description": (
            "A tech giant beats earnings estimates by 40%, shattering analyst "
            "expectations. Revenue growth accelerated and guidance was raised. "
            "Will the momentum carry forward?"
        ),
        "asset_name": "NVIDIA (NVDA)",
        "news_headline": (
            "🚀 BREAKING: NVIDIA smashes Q3 earnings — revenue up 94% YoY, "
            "beats estimates by 40%."
        ),
        "news_body": (
            "NVIDIA reported record quarterly revenue of $18.1B, driven by "
            "explosive AI chip demand. Data center revenue tripled year-over-year. "
            "The company raised Q4 guidance well above Wall Street estimates. "
            "Analysts are upgrading price targets across the board."
        ),
        "difficulty": "beginner",
        "actual_outcome": "UP",
        "ml_prediction": "UP",
        "ml_confidence": 0.92,
        "xp_reward": 100,
        "chart_days": 30,
        "reveal_days": 5,
    },
    "interest-rate-shock": {
        "slug": "interest-rate-shock",
        "title": "Interest Rate Shock",
        "description": (
            "The Federal Reserve announces an unexpected 50 basis point rate "
            "hike amid persistent inflation, defying market expectations of "
            "a pause."
        ),
        "asset_name": "S&P 500 (SPY)",
        "news_headline": (
            "⚠️ BREAKING: Fed surprises markets with 50bp rate hike — "
            "signals more tightening ahead."
        ),
        "news_body": (
            "The Federal Reserve raised interest rates by 50 basis points in a "
            "move that stunned financial markets. Chair Powell cited persistent "
            "core inflation and a tight labor market. Bond yields surged as "
            "traders repriced rate expectations. Growth stocks are under "
            "significant selling pressure."
        ),
        "difficulty": "intermediate",
        "actual_outcome": "DOWN",
        "ml_prediction": "DOWN",
        "ml_confidence": 0.78,
        "xp_reward": 200,
        "chart_days": 30,
        "reveal_days": 5,
    },
    "crypto-flash-crash": {
        "slug": "crypto-flash-crash",
        "title": "Crypto Flash Crash",
        "description": (
            "A major cryptocurrency exchange faces a catastrophic security "
            "breach. Billions in user funds may be compromised. Panic spreads "
            "across the crypto market."
        ),
        "asset_name": "Bitcoin (BTC)",
        "news_headline": (
            "🔴 BREAKING: Major crypto exchange hacked — $2.3B in user funds "
            "potentially compromised."
        ),
        "news_body": (
            "CryptoVault, the world's third-largest exchange by volume, has "
            "confirmed a security breach affecting hot wallets. Withdrawals "
            "are frozen. On-chain analysts report large outflows to unknown "
            "wallets. The hack echoes the FTX collapse and has triggered "
            "widespread fear across the crypto ecosystem."
        ),
        "difficulty": "advanced",
        "actual_outcome": "DOWN",
        "ml_prediction": "DOWN",
        "ml_confidence": 0.84,
        "xp_reward": 350,
        "chart_days": 30,
        "reveal_days": 5,
    },
    "oil-supply-disruption": {
        "slug": "oil-supply-disruption",
        "title": "Oil Supply Disruption",
        "description": (
            "OPEC+ announces a surprise production cut of 2 million barrels "
            "per day, far exceeding market expectations. Global energy markets "
            "are rattled."
        ),
        "asset_name": "Crude Oil (CL)",
        "news_headline": (
            "🛢️ BREAKING: OPEC+ slashes output by 2M bpd — biggest cut "
            "since COVID pandemic."
        ),
        "news_body": (
            "OPEC+ ministers agreed to a surprise production cut of 2 million "
            "barrels per day starting next month. The decision came despite "
            "pressure from Western nations to increase supply. Saudi Arabia's "
            "energy minister cited market stability concerns. Energy analysts "
            "warn of $100+ oil prices if cuts are sustained."
        ),
        "difficulty": "intermediate",
        "actual_outcome": "UP",
        "ml_prediction": "UP",
        "ml_confidence": 0.81,
        "xp_reward": 250,
        "chart_days": 30,
        "reveal_days": 5,
    },
    "tech-ipo-frenzy": {
        "slug": "tech-ipo-frenzy",
        "title": "Tech IPO Frenzy",
        "description": (
            "A hot AI startup goes public at a massive valuation. First-day "
            "trading sees enormous volume. Is it sustainable growth or peak "
            "hype?"
        ),
        "asset_name": "AI Startup (AIUP)",
        "news_headline": (
            "🔥 BREAKING: AI startup AIUP surges 80% on IPO day — valued "
            "at $45B with no profits."
        ),
        "news_body": (
            "AIUP, an AI infrastructure company, priced its IPO at $42 and "
            "soared to $76 in first-day trading. The company has $200M in "
            "annual revenue but has never been profitable. Insiders face a "
            "90-day lockup. Some analysts warn of frothy valuations while "
            "AI bulls say it's still early innings."
        ),
        "difficulty": "beginner",
        "actual_outcome": "DOWN",
        "ml_prediction": "DOWN",
        "ml_confidence": 0.69,
        "xp_reward": 150,
        "chart_days": 30,
        "reveal_days": 5,
    },
    "currency-war": {
        "slug": "currency-war",
        "title": "Currency War",
        "description": (
            "US-EU trade tensions escalate dramatically. New tariffs are "
            "announced and retaliatory measures are expected. Currency markets "
            "brace for impact."
        ),
        "asset_name": "EUR/USD",
        "news_headline": (
            "💱 BREAKING: US imposes 25% tariffs on EU goods — Brussels "
            "vows retaliation within 48 hours."
        ),
        "news_body": (
            "The US has imposed broad 25% tariffs on EU industrial goods, "
            "citing unfair trade practices. The European Commission called the "
            "move 'unjustified' and is preparing retaliatory tariffs on US tech "
            "and agriculture exports. Currency traders are repositioning "
            "as safe-haven flows intensify."
        ),
        "difficulty": "advanced",
        "actual_outcome": "DOWN",
        "ml_prediction": "DOWN",
        "ml_confidence": 0.73,
        "xp_reward": 400,
        "chart_days": 30,
        "reveal_days": 5,
    },
}


# ── GET /api/scenarios ───────────────────────────────────────────────────────
@router.get("", response_model=ScenarioListResponse)
async def list_scenarios():
    """Return all available trading scenarios."""
    scenarios = [ScenarioResponse(**s) for s in SCENARIOS.values()]
    return ScenarioListResponse(scenarios=scenarios, total=len(scenarios))


# ── GET /api/scenarios/{slug} ────────────────────────────────────────────────
@router.get("/{slug}", response_model=ScenarioResponse)
async def get_scenario(slug: str):
    """Return a single scenario by slug."""
    scenario = SCENARIOS.get(slug)
    if not scenario:
        raise HTTPException(status_code=404, detail=f"Scenario '{slug}' not found")
    return ScenarioResponse(**scenario)


# ── GET /api/scenarios/{slug}/chart ──────────────────────────────────────────
@router.get("/{slug}/chart", response_model=ChartDataResponse)
async def get_scenario_chart(slug: str, phase: str = "pre"):
    """
    Return OHLC chart data for a scenario.

    Query params:
        phase: "pre" (default) — 30 bars before the event
               "post" — 5 bars after the event (reveal)
    """
    scenario = SCENARIOS.get(slug)
    if not scenario:
        raise HTTPException(status_code=404, detail=f"Scenario '{slug}' not found")

    if phase == "pre":
        bars = get_pre_event_data(slug)
    elif phase == "post":
        bars = get_post_event_data(slug)
    else:
        raise HTTPException(status_code=400, detail="phase must be 'pre' or 'post'")

    return ChartDataResponse(
        scenario_slug=slug,
        asset_name=scenario["asset_name"],
        bars=bars,
        total_bars=len(bars),
    )


# ── POST /api/scenarios/{slug}/predict ───────────────────────────────────────
@router.post("/{slug}/predict", response_model=PredictionResultResponse)
async def submit_prediction(slug: str, body: PredictionSubmitRequest):
    """
    Submit a user prediction and get the reveal result.

    Returns the actual outcome, ML prediction, reveal chart bars,
    AI-generated Game Master explanation, and correctness flags.
    """
    scenario = SCENARIOS.get(slug)
    if not scenario:
        raise HTTPException(status_code=404, detail=f"Scenario '{slug}' not found")

    if body.user_prediction not in ("UP", "DOWN"):
        raise HTTPException(status_code=400, detail="Prediction must be 'UP' or 'DOWN'")

    actual = scenario["actual_outcome"]
    ml_pred = scenario["ml_prediction"]
    ml_confidence = scenario["ml_confidence"]

    # ── Call the Game Master AI ───────────────────────────────────────────
    ai_explanation = await generate_game_master_explanation(
        scenario_title=scenario["title"],
        scenario_description=scenario["description"],
        news_headline=scenario["news_headline"],
        asset_name=scenario["asset_name"],
        actual_outcome=actual,
        user_prediction=body.user_prediction,
        ml_prediction=ml_pred,
        ml_confidence=ml_confidence,
    )

    return PredictionResultResponse(
        scenario_slug=slug,
        user_prediction=body.user_prediction,
        ml_prediction=ml_pred,
        actual_outcome=actual,
        is_user_correct=(body.user_prediction == actual),
        is_ml_correct=(ml_pred == actual),
        xp_earned=scenario["xp_reward"] if body.user_prediction == actual else 25,
        reveal_bars=get_post_event_data(slug),
        ai_explanation=ai_explanation,
    )
