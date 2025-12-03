#!/usr/bin/env python3
# 部署AI API代理服务到服务器

import paramiko
import os

# 服务器配置
SERVER = "8.134.33.19"
USER = "root"
PASSWORD = "Qq159741"
REMOTE_PATH = "/var/www/lingma/api-proxy"

def deploy():
    print("🔐 部署AI API代理服务...")
    
    # 连接服务器
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(SERVER, username=USER, password=PASSWORD)
    sftp = ssh.open_sftp()
    
    # 创建目录
    try:
        sftp.mkdir(REMOTE_PATH)
    except:
        pass
    
    # 上传文件
    local_dir = os.path.join(os.path.dirname(__file__), '..', 'api-proxy')
    for filename in ['server.js', 'package.json']:
        local_path = os.path.join(local_dir, filename)
        remote_file = f"{REMOTE_PATH}/{filename}"
        print(f"📤 {filename}")
        sftp.put(local_path, remote_file)
    
    # 安装依赖并启动服务
    commands = [
        f"cd {REMOTE_PATH}",
        "pm2 delete ai-proxy 2>/dev/null || true",
        "pm2 start server.js --name ai-proxy",
        "pm2 save"
    ]
    
    print("🚀 启动代理服务...")
    stdin, stdout, stderr = ssh.exec_command(" && ".join(commands))
    print(stdout.read().decode())
    
    # 更新nginx配置
    nginx_location = '''
    # AI API 代理
    location /api/ai {
        proxy_pass http://127.0.0.1:3001/api/ai;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
'''
    
    # 检查nginx配置是否已包含代理
    stdin, stdout, stderr = ssh.exec_command("grep -c 'location /api/ai' /etc/nginx/sites-available/lingma.conf || echo 0")
    count = int(stdout.read().decode().strip())
    
    if count == 0:
        print("📝 添加Nginx代理配置...")
        # 在最后一个 } 前插入代理配置
        cmd = f'''sed -i '/^}}/i\\{nginx_location.replace(chr(10), chr(92) + "n")}' /etc/nginx/sites-available/lingma.conf'''
        # 简单方法：直接追加到server块
        stdin, stdout, stderr = ssh.exec_command(f"cat /etc/nginx/sites-available/lingma.conf")
        config = stdout.read().decode()
        
        # 在 location / 之前添加
        if 'location /api/ai' not in config:
            new_config = config.replace('location / {', nginx_location + '\n    location / {')
            stdin, stdout, stderr = ssh.exec_command(f"echo '{new_config}' > /etc/nginx/sites-available/lingma.conf")
            stdin, stdout, stderr = ssh.exec_command("nginx -t && nginx -s reload")
            print(stdout.read().decode())
            err = stderr.read().decode()
            if err:
                print(f"⚠️ Nginx: {err}")
    
    sftp.close()
    ssh.close()
    print("✅ AI代理服务部署完成!")

if __name__ == "__main__":
    deploy()
