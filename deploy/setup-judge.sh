#!/bin/bash
set -e

echo "🔧 安装判题系统依赖..."

# 安装Node.js (如果未安装)
if ! command -v node &> /dev/null; then
    echo "📦 安装Node.js..."
    curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
    yum install -y nodejs
fi

# 安装GCC (如果未安装)
if ! command -v gcc &> /dev/null; then
    echo "📦 安装GCC..."
    yum install -y gcc
fi

# 安装Python3 (如果未安装)
if ! command -v python3 &> /dev/null; then
    echo "📦 安装Python3..."
    yum install -y python3
fi

# 安装Java (如果未安装)
if ! command -v java &> /dev/null; then
    echo "📦 安装Java..."
    yum install -y java-11-openjdk java-11-openjdk-devel
fi

echo "✅ 编译器安装完成"
echo "  - GCC: $(gcc --version | head -1)"
echo "  - Python: $(python3 --version)"
echo "  - Java: $(java -version 2>&1 | head -1)"
echo "  - Node.js: $(node --version)"

# 创建判题服务目录
mkdir -p /var/www/judge-server
cd /var/www/judge-server

# 安装npm依赖
echo "📦 安装Node.js依赖..."
npm install

# 创建systemd服务
cat > /etc/systemd/system/lingma-judge.service << 'EOF'
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
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# 启动服务
systemctl daemon-reload
systemctl enable lingma-judge
systemctl restart lingma-judge

echo "✅ 判题服务已启动"
systemctl status lingma-judge --no-pager

# 配置Nginx反向代理
cat > /www/server/panel/vhost/nginx/judge-api.conf << 'EOF'
server {
    listen 443 ssl;
    server_name lingma.cornna.xyz;
    
    ssl_certificate /www/server/panel/vhost/cert/lingma.cornna.xyz/fullchain.pem;
    ssl_certificate_key /www/server/panel/vhost/cert/lingma.cornna.xyz/privkey.pem;
    
    # 判题API
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
    }
    
    # 静态文件
    location / {
        root /var/www/lingma;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
}

server {
    listen 80;
    server_name lingma.cornna.xyz;
    return 301 https://$host$request_uri;
}
EOF

# 删除旧配置
rm -f /www/server/panel/vhost/nginx/lingma.conf

# 重载Nginx
/www/server/nginx/sbin/nginx -s reload

echo ""
echo "🎉 判题系统部署完成！"
echo "📡 API地址: https://lingma.cornna.xyz/api/"
echo "🔍 健康检查: https://lingma.cornna.xyz/api/health"
