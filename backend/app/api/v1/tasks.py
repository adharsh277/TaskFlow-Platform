"""Authenticated task CRUD and query endpoints."""

from datetime import datetime
from typing import Annotated, Literal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import CurrentUser
from app.dependencies.services import get_task_service
from app.models.enums import TaskPriority, TaskStatus
from app.repositories.task_repository import TaskRepository
from app.schemas.tasks import TaskCreate, TaskListResponse, TaskResponse, TaskUpdate
from app.services.task_service import TaskService

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.get(
    "",
    response_model=TaskListResponse,
    summary="List tasks",
    description="Search, filter, sort, and paginate tasks owned by the current user.",
)
def list_tasks(
    user: CurrentUser,
    db: Annotated[Session, Depends(get_db)],
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
    search: str | None = None,
    status_filter: Annotated[TaskStatus | None, Query(alias="status")] = None,
    priority: TaskPriority | None = None,
    category: str | None = None,
    due_before: Annotated[datetime | None, Query(alias="due_date")] = None,
    sort: Literal[
        "newest", "oldest", "priority", "due_date", "alphabetical"
    ] = "newest",
) -> TaskListResponse:
    tasks, total = TaskRepository(db).list(
        user_id=user.id,
        page=page,
        page_size=page_size,
        search=search,
        status=status_filter,
        priority=priority,
        category=category,
        due_before=due_before,
        sort=sort,
    )
    total_pages = (total + page_size - 1) // page_size if total else 0
    return TaskListResponse(
        data=tasks, total=total, total_pages=total_pages, page=page, page_size=page_size
    )


@router.get("/{task_id}", response_model=TaskResponse, summary="Get a task")
def get_task(
    task_id: int, user: CurrentUser, db: Annotated[Session, Depends(get_db)]
) -> TaskResponse:
    task = TaskRepository(db).get_by_id(task_id, user.id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.post(
    "",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a task",
)
def create_task(
    payload: TaskCreate,
    user: CurrentUser,
    service: Annotated[TaskService, Depends(get_task_service)],
) -> TaskResponse:
    return service.create(user.id, payload)


@router.put("/{task_id}", response_model=TaskResponse, summary="Update a task")
def update_task(
    task_id: int,
    payload: TaskUpdate,
    user: CurrentUser,
    service: Annotated[TaskService, Depends(get_task_service)],
) -> TaskResponse:
    task = service.update(user.id, task_id, payload)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.delete("/{task_id}", summary="Delete a task")
def delete_task(
    task_id: int,
    user: CurrentUser,
    service: Annotated[TaskService, Depends(get_task_service)],
) -> dict[str, object]:
    if not service.delete(user.id, task_id):
        raise HTTPException(status_code=404, detail="Task not found")
    return {"success": True, "message": "Task deleted successfully.", "data": None}
