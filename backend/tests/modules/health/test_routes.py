from collections.abc import Callable
from typing import Any

import pytest
from asgi_lifespan import LifespanManager
from fastapi import FastAPI
from httpx import ASGITransport, AsyncClient
from pydantic import PostgresDsn
from starlette.status import HTTP_200_OK, HTTP_503_SERVICE_UNAVAILABLE

from app.shared.config import get_settings
from app.shared.db.dependencies import get_database, get_redis
from tests._fixtures.overrides import Override
from tests._helpers.infra import (
    UNREACHABLE_DATABASE_URL,
    unreachable_database,
    unreachable_redis,
)

UNREACHABLE: dict[str, tuple[Callable[..., Any], Callable[[], Any]]] = {
    "postgres": (get_database, unreachable_database),
    "redis": (get_redis, unreachable_redis),
}


def _returning(value: Any) -> Callable[[], Any]:
    # A closure, not `lambda v=value: v`: FastAPI would read the default
    # argument as a query parameter and try to copy the client.
    def dependency() -> Any:
        return value

    return dependency


@pytest.mark.test_id("PLT-002")
async def test_reports_both_dependencies_reachable(app: FastAPI, client: AsyncClient) -> None:
    response = await client.get(app.url_path_for("health:check"))

    assert response.status_code == HTTP_200_OK
    assert response.json() == {"status": "ok", "checks": {"postgres": "ok", "redis": "ok"}}


@pytest.mark.test_id("PLT-003")
@pytest.mark.parametrize(
    "down", [["postgres"], ["redis"], ["postgres", "redis"]], ids=["postgres", "redis", "both"]
)
async def test_names_the_failing_dependency(
    app: FastAPI, client: AsyncClient, override_dependency: Override, down: list[str]
) -> None:
    for name in down:
        dependency, make_unreachable = UNREACHABLE[name]
        override_dependency(dependency, _returning(make_unreachable()))

    response = await client.get(app.url_path_for("health:check"))

    assert response.status_code == HTTP_503_SERVICE_UNAVAILABLE
    body = response.json()
    assert body["status"] == "unavailable"
    assert body["checks"] == {
        name: "unreachable" if name in down else "ok" for name in ("postgres", "redis")
    }


@pytest.mark.test_id("PLT-003")
async def test_starts_while_postgres_is_down(monkeypatch: pytest.MonkeyPatch) -> None:
    """
    PostgreSQL already down when the backend starts: the lifespan must not
    raise, so `/health` can still answer and say so.
    """
    settings_down = get_settings().model_copy(
        update={"database_url": PostgresDsn(UNREACHABLE_DATABASE_URL)}
    )
    monkeypatch.setattr("app.lifespan.get_settings", lambda: settings_down)

    from app.main import create_app

    app = create_app()
    async with (
        LifespanManager(app),
        AsyncClient(transport=ASGITransport(app=app), base_url="http://testserver") as client,
    ):
        response = await client.get(app.url_path_for("health:check"))

    assert response.status_code == HTTP_503_SERVICE_UNAVAILABLE
    assert response.json()["checks"] == {"postgres": "unreachable", "redis": "ok"}
