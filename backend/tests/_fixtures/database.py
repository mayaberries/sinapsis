from collections.abc import AsyncGenerator, Generator
from pathlib import Path

import pytest
import pytest_asyncio
from alembic import command
from alembic.config import Config
from asgi_lifespan import LifespanManager
from databases import Database
from fastapi import FastAPI
from redis.asyncio import Redis

ALEMBIC_INI = Path(__file__).resolve().parents[2] / "alembic.ini"


@pytest.fixture(scope="session")
def apply_migrations() -> Generator[None]:
    """
    Recreates `<db>_test` and migrates it once per session (see
    app/migrations/env.py); every test then runs inside a transaction that's
    rolled back, so tests never see each other's rows.
    """
    config = Config(str(ALEMBIC_INI))
    command.upgrade(config, "head")
    yield
    command.downgrade(config, "base")


@pytest.fixture
def app(apply_migrations: None) -> FastAPI:
    from app.main import create_app

    return create_app()


@pytest_asyncio.fixture
async def initialized_app(app: FastAPI) -> AsyncGenerator[FastAPI]:
    """
    Runs the app's lifespan (app/lifespan.py), which is what opens the
    database and Redis clients on `app.state`. `client`, `db` and `redis` all
    depend on this, and pytest caches it per test, so the lifespan is entered
    once per test however many of them a test requests.
    """
    async with LifespanManager(app):
        yield app


@pytest.fixture
def db(initialized_app: FastAPI) -> Database:
    database: Database = initialized_app.state._db
    return database


@pytest.fixture
def redis(initialized_app: FastAPI) -> Redis:
    client: Redis = initialized_app.state.redis
    return client
