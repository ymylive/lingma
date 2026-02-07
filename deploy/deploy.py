import os
import sys
import time
from pathlib import Path

import paramiko

HOST = "8.134.33.19"
USER = "root"
PASSWORD = "Qq159741"

DOMAIN = "lingma.cornna.xyz"

REMOTE_DIR = "/opt/tumafang"
COMPOSE_FILE = f"{REMOTE_DIR}/deploy/docker-compose.yml"
ENV_FILE = f"{REMOTE_DIR}/deploy/.env"
DEPLOY_UPDATE_NGINX = os.getenv("DEPLOY_UPDATE_NGINX", "false").strip().lower() in {"1", "true", "yes", "on"}
DEPLOY_SERVICES = [s for s in os.getenv("DEPLOY_SERVICES", "frontend api-proxy").split() if s]

AI_API_KEY = os.getenv("AI_API_KEY", "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")
AI_BASE_URL = os.getenv("AI_BASE_URL", "https://openrouter.ai/api/v1")
AI_MODEL = os.getenv("AI_MODEL", "openrouter/auto")
AI_SITE_URL = os.getenv("AI_SITE_URL", f"https://{DOMAIN}")
AI_SITE_NAME = os.getenv("AI_SITE_NAME", "LingMa")
ENABLE_THINKING = os.getenv("ENABLE_THINKING", "false")
ALLOWED_ORIGINS = ",".join(
    [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://lingma.cornna.xyz",
        "http://lingma.cornna.xyz",
        "http://8.134.33.19",
        "https://8.134.33.19",
        "http://8.134.33.19:8080",
        "https://8.134.33.19:8080",
    ]
)

FILES = [
    ".dockerignore",
    "package.json",
    "package-lock.json",
    "vite.config.ts",
    "tailwind.config.js",
    "postcss.config.js",
    "index.html",
    "tsconfig.json",
    "tsconfig.app.json",
    "tsconfig.node.json",
    "api-proxy/main.py",
    "api-proxy/requirements.txt",
    "judge-server/package.json",
    "judge-server/server.js",
    "deploy/docker-compose.yml",
    "deploy/nginx.conf",
    "deploy/docker/frontend.Dockerfile",
    "deploy/docker/api-proxy.Dockerfile",
    "deploy/docker/judge-server.Dockerfile",
]

DIRS = [
    "src",
    "public",
]


def ssh_connect(retries=5):
    last_error = None

    for attempt in range(1, retries + 1):
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        try:
            ssh.connect(
                HOST,
                username=USER,
                password=PASSWORD,
                timeout=15,
                banner_timeout=45,
                auth_timeout=30,
                look_for_keys=False,
                allow_agent=False,
            )
            return ssh
        except Exception as exc:
            last_error = exc
            try:
                ssh.close()
            except Exception:
                pass
            if attempt < retries:
                wait_seconds = min(10, attempt * 2)
                print(f"SSH connect failed ({attempt}/{retries}): {exc}. Retrying in {wait_seconds}s...")
                time.sleep(wait_seconds)

    if last_error:
        raise last_error
    raise RuntimeError('SSH connect failed without error detail')


