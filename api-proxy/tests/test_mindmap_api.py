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
    monkeypatch.setenv("ENABLE_REMOTE_MINDMAP_SYNC", "true")
    monkeypatch.setenv("SESSION_COOKIE_SECURE", "false")
    module_name = f"api_proxy_main_mindmap_test_{auth_db.stem}_{len(sys.modules)}"
    module = load_api_module(module_name)
    yield module
    sys.modules.pop(module_name, None)


@pytest.fixture
def client(api_module):
    return TestClient(api_module.app)


def register_user(client: TestClient, email: str) -> dict:
    response = client.post(
        "/api/auth/register",
        json={
            "username": email.split("@", 1)[0],
            "email": email,
            "password": "Password123",
            "skillLevel": "beginner",
            "targetLanguage": "python",
        },
    )
    assert response.status_code == 200, response.text
    return response.json()["user"]


def build_maps_payload() -> dict:
    return {
        "maps": [
            {
                "id": "map-a",
                "title": "Alpha Map",
                "source": {"type": "topic", "value": "alpha", "title": "Alpha"},
                "nodes": [
                    {
                        "id": "node-a",
                        "title": "Root",
                        "children": [],
                    }
                ],
                "createdAt": "2026-03-29T00:00:00Z",
                "updatedAt": "2026-03-29T00:00:00Z",
            }
        ]
    }


def test_mindmap_routes_require_authentication(client: TestClient):
    save_response = client.post("/api/mindmaps/save", json=build_maps_payload())
    assert save_response.status_code == 401
    assert save_response.json()["detail"] == "authentication required"

    load_response = client.post("/api/mindmaps/load", json={})
    assert load_response.status_code == 401
    assert load_response.json()["detail"] == "authentication required"


def test_mindmaps_are_isolated_by_user(client: TestClient, api_module):
    client_a = client
    client_b = TestClient(api_module.app)
    try:
        register_user(client_a, "alice@example.com")
        register_user(client_b, "bob@example.com")

        saved = client_a.post("/api/mindmaps/save", json=build_maps_payload())
        assert saved.status_code == 200, saved.text
        saved_payload = saved.json()
        assert saved_payload["maps"][0]["id"] == "map-a"

        alice_load = client_a.post("/api/mindmaps/load", json={})
        assert alice_load.status_code == 200, alice_load.text
        assert alice_load.json()["maps"][0]["title"] == "Alpha Map"

        bob_load = client_b.post("/api/mindmaps/load", json={})
        assert bob_load.status_code == 200, bob_load.text
        assert bob_load.json() == {"maps": [], "updatedAt": None}
    finally:
        client_b.close()


def test_mindmaps_reject_non_list_payloads(client: TestClient):
    register_user(client, "validator@example.com")

    response = client.post("/api/mindmaps/save", json={"maps": {"id": "not-a-list"}})
    assert response.status_code == 400
    assert response.json()["detail"] == "maps must be a list"
