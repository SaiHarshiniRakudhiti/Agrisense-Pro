from pydantic import BaseModel, Field
from typing import List

class YieldInput(BaseModel):
    N:             float = Field(..., ge=0, le=300)
    P:             float = Field(..., ge=0, le=150)
    K:             float = Field(..., ge=0, le=500)
    temperature:   float = Field(..., ge=0, le=50)
    humidity:      float = Field(..., ge=0, le=100)
    rainfall:      float = Field(..., ge=0, le=400)
    ph:            float = Field(..., ge=3.0, le=10.0)
    area_hectares: float = Field(..., ge=0.1, le=5000)
    season:        str
    soil_type:     str

class YieldResponse(BaseModel):
    success:              bool = True
    total_yield_tonnes:   float
    yield_per_hectare:    float
    yield_category:       str
    estimated_revenue_inr: float
    optimisation_tips:    List[str]
    season:               str
