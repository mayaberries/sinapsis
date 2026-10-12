from enum import StrEnum

from app.models.core import CoreModel


class CheckStatus(StrEnum):
    OK = "ok"
    UNREACHABLE = "unreachable"


class OverallStatus(StrEnum):
    OK = "ok"
    UNAVAILABLE = "unavailable"


class HealthStatus(CoreModel):
    status: OverallStatus
    checks: dict[str, CheckStatus]

    @property
    def is_healthy(self) -> bool:
        return self.status is OverallStatus.OK
