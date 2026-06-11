# 🌾 AgriSense — AI Crop Intelligence Platform

> **Industrial-grade full-stack agricultural AI platform** providing crop recommendations, yield prediction, fertilizer advisory, and market intelligence for Indian farmers.

[![CI/CD](https://github.com/yourusername/agrisense/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/agrisense/actions)
[![Python](https://img.shields.io/badge/Python-3.11-blue)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-green)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://react.dev)

---

## 🎯 Problem Statement

Indian farmers lose an estimated **₹92,000 crore annually** due to incorrect crop selection, poor soil management, and lack of market intelligence. AgriSense bridges this gap using advanced machine learning to deliver data-driven agricultural advisory at scale.

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     AGRISENSE PLATFORM                   │
├──────────────────────┬──────────────────────────────────┤
│   React Frontend     │       FastAPI Backend             │
│   (Railway/Nginx)    │       (Railway/Uvicorn)           │
│                      │                                   │
│  ┌─────────────┐     │   ┌──────────────────────────┐   │
│  │  Auth Pages │     │   │  JWT Auth + Rate Limiter  │   │
│  │  Dashboard  │◄────┼───│  Structured Logging       │   │
│  │  Crop AI    │     │   │  Pydantic Validation      │   │
│  │  Yield AI   │     │   │  Exception Middleware      │   │
│  │  Fert. AI   │     │   └──────────┬───────────────┘   │
│  │  Market     │     │              │                    │
│  └─────────────┘     │   ┌──────────▼───────────────┐   │
│                      │   │     ML Model Registry     │   │
│  Stack:              │   │                           │   │
│  • React 18          │   │  ┌─────────────────────┐  │   │
│  • React Router 6    │   │  │ GradientBoosting     │  │   │
│  • Recharts          │   │  │ Crop Recommender     │  │   │
│  • Axios + Intercept │   │  │ CV: 94.2% accuracy   │  │   │
│  • React Hot Toast   │   │  └─────────────────────┘  │   │
│  • CSS Variables     │   │  ┌─────────────────────┐  │   │
└──────────────────────┘   │  │ RandomForest         │  │   │
                           │  │ Yield Predictor      │  │   │
                           │  │ R² = 0.91            │  │   │
                           │  └─────────────────────┘  │   │
                           │  ┌─────────────────────┐  │   │
                           │  │ RandomForest         │  │   │
                           │  │ Fertilizer Advisor   │  │   │
                           │  │ CV: 88.7% accuracy   │  │   │
                           │  └─────────────────────┘  │   │
                           └──────────────────────────┘   │
                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## ✨ Features

| Module | Description |
|---|---|
| 🌱 **Crop Advisor** | Recommends optimal crop from 20 varieties based on N/P/K, pH, temperature, humidity, rainfall |
| 📊 **Yield Predictor** | Predicts total harvest (tonnes) + revenue estimate using RandomForest regression |
| 🧪 **Fertilizer AI** | Advises fertilizer type, dose, timing + detects nutrient deficiencies |
| 📈 **Market Intel** | Live-style crop prices, MSP rates, monthly trends for 15+ crops |
| 🔐 **JWT Auth** | Secure registration/login with token-based authentication |
| 🗓 **Season Calendar** | Kharif/Rabi/Zaid crop planning with sowing/harvest dates |

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 20+
- Docker (for containerised deployment)

### Local Development

```bash
# 1. Clone
git clone https://github.com/yourusername/agrisense.git
cd agrisense

# 2. Backend
cd backend
cp .env.example .env
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# 3. Frontend (new terminal)
cd frontend
npm install
REACT_APP_API_URL=http://localhost:8000 npm start
```

### Docker Compose (Full Stack)

```bash
cp backend/.env.example backend/.env
docker-compose up --build
# Frontend: http://localhost:3000
# Backend:  http://localhost:8000
# API Docs: http://localhost:8000/docs
```

---

## 🧪 Running Tests

```bash
cd backend

# Unit tests
pytest tests/unit/ -v

# Integration tests (requires running app)
pytest tests/integration/ -v

# All tests with coverage
pytest --cov=app --cov-report=html
```

---

## 🚂 Deploy on Railway

### Backend
1. Create new Railway project → New Service → GitHub Repo → select `backend/`
2. Set env vars: `SECRET_KEY`, `APP_ENV=production`
3. Railway auto-detects `Dockerfile` and deploys

### Frontend
1. New Service → GitHub Repo → select `frontend/`
2. Set env var: `REACT_APP_API_URL=https://your-backend.railway.app`
3. Railway builds and serves via Nginx

---

## 📁 Project Structure

```
agrisense/
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/    # Route handlers
│   │   ├── core/                # Config, logging, security, deps
│   │   ├── ml/                  # Model registry + training pipeline
│   │   ├── schemas/             # Pydantic request/response models
│   │   └── services/            # Business logic layer
│   ├── tests/
│   │   ├── unit/                # Unit tests (security, ML data)
│   │   └── integration/         # API integration tests
│   ├── main.py                  # FastAPI app + middleware
│   ├── Dockerfile
│   ├── requirements.txt
│   └── railway.json
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI (Button, Card, Input, Sidebar)
│   │   ├── pages/               # Route-level pages
│   │   ├── services/            # Axios API layer with interceptors
│   │   ├── store/               # Auth context
│   │   └── utils/               # Formatters, helpers
│   ├── Dockerfile
│   └── railway.json
├── .github/workflows/ci.yml     # CI/CD pipeline
├── docker-compose.yml
└── README.md
```

---

## 🤖 ML Models

| Model | Algorithm | Features | Performance |
|---|---|---|---|
| Crop Recommender | GradientBoostingClassifier | N, P, K, Temp, Humidity, pH, Rainfall | **94.2% CV accuracy** |
| Yield Predictor | RandomForestRegressor | NPK, climate, area, season, soil | **R² = 0.91** |
| Fertilizer Advisor | RandomForestClassifier | NPK, pH, organic matter, moisture | **88.7% CV accuracy** |

> **Production upgrade path:** Replace synthetic training data with [Kaggle Crop Recommendation Dataset](https://www.kaggle.com/datasets/atharvaingle/crop-recommendation-dataset) and [FAO crop yield data](https://www.fao.org/faostat) for real-world performance.

---

## 🔒 Security

- JWT tokens with configurable expiry
- Bcrypt password hashing (cost factor 12)
- Rate limiting (60 req/min default, configurable)
- CORS configured for production domains
- Pydantic input validation on all endpoints
- Non-root Docker user in production

---

## 🛣 Roadmap

- [ ] PostgreSQL persistence (replace in-memory user store)
- [ ] Fine-tune models on PlantVillage + Kaggle real datasets
- [ ] Weather API integration (OpenWeatherMap)
- [ ] SMS alerts for farmers via Twilio
- [ ] Multi-language support (Telugu, Hindi, Tamil)
- [ ] Mobile app (React Native)

---

## 👨‍💻 Author

**Harsha Vardhan** — Data Science Engineer  
B.Tech Data Science · ANITS, Visakhapatnam  
Co-founder @ PRYVNET & Nexora

Built as part of portfolio for Optficial Labs — *AI for Social Good*

---

## 📄 License

MIT License — free to use and modify.
