from collections.abc import Callable, Generator
from typing import Any

import pytest
from fastapi import FastAPI

type Override = Callable[[Callable[..., Any], Callable[..., Any]], None]


@pytest.fixture
def override_dependency(app: FastAPI) -> Generator[Override]:
    """
    Replaces a FastAPI dependency for one test, and restores it afterwards:

        override_dependency(get_redis, lambda: unreachable_redis)

    Use it to simulate what a real service can't easily do on demand (Redis
    down, a repository failing) without touching the containers.
    """

    def override(dependency: Callable[..., Any], replacement: Callable[..., Any]) -> None:
        app.dependency_overrides[dependency] = replacement

    yield override
    app.dependency_overrides.clear()
