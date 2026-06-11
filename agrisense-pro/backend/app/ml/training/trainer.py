"""
AgriSense ML Training Pipeline
Trains 3 production-grade models on agronomically realistic data.
In production: replace generate_* functions with real Kaggle dataset loaders.
"""
import numpy as np
import joblib
import os
from pathlib import Path

MODEL_DIR = Path(__file__).parent.parent / "models"
MODEL_DIR.mkdir(exist_ok=True)

CROPS = [
    "Rice","Wheat","Maize","Soybean","Cotton","Sugarcane",
    "Groundnut","Sunflower","Barley","Sorghum","Millet","Chickpea",
    "Lentil","Mustard","Turmeric","Ginger","Potato","Tomato","Onion","Banana"
]

SEASONS    = ["Kharif","Rabi","Zaid"]
SOIL_TYPES = ["Sandy","Loamy","Clay","Silt","Sandy Loam","Clay Loam","Black Cotton"]

CROP_PROFILES = {
    "Rice":      dict(N=(80,120),P=(40,60), K=(40,60), temp=(20,35),humidity=(70,90),ph=(5.5,7.0),rain=(150,300)),
    "Wheat":     dict(N=(60,120),P=(30,60), K=(30,60), temp=(10,25),humidity=(50,75),ph=(6.0,7.5),rain=(50,100)),
    "Maize":     dict(N=(80,150),P=(40,80), K=(40,80), temp=(18,35),humidity=(50,80),ph=(5.8,7.0),rain=(50,100)),
    "Soybean":   dict(N=(20,40), P=(60,100),K=(60,100),temp=(20,30),humidity=(60,80),ph=(6.0,7.0),rain=(60,100)),
    "Cotton":    dict(N=(60,120),P=(30,60), K=(30,60), temp=(25,40),humidity=(40,70),ph=(6.0,8.0),rain=(50,100)),
    "Sugarcane": dict(N=(100,200),P=(50,100),K=(100,200),temp=(20,38),humidity=(70,90),ph=(6.0,7.5),rain=(100,200)),
    "Groundnut": dict(N=(15,30), P=(40,80), K=(40,80), temp=(22,35),humidity=(50,75),ph=(5.5,7.0),rain=(50,75)),
    "Sunflower": dict(N=(40,80), P=(40,80), K=(40,80), temp=(18,35),humidity=(40,70),ph=(6.0,7.5),rain=(30,60)),
    "Barley":    dict(N=(40,80), P=(20,40), K=(20,40), temp=(8,22), humidity=(45,70),ph=(6.0,8.0),rain=(30,60)),
    "Sorghum":   dict(N=(40,80), P=(20,40), K=(30,60), temp=(25,40),humidity=(40,70),ph=(5.5,7.5),rain=(30,75)),
    "Millet":    dict(N=(30,60), P=(20,40), K=(20,40), temp=(25,40),humidity=(40,65),ph=(5.5,7.5),rain=(25,60)),
    "Chickpea":  dict(N=(15,30), P=(40,80), K=(20,40), temp=(15,30),humidity=(40,65),ph=(6.0,8.0),rain=(30,60)),
    "Lentil":    dict(N=(15,25), P=(30,60), K=(20,40), temp=(15,25),humidity=(40,65),ph=(6.0,8.0),rain=(25,50)),
    "Mustard":   dict(N=(60,100),P=(30,50), K=(30,50), temp=(10,25),humidity=(40,70),ph=(6.0,7.5),rain=(25,50)),
    "Turmeric":  dict(N=(60,120),P=(40,80), K=(80,120),temp=(20,35),humidity=(70,90),ph=(5.5,7.0),rain=(100,200)),
    "Ginger":    dict(N=(60,100),P=(40,80), K=(80,120),temp=(20,35),humidity=(70,90),ph=(5.5,6.5),rain=(100,150)),
    "Potato":    dict(N=(80,150),P=(60,120),K=(100,180),temp=(10,25),humidity=(60,80),ph=(5.5,6.5),rain=(50,100)),
    "Tomato":    dict(N=(80,150),P=(60,120),K=(80,150),temp=(18,30),humidity=(60,80),ph=(6.0,7.0),rain=(40,75)),
    "Onion":     dict(N=(60,100),P=(40,80), K=(40,80), temp=(15,30),humidity=(50,75),ph=(6.0,7.5),rain=(30,60)),
    "Banana":    dict(N=(100,200),P=(30,60),K=(200,400),temp=(20,35),humidity=(70,90),ph=(5.5,7.0),rain=(100,200)),
}

FERT_TYPES = [
    "Urea","DAP","MOP","NPK 10-26-26","NPK 12-32-16",
    "Ammonium Sulphate","SSP","Compost+Urea","Vermicompost"
]

FERT_DETAILS = {
    "Urea":               dict(npk="46-0-0",  dose=120, timing="Basal + top-dress at 30 & 60 DAS"),
    "DAP":                dict(npk="18-46-0", dose=100, timing="Basal application before sowing"),
    "MOP":                dict(npk="0-0-60",  dose=80,  timing="Basal application before sowing"),
    "NPK 10-26-26":       dict(npk="10-26-26",dose=150, timing="Basal application"),
    "NPK 12-32-16":       dict(npk="12-32-16",dose=150, timing="Basal application"),
    "Ammonium Sulphate":  dict(npk="21-0-0",  dose=200, timing="Top-dressing in splits"),
    "SSP":                dict(npk="0-16-0",  dose=375, timing="Basal application"),
    "Compost+Urea":       dict(npk="varies",  dose=500, timing="Apply 2 weeks before sowing"),
    "Vermicompost":       dict(npk="varies",  dose=1000,timing="Apply 1 month before sowing"),
}

