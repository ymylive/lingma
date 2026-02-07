import paramiko
import json

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('8.134.33.19', username='root', password='Qq159741')

# 测试AI端点
data = json.dumps({"messages": [{"role": "user", "content": "hi"}]})
cmd = f"curl -s -X POST http://localhost:3001/api/ai -H 'Content-Type: application/json' -d '{data}'"
stdin, stdout, stderr = ssh.exec_command(cmd)
result = stdout.read().decode()
print("AI POST测试:", result[:500] if len(result) > 500 else result)

# 检查PM2日志
stdin, stdout, stderr = ssh.exec_command('pm2 logs ai-proxy --lines 10 --nostream')
logs = stdout.read().decode()
print("\nPM2日志:\n", logs)

ssh.close()
