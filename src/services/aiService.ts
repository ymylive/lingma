// AI出题服务 - 支持多种AI API

export interface GeneratedExercise {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  templates: {
    c?: string;
    cpp: string;
    java: string;
    python: string;
  };
  solutions: {
    c?: string;
    cpp: string;
    java: string;
    python: string;
  };
  testCases: {
    input: string;
    expectedOutput: string;
    description: string;
  }[];
  hints: string[];
  explanation: string;
}

export interface GeneratedFillBlank {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  codeTemplate: {
    c?: string;
    cpp: string;
    java: string;
    python: string;
  };
  blanks: {
    id: string;
    answer: string;
    hint: string;
  }[];
  explanation: string;
}

export interface AIConfig {
  provider: 'openai' | 'deepseek' | 'zhipu' | 'custom';
  apiKey: string;
  baseUrl?: string;
  model?: string;
}

// 代理服务地址 (API密钥存储在服务器端，前端不暴露)
const AI_PROXY_URL = import.meta.env.VITE_AI_PROXY_URL || 'https://lingma.cornna.xyz/api/ai';

// 默认配置 - 通过代理服务调用，无需在前端配置密钥
let aiConfig: AIConfig = {
  provider: 'custom',
  apiKey: '', // 密钥存储在代理服务器端
  baseUrl: AI_PROXY_URL,
  model: ''
};

// 获取/设置AI配置
export const getAIConfig = () => aiConfig;
export const setAIConfig = (config: Partial<AIConfig>) => {
  aiConfig = { ...aiConfig, ...config };
  // 保存到localStorage
  localStorage.setItem('ai_config', JSON.stringify(aiConfig));
};

// 从localStorage加载配置
export const loadAIConfig = () => {
  const saved = localStorage.getItem('ai_config');
  if (saved) {
    try {
      aiConfig = { ...aiConfig, ...JSON.parse(saved) };
    } catch (e) {
      console.error('Failed to load AI config:', e);
    }
  }
};

// 调用AI API (通过代理服务，无需前端密钥)
async function callAI(prompt: string): Promise<string> {
  const proxyUrl = AI_PROXY_URL;
  console.log('Calling AI Proxy:', proxyUrl);
  
  const messages = [
    {
      role: 'system',
      content: `你是一个专业的数据结构与算法教学助手，专门生成高质量的编程练习题。

【重要要求】
1. 所有题目必须是实际可运行的代码题，不要出概念填空题
2. 编程题必须有明确的输入输出，可以通过测试用例验证
3. 填空题填的必须是代码片段（如变量名、表达式、语句），不是概念词汇
4. 代码必须语法正确、可编译运行
5. 严格按照JSON格式输出，不要包含任何其他文字说明`
    },
    {
      role: 'user',
      content: prompt
    }
  ];
  
  const response = await fetch(proxyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('API Error:', error);
    throw new Error(`AI API 调用失败: ${response.status}`);
  }

  const data = await response.json();
  console.log('AI Response:', data);
  
  // 处理不同的响应格式
  let content = '';
  if (data.choices && data.choices[0]) {
    const choice = data.choices[0];
    // 处理 thinking 模型的响应格式
    if (choice.message) {
      content = choice.message.content || '';
      // 如果有 reasoning_content，取实际内容
      if (choice.message.reasoning_content) {
        content = choice.message.content || '';
      }
    } else if (choice.text) {
      content = choice.text;
    }
  }
  
  if (!content) {
    console.error('Empty content from API:', data);
    // 显示完整的响应结构帮助调试
    throw new Error(`AI 返回内容为空，响应结构: ${JSON.stringify(data).substring(0, 300)}`);
  }
  
  console.log('AI content:', content.substring(0, 500));
  return content;
}

// 生成编程题
export async function generateCodingExercise(
  topic: string,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  dataStructure: string = '链表'
): Promise<GeneratedExercise> {
  const prompt = `生成一道关于"${dataStructure} - ${topic}"的${
    difficulty === 'easy' ? '简单' : difficulty === 'medium' ? '中等' : '困难'
  }难度编程题。

【重要】严格按照以下JSON格式返回，不要添加任何额外文字：

{
  "title": "简短的题目标题（10字以内）",
  "description": "题目描述（纯文字，不要包含代码）：说明问题背景、输入输出要求",
  "difficulty": "${difficulty}",
  "templates": {
    "c": "C语言代码模板，包含函数签名和注释",
    "cpp": "C++代码模板",
    "java": "Java代码模板",
    "python": "Python代码模板"
  },
  "solutions": {
    "c": "完整的C语言答案代码",
    "cpp": "完整的C++答案代码",
    "java": "完整的Java答案代码",
    "python": "完整的Python答案代码"
  },
  "testCases": [
    {"input": "输入1", "expectedOutput": "输出1", "description": "测试1"},
    {"input": "输入2", "expectedOutput": "输出2", "description": "测试2"}
  ],
  "hints": ["提示1", "提示2"],
  "explanation": "解题思路"
}

【注意】
1. description字段只放文字描述，不要放代码
2. 代码模板放在templates字段
3. 答案代码放在solutions字段
4. 代码中换行用\\n表示
5. 只返回JSON，不要其他内容`;

  const response = await callAI(prompt);
  
  try {
    // 尝试解析JSON - 支持多种格式
    let jsonStr = response;
    
    // 移除可能的markdown代码块
    jsonStr = jsonStr.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    // 尝试提取JSON对象
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in response:', response);
      throw new Error('无法解析AI返回的JSON');
    }
    
    // 清理JSON字符串中的问题
    let cleanJson = jsonMatch[0];
    // 处理可能的控制字符
    cleanJson = cleanJson.replace(/[\x00-\x1F\x7F]/g, (char) => {
      if (char === '\n' || char === '\r' || char === '\t') return char;
      return '';
    });
    
    const result = JSON.parse(cleanJson);
    console.log('Parsed exercise:', result);
    return result;
  } catch (e) {
    console.error('Failed to parse AI response:', response);
    console.error('Parse error:', e);
    // 显示更详细的错误信息
    const preview = response.substring(0, 200);
    throw new Error(`AI返回格式错误: ${preview}...`);
  }
}

