import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  generateCodingExercise,
  generateFillBlank,
  normalizeGeneratedExercisePayload,
  normalizeGeneratedFillBlankPayload,
} from './aiService';

describe('normalizeGeneratedExercisePayload', () => {
  beforeEach(() => {
    const storage = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => storage.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => {
        storage.set(key, value);
      }),
      removeItem: vi.fn((key: string) => {
        storage.delete(key);
      }),
      clear: vi.fn(() => {
        storage.clear();
      }),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('maps object-style description payloads from streamed exercise JSON', () => {
    const payload = normalizeGeneratedExercisePayload({
      title: '反转单链表',
      description: {
        problem: '给定单链表头节点，返回反转后的链表。',
        input: '输入链表节点值。',
        output: '输出反转后的链表。',
        constraints: '节点数量在 1 到 5000 之间。',
      },
      templates: {
        cpp: 'int main(){return 0;}',
        java: 'public class Main { public static void main(String[] args) {} }',
        python: 'print(0)',
      },
      solutions: {
        cpp: 'int main(){return 0;}',
        java: 'public class Main { public static void main(String[] args) {} }',
        python: 'print(0)',
      },
      testCases: [
        { input: '1 2 3', expectedOutput: '3 2 1', description: '样例' },
      ],
      difficulty: 'easy',
    });

    expect(payload.description).toContain('给定单链表头节点');
    expect(payload.description).toContain('输入链表节点值');
    expect(payload.description).toContain('输出反转后的链表');
    expect(payload.description).toContain('节点数量在 1 到 5000 之间');
  });

  it('maps alternate field names into the frontend exercise shape', () => {
    const payload = normalizeGeneratedExercisePayload({
      problem_title: '二叉树路径和',
      problem_description: '给定一棵二叉树，求所有叶子路径和。',
      input_format: '第一行输入节点数 n。',
      output_format: '输出一个整数。',
      data_range: '1 ≤ n ≤ 10^5',
      starter_code: {
        'c++': '#include <iostream>\nint main(){return 0;}',
        java: 'public class Main { public static void main(String[] args) {} }',
        python3: 'print(0)',
      },
      reference_solutions: {
        cpp: 'int main(){std::cout<<0;}',
      },
      examples: [
        {
          sampleInput: '3\n1 2 3',
          output: '6',
          label: '样例 1',
        },
      ],
      tips: ['先考虑 DFS。'],
      analysis: '从根节点递归到叶子节点。',
      difficulty: 'medium',
    });

    expect(payload.title).toBe('二叉树路径和');
    expect(payload.description).toContain('给定一棵二叉树');
    expect(payload.templates.cpp).toContain('#include <iostream>');
    expect(payload.templates.python).toBe('print(0)');
    expect(payload.testCases[0]).toEqual({
      input: '3\n1 2 3',
      expectedOutput: '6',
      description: '样例 1',
    });
    expect(payload.hints).toEqual(['先考虑 DFS。']);
    expect(payload.explanation).toBe('从根节点递归到叶子节点。');
  });

  it('throws when required exercise fields are missing instead of returning a half-empty card', () => {
    expect(() =>
      normalizeGeneratedExercisePayload({
        templates: {
          cpp: 'int main(){return 0;}',
        },
        testCases: [],
      }),
    ).toThrow(/标题|title/);
  });

  it('drops incomplete test cases instead of rendering empty samples', () => {
    expect(() =>
      normalizeGeneratedExercisePayload({
        title: '路径和',
        description: '题面',
        templates: { cpp: 'int main(){return 0;}' },
        testCases: [{ input: '1', description: '只有输入' }],
      }),
    ).toThrow(/测试用例|test cases/);
  });
});

describe('streamed AI exercise generation', () => {
  beforeEach(() => {
    const storage = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => storage.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => {
        storage.set(key, value);
      }),
      removeItem: vi.fn((key: string) => {
        storage.delete(key);
      }),
      clear: vi.fn(() => {
        storage.clear();
      }),
    });
    vi.stubGlobal('fetch', vi.fn(async () => {
      const encoder = new TextEncoder();
      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(encoder.encode('data: {"type":"preview","text":"链表题"}\n\n'));
          controller.enqueue(encoder.encode('data: {"type":"preview","text":"链表题 - 题面"}\n\n'));
          controller.enqueue(encoder.encode('data: {"type":"final","payload":{"text":"{\\"title\\":\\"链表题\\",\\"description\\":\\"题面\\",\\"templates\\":{\\"cpp\\":\\"int main(){return 0;}\\",\\"java\\":\\"public class Main { public static void main(String[] args) {} }\\",\\"python\\":\\"print(0)\\"},\\"solutions\\":{\\"cpp\\":\\"int main(){return 0;}\\",\\"java\\":\\"public class Main { public static void main(String[] args) {} }\\",\\"python\\":\\"print(0)\\"},\\"testCases\\":[{\\"input\\":\\"1\\",\\"expectedOutput\\":\\"1\\",\\"description\\":\\"样例\\"}],\\"difficulty\\":\\"easy\\",\\"hints\\":[],\\"explanation\\":\\"\\"}"}}\n\n'));
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        },
      });

      return new Response(stream, {
        status: 200,
        headers: { 'Content-Type': 'text/event-stream' },
      });
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('accepts nested data and response payload shapes from streamed responses', async () => {
    const structuredPayload = {
      title: '链表题',
      description: '题面',
      templates: { cpp: 'int main(){return 0;}', java: 'public class Main{}', python: 'pass' },
      solutions: { cpp: 'int main(){return 0;}', java: 'public class Main{}', python: 'pass' },
      testCases: [{ input: '1', expectedOutput: '1', description: '样例' }],
      difficulty: 'easy',
      hints: [],
      explanation: '',
    };

    for (const payloadVariant of [
      structuredPayload,
      { title: '链表题', problem_description: '题面', starter_code: { cpp: 'int main(){return 0;}', java: 'public class Main{}', python3: 'pass' }, reference_solutions: { cpp: 'int main(){return 0;}', java: 'public class Main{}', python: 'pass' }, examples: [{ sampleInput: '1', output: '1', label: '样例' }], difficulty: 'easy', tips: [], analysis: '' },
    ]) {
      vi.stubGlobal('fetch', vi.fn(async () => {
        const encoder = new TextEncoder();
        const stream = new ReadableStream<Uint8Array>({
          start(controller) {
            controller.enqueue(encoder.encode('data: {"type":"preview","text":"链表"}\n\n'));
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'final', payload: payloadVariant })}\n\n`));
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          },
        });
        return new Response(stream, { status: 200, headers: { 'Content-Type': 'text/event-stream' } });
      }));

      const result = await generateCodingExercise('链表', 'easy', '链表');
      expect(result.title).toBe('链表题');
    }
  });

  it('accepts alternate final payload shapes from streamed responses', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => {
      const encoder = new TextEncoder();
      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(encoder.encode('data: {"type":"preview","text":"链表"}\n\n'));
          controller.enqueue(encoder.encode('data: {"type":"final","payload":{"problem_title":"链表题","problem_description":"题面","starter_code":{"cpp":"int main(){return 0;}","java":"public class Main{}","python3":"pass"},"reference_solutions":{"cpp":"int main(){return 0;}","java":"public class Main{}","python":"pass"},"examples":[{"sampleInput":"1","output":"1","label":"样例"}],"difficulty":"easy","tips":[],"analysis":""}}\n\n'));
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        },
      });
      return new Response(stream, { status: 200, headers: { 'Content-Type': 'text/event-stream' } });
    }));

    const result = await generateCodingExercise('链表', 'easy', '链表');
    expect(result.title).toBe('链表题');
  });

  it('accepts structured final payload objects from streamed responses', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => {
      const encoder = new TextEncoder();
      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(encoder.encode('data: {"type":"preview","text":"链表"}\n\n'));
          controller.enqueue(encoder.encode('data: {"type":"final","payload":{"title":"链表题","description":"题面","templates":{"cpp":"int main(){return 0;}","java":"public class Main{}","python":"pass"},"solutions":{"cpp":"int main(){return 0;}","java":"public class Main{}","python":"pass"},"testCases":[{"input":"1","expectedOutput":"1","description":"样例"}],"difficulty":"easy","hints":[],"explanation":""}}\n\n'));
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        },
      });
      return new Response(stream, { status: 200, headers: { 'Content-Type': 'text/event-stream' } });
    }));

    const result = await generateCodingExercise('链表', 'easy', '链表');
    expect(result.title).toBe('链表题');
  });

  it('accepts structured final fill-blank payload objects from streamed responses', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => {
      const encoder = new TextEncoder();
      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(encoder.encode('data: {"type":"preview","text":"补全函数"}\n\n'));
          controller.enqueue(encoder.encode('data: {"type":"final","payload":{"title":"补全链表反转函数","description":"补全程序中的函数体。","templates":{"cpp":"___FUNC1___"},"blankItems":[{"key":"FUNC1","expected_answer":"return head;","description":"返回反转后的头节点"}],"difficulty":"easy","solution_explanation":"先处理空链表，再迭代反转。"}}\n\n'));
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        },
      });
      return new Response(stream, { status: 200, headers: { 'Content-Type': 'text/event-stream' } });
    }));

    const result = await generateFillBlank('链表', 'easy', '链表');
    expect(result.title).toBe('补全链表反转函数');
    expect(result.blanks[0]?.answer).toBe('return head;');
  });

  it('parses legacy text payloads from older exercise stream responses', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => {
      const encoder = new TextEncoder();
      const legacyTextPayload = [
        '```json',
        '{"title":"链表题","description":"第一行',
        '第二行","templates":{"cpp":"int main(){return 0;}","java":"public class Main{}","python":"pass"},"solutions":{"cpp":"int main(){return 0;}","java":"public class Main{}","python":"pass"},"testCases":[{"input":"1","expectedOutput":"1","description":"样例"}],"difficulty":"easy","hints":[],"explanation":""}',
        '```',
      ].join('\n');
      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(encoder.encode('data: {"type":"preview","text":"链表"}\n\n'));
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'final', payload: { text: legacyTextPayload } })}\n\n`),
          );
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        },
      });
      return new Response(stream, { status: 200, headers: { 'Content-Type': 'text/event-stream' } });
    }));

    const result = await generateCodingExercise('链表', 'easy', '链表');
    expect(result.title).toBe('链表题');
    expect(result.description).toContain('第一行');
    expect(result.description).toContain('第二行');
  });

  it('sends legacy messages alongside structured stream fields for backend compatibility', async () => {
    let requestBody: Record<string, unknown> | null = null;

    vi.stubGlobal('fetch', vi.fn(async (_input, init) => {
      requestBody = JSON.parse(String(init?.body ?? '{}')) as Record<string, unknown>;
      const encoder = new TextEncoder();
      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(encoder.encode('data: {"type":"preview","text":"链表"}\n\n'));
          controller.enqueue(encoder.encode('data: {"type":"final","payload":{"title":"链表题","description":"题面","templates":{"cpp":"int main(){return 0;}","java":"public class Main{}","python":"pass"},"solutions":{"cpp":"int main(){return 0;}","java":"public class Main{}","python":"pass"},"testCases":[{"input":"1","expectedOutput":"1","description":"样例"}],"difficulty":"easy","hints":[],"explanation":""}}\n\n'));
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        },
      });
      return new Response(stream, { status: 200, headers: { 'Content-Type': 'text/event-stream' } });
    }));

    await generateCodingExercise('链表', 'easy', '链表');

    expect(requestBody?.kind).toBe('coding');
    expect(requestBody?.prompt).toEqual(expect.any(String));
    expect(requestBody?.messages).toEqual([
      expect.objectContaining({
        role: 'system',
        content: expect.any(String),
      }),
      expect.objectContaining({
        role: 'user',
        content: expect.any(String),
      }),
    ]);
  });
});

describe('normalizeGeneratedFillBlankPayload', () => {
  it('maps alternate fill-blank field names into the frontend shape', () => {
    const payload = normalizeGeneratedFillBlankPayload({
      problemTitle: '补全链表反转函数',
      statement: '补全程序中的函数体。',
      templates: {
        cpp: '___FUNC1___',
      },
      blankItems: [
        {
          key: 'FUNC1',
          expected_answer: 'return head;',
          description: '返回反转后的头节点',
        },
      ],
      solution_explanation: '先处理空链表，再迭代反转。',
    });

    expect(payload.title).toBe('补全链表反转函数');
    expect(payload.description).toBe('补全程序中的函数体。');
    expect(payload.codeTemplate.cpp).toBe('___FUNC1___');
    expect(payload.blanks[0]).toEqual({
      id: 'FUNC1',
      answer: 'return head;',
      hint: '返回反转后的头节点',
    });
    expect(payload.explanation).toBe('先处理空链表，再迭代反转。');
  });
});

/* ---------------------------------------------------------------------------
 * unwrapStructuredPayload branch coverage (tested indirectly via SSE streams)
 * ---------------------------------------------------------------------------*/
describe('unwrapStructuredPayload branch coverage', () => {
  const exerciseObj = {
    title: '链表题',
    description: '题面',
    templates: { cpp: 'int main(){return 0;}', java: 'public class Main{}', python: 'pass' },
    solutions: { cpp: 'int main(){return 0;}', java: 'public class Main{}', python: 'pass' },
    testCases: [{ input: '1', expectedOutput: '1', description: '样例' }],
    difficulty: 'easy',
    hints: [],
    explanation: '',
  };

  function makeStorage() {
    const storage = new Map<string, string>();
    return {
      getItem: vi.fn((key: string) => storage.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => { storage.set(key, value); }),
      removeItem: vi.fn((key: string) => { storage.delete(key); }),
      clear: vi.fn(() => { storage.clear(); }),
    };
  }

  function stubFetchWithPayload(payload: unknown) {
    vi.stubGlobal('fetch', vi.fn(async () => {
      const encoder = new TextEncoder();
      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(encoder.encode('data: {"type":"preview","text":"loading"}\n\n'));
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'final', payload })}\n\n`));
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        },
      });
      return new Response(stream, { status: 200, headers: { 'Content-Type': 'text/event-stream' } });
    }));
  }

  beforeEach(() => {
    vi.stubGlobal('localStorage', makeStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('unwraps payload.data when data is a JSON string', async () => {
    stubFetchWithPayload({ data: JSON.stringify(exerciseObj) });
    const result = await generateCodingExercise('链表', 'easy', '链表');
    expect(result.title).toBe('链表题');
    expect(result.testCases[0]?.expectedOutput).toBe('1');
  });

  it('unwraps payload.response.content when it is an object', async () => {
    stubFetchWithPayload({ response: { content: exerciseObj } });
    const result = await generateCodingExercise('链表', 'easy', '链表');
    expect(result.title).toBe('链表题');
    expect(result.templates.cpp).toContain('int main');
  });

  it('unwraps payload.text as legacy text field', async () => {
    stubFetchWithPayload({ text: JSON.stringify(exerciseObj) });
    const result = await generateCodingExercise('链表', 'easy', '链表');
    expect(result.title).toBe('链表题');
    expect(result.difficulty).toBe('easy');
  });
});

/* ---------------------------------------------------------------------------
 * parseAIJsonResponse repair-path coverage (tested indirectly via SSE streams)
 * ---------------------------------------------------------------------------*/
describe('parseAIJsonResponse repair-path coverage', () => {
  const exerciseObj = {
    title: '链表题',
    description: '题面',
    templates: { cpp: 'int main(){return 0;}', java: 'public class Main{}', python: 'pass' },
    solutions: { cpp: 'int main(){return 0;}', java: 'public class Main{}', python: 'pass' },
    testCases: [{ input: '1', expectedOutput: '1', description: '样例' }],
    difficulty: 'easy',
    hints: [],
    explanation: '',
  };

  function makeStorage() {
    const storage = new Map<string, string>();
    return {
      getItem: vi.fn((key: string) => storage.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => { storage.set(key, value); }),
      removeItem: vi.fn((key: string) => { storage.delete(key); }),
      clear: vi.fn(() => { storage.clear(); }),
    };
  }

  function stubFetchWithTextPayload(text: string) {
    vi.stubGlobal('fetch', vi.fn(async () => {
      const encoder = new TextEncoder();
      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(encoder.encode('data: {"type":"preview","text":"loading"}\n\n'));
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'final', payload: { text } })}\n\n`));
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        },
      });
      return new Response(stream, { status: 200, headers: { 'Content-Type': 'text/event-stream' } });
    }));
  }

  beforeEach(() => {
    vi.stubGlobal('localStorage', makeStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('strips markdown code fences wrapping the JSON before parsing', async () => {
    const wrappedJson = '```json\n' + JSON.stringify(exerciseObj) + '\n```';
    stubFetchWithTextPayload(wrappedJson);
    const result = await generateCodingExercise('链表', 'easy', '链表');
    expect(result.title).toBe('链表题');
    expect(result.testCases).toHaveLength(1);
  });

  it('throws when all JSON repair attempts fail on invalid payload', async () => {
    stubFetchWithTextPayload('this is not json at all {{{{');
    await expect(generateCodingExercise('链表', 'easy', '链表')).rejects.toThrow(/格式错误|malformed JSON|未找到JSON|No JSON/);
  });
});
