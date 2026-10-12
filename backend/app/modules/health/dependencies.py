from typing import Annotated

from fastapi import Depends

from app.modules.health.repository import HealthRepository
from app.modules.health.service import HealthService
from app.shared.db.dependencies import RedisDep, get_repository


def get_health_service(
    redis: RedisDep,
    health_repo: Annotated[HealthRepository, Depends(get_repository(HealthRepository))],
) -> HealthService:
    return HealthService(health_repo=health_repo, redis=redis)


HealthServiceDep = Annotated[HealthService, Depends(get_health_service)]
