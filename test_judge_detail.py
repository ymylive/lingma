from pathlib import Path
import json
import sys

DEPLOY_DIR = Path(__file__).resolve().parent / "deploy"
if str(DEPLOY_DIR) not in sys.path:
    sys.path.append(str(DEPLOY_DIR))

from runtime_config import create_ssh_client


ssh = create_ssh_client()

print("1. Service status...")
stdin, stdout, stderr = ssh.exec_command("systemctl status lingma-api --no-pager")
print(stdout.read().decode()[:500])

print("\n2. Health check...")
stdin, stdout, stderr = ssh.exec_command("curl -s http://localhost:3001/api/health")
print(stdout.read().decode())

print("\n3. Python judge test...")
test_data = {
    "code": """n = int(input())
print(n * 2)""",
    "language": "python",
    "testCases": [
        {"input": "5", "expectedOutput": "10"},
        {"input": "3", "expectedOutput": "6"},
    ],
}

cmd = f"curl -s -X POST http://localhost:3001/api/judge -H 'Content-Type: application/json' -d '{json.dumps(test_data)}'"
stdin, stdout, stderr = ssh.exec_command(cmd)
result = stdout.read().decode()
print("Judge result:", result)

print("\n4. C judge test...")
test_data_c = {
    "code": """#include <stdio.h>
int main() {
    int n;
    scanf("%d", &n);
    printf("%d\\n", n * 2);
    return 0;
}""",
    "language": "c",
    "testCases": [
        {"input": "5", "expectedOutput": "10"},
        {"input": "3", "expectedOutput": "6"},
    ],
}

cmd = f"curl -s -X POST http://localhost:3001/api/judge -H 'Content-Type: application/json' -d '{json.dumps(test_data_c)}'"
stdin, stdout, stderr = ssh.exec_command(cmd)
result = stdout.read().decode()
print("Judge result:", result)

print("\n5. Recent service log...")
stdin, stdout, stderr = ssh.exec_command("journalctl -u lingma-api -n 30 --no-pager")
print(stdout.read().decode()[-2000:])

ssh.close()
