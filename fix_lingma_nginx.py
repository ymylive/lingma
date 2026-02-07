import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('8.134.33.19', username='root', password='Qq159741')

# 完整配置，包含API代理
new_config = '''server {
    listen 80;
    server_name lingma.cornna.xyz;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name lingma.cornna.xyz;

    ssl_certificate /www/server/panel/vhost/cert/lingma.cornna.xyz/fullchain.pem;
    ssl_certificate_key /www/server/panel/vhost/cert/lingma.cornna.xyz/privkey.pem;

    # 禁用缓存
    add_header Cache-Control "no-cache, no-store, must-revalidate" always;
    add_header Pragma "no-cache" always;

    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 60s;
    }

    location / {
        root /var/www/lingma;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
}
'''

sftp = ssh.open_sftp()
with sftp.file('/www/server/panel/vhost/nginx/lingma.conf', 'w') as f:
    f.write(new_config)
sftp.close()
print("配置已更新")

# 重载
stdin, stdout, stderr = ssh.exec_command('/www/server/nginx/sbin/nginx -s reload')
print("Nginx已重载")

ssh.close()
