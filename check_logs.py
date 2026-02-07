import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('8.134.33.19', username='root', password='Qq159741')

# 检查最新错误日志
print("最新错误日志:")
stdin, stdout, stderr = ssh.exec_command('pm2 logs ai-proxy --err --lines 30 --nostream')
print(stdout.read().decode())

# 检查node_modules
print("\n检查依赖:")
stdin, stdout, stderr = ssh.exec_command('ls /var/www/lingma/api-proxy/node_modules/ | head -10')
print(stdout.read().decode())

# 尝试直接运行
print("\n直接运行测试:")
stdin, stdout, stderr = ssh.exec_command('cd /var/www/lingma/api-proxy && pm2 stop ai-proxy; node server.js 2>&1 &')
import time
time.sleep(3)
stdin, stdout, stderr = ssh.exec_command('curl -s http://localhost:3001/api/health')
print("Health:", stdout.read().decode())

stdin, stdout, stderr = ssh.exec_command('pkill -f "node server.js"')

ssh.close()
