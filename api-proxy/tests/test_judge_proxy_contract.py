from __future__ import annotations

import importlib.util
import json
import sys
from pathlib import Path

import pytest
import requests
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
def api_factory(tmp_path: Path, monkeypatch: pytest.MonkeyPatch):
    loaded_modules: list[str] = []

    def _factory(
        *,
        judge_internal_token: str | None,
        ai_api_key: str = "",
        judge_ai_review_mode: str | None = None,
    ):
        suffix = len(loaded_modules)
        auth_db = tmp_path / f"auth-{suffix}.db"
        mindmap_db = tmp_path / f"mindmaps-{suffix}.db"
        monkeypatch.setenv("AUTH_DB_PATH", str(auth_db))
        monkeypatch.setenv("MINDMAP_DB_PATH", str(mindmap_db))
        monkeypatch.setenv("SESSION_COOKIE_SECURE", "false")
        if judge_internal_token is None:
            monkeypatch.delenv("JUDGE_INTERNAL_TOKEN", raising=False)
        else:
            monkeypatch.setenv("JUDGE_INTERNAL_TOKEN", judge_internal_token)
        if ai_api_key:
            monkeypatch.setenv("AI_API_KEY", ai_api_key)
        else:
            monkeypatch.delenv("AI_API_KEY", raising=False)
        if judge_ai_review_mode is None:
            monkeypatch.delenv("JUDGE_AI_REVIEW_MODE", raising=False)
        else:
            monkeypatch.setenv("JUDGE_AI_REVIEW_MODE", judge_ai_review_mode)

        module_name = f"api_proxy_main_contract_test_{suffix}_{len(sys.modules)}"
        loaded_modules.append(module_name)
        module = load_api_module(module_name)
        return module, TestClient(module.app)

    yield _factory

    for module_name in loaded_modules:
        sys.modules.pop(module_name, None)


def register_user(client: TestClient, email: str = "judge@example.com") -> dict:
    response = client.post(
        "/api/auth/register",
        json={
            "username": "judge-tester",
            "email": email,
            "password": "Password123",
            "skillLevel": "beginner",
            "targetLanguage": "python",
        },
    )
    assert response.status_code == 200, response.text
    return response.json()["user"]


def make_json_response(payload: dict, status_code: int = 200) -> requests.Response:
    response = requests.Response()
    response.status_code = status_code
    response.headers["Content-Type"] = "application/json"
    response.encoding = "utf-8"
    response._content = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    return response


def build_result(*, passed: bool, status: str) -> dict:
    return {
        "passed": passed,
        "testCase": 1,
        "input": "1 2\n",
        "expectedOutput": "3\n",
        "actualOutput": "0\n" if not passed else "3\n",
        "error": None,
        "time": 12,
        "status": status,
        "description": "样例 1",
        "checkpoint": "核心检查点",
        "checkpointId": "cp-core",
        "checkpointTitle": "核心检查点",
        "checkpointGroup": "基础",
        "hidden": False,
        "weight": 1,
        "feedbackHint": "Review the failing branch",
        "kind": "basic",
        "feedbackLevel": "review" if not passed else "excellent",
        "feedbackTitle": "Judge feedback",
        "feedbackMessage": "Judge detail",
        "nextAction": "Patch the failing path",
    }


def build_judge_payload(*, all_passed: bool, score: int, result_status: str) -> dict:
    return {
        "success": True,
        "results": [build_result(passed=all_passed, status=result_status)],
        "allPassed": all_passed,
        "checkpoints": [
            {
                "id": "cp-core",
                "title": "核心检查点",
                "group": "基础",
                "passed": all_passed,
                "passedCount": 1 if all_passed else 0,
                "total": 1,
                "score": score,
                "maxScore": 100,
                "feedbackLevel": "excellent" if all_passed else "review",
                "feedbackMessage": "Checkpoint feedback",
            }
        ],
        "summary": {
            "total": 1,
            "passed": 1 if all_passed else 0,
            "failed": 0 if all_passed else 1,
            "verdict": "Accepted" if all_passed else result_status,
            "score": score,
            "passRate": score,
            "passedCheckpoints": 1 if all_passed else 0,
            "totalCheckpoints": 1,
            "feedbackLevel": "excellent" if all_passed else "review",
            "feedbackMessage": "Judge summary",
            "nextAction": "Fix the failing checkpoint",
            "runtime": {"avgMs": 12, "maxMs": 12},
        },
    }


def default_request_body() -> dict:
    return {
        "code": "print('hello world')",
        "language": "python",
        "testCases": [{"input": "1 2\n", "expectedOutput": "3\n", "description": "basic sum"}],
        "exerciseContext": {
            "exerciseId": "exercise-123",
            "title": "两数求和",
            "description": "读取两个整数并输出它们的和。",
            "difficulty": "easy",
        },
        "model": "judge-review-model",
    }


