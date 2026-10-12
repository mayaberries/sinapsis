"""
Domain errors. Services raise these instead of `HTTPException`, so business
rules don't know they're behind HTTP; `app.shared.http.errors` maps each one
to its status code.
"""


class DomainError(Exception):
    def __init__(self, detail: str) -> None:
        super().__init__(detail)
        self.detail = detail


class NotFoundError(DomainError):
    pass


class PermissionDeniedError(DomainError):
    pass


class ConflictError(DomainError):
    pass
