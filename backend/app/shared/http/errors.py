from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse

from app.shared.errors import ConflictError, DomainError, NotFoundError, PermissionDeniedError

# Most specific first: the first class the error is an instance of wins.
STATUS_CODES: list[tuple[type[DomainError], int]] = [
    (NotFoundError, status.HTTP_404_NOT_FOUND),
    (PermissionDeniedError, status.HTTP_403_FORBIDDEN),
    (ConflictError, status.HTTP_409_CONFLICT),
    (DomainError, status.HTTP_400_BAD_REQUEST),
]


async def _handle_domain_error(_: Request, exc: Exception) -> JSONResponse:
    assert isinstance(exc, DomainError)
    status_code = next(code for error, code in STATUS_CODES if isinstance(exc, error))
    return JSONResponse(status_code=status_code, content={"detail": exc.detail})


def register_error_handlers(app: FastAPI) -> None:
    app.add_exception_handler(DomainError, _handle_domain_error)
