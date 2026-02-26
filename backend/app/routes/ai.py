"""AI explanation routes — standalone endpoint for Game Master analysis."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from app.services.gemini_service import generate_game_master_explanation

router = APIRouter(prefix="/api/ai", tags=["ai"])


class ExplainRequest(BaseModel):
    """Request body for AI explanation."""
    scenario_slug: str
    scenario_title: str
    scenario_description: str
    news_headline: str
    asset_name: str
    actual_outcome: str
    user_prediction: str
    ml_prediction: str
    ml_confidence: float = 0.87


class ExplainResponse(BaseModel):
    """Structured Game Master response."""
    winner: str
    outcome_summary: str
    user_analysis: str
    ml_analysis: str
    learning_takeaway: str
    fun_fact: str


@router.post("/explain", response_model=ExplainResponse)
async def get_ai_explanation(body: ExplainRequest):
    """
    Generate the Game Master's AI-powered explanation for a prediction outcome.

    This endpoint calls Google Gemini to produce an engaging, educational
    analysis of the scenario result.
    """
    result = await generate_game_master_explanation(
        scenario_title=body.scenario_title,
        scenario_description=body.scenario_description,
        news_headline=body.news_headline,
        asset_name=body.asset_name,
        actual_outcome=body.actual_outcome,
        user_prediction=body.user_prediction,
        ml_prediction=body.ml_prediction,
        ml_confidence=body.ml_confidence,
    )

    return ExplainResponse(**result)
