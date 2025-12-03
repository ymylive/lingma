#!/bin/bash
set -e

# 重载nginx使域名配置生效
/www/server/nginx/sbin/nginx -s reload
echo "✅ Nginx配置已重载"

# 安装acme.sh（如果未安装）
if [ ! -f ~/.acme.sh/acme.sh ]; then
    echo "📦 安装acme.sh..."
    curl https://get.acme.sh | sh -s email=admin@cornna.xyz
fi

# 申请证书
echo "🔐 申请SSL证书..."
~/.acme.sh/acme.sh --issue -d lingma.cornna.xyz --webroot /var/www/lingma --force

# 安装证书到nginx目录
mkdir -p /www/server/panel/vhost/cert/lingma.cornna.xyz
~/.acme.sh/acme.sh --install-cert -d lingma.cornna.xyz \
    --key-file /www/server/panel/vhost/cert/lingma.cornna.xyz/privkey.pem \
    --fullchain-file /www/server/panel/vhost/cert/lingma.cornna.xyz/fullchain.pem \
    --reloadcmd "/www/server/nginx/sbin/nginx -s reload"

echo "✅ SSL证书已安装"

# 更新nginx配置支持HTTPS
cat > /www/server/panel/vhost/nginx/lingma.conf << 'EOF'
server {
    listen 80;
    server_name lingma.cornna.xyz;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name lingma.cornna.xyz;
    root /var/www/lingma;
    index index.html;
    
    ssl_certificate /www/server/panel/vhost/cert/lingma.cornna.xyz/fullchain.pem;
    ssl_certificate_key /www/server/panel/vhost/cert/lingma.cornna.xyz/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers on;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
}
EOF

# 重载nginx
/www/server/nginx/sbin/nginx -s reload
echo "✅ HTTPS配置完成！"
echo "🌐 访问: https://lingma.cornna.xyz"
