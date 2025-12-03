import paramiko

HOST = '8.134.33.19'
USER = 'root'
PASSWORD = 'Qq159741'

def ssh_connect():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASSWORD)
    return ssh

def exec_cmd(ssh, cmd):
    print(f'$ {cmd}')
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=300)
    for line in stdout:
        print(line.strip())
    for line in stderr:
        print(f'[E] {line.strip()}')
    return stdout.channel.recv_exit_status()

ssh = ssh_connect()

# 检查/安装依赖
commands = [
    # 检查现有工具
    'which node gcc python3 java 2>/dev/null || echo "部分工具未安装"',
    
    # 使用阿里云镜像安装node（如果需要）
    'node --version || (curl -fsSL https://rpm.nodesource.com/setup_18.x | bash - && yum install -y nodejs --disablerepo=alinux3-os)',
    
    # 安装gcc
    'gcc --version || yum install -y gcc --disablerepo=alinux3-os',
    
    # 安装python3
    'python3 --version || yum install -y python3 --disablerepo=alinux3-os',
    
    # 安装java
    'java -version 2>&1 || yum install -y java-11-openjdk --disablerepo=alinux3-os',
    
    # 安装npm依赖
    'cd /var/www/judge-server && npm install',
    
    # 创建systemd服务
    '''cat > /etc/systemd/system/lingma-judge.service << 'EOF'
[Unit]
Description=Lingma Judge Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/judge-server
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF''',
    
    # 启动服务
    'systemctl daemon-reload && systemctl enable lingma-judge && systemctl restart lingma-judge',
    'sleep 2 && systemctl status lingma-judge --no-pager | head -20',
    
    # 更新nginx配置
    '''cat > /www/server/panel/vhost/nginx/lingma.conf << 'EOF'
server {
    listen 80;
    server_name lingma.cornna.xyz;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name lingma.cornna.xyz;
    
    ssl_certificate /www/server/panel/vhost/cert/lingma.cornna.xyz/fullchain.pem;
    ssl_certificate_key /www/server/panel/vhost/cert/lingma.cornna.xyz/privkey.pem;
    
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
EOF''',
    
    # 删除旧配置并重载
    'rm -f /www/server/panel/vhost/nginx/judge-api.conf',
    '/www/server/nginx/sbin/nginx -t && /www/server/nginx/sbin/nginx -s reload',
    
    # 测试API
    'curl -s http://127.0.0.1:3001/api/health',
]

for cmd in commands:
    print('\n' + '='*50)
    exec_cmd(ssh, cmd)

ssh.close()
print('\n✅ 完成!')
