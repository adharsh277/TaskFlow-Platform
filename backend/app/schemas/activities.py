"""Activity response schemas."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.enums import ActivityAction


class ActivityResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    action: ActivityAction
    task_id: int | None
    user_id: int
    timestamp: datetime


class ActivityListResponse(BaseModel):
    success: bool = True
    message: str = "Activities retrieved successfully."
    data: list[ActivityResponse]
