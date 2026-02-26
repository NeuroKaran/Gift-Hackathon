"""User settings persistence using a local JSON file."""

import json
from pathlib import Path
from typing import Any

SETTINGS_FILE = Path(__file__).parent / "user_settings.json"

DEFAULT_SETTINGS: dict[str, Any] = {
    "name": "Karan",
    "email": "karan@example.com",
    "notifications": True,
    "soundEffects": True,
    "difficulty": "intermediate",
    "xp": 850,
    "level": 1,
    "levelTitle": "Rookie Trader",
}


def _ensure_file() -> None:
    """Create the settings file with defaults if it doesn't exist."""
    if not SETTINGS_FILE.exists():
        SETTINGS_FILE.write_text(json.dumps(DEFAULT_SETTINGS, indent=2))


def read_settings() -> dict[str, Any]:
    """Read current settings from disk."""
    _ensure_file()
    return json.loads(SETTINGS_FILE.read_text())


def write_settings(data: dict[str, Any]) -> dict[str, Any]:
    """Merge incoming data with current settings and persist."""
    current = read_settings()
    current.update(data)
    SETTINGS_FILE.write_text(json.dumps(current, indent=2))
    return current


def reset_progress() -> dict[str, Any]:
    """Reset XP and level back to defaults, keep profile info."""
    current = read_settings()
    current["xp"] = 0
    current["level"] = 1
    current["levelTitle"] = "Rookie Trader"
    SETTINGS_FILE.write_text(json.dumps(current, indent=2))
    return current


def delete_account() -> dict[str, Any]:
    """Reset everything back to defaults."""
    SETTINGS_FILE.write_text(json.dumps(DEFAULT_SETTINGS, indent=2))
    return DEFAULT_SETTINGS.copy()
