import paramiko
import time

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('8.134.33.19', username='root', password='Qq159741')

print("停止PM2...")
ssh.exec_command('pm2 delete ai-proxy 2>/dev/null')

print("停止systemd...")
ssh.exec_command('systemctl stop lingma-api')
time.sleep(1)

print("检查server.js中的cpp配置...")
stdin, stdout, stderr = ssh.exec_command('grep -c "cpp:" /var/www/lingma/api-proxy/server.js')
cpp_count = stdout.read().decode().strip()
print(f"cpp配置出现次数: {cpp_count}")

if cpp_count == '0':
    print("cpp配置缺失，查看文件内容...")
    stdin, stdout, stderr = ssh.exec_command('head -80 /var/www/lingma/api-proxy/server.js')
    print(stdout.read().decode())

print("\n启动systemd...")
ssh.exec_command('systemctl start lingma-api')
time.sleep(3)

print("\n检查状态...")
stdin, stdout, stderr = ssh.exec_command('curl -s http://localhost:3001/api/health')
print("Health:", stdout.read().decode())

ssh.close()
