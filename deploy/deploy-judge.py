#!/usr/bin/env python3
"""部署判题服务到服务器"""
import paramiko

HOST = '8.134.33.19'
USER = 'root'
PASSWORD = 'Qq159741'

# 合并的服务代码 - 同时支持AI代理和判题
COMBINED_SERVER = r'''
const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');
const http = require('http');
const url = require('url');

const app = express();
const PORT = 3001;
const TEMP_DIR = '/tmp/judge';
const TIMEOUT = 5000;
const MAX_OUTPUT = 10000;

// AI配置
const AI_CONFIG = {
  API_KEY: process.env.AI_API_KEY || 'sk-9vJdSQ3WTnQWwW02wJBoGepCZDE3QO5mLi2dIplmBxXxhgIg',
  API_URL: process.env.AI_API_URL || 'https://api.aabao.top/v1/chat/completions',
  MODEL: process.env.AI_MODEL || 'deepseek-v3.2-thinking'
};

// 确保临时目录存在
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// 语言配置 - 使用printf正确处理转义字符
const LANG_CONFIG = {
  c: {
    ext: '.c',
    compile: (file, out) => `gcc "${file}" -o "${out}" -lm 2>&1`,
    run: (out, input, _, inputFile) => `timeout ${TIMEOUT/1000}s "${out}" < "${inputFile}"`,
    needCompile: true
  },
  cpp: {
    ext: '.cpp',
    compile: (file, out) => `g++ "${file}" -o "${out}" -std=c++17 2>&1`,
    run: (out, input, _, inputFile) => `timeout ${TIMEOUT/1000}s "${out}" < "${inputFile}"`,
    needCompile: true
  },
  java: {
    ext: '.java',
    compile: (file, dir) => `javac "${file}" -d "${dir}" 2>&1`,
    run: (dir, input, className, inputFile) => `timeout ${TIMEOUT/1000}s java -cp "${dir}" ${className} < "${inputFile}"`,
    needCompile: true
  },
  python: {
    ext: '.py',
    run: (file, input, _, inputFile) => `timeout ${TIMEOUT/1000}s python3 "${file}" < "${inputFile}"`,
    needCompile: false
  }
};

// 规范化输出用于比较（忽略行尾空白和空行差异）
function normalizeOutput(str) {
  return str.split('\\n').map(line => line.trimEnd()).join('\\n').trim();
}

function cleanup(dir) {
  try {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  } catch (e) {
    console.error('Cleanup error:', e);
  }
}

function execCommand(cmd, timeout = TIMEOUT) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    exec(cmd, { timeout, maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
      const time = Date.now() - startTime;
      if (error) {
        if (error.killed) {
          resolve({ success: false, error: '运行超时', time });
        } else {
          resolve({ success: false, error: stderr || error.message, time });
        }
      } else {
        resolve({ success: true, output: stdout, time });
      }
    });
  });
}

function extractJavaClassName(code) {
  const match = code.match(/public\s+class\s+(\w+)/);
  return match ? match[1] : 'Main';
}

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', languages: Object.keys(LANG_CONFIG) });
});

// 判题接口
app.post('/api/judge', async (req, res) => {
  const { code, language, testCases } = req.body;
  
  if (!code || !language || !testCases) {
    return res.status(400).json({ error: '缺少必要参数' });
  }
  
  const config = LANG_CONFIG[language];
  if (!config) {
    return res.status(400).json({ error: '不支持的语言' });
  }
  
  const jobId = crypto.randomUUID();
  const workDir = path.join(TEMP_DIR, jobId);
  fs.mkdirSync(workDir, { recursive: true });
  
  try {
    let executablePath;
    let className;
    
    if (language === 'java') {
      className = extractJavaClassName(code);
      const sourceFile = path.join(workDir, `${className}.java`);
      fs.writeFileSync(sourceFile, code);
      
      const compileCmd = config.compile(sourceFile, workDir);
      const compileResult = await execCommand(compileCmd, 30000);
      if (!compileResult.success) {
        cleanup(workDir);
        return res.json({
          success: false,
          results: [{ passed: false, error: `编译错误: ${compileResult.error}`, status: '编译错误' }]
        });
      }
      executablePath = workDir;
    } else {
      const sourceFile = path.join(workDir, `main${config.ext}`);
      fs.writeFileSync(sourceFile, code);
      
      if (config.needCompile) {
        const execFile = path.join(workDir, 'main');
        const compileCmd = config.compile(sourceFile, execFile);
        const compileResult = await execCommand(compileCmd, 30000);
        if (!compileResult.success) {
          cleanup(workDir);
          return res.json({
            success: false,
            results: [{ passed: false, error: `编译错误: ${compileResult.error}`, status: '编译错误' }]
          });
        }
        executablePath = execFile;
      } else {
        executablePath = sourceFile;
      }
    }
    
    const results = [];
    let tcIndex = 0;
    for (const tc of testCases) {
      const input = tc.input || '';
      const expected = (tc.expectedOutput || '').trim();
      
      // 创建输入文件
      const inputFile = path.join(workDir, `input_${tcIndex++}.txt`);
      fs.writeFileSync(inputFile, input);
      
      let runCmd;
      if (language === 'java') {
        runCmd = config.run(executablePath, input, className, inputFile);
      } else {
        runCmd = config.run(executablePath, input, null, inputFile);
      }
      
      const runResult = await execCommand(runCmd, TIMEOUT);
      
      if (!runResult.success) {
        results.push({
          passed: false,
          input,
          expectedOutput: expected,
          actualOutput: '',
          error: runResult.error,
          time: runResult.time,
          status: '运行错误'
        });
      } else {
        const actualRaw = (runResult.output || '').trim().substring(0, MAX_OUTPUT);
        const actual = normalizeOutput(actualRaw);
        const expectedNorm = normalizeOutput(expected);
        const passed = actual === expectedNorm;
        results.push({
          passed,
          input,
          expectedOutput: expected,
          actualOutput: actualRaw,
          time: runResult.time,
          status: passed ? '通过' : '答案错误'
        });
      }
    }
    
    cleanup(workDir);
    res.json({
      success: true,
      results,
      allPassed: results.every(r => r.passed)
    });
    
  } catch (error) {
    cleanup(workDir);
    res.status(500).json({ error: error.message });
  }
});

// 快速运行接口
app.post('/api/run', async (req, res) => {
  const { code, language, input = '' } = req.body;
  
  if (!code || !language) {
    return res.status(400).json({ error: '缺少必要参数' });
  }
  
  const config = LANG_CONFIG[language];
  if (!config) {
    return res.status(400).json({ error: '不支持的语言' });
  }
  
  const jobId = crypto.randomUUID();
  const workDir = path.join(TEMP_DIR, jobId);
  fs.mkdirSync(workDir, { recursive: true });
  
  try {
    let executablePath;
    let className;
    
    if (language === 'java') {
      className = extractJavaClassName(code);
      const sourceFile = path.join(workDir, `${className}.java`);
      fs.writeFileSync(sourceFile, code);
      
      const compileCmd = config.compile(sourceFile, workDir);
      const compileResult = await execCommand(compileCmd, 30000);
      if (!compileResult.success) {
        cleanup(workDir);
        return res.json({ success: false, error: `编译错误:\\n${compileResult.error}` });
      }
      executablePath = workDir;
    } else {
      const sourceFile = path.join(workDir, `main${config.ext}`);
      fs.writeFileSync(sourceFile, code);
      
      if (config.needCompile) {
        const execFile = path.join(workDir, 'main');
        const compileCmd = config.compile(sourceFile, execFile);
        const compileResult = await execCommand(compileCmd, 30000);
        if (!compileResult.success) {
          cleanup(workDir);
          return res.json({ success: false, error: `编译错误:\\n${compileResult.error}` });
        }
        executablePath = execFile;
      } else {
        executablePath = sourceFile;
      }
    }
    
    // 创建输入文件
    const inputFile = path.join(workDir, 'input.txt');
    fs.writeFileSync(inputFile, input);
    
    let runCmd;
    if (language === 'java') {
      runCmd = config.run(executablePath, input, className, inputFile);
    } else {
      runCmd = config.run(executablePath, input, null, inputFile);
    }
    
    const runResult = await execCommand(runCmd, TIMEOUT);
    cleanup(workDir);
    
    if (!runResult.success) {
      return res.json({ success: false, error: runResult.error, time: runResult.time });
    }
    
    res.json({
      success: true,
      output: (runResult.output || '').substring(0, MAX_OUTPUT),
      time: runResult.time
    });
    
  } catch (error) {
    cleanup(workDir);
    res.status(500).json({ error: error.message });
  }
});

// AI代理接口
app.post('/api/ai', async (req, res) => {
  const { messages } = req.body;
  
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request: messages required' });
  }
  
  try {
    const apiUrl = new url.URL(AI_CONFIG.API_URL);
    const isHttps = apiUrl.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const postData = JSON.stringify({
      model: AI_CONFIG.MODEL,
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
        'Authorization': `Bearer ${AI_CONFIG.API_KEY}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const apiReq = client.request(options, (apiRes) => {
      let data = '';
      apiRes.on('data', chunk => data += chunk);
      apiRes.on('end', () => {
        try {
          res.status(apiRes.statusCode).json(JSON.parse(data));
        } catch (e) {
          res.status(apiRes.statusCode).json({ error: data });
        }
      });
    });
    
    apiReq.on('error', (e) => {
      res.status(500).json({ error: e.message });
    });
    
    apiReq.setTimeout(300000, () => {  // 5分钟超时
      apiReq.destroy();
      res.status(504).json({ error: 'AI API timeout' });
    });
    
    apiReq.write(postData);
    apiReq.end();
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`
🚀 灵码后端服务已启动
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 地址: http://localhost:${PORT}
🔗 判题: POST /api/judge
🔗 运行: POST /api/run  
🔗 AI:   POST /api/ai
🔗 健康: GET  /api/health
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
});
'''

