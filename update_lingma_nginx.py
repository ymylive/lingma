import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('8.134.33.19', username='root', password='Qq159741')

# 查看当前配置
stdin, stdout, stderr = ssh.exec_command('cat /www/server/panel/vhost/nginx/lingma.conf')
print("=== 当前配置 ===")
current_config = stdout.read().decode()
print(current_config)

# 添加禁用缓存的配置
# 在location块中添加no-cache头
new_config = '''server
{
    listen 80;
    server_name lingma.cornna.xyz;
    return 301 https://$server_name$request_uri;
}

server
{
    listen 443 ssl http2;
    server_name lingma.cornna.xyz;
    index index.html;
    root /var/www/lingma;

    ssl_certificate /www/server/panel/vhost/cert/lingma.cornna.xyz/fullchain.pem;
    ssl_certificate_key /www/server/panel/vhost/cert/lingma.cornna.xyz/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # 禁用所有缓存
    add_header Cache-Control "no-cache, no-store, must-revalidate" always;
    add_header Pragma "no-cache" always;
    add_header Expires "0" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate" always;
    }

    access_log /www/wwwlogs/lingma.cornna.xyz.log;
    error_log /www/wwwlogs/lingma.cornna.xyz.error.log;
}
'''

sftp = ssh.open_sftp()
with sftp.file('/www/server/panel/vhost/nginx/lingma.conf', 'w') as f:
    f.write(new_config)
sftp.close()
print("\n=== 新配置已写入 ===")

# 测试配置
stdin, stdout, stderr = ssh.exec_command('/www/server/nginx/sbin/nginx -t')
print("=== 配置测试 ===")
print(stderr.read().decode())

# 重载nginx
stdin, stdout, stderr = ssh.exec_command('/www/server/nginx/sbin/nginx -s reload')
print("=== Nginx已重载 ===")

ssh.close()
print("\n完成！请清除浏览器缓存后访问 https://lingma.cornna.xyz")
