"""In-memory user store — swap with PostgreSQL in production."""
import uuid
from datetime import datetime, timezone
from app.core.security import hash_password, verify_password, create_access_token
from app.core.exceptions import AgriSenseException
from app.core.logging import logger

_users: dict = {}

def register(email: str, password: str, full_name: str, farm_name=None, location=None) -> dict:
    if email in _users:
        raise AgriSenseException(400, "Email already registered", "EMAIL_EXISTS")
    user_id = str(uuid.uuid4())
    _users[email] = dict(
        id=user_id, email=email,
        hashed_password=hash_password(password),
        full_name=full_name, farm_name=farm_name,
        location=location, created_at=datetime.now(timezone.utc).isoformat(), is_active=True
    )
    logger.info("auth.register", email=email, user_id=user_id)
    token = create_access_token({"sub": email, "uid": user_id})
    return {"access_token": token, "token_type": "bearer", "user": _safe(_users[email])}

def login(email: str, password: str) -> dict:
    user = _users.get(email)
    if not user or not verify_password(password, user["hashed_password"]):
        raise AgriSenseException(401, "Invalid credentials", "INVALID_CREDENTIALS")
    logger.info("auth.login", email=email)
    token = create_access_token({"sub": email, "uid": user["id"]})
    return {"access_token": token, "token_type": "bearer", "user": _safe(user)}

def get_user_by_email(email: str) -> dict | None:
    return _users.get(email)

def _safe(user: dict) -> dict:
    return {k: v for k, v in user.items() if k != "hashed_password"}
