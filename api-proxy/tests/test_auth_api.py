from __future__ import annotations

import importlib.util
import sqlite3
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

import pytest
from fastapi.testclient import TestClient


REPO_ROOT = Path(__file__).resolve().parents[2]
MODULE_PATH = REPO_ROOT / "api-proxy" / "main.py"


def load_api_module(module_name: str):
    spec = importlib.util.spec_from_file_location(module_name, MODULE_PATH)
    module = importlib.util.module_from_spec(spec)
    sys.modules[module_name] = module
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


@pytest.fixture
def api_module(tmp_path: Path, monkeypatch: pytest.MonkeyPatch):
    auth_db = tmp_path / "auth.db"
    mindmap_db = tmp_path / "mindmaps.db"
    monkeypatch.setenv("AUTH_DB_PATH", str(auth_db))
    monkeypatch.setenv("MINDMAP_DB_PATH", str(mindmap_db))
    monkeypatch.delenv("SESSION_COOKIE_SECURE", raising=False)
    module_name = f"api_proxy_main_auth_test_{auth_db.stem}_{len(sys.modules)}"
    module = load_api_module(module_name)
    yield module
    sys.modules.pop(module_name, None)


@pytest.fixture
def client(api_module):
    return TestClient(api_module.app)


def register_payload(email: str = "tester@example.com") -> dict:
    return {
        "username": "tester",
        "email": email,
        "password": "Password123",
        "skillLevel": "beginner",
        "targetLanguage": "python",
    }


def register_user(client: TestClient, email: str = "tester@example.com", *, headers: dict | None = None) -> dict:
    response = client.post("/api/auth/register", json=register_payload(email), headers=headers or {})
    assert response.status_code == 200, response.text
    return response.json()["user"]


def test_register_session_profile_and_logout_flow(client: TestClient):
    response = client.post("/api/auth/register", json=register_payload())
    assert response.status_code == 200, response.text

    user = response.json()["user"]
    assert user["email"] == "tester@example.com"
    set_cookie = response.headers.get("set-cookie", "")
    assert "lingma_session=" in set_cookie
    assert "HttpOnly" in set_cookie
    assert "SameSite=lax" in set_cookie
    assert "Secure" not in set_cookie

    session_response = client.get("/api/auth/session")
    assert session_response.status_code == 200, session_response.text
    assert session_response.json()["user"]["id"] == user["id"]

    profile_response = client.post(
        "/api/auth/profile",
        json={"skillLevel": "advanced", "targetLanguage": "java"},
    )
    assert profile_response.status_code == 200, profile_response.text
    assert profile_response.json()["user"]["skillLevel"] == "advanced"
    assert profile_response.json()["user"]["targetLanguage"] == "java"

    logout_response = client.post("/api/auth/logout")
    assert logout_response.status_code == 200, logout_response.text
    assert logout_response.json() == {"ok": True}

    expired_session = client.get("/api/auth/session")
    assert expired_session.status_code == 401
    assert expired_session.json()["detail"] == "not authenticated"


def test_register_uses_secure_cookie_when_forwarded_proto_is_https(client: TestClient):
    response = client.post(
        "/api/auth/register",
        json=register_payload("secure@example.com"),
        headers={"x-forwarded-proto": "https"},
    )
    assert response.status_code == 200, response.text
    assert "Secure" in response.headers.get("set-cookie", "")


def test_duplicate_registration_uses_generic_error(client: TestClient):
    register_user(client, email="dup@example.com")

    duplicate = client.post("/api/auth/register", json=register_payload("dup@example.com"))
    assert duplicate.status_code == 409
    assert duplicate.json()["detail"] == "unable to create account"


def test_unknown_login_still_uses_password_verifier(api_module, client: TestClient, monkeypatch: pytest.MonkeyPatch):
    verifier_calls: list[tuple[str, str, str]] = []

    def fake_verify(password: str, password_hash: str, password_salt: str) -> bool:
        verifier_calls.append((password, password_hash, password_salt))
        return False

    monkeypatch.setattr(api_module, "verify_password", fake_verify)

    response = client.post(
        "/api/auth/login",
        json={"email": "missing@example.com", "password": "Password123"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "invalid email or password"
    assert len(verifier_calls) == 1


def test_wrong_password_uses_generic_error(client: TestClient):
    register_user(client, email="wrong-pass@example.com")

    response = client.post(
        "/api/auth/login",
        json={"email": "wrong-pass@example.com", "password": "WrongPassword123"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "invalid email or password"


def test_expired_session_is_rejected(api_module, client: TestClient):
    register_user(client, email="expired@example.com")
    expired_at = (datetime.now(timezone.utc) - timedelta(hours=1)).isoformat()

    conn = sqlite3.connect(api_module.AUTH_DB_PATH)
    try:
        conn.execute("UPDATE user_sessions SET expires_at = ?", (expired_at,))
        conn.commit()
    finally:
        conn.close()

    response = client.get("/api/auth/session")
    assert response.status_code == 401
    assert response.json()["detail"] == "not authenticated"
