"""Task business logic and audit event creation."""

from sqlalchemy.orm import Session

from app.models.enums import ActivityAction
from app.repositories.activity_repository import ActivityRepository
from app.repositories.task_repository import TaskRepository
from app.schemas.tasks import TaskCreate, TaskUpdate


class TaskService:
    """Own task mutations and ensure audit activities are recorded."""

    def __init__(self, db: Session) -> None:
        self.db = db
        self.tasks = TaskRepository(db)
        self.activities = ActivityRepository(db)

    def create(self, user_id: int, payload: TaskCreate):
        task = self.tasks.create(user_id=user_id, **payload.model_dump())
        self.activities.create(
            action=ActivityAction.CREATED, task_id=task.id, user_id=user_id
        )
        self.db.commit()
        self.db.refresh(task)
        return task

    def update(self, user_id: int, task_id: int, payload: TaskUpdate):
        task = self.tasks.get_by_id(task_id, user_id)
        if not task:
            return None
        status_changed = task.status != payload.status
        self.tasks.update(task, **payload.model_dump())
        self.activities.create(
            action=ActivityAction.STATUS_CHANGED
            if status_changed
            else ActivityAction.UPDATED,
            task_id=task.id,
            user_id=user_id,
        )
        self.db.commit()
        self.db.refresh(task)
        return task

    def delete(self, user_id: int, task_id: int) -> bool:
        task = self.tasks.get_by_id(task_id, user_id)
        if not task:
            return False
        self.activities.create(
            action=ActivityAction.DELETED, task_id=task.id, user_id=user_id
        )
        self.tasks.delete(task)
        self.db.commit()
        return True
