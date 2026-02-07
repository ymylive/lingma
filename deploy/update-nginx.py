#!/usr/bin/env python3
# 更新Nginx配置支持流式输出

import paramiko

SERVER = "8.134.33.19"
USER = "root"
PASSWORD = "Qq159741"

NGINX_CONF = '''server {
    listen 80;
    server_name lingma.cornna.xyz;
    root /var/www/lingma;
    index index.html;
    
    # AI流式API - 支持SSE
    location /api/ai/stream {
        proxy_pass http://127.0.0.1:3001/api/ai/stream;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Connection '';
        proxy_buffering off;
        proxy_cache off;
        chunked_transfer_encoding off;
        proxy_connect_timeout 60s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }
    
    # API代理到后端Node.js服务
    location /api/ {
        proxy_pass http://127.0.0.1:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
}
'''

def update():
    print("📝 更新Nginx配置...")
    
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(SERVER, username=USER, password=PASSWORD)
    
    # 写入配置文件
    escaped_conf = NGINX_CONF.replace("'", "'\\''")
    cmd = f"echo '{escaped_conf}' > /www/server/panel/vhost/nginx/lingma.cornna.xyz.conf"
    stdin, stdout, stderr = ssh.exec_command(cmd)
    stdout.read()
    
    # 测试并重载nginx
    stdin, stdout, stderr = ssh.exec_command("nginx -t && nginx -s reload")
    out = stdout.read().decode()
    err = stderr.read().decode()
    print(out)
    if err:
        print(err)
    
    ssh.close()
    print("✅ Nginx配置更新完成!")

if __name__ == "__main__":
    update()
