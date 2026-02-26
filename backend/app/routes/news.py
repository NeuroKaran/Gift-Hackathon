"""News Intelligence routes — REST + SSE endpoints for live market-impact alerts.

Fetches real financial news from Finnhub, analyzes via Gemini AI, and serves
alerts through a REST endpoint and an SSE stream.
"""

import asyncio
import json

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.models.news_alerts import NewsAlert, NewsAlertListResponse
from app.services.news_intelligence import (
    fetch_finnhub_news,
    analyze_article,
    build_live_alert,
    analyze_scenario_news,
    build_alert_from_scenario,
)
from app.routes.scenarios import SCENARIOS

router = APIRouter(prefix="/api/news", tags=["news"])


# ── In-memory set of seen article IDs (for SSE deduplication) ────────────────
_seen_article_ids: set[str] = set()


async def _generate_live_alerts() -> list[dict]:
    """Fetch live news from Finnhub and analyze each article."""
    articles = await fetch_finnhub_news(category="general", limit=12)

    if not articles:
        # Fall back to scenario-based alerts if Finnhub is unavailable
        return await _generate_scenario_fallback_alerts()

    alerts: list[dict] = []
    for article in articles:
        analysis = await analyze_article(article)
        alert = build_live_alert(article, analysis)
        alerts.append(alert)

        # Track seen IDs for SSE stream
        _seen_article_ids.add(str(article.get("id", "")))

    # Sort by severity: critical → high → medium
    severity_order = {"critical": 0, "high": 1, "medium": 2}
    alerts.sort(key=lambda a: severity_order.get(a["severity"], 3))
    return alerts


async def _generate_scenario_fallback_alerts() -> list[dict]:
    """Fallback: generate alerts from in-memory scenarios when Finnhub is down."""
    alerts: list[dict] = []
    for slug, scenario in SCENARIOS.items():
        analysis = await analyze_scenario_news(
            scenario_slug=slug,
            news_headline=scenario["news_headline"],
            news_body=scenario["news_body"],
            asset_name=scenario["asset_name"],
        )
        alert = build_alert_from_scenario(
            scenario_slug=slug,
            headline=scenario["news_headline"],
            asset_name=scenario["asset_name"],
            analysis=analysis,
        )
        alerts.append(alert)

    severity_order = {"critical": 0, "high": 1, "medium": 2}
    alerts.sort(key=lambda a: severity_order.get(a["severity"], 3))
    return alerts


# ── GET /api/news/alerts ─────────────────────────────────────────────────────
@router.get("/alerts", response_model=NewsAlertListResponse)
async def list_alerts():
    """Return all current market-impact alerts from live financial news."""
    alerts = await _generate_live_alerts()
    return NewsAlertListResponse(
        alerts=[NewsAlert(**a) for a in alerts],
        total=len(alerts),
    )


# ── GET /api/news/alerts/stream ──────────────────────────────────────────────
async def _live_alert_event_generator():
    """SSE generator — polls Finnhub every 45s for new articles."""
    while True:
        await asyncio.sleep(45)

        articles = await fetch_finnhub_news(category="general", limit=5)

        for article in articles:
            article_id = str(article.get("id", ""))

            # Only emit articles we haven't seen before
            if article_id and article_id in _seen_article_ids:
                continue

            _seen_article_ids.add(article_id)
            analysis = await analyze_article(article)
            alert = build_live_alert(article, analysis)

            yield f"data: {json.dumps(alert)}\n\n"


@router.get("/alerts/stream")
async def stream_alerts():
    """
    SSE endpoint — clients receive new live market-impact alerts as they arrive.

    Polls Finnhub every ~45s for fresh articles.
    Connect with `new EventSource('/api/news/alerts/stream')`.
    """
    return StreamingResponse(
        _live_alert_event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
