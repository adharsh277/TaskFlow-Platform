"""JWT authentication endpoints."""

from typing import Annotated

from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm

from app.dependencies.auth import CurrentUser
from app.dependencies.services import get_auth_service
from app.schemas.auth import TokenResponse, UserCreate, UserResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a user",
)
def register(
    payload: UserCreate, service: Annotated[AuthService, Depends(get_auth_service)]
) -> UserResponse:
    return service.register(payload)


@router.post("/login", response_model=TokenResponse, summary="Login and issue a JWT")
def login(
    form: Annotated[OAuth2PasswordRequestForm, Depends()],
    service: Annotated[AuthService, Depends(get_auth_service)],
) -> TokenResponse:
    return TokenResponse(access_token=service.login(form.username, form.password))


@router.post(
    "/logout", status_code=status.HTTP_200_OK, summary="Logout the current session"
)
def logout(_: CurrentUser) -> dict[str, object]:
    return {"success": True, "message": "Logout successful.", "data": None}


@router.get("/me", response_model=UserResponse, summary="Get the current user")
def current_user(user: CurrentUser) -> UserResponse:
    return user
