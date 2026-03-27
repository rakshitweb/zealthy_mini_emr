from fastapi import Request
from fastapi.responses import JSONResponse
from jose import JWTError, jwt
from starlette.middleware.base import BaseHTTPMiddleware

from config.Config import config
from config.logger import get_logger

logger = get_logger(__name__)

EXCLUDED_PATHS = {
    "/health",
    "/api/v1/auth/login",
}


class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.url.path in EXCLUDED_PATHS:
            return await call_next(request)

        authorization = request.headers.get("Authorization")
        if not authorization or not authorization.startswith("Bearer "):
            return JSONResponse(status_code=401, content={"detail": "Invalid session found. Please login again."})

        token = authorization.removeprefix("Bearer ")
        try:
            jwt.decode(token, config.JWT_SECRET, algorithms=[config.JWT_ALGORITHM])
        except JWTError:
            logger.warning(f"Invalid token for {request.url.path}")
            return JSONResponse(status_code=401, content={"detail": "Invalid or expired token found. Please login again."})

        return await call_next(request)
