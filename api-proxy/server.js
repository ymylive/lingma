// AI API 代理服务 - 保护API密钥不暴露给前端
const http = require('http');
const https = require('https');
const url = require('url');

// ========== 配置区域 ==========
const CONFIG = {
  // 服务端口
  PORT: 3001,
  
  // AI API 配置 (从环境变量读取，保护密钥安全)
  AI_API_KEY: process.env.AI_API_KEY || '',  // 必须在服务器设置环境变量
  AI_API_URL: process.env.AI_API_URL || '',
  AI_MODEL: process.env.AI_MODEL || '',
  
  // 允许的来源域名 (CORS)
  ALLOWED_ORIGINS: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://lingma.cornna.xyz',
    'http://lingma.cornna.xyz'
  ],
  
  // 速率限制 (每IP每分钟最大请求数)
  RATE_LIMIT: 30
};

// 速率限制存储
const rateLimitStore = new Map();

// 清理过期的速率限制记录
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (now - data.startTime > 60000) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

// 检查速率限制
function checkRateLimit(ip) {
  const now = Date.now();
  const data = rateLimitStore.get(ip);
  
  if (!data || now - data.startTime > 60000) {
    rateLimitStore.set(ip, { count: 1, startTime: now });
    return true;
  }
  
  if (data.count >= CONFIG.RATE_LIMIT) {
    return false;
  }
  
  data.count++;
  return true;
}

// 获取客户端IP
function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() || 
         req.headers['x-real-ip'] || 
         req.socket.remoteAddress || 
         'unknown';
}

// CORS 响应头
function setCorsHeaders(res, origin) {
  const allowedOrigin = CONFIG.ALLOWED_ORIGINS.includes(origin) ? origin : CONFIG.ALLOWED_ORIGINS[0];
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');
}

// 发送JSON响应
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// 调用AI API
async function callAIAPI(messages) {
  return new Promise((resolve, reject) => {
    const apiUrl = new url.URL(CONFIG.AI_API_URL);
    const isHttps = apiUrl.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const postData = JSON.stringify({
      model: CONFIG.AI_MODEL,
      messages: messages,
      temperature: 0.7
    });
    
    const options = {
      hostname: apiUrl.hostname,
      port: apiUrl.port || (isHttps ? 443 : 80),
      path: apiUrl.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.AI_API_KEY}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = client.request(options, (apiRes) => {
      let data = '';
      apiRes.on('data', chunk => data += chunk);
      apiRes.on('end', () => {
        try {
          resolve({ status: apiRes.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: apiRes.statusCode, data: { error: data } });
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(60000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.write(postData);
    req.end();
  });
}

// 创建服务器
const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin || '';
  setCorsHeaders(res, origin);
  
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  // 只允许POST到 /api/ai
  if (req.method !== 'POST' || req.url !== '/api/ai') {
    sendJson(res, 404, { error: 'Not found' });
    return;
  }
  
  // 检查来源
  if (origin && !CONFIG.ALLOWED_ORIGINS.includes(origin)) {
    sendJson(res, 403, { error: 'Forbidden origin' });
    return;
  }
  
  // 检查速率限制
  const clientIP = getClientIP(req);
  if (!checkRateLimit(clientIP)) {
    sendJson(res, 429, { error: '请求过于频繁，请稍后再试' });
    return;
  }
  
  // 读取请求体
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', async () => {
    try {
      const { messages } = JSON.parse(body);
      
      if (!messages || !Array.isArray(messages)) {
        sendJson(res, 400, { error: 'Invalid request: messages required' });
        return;
      }
      
      console.log(`[${new Date().toISOString()}] ${clientIP} - AI request`);
      
      const result = await callAIAPI(messages);
      sendJson(res, result.status, result.data);
      
    } catch (e) {
      console.error('Error:', e.message);
      sendJson(res, 500, { error: e.message });
    }
  });
});

server.listen(CONFIG.PORT, () => {
  console.log(`
🔐 AI API 代理服务已启动
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 地址: http://localhost:${CONFIG.PORT}
🔗 端点: POST /api/ai
🛡️  速率限制: ${CONFIG.RATE_LIMIT} 次/分钟
✅ 允许来源: ${CONFIG.ALLOWED_ORIGINS.join(', ')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
});
