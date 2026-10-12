from redis.asyncio import Redis
from redis.exceptions import RedisError

from app.modules.health.repository import HealthRepository
from app.modules.health.schemas import CheckStatus, HealthStatus, OverallStatus


class HealthService:
    def __init__(self, *, health_repo: HealthRepository, redis: Redis) -> None:
        self.health_repo = health_repo
        self.redis = redis

    async def check(self) -> HealthStatus:
        checks = {
            "postgres": await self._check_postgres(),
            "redis": await self._check_redis(),
        }
        healthy = all(check is CheckStatus.OK for check in checks.values())
        return HealthStatus(
            status=OverallStatus.OK if healthy else OverallStatus.UNAVAILABLE,
            checks=checks,
        )

    async def _check_postgres(self) -> CheckStatus:
        return CheckStatus.OK if await self.health_repo.ping() else CheckStatus.UNREACHABLE

    async def _check_redis(self) -> CheckStatus:
        try:
            await self.redis.ping()
        except (RedisError, OSError):
            return CheckStatus.UNREACHABLE
        return CheckStatus.OK
