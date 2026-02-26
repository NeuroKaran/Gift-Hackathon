"""Mock ML prediction routes."""

from fastapi import APIRouter, HTTPException

from app.models.schemas import MLPredictionRequest, MLPredictionResponse

router = APIRouter(prefix="/api/ml", tags=["ml"])

# ── Mock ML predictions per scenario ─────────────────────────────────────────
_ML_PREDICTIONS: dict[str, dict] = {
    "zero-day-vulnerability": {
        "prediction": "DOWN",
        "confidence": 0.87,
        "model_name": "TradeQuest-Sentinel-v1",
        "reasoning": (
            "Historical pattern analysis indicates that cybersecurity breaches "
            "in enterprise software companies lead to an average stock decline "
            "of 12-18% within the first week. Sentiment analysis of similar "
            "events shows overwhelming negative market reaction due to "
            "reputational damage, potential regulatory fines, and customer "
            "churn. The model assigns high confidence to a downward movement."
        ),
    }
}


# ── POST /api/ml/predict ─────────────────────────────────────────────────────
@router.post("/predict", response_model=MLPredictionResponse)
async def get_ml_prediction(body: MLPredictionRequest):
    """
    Return the ML model's prediction for a given scenario.

    This is currently a mock endpoint returning hardcoded predictions.
    In production, this would call a trained model.
    """
    prediction = _ML_PREDICTIONS.get(body.scenario_slug)
    if not prediction:
        raise HTTPException(
            status_code=404,
            detail=f"No ML prediction available for scenario '{body.scenario_slug}'",
        )

    return MLPredictionResponse(
        scenario_slug=body.scenario_slug,
        **prediction,
    )
