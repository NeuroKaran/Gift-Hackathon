"""Settings API routes — GET, PUT, and reset endpoints."""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

from app.data.settings_data import read_settings, write_settings, reset_progress, delete_account

router = APIRouter(prefix="/api/settings", tags=["settings"])


class SettingsUpdateRequest(BaseModel):
    """Partial update request — all fields optional."""
    name: Optional[str] = None
    email: Optional[str] = None
    notifications: Optional[bool] = None
    soundEffects: Optional[bool] = None
    difficulty: Optional[str] = None
    xp: Optional[int] = None
    level: Optional[int] = None
    levelTitle: Optional[str] = None


@router.get("")
async def get_settings():
    """Return current user settings."""
    return read_settings()


@router.put("")
async def update_settings(body: SettingsUpdateRequest):
    """Update user settings (partial merge)."""
    updates = body.model_dump(exclude_none=True)
    return write_settings(updates)


@router.post("/reset")
async def reset_user_progress():
    """Reset XP and level to zero."""
    return reset_progress()


@router.post("/delete")
async def delete_user_account():
    """Reset all settings to defaults."""
    return delete_account()