def test_build_internal_judge_headers_includes_explicit_internal_token(api_factory):
    api_module, _client = api_factory(judge_internal_token="secret-token")

    assert api_module.build_internal_judge_headers() == {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Judge-Token": "secret-token",
    }


def test_judge_proxy_requires_explicit_internal_token(api_factory, monkeypatch: pytest.MonkeyPatch):
    api_module, client = api_factory(judge_internal_token=None)
    register_user(client, email="missing-token@example.com")
    upstream_calls: list[dict] = []

    def fake_judge_request(method: str, path: str, body: bytes | None = None, content_type: str = "application/json"):
        upstream_calls.append({"method": method, "path": path, "content_type": content_type, "body": body})
        return make_json_response(build_judge_payload(all_passed=True, score=100, result_status="AC"))

    monkeypatch.setattr(api_module, "perform_internal_judge_request", fake_judge_request)

    response = client.post("/api/judge", json=default_request_body())
    assert response.status_code == 503
    assert response.json()["detail"] == "judge proxy is not configured"
    assert upstream_calls == []


def test_judge_unavailable_advisory_preserves_deterministic_payload(api_factory, monkeypatch: pytest.MonkeyPatch):
    api_module, client = api_factory(judge_internal_token="secret-token", ai_api_key="")
    register_user(client, email="unavailable@example.com")
    judge_payload = build_judge_payload(all_passed=False, score=40, result_status="WA")

    def fake_judge_request(method: str, path: str, body: bytes | None = None, content_type: str = "application/json"):
        return make_json_response(judge_payload)

    monkeypatch.setattr(api_module, "perform_internal_judge_request", fake_judge_request)

    response = client.post("/api/judge", json=default_request_body())
    assert response.status_code == 200, response.text

    payload = response.json()
    assert payload["results"] == judge_payload["results"]
    assert payload["summary"] == judge_payload["summary"]
    assert payload["checkpoints"] == judge_payload["checkpoints"]
    assert payload["aiReview"] == {
        "triggered": True,
        "status": "unavailable",
        "model": "judge-review-model",
    }


def test_judge_deferred_advisory_preserves_deterministic_payload(api_factory, monkeypatch: pytest.MonkeyPatch):
    api_module, client = api_factory(
        judge_internal_token="secret-token",
        ai_api_key="test-key",
        judge_ai_review_mode="deferred",
    )
    register_user(client, email="deferred@example.com")
    judge_payload = build_judge_payload(all_passed=False, score=55, result_status="WA")

    def fake_judge_request(method: str, path: str, body: bytes | None = None, content_type: str = "application/json"):
        return make_json_response(judge_payload)

    def fail_ai_call(_: dict):
        raise AssertionError("AI review should not run in deferred mode")

    monkeypatch.setattr(api_module, "perform_internal_judge_request", fake_judge_request)
    monkeypatch.setattr(api_module, "read_upstream_responses_json", fail_ai_call)

    response = client.post("/api/judge", json=default_request_body())
    assert response.status_code == 200, response.text

    payload = response.json()
    assert payload["results"] == judge_payload["results"]
    assert payload["summary"] == judge_payload["summary"]
    assert payload["checkpoints"] == judge_payload["checkpoints"]
    assert payload["aiReview"] == {
        "triggered": False,
        "status": "deferred",
        "model": "judge-review-model",
    }


def test_judge_stream_mode_returns_deferred_placeholder_without_sync_ai_call(api_factory, monkeypatch: pytest.MonkeyPatch):
    api_module, client = api_factory(
        judge_internal_token="secret-token",
        ai_api_key="test-key",
    )
    register_user(client, email="stream-mode@example.com")
    judge_payload = build_judge_payload(all_passed=False, score=55, result_status="WA")

    def fake_judge_request(method: str, path: str, body: bytes | None = None, content_type: str = "application/json"):
        return make_json_response(judge_payload)

    def fail_ai_call(_: dict):
        raise AssertionError("sync AI review should not run in stream mode")

    monkeypatch.setattr(api_module, "perform_internal_judge_request", fake_judge_request)
    monkeypatch.setattr(api_module, "read_upstream_responses_json", fail_ai_call)

    request_body = default_request_body()
    request_body["aiReviewMode"] = "stream"

    response = client.post("/api/judge", json=request_body)
    assert response.status_code == 200, response.text

    payload = response.json()
    assert payload["results"] == judge_payload["results"]
    assert payload["summary"] == judge_payload["summary"]
    assert payload["checkpoints"] == judge_payload["checkpoints"]
    assert payload["aiReview"] == {
        "triggered": True,
        "status": "deferred",
        "model": "judge-review-model",
    }
