#!/usr/bin/env python3
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

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(SERVER, username=USER, password=PASSWORD)

print("🔧 修复Nginx配置...")

# 删除冲突的配置文件
print("删除冲突配置...")
stdin, stdout, stderr = ssh.exec_command("rm -f /www/server/panel/vhost/nginx/lingma.conf")
stdout.read()

# 写入正确的配置
print("写入新配置...")
# 使用heredoc方式写入，避免转义问题
cmd = f'''cat > /www/server/panel/vhost/nginx/lingma.cornna.xyz.conf << 'NGINX_EOF'
{NGINX_CONF}
NGINX_EOF'''
stdin, stdout, stderr = ssh.exec_command(cmd)
stdout.read()

# 测试并重载
print("测试并重载Nginx...")
stdin, stdout, stderr = ssh.exec_command("nginx -t && nginx -s reload")
out = stdout.read().decode()
err = stderr.read().decode()
print(out)
print(err)

# 验证
print("\n验证配置...")
stdin, stdout, stderr = ssh.exec_command("curl -s http://localhost:3002/api/health")
print(f"判题服务: {stdout.read().decode()}")

ssh.close()
print("\n✅ 完成!")