print("🔗 连接服务器...")
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASSWORD)

print("📦 停止现有服务...")
ssh.exec_command('pm2 stop ai-proxy 2>/dev/null || true')
ssh.exec_command('systemctl stop ai-proxy 2>/dev/null || true')
ssh.exec_command('pkill -9 -f "node.*server.js" 2>/dev/null || true')

import time
time.sleep(2)

print("📝 上传新的服务代码...")
sftp = ssh.open_sftp()

# 写入新的server.js
with sftp.file('/var/www/lingma/api-proxy/server.js', 'w') as f:
    f.write(COMBINED_SERVER)

sftp.close()

print("📦 安装依赖...")
stdin, stdout, stderr = ssh.exec_command('cd /var/www/lingma/api-proxy && npm install express cors 2>&1')
print(stdout.read().decode())

print("🚀 启动服务...")
stdin, stdout, stderr = ssh.exec_command('cd /var/www/lingma/api-proxy && pm2 delete ai-proxy 2>/dev/null; pm2 start server.js --name ai-proxy')
print(stdout.read().decode())

time.sleep(3)

print("✅ 测试服务...")
stdin, stdout, stderr = ssh.exec_command('curl -s http://localhost:3001/api/health')
result = stdout.read().decode()
print(f"Health: {result}")

stdin, stdout, stderr = ssh.exec_command('pm2 list')
print(stdout.read().decode())

ssh.close()
print("✅ 部署完成!")
