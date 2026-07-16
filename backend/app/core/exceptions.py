"""Application exceptions and their HTTP-safe representation."""


class AppException(Exception):
    """Base exception for expected application errors."""

    status_code = 400
    code = "application_error"

    def __init__(self, message: str, *, status_code: int | None = None) -> None:
        super().__init__(message)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
