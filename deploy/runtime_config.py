from __future__ import annotations

import os
from typing import Dict

import paramiko


def read_required_env(name: str) -> str:
    value = os.getenv(name, "").strip()
    if value:
        return value
    raise RuntimeError(f"Missing required environment variable: {name}")


def get_vps_config() -> Dict[str, str]:
    return {
        "host": read_required_env("LINGMA_VPS_HOST"),
        "user": os.getenv("LINGMA_VPS_USER", "root").strip() or "root",
        "password": read_required_env("LINGMA_VPS_PASSWORD"),
    }


def get_ai_proxy_config() -> Dict[str, str]:
    return {
        "AI_API_KEY": read_required_env("LINGMA_AI_API_KEY"),
        "AI_API_URL": os.getenv("LINGMA_AI_API_URL", "https://gmn.chuangzuoli.com/v1/responses").strip()
        or "https://gmn.chuangzuoli.com/v1/responses",
        "AI_MODEL": os.getenv("LINGMA_AI_MODEL", "gpt-5.4").strip()
        or "gpt-5.4",
        "JUDGE_BASE_URL": os.getenv("LINGMA_JUDGE_BASE_URL", "http://127.0.0.1:3002").strip()
        or "http://127.0.0.1:3002",
        "JUDGE_INTERNAL_TOKEN": read_required_env("LINGMA_JUDGE_INTERNAL_TOKEN"),
    }


def create_ssh_client() -> paramiko.SSHClient:
    config = get_vps_config()
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(config["host"], username=config["user"], password=config["password"])
    return client
