"""Common API response schemas."""

from typing import Any

from pydantic import BaseModel, Field


class ErrorResponse(BaseModel):
    """Consistent error response envelope."""

    success: bool = False
    error: str
    message: str
    details: Any | None = None


class HealthResponse(BaseModel):
    """Service liveness response."""

    success: bool = True
    status: str = Field(examples=["ok"])
    environment: str
    service: str
