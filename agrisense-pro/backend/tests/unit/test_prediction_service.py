"""Unit tests for prediction service logic."""
import pytest
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../.."))

from app.ml.training.trainer import (
    generate_crop_data, generate_yield_data, generate_fert_data,
    CROPS, FERT_TYPES, SEASONS, SOIL_TYPES
)

def test_crop_data_shape():
    X, y = generate_crop_data(n=100)
    assert X.shape[1] == 7, "Crop features must be 7"
    assert len(y) == 100

def test_crop_labels_valid():
    _, y = generate_crop_data(n=200)
    assert all(0 <= lbl < len(CROPS) for lbl in y)

def test_yield_data_positive():
    X, y = generate_yield_data(n=100)
    assert all(v > 0 for v in y), "All yield values must be positive"

def test_yield_data_shape():
    X, y = generate_yield_data(n=100)
    assert X.shape[1] == 10, "Yield features must be 10"

def test_fert_data_valid_labels():
    X, y = generate_fert_data(n=200)
    assert all(0 <= lbl < len(FERT_TYPES) for lbl in y)

def test_crops_list_not_empty():
    assert len(CROPS) >= 15

def test_seasons_list():
    assert "Kharif" in SEASONS and "Rabi" in SEASONS and "Zaid" in SEASONS
