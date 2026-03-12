#!/usr/bin/env python3
import json

from runtime_config import create_ssh_client, get_ai_proxy_config


ssh = create_ssh_client()
ai_config = get_ai_proxy_config()

print("Configuring AI proxy service...")

service_content = f"""[Unit]
Description=LingMa AI API Proxy
After=network.target

[Service]
Type=simple
WorkingDirectory=/var/www/lingma/api-proxy
Environment={json.dumps("AI_API_KEY=" + ai_config["AI_API_KEY"])}
Environment={json.dumps("AI_API_URL=" + ai_config["AI_API_URL"])}
Environment={json.dumps("AI_MODEL=" + ai_config["AI_MODEL"])}
ExecStart=/usr/bin/python3 -m uvicorn main:app --host 0.0.0.0 --port 3001
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
"""

command = "cat > /etc/systemd/system/ai-proxy.service <<'EOF'\n" + service_content + "EOF\n"
stdin, stdout, stderr = ssh.exec_command(command)
stdout.read()

for command in [
    "systemctl daemon-reload",
    "systemctl stop ai-proxy 2>/dev/null || true",
    "systemctl start ai-proxy",
    "systemctl enable ai-proxy",
    "systemctl status ai-proxy",
]:
    stdin, stdout, stderr = ssh.exec_command(command)
    output = stdout.read().decode()
    if output:
        print(output)

ssh.close()
print("AI proxy service configured.")
