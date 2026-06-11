from fastapi import APIRouter, Depends
from app.services.market_service import get_all_prices, get_crop_detail
from app.core.deps import get_current_user
from app.core.exceptions import AgriSenseException

router = APIRouter(prefix="/market", tags=["Market Intelligence"])

@router.get("/prices")
def market_prices(_: dict = Depends(get_current_user)):
    return {"success": True, **get_all_prices()}

@router.get("/prices/{crop}")
def crop_price(crop: str, _: dict = Depends(get_current_user)):
    detail = get_crop_detail(crop)
    if not detail:
        raise AgriSenseException(404, f"No market data for {crop}", "CROP_NOT_FOUND")
    return {"success": True, **detail}
