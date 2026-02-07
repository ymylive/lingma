import paramiko
import time

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('8.134.33.19', username='root', password='Qq159741')

print("停止PM2...")
ssh.exec_command('pm2 delete ai-proxy 2>/dev/null')
time.sleep(1)

print("重启systemd服务...")
ssh.exec_command('systemctl restart lingma-api')
time.sleep(3)

print("检查状态...")
stdin, stdout, stderr = ssh.exec_command('curl -s http://localhost:3001/api/health')
print("Health:", stdout.read().decode())

# 测试cpp
print("\n测试C++判题...")
import json
test_data = {
    "code": """#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    cout << n * 2 << endl;
    return 0;
}""",
    "language": "cpp",
    "testCases": [
        {"input": "5", "expectedOutput": "10"},
        {"input": "3", "expectedOutput": "6"}
    ]
}
cmd = f"curl -s -X POST http://localhost:3001/api/judge -H 'Content-Type: application/json' -d '{json.dumps(test_data)}'"
stdin, stdout, stderr = ssh.exec_command(cmd)
print(stdout.read().decode())

ssh.close()
print("\n✅ 服务已重启!")
