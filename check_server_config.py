#!/usr/bin/env python3
import paramiko

SERVER = "8.134.33.19"
USER = "root"
PASSWORD = "Qq159741"

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(SERVER, username=USER, password=PASSWORD)

print("📋 检查服务器上的代理配置...")
stdin, stdout, stderr = ssh.exec_command("cat /var/www/lingma/api-proxy/server.js | head -20")
print(stdout.read().decode())

ssh.close()
