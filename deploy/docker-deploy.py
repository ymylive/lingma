#!/usr/bin/env python3
"""Deploy tumafang to VPS via Docker Compose (paramiko-based, Windows-compatible)."""
import os, sys, tarfile, tempfile, time

try:
    import paramiko
except ImportError:
    print("ERROR: pip install paramiko"); sys.exit(1)

VPS_HOST = os.getenv("LINGMA_VPS_HOST", "8.134.33.19")
VPS_USER = os.getenv("LINGMA_VPS_USER", "root")
VPS_PASSWORD = os.getenv("LINGMA_VPS_PASSWORD", "")
REMOTE_DIR = "/var/www/lingma"
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

INCLUDE_PATHS = [
    "deploy/", "api-proxy/main.py", "api-proxy/requirements.txt",
    "judge-server/server.js", "judge-server/package.json", "judge-server/package-lock.json",
    "src/", "public/", "package.json", "package-lock.json",
    "tsconfig.json", "tsconfig.app.json", "tsconfig.node.json",
    "vite.config.ts", "tailwind.config.js", "postcss.config.js", "index.html",
]
EXCLUDE_PATTERNS = ["__pycache__", "*.pyc", ".codex-deploy", "node_modules", "dist"]


def should_exclude(name):
    for p in EXCLUDE_PATTERNS:
        if p.startswith("*") and name.endswith(p[1:]): return True
        elif p in name: return True
    return False


def create_tarball():
    tar_path = os.path.join(tempfile.gettempdir(), f"tumafang-{time.strftime('%Y%m%d-%H%M%S')}.tar.gz")
    with tarfile.open(tar_path, "w:gz") as tar:
        for inc in INCLUDE_PATHS:
            full = os.path.join(PROJECT_ROOT, inc.replace("/", os.sep))
            if os.path.isfile(full):
                if not should_exclude(inc): tar.add(full, arcname=inc)
            elif os.path.isdir(full):
                for root, dirs, files in os.walk(full):
                    dirs[:] = [d for d in dirs if not should_exclude(d)]
                    for f in files:
                        fp = os.path.join(root, f)
                        arc = os.path.relpath(fp, PROJECT_ROOT).replace(os.sep, "/")
                        if not should_exclude(arc): tar.add(fp, arcname=arc)
    print(f"  Tarball: {os.path.getsize(tar_path)/1024/1024:.1f} MB")
    return tar_path


def ssh_exec(ssh, cmd, check=True):
    print(f"  $ {cmd[:120]}{'...' if len(cmd)>120 else ''}")
    _, stdout, stderr = ssh.exec_command(cmd, timeout=600)
    out = stdout.read().decode().strip()
    err = stderr.read().decode().strip()
    rc = stdout.channel.recv_exit_status()
    if check and rc != 0:
        print(f"  [STDERR] {err}")
        raise RuntimeError(f"Command failed (rc={rc}): {cmd}")
    return out


def main():
    if not VPS_PASSWORD:
        print("ERROR: Set LINGMA_VPS_PASSWORD"); sys.exit(1)

    print(f"{'='*60}\nDeploying to {VPS_HOST}\n{'='*60}")

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(VPS_HOST, username=VPS_USER, password=VPS_PASSWORD, timeout=30)
    sftp = ssh.open_sftp()

    # 1. Package
    print("\n[1/6] Packaging...")
    tar_path = create_tarball()

    # 2. Upload
    print(f"\n[2/6] Uploading...")
    ssh_exec(ssh, f"mkdir -p {REMOTE_DIR}")
    remote_tar = f"{REMOTE_DIR}/deploy-bundle.tar.gz"
    sftp.put(tar_path, remote_tar, callback=lambda sent, total: None)
    os.unlink(tar_path)
    print("  Upload complete.")

    # 3. Extract
    print("\n[3/6] Extracting...")
    ssh_exec(ssh, f"cd {REMOTE_DIR} && tar xzf deploy-bundle.tar.gz && rm deploy-bundle.tar.gz")

    # 4. Stop old services
    print("\n[4/6] Stopping old services...")
    ssh_exec(ssh, "systemctl stop ai-proxy 2>/dev/null; systemctl disable ai-proxy 2>/dev/null; true", check=False)
    ssh_exec(ssh, "pm2 delete all 2>/dev/null; true", check=False)
    ssh_exec(ssh, f"cd {REMOTE_DIR}/deploy && docker-compose down 2>/dev/null; true", check=False)

    # 5. Build & start
    print("\n[5/6] Building Docker containers (this may take a few minutes)...")
    env_check = ssh_exec(ssh, f"test -f {REMOTE_DIR}/deploy/.env && echo EXISTS || echo MISSING")
    if "MISSING" in env_check:
        ssh_exec(ssh, f"cat > {REMOTE_DIR}/deploy/.env <<'EOF'\nFRONTEND_BIND_HOST=0.0.0.0\nFRONTEND_BIND_PORT=18081\nEOF")
        print("  WARNING: Created minimal .env — add AI_API_KEY etc. manually if needed.")

    out = ssh_exec(ssh, f"cd {REMOTE_DIR}/deploy && docker-compose build --no-cache 2>&1", check=False)
    for line in out.split("\n")[-15:]:
        print(f"    {line}")

    out = ssh_exec(ssh, f"cd {REMOTE_DIR}/deploy && docker-compose up -d 2>&1", check=False)
    print(f"  {out}")

    # 6. Prune old images
    print("\n[6/6] Pruning old images...")
    out = ssh_exec(ssh, "docker image prune -af 2>&1", check=False)
    print(f"  {out}")

    # Verify
    print(f"\n{'='*60}\nVerification\n{'='*60}")
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
