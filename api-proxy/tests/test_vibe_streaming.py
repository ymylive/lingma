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
    module_name = f"api_proxy_main_vibe_stream_{auth_db.stem}_{len(sys.modules)}"
    module = load_api_module(module_name)
    yield {"module": module, "auth_db": auth_db}
    sys.modules.pop(module_name, None)


@pytest.fixture
def client(api_env):
    return TestClient(api_env["module"].app)


def register_user(client: TestClient, email: str = "vibe@example.com") -> dict:
    response = client.post(
        "/api/auth/register",
        json={
            "username": "vibe-tester",
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
    midpoint = max(1, len(raw_json) // 2)
    first = raw_json[:midpoint]
    second = raw_json[midpoint:]
    return [
        f'data: {json.dumps({"type": "response.output_text.delta", "delta": first}, ensure_ascii=False)}'.encode("utf-8"),
        b"",
        f'data: {json.dumps({"type": "response.output_text.delta", "delta": second}, ensure_ascii=False)}'.encode("utf-8"),
        b"",
        (
            f'data: {json.dumps({"type": "response.completed", "response": {"id": "resp_vibe", "model": "gpt-5.4", "output_text": raw_json}}, ensure_ascii=False)}'
        ).encode("utf-8"),
        b"",
        b"data: [DONE]",
        b"",
    ]


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


def test_vibe_generate_stream_emits_preview_and_final_and_persists(client: TestClient, api_env, monkeypatch: pytest.MonkeyPatch):
    api_module = api_env["module"]
    user = register_user(client, email="vibe-generate@example.com")
    upstream_payloads: list[dict] = []
    generated = {
        "title": "Harden a dashboard activity feed refresh",
        "scenario": "The product team shipped a new activity feed card, but the auto-refresh flow now causes layout jumps on tablet screens. Write a prompt that asks the AI to fix the issue without changing unrelated dashboard widgets.",
        "requirements": ["State the goal and target module clearly", "Ask for a minimal reversible patch", "Require explicit validation steps"],
        "constraints": ["Do not redesign unrelated dashboard widgets", "Keep the existing API contract unchanged"],
        "success_criteria": ["The output includes a concrete implementation plan", "The prompt asks for regression verification on tablet and desktop"],
        "expected_focus": ["goal_clarity", "verification_design"],
    }

    @contextmanager
    def fake_open_upstream(payload: dict):
        upstream_payloads.append(payload)
        yield FakeSseResponse(stream_lines_for_json_payload(generated))

    monkeypatch.setattr(api_module, "open_upstream_responses", fake_open_upstream)

    response = client.post("/api/vibe-coding/generate/stream", json={"track": "frontend", "locale": "en-US"})
    assert response.status_code == 200, response.text
    assert response.headers["content-type"].startswith("text/event-stream")

    events = parse_sse_events(response.text)
    assert any(event.get("type") == "preview" and "Harden a dashboard activity feed refresh" in event.get("text", "") for event in events)
    final_event = next(event for event in events if event.get("type") == "final")
    assert final_event["payload"]["title"] == "Harden a dashboard activity feed refresh"
    assert final_event["payload"]["userId"] == user["id"]
    assert len(upstream_payloads) == 1
    system_text = upstream_payloads[0]["input"][0]["content"][0]["text"]
    assert "natural American English" in system_text
    assert "Do not generate abstract prompt-engineering drills" in system_text

    conn = sqlite3.connect(api_env["auth_db"])
    conn.row_factory = sqlite3.Row
    try:
        row = conn.execute("SELECT title FROM vibe_challenges WHERE user_id = ?", (user["id"],)).fetchone()
    finally:
        conn.close()
    assert row is not None
    assert row["title"] == "Harden a dashboard activity feed refresh"


def test_vibe_evaluate_stream_emits_preview_and_final_and_persists(client: TestClient, api_env, monkeypatch: pytest.MonkeyPatch):
    api_module = api_env["module"]
    user = register_user(client, email="vibe-eval@example.com")
    upstream_payloads: list[dict] = []
    challenge = {
        "id": "challenge_stream_test",
        "userId": user["id"],
        "track": "frontend",
        "difficulty": "beginner",
        "title": "前端提效改造训练",
        "scenario": "给现有练习页写 prompt。",
        "requirements": ["明确目标", "说明边界"],
        "constraints": ["限制改动范围"],
        "successCriteria": ["包含验证命令"],
        "expectedFocus": ["goal_clarity", "verification_design"],
        "createdAt": "2026-03-20T10:00:00+00:00",
    }
    evaluation = {
        "total_score": 86,
        "dimension_scores": {
            "goal_clarity": 28,
            "boundary_constraints": 20,
            "verification_design": 22,
            "output_format": 16,
        },
        "strengths": ["目标清晰", "验证要求明确"],
        "weaknesses": ["边界条件还可以更具体"],
        "rewrite_example": "请在不改动数据结构的前提下，为练习页增加实时流式预览，并提供类型检查与构建验证命令。",
        "next_difficulty_recommendation": "intermediate",
    }

    conn = api_module.get_db_connection(api_module.AUTH_DB_PATH)
    try:
        api_module.insert_vibe_challenge(conn, challenge)
        conn.commit()
    finally:
        conn.close()

    @contextmanager
    def fake_open_upstream(payload: dict):
        upstream_payloads.append(payload)
        yield FakeSseResponse(stream_lines_for_json_payload(evaluation))

    monkeypatch.setattr(api_module, "open_upstream_responses", fake_open_upstream)

    response = client.post(
        "/api/vibe-coding/evaluate/stream",
        json={
            "challenge_id": challenge["id"],
            "user_prompt": "请补全这个页面的真实流式方案，并明确范围、验证方式和输出格式要求。",
            "locale": "zh-CN",
        },
    )
    assert response.status_code == 200, response.text
    events = parse_sse_events(response.text)
    assert any(event.get("type") == "preview" and "rewrite_example" in event.get("text", "") for event in events)
    final_event = next(event for event in events if event.get("type") == "final")
    assert final_event["payload"]["total_score"] == 86
    assert final_event["payload"]["challengeId"] == challenge["id"]
    assert len(upstream_payloads) == 1
    system_text = upstream_payloads[0]["input"][0]["content"][0]["text"]
    assert "简体中文" in system_text
    assert "rewrite_example 必须是一段可以直接提交给 AI 的完整改写 prompt" in system_text

    conn = sqlite3.connect(api_env["auth_db"])
    conn.row_factory = sqlite3.Row
    try:
        row = conn.execute("SELECT total_score FROM vibe_prompt_attempts WHERE challenge_id = ?", (challenge["id"],)).fetchone()
    finally:
        conn.close()
    assert row is not None
    assert row["total_score"] == 86
