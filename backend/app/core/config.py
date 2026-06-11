from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    app_name: str = "AgriSense"
    app_env: str = "development"
    secret_key: str = "dev-secret-key-change-in-production"
    access_token_expire_minutes: int = 60
    rate_limit_per_minute: int = 60
    log_level: str = "INFO"

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
