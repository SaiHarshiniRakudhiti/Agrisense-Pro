from pydantic import BaseModel, Field
from typing import List, Optional

class SoilInput(BaseModel):
    N:           float = Field(..., ge=0, le=300, description="Nitrogen kg/ha")
    P:           float = Field(..., ge=0, le=150, description="Phosphorus kg/ha")
    K:           float = Field(..., ge=0, le=500, description="Potassium kg/ha")
    temperature: float = Field(..., ge=0, le=50,  description="Temperature °C")
    humidity:    float = Field(..., ge=0, le=100, description="Relative humidity %")
    ph:          float = Field(..., ge=3.0, le=10.0, description="Soil pH")
    rainfall:    float = Field(..., ge=0, le=400, description="Rainfall mm/month")

class CropRecommendation(BaseModel):
    crop:        str
    confidence:  float
    suitability: str

class SoilHealth(BaseModel):
    score:  int
    rating: str
    issues: List[str]

class CropRecommendationResponse(BaseModel):
    success:          bool = True
    top_recommendation: str
    confidence:       float
    alternatives:     List[CropRecommendation]
    soil_health:      SoilHealth
    agronomic_notes:  List[str]
