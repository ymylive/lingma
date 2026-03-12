from pathlib import Path
import json
import sys

DEPLOY_DIR = Path(__file__).resolve().parent / "deploy"
if str(DEPLOY_DIR) not in sys.path:
    sys.path.append(str(DEPLOY_DIR))

from runtime_config import create_ssh_client


ssh = create_ssh_client()

data = json.dumps({"messages": [{"role": "user", "content": "hi"}]})
cmd = f"curl -s -X POST http://localhost:3001/api/ai -H 'Content-Type: application/json' -d '{data}'"
stdin, stdout, stderr = ssh.exec_command(cmd)
result = stdout.read().decode()
print("AI POST test:", result[:500] if len(result) > 500 else result)

stdin, stdout, stderr = ssh.exec_command("pm2 logs ai-proxy --lines 10 --nostream")
logs = stdout.read().decode()
print("\nPM2 logs:\n", logs)

ssh.close()
