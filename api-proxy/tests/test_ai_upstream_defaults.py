from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

import pytest
from fastapi import HTTPException


REPO_ROOT = Path(__file__).resolve().parents[2]
API_MODULE_PATH = REPO_ROOT / "api-proxy" / "main.py"
RUNTIME_CONFIG_PATH = REPO_ROOT / "deploy" / "runtime_config.py"


def load_module(module_name: str, module_path: Path):
    spec = importlib.util.spec_from_file_location(module_name, module_path)
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
    monkeypatch.delenv("AI_BASE_URL", raising=False)
    monkeypatch.delenv("AI_API_URL", raising=False)
    monkeypatch.delenv("AI_MODEL", raising=False)
    module_name = f"api_proxy_main_upstream_defaults_{auth_db.stem}_{len(sys.modules)}"
    module = load_module(module_name, API_MODULE_PATH)
    yield module
    sys.modules.pop(module_name, None)


def test_api_proxy_defaults_to_cornna_responses_endpoint(api_module):
    assert api_module.AI_BASE_URL == "https://api.cornna.xyz/responses"
    assert api_module.resolve_responses_upstream_url() == "https://api.cornna.xyz/responses"
    assert api_module.responses_token_key(api_module.resolve_responses_upstream_url()) == "max_output_tokens"
    assert api_module.should_force_responses_stream(
        api_module.resolve_responses_upstream_url(),
        api_module.AI_PROTOCOL_RESPONSES,
    ) is False


def test_api_proxy_uses_compat_mode_for_v1_endpoint(monkeypatch: pytest.MonkeyPatch, tmp_path: Path):
    auth_db = tmp_path / "auth.db"
    mindmap_db = tmp_path / "mindmaps.db"
    monkeypatch.setenv("AUTH_DB_PATH", str(auth_db))
    monkeypatch.setenv("MINDMAP_DB_PATH", str(mindmap_db))
    monkeypatch.setenv("AI_API_URL", "https://api.cornna.xyz/v1")
    module_name = f"api_proxy_main_compat_endpoint_{auth_db.stem}_{len(sys.modules)}"
    api_module = load_module(module_name, API_MODULE_PATH)
    try:
        assert api_module.detect_protocol_from_url(api_module.AI_BASE_URL) == "compat"
        assert api_module.resolve_responses_upstream_url() == "https://api.cornna.xyz/v1/chat/completions"
    finally:
        sys.modules.pop(module_name, None)


def test_read_upstream_json_forces_streaming(monkeypatch: pytest.MonkeyPatch, tmp_path: Path):
    auth_db = tmp_path / "auth.db"
    mindmap_db = tmp_path / "mindmaps.db"
    monkeypatch.setenv("AUTH_DB_PATH", str(auth_db))
    monkeypatch.setenv("MINDMAP_DB_PATH", str(mindmap_db))
    module_name = f"api_proxy_main_force_stream_{auth_db.stem}_{len(sys.modules)}"
    api_module = load_module(module_name, API_MODULE_PATH)

    captured: dict[str, object] = {}

    class _DummySession:
        def close(self):
            return None

    class _DummyResponse:
        headers = {"Content-Type": "text/event-stream"}
        content = (
            b'data: {"type":"response.completed","response":{"id":"resp_test","model":"gpt-5.4","output_text":"ok","output":[{"content":[{"text":"ok"}]}]}}\n\n'
        )

        def close(self):
            return None

    def fake_perform(payload: dict):
        captured.update(payload)
        return _DummySession(), _DummyResponse(), api_module.AI_PROTOCOL_RESPONSES

    monkeypatch.setattr(api_module, "perform_upstream_responses_request", fake_perform)
    try:
        data = api_module.read_upstream_responses_json({"model": "gpt-5.4", "stream": False})
        assert captured["stream"] is True
        assert data["output_text"] == "ok"
    finally:
        sys.modules.pop(module_name, None)


def test_deploy_runtime_defaults_match_api_proxy():
    module_name = f"deploy_runtime_config_upstream_defaults_{len(sys.modules)}"
    runtime_config = load_module(module_name, RUNTIME_CONFIG_PATH)
    try:
        assert runtime_config.DEFAULT_AI_API_URL == "https://api.cornna.xyz/responses"
        assert runtime_config.DEFAULT_AI_MODEL == "gpt-5.4"
    finally:
        sys.modules.pop(module_name, None)


def test_deploy_runtime_syncs_reasoning_env(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setenv("LINGMA_JUDGE_INTERNAL_TOKEN", "judge-token")
    monkeypatch.setenv("LINGMA_AI_API_KEY", "test-key")
    monkeypatch.setenv("LINGMA_AI_API_URL", "https://api.cornna.xyz/v1")
    monkeypatch.setenv("LINGMA_AI_MODEL", "gpt-5.4")
    monkeypatch.setenv("LINGMA_AI_REASONING_EFFORT", "high")
    monkeypatch.setenv("LINGMA_ENABLE_THINKING", "true")

    module_name = f"deploy_runtime_config_reasoning_sync_{len(sys.modules)}"
    runtime_config = load_module(module_name, RUNTIME_CONFIG_PATH)
    try:
        updates = runtime_config.get_docker_compose_env_updates()
        assert updates["AI_API_KEY"] == "test-key"
        assert updates["AI_API_URL"] == "https://api.cornna.xyz/v1"
        assert updates["AI_MODEL"] == "gpt-5.4"
        assert updates["AI_REASONING_EFFORT"] == "high"
        assert updates["ENABLE_THINKING"] == "true"
    finally:
        sys.modules.pop(module_name, None)
