// AI API 代理服务 - 支持流式输出
const http = require('http');
const https = require('https');
const url = require('url');
const dns = require('dns').promises;
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

// ========== 配置区域 ==========
const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'https://lingma.cornna.xyz',
  'http://lingma.cornna.xyz',
  'http://8.134.33.19',
  'https://8.134.33.19',
  'http://8.134.33.19:8080',
  'https://8.134.33.19:8080'
];

const ENV_ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);
const LOOPBACK_ORIGIN_RE = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;

function normalizeAIUrl(rawUrl) {
  const trimmed = String(rawUrl || '').trim();
  if (!trimmed) return '';
  const parsed = new url.URL(trimmed);
  if (!/\/chat\/completions\/?$/.test(parsed.pathname)) {
    parsed.pathname = `${parsed.pathname.replace(/\/+$/, '')}/chat/completions`;
  }
  return parsed.toString();
}

const CONFIG = {
  PORT: 3001,
  AI_API_KEY: process.env.AI_API_KEY || '',
  AI_API_URL: normalizeAIUrl(
    process.env.AI_API_URL || process.env.AI_BASE_URL || 'https://api-inference.modelscope.cn/v1/chat/completions'
  ),
  AI_MODEL: process.env.AI_MODEL || 'openrouter/auto',
  AI_SITE_URL: process.env.AI_SITE_URL || 'http://127.0.0.1:5173',
  AI_SITE_NAME: process.env.AI_SITE_NAME || 'LingMa',
  ALLOWED_ORIGINS: Array.from(new Set([...DEFAULT_ALLOWED_ORIGINS, ...ENV_ALLOWED_ORIGINS])),
  RATE_LIMIT: 30,
  MINDMAP_DB_FILE: process.env.MINDMAP_DB_FILE || path.join(__dirname, 'data', 'mindmaps.db'),
  MINDMAP_LEGACY_FILE: process.env.MINDMAP_STORE_FILE || path.join(__dirname, 'data', 'mindmaps.json'),
  MINDMAP_MAX_MAPS_PER_USER: 200,
  ENABLE_REMOTE_MINDMAP_SYNC: ['1', 'true', 'yes', 'on'].includes(String(process.env.ENABLE_REMOTE_MINDMAP_SYNC || '').trim().toLowerCase())
};

const rateLimitStore = new Map();
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (now - data.startTime > 60000) rateLimitStore.delete(key);
  }
}, 60000);

function checkRateLimit(ip) {
  const now = Date.now();
  const data = rateLimitStore.get(ip);
  if (!data || now - data.startTime > 60000) {
    rateLimitStore.set(ip, { count: 1, startTime: now });
    return true;
  }
  if (data.count >= CONFIG.RATE_LIMIT) return false;
  data.count++;
  return true;
}

function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() || 
         req.headers['x-real-ip'] || req.socket.remoteAddress || 'unknown';
}

function setCorsHeaders(res, origin) {
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
}

function isOriginAllowed(origin) {
  if (!origin) return true;
  return CONFIG.ALLOWED_ORIGINS.includes(origin) || LOOPBACK_ORIGIN_RE.test(origin);
}

let mindMapDb = null;
let legacyMindMapMigrated = false;

function createServerId(prefix = 'mm') {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
}

function sanitizeUserId(userIdRaw) {
  const userId = String(userIdRaw || '').trim();
  if (!userId) {
    throw new Error('Invalid request: userId required');
  }
  if (userId.length > 128) {
    throw new Error('Invalid request: userId too long');
  }
  if (!/^[A-Za-z0-9._@:-]+$/.test(userId)) {
    throw new Error('Invalid request: userId format');
  }
  return userId;
}

function ensureRemoteMindMapSyncEnabled() {
  if (!CONFIG.ENABLE_REMOTE_MINDMAP_SYNC) {
    throw new Error('Remote mind map sync is disabled');
  }
}

