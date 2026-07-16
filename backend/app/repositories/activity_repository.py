"""Activity persistence operations."""

from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from app.models.activity import Activity


class ActivityRepository:
    """Data access for audit activities."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, **values: object) -> Activity:
        activity = Activity(**values)
        self.db.add(activity)
        self.db.flush()
        return activity

    def list_for_user(self, user_id: int, limit: int = 50) -> list[Activity]:
        statement = (
            select(Activity)
            .where(Activity.user_id == user_id)
            .order_by(desc(Activity.timestamp))
            .limit(limit)
        )
        return list(self.db.scalars(statement))
