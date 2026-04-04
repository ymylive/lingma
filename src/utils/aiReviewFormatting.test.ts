import { describe, expect, it } from 'vitest';
import { formatAiReviewItem, formatAiReviewItems } from './aiReviewFormatting';

describe('formatAiReviewItem', () => {
  it('formats Python-dict style review payloads into readable blocks', () => {
    const raw =
      "{'type': 'wrong_answer', 'checkpoint': '正常用例：一棵结构完整的二叉树', 'input': '7\\n1 2 4 5 3 6 7\\n4 2 5 1 6 3 7', 'expectedOutput': '4 5 2 6 7 3 1\\n3', 'actualOutput': '\\n0\\n0\\n0', 'message': '未生成后序遍历，也未计算正确高度。'}";

    const formatted = formatAiReviewItem(raw);

    expect(formatted).toContain('检查点：正常用例：一棵结构完整的二叉树');
    expect(formatted).toContain('问题：未生成后序遍历，也未计算正确高度。');
    expect(formatted).toContain('期望输出：\n4 5 2 6 7 3 1\n3');
    expect(formatted).toContain('实际输出：\n0\n0\n0');
    expect(formatted).not.toContain("{'type':");
  });

  it('keeps plain text review items intact while unescaping newlines', () => {
    const formatted = formatAiReviewItem('先修复最后一个分支\\n再重跑边界样例。');

    expect(formatted).toBe('先修复最后一个分支\n再重跑边界样例。');
  });

  it('uses English labels when requested', () => {
    const raw =
      '{"checkpoint": "Boundary case", "expectedOutput": "1", "actualOutput": "0", "message": "Missing empty-input guard."}';

    const formatted = formatAiReviewItem(raw, true);

    expect(formatted).toContain('Checkpoint: Boundary case');
    expect(formatted).toContain('Issue: Missing empty-input guard.');
    expect(formatted).toContain('Expected Output:\n1');
    expect(formatted).toContain('Actual Output:\n0');
  });
});

describe('formatAiReviewItems', () => {
  it('splits combined bullet payloads into multiple review items', () => {
    const raw = [
      "- {'checkpoint': '边界用例：只有一个结点', 'message': '单结点树应输出该结点。'}\n- {'checkpoint': '特殊用例：完全向右倾斜', 'message': '未处理链式结构。'}",
    ];

    const formatted = formatAiReviewItems(raw);

    expect(formatted).toEqual([
      '检查点：边界用例：只有一个结点\n问题：单结点树应输出该结点。',
      '检查点：特殊用例：完全向右倾斜\n问题：未处理链式结构。',
    ]);
  });
});
