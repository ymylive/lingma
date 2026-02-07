#!/usr/bin/env python3
# 部署所有服务

import paramiko
import os

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
    
    # AI API代理 (端口3001)
    location /api/ai {
        proxy_pass http://127.0.0.1:3001/api/ai;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_connect_timeout 60s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }
    
    # 判题服务代理 (端口3002)
    location /api/judge {
        proxy_pass http://127.0.0.1:3002/api/judge;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_connect_timeout 60s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
    
    location /api/run {
        proxy_pass http://127.0.0.1:3002/api/run;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_connect_timeout 60s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
    
    location /api/health {
        proxy_pass http://127.0.0.1:3002/api/health;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
}
'''

def deploy():
    print("🚀 部署所有服务...")
    
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(SERVER, username=USER, password=PASSWORD)
    sftp = ssh.open_sftp()
    
    # 1. 上传判题服务
    print("\n📤 上传判题服务...")
    try:
        sftp.mkdir('/var/www/lingma/judge-server')
    except:
        pass
    
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    judge_dir = os.path.join(base_dir, 'judge-server')
    
    for f in ['server.js', 'package.json']:
        local = os.path.join(judge_dir, f)
        remote = f'/var/www/lingma/judge-server/{f}'
        print(f"  📄 {f}")
        sftp.put(local, remote)
    
    # 2. 安装依赖并启动判题服务
    print("\n🔧 启动判题服务...")
    commands = [
        "cd /var/www/lingma/judge-server && npm install --production 2>/dev/null",
        "pm2 delete judge-server 2>/dev/null || true",
        "fuser -k 3002/tcp 2>/dev/null || true",
        "sleep 1",
        "cd /var/www/lingma/judge-server && pm2 start server.js --name judge-server",
    ]
    
    for cmd in commands:
        stdin, stdout, stderr = ssh.exec_command(cmd)
        stdout.read()
    
    # 3. 更新Nginx配置
    print("\n📝 更新Nginx配置...")
    escaped_conf = NGINX_CONF.replace("'", "'\\''")
    cmd = f"echo '{escaped_conf}' > /www/server/panel/vhost/nginx/lingma.cornna.xyz.conf"
    stdin, stdout, stderr = ssh.exec_command(cmd)
    stdout.read()
    
    # 4. 重载Nginx
    stdin, stdout, stderr = ssh.exec_command("nginx -t && nginx -s reload")
    out = stdout.read().decode()
    err = stderr.read().decode()
    print(out)
    if err:
        print(err)
    
    # 5. 保存PM2配置
    stdin, stdout, stderr = ssh.exec_command("pm2 save")
    stdout.read()
    
    # 6. 显示服务状态
    print("\n📊 服务状态:")
    stdin, stdout, stderr = ssh.exec_command("pm2 list")
    print(stdout.read().decode())
    
    sftp.close()
    ssh.close()
    print("✅ 部署完成!")

if __name__ == "__main__":
    deploy()