function normalizeMindMapNode(node) {
  if (!node || typeof node !== 'object') {
    throw new Error('Invalid mind map node');
  }
  const title = typeof node.title === 'string' ? node.title.trim() : '';
  const note = typeof node.note === 'string' ? node.note : '';
  const children = Array.isArray(node.children) ? node.children.map(normalizeMindMapNode) : [];

  return {
    id: typeof node.id === 'string' && node.id.trim() ? node.id.trim() : createServerId('node'),
    title: title || 'Untitled Node',
    note: note.slice(0, 8000),
    collapsed: Boolean(node.collapsed),
    children,
  };
}

function normalizeMindMap(map) {
  if (!map || typeof map !== 'object') {
    throw new Error('Invalid mind map');
  }

  const sourceType = map.source?.type;
  const normalizedSourceType = ['topic', 'url', 'file'].includes(sourceType) ? sourceType : 'topic';
  const now = new Date().toISOString();

  return {
    id: typeof map.id === 'string' && map.id.trim() ? map.id.trim() : createServerId('map'),
    title: typeof map.title === 'string' && map.title.trim() ? map.title.trim() : 'Untitled Mind Map',
    source: {
      type: normalizedSourceType,
      value: typeof map.source?.value === 'string' ? map.source.value.slice(0, 80000) : '',
      title: typeof map.source?.title === 'string' ? map.source.title.slice(0, 512) : '',
    },
    nodes: Array.isArray(map.nodes) ? map.nodes.map(normalizeMindMapNode) : [],
    createdAt: typeof map.createdAt === 'string' && map.createdAt ? map.createdAt : now,
    updatedAt: typeof map.updatedAt === 'string' && map.updatedAt ? map.updatedAt : now,
  };
}

function normalizeMindMapsInput(maps) {
  if (!Array.isArray(maps)) {
    throw new Error('Invalid request: maps must be an array');
  }
  if (maps.length > CONFIG.MINDMAP_MAX_MAPS_PER_USER) {
    throw new Error(`Invalid request: too many maps (max ${CONFIG.MINDMAP_MAX_MAPS_PER_USER})`);
  }

  const normalized = maps.map(normalizeMindMap);
  const sizeInBytes = Buffer.byteLength(JSON.stringify(normalized));
  if (sizeInBytes > 3 * 1024 * 1024) {
    throw new Error('Invalid request: maps payload too large');
  }

  return normalized;
}

function parseLegacyMindMapStore(raw) {
  if (!raw || !raw.trim()) return { users: {} };

  const normalizedRaw = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
  const parsed = JSON.parse(normalizedRaw);
  if (!parsed || typeof parsed !== 'object' || !parsed.users || typeof parsed.users !== 'object') {
    return { users: {} };
  }
  return parsed;
}

function migrateLegacyMindMapStore(db) {
  if (legacyMindMapMigrated) return;
  legacyMindMapMigrated = true;

  const legacyFile = CONFIG.MINDMAP_LEGACY_FILE;
  if (!legacyFile || !fs.existsSync(legacyFile)) return;

  try {
    const raw = fs.readFileSync(legacyFile, 'utf8');
    const legacyStore = parseLegacyMindMapStore(raw);
    const users = Object.entries(legacyStore.users || {});
    if (!users.length) return;

    const upsertStmt = db.prepare(
      `INSERT INTO user_mindmaps (user_id, maps_json, updated_at)
       VALUES (?, ?, ?)
       ON CONFLICT(user_id) DO UPDATE SET
         maps_json = excluded.maps_json,
         updated_at = excluded.updated_at`
    );

    for (const [rawUserId, userRecord] of users) {
      try {
        if (!userRecord || typeof userRecord !== 'object' || !Array.isArray(userRecord.maps)) {
          continue;
        }

        const userId = sanitizeUserId(rawUserId);
        const maps = normalizeMindMapsInput(userRecord.maps);
        const updatedAt = typeof userRecord.updatedAt === 'string' && userRecord.updatedAt
          ? userRecord.updatedAt
          : new Date().toISOString();

        upsertStmt.run(userId, JSON.stringify(maps), updatedAt);
      } catch {
        // Skip malformed legacy records without failing startup.
      }
    }
  } catch (err) {
    console.error('Legacy mind map migration failed:', err?.message || err);
  }
}

