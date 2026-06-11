"""Singleton model registry — loaded once at startup."""
import joblib
from pathlib import Path
from app.core.logging import logger

_bundle: dict = {}
_ready: bool  = False

MODEL_PATH = Path(__file__).parent / "models" / "agrisense_models.joblib"

def load():
    global _bundle, _ready
    from app.ml.training.trainer import train_all
    train_all()
    if MODEL_PATH.exists():
        _bundle = joblib.load(MODEL_PATH)
        _ready  = True
        logger.info("model_registry.loaded", path=str(MODEL_PATH))
    else:
        logger.error("model_registry.missing", path=str(MODEL_PATH))

def is_ready() -> bool:
    return _ready

def get(key: str):
    return _bundle.get(key)
