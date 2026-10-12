"""
Health: whether the backend's infrastructure (PostgreSQL, Redis) is reachable.

Public API: `router`, mounted at the root (`GET /health`).
"""

from app.modules.health.routes import router

__all__ = ["router"]
