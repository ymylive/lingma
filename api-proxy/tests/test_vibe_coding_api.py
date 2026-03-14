from __future__ import annotations

import importlib.util
import json
import os
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
    module_name = f"api_proxy_main_test_{auth_db.stem}_{len(sys.modules)}"
    module = load_api_module(module_name)
    yield module
    sys.modules.pop(module_name, None)


@pytest.fixture
def client(api_module):
    return TestClient(api_module.app)


def register_user(client: TestClient, email: str = "tester@example.com") -> dict:
    response = client.post(
        "/api/auth/register",
        json={
            "username": "tester",
            "email": email,
            "password": "Password123",
            "skillLevel": "beginner",
            "targetLanguage": "python",
        },
    )
    assert response.status_code == 200, response.text
    return response.json()["user"]


def fake_ai_responder(payloads: list[dict]):
    remaining = list(payloads)

    def _fake(_: dict) -> dict:
        if not remaining:
            raise AssertionError("unexpected extra upstream AI call")
        return remaining.pop(0)

    return _fake


def test_init_auth_db_creates_vibe_tables(api_module):
    conn = sqlite3.connect(api_module.AUTH_DB_PATH)
    try:
        rows = conn.execute(
            "SELECT name FROM sqlite_master WHERE type = 'table' AND name LIKE 'vibe_%'"
        ).fetchall()
    finally:
        conn.close()

    table_names = {row[0] for row in rows}
    assert {"vibe_challenges", "vibe_prompt_attempts", "vibe_user_profiles"} <= table_names


@pytest.mark.parametrize(
    ("method", "path", "body"),
    [
        ("post", "/api/vibe-coding/generate", {"track": "frontend"}),
        ("post", "/api/vibe-coding/evaluate", {"challenge_id": "missing", "user_prompt": "prompt"}),
        ("get", "/api/vibe-coding/history", None),
        ("get", "/api/vibe-coding/profile", None),
    ],
)
def test_vibe_coding_routes_require_authentication(client: TestClient, method: str, path: str, body: dict | None):
    response = getattr(client, method)(path, json=body) if body is not None else getattr(client, method)(path)
    assert response.status_code == 401


def test_authenticated_generate_returns_normalized_challenge(client: TestClient, api_module, monkeypatch: pytest.MonkeyPatch):
    user = register_user(client)
    monkeypatch.setattr(
        api_module,
        "read_upstream_responses_json",
        fake_ai_responder(
            [
                {
                    "output_text": json.dumps(
                        {
                            "title": "Refine a dashboard KPI card",
                            "scenario": "The analytics page needs a safer KPI card refresh.",
                            "requirements": [
                                "Keep the diff scoped to the dashboard card module",
                                "Preserve responsive behavior",
                            ],
                            "constraints": [
                                "Do not redesign unrelated panels",
                                "Keep the API contract unchanged",
                            ],
                            "success_criteria": [
                                "The card renders in light and dark mode",
                                "The fix includes a verification step",
                            ],
                            "expected_focus": ["goal_clarity", "verification_design"],
                        }
                    )
                }
            ]
        ),
    )

    response = client.post("/api/vibe-coding/generate", json={"track": "frontend"})
    assert response.status_code == 200, response.text

    data = response.json()
    assert data["userId"] == user["id"]
    assert data["track"] == "frontend"
    assert data["difficulty"] == "beginner"
    assert data["title"] == "Refine a dashboard KPI card"
    assert len(data["requirements"]) == 2
    assert len(data["constraints"]) == 2
    assert "id" in data


def test_evaluate_persists_attempt_and_updates_profile(client: TestClient, api_module, monkeypatch: pytest.MonkeyPatch):
    register_user(client, email="history@example.com")
    monkeypatch.setattr(
        api_module,
        "read_upstream_responses_json",
        fake_ai_responder(
            [
                {
                    "output_text": json.dumps(
                        {
                            "title": "Review a flaky auth redirect fix",
                            "scenario": "A login redirect bug keeps reappearing in production.",
                            "requirements": [
                                "Ask for a minimal reproducible path",
                                "Request a regression check",
                            ],
                            "constraints": [
                                "Do not refactor unrelated auth flows",
                            ],
                            "success_criteria": [
                                "Prompt asks for evidence and verification",
                            ],
                            "expected_focus": ["verification_design", "boundary_constraints"],
                        }
                    )
                },
                {
                    "output_text": json.dumps(
                        {
                            "total_score": 88,
                            "dimension_scores": {
                                "goal_clarity": 26,
                                "boundary_constraints": 22,
                                "verification_design": 23,
                                "output_format": 17,
                            },
                            "strengths": [
                                "The prompt asks for a reproducible path.",
                                "The scope is constrained to the auth redirect flow.",
                            ],
                            "weaknesses": [
                                "The verification section could be more explicit.",
                            ],
                            "rewrite_example": "Goal: reproduce the auth redirect bug and fix it with the smallest reversible patch. Scope: only touch the redirect guard. Verification: run the auth redirect regression flow and note the expected result.",
                            "next_difficulty_recommendation": "advanced",
                        }
                    )
                },
            ]
        ),
    )

    generated = client.post("/api/vibe-coding/generate", json={"track": "debugging"})
    assert generated.status_code == 200, generated.text
    challenge = generated.json()

    evaluated = client.post(
        "/api/vibe-coding/evaluate",
        json={
            "challenge_id": challenge["id"],
            "user_prompt": "Please reproduce the auth redirect issue, keep the change scoped to the redirect guard, and verify the fix with a regression check before claiming success.",
        },
    )
    assert evaluated.status_code == 200, evaluated.text
    evaluation = evaluated.json()
    assert evaluation["total_score"] == 88
    assert evaluation["dimension_scores"]["goal_clarity"] == 26
    assert evaluation["next_difficulty_recommendation"] == "advanced"

    history = client.get("/api/vibe-coding/history")
    assert history.status_code == 200, history.text
    history_items = history.json()["items"]
    assert len(history_items) == 1
    assert history_items[0]["challenge"]["id"] == challenge["id"]
    assert history_items[0]["evaluation"]["total_score"] == 88

    profile = client.get("/api/vibe-coding/profile")
    assert profile.status_code == 200, profile.text
    profile_data = profile.json()
    assert profile_data["recommendedTrack"] == "debugging"
    assert profile_data["recommendedDifficulty"] == "advanced"
    assert profile_data["weakestDimension"] == "output_format"
    assert profile_data["recentAverageScore"] == 88
