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

# ── In-memory scenario registry (seed data mirror) ──────────────────────────
SCENARIOS: dict[str, dict] = {
    "zero-day-vulnerability": {
        "slug": "zero-day-vulnerability",
        "title": "The Zero-Day Vulnerability",
        "description": (
            "A major cybersecurity breach rocks the tech industry. A zero-day "
            "exploit has been discovered in enterprise defense networks, "
            "compromising critical infrastructure worldwide. How will the "
            "market react?"
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
            "intense scrutiny as investors assess the damage to the company's "
            "reputation and the potential financial fallout from class-action "
            "lawsuits."
        ),
        "difficulty": "beginner",
        "actual_outcome": "DOWN",
        "xp_reward": 150,
        "chart_days": 30,
        "reveal_days": 5,
    }
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
        bars = get_pre_event_data()
    elif phase == "post":
        bars = get_post_event_data()
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
    ml_pred = "DOWN"  # Mock ML prediction for this scenario
    ml_confidence = 0.87

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
        reveal_bars=get_post_event_data(),
        ai_explanation=ai_explanation,
    )

