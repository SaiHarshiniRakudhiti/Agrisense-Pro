from fastapi import APIRouter
from app.api.v1.endpoints import auth, crop, yield_ep, fertilizer, market, analytics

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth.router)
api_router.include_router(crop.router)
api_router.include_router(yield_ep.router)
api_router.include_router(fertilizer.router)
api_router.include_router(market.router)
api_router.include_router(analytics.router)
