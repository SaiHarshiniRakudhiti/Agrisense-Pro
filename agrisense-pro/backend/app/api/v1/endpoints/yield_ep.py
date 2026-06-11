from fastapi import APIRouter, Depends
from app.schemas.yield_schema import YieldInput, YieldResponse
from app.services.prediction_service import predict_yield
from app.core.deps import get_current_user

router = APIRouter(prefix="/yield", tags=["Yield Prediction"])

@router.post("/predict", response_model=YieldResponse)
def yield_predict(body: YieldInput, _: dict = Depends(get_current_user)):
    result = predict_yield(body.N, body.P, body.K, body.temperature, body.humidity,
                           body.rainfall, body.ph, body.area_hectares, body.season, body.soil_type)
    return {"success": True, **result}
