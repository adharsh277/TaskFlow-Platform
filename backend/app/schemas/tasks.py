"""Task request and response schemas."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.enums import TaskPriority, TaskStatus


class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(default="", max_length=5000)
    status: TaskStatus = TaskStatus.PENDING
    priority: TaskPriority = TaskPriority.MEDIUM
    category: str = Field(default="General", min_length=1, max_length=80)
    due_date: datetime | None = None

    @field_validator("title", "category")
    @classmethod
    def strip_required_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("must not be blank")
        return value

    @field_validator("due_date")
    @classmethod
    def validate_due_date(cls, value: datetime | None) -> datetime | None:
        if value is not None and value <= datetime.now(value.tzinfo):
            raise ValueError("due_date must be in the future")
        return value


class TaskUpdate(TaskCreate):
    pass


class TaskResponse(TaskCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime


class TaskListResponse(BaseModel):
    success: bool = True
    message: str = "Tasks retrieved successfully."
    data: list[TaskResponse]
    total: int
    total_pages: int
    page: int
    page_size: int
