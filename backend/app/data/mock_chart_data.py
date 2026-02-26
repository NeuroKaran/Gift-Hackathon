"""Mock OHLC candlestick data for the Zero-Day Vulnerability scenario.

Simulates 35 days of trading data for an anonymized cybersecurity company:
- Days 1-25:  Steady uptrend (pre-breach, company doing well)
- Days 26-30: The chart shown to user (plateau / slight rally before news)
- Days 31-35: Post-breach crash (revealed after prediction)
"""

from datetime import datetime, timedelta

# Base date: start of the 35-day window
_BASE_DATE = datetime(2025, 10, 1)


def _ts(day: int) -> int:
    """Return a UNIX timestamp for the given day offset."""
    return int((_BASE_DATE + timedelta(days=day)).timestamp())


# ──────────────────────────────────────────────────────────────────────────────
# 35 OHLC bars for CYBERFORT (CBFT)
# Days 0-29  → shown to the user before prediction
# Days 30-34 → revealed AFTER the user predicts (the "fast forward")
# ──────────────────────────────────────────────────────────────────────────────

ZERO_DAY_CHART_DATA: list[dict] = [
    # ── Week 1: Gradual uptrend ──────────────────────────────────────────────
    {"time": _ts(0),  "open": 142.00, "high": 144.50, "low": 141.20, "close": 143.80},
    {"time": _ts(1),  "open": 143.80, "high": 145.90, "low": 143.10, "close": 145.20},
    {"time": _ts(2),  "open": 145.20, "high": 146.80, "low": 144.50, "close": 146.10},
    {"time": _ts(3),  "open": 146.10, "high": 147.30, "low": 145.00, "close": 145.60},
    {"time": _ts(4),  "open": 145.60, "high": 148.20, "low": 145.10, "close": 147.90},

    # ── Week 2: Continued climb with minor pullback ──────────────────────────
    {"time": _ts(5),  "open": 147.90, "high": 149.50, "low": 147.00, "close": 149.00},
    {"time": _ts(6),  "open": 149.00, "high": 150.20, "low": 148.30, "close": 148.70},
    {"time": _ts(7),  "open": 148.70, "high": 151.00, "low": 148.20, "close": 150.80},
    {"time": _ts(8),  "open": 150.80, "high": 152.40, "low": 150.10, "close": 151.90},
    {"time": _ts(9),  "open": 151.90, "high": 153.10, "low": 150.50, "close": 150.90},

    # ── Week 3: Strong rally — earnings beat ─────────────────────────────────
    {"time": _ts(10), "open": 150.90, "high": 154.80, "low": 150.50, "close": 154.20},
    {"time": _ts(11), "open": 154.20, "high": 156.30, "low": 153.80, "close": 155.90},
    {"time": _ts(12), "open": 155.90, "high": 157.50, "low": 155.00, "close": 156.80},
    {"time": _ts(13), "open": 156.80, "high": 158.20, "low": 155.60, "close": 157.40},
    {"time": _ts(14), "open": 157.40, "high": 159.00, "low": 156.50, "close": 158.50},

    # ── Week 4: Consolidation at highs ───────────────────────────────────────
    {"time": _ts(15), "open": 158.50, "high": 159.80, "low": 157.20, "close": 158.90},
    {"time": _ts(16), "open": 158.90, "high": 160.10, "low": 157.80, "close": 159.50},
    {"time": _ts(17), "open": 159.50, "high": 161.20, "low": 158.60, "close": 160.70},
    {"time": _ts(18), "open": 160.70, "high": 162.00, "low": 159.40, "close": 159.80},
    {"time": _ts(19), "open": 159.80, "high": 161.50, "low": 159.00, "close": 161.20},

    # ── Week 5: Pre-breach plateau ───────────────────────────────────────────
    {"time": _ts(20), "open": 161.20, "high": 162.80, "low": 160.50, "close": 162.30},
    {"time": _ts(21), "open": 162.30, "high": 163.50, "low": 161.00, "close": 161.80},
    {"time": _ts(22), "open": 161.80, "high": 163.90, "low": 161.20, "close": 163.40},
    {"time": _ts(23), "open": 163.40, "high": 164.20, "low": 162.10, "close": 162.50},
    {"time": _ts(24), "open": 162.50, "high": 164.80, "low": 162.00, "close": 164.50},

    # ── Week 6: Final days before news (days 25-29) ──────────────────────────
    {"time": _ts(25), "open": 164.50, "high": 165.30, "low": 163.80, "close": 165.00},
    {"time": _ts(26), "open": 165.00, "high": 166.20, "low": 164.20, "close": 165.80},
    {"time": _ts(27), "open": 165.80, "high": 167.00, "low": 165.00, "close": 166.40},
    {"time": _ts(28), "open": 166.40, "high": 167.50, "low": 165.50, "close": 166.90},
    {"time": _ts(29), "open": 166.90, "high": 168.00, "low": 166.00, "close": 167.50},

    # ══════════════════════════════════════════════════════════════════════════
    #  REVEAL ZONE — days 30-34 (post-breach crash)
    # ══════════════════════════════════════════════════════════════════════════
    {"time": _ts(30), "open": 167.50, "high": 168.20, "low": 152.30, "close": 153.10},  # GAP DOWN on news
    {"time": _ts(31), "open": 153.10, "high": 155.40, "low": 148.60, "close": 149.20},  # Continued sell-off
    {"time": _ts(32), "open": 149.20, "high": 151.80, "low": 146.50, "close": 147.30},  # Panic selling
    {"time": _ts(33), "open": 147.30, "high": 149.90, "low": 144.80, "close": 148.50},  # Dead cat bounce
    {"time": _ts(34), "open": 148.50, "high": 150.20, "low": 143.90, "close": 144.60},  # Continued decline
]


def get_pre_event_data() -> list[dict]:
    """Return the first 30 bars (shown before prediction)."""
    return ZERO_DAY_CHART_DATA[:30]


def get_post_event_data() -> list[dict]:
    """Return the last 5 bars (revealed after prediction)."""
    return ZERO_DAY_CHART_DATA[30:]


def get_full_chart_data() -> list[dict]:
    """Return all 35 bars."""
    return ZERO_DAY_CHART_DATA
