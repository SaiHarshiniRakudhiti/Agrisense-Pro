from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import time

from app.core.config import settings
from app.core.logging import setup_logging, logger
from app.core.exceptions import AgriSenseException, agrisense_exception_handler, generic_exception_handler
from app.api.v1.router import api_router
from app.ml import model_registry

setup_logging()
limiter = Limiter(key_func=get_remote_address, default_limits=[f"{settings.rate_limit_per_minute}/minute"])

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("startup.begin", app=settings.app_name, env=settings.app_env)
    model_registry.load()
    logger.info("startup.complete", models_ready=model_registry.is_ready())
    yield
    logger.info("shutdown")

app = FastAPI(
    title="AgriSense API",
    description="Industrial-grade Crop Intelligence Platform — AI for Indian Agriculture",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_exception_handler(AgriSenseException, agrisense_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True,
                   allow_methods=["*"], allow_headers=["*"])

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = round((time.time() - start) * 1000, 2)
    logger.info("http.request", method=request.method, path=request.url.path,
                status=response.status_code, duration_ms=duration)
    return response

app.include_router(api_router)

@app.get("/", tags=["Health"])
def root():
    return {"app": settings.app_name, "version": "1.0.0", "status": "running", "env": settings.app_env}

@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy", "models_ready": model_registry.is_ready(), "version": "1.0.0"}
