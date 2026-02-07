#!/usr/bin/env python3
import paramiko

SERVER = "8.134.33.19"
USER = "root"
PASSWORD = "Qq159741"

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(SERVER, username=USER, password=PASSWORD)

print("🔍 检查当前Nginx配置...")

# 查看当前配置
stdin, stdout, stderr = ssh.exec_command("cat /www/server/panel/vhost/nginx/lingma.cornna.xyz.conf")
print("当前配置:")
print(stdout.read().decode()[:500])

# 查看是否有其他配置文件
print("\n🔍 查找所有lingma相关配置...")
stdin, stdout, stderr = ssh.exec_command("find /etc/nginx /www -name '*lingma*' 2>/dev/null")
print(stdout.read().decode())

# 检查判题服务是否运行
print("\n🔍 检查判题服务...")
stdin, stdout, stderr = ssh.exec_command("curl -s http://localhost:3002/api/health")
print(f"本地判题服务: {stdout.read().decode()}")

ssh.close()