def exec_cmd(ssh, cmd, show=True):
    if show:
        print(f"$ {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read()
    err = stderr.read()
    status = stdout.channel.recv_exit_status()
    if show and out:
        sys.stdout.buffer.write(out)
        sys.stdout.flush()
    if show and err:
        sys.stdout.buffer.write(err)
        sys.stdout.flush()
    return out, err, status


def ensure_remote_dir(sftp, remote_dir):
    parts = remote_dir.strip("/").split("/")
    current = ""
    for part in parts:
        current = f"{current}/{part}"
        try:
            sftp.mkdir(current)
        except IOError:
            pass


def upload_file(sftp, local, remote):
    print(f"Upload {local} -> {remote}")
    ensure_remote_dir(sftp, os.path.dirname(remote))
    sftp.put(local, remote)


def upload_dir(sftp, local_dir, remote_dir):
    for root, _, files in os.walk(local_dir):
        rel_root = os.path.relpath(root, local_dir)
        for file_name in files:
            local_path = os.path.join(root, file_name)
            rel_path = os.path.normpath(os.path.join(rel_root, file_name))
            remote_path = f"{remote_dir}/{rel_path}".replace("\\", "/")
            upload_file(sftp, local_path, remote_path)


def ensure_docker(ssh):
    exec_cmd(ssh, "command -v docker >/dev/null 2>&1 || curl -fsSL https://get.docker.com | sh")
    exec_cmd(ssh, "docker --version")


def get_compose_cmd(ssh):
    _, _, status = exec_cmd(ssh, "docker compose version", show=False)
    if status == 0:
        return "docker compose"

    _, _, status = exec_cmd(ssh, "docker-compose version", show=False)
    if status == 0:
        return "docker-compose"

    exec_cmd(ssh, "curl -fsSL https://get.docker.com | sh")
    _, _, status = exec_cmd(ssh, "docker compose version", show=False)
    if status == 0:
        return "docker compose"

    exec_cmd(
        ssh,
        "curl -L https://github.com/docker/compose/releases/latest/download/"
        "docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose",
    )
    exec_cmd(ssh, "chmod +x /usr/local/bin/docker-compose")
    _, _, status = exec_cmd(ssh, "docker-compose version", show=False)
    if status == 0:
        return "docker-compose"

    raise RuntimeError("Docker Compose is not available on the server.")


def write_env_file(ssh):
    content = "\n".join(
        [
            f"AI_API_KEY={AI_API_KEY}",
            f"AI_BASE_URL={AI_BASE_URL}",
            f"AI_MODEL={AI_MODEL}",
            f"AI_SITE_URL={AI_SITE_URL}",
            f"AI_SITE_NAME={AI_SITE_NAME}",
            f"ENABLE_THINKING={ENABLE_THINKING}",
            f"ALLOWED_ORIGINS={ALLOWED_ORIGINS}",
            "MINDMAP_DB_PATH=/app/data/mindmaps.db",
            "MINDMAP_LEGACY_FILE=/app/data/mindmaps.json",
            "",
        ]
    )
    cmd = f"cat > {ENV_FILE} <<'EOF'\n{content}\nEOF"
    exec_cmd(ssh, cmd)


def pick_nginx_conf_path(ssh):
    candidates = [
        f"/www/server/panel/vhost/nginx/{DOMAIN}.conf",
        f"/etc/nginx/conf.d/{DOMAIN}.conf",
    ]
    for path in candidates:
        _, _, status = exec_cmd(ssh, f"test -f {path}", show=False)
        if status == 0:
            return path
    return candidates[-1]


def configure_domain_nginx(ssh):
    conf_path = pick_nginx_conf_path(ssh)
    conf = f"""server {{
    listen 80;
    server_name {DOMAIN};

    location / {{
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }}
}}
"""
    cmd = f"cat > {conf_path} <<'EOF'\n{conf}\nEOF"
    exec_cmd(ssh, cmd)

    _, _, status = exec_cmd(ssh, "nginx -t", show=True)
    if status == 0:
        exec_cmd(ssh, "nginx -s reload")
    else:
        exec_cmd(ssh, "systemctl reload nginx")


def main():
    print("Connect to server...")
    ssh = ssh_connect()
    sftp = ssh.open_sftp()

    exec_cmd(ssh, f"mkdir -p {REMOTE_DIR}")

    base_dir = Path(__file__).resolve().parent.parent

    for rel_path in FILES:
        local_path = base_dir / rel_path
        if not local_path.exists():
            raise FileNotFoundError(f"Missing {local_path}")
        remote_path = f"{REMOTE_DIR}/{rel_path}".replace("\\", "/")
        upload_file(sftp, str(local_path), remote_path)

    for rel_dir in DIRS:
        local_dir = base_dir / rel_dir
        remote_dir = f"{REMOTE_DIR}/{rel_dir}"
        upload_dir(sftp, str(local_dir), remote_dir)

    ensure_docker(ssh)
    compose_cmd = get_compose_cmd(ssh)

    write_env_file(ssh)
    if DEPLOY_UPDATE_NGINX:
        configure_domain_nginx(ssh)
    else:
        print("Skip host nginx changes (DEPLOY_UPDATE_NGINX=false).")

    service_args = " ".join(DEPLOY_SERVICES) if DEPLOY_SERVICES else "frontend api-proxy"

    exec_cmd(
        ssh,
        f"cd {REMOTE_DIR} && COMPOSE_DOCKER_CLI_BUILD=0 DOCKER_BUILDKIT=0 "
        f"{compose_cmd} -f {COMPOSE_FILE} build --pull {service_args}",
    )
    exec_cmd(ssh, f"cd {REMOTE_DIR} && {compose_cmd} -f {COMPOSE_FILE} up -d --no-deps {service_args}")
    exec_cmd(ssh, f"cd {REMOTE_DIR} && {compose_cmd} -f {COMPOSE_FILE} ps")
    exec_cmd(
        ssh,
        "curl -s -o /tmp/deploy_mm.out -w 'mindmaps=%{http_code}\\n' "
        "-X POST http://127.0.0.1:8080/api/mindmaps/load "
        "-H 'Content-Type: application/json' "
        "-d '{\"userId\":\"deploy_health\"}'",
    )
    exec_cmd(
        ssh,
        "curl -s -o /tmp/deploy_doc.out -w 'doc=%{http_code}\\n' "
        "-X POST http://127.0.0.1:8080/api/doc "
        "-H 'Content-Type: application/json' "
        "-d '{\"url\":\"https://example.com\"}'",
    )

    sftp.close()
    ssh.close()
    print("Deployment finished.")


if __name__ == "__main__":
    main()