function getMindMapDb() {
  if (mindMapDb) return mindMapDb;

  fs.mkdirSync(path.dirname(CONFIG.MINDMAP_DB_FILE), { recursive: true });
  const db = new DatabaseSync(CONFIG.MINDMAP_DB_FILE);

  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS user_mindmaps (
      user_id TEXT PRIMARY KEY,
      maps_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  migrateLegacyMindMapStore(db);
  mindMapDb = db;
  return mindMapDb;
}

async function loadMindMapsByUserId(userIdRaw) {
  const userId = sanitizeUserId(userIdRaw);
  const db = getMindMapDb();

  const row = db.prepare('SELECT maps_json, updated_at FROM user_mindmaps WHERE user_id = ?').get(userId);
  if (!row || typeof row.maps_json !== 'string') {
    return { maps: [], updatedAt: null };
  }

  const parsedMaps = JSON.parse(row.maps_json);
  const maps = normalizeMindMapsInput(parsedMaps);
  return {
    maps,
    updatedAt: typeof row.updated_at === 'string' ? row.updated_at : null,
  };
}

async function saveMindMapsByUserId(userIdRaw, mapsRaw) {
  const userId = sanitizeUserId(userIdRaw);
  const normalizedMaps = normalizeMindMapsInput(mapsRaw);
  const updatedAt = new Date().toISOString();
  const db = getMindMapDb();

  db.prepare(
    `INSERT INTO user_mindmaps (user_id, maps_json, updated_at)
     VALUES (?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       maps_json = excluded.maps_json,
       updated_at = excluded.updated_at`
  ).run(userId, JSON.stringify(normalizedMaps), updatedAt);

  return { maps: normalizedMaps, updatedAt };
}

function isPrivateIp(ip) {
  if (!ip) return true;
  if (ip === '::1' || ip === '127.0.0.1') return true;
  if (ip.startsWith('10.')) return true;
  if (ip.startsWith('192.168.')) return true;
  if (ip.startsWith('169.254.')) return true;
  if (ip.startsWith('0.')) return true;
  if (ip.startsWith('fe80:') || ip.startsWith('fc') || ip.startsWith('fd')) return true;
  const match = ip.match(/^172\.(\d+)\./);
  if (match) {
    const seg = Number(match[1]);
    if (seg >= 16 && seg <= 31) return true;
  }
  return false;
}

async function assertPublicUrl(targetUrl) {
  let parsed;
  try {
    parsed = new url.URL(targetUrl);
  } catch {
    throw new Error('URL 无效');
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('仅支持 http/https URL');
  }
  const hostname = parsed.hostname.toLowerCase();
  if (hostname === 'localhost' || hostname.endsWith('.local')) {
    throw new Error('禁止访问本地域名');
  }
  try {
    const lookup = await dns.lookup(hostname);
    if (isPrivateIp(lookup.address)) {
      throw new Error('禁止访问内网地址');
    }
  } catch (e) {
    throw new Error('DNS lookup failed');
  }
  return parsed;
}

function decodeHtmlEntities(text) {
  return text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(Number(num)));
}

