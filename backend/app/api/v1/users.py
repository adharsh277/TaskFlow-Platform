"""Authenticated user profile endpoints."""

from typing import Annotated

from fastapi import APIRouter, Depends

from app.dependencies.auth import CurrentUser
from app.dependencies.services import get_auth_service
from app.schemas.auth import ChangePasswordRequest, UserResponse, UserUpdate
from app.services.auth_service import AuthService

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponse, summary="Get the current profile")
def get_profile(user: CurrentUser) -> UserResponse:
    return user


@router.put("/me", response_model=UserResponse, summary="Update the current profile")
def update_profile(
    payload: UserUpdate,
    user: CurrentUser,
    service: Annotated[AuthService, Depends(get_auth_service)],
) -> UserResponse:
    return service.update_profile(user, payload)


@router.patch(
    "/change-password", status_code=200, summary="Change the current password"
)
def change_password(
    payload: ChangePasswordRequest,
    user: CurrentUser,
    service: Annotated[AuthService, Depends(get_auth_service)],
) -> dict[str, object]:
    service.change_password(user, payload)
    return {"success": True, "message": "Password changed successfully.", "data": None}
