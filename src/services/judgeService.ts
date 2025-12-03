// 判题服务 - 连接后端API

const API_BASE = import.meta.env.PROD 
  ? 'https://lingma.cornna.xyz/api' 
  : 'http://localhost:3001/api';

export interface TestCase {
  input: string;
  expectedOutput: string;
  description?: string;
}

export interface TestResult {
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  error?: string;
  time?: number;
  status: string;
}

export interface JudgeResponse {
  success: boolean;
  results: TestResult[];
  allPassed: boolean;
  error?: string;
}

export interface RunResponse {
  success: boolean;
  output?: string;
  error?: string;
  time?: number;
}

// 运行测试用例判题
export async function runTestCases(
  code: string,
  language: 'c' | 'cpp' | 'java' | 'python',
  testCases: TestCase[]
): Promise<TestResult[]> {
  // cpp暂时用c的编译器，后续可扩展
  const lang = language === 'cpp' ? 'c' : language;
  
  const response = await fetch(`${API_BASE}/judge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, language: lang, testCases })
  });
  
  if (!response.ok) {
    throw new Error(`判题服务错误: ${response.status}`);
  }
  
  const data: JudgeResponse = await response.json();
  
  if (!data.success && data.error) {
    throw new Error(data.error);
  }
  
  return data.results;
}

// 快速运行（不判题）
export async function quickRun(
  code: string,
  language: 'c' | 'cpp' | 'java' | 'python',
  input: string = ''
): Promise<RunResponse> {
  const lang = language === 'cpp' ? 'c' : language;
  
  const response = await fetch(`${API_BASE}/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, language: lang, input })
  });
  
  if (!response.ok) {
    throw new Error(`运行服务错误: ${response.status}`);
  }
  
  return response.json();
}

// 检查判题服务是否可用
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/health`);
    const data = await response.json();
    return data.status === 'ok';
  } catch {
    return false;
  }
}
