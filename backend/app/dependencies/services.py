"""FastAPI service dependency providers."""

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services.auth_service import AuthService
from app.services.task_service import TaskService


def get_auth_service(db: Annotated[Session, Depends(get_db)]) -> AuthService:
    return AuthService(db)


def get_task_service(db: Annotated[Session, Depends(get_db)]) -> TaskService:
    return TaskService(db)
