from fastapi import Depends, Header
from app.core.security import decode_token
from app.core.exceptions import AgriSenseException
from app.services import auth_service

def get_current_user(authorization: str = Header(...)) -> dict:
    if not authorization.startswith("Bearer "):
        raise AgriSenseException(401, "Invalid auth header", "INVALID_HEADER")
    token = authorization.split(" ", 1)[1]
    payload = decode_token(token)
    if not payload:
        raise AgriSenseException(401, "Token invalid or expired", "TOKEN_INVALID")
    user = auth_service.get_user_by_email(payload.get("sub",""))
    if not user:
        raise AgriSenseException(401, "User not found", "USER_NOT_FOUND")
    return user
