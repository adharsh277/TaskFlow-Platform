"""Authentication and user account business logic."""

from sqlalchemy.orm import Session

from app.core.exceptions import AppException
from app.repositories.user_repository import UserRepository
from app.schemas.auth import ChangePasswordRequest, UserCreate, UserUpdate
from app.utils.security import create_access_token, hash_password, verify_password


class AuthService:
    """Business operations for registration, login, and profile updates."""

    def __init__(self, db: Session) -> None:
        self.users = UserRepository(db)
        self.db = db

    def register(self, payload: UserCreate):
        if self.users.get_by_email(str(payload.email)):
            raise AppException(
                "An account with this email already exists.", status_code=409
            )
        user = self.users.create(
            full_name=payload.full_name,
            email=str(payload.email),
            password_hash=hash_password(payload.password),
        )
        self.db.commit()
        self.db.refresh(user)
        return user

    def login(self, email: str, password: str) -> str:
        user = self.users.get_by_email(email)
        if not user or not verify_password(password, user.password_hash):
            raise AppException("Invalid email or password.", status_code=401)
        return create_access_token(str(user.id))

    def update_profile(self, user, payload: UserUpdate):
        existing = self.users.get_by_email(str(payload.email))
        if existing and existing.id != user.id:
            raise AppException(
                "An account with this email already exists.", status_code=409
            )
        user.full_name = payload.full_name
        user.email = str(payload.email).lower()
        self.db.commit()
        self.db.refresh(user)
        return user

    def change_password(self, user, payload: ChangePasswordRequest) -> None:
        if not verify_password(payload.current_password, user.password_hash):
            raise AppException("Current password is incorrect.", status_code=400)
        user.password_hash = hash_password(payload.new_password)
        self.db.commit()
