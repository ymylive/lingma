import paramiko
import time

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('8.134.33.19', username='root', password='Qq159741')

# 检查server.js内容
print("检查server.js...")
stdin, stdout, stderr = ssh.exec_command('head -20 /var/www/lingma/api-proxy/server.js')
print(stdout.read().decode())

# 检查是否有app.post /api/ai
stdin, stdout, stderr = ssh.exec_command('grep "api/ai" /var/www/lingma/api-proxy/server.js')
result = stdout.read().decode()
print("AI routes:", result)

# 重启PM2
print("\n重启服务...")
stdin, stdout, stderr = ssh.exec_command('pm2 restart ai-proxy')
print(stdout.read().decode())

time.sleep(3)

# 测试
print("\n测试健康检查...")
stdin, stdout, stderr = ssh.exec_command('curl -s http://localhost:3001/api/health')
print(stdout.read().decode())

print("\n测试AI端点...")
stdin, stdout, stderr = ssh.exec_command('curl -s -X POST http://localhost:3001/api/ai -H "Content-Type: application/json" -d \'{"messages":[{"role":"user","content":"hi"}]}\'')
result = stdout.read().decode()
print(result[:500] if len(result) > 500 else result)

ssh.close()
