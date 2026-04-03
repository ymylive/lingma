from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[2]
DEPLOY_SCRIPT = PROJECT_ROOT / "deploy" / "docker-deploy.py"
API_PROXY_DOCKERFILE = PROJECT_ROOT / "deploy" / "docker" / "api-proxy.Dockerfile"


def test_deploy_script_does_not_ignore_compose_build_failures() -> None:
    source = DEPLOY_SCRIPT.read_text(encoding="utf-8")

    assert 'docker-compose build --no-cache 2>&1", check=False' not in source
    assert 'docker-compose up -d 2>&1", check=False' not in source


def test_api_proxy_dockerfile_sets_explicit_pip_index() -> None:
    source = API_PROXY_DOCKERFILE.read_text(encoding="utf-8")

    assert "PIP_INDEX_URL=" in source or "--index-url" in source or " -i https://" in source