// 生成填空题
export async function generateFillBlank(
  topic: string,
  difficulty: 'easy' | 'medium' | 'hard' = 'easy',
  dataStructure: string = '链表'
): Promise<GeneratedFillBlank> {
  const prompt = `生成一道关于"${dataStructure} - ${topic}"的${
    difficulty === 'easy' ? '简单' : difficulty === 'medium' ? '中等' : '困难'
  }难度代码填空题。

【重要】严格按照JSON格式返回，不要添加额外文字：

{
  "title": "简短标题",
  "description": "说明这段代码的功能（纯文字）",
  "difficulty": "${difficulty}",
  "codeTemplate": {
    "c": "C语言代码，用___blank1___标记填空",
    "cpp": "C++代码，用___blank1___标记填空",
    "java": "Java代码",
    "python": "Python代码"
  },
  "blanks": [
    {"id": "blank1", "answer": "正确代码", "hint": "提示"},
    {"id": "blank2", "answer": "正确代码", "hint": "提示"}
  ],
  "explanation": "解释为什么这样填"
}

【填空规则】
1. 空格处必须填实际代码（变量、表达式、语句）
2. 禁止填概念词汇（如"栈"、"O(n)"）
3. 用___blank1___格式标记，数字递增
4. 代码换行用\\n表示
5. 只返回JSON`;

  const response = await callAI(prompt);
  
  try {
    // 尝试解析JSON - 支持多种格式
    let jsonStr = response;
    
    // 移除可能的markdown代码块
    jsonStr = jsonStr.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    // 尝试提取JSON对象
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in response:', response);
      throw new Error('无法解析AI返回的JSON');
    }
    
    // 清理JSON字符串中的问题
    let cleanJson = jsonMatch[0];
    cleanJson = cleanJson.replace(/[\x00-\x1F\x7F]/g, (char) => {
      if (char === '\n' || char === '\r' || char === '\t') return char;
      return '';
    });
    
    const result = JSON.parse(cleanJson);
    console.log('Parsed fill blank:', result);
    return result;
  } catch (e) {
    console.error('Failed to parse AI response:', response);
    console.error('Parse error:', e);
    const preview = response.substring(0, 200);
    throw new Error(`AI返回格式错误: ${preview}...`);
  }
}

// 批量生成题目
export async function generateExerciseSet(
  dataStructure: string,
  count: number = 5
): Promise<{ coding: GeneratedExercise[]; fillBlank: GeneratedFillBlank[] }> {
  const topics = getTopicsForDataStructure(dataStructure);
  const coding: GeneratedExercise[] = [];
  const fillBlank: GeneratedFillBlank[] = [];

  for (let i = 0; i < Math.min(count, topics.length); i++) {
    const difficulty = i < 2 ? 'easy' : i < 4 ? 'medium' : 'hard';
    
    if (i % 2 === 0) {
      const exercise = await generateCodingExercise(topics[i], difficulty as 'easy' | 'medium' | 'hard', dataStructure);
      coding.push(exercise);
    } else {
      const blank = await generateFillBlank(topics[i], difficulty as 'easy' | 'medium' | 'hard', dataStructure);
      fillBlank.push(blank);
    }
  }

  return { coding, fillBlank };
}

// 根据数据结构获取相关主题
function getTopicsForDataStructure(ds: string): string[] {
  const topicMap: Record<string, string[]> = {
    '链表': ['单链表插入', '单链表删除', '链表反转', '链表合并', '环形链表检测', '链表排序'],
    '栈': ['栈的基本操作', '括号匹配', '表达式求值', '最小栈', '栈排序'],
    '队列': ['队列基本操作', '循环队列', '优先队列', '双端队列', '队列实现栈'],
    '二叉树': ['树的遍历', '二叉搜索树', '树的深度', '路径求和', '树的构建'],
    '图': ['BFS遍历', 'DFS遍历', '最短路径', '拓扑排序', '连通分量'],
    '排序': ['冒泡排序', '快速排序', '归并排序', '堆排序', '插入排序'],
    '查找': ['二分查找', '哈希查找', '顺序查找', '插值查找'],
  };
  
  return topicMap[ds] || ['基本操作', '进阶应用', '综合练习'];
}
