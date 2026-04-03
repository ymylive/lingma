from __future__ import annotations

import importlib.util
import json
import sys
from pathlib import Path

import pytest
import requests
from fastapi import HTTPException
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
    monkeypatch.setenv("JUDGE_INTERNAL_TOKEN", "test-judge-token")
    monkeypatch.setenv("SESSION_COOKIE_SECURE", "false")
    module_name = f"api_proxy_main_judge_test_{auth_db.stem}_{len(sys.modules)}"
    module = load_api_module(module_name)
    yield module
    sys.modules.pop(module_name, None)


@pytest.fixture
def client(api_module):
    return TestClient(api_module.app)


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


def build_summary(score: int, *, verdict: str = "Wrong Answer") -> dict:
    return {
        "total": 1,
        "passed": 0 if score < 100 else 1,
        "failed": 0 if score == 100 else 1,
        "verdict": verdict,
        "score": score,
        "passRate": score,
        "passedCheckpoints": 0 if score < 100 else 1,
        "totalCheckpoints": 1,
        "feedbackLevel": "review" if score < 100 else "excellent",
        "feedbackMessage": "Judge summary",
        "nextAction": "Fix the failing checkpoint",
        "runtime": {"avgMs": 12, "maxMs": 12},
    }


def build_checkpoint(*, passed: bool, score: int, title: str = "核心检查点") -> dict:
    return {
        "id": "cp-core",
        "title": title,
        "group": "基础",
        "passed": passed,
        "passedCount": 0 if not passed else 1,
        "total": 1,
        "score": score,
        "maxScore": 100,
        "feedbackLevel": "review" if not passed else "excellent",
        "feedbackMessage": "Checkpoint feedback",
    }


def build_result(
    *,
    passed: bool,
    status: str,
    input_text: str,
    expected_output: str,
    actual_output: str,
    error: str | None = None,
    description: str = "样例 1",
    checkpoint_title: str = "核心检查点",
    checkpoint_group: str = "基础",
) -> dict:
    return {
        "passed": passed,
        "testCase": 1,
        "input": input_text,
        "expectedOutput": expected_output,
        "actualOutput": actual_output,
        "error": error,
        "time": 12,
        "status": status,
        "description": description,
        "checkpoint": checkpoint_title,
        "checkpointId": "cp-core",
        "checkpointTitle": checkpoint_title,
        "checkpointGroup": checkpoint_group,
        "hidden": False,
        "weight": 1,
        "feedbackHint": "Review the failing branch",
        "kind": "basic",
        "feedbackLevel": "review" if not passed else "excellent",
        "feedbackTitle": "Judge feedback",
        "feedbackMessage": "Judge detail",
        "nextAction": "Patch the failing path",
    }


def build_judge_payload(
    *,
    all_passed: bool,
    score: int,
    results: list[dict],
    success: bool = True,
    error: str | None = None,
) -> dict:
    verdict = "Accepted" if all_passed and score == 100 else results[0]["status"]
    return {
        "success": success,
        "results": results,
        "allPassed": all_passed,
        "checkpoints": [build_checkpoint(passed=all_passed, score=score)],
        "summary": build_summary(score, verdict=verdict),
        **({"error": error} if error is not None else {}),
    }


def build_generated_ai_output() -> dict:
    return {
        "output_text": json.dumps(
            {
                "totalScore": 72,
                "dimensionScores": {
                    "correctness": 28,
                    "boundaryRobustness": 14,
                    "complexityAndPerformance": 15,
                    "codeQualityAndReadability": 15,
                },
                "overallDiagnosis": "The solution misses one failing branch and loses points on edge handling.",
                "errorPoints": [
                    "The failing branch does not update the final answer correctly.",
                    "Edge-case handling is incomplete for empty input.",
                ],
                "fixSuggestions": [
                    "Repair the branch that handles the last element before returning.",
                    "Add a guard for empty input and verify the expected neutral result.",
                ],
                "optimizationSuggestions": [
                    "Keep the single-pass structure and avoid extra scans once correctness is fixed.",
                ],
                "nextStep": "Fix the wrong-answer branch, then rerun the exposed failing case and one boundary case.",
            },
            ensure_ascii=False,
        )
    }


