import paramiko
import json

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('8.134.33.19', username='root', password='Qq159741')

# 测试判题服务
print("1. 检查服务状态...")
stdin, stdout, stderr = ssh.exec_command('systemctl status lingma-api --no-pager')
print(stdout.read().decode()[:500])

print("\n2. 测试健康检查...")
stdin, stdout, stderr = ssh.exec_command('curl -s http://localhost:3001/api/health')
print(stdout.read().decode())

# 测试一个简单的Python代码
print("\n3. 测试Python判题...")
test_data = {
    "code": """n = int(input())
print(n * 2)""",
    "language": "python",
    "testCases": [
        {"input": "5", "expectedOutput": "10"},
        {"input": "3", "expectedOutput": "6"}
    ]
}

cmd = f"curl -s -X POST http://localhost:3001/api/judge -H 'Content-Type: application/json' -d '{json.dumps(test_data)}'"
stdin, stdout, stderr = ssh.exec_command(cmd)
result = stdout.read().decode()
print("判题结果:", result)

# 测试一个简单的C代码
print("\n4. 测试C判题...")
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
        {"input": "3", "expectedOutput": "6"}
    ]
}

cmd = f"curl -s -X POST http://localhost:3001/api/judge -H 'Content-Type: application/json' -d '{json.dumps(test_data_c)}'"
stdin, stdout, stderr = ssh.exec_command(cmd)
result = stdout.read().decode()
print("判题结果:", result)

# 查看服务日志
print("\n5. 最近的服务日志...")
stdin, stdout, stderr = ssh.exec_command('journalctl -u lingma-api -n 30 --no-pager')
print(stdout.read().decode()[-2000:])

ssh.close()
