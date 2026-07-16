"""Task activity history endpoint."""

from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import CurrentUser
from app.repositories.activity_repository import ActivityRepository
from app.schemas.activities import ActivityListResponse

router = APIRouter(prefix="/activities", tags=["Activities"])


@router.get(
    "", response_model=ActivityListResponse, summary="List recent task activity"
)
def list_activities(
    user: CurrentUser,
    db: Annotated[Session, Depends(get_db)],
    limit: Annotated[int, Query(ge=1, le=100)] = 50,
) -> ActivityListResponse:
    return ActivityListResponse(
        data=ActivityRepository(db).list_for_user(user.id, limit)
    )
