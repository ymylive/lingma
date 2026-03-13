const API_BASE = import.meta.env.PROD
  ? 'https://lingma.cornna.xyz/api'
  : 'http://localhost:3001/api';

export type SupportedJudgeLanguage = 'c' | 'cpp' | 'java' | 'csharp' | 'python';

export interface TestCase {
  input: string;
  expectedOutput: string;
  description?: string;
  checkpoint?: string;
  group?: string;
  hidden?: boolean;
  weight?: number;
  feedbackHint?: string;
  kind?: 'sample' | 'basic' | 'boundary' | 'stress' | 'hidden';
}

export interface TestResult {
  passed: boolean;
  testCase?: number;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  error?: string;
  time?: number;
  status: string;
  description?: string;
  checkpoint?: string;
  checkpointId?: string;
  checkpointTitle?: string;
  checkpointGroup?: string;
  hidden?: boolean;
  weight?: number;
  feedbackHint?: string;
  kind?: string;
  feedbackLevel?: string;
  feedbackTitle?: string;
  feedbackMessage?: string;
  nextAction?: string;
}

export interface JudgeCheckpointSummary {
  id: string;
  title: string;
  group: string;
  passed: boolean;
  passedCount: number;
  total: number;
  score: number;
  maxScore: number;
  feedbackLevel: string;
  feedbackMessage: string;
}

export interface JudgeSummary {
  total: number;
  passed: number;
  failed: number;
  verdict: string;
  score: number;
  passRate: number;
  passedCheckpoints: number;
  totalCheckpoints: number;
  feedbackLevel: string;
  feedbackMessage: string;
  nextAction?: string;
  runtime: {
    avgMs: number;
    maxMs: number;
  };
}

export interface JudgeResponse {
  success: boolean;
  results: TestResult[];
  allPassed: boolean;
  summary: JudgeSummary;
  checkpoints: JudgeCheckpointSummary[];
  error?: string;
}

export interface RunResponse {
  success: boolean;
  output?: string;
  error?: string;
  time?: number;
  status?: string;
}

async function readApiError(response: Response): Promise<string> {
  const text = await response.text();
  if (!text) {
    return `judge service error: ${response.status}`;
  }

  try {
    const payload = JSON.parse(text) as { error?: string; detail?: string };
    return payload.error || payload.detail || text;
  } catch {
    return text;
  }
}

function buildFallbackSummary(results: TestResult[], allPassed: boolean): JudgeSummary {
  const passed = results.filter((result) => result.passed).length;
  const runtimeValues = results
    .map((result) => result.time)
    .filter((value): value is number => typeof value === 'number');
  const maxMs = runtimeValues.length ? Math.max(...runtimeValues) : 0;
  const avgMs = runtimeValues.length ? Math.round(runtimeValues.reduce((sum, value) => sum + value, 0) / runtimeValues.length) : 0;
  const verdict = allPassed ? 'Accepted' : results.find((result) => !result.passed)?.status || 'WA';
  const score = results.length ? Math.round((passed / results.length) * 100) : (allPassed ? 100 : 0);

  return {
    total: results.length,
    passed,
    failed: Math.max(0, results.length - passed),
    verdict,
    score,
    passRate: results.length ? Math.round((passed / results.length) * 100) : 0,
    passedCheckpoints: 0,
    totalCheckpoints: 0,
    feedbackLevel: allPassed ? 'excellent' : 'review',
    feedbackMessage: allPassed ? '所有测试已通过，可以进入下一层。' : '仍有测试未通过，先修复失败检查点再继续。',
    runtime: {
      avgMs,
      maxMs,
    },
  };
}

function normalizeJudgeResponse(payload: Partial<JudgeResponse>): JudgeResponse {
  const results = Array.isArray(payload.results) ? payload.results : [];
  const allPassed =
    typeof payload.allPassed === 'boolean'
      ? payload.allPassed
      : results.length > 0 && results.every((result) => result.passed);
  const summary = payload.summary ?? buildFallbackSummary(results, allPassed);

  return {
    success: typeof payload.success === 'boolean' ? payload.success : allPassed,
    results,
    allPassed,
    summary,
    checkpoints: Array.isArray(payload.checkpoints) ? payload.checkpoints : [],
    error: payload.error,
  };
}

export async function runTestCases(
  code: string,
  language: SupportedJudgeLanguage,
  testCases: TestCase[],
): Promise<JudgeResponse> {
  const response = await fetch(`${API_BASE}/judge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, language, testCases }),
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  const data = normalizeJudgeResponse((await response.json()) as Partial<JudgeResponse>);
  if (!data.success && data.error && data.results.length === 0) {
    throw new Error(data.error);
  }

  return data;
}

export async function quickRun(
  code: string,
  language: SupportedJudgeLanguage,
  input = '',
): Promise<RunResponse> {
  const response = await fetch(`${API_BASE}/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, language, input }),
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return response.json();
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/health`);
    const data = await response.json();
    return data.status === 'ok';
  } catch {
    return false;
  }
}
