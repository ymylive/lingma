import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('8.134.33.19', username='root', password='Qq159741')

# 检查nginx配置
stdin, stdout, stderr = ssh.exec_command('cat /etc/nginx/conf.d/*.conf 2>/dev/null || cat /etc/nginx/sites-available/* 2>/dev/null || nginx -T 2>/dev/null | head -100')
print("=== Nginx配置 ===")
print(stdout.read().decode()[:1500])

# 检查JS文件大小
stdin, stdout, stderr = ssh.exec_command('wc -c /var/www/lingma/assets/index-i0xXvbek.js')
print("\n=== JS文件大小 ===")
print(stdout.read().decode())

ssh.close()
