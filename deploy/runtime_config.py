from __future__ import annotations

import os
from typing import Dict

import paramiko

DEFAULT_FRONTEND_BIND_HOST = "0.0.0.0"
DEFAULT_FRONTEND_BIND_PORT = "18081"
DEFAULT_AI_API_URL = "https://api.cornna.xyz/v1"
DEFAULT_AI_MODEL = "gpt-5.4"
DEFAULT_AI_REASONING_EFFORT = ""
DEFAULT_ENABLE_THINKING = "false"
DEFAULT_JUDGE_BASE_URL = "http://127.0.0.1:3002"


def read_required_env(name: str) -> str:
    value = os.getenv(name, "").strip()
    if value:
        return value
    raise RuntimeError(f"Missing required environment variable: {name}")


def read_optional_env(name: str) -> str:
    return os.getenv(name, "").strip()


def get_vps_config() -> Dict[str, str]:
    return {
        "host": read_required_env("LINGMA_VPS_HOST"),
        "user": os.getenv("LINGMA_VPS_USER", "root").strip() or "root",
        "password": read_required_env("LINGMA_VPS_PASSWORD"),
    }


def get_ai_proxy_config() -> Dict[str, str]:
    config = {
        "AI_API_KEY": read_required_env("LINGMA_AI_API_KEY"),
        "AI_API_URL": os.getenv("LINGMA_AI_API_URL", DEFAULT_AI_API_URL).strip() or DEFAULT_AI_API_URL,
        "AI_MODEL": os.getenv("LINGMA_AI_MODEL", DEFAULT_AI_MODEL).strip() or DEFAULT_AI_MODEL,
        "JUDGE_BASE_URL": os.getenv("LINGMA_JUDGE_BASE_URL", DEFAULT_JUDGE_BASE_URL).strip() or DEFAULT_JUDGE_BASE_URL,
        "JUDGE_INTERNAL_TOKEN": read_required_env("LINGMA_JUDGE_INTERNAL_TOKEN"),
    }
    ai_reasoning_effort = read_optional_env("LINGMA_AI_REASONING_EFFORT")
    if ai_reasoning_effort:
        config["AI_REASONING_EFFORT"] = ai_reasoning_effort
    enable_thinking = read_optional_env("LINGMA_ENABLE_THINKING")
    if enable_thinking:
        config["ENABLE_THINKING"] = enable_thinking
    return config


def get_docker_compose_env_updates() -> Dict[str, str]:
    updates = {
        "FRONTEND_BIND_HOST": read_optional_env("LINGMA_FRONTEND_BIND_HOST") or DEFAULT_FRONTEND_BIND_HOST,
        "FRONTEND_BIND_PORT": read_optional_env("LINGMA_FRONTEND_BIND_PORT") or DEFAULT_FRONTEND_BIND_PORT,
    }

    judge_internal_token = read_optional_env("LINGMA_JUDGE_INTERNAL_TOKEN")
    if judge_internal_token:
        updates["JUDGE_INTERNAL_TOKEN"] = judge_internal_token

    ai_key = read_optional_env("LINGMA_AI_API_KEY")
    if ai_key:
        updates["AI_API_KEY"] = ai_key
        updates["AI_API_URL"] = read_optional_env("LINGMA_AI_API_URL") or DEFAULT_AI_API_URL
        updates["AI_MODEL"] = read_optional_env("LINGMA_AI_MODEL") or DEFAULT_AI_MODEL
        ai_reasoning_effort = read_optional_env("LINGMA_AI_REASONING_EFFORT")
        if ai_reasoning_effort:
            updates["AI_REASONING_EFFORT"] = ai_reasoning_effort
        enable_thinking = read_optional_env("LINGMA_ENABLE_THINKING")
        if enable_thinking:
            updates["ENABLE_THINKING"] = enable_thinking

    return updates


def configure_host_key_verification(client: paramiko.SSHClient) -> str:
    known_hosts_path = read_optional_env("LINGMA_SSH_KNOWN_HOSTS")
    client.load_system_host_keys()
    if known_hosts_path:
        if not os.path.exists(known_hosts_path):
            raise RuntimeError(f"LINGMA_SSH_KNOWN_HOSTS does not exist: {known_hosts_path}")
        client.load_host_keys(known_hosts_path)
    client.set_missing_host_key_policy(paramiko.RejectPolicy())
    return known_hosts_path


def missing_host_key_message(host: str, known_hosts_path: str) -> str:
    source = known_hosts_path or "~/.ssh/known_hosts"
    return (
        f"SSH host key for {host} is not trusted. Add the server key to {source} "
        "or set LINGMA_SSH_KNOWN_HOSTS to a known_hosts file that contains the trusted key."
    )


def create_ssh_client() -> paramiko.SSHClient:
    config = get_vps_config()
    client = paramiko.SSHClient()
    known_hosts_path = configure_host_key_verification(client)
    try:
        client.connect(config["host"], username=config["user"], password=config["password"])
    except paramiko.BadHostKeyException as exc:
        raise RuntimeError(f"SSH host key verification failed for {config['host']}: {exc}") from exc
    except paramiko.SSHException as exc:
        if "not found in known_hosts" in str(exc).lower():
            raise RuntimeError(missing_host_key_message(config["host"], known_hosts_path)) from exc
        raise
    return client
