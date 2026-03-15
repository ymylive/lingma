export const serviceTranslationsEn: Record<string, string> = {
  // judgeService — status messages that may arrive from the server
  '内存超限': 'Memory Limit Exceeded',
  '所有测试已通过，可以进入下一层。': 'All tests passed. You can move to the next stage.',
  '仍有测试未通过，先修复失败检查点再继续。': 'Some tests are still failing. Fix the failed checkpoints before moving on.',

  // judgeService — error template fragments
  '判题服务异常': 'Judge service error',

  // mindMapService — user-facing error / fallback labels
  'AI 未返回有效 JSON': 'AI did not return valid JSON',
  'AI 请求失败': 'AI request failed',
  'AI 返回内容为空': 'AI returned empty content',
  'AI 未返回有效扩写内容': 'AI did not return a valid note',
  '学习主题': 'Study Topic',
  '节点': 'Node',

  // ProtectedRoute — already in commonTranslations but kept as safety net
  '正在验证登录状态...': 'Checking authentication status...',

  // Header — dropdown labels used via isEnglish ternary
  '已修课程': 'Lessons Done',
  '完成练习': 'Exercises Done',
  '学习中心': 'Learning Center',
};

export const servicePatternsEn: Array<{ pattern: RegExp; replace: (...args: string[]) => string }> = [
  {
    pattern: /^判题服务异常[：:]\s*(.+)$/,
    replace: (detail) => `Judge service error: ${detail}`,
  },
  {
    pattern: /^AI 请求失败[：:]\s*(.+)$/,
    replace: (detail) => `AI request failed: ${detail}`,
  },
  {
    pattern: /^节点\s*(\d+)$/,
    replace: (index) => `Node ${index}`,
  },
];
