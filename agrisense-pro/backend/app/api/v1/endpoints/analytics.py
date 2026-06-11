from fastapi import APIRouter, Depends
from app.core.deps import get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/dashboard")
def dashboard(_: dict = Depends(get_current_user)):
    return {"success": True, "data": {
        "total_recommendations": 12847, "accuracy_rate": 94.2,
        "crops_covered": 20, "states_covered": 28,
        "avg_yield_improvement": 23.5, "farmers_helped": 5230,
    }}

@router.get("/season-calendar")
def season_calendar(_: dict = Depends(get_current_user)):
    return {"success": True, "data": {
        "Kharif": {"sowing":"Jun-Jul","harvest":"Oct-Nov","crops":["Rice","Maize","Cotton","Soybean","Groundnut","Sorghum","Millet","Turmeric","Ginger"]},
        "Rabi":   {"sowing":"Oct-Nov","harvest":"Mar-Apr","crops":["Wheat","Barley","Mustard","Chickpea","Lentil","Potato","Onion"]},
        "Zaid":   {"sowing":"Mar-Apr","harvest":"Jun-Jul","crops":["Sunflower","Sugarcane","Watermelon","Cucumber","Tomato"]},
    }}

@router.get("/soil-guide")
def soil_guide(_: dict = Depends(get_current_user)):
    return {"success": True, "data": {
        "ph_guide":[
            {"range":"< 5.5","status":"Strongly Acidic","action":"Add agricultural lime"},
            {"range":"5.5–6.0","status":"Moderately Acidic","action":"Light liming recommended"},
            {"range":"6.0–7.0","status":"Optimal","action":"Maintain current soil health"},
            {"range":"7.0–7.5","status":"Neutral–Slightly Alkaline","action":"Monitor crop response"},
            {"range":"> 7.5","status":"Alkaline","action":"Add sulphur or acidifying fertilizers"},
        ],
        "npk_guide":{
            "N":"Promotes vegetative growth and green colour. Deficiency: yellowing of leaves.",
            "P":"Essential for root development and flowering. Deficiency: purple-tinged leaves.",
            "K":"Regulates water use and disease resistance. Deficiency: brown leaf edges."
        }
    }}
