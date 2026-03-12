const express = require('express');
const cors = require('cors');
const { exec, execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3002;  // 判题服务使用3002端口
const TEMP_DIR = '/tmp/judge';
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
  .map((origin) => origin.trim())
  .filter(Boolean);
const LOOPBACK_ORIGIN_RE = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;
const MAX_CONCURRENT_JOBS = Math.max(1, Number(process.env.JUDGE_MAX_CONCURRENT_JOBS || 2));
let activeJobs = 0;
const TIMEOUT = 5000; // 5秒超时
const MAX_OUTPUT = 65536; // 64KB最大输出

// 确保临时目录存在
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

app.use(cors({
  origin(origin, callback) {
    if (isOriginAllowed(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Forbidden origin'));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '1mb' }));

function isOriginAllowed(origin) {
  if (!origin) return true;
  return DEFAULT_ALLOWED_ORIGINS.includes(origin) || ENV_ALLOWED_ORIGINS.includes(origin) || LOOPBACK_ORIGIN_RE.test(origin);
}

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!isOriginAllowed(origin)) {
    return res.status(403).json({ error: 'Forbidden origin' });
  }
  return next();
});

function tryAcquireJobSlot() {
  if (activeJobs >= MAX_CONCURRENT_JOBS) {
    return false;
  }
  activeJobs += 1;
  return true;
}

function releaseJobSlot() {
  activeJobs = Math.max(0, activeJobs - 1);
}

// ACM/OJ标准语言配置
const LANG_CONFIG = {
  c: {
    ext: '.c',
    compile: (file, out) => `gcc "${file}" -o "${out}" -O2 -lm -std=c11 -DONLINE_JUDGE 2>&1`,
    run: (out) => out,
    needCompile: true
  },
  cpp: {
    ext: '.cpp',
    compile: (file, out) => `g++ "${file}" -o "${out}" -O2 -std=c++17 -DONLINE_JUDGE 2>&1`,
    run: (out) => out,
    needCompile: true
  },
  java: {
    ext: '.java',
    compile: (file, dir) => `javac "${file}" -d "${dir}" 2>&1`,
    run: (dir, className) => `java -cp "${dir}" -Xmx256m ${className}`,
    needCompile: true
  },
  python: {
    ext: '.py',
    run: (file) => `python3 -u "${file}"`,
    needCompile: false
  }
};

// 清理临时文件
function cleanup(dir) {
  try {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  } catch (e) {
    console.error('Cleanup error:', e);
  }
}

// 从Java代码中提取类名
function extractJavaClassName(code) {
  const match = code.match(/public\s+class\s+(\w+)/);
  return match ? match[1] : 'Main';
}

// ACM/OJ标准输出比较（忽略行尾空格和文件末尾空行）
function compareOutput(expected, actual) {
  // 标准化：按行分割，去除每行末尾空格，去除末尾空行
  const normalize = (str) => {
    return str
      .split('\n')
      .map(line => line.trimEnd())  // 去除行尾空格
      .join('\n')
      .trimEnd();  // 去除末尾空行
  };
  
  return normalize(expected) === normalize(actual);
}

// 使用spawn运行程序（支持stdin输入）
function runProgram(cmd, args, input, timeout) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    let stdout = '';
    let stderr = '';
    let killed = false;
    
    const proc = spawn(cmd, args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: timeout
    });
    
    // 设置超时
    const timer = setTimeout(() => {
      killed = true;
      proc.kill('SIGKILL');
    }, timeout);
    
    proc.stdout.on('data', (data) => {
      stdout += data.toString();
      if (stdout.length > MAX_OUTPUT) {
        killed = true;
        proc.kill('SIGKILL');
      }
    });
    
    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    proc.on('close', (code) => {
      clearTimeout(timer);
      const time = Date.now() - startTime;
      
      if (killed && stdout.length > MAX_OUTPUT) {
        resolve({ success: false, error: '输出超限 (Output Limit Exceeded)', time, status: 'OLE' });
      } else if (killed) {
        resolve({ success: false, error: '运行超时 (Time Limit Exceeded)', time, status: 'TLE' });
      } else if (code !== 0) {
        resolve({ success: false, error: stderr || `运行错误 (Runtime Error, exit code: ${code})`, time, status: 'RE' });
      } else {
        resolve({ success: true, output: stdout, time });
      }
    });
    
    proc.on('error', (err) => {
      clearTimeout(timer);
      resolve({ success: false, error: err.message, time: Date.now() - startTime, status: 'RE' });
    });
    
    // 写入输入
    if (input) {
      proc.stdin.write(input);
    }
    proc.stdin.end();
  });
}

// 编译代码
async function compileCode(language, code, workDir) {
  const config = LANG_CONFIG[language];
  let className = 'Main';
  let sourceFile, executablePath;
  
  if (language === 'java') {
    className = extractJavaClassName(code);
    sourceFile = path.join(workDir, `${className}.java`);
    fs.writeFileSync(sourceFile, code);
    executablePath = workDir;
  } else {
    sourceFile = path.join(workDir, `main${config.ext}`);
    fs.writeFileSync(sourceFile, code);
    executablePath = path.join(workDir, 'main');
  }
  
  if (config.needCompile) {
    const compileCmd = language === 'java' 
      ? config.compile(sourceFile, workDir)
      : config.compile(sourceFile, executablePath);
    
    try {
      execSync(compileCmd, { timeout: 30000, maxBuffer: 1024 * 1024 });
      return { success: true, executablePath, className, sourceFile };
    } catch (e) {
      return { success: false, error: e.stderr?.toString() || e.message, status: 'CE' };
    }
  }
  
  return { success: true, executablePath: sourceFile, className, sourceFile };
}


