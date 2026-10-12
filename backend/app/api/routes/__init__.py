from fastapi import APIRouter

from app.api.routes.health import router as health_router

# Mounted at the root: infrastructure endpoints such as `/health`.
root_router = APIRouter()
root_router.include_router(health_router, tags=["health"])

# Mounted under `settings.api_prefix`: every product resource goes here.
api_router = APIRouter()
