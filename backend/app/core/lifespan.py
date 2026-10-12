from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.core.config import get_settings
from app.db.database import create_database, disconnect, try_connect
from app.db.redis import create_redis


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None]:
    settings = get_settings()

    # Kalens reads the pool from `app.state._db` (its default
    # `database_state_attr`), so it lives there.
    app.state._db = create_database(settings)
    app.state.redis = create_redis(settings)
    await try_connect(app.state._db)

    yield

    await disconnect(app.state._db)
    await app.state.redis.aclose()
