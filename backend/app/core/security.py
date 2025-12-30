from fastapi import Depends, Header, HTTPException, status

from app.core.config import settings


def verify_api_key(x_api_key: str | None = Header(default=None)) -> None:
    """
    Simple header-based authentication used by internal services.
    """
    if not settings.internal_api_key:
        return
    if x_api_key != settings.internal_api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API key",
        )


SecurityDependency = Depends(verify_api_key)
