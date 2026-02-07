import paramiko
import time

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('8.134.33.19', username='root', password='Qq159741')

print("删除uuid模块...")
stdin, stdout, stderr = ssh.exec_command('rm -rf /var/www/lingma/api-proxy/node_modules/uuid')
stdout.read()

print("停止PM2服务...")
stdin, stdout, stderr = ssh.exec_command('pm2 delete ai-proxy')
print(stdout.read().decode())

print("清除PM2日志...")
stdin, stdout, stderr = ssh.exec_command('pm2 flush')
stdout.read()

print("重新启动...")
stdin, stdout, stderr = ssh.exec_command('cd /var/www/lingma/api-proxy && pm2 start server.js --name ai-proxy')
print(stdout.read().decode())

time.sleep(3)

print("\n测试健康检查...")
stdin, stdout, stderr = ssh.exec_command('curl -s http://localhost:3001/api/health')
print(stdout.read().decode())

print("\n测试AI端点...")
stdin, stdout, stderr = ssh.exec_command('curl -s -X POST http://localhost:3001/api/ai -H "Content-Type: application/json" -d \'{"messages":[{"role":"user","content":"hi"}]}\'')
result = stdout.read().decode()
print(result[:500] if len(result) > 500 else result)

print("\nPM2状态:")
stdin, stdout, stderr = ssh.exec_command('pm2 list')
print(stdout.read().decode())

ssh.close()
