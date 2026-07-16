"""Task dashboard endpoint."""

from datetime import UTC, datetime
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import CurrentUser
from app.models.enums import TaskStatus
from app.models.task import Task
from app.schemas.dashboard import DashboardResponse

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get(
    "", response_model=DashboardResponse, summary="Get task dashboard statistics"
)
def dashboard(
    user: CurrentUser, db: Annotated[Session, Depends(get_db)]
) -> DashboardResponse:
    tasks = list(db.scalars(select(Task).where(Task.user_id == user.id)))
    total = len(tasks)
    completed = sum(task.status == TaskStatus.COMPLETED for task in tasks)
    pending = sum(task.status == TaskStatus.PENDING for task in tasks)
    in_progress = sum(task.status == TaskStatus.IN_PROGRESS for task in tasks)
    dropped = sum(task.status == TaskStatus.DROPPED for task in tasks)
    now = datetime.now(UTC)
    overdue = sum(
        task.due_date is not None
        and (
            task.due_date.replace(tzinfo=UTC)
            if task.due_date.tzinfo is None
            else task.due_date
        )
        < now
        and task.status not in {TaskStatus.COMPLETED, TaskStatus.DROPPED}
        for task in tasks
    )
    return DashboardResponse(
        totalTasks=total,
        completed=completed,
        pending=pending,
        inProgress=in_progress,
        dropped=dropped,
        completionRate=round(completed / total * 100, 2) if total else 0,
        overdueTasks=overdue,
    )
