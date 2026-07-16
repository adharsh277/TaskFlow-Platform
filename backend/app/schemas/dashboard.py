"""Dashboard response schemas."""

from pydantic import BaseModel, Field


class DashboardResponse(BaseModel):
    success: bool = True
    message: str = "Dashboard retrieved successfully."
    totalTasks: int = Field(ge=0)
    completed: int = Field(ge=0)
    pending: int = Field(ge=0)
    inProgress: int = Field(ge=0)
    dropped: int = Field(ge=0)
    completionRate: float = Field(ge=0, le=100)
    overdueTasks: int = Field(ge=0)
