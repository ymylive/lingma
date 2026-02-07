import paramiko
import time

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('8.134.33.19', username='root', password='Qq159741')

print("停止PM2...")
ssh.exec_command('pm2 stop ai-proxy')
ssh.exec_command('pkill -9 -f "node.*server.js"')
time.sleep(2)

print("直接运行node...")
# 后台运行
stdin, stdout, stderr = ssh.exec_command('cd /var/www/lingma/api-proxy && nohup node server.js > /tmp/node.log 2>&1 &')
time.sleep(3)

print("\n查看启动日志:")
stdin, stdout, stderr = ssh.exec_command('cat /tmp/node.log')
print(stdout.read().decode())

print("\n测试AI端点...")
stdin, stdout, stderr = ssh.exec_command('curl -s -X POST http://localhost:3001/api/ai -H "Content-Type: application/json" -d \'{"messages":[{"role":"user","content":"hi"}]}\'')
result = stdout.read().decode()
print(result[:800] if len(result) > 800 else result)

ssh.close()
