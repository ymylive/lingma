#!/usr/bin/env python3
"""Deploy tumafang to VPS via Docker Compose (paramiko-based, Windows-compatible)."""
import os
import sys
import tarfile
import tempfile
import time

try:
    import paramiko
except ImportError:
    print("ERROR: pip install paramiko")
    sys.exit(1)

VPS_HOST = os.getenv("LINGMA_VPS_HOST", "8.134.33.19")
VPS_USER = os.getenv("LINGMA_VPS_USER", "root")
VPS_PASSWORD = os.getenv("LINGMA_VPS_PASSWORD", "")
REMOTE_DIR = "/var/www/lingma"
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DEFAULT_REMOTE_ENV = {
    "FRONTEND_BIND_HOST": "0.0.0.0",
    "FRONTEND_BIND_PORT": "18081",
}

INCLUDE_PATHS = [
    "deploy/",
    "api-proxy/main.py",
    "api-proxy/requirements.txt",
    "judge-server/server.js",
    "judge-server/package.json",
    "judge-server/package-lock.json",
    "src/",
    "public/",
    "package.json",
    "package-lock.json",
    "tsconfig.json",
    "tsconfig.app.json",
    "tsconfig.node.json",
    "vite.config.ts",
    "tailwind.config.js",
    "postcss.config.js",
    "index.html",
]
EXCLUDE_PATTERNS = ["__pycache__", "*.pyc", ".codex-deploy", "node_modules", "dist"]


def should_exclude(name):
    for pattern in EXCLUDE_PATTERNS:
        if pattern.startswith("*") and name.endswith(pattern[1:]):
            return True
        if pattern in name:
            return True
    return False


def create_tarball():
    tar_path = os.path.join(tempfile.gettempdir(), f"tumafang-{time.strftime('%Y%m%d-%H%M%S')}.tar.gz")
    with tarfile.open(tar_path, "w:gz") as tar:
        for include_path in INCLUDE_PATHS:
            full_path = os.path.join(PROJECT_ROOT, include_path.replace("/", os.sep))
            if os.path.isfile(full_path):
                if not should_exclude(include_path):
                    tar.add(full_path, arcname=include_path)
            elif os.path.isdir(full_path):
                for root, dirs, files in os.walk(full_path):
                    dirs[:] = [item for item in dirs if not should_exclude(item)]
                    for filename in files:
                        file_path = os.path.join(root, filename)
                        archive_path = os.path.relpath(file_path, PROJECT_ROOT).replace(os.sep, "/")
                        if not should_exclude(archive_path):
                            tar.add(file_path, arcname=archive_path)
    print(f"  Tarball: {os.path.getsize(tar_path) / 1024 / 1024:.1f} MB")
    return tar_path


def ssh_exec(ssh, cmd, check=True):
    print(f"  $ {cmd[:120]}{'...' if len(cmd) > 120 else ''}")
    _, stdout, stderr = ssh.exec_command(cmd, timeout=600)
    out = stdout.read().decode().strip()
    err = stderr.read().decode().strip()
    rc = stdout.channel.recv_exit_status()
    if check and rc != 0:
        print(f"  [STDERR] {err}")
        raise RuntimeError(f"Command failed (rc={rc}): {cmd}")
    return out


def build_remote_env_updates():
    updates = dict(DEFAULT_REMOTE_ENV)

    ai_key = os.getenv("LINGMA_AI_API_KEY", "").strip()
    ai_url = os.getenv("LINGMA_AI_API_URL", "https://gmn.chuangzuoli.com/v1/responses").strip()
    ai_model = os.getenv("LINGMA_AI_MODEL", "gpt-5.4").strip()

    if ai_key:
        updates["AI_API_KEY"] = ai_key
        updates["AI_API_URL"] = ai_url or "https://gmn.chuangzuoli.com/v1/responses"
        updates["AI_MODEL"] = ai_model or "gpt-5.4"

    return updates


def sync_remote_env(ssh, env_updates):
    env_path = f"{REMOTE_DIR}/deploy/.env"
    command = (
        "python3 - <<'PY'\n"
        "from pathlib import Path\n"
        f"env_path = Path({env_path!r})\n"
        f"updates = {repr(env_updates)}\n"
        "existing = {}\n"
        "if env_path.exists():\n"
        "    for raw in env_path.read_text(encoding='utf-8').splitlines():\n"
        "        line = raw.strip()\n"
        "        if not line or line.startswith('#') or '=' not in line:\n"
        "            continue\n"
        "        key, value = line.split('=', 1)\n"
        "        existing[key.strip()] = value.strip()\n"
        "existing.update({k: v for k, v in updates.items() if str(v).strip()})\n"
        "env_path.parent.mkdir(parents=True, exist_ok=True)\n"
        "env_path.write_text(''.join(f'{k}={v}\\n' for k, v in existing.items()), encoding='utf-8')\n"
        "print('UPDATED')\n"
        "PY"
    )
    ssh_exec(ssh, command)


def main():
    if not VPS_PASSWORD:
        print("ERROR: Set LINGMA_VPS_PASSWORD")
        sys.exit(1)

    print(f"{'=' * 60}\nDeploying to {VPS_HOST}\n{'=' * 60}")

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(VPS_HOST, username=VPS_USER, password=VPS_PASSWORD, timeout=30)
    sftp = ssh.open_sftp()

    print("\n[1/6] Packaging...")
    tar_path = create_tarball()

    print("\n[2/6] Uploading...")
    ssh_exec(ssh, f"mkdir -p {REMOTE_DIR}")
    remote_tar = f"{REMOTE_DIR}/deploy-bundle.tar.gz"
    sftp.put(tar_path, remote_tar, callback=lambda sent, total: None)
    os.unlink(tar_path)
    print("  Upload complete.")

    print("\n[3/6] Extracting...")
    ssh_exec(ssh, f"cd {REMOTE_DIR} && tar xzf deploy-bundle.tar.gz && rm deploy-bundle.tar.gz")

    print("\n[4/6] Stopping old services...")
    ssh_exec(ssh, "systemctl stop ai-proxy 2>/dev/null; systemctl disable ai-proxy 2>/dev/null; true", check=False)
    ssh_exec(ssh, "pm2 delete all 2>/dev/null; true", check=False)
    ssh_exec(ssh, f"cd {REMOTE_DIR}/deploy && docker-compose down 2>/dev/null; true", check=False)

    print("\n[5/6] Building Docker containers (this may take a few minutes)...")
    sync_remote_env(ssh, build_remote_env_updates())

    out = ssh_exec(ssh, f"cd {REMOTE_DIR}/deploy && docker-compose build --no-cache 2>&1", check=False)
    for line in out.split("\n")[-15:]:
        print(f"    {line}")

    out = ssh_exec(ssh, f"cd {REMOTE_DIR}/deploy && docker-compose up -d 2>&1", check=False)
    print(f"  {out}")

    print("\n[6/6] Pruning old images...")
    out = ssh_exec(ssh, "docker image prune -af 2>&1", check=False)
    print(f"  {out}")

    print(f"\n{'=' * 60}\nVerification\n{'=' * 60}")
    out = ssh_exec(ssh, f"cd {REMOTE_DIR}/deploy && docker-compose ps 2>&1", check=False)
    print(out)

    time.sleep(3)
    health = ssh_exec(ssh, "curl -sf http://127.0.0.1:18081/api/health 2>&1 || echo HEALTH_CHECK_PENDING", check=False)
    print(f"\nHealth: {health}")

    sftp.close()
    ssh.close()
    print(f"\nDone. Site: http://{VPS_HOST}:18081")


if __name__ == "__main__":
    main()