def install_judge_stub(monkeypatch: pytest.MonkeyPatch, api_module, payload: dict):
    calls: list[dict] = []

    def _fake(method: str, path: str, body: bytes | None = None, content_type: str = "application/json") -> requests.Response:
        request_json = json.loads(body.decode("utf-8")) if body else None
        calls.append(
            {
                "method": method,
                "path": path,
                "content_type": content_type,
                "json": request_json,
            }
        )
        return make_json_response(payload)

    monkeypatch.setattr(api_module, "perform_internal_judge_request", _fake)
    return calls


def install_ai_stub(monkeypatch: pytest.MonkeyPatch, api_module, payload_or_exc):
    calls: list[dict] = []

    def _fake(payload: dict) -> dict:
        calls.append(payload)
        if isinstance(payload_or_exc, BaseException):
            raise payload_or_exc
        return payload_or_exc

    monkeypatch.setattr(api_module, "read_upstream_responses_json", _fake)
    return calls


def extract_prompt_text(ai_payload: dict) -> str:
    pieces: list[str] = []
    for item in ai_payload.get("input", []):
        if not isinstance(item, dict):
            continue
        for content in item.get("content", []):
            if isinstance(content, dict) and isinstance(content.get("text"), str):
                pieces.append(content["text"])
    return "\n".join(pieces)


def default_request_body() -> dict:
    return {
        "code": "print('hello world')",
        "language": "python",
        "testCases": [
            {
                "input": "1 2\n",
                "expectedOutput": "3\n",
                "description": "basic sum",
                "checkpoint": "核心检查点",
            }
        ],
        "exerciseContext": {
            "exerciseId": "exercise-123",
            "title": "两数求和",
            "description": "读取两个整数并输出它们的和。",
            "difficulty": "easy",
            "category": "数组",
            "explanation": "重点关注输入解析和边界情况。",
        },
        "model": "judge-review-model",
    }


def test_judge_perfect_submission_skips_ai_review(client: TestClient, api_module, monkeypatch: pytest.MonkeyPatch):
    register_user(client, email="perfect@example.com")
    judge_calls = install_judge_stub(
        monkeypatch,
        api_module,
        build_judge_payload(
            all_passed=True,
            score=100,
            results=[
                build_result(
                    passed=True,
                    status="AC",
                    input_text="1 2\n",
                    expected_output="3\n",
                    actual_output="3\n",
                )
            ],
        ),
    )
    ai_calls = install_ai_stub(
        monkeypatch,
        api_module,
        AssertionError("AI review should not be called for perfect submissions"),
    )

    response = client.post("/api/judge", json=default_request_body())
    assert response.status_code == 200, response.text

    payload = response.json()
    assert payload["allPassed"] is True
    assert payload["summary"]["score"] == 100
    assert payload["aiReview"] == {"triggered": False, "status": "skipped"}
    for field in (
        "totalScore",
        "dimensionScores",
        "overallDiagnosis",
        "errorPoints",
        "fixSuggestions",
        "optimizationSuggestions",
        "nextStep",
    ):
        assert field not in payload["aiReview"]
    assert len(ai_calls) == 0
    assert len(judge_calls) == 1


def test_judge_generated_ai_review_returns_canonical_payload(client: TestClient, api_module, monkeypatch: pytest.MonkeyPatch):
    register_user(client, email="generated@example.com")
    judge_calls = install_judge_stub(
        monkeypatch,
        api_module,
        build_judge_payload(
            all_passed=False,
            score=72,
            results=[
                build_result(
                    passed=False,
                    status="WA",
                    input_text="1 2\n",
                    expected_output="3\n",
                    actual_output="4\n",
                    description="和计算错误",
                    checkpoint_title="求和主流程",
                )
            ],
        ),
    )
    ai_calls = install_ai_stub(monkeypatch, api_module, build_generated_ai_output())

    response = client.post("/api/judge", json=default_request_body())
    assert response.status_code == 200, response.text

    payload = response.json()
    review = payload["aiReview"]
    assert review["triggered"] is True
    assert review["status"] == "generated"
    assert review["model"] == "judge-review-model"
    assert review["totalScore"] == 72
    assert review["totalScore"] == sum(review["dimensionScores"].values())
    assert set(review["dimensionScores"]) == {
        "correctness",
        "boundaryRobustness",
        "complexityAndPerformance",
        "codeQualityAndReadability",
    }
    assert isinstance(review["overallDiagnosis"], str) and review["overallDiagnosis"]
    assert review["errorPoints"]
    assert review["fixSuggestions"]
    assert "optimizationSuggestions" in review
    assert isinstance(review["nextStep"], str) and review["nextStep"]

    assert len(judge_calls) == 1
    forwarded = judge_calls[0]["json"]
    assert set(forwarded) == {"code", "language", "testCases"}
    assert forwarded["code"] == default_request_body()["code"]
    assert forwarded["language"] == "python"
    assert forwarded["testCases"] == default_request_body()["testCases"]

    assert len(ai_calls) == 1
    assert ai_calls[0]["model"] == "judge-review-model"