def generate_crop_data(n=12000):
    np.random.seed(42)
    X, y = [], []
    per_crop = n // len(CROPS)
    for idx, crop in enumerate(CROPS):
        p = CROP_PROFILES[crop]
        for _ in range(per_crop):
            noise = lambda: np.random.normal(0, 0.07)
            X.append([
                np.clip(np.random.uniform(*p["N"])   * (1+noise()), 0, 300),
                np.clip(np.random.uniform(*p["P"])   * (1+noise()), 0, 150),
                np.clip(np.random.uniform(*p["K"])   * (1+noise()), 0, 500),
                np.clip(np.random.uniform(*p["temp"])* (1+noise()), 0, 50),
                np.clip(np.random.uniform(*p["humidity"])*(1+noise()),0,100),
                np.clip(np.random.uniform(*p["ph"])  + np.random.normal(0,0.1), 3, 10),
                np.clip(np.random.uniform(*p["rain"])* (1+noise()), 0, 400),
            ])
            y.append(idx)
    return np.array(X), np.array(y)

def generate_yield_data(n=8000):
    np.random.seed(99)
    X, y = [], []
    for _ in range(n):
        N, P, K = np.random.uniform(20,200), np.random.uniform(10,120), np.random.uniform(10,400)
        temp, hum  = np.random.uniform(8,40), np.random.uniform(30,95)
        rain, ph   = np.random.uniform(20,300), np.random.uniform(4.5,8.5)
        area       = np.random.uniform(0.5, 200)
        season_enc = np.random.randint(0,3)
        soil_enc   = np.random.randint(0,7)
        n_fac = np.clip((N-40)/160, 0,1)
        p_fac = np.clip((P-20)/80,  0,1)
        k_fac = np.clip((K-20)/200, 0,1)
        t_fac = 1 - abs(temp-25)/25
        r_fac = np.clip(rain/150, 0.3, 1)
        ph_fac= 1 - abs(ph-6.5)/3
        yval  = 2.8*(1+n_fac*0.4+p_fac*0.2+k_fac*0.2+t_fac*0.1+r_fac*0.1)*ph_fac*area*(1+np.random.normal(0,0.08))
        X.append([N,P,K,temp,hum,rain,ph,area,season_enc,soil_enc])
        y.append(max(yval, 0.1))
    return np.array(X), np.array(y)

def generate_fert_data(n=6000):
    np.random.seed(77)
    X, y = [], []
    for _ in range(n):
        N, P, K = np.random.uniform(10,200), np.random.uniform(5,120), np.random.uniform(5,400)
        ph, om  = np.random.uniform(4.5,9.0), np.random.uniform(0.1,5.0)
        mois    = np.random.uniform(10,90)
        crop_enc= np.random.randint(0, len(CROPS))
        if N < 40:    lbl = 0
        elif P < 20:  lbl = 1
        elif K < 20:  lbl = 2
        elif ph < 5.5:lbl = 5
        elif ph > 7.5:lbl = 6
        elif om < 1.0:lbl = 7
        else:         lbl = np.random.randint(3,5)
        if np.random.random() < 0.12:
            lbl = np.random.randint(0, len(FERT_TYPES))
        X.append([N,P,K,ph,om,mois,crop_enc])
        y.append(lbl)
    return np.array(X), np.array(y)

def train_all():
    marker = MODEL_DIR / "trained.ok"
    if marker.exists():
        return
    from sklearn.ensemble import GradientBoostingClassifier, RandomForestRegressor, RandomForestClassifier
    from sklearn.preprocessing import StandardScaler
    from sklearn.pipeline import Pipeline
    from sklearn.model_selection import cross_val_score

    print("🌾 [AgriSense] Training ML models...")

    # Crop model
    Xc, yc = generate_crop_data()
    sc1 = StandardScaler()
    Xcs = sc1.fit_transform(Xc)
    crop_clf = GradientBoostingClassifier(n_estimators=300, max_depth=5, learning_rate=0.08, subsample=0.8, random_state=42)
    crop_clf.fit(Xcs, yc)
    cv = cross_val_score(crop_clf, Xcs, yc, cv=5, scoring="accuracy")
    print(f"  ✅ Crop model  — CV accuracy: {cv.mean()*100:.1f}% ± {cv.std()*100:.1f}%")

    # Yield model
    Xy, yy = generate_yield_data()
    sc2 = StandardScaler()
    Xys = sc2.fit_transform(Xy)
    yield_reg = RandomForestRegressor(n_estimators=300, max_depth=14, min_samples_leaf=2, random_state=42, n_jobs=-1)
    yield_reg.fit(Xys, yy)
    print(f"  ✅ Yield model — R² score: {yield_reg.score(Xys, yy):.3f}")

    # Fertilizer model
    Xf, yf = generate_fert_data()
    sc3 = StandardScaler()
    Xfs = sc3.fit_transform(Xf)
    fert_clf = RandomForestClassifier(n_estimators=200, max_depth=10, random_state=42, n_jobs=-1)
    fert_clf.fit(Xfs, yf)
    cv2 = cross_val_score(fert_clf, Xfs, yf, cv=5, scoring="accuracy")
    print(f"  ✅ Fert model  — CV accuracy: {cv2.mean()*100:.1f}% ± {cv2.std()*100:.1f}%")

    bundle = dict(
        crop_clf=crop_clf, yield_reg=yield_reg, fert_clf=fert_clf,
        sc_crop=sc1, sc_yield=sc2, sc_fert=sc3,
        crops=CROPS, seasons=SEASONS, soil_types=SOIL_TYPES,
        fert_types=FERT_TYPES, fert_details=FERT_DETAILS,
    )
    joblib.dump(bundle, MODEL_DIR / "agrisense_models.joblib", compress=3)
    marker.touch()
    print("  ✅ Models serialised with joblib")
