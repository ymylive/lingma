#!/usr/bin/env python3
import json

from runtime_config import create_ssh_client, get_ai_proxy_config


ssh = create_ssh_client()
ai_config = get_ai_proxy_config()

print("Setting environment variables and restarting service...")

ssh.exec_command("pm2 delete ai-proxy 2>/dev/null || true")

ecosystem = f"""module.exports = {{
  apps: [{{
    name: 'ai-proxy',
    script: 'python3',
    interpreter: 'none',
    args: '-m uvicorn main:app --host 0.0.0.0 --port 3001',
    cwd: '/var/www/lingma/api-proxy',
    env: {{
      AI_API_KEY: {json.dumps(ai_config["AI_API_KEY"])},
      AI_API_URL: {json.dumps(ai_config["AI_API_URL"])},
      AI_MODEL: {json.dumps(ai_config["AI_MODEL"])},
      JUDGE_BASE_URL: {json.dumps(ai_config["JUDGE_BASE_URL"])},
      JUDGE_INTERNAL_TOKEN: {json.dumps(ai_config["JUDGE_INTERNAL_TOKEN"])}
    }}
  }}]
}};
"""

command = "cat > /var/www/lingma/api-proxy/ecosystem.config.js <<'EOF'\n" + ecosystem + "EOF\n"
stdin, stdout, stderr = ssh.exec_command(command)
stdout.read()

stdin, stdout, stderr = ssh.exec_command("cd /var/www/lingma/api-proxy && pm2 start ecosystem.config.js && pm2 save")
print(stdout.read().decode())
err = stderr.read().decode()
if err:
    print("Warning:", err)

ssh.close()
print("Done.")
