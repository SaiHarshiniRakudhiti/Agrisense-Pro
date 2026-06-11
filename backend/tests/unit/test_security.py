"""Unit tests for auth security utilities."""
import pytest
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../.."))

from app.core.security import hash_password, verify_password, create_access_token, decode_token

def test_password_hash_not_plain():
    h = hash_password("mysecret123")
    assert h != "mysecret123"

def test_password_verify_correct():
    h = hash_password("mysecret123")
    assert verify_password("mysecret123", h) is True

def test_password_verify_wrong():
    h = hash_password("mysecret123")
    assert verify_password("wrongpassword", h) is False

def test_token_roundtrip():
    token = create_access_token({"sub": "test@example.com", "uid": "abc123"})
    payload = decode_token(token)
    assert payload["sub"] == "test@example.com"
    assert payload["uid"] == "abc123"

def test_invalid_token_returns_empty():
    payload = decode_token("totally.invalid.token")
    assert payload == {}
