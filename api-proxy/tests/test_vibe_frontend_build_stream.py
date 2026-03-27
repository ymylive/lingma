from __future__ import annotations

import importlib.util
import json
import sqlite3
import sys
from contextlib import contextmanager
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
def api_env(tmp_path: Path, monkeypatch: pytest.MonkeyPatch):
    auth_db = tmp_path / "auth.db"
    mindmap_db = tmp_path / "mindmaps.db"
    monkeypatch.setenv("AUTH_DB_PATH", str(auth_db))
    monkeypatch.setenv("MINDMAP_DB_PATH", str(mindmap_db))
    monkeypatch.setenv("AI_API_KEY", "test-key")
    monkeypatch.setenv("SESSION_COOKIE_SECURE", "false")
    module_name = f"api_proxy_main_frontend_stream_{auth_db.stem}_{len(sys.modules)}"
    module = load_api_module(module_name)
    yield {"module": module, "auth_db": auth_db}
    sys.modules.pop(module_name, None)


@pytest.fixture
def client(api_env):
    return TestClient(api_env["module"].app)


def register_user(client: TestClient, email: str = "frontend-stream@example.com") -> dict:
    response = client.post(
        "/api/auth/register",
        json={
            "username": "frontend-streamer",
            "email": email,
            "password": "Password123",
            "skillLevel": "beginner",
            "targetLanguage": "python",
        },
    )
    assert response.status_code == 200, response.text
    return response.json()["user"]


class FakeSseResponse:
    def __init__(self, lines: list[bytes]):
        self._lines = lines
        self.headers = {"Content-Type": "text/event-stream; charset=utf-8"}

    def iter_lines(self, decode_unicode: bool = False):
        assert decode_unicode is False
        for line in self._lines:
            yield line

    def close(self):
        return None


def stream_lines_for_json_payload(payload: dict) -> list[bytes]:
    raw_json = json.dumps(payload, ensure_ascii=False)
    first_break = max(1, len(raw_json) // 3)
    second_break = max(first_break + 1, (len(raw_json) * 2) // 3)
    chunks = [raw_json[:first_break], raw_json[first_break:second_break], raw_json[second_break:]]
    lines: list[bytes] = []
    for chunk in chunks:
        lines.append(
            f'data: {json.dumps({"type": "response.output_text.delta", "delta": chunk}, ensure_ascii=False)}'.encode("utf-8")
        )
        lines.append(b"")
    lines.append(
        (
            f'data: {json.dumps({"type": "response.completed", "response": {"id": "resp_frontend_stream", "model": "gpt-5.4", "output_text": raw_json}}, ensure_ascii=False)}'
        ).encode("utf-8")
    )
    lines.append(b"")
    lines.append(b"data: [DONE]")
    lines.append(b"")
    return lines


def parse_sse_events(raw_text: str) -> list[dict]:
    payloads: list[dict] = []
    chunks = [chunk.strip() for chunk in raw_text.split("\n\n") if chunk.strip()]
    for chunk in chunks:
        data_lines = []
        for line in chunk.splitlines():
            if line.startswith("data:"):
                data_lines.append(line[5:].strip())
        if not data_lines:
            continue
        data_text = "\n".join(data_lines)
        if data_text == "[DONE]":
            payloads.append({"type": "done"})
        else:
            payloads.append(json.loads(data_text))
    return payloads


def build_frontend_payload(title: str, summary: str, html: str, css: str = "", js: str = "") -> dict:
    return {
        "title": title,
        "summary": summary,
        "html": html,
        "css": css,
        "js": js,
        "nextSuggestions": ["Tighten spacing", "Refine the CTA hover state"],
    }


def test_frontend_build_create_stream_emits_preview_and_final_and_persists(client: TestClient, api_env, monkeypatch: pytest.MonkeyPatch):
    api_module = api_env["module"]
    user = register_user(client)
    generated = build_frontend_payload(
        "Live Pricing Hero",
        "Built the first landing hero with CTA emphasis.",
        "<main><section><h1>Launch faster</h1><button>Start free</button></section></main>",
        "body { margin: 0; font-family: sans-serif; }",
        "console.log('live build ready')",
    )

    @contextmanager
    def fake_open_upstream(payload: dict):
        yield FakeSseResponse(stream_lines_for_json_payload(generated))

    monkeypatch.setattr(api_module, "open_upstream_responses", fake_open_upstream)

    response = client.post(
        "/api/vibe-coding/frontend/session/stream",
        json={"prompt": "Build a live SaaS pricing hero with a clear CTA.", "locale": "en-US"},
    )
    assert response.status_code == 200, response.text
    assert response.headers["content-type"].startswith("text/event-stream")

    events = parse_sse_events(response.text)
    assert any(event.get("type") == "preview" and "Live Pricing Hero" in event.get("text", "") for event in events)
    final_event = next(event for event in events if event.get("type") == "final")
    payload = final_event["payload"]
    assert payload["userId"] == user["id"]
    assert payload["latestArtifact"]["title"] == "Live Pricing Hero"
    assert "Start free" in payload["latestArtifact"]["mergedHtml"]

    conn = sqlite3.connect(api_env["auth_db"])
    conn.row_factory = sqlite3.Row
    try:
        session_row = conn.execute("SELECT user_id FROM vibe_frontend_build_sessions").fetchone()
        artifact_row = conn.execute("SELECT title FROM vibe_frontend_build_artifacts").fetchone()
    finally:
        conn.close()

    assert session_row is not None
    assert session_row["user_id"] == user["id"]
    assert artifact_row is not None
    assert artifact_row["title"] == "Live Pricing Hero"


def test_frontend_build_follow_up_stream_emits_preview_and_final_and_updates_session(client: TestClient, api_env, monkeypatch: pytest.MonkeyPatch):
    api_module = api_env["module"]
    register_user(client, email="frontend-stream-followup@example.com")
    initial = build_frontend_payload(
        "Dashboard Hero",
        "Built the initial dashboard hero.",
        "<main><h1>Initial dashboard</h1></main>",
    )
    refined = build_frontend_payload(
        "Dashboard Hero",
        "Added testimonial text and stronger CTA treatment.",
        "<main><h1>Initial dashboard</h1><p>Trusted by 200 teams</p><button>Book demo</button></main>",
    )

    @contextmanager
    def fake_open_upstream(payload: dict):
        current = refined if "social proof" in json.dumps(payload, ensure_ascii=False).lower() else initial
        yield FakeSseResponse(stream_lines_for_json_payload(current))

    monkeypatch.setattr(api_module, "open_upstream_responses", fake_open_upstream)

    created = client.post(
        "/api/vibe-coding/frontend/session/stream",
        json={"prompt": "Build a startup dashboard hero.", "locale": "en-US"},
    )
    assert created.status_code == 200, created.text
    created_events = parse_sse_events(created.text)
    session_id = next(event for event in created_events if event.get("type") == "final")["payload"]["id"]

    updated = client.post(
        f"/api/vibe-coding/frontend/session/{session_id}/turns/stream",
        json={"prompt": "Add social proof and a stronger CTA treatment.", "locale": "en-US"},
    )
    assert updated.status_code == 200, updated.text
    events = parse_sse_events(updated.text)
    assert any(event.get("type") == "preview" and "Trusted by 200 teams" in event.get("text", "") for event in events)
    final_event = next(event for event in events if event.get("type") == "final")
    payload = final_event["payload"]
    assert payload["id"] == session_id
    assert "Trusted by 200 teams" in payload["latestArtifact"]["mergedHtml"]
    assert len(payload["turns"]) == 4
