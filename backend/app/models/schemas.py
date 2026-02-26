"""Pydantic models for API request/response schemas."""

from pydantic import BaseModel
from typing import Optional


# ── Chart Data ────────────────────────────────────────────────────────────────

class CandlestickBar(BaseModel):
    """Single OHLC candlestick bar."""
    time: int
    open: float
    high: float
    low: float
    close: float


class ChartDataResponse(BaseModel):
    """Response containing candlestick chart data."""
    scenario_slug: str
    asset_name: str
    bars: list[CandlestickBar]
    total_bars: int


# ── Scenario ──────────────────────────────────────────────────────────────────

class ScenarioResponse(BaseModel):
    """A single trading scenario."""
    slug: str
    title: str
    description: str
    asset_name: str
    news_headline: str
    news_body: str
    difficulty: str
    xp_reward: int
    chart_days: int
    reveal_days: int


class ScenarioListResponse(BaseModel):
    """List of available scenarios."""
    scenarios: list[ScenarioResponse]
    total: int


# ── ML Prediction ─────────────────────────────────────────────────────────────

class MLPredictionRequest(BaseModel):
    """Request body for ML prediction."""
    scenario_slug: str


class MLPredictionResponse(BaseModel):
    """Response from the ML prediction engine."""
    scenario_slug: str
    prediction: str  # "UP" or "DOWN"
    confidence: float  # 0.0 - 1.0
    model_name: str
    reasoning: str


# ── User Prediction Submission ────────────────────────────────────────────────

class PredictionSubmitRequest(BaseModel):
    """User submitting their prediction."""
    scenario_slug: str
    user_prediction: str  # "UP" or "DOWN"


class PredictionResultResponse(BaseModel):
    """Full result after prediction reveal."""
    scenario_slug: str
    user_prediction: str
    ml_prediction: str
    actual_outcome: str
    is_user_correct: bool
    is_ml_correct: bool
    xp_earned: int
    reveal_bars: list[CandlestickBar]
    ai_explanation: Optional[dict] = None
