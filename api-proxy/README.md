# 🔐 AI API 代理服务

保护 API 密钥不暴露给前端，通过后端代理调用 AI API。

## 功能

- ✅ API 密钥存储在服务器端，前端无法获取
- ✅ CORS 跨域支持
- ✅ 速率限制 (防止滥用)
- ✅ 来源白名单验证

## 部署步骤

### 1. 上传到服务器

```bash
scp -r api-proxy/ root@your-server:/var/www/lingma/
```

### 2. 配置环境变量 (可选)

```bash
export AI_API_KEY="your-api-key"
export AI_API_URL="https://api.aabao.top/v1/chat/completions"
export AI_MODEL="deepseek-v3.2-exp-thinking"
```

### 3. 使用 PM2 启动服务

```bash
cd /var/www/lingma/api-proxy
pm2 start server.js --name ai-proxy
pm2 save
```

### 4. 配置 Nginx 反向代理

在 nginx 配置中添加：

```nginx
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
```

### 5. 重启 Nginx

```bash
nginx -t && nginx -s reload
```

## 安全建议

1. **不要在 server.js 中硬编码密钥**，使用环境变量
2. 定期更换 API 密钥
3. 监控请求日志，检测异常
4. 根据需要调整速率限制
