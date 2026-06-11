"""Integration tests for AgriSense API endpoints."""
import pytest
from httpx import AsyncClient, ASGITransport
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../.."))

# Pre-load models before app import
from app.ml import model_registry
model_registry.load()

from main import app

@pytest.fixture(scope="module")
async def client_and_token():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        r = await client.post("/api/v1/auth/register", json={
            "email": "harsha@agrisense.ai", "password": "testpass123",
            "full_name": "Harsha Vardhan", "farm_name": "Test Farm", "location": "Vizag"
        })
        if r.status_code == 400:
            r = await client.post("/api/v1/auth/login", json={
                "email": "harsha@agrisense.ai", "password": "testpass123"
            })
        token = r.json()["access_token"]
        yield client, token

@pytest.mark.anyio
async def test_health():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        r = await client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "healthy"
    assert r.json()["models_ready"] is True

@pytest.mark.anyio
async def test_register_and_login():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        r = await client.post("/api/v1/auth/register", json={
            "email": "newfarmer@agrisense.ai", "password": "newpass123", "full_name": "New Farmer"
        })
        assert r.status_code in (201, 400)

@pytest.mark.anyio
async def test_crop_recommend_requires_auth():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        r = await client.post("/api/v1/crop/recommend", json={
            "N":90,"P":42,"K":43,"temperature":20.9,"humidity":82,"ph":6.5,"rainfall":202
        })
    assert r.status_code == 422

@pytest.mark.anyio
async def test_crop_recommend_authenticated(client_and_token):
    client, token = client_and_token
    r = await client.post("/api/v1/crop/recommend",
        headers={"Authorization": f"Bearer {token}"},
        json={"N":90,"P":42,"K":43,"temperature":20.9,"humidity":82,"ph":6.5,"rainfall":202})
    assert r.status_code == 200
    data = r.json()
    assert data["success"] is True
    assert "top_recommendation" in data
    assert data["confidence"] > 0
    assert len(data["alternatives"]) > 0
    assert "soil_health" in data

@pytest.mark.anyio
async def test_yield_predict_authenticated(client_and_token):
    client, token = client_and_token
    r = await client.post("/api/v1/yield/predict",
        headers={"Authorization": f"Bearer {token}"},
        json={"N":90,"P":42,"K":43,"temperature":25,"humidity":70,"rainfall":150,
              "ph":6.5,"area_hectares":5,"season":"Kharif","soil_type":"Loamy"})
    assert r.status_code == 200
    data = r.json()
    assert data["success"] is True
    assert data["total_yield_tonnes"] > 0
    assert data["estimated_revenue_inr"] > 0

@pytest.mark.anyio
async def test_fertilizer_advise_authenticated(client_and_token):
    client, token = client_and_token
    r = await client.post("/api/v1/fertilizer/advise",
        headers={"Authorization": f"Bearer {token}"},
        json={"N":50,"P":15,"K":30,"ph":6.0,"organic_matter":1.5,"moisture":45,"crop":"Rice"})
    assert r.status_code == 200
    data = r.json()
    assert data["success"] is True
    assert "recommended_fertilizer" in data
    assert data["confidence"] > 0

@pytest.mark.anyio
async def test_market_prices_authenticated(client_and_token):
    client, token = client_and_token
    r = await client.get("/api/v1/market/prices", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
    data = r.json()
    assert data["success"] is True
    assert len(data["prices"]) >= 10

@pytest.mark.anyio
async def test_invalid_token_rejected():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        r = await client.post("/api/v1/crop/recommend",
            headers={"Authorization": "Bearer totally.fake.token"},
            json={"N":90,"P":42,"K":43,"temperature":21,"humidity":82,"ph":6.5,"rainfall":202})
    assert r.status_code == 401
