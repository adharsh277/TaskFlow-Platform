"""Authentication dependencies for protected routes."""

from typing import Annotated

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db.session import get_db
from app.repositories.user_repository import UserRepository
from app.utils.security import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{get_settings().api_v1_prefix}/auth/login"
)
DbSession = Annotated[Session, Depends(get_db)]


def get_current_user(
    request: Request, db: DbSession, token: Annotated[str, Depends(oauth2_scheme)]
):
    """Resolve and validate the authenticated user from a bearer token."""

    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        user_id = int(decode_access_token(token))
    except (JWTError, ValueError):
        raise credentials_error from None
    user = UserRepository(db).get_by_id(user_id)
    if not user:
        raise credentials_error
    request.state.user_id = user.id
    return user


CurrentUser = Annotated[object, Depends(get_current_user)]
