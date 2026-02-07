#!/usr/bin/env python3
import paramiko
import time

SERVER = "8.134.33.19"
USER = "root"
PASSWORD = "Qq159741"

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(SERVER, username=USER, password=PASSWORD)

print("🔧 修复代理服务...")

# 杀掉所有占用3001端口的进程
commands = [
    "pm2 delete all 2>/dev/null || true",
    "fuser -k 3001/tcp 2>/dev/null || true",
    "sleep 2",
    "cd /var/www/lingma/api-proxy && pm2 start server.js --name ai-proxy",
    "pm2 save",
    "sleep 2",
    "pm2 logs ai-proxy --lines 10 --nostream"
]

for cmd in commands:
    print(f"$ {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode()
    err = stderr.read().decode()
    if out:
        print(out)
    if err and 'warning' not in err.lower():
        print(f"[stderr] {err}")

ssh.close()
print("✅ 完成!")
