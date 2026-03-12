from pathlib import Path
import sys
import time

DEPLOY_DIR = Path(__file__).resolve().parent / "deploy"
if str(DEPLOY_DIR) not in sys.path:
    sys.path.append(str(DEPLOY_DIR))

from runtime_config import create_ssh_client


ssh = create_ssh_client()

print("Stopping PM2...")
ssh.exec_command("pm2 stop ai-proxy")
ssh.exec_command('pkill -9 -f "uvicorn.*main:app"')
time.sleep(2)

print("Starting uvicorn directly...")
stdin, stdout, stderr = ssh.exec_command(
    "cd /var/www/lingma/api-proxy && nohup python3 -m uvicorn main:app --host 0.0.0.0 --port 3001 > /tmp/uvicorn.log 2>&1 &"
)
time.sleep(3)

print("\nStartup log:")
stdin, stdout, stderr = ssh.exec_command("cat /tmp/uvicorn.log")
print(stdout.read().decode())

print("\nTesting AI endpoint...")
stdin, stdout, stderr = ssh.exec_command('curl -s -X POST http://localhost:3001/api/ai -H "Content-Type: application/json" -d \'{"messages":[{"role":"user","content":"hi"}]}\'')
result = stdout.read().decode()
print(result[:800] if len(result) > 800 else result)

ssh.close()
