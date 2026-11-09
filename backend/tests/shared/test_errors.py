"""
Domain errors → HTTP: the status each one maps to, the body and headers the
handler sends, and the OpenAPI `responses=` built from the same table.

Self-contained on purpose: a bare app with only the handler registered, no
database, so the mapping is tested apart from any module that raises.
"""

from collections.abc import AsyncGenerator, Callable

import pytest
from fastapi import FastAPI, status
from httpx import ASGITransport, AsyncClient

from app.shared.errors import (
    ConflictError,
    DomainError,
    NotAuthenticatedError,
    NotFoundError,
    PermissionDeniedError,
    ServiceUnavailableError,
)
from app.shared.http.errors import error_responses, register_error_handlers, status_code_for


class SlotTakenError(ConflictError):
    """A module-specific subclass, mapped through its parent."""


CASES: list[tuple[type[DomainError], int]] = [
    (NotAuthenticatedError, status.HTTP_401_UNAUTHORIZED),
    (PermissionDeniedError, status.HTTP_403_FORBIDDEN),
    (NotFoundError, status.HTTP_404_NOT_FOUND),
    (ConflictError, status.HTTP_409_CONFLICT),
    (SlotTakenError, status.HTTP_409_CONFLICT),
    (ServiceUnavailableError, status.HTTP_503_SERVICE_UNAVAILABLE),
    (DomainError, status.HTTP_400_BAD_REQUEST),
]


def _app_raising(error: DomainError) -> FastAPI:
    app = FastAPI()
    register_error_handlers(app)

    @app.get("/raise", responses=error_responses(type(error)))
    async def raise_it() -> None:
        raise error

    return app


@pytest.fixture
async def make_client() -> AsyncGenerator[Callable[[FastAPI], AsyncClient]]:
    clients: list[AsyncClient] = []

    def make(app: FastAPI) -> AsyncClient:
        client = AsyncClient(transport=ASGITransport(app=app), base_url="http://testserver")
        clients.append(client)
        return client

    yield make
    for client in clients:
        await client.aclose()


@pytest.mark.parametrize(("error", "code"), CASES, ids=[e.__name__ for e, _ in CASES])
def test_each_error_maps_to_its_status(error: type[DomainError], code: int) -> None:
    assert status_code_for(error) == code


@pytest.mark.parametrize(("error", "code"), CASES, ids=[e.__name__ for e, _ in CASES])
async def test_handler_sends_the_status_and_detail(
    error: type[DomainError], code: int, make_client: Callable[[FastAPI], AsyncClient]
) -> None:
    client = make_client(_app_raising(error("Something specific.")))

    response = await client.get("/raise")

    assert response.status_code == code
    assert response.json() == {"detail": "Something specific."}


async def test_handler_passes_the_errors_headers(
    make_client: Callable[[FastAPI], AsyncClient],
) -> None:
    error = NotAuthenticatedError("Not authenticated.", headers={"WWW-Authenticate": "Bearer"})
    client = make_client(_app_raising(error))

    response = await client.get("/raise")

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.headers["www-authenticate"] == "Bearer"


def test_error_responses_lists_each_status_once_in_order() -> None:
    responses = error_responses(SlotTakenError, NotFoundError, ConflictError, PermissionDeniedError)

    assert list(responses) == [403, 404, 409]
    assert all(entry["model"].__name__ == "ErrorResponse" for entry in responses.values())


def test_declared_errors_appear_in_the_openapi_schema() -> None:
    app = _app_raising(NotFoundError("Missing."))

    operation = app.openapi()["paths"]["/raise"]["get"]

    assert "404" in operation["responses"]
    schema_ref = operation["responses"]["404"]["content"]["application/json"]["schema"]["$ref"]
    assert schema_ref.endswith("/ErrorResponse")
