from fastapi import APIRouter, Response, status

from app.modules.health.dependencies import HealthServiceDep
from app.modules.health.schemas import HealthStatus

router = APIRouter()


@router.get(
    "/health",
    response_model=HealthStatus,
    name="health:check",
    responses={status.HTTP_503_SERVICE_UNAVAILABLE: {"model": HealthStatus}},
)
async def check_health(response: Response, health_service: HealthServiceDep) -> HealthStatus:
    health = await health_service.check()
    if not health.is_healthy:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    return health
