"""TradeQuest — FastAPI Backend Entry Point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routes import scenarios, ml, ai
from app.routes import settings as settings_route

cfg = get_settings()

app = FastAPI(
    title="TradeQuest API",
    description="AI-Powered Finance Education & Investment Intelligence Platform",
    version="0.1.0",
)

# ── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        cfg.frontend_url,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──────────────────────────────────────────────────────────────────
app.include_router(scenarios.router)
app.include_router(ml.router)
app.include_router(ai.router)
app.include_router(settings_route.router)


# ── Health Check ─────────────────────────────────────────────────────────────
@app.get("/", tags=["health"])
async def root():
    """Root health-check endpoint."""
    return {"status": "ok", "app": "TradeQuest API"}


@app.get("/health", tags=["health"])
async def health_check():
    """Health-check endpoint."""
    return {"status": "ok"}