function htmlToText(html) {
  const noScript = html.replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ');
  const withBreaks = noScript
    .replace(/<\/(p|div|li|h\d|br)>/gi, '\n')
    .replace(/<li>/gi, '- ');
  const text = withBreaks.replace(/<[^>]+>/g, ' ');
  return decodeHtmlEntities(text).replace(/\s+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

function decompressBody(buffer, encoding) {
  if (!encoding) return buffer;
  const enc = encoding.toLowerCase();
  try {
    if (enc.includes('gzip')) return zlib.gunzipSync(buffer);
    if (enc.includes('deflate')) return zlib.inflateSync(buffer);
    if (enc.includes('br') && zlib.brotliDecompressSync) return zlib.brotliDecompressSync(buffer);
  } catch {}
  return buffer;
}

async function fetchUrlText(targetUrl, maxLength = 16000, redirectCount = 0) {
  const parsed = await assertPublicUrl(targetUrl);
  const isHttps = parsed.protocol === 'https:';
  const client = isHttps ? https : http;

  return new Promise((resolve, reject) => {
    const options = {
      hostname: parsed.hostname,
      port: parsed.port || (isHttps ? 443 : 80),
      path: `${parsed.pathname}${parsed.search || ''}`,
      method: 'GET',
      headers: {
        'User-Agent': 'LingMaMindMapBot/1.0',
        'Accept': 'text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.8',
      },
    };

    const req = client.request(options, (res) => {
      const status = res.statusCode || 0;
      if ([301, 302, 303, 307, 308].includes(status) && res.headers.location && redirectCount < 3) {
        const nextUrl = new url.URL(res.headers.location, targetUrl).toString();
        fetchUrlText(nextUrl, maxLength, redirectCount + 1).then(resolve).catch(reject);
        return;
      }

      const chunks = [];
      let size = 0;
      res.on('data', (chunk) => {
        size += chunk.length;
        if (size > 2 * 1024 * 1024) {
          req.destroy();
          reject(new Error('内容过大，已终止抓取'));
          return;
        }
        chunks.push(chunk);
      });
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const encoding = res.headers['content-encoding'] || '';
        const decoded = decompressBody(buffer, encoding);
        const raw = decoded.toString('utf-8');
        const contentType = (res.headers['content-type'] || '').toLowerCase();
        let text = raw;
        let title = parsed.hostname;

        if (contentType.includes('text/html') || raw.includes('<html')) {
          const titleMatch = raw.match(/<title[^>]*>([^<]*)<\/title>/i);
          if (titleMatch) title = decodeHtmlEntities(titleMatch[1]).trim();
          text = htmlToText(raw);
        } else if (contentType.includes('application/json')) {
          text = raw;
        } else {
          text = raw;
        }

        const normalized = text.replace(/\s+/g, ' ').trim();
        resolve({
          url: targetUrl,
          title,
          text: normalized.slice(0, maxLength),
          length: normalized.length,
        });
      });
    });

    req.on('error', (err) => reject(err));
    req.setTimeout(20000, () => {
      req.destroy();
      reject(new Error('抓取超时'));
    });
    req.end();
  });
}

function buildAIRequestHeaders(contentLength) {
  const headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(contentLength),
  };
  if (CONFIG.AI_API_KEY) {
    headers.Authorization = `Bearer ${CONFIG.AI_API_KEY}`;
  }
  if (CONFIG.AI_SITE_URL) {
    headers['HTTP-Referer'] = CONFIG.AI_SITE_URL;
  }
  if (CONFIG.AI_SITE_NAME) {
    headers['X-Title'] = CONFIG.AI_SITE_NAME;
  }
  return headers;
}

  // Routes: /api/ai, /api/ai/stream, /api/doc
function callAIAPIStream(messages, res) {
  const apiUrl = new url.URL(CONFIG.AI_API_URL);
  const isHttps = apiUrl.protocol === 'https:';
  const client = isHttps ? https : http;
  
  const postData = JSON.stringify({
    model: CONFIG.AI_MODEL,
    messages: messages,
    max_tokens: 8192,
    temperature: 0.7,
    stream: true  // 启用流式输出
  });
  
  const options = {
    hostname: apiUrl.hostname,
    port: apiUrl.port || (isHttps ? 443 : 80),
    path: `${apiUrl.pathname}${apiUrl.search || ''}`,
    method: 'POST',
    headers: buildAIRequestHeaders(postData),
  };
  
  // 设置SSE响应头
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  
  const req = client.request(options, (apiRes) => {
    apiRes.on('data', chunk => {
      // 直接转发流数据到客户端
      res.write(chunk);
    });
    
    apiRes.on('end', () => {
      res.end();
    });
    
    apiRes.on('error', (err) => {
      console.error('API stream error:', err);
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
      res.end();
    });
  });
  
  req.on('error', (err) => {
    console.error('Request error:', err);
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  });
  
  req.setTimeout(300000, () => {
    req.destroy();
    res.write(`data: ${JSON.stringify({ error: 'Request timeout' })}\n\n`);
    res.end();
  });
  
  req.write(postData);
  req.end();
}

