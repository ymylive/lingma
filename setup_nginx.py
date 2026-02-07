import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('8.134.33.19', username='root', password='Qq159741')

# 创建nginx配置（禁用缓存）
config = '''server {
    listen 81;
    server_name _;
    root /var/www/lingma;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }

    location /assets/ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
'''

sftp = ssh.open_sftp()
with sftp.file('/etc/nginx/conf.d/lingma.conf', 'w') as f:
    f.write(config)
sftp.close()

# 测试和重载
stdin, stdout, stderr = ssh.exec_command('nginx -t')
print("Nginx test:", stderr.read().decode())

stdin, stdout, stderr = ssh.exec_command('nginx -s reload')
print("Nginx reloaded")

# 验证配置
stdin, stdout, stderr = ssh.exec_command('cat /etc/nginx/conf.d/lingma.conf')
print("\n配置内容:")
print(stdout.read().decode())

ssh.close()
