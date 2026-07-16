"""Task audit activity model."""

from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.enums import ActivityAction


class Activity(Base):
    """Immutable audit event associated with a user and optional task."""

    __tablename__ = "activities"

    id: Mapped[int] = mapped_column(primary_key=True)
    action: Mapped[ActivityAction] = mapped_column(
        Enum(ActivityAction), nullable=False, index=True
    )
    task_id: Mapped[int | None] = mapped_column(
        ForeignKey("tasks.id", ondelete="SET NULL"), nullable=True, index=True
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False, index=True
    )

    task: Mapped["Task | None"] = relationship(back_populates="activities")


from app.models.task import Task  # noqa: E402, F401