def test_judge_failed_submission_triggers_ai_review(client: TestClient, api_module, monkeypatch: pytest.MonkeyPatch):
    register_user(client, email="failed@example.com")
    install_judge_stub(
        monkeypatch,
        api_module,
        build_judge_payload(
            all_passed=False,
            score=60,
            results=[
                build_result(
                    passed=False,
                    status="WA",
                    input_text="2 2\n",
                    expected_output="4\n",
                    actual_output="5\n",
                )
            ],
        ),
    )
    ai_calls = install_ai_stub(monkeypatch, api_module, build_generated_ai_output())

    response = client.post("/api/judge", json=default_request_body())
    assert response.status_code == 200, response.text
    assert response.json()["aiReview"]["status"] == "generated"
    assert len(ai_calls) == 1


def test_judge_passed_but_subperfect_score_triggers_ai_review(client: TestClient, api_module, monkeypatch: pytest.MonkeyPatch):
    register_user(client, email="subperfect@example.com")
    install_judge_stub(
        monkeypatch,
        api_module,
        build_judge_payload(
            all_passed=True,
            score=80,
            results=[
                build_result(
                    passed=True,
                    status="AC",
                    input_text="5\n",
                    expected_output="5\n",
                    actual_output="5\n",
                )
            ],
        ),
    )
    ai_calls = install_ai_stub(monkeypatch, api_module, build_generated_ai_output())

    response = client.post("/api/judge", json=default_request_body())
    assert response.status_code == 200, response.text
    assert response.json()["aiReview"]["status"] == "generated"
    assert len(ai_calls) == 1


def test_judge_missing_exercise_context_still_runs_review(client: TestClient, api_module, monkeypatch: pytest.MonkeyPatch):
    register_user(client, email="no-context@example.com")
    judge_calls = install_judge_stub(
        monkeypatch,
        api_module,
        build_judge_payload(
            all_passed=False,
            score=65,
            results=[
                build_result(
                    passed=False,
                    status="WA",
                    input_text="7\n",
                    expected_output="14\n",
                    actual_output="13\n",
                )
            ],
        ),
    )
    ai_calls = install_ai_stub(monkeypatch, api_module, build_generated_ai_output())

    request_body = default_request_body()
    request_body.pop("exerciseContext")

    response = client.post("/api/judge", json=request_body)
    assert response.status_code == 200, response.text
    assert response.json()["aiReview"]["status"] == "generated"
    assert len(judge_calls) == 1
    assert set(judge_calls[0]["json"]) == {"code", "language", "testCases"}

    prompt_text = extract_prompt_text(ai_calls[0])
    assert '"exercise"' not in prompt_text


def test_judge_wrong_answer_review_includes_failed_case_evidence(client: TestClient, api_module, monkeypatch: pytest.MonkeyPatch):
    register_user(client, email="wa@example.com")
    install_judge_stub(
        monkeypatch,
        api_module,
        build_judge_payload(
            all_passed=False,
            score=50,
            results=[
                build_result(
                    passed=False,
                    status="WA",
                    input_text="4\n1 2 3 4\n",
                    expected_output="10\n",
                    actual_output="9\n",
                    description="末尾元素漏算",
                    checkpoint_title="求和主流程",
                    checkpoint_group="正确性",
                )
            ],
        ),
    )
    ai_calls = install_ai_stub(monkeypatch, api_module, build_generated_ai_output())

    response = client.post("/api/judge", json=default_request_body())
    assert response.status_code == 200, response.text

    prompt_text = extract_prompt_text(ai_calls[0])
    assert "4\\n1 2 3 4\\n" in prompt_text
    assert "10\\n" in prompt_text
    assert "9\\n" in prompt_text
    assert "求和主流程" in prompt_text
    assert "正确性" in prompt_text


