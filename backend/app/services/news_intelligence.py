"""News Intelligence Service — Finnhub + Gemini-powered live market alerts.

Fetches real financial news from Finnhub, then uses Gemini AI to analyze
each article for severity ranking and market-impact assessment.
"""

import json
import uuid
import hashlib
from datetime import datetime, timezone

import httpx
import google.generativeai as genai

from app.config import get_settings

settings = get_settings()

# ── Configure Gemini ─────────────────────────────────────────────────────────
genai.configure(api_key=settings.gemini_api_key)

_MODEL = genai.GenerativeModel(
    model_name="gemini-2.0-flash",
    generation_config={
        "temperature": 0.5,
        "top_p": 0.85,
        "max_output_tokens": 512,
        "response_mime_type": "application/json",
    },
)

# ── In-memory cache (keyed by article content hash) ──────────────────────────
_analysis_cache: dict[str, dict] = {}

# ── Finnhub config ───────────────────────────────────────────────────────────
_FINNHUB_BASE = "https://finnhub.io/api/v1"
_FINNHUB_KEY = settings.finnhub_api_key

_SYSTEM_PROMPT = """You are a **Market Intelligence Analyst** for TradeQuest, a finance education platform.

Your job is to analyze a real financial news article and produce a structured market-impact alert.

You will receive a news headline, summary, source, and related symbols.

You MUST respond with a valid JSON object with EXACTLY these keys:
{
  "severity": "critical" | "high" | "medium",
  "impact_summary": "1-2 sentence summary of the market impact and why traders should pay attention.",
  "affected_sectors": ["sector1", "sector2"],
  "recommended_action": "A concise 1-sentence recommendation for traders.",
  "asset_name": "The primary ticker or asset mentioned (e.g. 'AAPL', 'S&P 500', 'Bitcoin')"
}

RULES for severity:
- "critical": Events likely to cause >5% swings, systemic risks, or broad market panic
- "high": Events likely to cause 2-5% moves or significant sector rotation
- "medium": Events with moderate impact on specific assets or sectors

If no specific ticker is mentioned, use the most relevant broad market indicator.
Keep each field concise and actionable. Max 2 sectors in affected_sectors.
"""


async def fetch_finnhub_news(category: str = "general", limit: int = 15) -> list[dict]:
    """
    Fetch latest market news from the Finnhub API.

    Returns a list of raw article dicts from Finnhub.
    Falls back to an empty list on failure.
    """
    if not _FINNHUB_KEY:
        print("[News Intelligence] No FINNHUB_API_KEY configured — skipping live news")
        return []

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(
                f"{_FINNHUB_BASE}/news",
                params={"category": category, "token": _FINNHUB_KEY},
            )
            resp.raise_for_status()
            articles = resp.json()

            # Finnhub returns newest first; take top `limit`
            return articles[:limit] if isinstance(articles, list) else []

    except Exception as e:
        print(f"[News Intelligence] Finnhub fetch error: {e}")
        return []


def _article_hash(article: dict) -> str:
    """Create a stable hash for an article to use as cache key."""
    key = f"{article.get('id', '')}-{article.get('headline', '')}"
    return hashlib.md5(key.encode()).hexdigest()


async def analyze_article(article: dict) -> dict:
    """
    Use Gemini to analyze a Finnhub news article and produce an alert dict.

    Results are cached by article hash so repeated calls are free.
    """
    cache_key = _article_hash(article)
    if cache_key in _analysis_cache:
        return _analysis_cache[cache_key]

    headline = article.get("headline", "Financial News Update")
    summary = article.get("summary", "")
    source = article.get("source", "Unknown")
    related = ", ".join(article.get("related", "").split(",")[:3]) if article.get("related") else "General Market"

    user_prompt = f"""## Live Financial News

**Source:** {source}
**Headline:** {headline}
**Summary:** {summary}
**Related Symbols:** {related}

Analyze this news and produce your market-impact alert."""

    try:
        response = await _MODEL.generate_content_async(
            [
                {"role": "user", "parts": [_SYSTEM_PROMPT]},
                {"role": "model", "parts": ["Ready. Send me a news article to analyze."]},
                {"role": "user", "parts": [user_prompt]},
            ]
        )
        result = json.loads(response.text)

        # Validate required keys
        required = {"severity", "impact_summary", "affected_sectors", "recommended_action", "asset_name"}
        if not required.issubset(result.keys()):
            raise ValueError(f"Missing keys: {required - result.keys()}")

        # Normalise severity
        if result["severity"] not in ("critical", "high", "medium"):
            result["severity"] = "medium"

    except Exception as e:
        print(f"[News Intelligence] Gemini analysis error: {e}")
        result = _fallback_analysis(headline, related)

    _analysis_cache[cache_key] = result
    return result


def _fallback_analysis(headline: str, related: str) -> dict:
    """Deterministic fallback when Gemini is unavailable."""
    return {
        "severity": "medium",
        "impact_summary": f"Market-moving news detected. Monitor related assets for potential volatility.",
        "affected_sectors": ["Financials"],
        "recommended_action": "Review your portfolio and watch for further developments.",
        "asset_name": related if related != "General Market" else "Market",
    }


def build_live_alert(article: dict, analysis: dict) -> dict:
    """Assemble a full NewsAlert dict from a Finnhub article + Gemini analysis."""
    # Convert Finnhub UNIX timestamp to ISO string
    ts = article.get("datetime", 0)
    if ts:
        timestamp = datetime.fromtimestamp(ts, tz=timezone.utc).isoformat()
    else:
        timestamp = datetime.now(timezone.utc).isoformat()

    return {
        "id": str(uuid.uuid4()),
        "severity": analysis["severity"],
        "headline": article.get("headline", "Financial Update"),
        "impact_summary": analysis["impact_summary"],
        "affected_sectors": analysis["affected_sectors"],
        "recommended_action": analysis["recommended_action"],
        "asset_name": analysis["asset_name"],
        "source": article.get("source", "Unknown"),
        "url": article.get("url", ""),
        "image_url": article.get("image", None) or None,
        "timestamp": timestamp,
    }


# ──────────────────────────────────────────────────────────────────────────────
# Keep backwards-compatible helpers for scenario-based fallback
# ──────────────────────────────────────────────────────────────────────────────

async def analyze_scenario_news(
    scenario_slug: str,
    news_headline: str,
    news_body: str,
    asset_name: str,
) -> dict:
    """Fallback: analyze scenario data when Finnhub is unavailable."""
    fake_article = {
        "id": scenario_slug,
        "headline": news_headline,
        "summary": news_body,
        "source": "TradeQuest Scenario",
        "related": asset_name,
    }
    return await analyze_article(fake_article)


def build_alert_from_scenario(
    scenario_slug: str,
    headline: str,
    asset_name: str,
    analysis: dict,
) -> dict:
    """Fallback: build an alert from scenario data."""
    return {
        "id": str(uuid.uuid4()),
        "severity": analysis["severity"],
        "headline": headline,
        "impact_summary": analysis["impact_summary"],
        "affected_sectors": analysis["affected_sectors"],
        "recommended_action": analysis["recommended_action"],
        "asset_name": asset_name,
        "source": "TradeQuest Scenario",
        "url": "",
        "image_url": None,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
