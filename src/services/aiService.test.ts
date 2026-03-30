import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
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
