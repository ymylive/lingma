const test = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { setTimeout: delay } = require('node:timers/promises');

const SERVER_PATH = path.join(__dirname, '..', 'server.js');
const HOST = '127.0.0.1';
const PORT = 3002;
const TOKEN = 'test-judge-token';

function createMockExpress() {
  function express() {
    return {
      use() {},
      post() {},
      get() {},
      listen() {
        return { close() {} };
      }
    };
  }

  express.json = () => (_req, _res, next) => next && next();
  return express;
}

function loadServerModule({ exec, execSync, spawn: spawnMock } = {}) {
  const source = `${fs.readFileSync(SERVER_PATH, 'utf8')}\nmodule.exports = { compileCode };`;
  const mockFs = {
    ...fs,
    existsSync: () => true,
    mkdirSync() {},
    writeFileSync() {},
    rmSync() {}
  };
  const mockChildProcess = {
    exec: exec || ((_command, _options, callback) => callback(null, '', '')),
    execSync: execSync || (() => {
      throw new Error('execSync should not be used');
    }),
    spawn: spawnMock || (() => {
      throw new Error('spawn was not expected in this unit test');
    })
  };
  const sandbox = {
    module: { exports: {} },
    exports: {},
    require(id) {
      if (id === 'child_process') return mockChildProcess;
      if (id === 'fs') return mockFs;
      if (id === 'path') return path;
      if (id === 'express') return createMockExpress();
      if (id === 'cors') return () => (_req, _res, next) => next && next();
      if (id === 'uuid') return { v4: () => 'test-job-id' };
      return require(id);
    },
    process,
    console,
    Buffer,
    setTimeout,
    clearTimeout
  };

  vm.runInNewContext(source, sandbox, { filename: SERVER_PATH });
  return sandbox.module.exports;
}

async function waitForServerReady() {
  const deadline = Date.now() + 10000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://${HOST}:${PORT}/api/health`);
      if (response.ok) {
        return;
      }
    } catch (error) {
      if (error.name !== 'TypeError') {
        throw error;
      }
    }

    await delay(100);
  }

  throw new Error('judge-server did not become ready in time');
}

async function startServer(extraEnv = {}) {
  const child = spawn(process.execPath, [SERVER_PATH], {
    env: {
      ...process.env,
      JUDGE_HOST: HOST,
      JUDGE_INTERNAL_TOKEN: TOKEN,
      JUDGE_MAX_CONCURRENT_JOBS: '1',
      ...extraEnv
    },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  let stderr = '';
  child.stderr.on('data', (chunk) => {
    stderr += chunk.toString();
  });

  child.on('exit', (code) => {
    if (code !== null && code !== 0) {
      throw new Error(`judge-server exited early with code ${code}: ${stderr}`);
    }
  });

  await waitForServerReady();
  return child;
}

async function stopServer(child) {
  if (!child || child.exitCode !== null) {
    return;
  }

  child.kill();
  await new Promise((resolve) => {
    child.once('exit', resolve);
  });
}

async function waitForActiveJobs(expected) {
  const deadline = Date.now() + 10000;

  while (Date.now() < deadline) {
    const response = await fetch(`http://${HOST}:${PORT}/api/health`);
    const body = await response.json();
    if (body.concurrency && body.concurrency.activeJobs === expected) {
      return;
    }
    await delay(50);
  }

  throw new Error(`activeJobs did not reach ${expected}`);
}

test('compileCode avoids execSync and uses async child process execution', async () => {
  let execCalls = 0;
  let execSyncCalls = 0;
  const { compileCode } = loadServerModule({
    exec: (_command, _options, callback) => {
      execCalls += 1;
      callback(null, '', '');
    },
    execSync: () => {
      execSyncCalls += 1;
      throw new Error('execSync should not be used');
    }
  });

  const result = await compileCode('c', '#include <stdio.h>\nint main(void) { return 0; }\n', path.join(__dirname, 'tmp-compile'));

  assert.equal(execSyncCalls, 0);
  assert.equal(execCalls, 1);
  assert.equal(result.success, true);
});

test('compileCode keeps CE status when compiler reports an error', async () => {
  const compilerError = new Error('compile failed');
  compilerError.stderr = Buffer.from('syntax error');
  const { compileCode } = loadServerModule({
    exec: (_command, _options, callback) => {
      callback(compilerError, '', 'syntax error');
    }
  });

  const result = await compileCode('cpp', 'int main() {', path.join(__dirname, 'tmp-ce'));

  assert.equal(result.success, false);
  assert.equal(result.status, 'CE');
  assert.match(result.error, /syntax error/);
});

test('judge endpoints reject requests without the internal token', async (t) => {
  const child = await startServer();
  t.after(() => stopServer(child));

  const response = await fetch(`http://${HOST}:${PORT}/api/run`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      language: 'python',
      code: 'print("ok")'
    })
  });

  assert.equal(response.status, 403);
  assert.deepEqual(await response.json(), { error: 'Forbidden judge access' });
});

test('judge server returns 429 while the only worker slot is busy', async (t) => {
  const child = await startServer();
  t.after(() => stopServer(child));

  const headers = {
    'content-type': 'application/json',
    'x-judge-token': TOKEN
  };
  const firstRequest = fetch(`http://${HOST}:${PORT}/api/run`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      language: 'python',
      code: 'import time\ntime.sleep(1.5)\nprint("done")\n'
    })
  });

  await waitForActiveJobs(1);

  const busyResponse = await fetch(`http://${HOST}:${PORT}/api/run`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      language: 'python',
      code: 'print("fast")\n'
    })
  });

  assert.equal(busyResponse.status, 429);
  assert.match((await busyResponse.json()).error, /busy/i);

  const firstPayload = await (await firstRequest).json();
  assert.equal(firstPayload.success, true);
  assert.match(firstPayload.output, /done/);
});
