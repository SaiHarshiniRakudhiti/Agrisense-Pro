from pydantic import BaseModel, Field
from typing import List, Optional

class FertilizerInput(BaseModel):
    N:              float = Field(..., ge=0, le=300)
    P:              float = Field(..., ge=0, le=150)
    K:              float = Field(..., ge=0, le=500)
    ph:             float = Field(..., ge=3.0, le=10.0)
    organic_matter: float = Field(..., ge=0, le=10)
    moisture:       float = Field(..., ge=0, le=100)
    crop:           str

class Deficiency(BaseModel):
    nutrient:  str
    severity:  str
    fix:       str

class FertilizerResponse(BaseModel):
    success:                bool = True
    recommended_fertilizer: str
    confidence:             float
    npk_ratio:              str
    dose_kg_per_hectare:    int
    application_timing:     str
    deficiencies_detected:  List[Deficiency]
    organic_matter_status:  str
    cost_estimate_inr_per_ha: int