// 非流式调用（保留兼容）
async function callAIAPI(messages) {
  return new Promise((resolve, reject) => {
    const apiUrl = new url.URL(CONFIG.AI_API_URL);
    const isHttps = apiUrl.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const postData = JSON.stringify({
      model: CONFIG.AI_MODEL,
      messages: messages,
      max_tokens: 8192,
      temperature: 0.7
    });
    
    const options = {
      hostname: apiUrl.hostname,
      port: apiUrl.port || (isHttps ? 443 : 80),
      path: `${apiUrl.pathname}${apiUrl.search || ''}`,
      method: 'POST',
      headers: buildAIRequestHeaders(postData),
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
    req.setTimeout(300000, () => {
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

  if (!isOriginAllowed(origin)) {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Forbidden origin' }));
    return;
  }

  setCorsHeaders(res, origin);
  
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Routes: /api/ai, /api/ai/stream, /api/doc, /api/mindmaps/load, /api/mindmaps/save
  const pathname = (req.url || '').split('?')[0];
  const isStream = pathname === '/api/ai/stream';
  const isAI = pathname === '/api/ai' || isStream;
  const isDoc = pathname === '/api/doc';
  const isMindMapLoad = pathname === '/api/mindmaps/load';
  const isMindMapSave = pathname === '/api/mindmaps/save';
  const isMindMap = isMindMapLoad || isMindMapSave;

  if (req.method !== 'POST' || (!isAI && !isDoc && !isMindMap)) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }
  
  const clientIP = getClientIP(req);
  if (!checkRateLimit(clientIP)) {
    res.writeHead(429, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: '请求过于频繁，请稍后再试' }));
    return;
  }
  
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', async () => {
    try {
      const payload = body ? JSON.parse(body) : {};

      if (isDoc) {
        const targetUrl = payload.url;
        const maxLength = Number(payload.maxLength) || 16000;
        if (!targetUrl) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid request: url required' }));
          return;
        }
        const result = await fetchUrlText(targetUrl, Math.min(Math.max(maxLength, 1000), 30000));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
        return;
      }

      if (isMindMap) {
        ensureRemoteMindMapSyncEnabled();
        const userId = payload.userId;

        if (isMindMapLoad) {
          const result = await loadMindMapsByUserId(userId);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
          return;
        }

        const result = await saveMindMapsByUserId(userId, payload.maps);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
        return;
      }

      const { messages } = payload;

      if (!messages || !Array.isArray(messages)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request: messages required' }));
        return;
      }

      if (!CONFIG.AI_API_KEY) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'AI_API_KEY is not configured' }));
        return;
      }

      console.log(`[${new Date().toISOString()}] ${clientIP} - AI ${isStream ? 'stream' : 'normal'} request`);
      
      if (isStream) {
        callAIAPIStream(messages, res);
      } else {
        const result = await callAIAPI(messages);
        res.writeHead(result.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result.data));
      }
      
    } catch (e) {
      console.error('Error:', e.message);
      const statusCode = /timeout/i.test(String(e.message || '')) ? 504 : 500;
      res.writeHead(statusCode, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
  });
});

server.listen(CONFIG.PORT, () => {
  console.log(`
AI proxy server started
----------------------------------------
Address: http://localhost:${CONFIG.PORT}
POST /api/ai
POST /api/ai/stream
POST /api/doc
POST /api/mindmaps/load
POST /api/mindmaps/save
Mind map DB: ${CONFIG.MINDMAP_DB_FILE}
Rate limit: ${CONFIG.RATE_LIMIT} req/min per IP
----------------------------------------
  `);
});
