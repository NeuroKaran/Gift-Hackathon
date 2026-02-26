"""Gemini AI "Game Master" — generates intelligent post-prediction analysis.

Takes the scenario context, actual outcome, user prediction, and ML prediction,
then returns a structured JSON explanation with winner, summaries, and takeaways.
"""

import json
import google.generativeai as genai

from app.config import get_settings

settings = get_settings()

# ── Configure Gemini ─────────────────────────────────────────────────────────
genai.configure(api_key=settings.gemini_api_key)

_MODEL = genai.GenerativeModel(
    model_name="gemini-2.0-flash",
    generation_config={
        "temperature": 0.7,
        "top_p": 0.9,
        "max_output_tokens": 1024,
        "response_mime_type": "application/json",
    },
)

# ── System Prompt ─────────────────────────────────────────────────────────────
_SYSTEM_PROMPT = """You are the **Game Master** of TradeQuest, a gamified finance education platform.

Your role is to analyze the outcome of a stock prediction scenario and provide an engaging, educational explanation.

You will receive:
- **Scenario Context**: The news event and company details
- **Actual Outcome**: What really happened to the stock (UP or DOWN)
- **User's Prediction**: What the human player predicted
- **ML Prediction**: What the AI model predicted

You MUST respond with a valid JSON object with EXACTLY these keys:
{
  "winner": "user" | "ml" | "both" | "neither",
  "outcome_summary": "A 2-3 sentence dramatic summary of what happened to the stock and why.",
  "user_analysis": "2-3 sentences analyzing the user's prediction — why it was right/wrong, what reasoning they might have used.",
  "ml_analysis": "2-3 sentences analyzing the ML model's prediction — what data patterns it likely used.",
  "learning_takeaway": "A key finance/investment lesson from this scenario that the user should remember.",
  "fun_fact": "An interesting real-world parallel or finance fact related to this scenario."
}

RULES:
- Be engaging and encouraging, even if the user was wrong
- Use finance terminology but explain it simply
- Reference real-world parallels when relevant (e.g., SolarWinds, Equifax breaches)
- Keep each field concise — no more than 3 sentences per field
- The "winner" field must be exactly one of: "user", "ml", "both", "neither"
"""


async def generate_game_master_explanation(
    scenario_title: str,
    scenario_description: str,
    news_headline: str,
    asset_name: str,
    actual_outcome: str,
    user_prediction: str,
    ml_prediction: str,
    ml_confidence: float,
) -> dict:
    """
    Call Gemini to generate the Game Master's post-prediction analysis.

    Returns a dict with: winner, outcome_summary, user_analysis,
    ml_analysis, learning_takeaway, fun_fact.
    """
    user_prompt = f"""## Scenario: {scenario_title}

**Company:** {asset_name}
**News Event:** {news_headline}
**Context:** {scenario_description}

## Results
- **Actual Stock Movement:** {actual_outcome}
- **User's Prediction:** {user_prediction} {'✅ CORRECT' if user_prediction == actual_outcome else '❌ INCORRECT'}
- **ML Model Prediction:** {ml_prediction} (confidence: {ml_confidence:.0%}) {'✅ CORRECT' if ml_prediction == actual_outcome else '❌ INCORRECT'}

Analyze this outcome and provide your Game Master verdict."""

    try:
        response = await _MODEL.generate_content_async(
            [
                {"role": "user", "parts": [_SYSTEM_PROMPT]},
                {"role": "model", "parts": ["Understood. I am the Game Master. Send me a scenario and I will analyze it."]},
                {"role": "user", "parts": [user_prompt]},
            ]
        )

        # Parse the JSON response
        result = json.loads(response.text)

        # Validate required keys
        required_keys = {"winner", "outcome_summary", "user_analysis", "ml_analysis", "learning_takeaway", "fun_fact"}
        if not required_keys.issubset(result.keys()):
            missing = required_keys - result.keys()
            raise ValueError(f"Missing keys in Gemini response: {missing}")

        return result

    except json.JSONDecodeError:
        # Fallback if Gemini doesn't return valid JSON
        return _fallback_explanation(actual_outcome, user_prediction, ml_prediction)
    except Exception as e:
        print(f"[Game Master] Gemini error: {e}")
        return _fallback_explanation(actual_outcome, user_prediction, ml_prediction)


def _determine_winner(user_prediction: str, ml_prediction: str, actual: str) -> str:
    """Determine who won."""
    user_correct = user_prediction == actual
    ml_correct = ml_prediction == actual
    if user_correct and ml_correct:
        return "both"
    elif user_correct:
        return "user"
    elif ml_correct:
        return "ml"
    return "neither"


def _fallback_explanation(actual: str, user_pred: str, ml_pred: str) -> dict:
    """Fallback response when Gemini is unavailable."""
    winner = _determine_winner(user_pred, ml_pred, actual)
    return {
        "winner": winner,
        "outcome_summary": (
            f"The stock moved {actual} following the cybersecurity breach news. "
            "This is consistent with how markets typically react to major security incidents."
        ),
        "user_analysis": (
            f"You predicted {user_pred}. "
            + ("Great call! You correctly anticipated the market reaction." if user_pred == actual
               else "The market moved differently than you expected — a valuable learning moment.")
        ),
        "ml_analysis": (
            f"The ML model predicted {ml_pred} with its pattern-based analysis. "
            + ("The model's historical analysis proved accurate." if ml_pred == actual
               else "Even AI models can miss nuances in unprecedented events.")
        ),
        "learning_takeaway": (
            "Cybersecurity breaches almost always trigger a negative market reaction "
            "due to loss of customer trust, regulatory risk, and potential lawsuits."
        ),
        "fun_fact": (
            "After the 2017 Equifax breach, the stock dropped 35% in a single week, "
            "wiping out over $5 billion in market value."
        ),
    }
