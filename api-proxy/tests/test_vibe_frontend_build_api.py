from __future__ import annotations

import importlib.util
import json
import sqlite3
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
    monkeypatch.setenv("AI_API_KEY", "test-key")
    monkeypatch.setenv("SESSION_COOKIE_SECURE", "false")
    module_name = f"api_proxy_main_frontend_build_{auth_db.stem}_{len(sys.modules)}"
    module = load_api_module(module_name)
    yield module
    sys.modules.pop(module_name, None)


@pytest.fixture
def client(api_module):
    return TestClient(api_module.app)


def register_user(client: TestClient, email: str = "frontend-build@example.com") -> dict:
    response = client.post(
        "/api/auth/register",
        json={
            "username": "frontend-builder",
            "email": email,
            "password": "Password123",
            "skillLevel": "beginner",
            "targetLanguage": "python",
        },
    )
    assert response.status_code == 200, response.text
    return response.json()["user"]


def install_ai_stub(monkeypatch: pytest.MonkeyPatch, api_module, payloads: list[dict]):
    remaining = list(payloads)

    def _fake(_: dict) -> dict:
        if not remaining:
            raise AssertionError("unexpected extra upstream AI call")
        return remaining.pop(0)

    monkeypatch.setattr(api_module, "read_upstream_responses_json", _fake)


def build_artifact_payload(title: str, summary: str, html: str, css: str = "", js: str = "") -> dict:
    return {
        "output_text": json.dumps(
            {
                "title": title,
                "summary": summary,
                "html": html,
                "css": css,
                "js": js,
                "nextSuggestions": ["Polish spacing", "Add hover feedback"],
            },
            ensure_ascii=False,
        )
    }


def test_frontend_build_routes_require_authentication(client: TestClient):
    requests = [
        ("post", "/api/vibe-coding/frontend/session", {"prompt": "Build a pricing hero"}),
        ("post", "/api/vibe-coding/frontend/session/missing/turns", {"prompt": "Add CTA emphasis"}),
        ("get", "/api/vibe-coding/frontend/sessions", None),
        ("get", "/api/vibe-coding/frontend/session/missing", None),
        ("get", "/api/vibe-coding/frontend/session/missing/download", None),
    ]

    for method, path, body in requests:
        response = getattr(client, method)(path, json=body) if body is not None else getattr(client, method)(path)
        assert response.status_code == 401


def test_frontend_build_create_session_persists_and_downloads_html(client: TestClient, api_module, monkeypatch: pytest.MonkeyPatch):
    user = register_user(client)
    install_ai_stub(
        monkeypatch,
        api_module,
        [
            build_artifact_payload(
                "Pricing Hero",
                "Created a pricing hero with CTA focus.",
                "<main><section><h1>Upgrade faster</h1><button>Start free</button></section></main>",
                "body { margin: 0; font-family: sans-serif; }",
                "console.log('ready')",
            )
        ],
    )

    created = client.post(
        "/api/vibe-coding/frontend/session",
        json={"prompt": "Build a SaaS pricing hero with a bold CTA.", "locale": "en-US"},
    )
    assert created.status_code == 200, created.text
    payload = created.json()
    assert payload["userId"] == user["id"]
    assert payload["latestArtifact"]["title"] == "Pricing Hero"
    assert "<!DOCTYPE html>" in payload["latestArtifact"]["mergedHtml"]

    listed = client.get("/api/vibe-coding/frontend/sessions")
    assert listed.status_code == 200, listed.text
    items = listed.json()["items"]
    assert len(items) == 1
    assert items[0]["id"] == payload["id"]

    detail = client.get(f"/api/vibe-coding/frontend/session/{payload['id']}")
    assert detail.status_code == 200, detail.text
    detail_payload = detail.json()
    assert detail_payload["id"] == payload["id"]
    assert len(detail_payload["turns"]) == 2
    assert detail_payload["latestArtifact"]["id"] == payload["latestArtifact"]["id"]

    download = client.get(f"/api/vibe-coding/frontend/session/{payload['id']}/download")
    assert download.status_code == 200, download.text
    assert "text/html" in download.headers.get("content-type", "")
    assert "<button>Start free</button>" in download.text

    conn = sqlite3.connect(api_module.AUTH_DB_PATH)
    try:
        session_row = conn.execute("SELECT user_id FROM vibe_frontend_build_sessions").fetchone()
        artifact_row = conn.execute("SELECT title FROM vibe_frontend_build_artifacts").fetchone()
    finally:
        conn.close()

    assert session_row[0] == user["id"]
    assert artifact_row[0] == "Pricing Hero"


def test_frontend_build_follow_up_turn_keeps_session_context(client: TestClient, api_module, monkeypatch: pytest.MonkeyPatch):
    register_user(client, email="followup@example.com")
    install_ai_stub(
        monkeypatch,
        api_module,
        [
            build_artifact_payload(
                "Initial Hero",
                "Created the first version.",
                "<main><h1>Initial hero</h1></main>",
            ),
            build_artifact_payload(
                "Initial Hero",
                "Refined the hero with social proof and a darker CTA.",
                "<main><h1>Initial hero</h1><p>Trusted by 200 teams</p><button>Try it now</button></main>",
            ),
        ],
    )

    created = client.post(
        "/api/vibe-coding/frontend/session",
        json={"prompt": "Build a startup hero page.", "locale": "en-US"},
    )
    assert created.status_code == 200, created.text
    session_id = created.json()["id"]

    updated = client.post(
        f"/api/vibe-coding/frontend/session/{session_id}/turns",
        json={"prompt": "Add social proof and make the CTA darker.", "locale": "en-US"},
    )
    assert updated.status_code == 200, updated.text
    payload = updated.json()
    assert payload["id"] == session_id
    assert "Trusted by 200 teams" in payload["latestArtifact"]["mergedHtml"]
    assert len(payload["turns"]) == 4
