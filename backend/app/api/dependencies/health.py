from typing import Annotated

from fastapi import Depends

from app.api.dependencies.database import get_repository
from app.api.dependencies.redis import RedisDep
from app.db.repositories.health import HealthRepository
from app.services.health import HealthService


def get_health_service(
    redis: RedisDep,
    health_repo: Annotated[HealthRepository, Depends(get_repository(HealthRepository))],
) -> HealthService:
    return HealthService(health_repo=health_repo, redis=redis)


HealthServiceDep = Annotated[HealthService, Depends(get_health_service)]
