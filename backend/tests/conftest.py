"""
Test layout (mirrors `app/`):

    tests/modules/<name>/   one folder per module, e.g. tests/modules/health/
    tests/shared/           tests for app/shared/
    tests/_fixtures/        fixtures, loaded below as plugins
    tests/_helpers/         plain functions and fakes tests import

Tests are named by their test ID (`test_plt_002_...`), so `pytest -k plt_002`
runs one case. Unlike app code, tests may import a module's internals (e.g.
its repository, to override it).
"""

import os

# Before anything imports the app: settings are read once and cached, and
# TESTING points them at `<db>_test` with every transaction rolled back.
os.environ["TESTING"] = "1"

from collections.abc import AsyncGenerator  # noqa: E402

import pytest  # noqa: E402
import pytest_asyncio  # noqa: E402
from fastapi import FastAPI  # noqa: E402
from httpx import ASGITransport, AsyncClient  # noqa: E402

pytest_plugins = [
    "tests._fixtures.database",
    "tests._fixtures.overrides",
]


@pytest_asyncio.fixture(scope="session", autouse=True)
async def _infra_smoke_check() -> AsyncGenerator[None]:
    """
    Runs once, before anything else. Checks what, when broken, breaks every
    test the same way (the app can't be built, PostgreSQL or Redis is down),
    and aborts the session with one clear message instead of a wall of
    identical errors.
    """
    from databases import Database
    from redis.asyncio import Redis

    from app.main import create_app
    from app.shared.config import get_settings

    settings = get_settings()

    try:
        create_app()
    except Exception as exc:
        pytest.exit(f"\n\nINFRA SMOKE CHECK FAILED: the app can't be built.\n{exc!r}\n", 1)

    try:
        # The base database, which always exists; `<db>_test` is created by
        # the migrations fixture.
        database = Database(str(settings.database_url))
        await database.connect()
        await database.disconnect()
    except Exception as exc:
        pytest.exit(
            f"\n\nINFRA SMOKE CHECK FAILED: PostgreSQL is unreachable. "
            f"Is it running? (make services-up)\n{exc!r}\n",
            1,
        )

    try:
        redis = Redis.from_url(str(settings.redis_url), socket_connect_timeout=2)
        await redis.ping()
        await redis.aclose()
    except Exception as exc:
        pytest.exit(
            f"\n\nINFRA SMOKE CHECK FAILED: Redis is unreachable. "
            f"Is it running? (make services-up)\n{exc!r}\n",
            1,
        )

    yield


@pytest_asyncio.fixture
async def client(initialized_app: FastAPI) -> AsyncGenerator[AsyncClient]:
    async with AsyncClient(
        transport=ASGITransport(app=initialized_app),
        base_url="http://testserver",
        headers={"Content-Type": "application/json"},
    ) as client:
        yield client
