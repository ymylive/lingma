#!/usr/bin/env python3
import paramiko

HOST = '8.134.33.19'
USER = 'root'
PASSWORD = 'Qq159741'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASSWORD)

# 新的nginx配置（包含完整API代理）
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
    
    add_header Cache-Control "no-cache, no-store, must-revalidate" always;
    add_header Pragma "no-cache" always;
    
    # AI API代理 (5分钟超时，thinking模型需要更长时间)
    location /api/ai {
        proxy_pass http://127.0.0.1:3001/api/ai;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
        proxy_buffering off;
    }

    # 其他API请求
    location /api/ {
        proxy_pass http://127.0.0.1:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 120s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
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

print("📝 更新Nginx配置...")
stdin, stdout, stderr = ssh.exec_command(f"cat > /www/server/panel/vhost/nginx/lingma.conf << 'EOF'\n{new_config}\nEOF")
stdout.read()

print("🔧 测试并重载Nginx...")
stdin, stdout, stderr = ssh.exec_command('nginx -t && nginx -s reload')
print(stdout.read().decode())
err = stderr.read().decode()
if err:
    print(err)

print("✅ Nginx配置已更新!")
ssh.close()
