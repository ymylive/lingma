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
const CSHARP_PROJECT_FILE = `<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>disable</Nullable>
  </PropertyGroup>
</Project>
`;

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
  csharp: {
    ext: '.cs',
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

function truncateText(value = '') {
  return value.length > 200 ? `${value.substring(0, 200)}...` : value;
}

function inferCaseKind(index, total) {
  if (total <= 1) return 'sample';
  if (index === 0) return 'sample';
  const ratio = (index + 1) / total;
  if (ratio <= 0.5) return 'basic';
  if (ratio < 1) return 'boundary';
  return 'stress';
}

function inferCheckpointTitle(index, total, description) {
  if (description) return description;

  const kind = inferCaseKind(index, total);
  if (kind === 'sample') return '样例检查';
  if (kind === 'basic') return '基础检查';
  if (kind === 'boundary') return '边界检查';
  return '稳健性检查';
}

function normalizeTestCase(tc, index, total) {
  const kind = tc.kind || inferCaseKind(index, total);
  const checkpointTitle = tc.checkpoint || inferCheckpointTitle(index, total, tc.description);
  const checkpointGroup = tc.group || (
    kind === 'sample'
      ? '样例'
      : kind === 'basic'
        ? '基础'
        : kind === 'boundary'
          ? '边界'
          : '压力'
  );
  const checkpointId = `${checkpointGroup}-${checkpointTitle}`
    .replace(/[^\w\u4e00-\u9fa5-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  const defaultWeight = kind === 'stress' ? 3 : kind === 'boundary' ? 2 : 1;
  const weight = Number(tc.weight) > 0 ? Number(tc.weight) : defaultWeight;
  const feedbackHint = tc.feedbackHint || (
    kind === 'boundary'
      ? '重点检查空输入、极值、重复元素和下标边界。'
      : kind === 'stress'
        ? '重点检查时间复杂度、空间占用和循环终止条件。'
        : '先核对核心逻辑、输入解析和输出格式。'
  );

  return {
    ...tc,
    description: tc.description || checkpointTitle,
    checkpointId,
    checkpointTitle,
    checkpointGroup,
    weight,
    hidden: Boolean(tc.hidden),
    feedbackHint,
    kind
  };
}

function buildCaseFeedback(status, passed, testCase) {
  if (passed) {
    return {
      feedbackLevel: 'pass',
      feedbackTitle: '检查点通过',
      feedbackMessage: '该检查点已经通过，可以继续推进下一层。',
      nextAction: '继续保持当前思路，开始处理更高难度的测试。'
    };
  }

  if (status === 'CE') {
    return {
      feedbackLevel: 'blocker',
      feedbackTitle: '编译未通过',
      feedbackMessage: '代码还没有通过编译，先修复语法、类型或缺失引用。',
      nextAction: '先根据编译器报错定位行号，再重新提交。'
    };
  }

  if (status === 'RE') {
    return {
      feedbackLevel: 'blocker',
      feedbackTitle: '运行异常',
      feedbackMessage: '程序在运行阶段异常退出，通常是越界、空指针、除零或输入处理问题。',
      nextAction: testCase.feedbackHint || '先补齐边界保护，再重新运行样例和边界测试。'
    };
  }

  if (status === 'TLE' || status === 'OLE') {
    return {
      feedbackLevel: 'warning',
      feedbackTitle: status === 'TLE' ? '性能未达标' : '输出超限',
      feedbackMessage: status === 'TLE'
        ? '程序在限制时间内没有完成，复杂度或循环终止条件需要优化。'
        : '输出量超过限制，通常是死循环或调试打印未移除。',
      nextAction: testCase.feedbackHint || '检查循环边界、数据规模和无效输出。'
    };
  }

  return {
    feedbackLevel: testCase.kind === 'sample' || testCase.kind === 'basic' ? 'review' : 'warning',
    feedbackTitle: testCase.kind === 'boundary' ? '边界检查未通过' : '结果不符合预期',
    feedbackMessage: testCase.feedbackHint || '当前答案未通过该检查点，请先核对核心逻辑和输出格式。',
    nextAction: testCase.feedbackHint || '先对照失败输入重跑，再缩小问题范围。'
  };
}

function buildCheckpointSummaries(results) {
  const groups = new Map();

  for (const result of results) {
    const id = result.checkpointId || `case-${result.testCase || 'unknown'}`;
    const weight = result.weight || 1;
    const current = groups.get(id) || {
      id,
      title: result.checkpointTitle || result.description || '未命名检查点',
      group: result.checkpointGroup || '通用',
      total: 0,
      passedCount: 0,
      score: 0,
      maxScore: 0,
      failedResult: null
    };

    current.total += 1;
    current.maxScore += weight;
    if (result.passed) {
      current.passedCount += 1;
      current.score += weight;
    } else if (!current.failedResult) {
      current.failedResult = result;
    }

    groups.set(id, current);
  }

  return Array.from(groups.values()).map((group) => {
    const passed = group.total > 0 && group.passedCount === group.total;
    const failedResult = group.failedResult;

    return {
      id: group.id,
      title: group.title,
      group: group.group,
      passed,
      passedCount: group.passedCount,
      total: group.total,
      score: group.score,
      maxScore: group.maxScore,
      feedbackLevel: passed ? 'pass' : (failedResult?.feedbackLevel || 'review'),
      feedbackMessage: passed
        ? '该组检查点已全部通过。'
        : (failedResult?.feedbackMessage || failedResult?.feedbackHint || '先修复本组失败测试。')
    };
  });
}

function buildJudgeSummary(results, totalCases, checkpoints, allPassed) {
  const passed = results.filter((result) => result.passed).length;
  const maxScore = results.reduce((sum, result) => sum + (result.weight || 1), 0);
  const earnedScore = results.reduce((sum, result) => sum + (result.passed ? (result.weight || 1) : 0), 0);
  const score = maxScore ? Math.round((earnedScore / maxScore) * 100) : (allPassed ? 100 : 0);
  const runtimeValues = results
    .map((result) => result.time)
    .filter((value) => typeof value === 'number');
  const maxMs = runtimeValues.length ? Math.max(...runtimeValues) : 0;
  const avgMs = runtimeValues.length ? Math.round(runtimeValues.reduce((sum, value) => sum + value, 0) / runtimeValues.length) : 0;
  const firstFailed = results.find((result) => !result.passed);
  const passedCheckpoints = checkpoints.filter((checkpoint) => checkpoint.passed).length;

  return {
    total: totalCases,
    passed,
    failed: Math.max(0, totalCases - passed),
    verdict: allPassed ? 'Accepted' : (firstFailed?.status || 'WA'),
    score,
    passRate: totalCases ? Math.round((passed / totalCases) * 100) : 0,
    passedCheckpoints,
    totalCheckpoints: checkpoints.length,
    feedbackLevel: allPassed ? 'excellent' : (firstFailed?.feedbackLevel || 'review'),
    feedbackMessage: allPassed
      ? '所有检查点已通过，可以进入下一层刷题。'
      : (firstFailed?.feedbackMessage || '仍有关键检查点未通过，建议优先修复失败用例。'),
    nextAction: allPassed
      ? '继续挑战推荐下一题，保持难度递进。'
      : (firstFailed?.nextAction || '先修复第一个失败检查点，再扩大验证范围。'),
    runtime: {
      avgMs,
      maxMs
    }
  };
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
  } else if (language === 'csharp') {
    const projectDir = path.join(workDir, 'csharp');
    fs.mkdirSync(projectDir, { recursive: true });
    sourceFile = path.join(projectDir, 'Program.cs');
    const projectFile = path.join(projectDir, 'JudgeApp.csproj');
    fs.writeFileSync(sourceFile, code);
    fs.writeFileSync(projectFile, CSHARP_PROJECT_FILE);
    executablePath = path.join(projectDir, 'bin', 'Release', 'net8.0', 'JudgeApp.dll');
  } else {
    sourceFile = path.join(workDir, `main${config.ext}`);
    fs.writeFileSync(sourceFile, code);
    executablePath = path.join(workDir, 'main');
  }
  
  if (config.needCompile) {
    const compileCmd = language === 'java'
      ? config.compile(sourceFile, workDir)
      : language === 'csharp'
        ? `dotnet build "${path.join(workDir, 'csharp', 'JudgeApp.csproj')}" -c Release -nologo --verbosity quiet --disable-build-servers 2>&1`
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
  
  if (!code || !language || !Array.isArray(testCases)) {
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
    const normalizedTestCases = testCases.map((tc, index) => normalizeTestCase(tc, index, testCases.length));

    // 编译
    const compileResult = await compileCode(language, code, workDir);
    if (!compileResult.success) {
      const compileCase = normalizeTestCase({
        input: '',
        expectedOutput: '',
        description: '编译检查',
        checkpoint: '编译检查',
        group: '编译',
        weight: 1,
        feedbackHint: '先修复编译错误，再重新运行样例和边界测试。',
        kind: 'basic'
      }, 0, 1);
      const compileFeedback = buildCaseFeedback('CE', false, compileCase);
      const compileResults = [{
        passed: false,
        testCase: 0,
        input: '',
        expectedOutput: '',
        actualOutput: '',
        error: `编译错误 (Compilation Error):\n${compileResult.error}`,
        time: 0,
        status: 'CE',
        description: compileCase.description,
        checkpoint: compileCase.checkpointTitle,
        checkpointId: compileCase.checkpointId,
        checkpointTitle: compileCase.checkpointTitle,
        checkpointGroup: compileCase.checkpointGroup,
        hidden: false,
        weight: compileCase.weight,
        feedbackHint: compileCase.feedbackHint,
        kind: compileCase.kind,
        ...compileFeedback
      }];
      const checkpoints = buildCheckpointSummaries(compileResults);
      const summary = buildJudgeSummary(compileResults, normalizedTestCases.length || 1, checkpoints, false);
      cleanup(workDir);
      return res.json({
        success: false,
        error: compileResult.error,
        results: compileResults,
        allPassed: false,
        checkpoints,
        summary
      });
    }
    
    const { executablePath, className } = compileResult;
    
    // 运行测试用例
    const results = [];
    let allPassed = true;
    
    for (let i = 0; i < normalizedTestCases.length; i++) {
      const tc = normalizedTestCases[i];
      const input = tc.input || '';
      const expected = tc.expectedOutput || '';
      
      // 构建运行命令
      let cmd, args;
      if (language === 'java') {
        cmd = 'java';
        args = ['-cp', executablePath, '-Xmx256m', className];
      } else if (language === 'csharp') {
        cmd = 'dotnet';
        args = [executablePath];
      } else if (language === 'python') {
        cmd = 'python3';
        args = ['-u', executablePath];
      } else {
        cmd = executablePath;
        args = [];
      }
      
      const runResult = await runProgram(cmd, args, input, TIMEOUT);
      const visibleInput = tc.hidden ? '[hidden input]' : truncateText(input);
      const visibleExpected = tc.hidden ? '[hidden expected output]' : truncateText(expected);
      
      if (!runResult.success) {
        allPassed = false;
        const feedback = buildCaseFeedback(runResult.status, false, tc);
        results.push({
          passed: false,
          testCase: i + 1,
          input: visibleInput,
          expectedOutput: visibleExpected,
          actualOutput: '',
          error: runResult.error,
          time: runResult.time,
          status: runResult.status,
          description: tc.description,
          checkpoint: tc.checkpointTitle,
          checkpointId: tc.checkpointId,
          checkpointTitle: tc.checkpointTitle,
          checkpointGroup: tc.checkpointGroup,
          hidden: tc.hidden,
          weight: tc.weight,
          feedbackHint: tc.feedbackHint,
          kind: tc.kind,
          ...feedback
        });
      } else {
        const actual = runResult.output;
        const passed = compareOutput(expected, actual);
        
        if (!passed) allPassed = false;
        const feedback = buildCaseFeedback(passed ? 'AC' : 'WA', passed, tc);
        
        results.push({
          passed,
          testCase: i + 1,
          input: visibleInput,
          expectedOutput: visibleExpected,
          actualOutput: tc.hidden ? '[hidden actual output]' : truncateText(actual),
          time: runResult.time,
          status: passed ? 'AC' : 'WA',
          description: tc.description,
          checkpoint: tc.checkpointTitle,
          checkpointId: tc.checkpointId,
          checkpointTitle: tc.checkpointTitle,
          checkpointGroup: tc.checkpointGroup,
          hidden: tc.hidden,
          weight: tc.weight,
          feedbackHint: tc.feedbackHint,
          kind: tc.kind,
          ...feedback
        });
      }
    }
    
    cleanup(workDir);
    
    const checkpoints = buildCheckpointSummaries(results);
    const summary = buildJudgeSummary(results, normalizedTestCases.length, checkpoints, allPassed);
    res.json({
      success: true,
      results,
      allPassed,
      checkpoints,
      summary
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
    } else if (language === 'csharp') {
      cmd = 'dotnet';
      args = [executablePath];
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
