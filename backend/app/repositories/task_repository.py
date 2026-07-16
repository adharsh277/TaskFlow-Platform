"""Task persistence operations and query composition."""

from datetime import datetime

from sqlalchemy import asc, desc, func, or_, select
from sqlalchemy.orm import Session

from app.models.enums import TaskPriority, TaskStatus
from app.models.task import Task


class TaskRepository:
    """Data access for user-scoped tasks."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def get_by_id(self, task_id: int, user_id: int) -> Task | None:
        return self.db.scalar(
            select(Task).where(Task.id == task_id, Task.user_id == user_id)
        )

    def create(self, *, user_id: int, **values: object) -> Task:
        task = Task(user_id=user_id, **values)
        self.db.add(task)
        self.db.flush()
        return task

    def update(self, task: Task, **values: object) -> Task:
        for key, value in values.items():
            setattr(task, key, value)
        self.db.flush()
        return task

    def delete(self, task: Task) -> None:
        self.db.delete(task)
        self.db.flush()

    def list(
        self,
        *,
        user_id: int,
        page: int,
        page_size: int,
        search: str | None = None,
        status: TaskStatus | None = None,
        priority: TaskPriority | None = None,
        category: str | None = None,
        due_before: datetime | None = None,
        sort: str = "newest",
    ) -> tuple[list[Task], int]:
        query = select(Task).where(Task.user_id == user_id)
        count_query = (
            select(func.count()).select_from(Task).where(Task.user_id == user_id)
        )
        filters = []
        if search:
            term = f"%{search.strip()}%"
            filters.append(
                or_(
                    Task.title.ilike(term),
                    Task.description.ilike(term),
                    Task.category.ilike(term),
                )
            )
        if status:
            filters.append(Task.status == status)
        if priority:
            filters.append(Task.priority == priority)
        if category:
            filters.append(Task.category == category)
        if due_before:
            filters.append(Task.due_date <= due_before)
        if filters:
            query = query.where(*filters)
            count_query = count_query.where(*filters)
        ordering = {
            "newest": desc(Task.created_at),
            "oldest": asc(Task.created_at),
            "priority": desc(Task.priority),
            "due_date": asc(Task.due_date),
            "alphabetical": asc(Task.title),
        }
        query = (
            query.order_by(ordering.get(sort, desc(Task.created_at)))
            .offset((page - 1) * page_size)
            .limit(page_size)
        )
        return list(self.db.scalars(query)), int(self.db.scalar(count_query) or 0)