def test_judge_compile_error_review_includes_compiler_output(client: TestClient, api_module, monkeypatch: pytest.MonkeyPatch):
    register_user(client, email="compile@example.com")
    compiler_output = "main.c:3:12: error: expected ';' before 'return'"
    install_judge_stub(
        monkeypatch,
        api_module,
        build_judge_payload(
            all_passed=False,
            score=0,
            success=False,
            error=compiler_output,
            results=[
                build_result(
                    passed=False,
                    status="CE",
                    input_text="",
                    expected_output="",
                    actual_output="",
                    error=f"编译错误 (Compilation Error):\n{compiler_output}",
                    description="编译检查",
                    checkpoint_title="编译检查",
                    checkpoint_group="编译",
                )
            ],
        ),
    )
    ai_calls = install_ai_stub(monkeypatch, api_module, build_generated_ai_output())

    response = client.post("/api/judge", json=default_request_body())
    assert response.status_code == 200, response.text

    prompt_text = extract_prompt_text(ai_calls[0])
    assert compiler_output in prompt_text
    assert "编译检查" in prompt_text


def test_judge_runtime_error_review_includes_runtime_error_text(client: TestClient, api_module, monkeypatch: pytest.MonkeyPatch):
    register_user(client, email="runtime@example.com")
    runtime_error = "Traceback (most recent call last): IndexError: list index out of range"
    install_judge_stub(
        monkeypatch,
        api_module,
        build_judge_payload(
            all_passed=False,
            score=30,
            results=[
                build_result(
                    passed=False,
                    status="RE",
                    input_text="0\n",
                    expected_output="0\n",
                    actual_output="",
                    error=runtime_error,
                    description="空输入边界",
                    checkpoint_title="边界分支",
                    checkpoint_group="边界",
                )
            ],
        ),
    )
    ai_calls = install_ai_stub(monkeypatch, api_module, build_generated_ai_output())

    response = client.post("/api/judge", json=default_request_body())
    assert response.status_code == 200, response.text

    prompt_text = extract_prompt_text(ai_calls[0])
    assert runtime_error in prompt_text
    assert "边界分支" in prompt_text
    assert "0\\n" in prompt_text


def test_judge_mismatched_total_score_is_recomputed_from_dimensions(client: TestClient, api_module, monkeypatch: pytest.MonkeyPatch):
    register_user(client, email="invalid-ai@example.com")
    judge_payload = build_judge_payload(
        all_passed=False,
        score=40,
        results=[
            build_result(
                passed=False,
                status="WA",
                input_text="3\n",
                expected_output="6\n",
                actual_output="5\n",
            )
        ],
    )
    install_judge_stub(monkeypatch, api_module, judge_payload)
    install_ai_stub(
        monkeypatch,
        api_module,
        {
            "output_text": json.dumps(
                {
                    "totalScore": 99,
                    "dimensionScores": {
                        "correctness": 30,
                        "boundaryRobustness": 20,
                        "complexityAndPerformance": 20,
                        "codeQualityAndReadability": 20,
                    },
                    "overallDiagnosis": "Invalid because totalScore does not match the dimension sum.",
                    "errorPoints": ["Mismatch."],
                    "fixSuggestions": ["Fix it."],
                    "optimizationSuggestions": [],
                    "nextStep": "Retry.",
                },
                ensure_ascii=False,
            )
        },
    )

    response = client.post("/api/judge", json=default_request_body())
    assert response.status_code == 200, response.text

    payload = response.json()
    assert payload["results"] == judge_payload["results"]
    assert payload["summary"] == judge_payload["summary"]
    assert payload["aiReview"]["triggered"] is True
    assert payload["aiReview"]["status"] == "generated"
    assert payload["aiReview"]["model"] == "judge-review-model"
    assert payload["aiReview"]["totalScore"] == 90


