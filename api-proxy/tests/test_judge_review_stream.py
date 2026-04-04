from __future__ import annotations

import importlib.util
import json
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
    monkeypatch.setenv("JUDGE_INTERNAL_TOKEN", "test-judge-token")
    monkeypatch.setenv("SESSION_COOKIE_SECURE", "false")
    module_name = f"api_proxy_main_judge_review_stream_{auth_db.stem}_{len(sys.modules)}"
    module = load_api_module(module_name)
    yield module
    sys.modules.pop(module_name, None)


@pytest.fixture
def client(api_env):
    return TestClient(api_env.app)


def register_user(client: TestClient, email: str = "judge-stream@example.com") -> dict:
    response = client.post(
        "/api/auth/register",
        json={
            "username": "judge-stream",
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
    return [
        f'data: {json.dumps({"type": "response.output_text.delta", "delta": raw_json[:midpoint]}, ensure_ascii=False)}'.encode("utf-8"),
        b"",
        f'data: {json.dumps({"type": "response.output_text.delta", "delta": raw_json[midpoint:]}, ensure_ascii=False)}'.encode("utf-8"),
        b"",
        (
            f'data: {json.dumps({"type": "response.completed", "response": {"id": "resp_judge", "model": "judge-review-model", "output_text": raw_json}}, ensure_ascii=False)}'
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


def build_judge_payload() -> dict:
    return {
        "success": True,
        "results": [
            {
                "passed": False,
                "testCase": 1,
                "input": "1 2\n",
                "expectedOutput": "3\n",
                "actualOutput": "0\n",
                "error": None,
                "time": 12,
                "status": "WA",
                "description": "样例 1",
                "checkpoint": "核心检查点",
                "checkpointId": "cp-core",
                "checkpointTitle": "核心检查点",
                "checkpointGroup": "基础",
                "hidden": False,
                "weight": 1,
                "feedbackHint": "Review the failing branch",
                "kind": "basic",
                "feedbackLevel": "review",
                "feedbackTitle": "Judge feedback",
                "feedbackMessage": "Judge detail",
                "nextAction": "Patch the failing path",
            }
        ],
        "allPassed": False,
        "checkpoints": [
            {
                "id": "cp-core",
                "title": "核心检查点",
                "group": "基础",
                "passed": False,
                "passedCount": 0,
                "total": 1,
                "score": 60,
                "maxScore": 100,
                "feedbackLevel": "review",
                "feedbackMessage": "Checkpoint feedback",
            }
        ],
        "summary": {
            "total": 1,
            "passed": 0,
            "failed": 1,
            "verdict": "WA",
            "score": 60,
            "passRate": 60,
            "passedCheckpoints": 0,
            "totalCheckpoints": 1,
            "feedbackLevel": "review",
            "feedbackMessage": "Judge summary",
            "nextAction": "Fix the failing checkpoint",
            "runtime": {"avgMs": 12, "maxMs": 12},
        },
    }


def test_judge_review_stream_emits_preview_and_final(client: TestClient, api_env, monkeypatch: pytest.MonkeyPatch):
    register_user(client, email="judge-stream-generated@example.com")
    review_payload = {
        "totalScore": 72,
        "dimensionScores": {
            "correctness": 28,
            "boundaryRobustness": 14,
            "complexityAndPerformance": 15,
            "codeQualityAndReadability": 15,
        },
        "overallDiagnosis": "最后一个分支没有正确更新答案，边界条件也不够稳健。",
        "errorPoints": ["最后一个节点的处理分支有误", "空输入时缺少保护"],
        "fixSuggestions": ["修正返回前的最终更新逻辑", "补上空输入守卫"],
        "optimizationSuggestions": ["修正正确性后保持单次遍历即可"],
        "nextStep": "先修复错误分支，再重跑失败样例与一个边界样例。",
    }

    @contextmanager
    def fake_open_upstream(_: dict):
        yield FakeSseResponse(stream_lines_for_json_payload(review_payload))

    monkeypatch.setattr(api_env, "open_upstream_responses", fake_open_upstream)

    response = client.post(
        "/api/judge/review/stream",
        json={
            "code": "print('hello world')",
            "language": "python",
            "exerciseContext": {
                "exerciseId": "exercise-123",
                "title": "两数求和",
                "description": "读取两个整数并输出它们的和。",
                "difficulty": "easy",
            },
            "judgePayload": build_judge_payload(),
            "model": "judge-review-model",
        },
    )
    assert response.status_code == 200, response.text
    assert response.headers["content-type"].startswith("text/event-stream")
    assert response.headers["x-accel-buffering"] == "no"
    assert response.headers["cache-control"] == "no-cache, no-transform"

    events = parse_sse_events(response.text)
    assert any(event.get("type") == "preview" and "overallDiagnosis" in event.get("text", "") for event in events)
    final_event = next(event for event in events if event.get("type") == "final")
    assert final_event["payload"]["status"] == "generated"
    assert final_event["payload"]["totalScore"] == 72


def test_judge_review_stream_returns_unavailable_final_when_ai_is_not_configured(client: TestClient, api_env, monkeypatch: pytest.MonkeyPatch):
    register_user(client, email="judge-stream-unavailable@example.com")
    monkeypatch.setattr(api_env, "AI_API_KEY", "")

    response = client.post(
        "/api/judge/review/stream",
        json={
            "code": "print('hello world')",
            "language": "python",
            "exerciseContext": {
                "exerciseId": "exercise-123",
                "title": "两数求和",
                "description": "读取两个整数并输出它们的和。",
                "difficulty": "easy",
            },
            "judgePayload": build_judge_payload(),
            "model": "judge-review-model",
        },
    )
    assert response.status_code == 200, response.text
    events = parse_sse_events(response.text)
    final_event = next(event for event in events if event.get("type") == "final")
    assert final_event["payload"] == {
        "triggered": True,
        "status": "unavailable",
        "model": "judge-review-model",
    }
