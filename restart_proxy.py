#!/usr/bin/env python3
import paramiko

SERVER = "8.134.33.19"
USER = "root"
PASSWORD = "Qq159741"

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(SERVER, username=USER, password=PASSWORD)

print("🔄 强制重启代理服务...")

# 完全停止并重新启动
commands = [
    "pm2 delete ai-proxy 2>/dev/null || true",
    "cd /var/www/lingma/api-proxy && pm2 start server.js --name ai-proxy",
    "pm2 save",
    "pm2 logs ai-proxy --lines 5 --nostream"
]

for cmd in commands:
    print(f"$ {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode()
    err = stderr.read().decode()
    if out:
        print(out)
    if err:
        print(err)

ssh.close()
print("✅ 完成!")
