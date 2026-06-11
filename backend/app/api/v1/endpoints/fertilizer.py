from fastapi import APIRouter, Depends
from app.schemas.fertilizer import FertilizerInput, FertilizerResponse
from app.services.prediction_service import advise_fertilizer
from app.core.deps import get_current_user

router = APIRouter(prefix="/fertilizer", tags=["Fertilizer Advisory"])

@router.post("/advise", response_model=FertilizerResponse)
def fertilizer_advise(body: FertilizerInput, _: dict = Depends(get_current_user)):
    result = advise_fertilizer(body.N, body.P, body.K, body.ph,
                               body.organic_matter, body.moisture, body.crop)
    return {"success": True, **result}