// 判题接口 - ACM/OJ标准
app.post('/api/judge', async (req, res) => {
  const { code, language, testCases } = req.body;
  let jobAcquired = false;
  
  if (!code || !language || !testCases) {
    return res.status(400).json({ error: '缺少必要参数' });
  }
  
  const config = LANG_CONFIG[language];
  if (!config) {
    return res.status(400).json({ error: '不支持的语言' });
  }
  
  if (!tryAcquireJobSlot()) {
    return res.status(429).json({ error: 'Judge server is busy, please retry later' });
  }
  jobAcquired = true;

  const jobId = uuidv4();
  const workDir = path.join(TEMP_DIR, jobId);
  fs.mkdirSync(workDir, { recursive: true });
  
  try {
    // 编译
    const compileResult = await compileCode(language, code, workDir);
    if (!compileResult.success) {
      cleanup(workDir);
      return res.json({
        success: false,
        results: [{
          passed: false,
          error: `编译错误 (Compilation Error):\n${compileResult.error}`,
          status: 'CE'
        }]
      });
    }
    
    const { executablePath, className } = compileResult;
    
    // 运行测试用例
    const results = [];
    let allPassed = true;
    
    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const input = tc.input || '';
      const expected = tc.expectedOutput || '';
      
      // 构建运行命令
      let cmd, args;
      if (language === 'java') {
        cmd = 'java';
        args = ['-cp', executablePath, '-Xmx256m', className];
      } else if (language === 'python') {
        cmd = 'python3';
        args = ['-u', executablePath];
      } else {
        cmd = executablePath;
        args = [];
      }
      
      const runResult = await runProgram(cmd, args, input, TIMEOUT);
      
      if (!runResult.success) {
        allPassed = false;
        results.push({
          passed: false,
          testCase: i + 1,
          input: input.length > 200 ? input.substring(0, 200) + '...' : input,
          expectedOutput: expected.length > 200 ? expected.substring(0, 200) + '...' : expected,
          actualOutput: '',
          error: runResult.error,
          time: runResult.time,
          status: runResult.status
        });
      } else {
        const actual = runResult.output;
        const passed = compareOutput(expected, actual);
        
        if (!passed) allPassed = false;
        
        results.push({
          passed,
          testCase: i + 1,
          input: input.length > 200 ? input.substring(0, 200) + '...' : input,
          expectedOutput: expected.length > 200 ? expected.substring(0, 200) + '...' : expected,
          actualOutput: actual.length > 200 ? actual.substring(0, 200) + '...' : actual,
          time: runResult.time,
          status: passed ? 'AC' : 'WA'  // Accepted / Wrong Answer
        });
      }
    }
    
    cleanup(workDir);
    
    // ACM/OJ标准结果格式
    const passedCount = results.filter(r => r.passed).length;
    res.json({
      success: true,
      results,
      allPassed,
      summary: {
        total: testCases.length,
        passed: passedCount,
        failed: testCases.length - passedCount,
        verdict: allPassed ? 'Accepted' : results.find(r => !r.passed)?.status || 'WA'
      }
    });
    
  } catch (error) {
    cleanup(workDir);
    res.status(500).json({ error: error.message });
  } finally {
    if (jobAcquired) {
      releaseJobSlot();
    }
  }
});

// 快速运行接口
app.post('/api/run', async (req, res) => {
  const { code, language, input = '' } = req.body;
  let jobAcquired = false;
  
  if (!code || !language) {
    return res.status(400).json({ error: '缺少必要参数' });
  }
  
  const config = LANG_CONFIG[language];
  if (!config) {
    return res.status(400).json({ error: '不支持的语言' });
  }
  
  if (!tryAcquireJobSlot()) {
    return res.status(429).json({ error: 'Judge server is busy, please retry later' });
  }
  jobAcquired = true;

  const jobId = uuidv4();
  const workDir = path.join(TEMP_DIR, jobId);
  fs.mkdirSync(workDir, { recursive: true });
  
  try {
    // 编译
    const compileResult = await compileCode(language, code, workDir);
    if (!compileResult.success) {
      cleanup(workDir);
      return res.json({
        success: false,
        error: `编译错误 (Compilation Error):\n${compileResult.error}`
      });
    }
    
    const { executablePath, className } = compileResult;
    
    // 运行
    let cmd, args;
    if (language === 'java') {
      cmd = 'java';
      args = ['-cp', executablePath, '-Xmx256m', className];
    } else if (language === 'python') {
      cmd = 'python3';
      args = ['-u', executablePath];
    } else {
      cmd = executablePath;
      args = [];
    }
    
    const runResult = await runProgram(cmd, args, input, TIMEOUT);
    cleanup(workDir);
    
    if (!runResult.success) {
      return res.json({
        success: false,
        error: runResult.error,
        time: runResult.time,
        status: runResult.status
      });
    }
    
    res.json({
      success: true,
      output: runResult.output.substring(0, MAX_OUTPUT),
      time: runResult.time
    });
    
  } catch (error) {
    cleanup(workDir);
    res.status(500).json({ error: error.message });
  } finally {
    if (jobAcquired) {
      releaseJobSlot();
    }
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    languages: Object.keys(LANG_CONFIG),
    version: '2.0',
    features: ['ACM/OJ标准判题', '流式输出比较', '多语言支持'],
    concurrency: {
      activeJobs,
      maxConcurrentJobs: MAX_CONCURRENT_JOBS
    }
  });
});

app.listen(PORT, () => {
  console.log(`
🚀 灵码判题服务 v2.0 (ACM/OJ标准)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 地址: http://localhost:${PORT}
🔗 判题: POST /api/judge
🔗 运行: POST /api/run
🔗 健康: GET  /api/health
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
});
