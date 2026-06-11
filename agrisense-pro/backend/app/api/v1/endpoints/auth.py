from fastapi import APIRouter
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse, status_code=201)
def register(body: RegisterRequest):
    return auth_service.register(
        email=body.email, password=body.password,
        full_name=body.full_name, farm_name=body.farm_name, location=body.location
    )

@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest):
    return auth_service.login(email=body.email, password=body.password)

@router.get("/me")
def me(user: dict = __import__('fastapi').Depends(__import__('app.core.deps', fromlist=['get_current_user']).get_current_user)):
    return {"success": True, "user": user}
