from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.lifespan import lifespan
from app.modules import health
from app.shared.config import get_settings
from app.shared.http.errors import register_error_handlers


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title=settings.project_name, version=settings.version, lifespan=lifespan)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    register_error_handlers(app)

    # Infrastructure modules mount at the root; product modules go under
    # `settings.api_prefix`.
    app.include_router(health.router, tags=["health"])

    return app


app = create_app()
