from __future__ import annotations

import importlib.util
import sys
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
    monkeypatch.delenv("ENABLE_REMOTE_MINDMAP_SYNC", raising=False)
    monkeypatch.delenv("SESSION_COOKIE_SECURE", raising=False)
    module_name = f"api_proxy_main_doc_test_{auth_db.stem}_{len(sys.modules)}"
    module = load_api_module(module_name)
    yield module
    sys.modules.pop(module_name, None)


@pytest.fixture
def client(api_module):
    return TestClient(api_module.app)


def register_user(client: TestClient, email: str = "doc@example.com") -> dict:
    response = client.post(
        "/api/auth/register",
        json={
            "username": "doc-tester",
            "email": email,
            "password": "Password123",
            "skillLevel": "beginner",
            "targetLanguage": "python",
        },
    )
    assert response.status_code == 200, response.text
    return response.json()["user"]


def test_doc_route_requires_authentication(client: TestClient):
    response = client.post("/api/doc", json={"url": "https://example.com/article"})
    assert response.status_code == 401
    assert response.json()["detail"] == "authentication required"


def test_doc_rejects_blocked_local_targets_without_dns_lookup(client: TestClient, monkeypatch: pytest.MonkeyPatch):
    register_user(client)

    def fail_dns_lookup(*args, **kwargs):  # pragma: no cover - defensive if the route regresses
        raise AssertionError("DNS lookup should not be attempted for blocked targets")

    monkeypatch.setattr("socket.getaddrinfo", fail_dns_lookup)

    response = client.post("/api/doc", json={"url": "http://localhost/private"})
    assert response.status_code == 400, response.text
    assert response.json()["detail"] == "Local domains are not allowed"
