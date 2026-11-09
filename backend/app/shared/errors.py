"""
Domain errors. Services raise these instead of `HTTPException`, so business
rules don't know they're behind HTTP; `app.shared.http.errors` maps each one
to its status code.

Subclass the closest one per case (`class SlotTakenError(ConflictError)`) so
callers and tests can catch it by name. `detail` is the user-facing message.
"""


class DomainError(Exception):
    def __init__(self, detail: str, *, headers: dict[str, str] | None = None) -> None:
        super().__init__(detail)
        self.detail = detail
        # Response headers the error needs, e.g. `WWW-Authenticate` on a 401.
        self.headers = headers


class NotAuthenticatedError(DomainError):
    pass


class NotFoundError(DomainError):
    pass


class PermissionDeniedError(DomainError):
    pass


class ConflictError(DomainError):
    pass


class ServiceUnavailableError(DomainError):
    """Something the request can't do without (the database) is unreachable."""
