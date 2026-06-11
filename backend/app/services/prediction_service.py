import numpy as np
from app.ml import model_registry as reg
from app.core.exceptions import AgriSenseException
from app.core.logging import logger

SEASONS    = ["Kharif","Rabi","Zaid"]
SOIL_TYPES = ["Sandy","Loamy","Clay","Silt","Sandy Loam","Clay Loam","Black Cotton"]

def _check():
    if not reg.is_ready():
        raise AgriSenseException(503, "Models not ready", "MODEL_UNAVAILABLE")

def recommend_crop(N,P,K,temperature,humidity,ph,rainfall) -> dict:
    _check()
    crops   = reg.get("crops")
    X       = np.array([[N,P,K,temperature,humidity,ph,rainfall]])
    X_s     = reg.get("sc_crop").transform(X)
    clf     = reg.get("crop_clf")
    probs   = clf.predict_proba(X_s)[0]
    top5    = np.argsort(probs)[::-1][:5]
    recs    = [{"crop":crops[i],"confidence":round(float(probs[i])*100,2),
                "suitability":"Excellent" if probs[i]>0.35 else "Good" if probs[i]>0.12 else "Moderate" if probs[i]>0.04 else "Low"}
               for i in top5]
    importances = clf.feature_importances_
    feat_names  = ["Nitrogen","Phosphorus","Potassium","Temperature","Humidity","pH","Rainfall"]
    top_feat_idx= np.argsort(importances)[::-1][:3]
    notes = [f"{feat_names[i]} is a key driver for {recs[0]['crop']} cultivation" for i in top_feat_idx]
    logger.info("prediction.crop", top=recs[0]["crop"], conf=recs[0]["confidence"])
    return dict(top_recommendation=recs[0]["crop"], confidence=recs[0]["confidence"],
                alternatives=recs[1:], agronomic_notes=notes,
                soil_health=_soil_health(N,P,K,ph))

def predict_yield(N,P,K,temperature,humidity,rainfall,ph,area,season,soil_type) -> dict:
    _check()
    s_enc = SEASONS.index(season) if season in SEASONS else 0
    t_enc = SOIL_TYPES.index(soil_type) if soil_type in SOIL_TYPES else 1
    X     = np.array([[N,P,K,temperature,humidity,rainfall,ph,area,s_enc,t_enc]])
    X_s   = reg.get("sc_yield").transform(X)
    yval  = float(reg.get("yield_reg").predict(X_s)[0])
    per_ha= yval/area
    tips  = []
    if N < 60:    tips.append("Increase Nitrogen to boost vegetative growth (+10-15% yield)")
    if ph < 6.0:  tips.append("Correct soil pH to 6.0–7.0 for optimal nutrient uptake")
    if rainfall<50:tips.append("Install drip irrigation to compensate for low rainfall")
    if per_ha<2:  tips.append("Adopt high-yield varieties certified for your agro-climatic zone")
    if not tips:  tips.append("Parameters are near-optimal — maintain current agronomic practices")
    logger.info("prediction.yield", total=round(yval,2), per_ha=round(per_ha,2))
    return dict(total_yield_tonnes=round(yval,2), yield_per_hectare=round(per_ha,2),
                yield_category="High" if per_ha>4 else "Medium" if per_ha>2 else "Low",
                estimated_revenue_inr=round(yval*18000,0), optimisation_tips=tips, season=season)

def advise_fertilizer(N,P,K,ph,organic_matter,moisture,crop) -> dict:
    _check()
    crops    = reg.get("crops")
    fert_t   = reg.get("fert_types")
    fert_d   = reg.get("fert_details")
    crop_enc = crops.index(crop) if crop in crops else 0
    X        = np.array([[N,P,K,ph,organic_matter,moisture,crop_enc]])
    X_s      = reg.get("sc_fert").transform(X)
    probs    = reg.get("fert_clf").predict_proba(X_s)[0]
    top_idx  = int(np.argmax(probs))
    fname    = fert_t[top_idx]
    fd       = fert_d.get(fname, {})
    defic    = []
    if N < 40:    defic.append(dict(nutrient="Nitrogen",   severity="High",     fix="Apply urea @ 40 kg/ha as top-dress"))
    if P < 20:    defic.append(dict(nutrient="Phosphorus", severity="High",     fix="Apply DAP @ 50 kg/ha basal"))
    if K < 20:    defic.append(dict(nutrient="Potassium",  severity="High",     fix="Apply MOP @ 30 kg/ha basal"))
    if ph < 5.5:  defic.append(dict(nutrient="pH",         severity="Critical", fix="Apply agricultural lime @ 2 t/ha"))
    elif ph > 7.8:defic.append(dict(nutrient="pH",         severity="High",     fix="Apply sulphur @ 500 kg/ha to acidify"))
    logger.info("prediction.fertilizer", fertilizer=fname, conf=round(float(probs[top_idx])*100,2))
    return dict(recommended_fertilizer=fname, confidence=round(float(probs[top_idx])*100,2),
                npk_ratio=fd.get("npk","N/A"), dose_kg_per_hectare=fd.get("dose",100),
                application_timing=fd.get("timing","Basal"), deficiencies_detected=defic,
                organic_matter_status="Adequate" if organic_matter>2 else "Low — incorporate compost at 5 t/ha",
                cost_estimate_inr_per_ha=fd.get("dose",100)*22)

def _soil_health(N,P,K,ph):
    issues = []
    if ph < 5.5:  issues.append("Strongly acidic soil — apply lime to raise pH")
    elif ph > 7.8:issues.append("Alkaline soil — apply sulphur or gypsum")
    if N < 40:    issues.append("Nitrogen deficient — yellowing risk in young plants")
    if P < 20:    issues.append("Phosphorus low — root development may be impaired")
    if K < 20:    issues.append("Potassium low — disease resistance may be reduced")
    score = max(0, 100-len(issues)*18)
    return dict(score=score, rating="Excellent" if score>=80 else "Good" if score>=60 else "Fair" if score>=40 else "Poor", issues=issues)
