from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

import pytest


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


def test_deploy_runtime_defaults_match_api_proxy():
    module_name = f"deploy_runtime_config_upstream_defaults_{len(sys.modules)}"
    runtime_config = load_module(module_name, RUNTIME_CONFIG_PATH)
    try:
        assert runtime_config.DEFAULT_AI_API_URL == "https://api.cornna.xyz/responses"
        assert runtime_config.DEFAULT_AI_MODEL == "gpt-5.4"
    finally:
        sys.modules.pop(module_name, None)
