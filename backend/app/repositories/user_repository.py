"""User persistence operations."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import User


class UserRepository:
    """Data access for users."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def get_by_id(self, user_id: int) -> User | None:
        return self.db.get(User, user_id)

    def get_by_email(self, email: str) -> User | None:
        return self.db.scalar(select(User).where(User.email == email.lower()))

    def create(self, *, full_name: str, email: str, password_hash: str) -> User:
        user = User(
            full_name=full_name, email=email.lower(), password_hash=password_hash
        )
        self.db.add(user)
        self.db.flush()
        return user
