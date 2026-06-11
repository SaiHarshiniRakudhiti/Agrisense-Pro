from fastapi import APIRouter, Depends
from app.schemas.crop import SoilInput, CropRecommendationResponse
from app.services.prediction_service import recommend_crop
from app.core.deps import get_current_user

router = APIRouter(prefix="/crop", tags=["Crop Recommendation"])

@router.post("/recommend", response_model=CropRecommendationResponse)
def crop_recommend(body: SoilInput, _: dict = Depends(get_current_user)):
    result = recommend_crop(body.N, body.P, body.K, body.temperature,
                            body.humidity, body.ph, body.rainfall)
    return {"success": True, **result}
