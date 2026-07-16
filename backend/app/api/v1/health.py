"""Service health endpoints."""

from fastapi import APIRouter

from app.core.config import get_settings
from app.schemas.common import HealthResponse

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("", response_model=HealthResponse, summary="Check API health")
def health_check() -> HealthResponse:
    """Return liveness information for the API process."""

    settings = get_settings()
    return HealthResponse(
        status="ok", environment=settings.app_env, service=settings.app_name
    )
