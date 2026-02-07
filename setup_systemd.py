import paramiko
import time

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('8.134.33.19', username='root', password='Qq159741')

print("停止现有服务...")
ssh.exec_command('pm2 delete ai-proxy 2>/dev/null')
ssh.exec_command('pkill -9 -f "node.*server.js"')
time.sleep(2)

# 创建systemd服务
service_content = '''[Unit]
Description=LingMa Backend Service
After=network.target

[Service]
Type=simple
WorkingDirectory=/var/www/lingma/api-proxy
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
'''

print("创建systemd服务...")
sftp = ssh.open_sftp()
with sftp.file('/etc/systemd/system/lingma-api.service', 'w') as f:
    f.write(service_content)
sftp.close()

print("启动服务...")
commands = [
    'systemctl daemon-reload',
    'systemctl stop lingma-api 2>/dev/null || true',
    'systemctl start lingma-api',
    'systemctl enable lingma-api',
]
for cmd in commands:
    ssh.exec_command(cmd)
    time.sleep(1)

time.sleep(3)

print("\n检查服务状态:")
stdin, stdout, stderr = ssh.exec_command('systemctl status lingma-api')
print(stdout.read().decode())

print("\n测试健康检查:")
stdin, stdout, stderr = ssh.exec_command('curl -s http://localhost:3001/api/health')
print(stdout.read().decode())

print("\n测试AI端点:")
stdin, stdout, stderr = ssh.exec_command('curl -s -X POST http://localhost:3001/api/ai -H "Content-Type: application/json" -d \'{"messages":[{"role":"user","content":"test"}]}\'')
result = stdout.read().decode()
print(result[:500] if len(result) > 500 else result)

ssh.close()
print("\n✅ 服务配置完成!")