def test_judge_ai_timeout_degrades_to_unavailable_review(client: TestClient, api_module, monkeypatch: pytest.MonkeyPatch):
    register_user(client, email="timeout@example.com")
    judge_payload = build_judge_payload(
        all_passed=False,
        score=20,
        results=[
            build_result(
                passed=False,
                status="RE",
                input_text="1\n",
                expected_output="1\n",
                actual_output="",
                error="Timed out while reading input",
            )
        ],
    )
    install_judge_stub(monkeypatch, api_module, judge_payload)
    install_ai_stub(monkeypatch, api_module, HTTPException(status_code=504, detail="upstream timeout"))

    response = client.post("/api/judge", json=default_request_body())
    assert response.status_code == 200, response.text

    payload = response.json()
    assert payload["results"] == judge_payload["results"]
    assert payload["summary"] == judge_payload["summary"]
    assert payload["aiReview"] == {
        "triggered": True,
        "status": "unavailable",
        "model": "judge-review-model",
    }


def test_judge_ai_upstream_failure_degrades_to_unavailable_review(client: TestClient, api_module, monkeypatch: pytest.MonkeyPatch):
    register_user(client, email="upstream@example.com")
    judge_payload = build_judge_payload(
        all_passed=False,
        score=55,
        results=[
            build_result(
                passed=False,
                status="WA",
                input_text="2 3\n",
                expected_output="5\n",
                actual_output="6\n",
            )
        ],
    )
    install_judge_stub(monkeypatch, api_module, judge_payload)
    install_ai_stub(monkeypatch, api_module, requests.RequestException("AI upstream failed"))

    response = client.post("/api/judge", json=default_request_body())
    assert response.status_code == 200, response.text
    assert response.json()["aiReview"] == {
        "triggered": True,
        "status": "unavailable",
        "model": "judge-review-model",
    }


def test_decode_response_text_prefers_utf8_bytes(api_module):
    response = requests.Response()
    response.status_code = 200
    response._content = "中文输出正常".encode("utf-8")
    response.encoding = "latin-1"

    assert api_module.decode_response_text(response) == "中文输出正常"


def test_iter_sse_events_prefers_utf8_bytes(api_module):
    payload = 'data: {"type":"response.output_text.delta","delta":"中文"}\n\n'.encode("utf-8")

    class FakeStream:
        def iter_lines(self, decode_unicode: bool = False):
            if decode_unicode:
                yield payload.decode("latin-1").rstrip("\n")
                yield ""
                return
            yield payload.rstrip(b"\n")
            yield b""

    events = list(api_module.iter_sse_events(FakeStream()))

    assert events == ['data: {"type":"response.output_text.delta","delta":"中文"}']


def test_normalize_judge_ai_review_payload_recomputes_total_score_from_dimensions(api_module):
    payload = {
        "totalScore": 1,
        "dimensionScores": {
            "correctness": 28,
            "boundaryRobustness": 14,
            "complexityAndPerformance": 15,
            "codeQualityAndReadability": 15,
        },
        "overallDiagnosis": "The solution still misses one failing branch.",
        "errorPoints": ["The final branch does not update the answer correctly."],
        "fixSuggestions": ["Repair the final branch before returning."],
        "optimizationSuggestions": [],
        "nextStep": "Rerun the failing sample after the branch fix.",
    }

    normalized = api_module.normalize_judge_ai_review_payload(payload, "judge-review-model")

    assert normalized["totalScore"] == 72


def test_normalize_judge_ai_review_payload_accepts_snake_case_keys(api_module):
    payload = {
        "total_score": 72,
        "dimension_scores": {
            "correctness": 28,
            "boundary_robustness": 14,
            "complexity_and_performance": 15,
            "code_quality_and_readability": 15,
        },
        "overall_diagnosis": "The solution still misses one failing branch.",
        "error_points": ["The final branch does not update the answer correctly."],
        "fix_suggestions": ["Repair the final branch before returning."],
        "optimization_suggestions": [],
        "next_step": "Rerun the failing sample after the branch fix.",
    }

    normalized = api_module.normalize_judge_ai_review_payload(payload, "judge-review-model")

    assert normalized["totalScore"] == 72
    assert normalized["dimensionScores"]["boundaryRobustness"] == 14
    assert normalized["overallDiagnosis"] == "The solution still misses one failing branch."
    assert normalized["errorPoints"] == ["The final branch does not update the answer correctly."]
