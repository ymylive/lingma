const express = require('express');
const cors = require('cors');
const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;
const TEMP_DIR = '/tmp/judge';
const TIMEOUT = 5000; // 5秒超时
const MAX_OUTPUT = 10000; // 最大输出字符数

// 确保临时目录存在
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// 语言配置
const LANG_CONFIG = {
  c: {
    ext: '.c',
    compile: (file, out) => `gcc "${file}" -o "${out}" -lm 2>&1`,
    run: (out, input) => `echo "${input.replace(/"/g, '\\"')}" | timeout ${TIMEOUT/1000}s "${out}"`,
    needCompile: true
  },
  java: {
    ext: '.java',
    compile: (file, dir) => `javac "${file}" -d "${dir}" 2>&1`,
    run: (dir, input, className) => `echo "${input.replace(/"/g, '\\"')}" | timeout ${TIMEOUT/1000}s java -cp "${dir}" ${className}`,
    needCompile: true
  },
  python: {
    ext: '.py',
    run: (file, input) => `echo "${input.replace(/"/g, '\\"')}" | timeout ${TIMEOUT/1000}s python3 "${file}"`,
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

// 执行命令
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

// 从Java代码中提取类名
function extractJavaClassName(code) {
  const match = code.match(/public\s+class\s+(\w+)/);
  return match ? match[1] : 'Main';
}

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
  
  const jobId = uuidv4();
  const workDir = path.join(TEMP_DIR, jobId);
  fs.mkdirSync(workDir, { recursive: true });
  
  try {
    let executablePath;
    let className;
    
    // 写入源代码
    if (language === 'java') {
      className = extractJavaClassName(code);
      const sourceFile = path.join(workDir, `${className}.java`);
      fs.writeFileSync(sourceFile, code);
      
      // 编译Java
      const compileCmd = config.compile(sourceFile, workDir);
      const compileResult = await execCommand(compileCmd, 30000);
      if (!compileResult.success) {
        cleanup(workDir);
        return res.json({
          success: false,
          results: [{ passed: false, error: `编译错误: ${compileResult.error}` }]
        });
      }
      executablePath = workDir;
    } else {
      const sourceFile = path.join(workDir, `main${config.ext}`);
      fs.writeFileSync(sourceFile, code);
      
      if (config.needCompile) {
        // 编译C
        const execFile = path.join(workDir, 'main');
        const compileCmd = config.compile(sourceFile, execFile);
        const compileResult = await execCommand(compileCmd, 30000);
        if (!compileResult.success) {
          cleanup(workDir);
          return res.json({
            success: false,
            results: [{ passed: false, error: `编译错误: ${compileResult.error}` }]
          });
        }
        executablePath = execFile;
      } else {
        executablePath = sourceFile;
      }
    }
    
    // 运行测试用例
    const results = [];
    for (const tc of testCases) {
      const input = tc.input || '';
      const expected = (tc.expectedOutput || '').trim();
      
      let runCmd;
      if (language === 'java') {
        runCmd = config.run(executablePath, input, className);
      } else if (language === 'python') {
        runCmd = config.run(executablePath, input);
      } else {
        runCmd = config.run(executablePath, input);
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
        const actual = (runResult.output || '').trim().substring(0, MAX_OUTPUT);
        const passed = actual === expected;
        results.push({
          passed,
          input,
          expectedOutput: expected,
          actualOutput: actual,
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

// 快速运行接口（不判题，只返回输出）
app.post('/api/run', async (req, res) => {
  const { code, language, input = '' } = req.body;
  
  if (!code || !language) {
    return res.status(400).json({ error: '缺少必要参数' });
  }
  
  const config = LANG_CONFIG[language];
  if (!config) {
    return res.status(400).json({ error: '不支持的语言' });
  }
  
  const jobId = uuidv4();
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
        return res.json({ success: false, error: `编译错误:\n${compileResult.error}` });
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
          return res.json({ success: false, error: `编译错误:\n${compileResult.error}` });
        }
        executablePath = execFile;
      } else {
        executablePath = sourceFile;
      }
    }
    
    let runCmd;
    if (language === 'java') {
      runCmd = config.run(executablePath, input, className);
    } else if (language === 'python') {
      runCmd = config.run(executablePath, input);
    } else {
      runCmd = config.run(executablePath, input);
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

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', languages: Object.keys(LANG_CONFIG) });
});

app.listen(PORT, () => {
  console.log(`🚀 灵码判题服务运行在 http://localhost:${PORT}`);
});
