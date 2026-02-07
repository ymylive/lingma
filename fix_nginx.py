import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('8.134.33.19', username='root', password='Qq159741')

# 先删除错误的配置
stdin, stdout, stderr = ssh.exec_command('rm -f /etc/nginx/conf.d/lingma.conf')

# 检查所有nginx配置文件
stdin, stdout, stderr = ssh.exec_command('ls -la /etc/nginx/conf.d/')
print("=== conf.d目录 ===")
print(stdout.read().decode())

# 检查是否有lingma域名配置
stdin, stdout, stderr = ssh.exec_command('grep -rl "lingma.cornna" /etc/nginx/ /www/server/nginx/ 2>/dev/null')
print("=== 包含lingma.cornna的文件 ===")
print(stdout.read().decode())

# 检查www/server/nginx目录
stdin, stdout, stderr = ssh.exec_command('ls /www/server/nginx/conf/ 2>/dev/null')
print("=== www/server/nginx/conf ===")
print(stdout.read().decode())

# 查找lingma相关配置
stdin, stdout, stderr = ssh.exec_command('grep -r "lingma" /www/server/ 2>/dev/null | head -20')
print("=== lingma相关配置 ===")
print(stdout.read().decode())

# 重载nginx
stdin, stdout, stderr = ssh.exec_command('/www/server/nginx/sbin/nginx -s reload 2>&1 || nginx -s reload 2>&1')
print("=== nginx reload ===")
print(stdout.read().decode())

ssh.close()
