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
  provider: 'openai' | 'deepseek' | 'zhipu' | 'aabao' | 'custom';
  apiKey: string;
  baseUrl?: string;
  model?: string;
}

// 代理服务地址 (API密钥存储在服务器端，前端不暴露)
// 本地开发时使用 localhost:3001，生产环境使用远程服务器
const AI_PROXY_URL = import.meta.env.DEV 
  ? 'http://localhost:3001/api/ai' 
  : (import.meta.env.VITE_AI_PROXY_URL || 'https://lingma.cornna.xyz/api/ai');

// AI服务商列表
export const PROVIDERS = [
  { id: 'deepseek', name: 'DeepSeek', baseUrl: 'https://api.deepseek.com/v1', model: 'deepseek-chat' },
  { id: 'openai', name: 'OpenAI', baseUrl: 'https://api.openai.com/v1', model: 'gpt-3.5-turbo' },
  { id: 'zhipu', name: '智谱AI', baseUrl: 'https://open.bigmodel.cn/api/paas/v4', model: 'glm-4' },
  { id: 'aabao', name: 'AABao AI', baseUrl: 'https://api.aabao.top', model: 'deepseek-v3.2-thinking' },
  { id: 'custom', name: '自定义', baseUrl: '', model: '' },
];

// 默认配置 - 使用AABao AI服务
let aiConfig: AIConfig = {
  provider: 'aabao',
  apiKey: 'sk-9vJdSQ3WTnQWwW02wJBoGepCZDE3QO5mLi2dIplmBxXxhgIg',
  baseUrl: 'https://api.aabao.top/v1/chat/completions',
  model: 'deepseek-v3.2-thinking'
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

// 调用AI API
async function callAI(prompt: string): Promise<string> {
  // 优先使用配置的API，否则使用代理
  const useDirectApi = aiConfig.apiKey && aiConfig.baseUrl;
  const apiUrl = useDirectApi ? aiConfig.baseUrl! : AI_PROXY_URL;
  console.log('Calling AI API:', apiUrl, 'Model:', aiConfig.model);
  
  const messages = [
    {
      role: 'system',
      content: `你是一个专业的ACM/OJ竞赛题目出题专家，严格遵循国际编程竞赛标准格式生成高质量编程练习题。

【ACM/OJ标准规范 - 必须严格遵守】

一、题目描述规范：
1. 题目背景：简洁明了，说明问题场景
2. 问题描述：清晰准确，无歧义
3. 输入格式：详细说明每行输入的含义、数据类型、取值范围
4. 输出格式：明确输出要求，包括精度、格式
5. 数据范围：明确给出数据规模和边界条件

二、输入格式规范：
- 第一行通常是数据组数T或数组长度n
- 数组：第一行长度n，第二行n个空格分隔的元素
- 多参数：每个参数独占一行
- 字符串：直接输入，不加引号
- 矩阵：第一行m n，接下来m行每行n个元素
- 链表：第一行长度n，第二行n个节点值
- 二叉树：层序遍历，null用-1或N表示

三、输出格式规范：
- 纯结果输出，无多余信息
- 多个值用空格分隔
- 数组结果直接输出元素，不加[]括号
- 布尔值输出"true"/"false"或"Yes"/"No"
- 浮点数按要求保留小数位

四、代码规范：
1. 必须是完整可编译运行的程序
2. 包含必要的头文件/import
3. 使用标准输入输出（stdin/stdout）
4. C++: cin/cout, Java: Scanner/System.out, Python: input()/print()
5. 主函数命名：C++为main，Java类名为Main

五、测试用例规范：
- 至少3个测试用例
- 包含：基本功能测试、边界条件测试、特殊情况测试
- input和expectedOutput必须是纯文本格式

六、JSON输出：严格按照要求格式，不包含任何其他文字说明`
    },
    {
      role: 'user',
      content: prompt
    }
  ];
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  // 如果有API密钥，添加认证头
  if (aiConfig.apiKey) {
    headers['Authorization'] = `Bearer ${aiConfig.apiKey}`;
  }
  
  const body = aiConfig.apiKey ? {
    model: aiConfig.model || 'deepseek-v3.2-thinking',
    messages,
    max_tokens: 4096,
    temperature: 0.7,
  } : { messages };
  
  // thinking模型需要更长超时时间（5分钟）
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 300000);
  
  let response: Response;
  try {
    response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('AI API 请求超时，请稍后重试');
    }
    throw error;
  }

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
  const difficultyText = difficulty === 'easy' ? '简单' : difficulty === 'medium' ? '中等' : '困难';
  const prompt = `请生成一道严格符合ACM/OJ竞赛标准的"${dataStructure} - ${topic}"${difficultyText}难度编程题。

【题目要求】
- 知识点：${dataStructure}
- 主题：${topic}  
- 难度：${difficultyText}（${difficulty === 'easy' ? '基础操作，直接实现' : difficulty === 'medium' ? '需要算法设计，有一定技巧' : '复杂算法，需要优化或高级数据结构'}）

【ACM/OJ标准格式 - 必须严格遵守】

1. description格式（必须包含以下所有段落，使用【】标记）：
   【题目描述】清晰描述问题背景、任务目标、约束条件
   【输入格式】每行输入的精确含义，数据类型
   【输出格式】输出的精确格式要求
   【数据范围】所有变量的取值范围，使用数学符号如 1 ≤ n ≤ 10^5
   【样例说明】（可选）解释样例的推导过程

2. templates代码模板（OJ标准格式）：
   - 必须是完整可编译的main函数程序
   - 包含标准输入读取代码（scanf/cin/Scanner/input）
   - 用 // TODO: 标记学生需要填写的核心算法位置
   - 包含标准输出代码框架

3. solutions完整答案：
   - 可直接提交到OJ并AC的完整代码
   - 包含完整的输入解析和输出格式化
   - 算法正确，效率满足数据范围要求

4. testCases测试用例（至少3个）：
   - input: 纯文本，多行用\\n分隔
   - expectedOutput: 精确匹配的期望输出
   - 必须包含：正常用例、边界用例（最小/最大值）、特殊用例

【返回JSON格式】只返回JSON，不要其他文字：
{
  "title": "${topic}相关的简短标题",
  "description": "【题目描述】\\n具体问题描述...\\n\\n【输入格式】\\n第一行：整数n，表示...（1 ≤ n ≤ ...）\\n第二行：n个整数a1,a2,...,an\\n\\n【输出格式】\\n输出一行，表示...\\n\\n【数据范围】\\n- 1 ≤ n ≤ 10^5\\n- -10^9 ≤ ai ≤ 10^9",
  "difficulty": "${difficulty}",
  "templates": {
    "c": "#include <stdio.h>\\n\\nint main() {\\n    int n;\\n    scanf(\\"%d\\", &n);\\n    int arr[100005];\\n    for(int i = 0; i < n; i++) scanf(\\"%d\\", &arr[i]);\\n    \\n    // TODO: 实现算法\\n    \\n    printf(\\"%d\\\\n\\\", result);\\n    return 0;\\n}",
    "cpp": "#include <iostream>\\n#include <vector>\\nusing namespace std;\\n\\nint main() {\\n    int n;\\n    cin >> n;\\n    vector<int> arr(n);\\n    for(int i = 0; i < n; i++) cin >> arr[i];\\n    \\n    // TODO: 实现算法\\n    \\n    cout << result << endl;\\n    return 0;\\n}",
    "java": "import java.util.*;\\n\\npublic class Main {\\n    public static void main(String[] args) {\\n        Scanner sc = new Scanner(System.in);\\n        int n = sc.nextInt();\\n        int[] arr = new int[n];\\n        for(int i = 0; i < n; i++) arr[i] = sc.nextInt();\\n        \\n        // TODO: 实现算法\\n        \\n        System.out.println(result);\\n        sc.close();\\n    }\\n}",
    "python": "n = int(input())\\narr = list(map(int, input().split()))\\n\\n# TODO: 实现算法\\n\\nprint(result)"
  },
  "solutions": {
    "c": "完整可AC的C代码",
    "cpp": "完整可AC的C++代码",
    "java": "完整可AC的Java代码",
    "python": "完整可AC的Python代码"
  },
  "testCases": [
    {"input": "5\\n1 2 3 4 5", "expectedOutput": "15", "description": "基本功能测试"},
    {"input": "1\\n100", "expectedOutput": "100", "description": "边界：单元素"},
    {"input": "3\\n-1 0 1", "expectedOutput": "0", "description": "特殊：含负数和零"}
  ],
  "hints": ["提示1：分析问题本质", "提示2：考虑使用的数据结构或算法"],
  "explanation": "【解题思路】\\n分析...\\n\\n【算法设计】\\n1. ...\\n2. ...\\n\\n【时间复杂度】O(n)\\n【空间复杂度】O(1)"
}`;

  const response = await callAI(prompt);
  return parseAIJsonResponse(response, 'coding exercise');
}

// 生成填空题 - 函数实现填空格式
export async function generateFillBlank(
  topic: string,
  difficulty: 'easy' | 'medium' | 'hard' = 'easy',
  dataStructure: string = '链表'
): Promise<GeneratedFillBlank> {
  const prompt = `生成一道关于"${dataStructure} - ${topic}"的${
    difficulty === 'easy' ? '简单' : difficulty === 'medium' ? '中等' : '困难'
  }难度【函数实现填空题】。

【题目格式要求】
这是一道需要补全多个函数体的填空题，类似考试题：
- 给出完整的程序框架（包含结构体定义、main函数等）
- 需要学生填写的是【整个函数的实现代码】，不是单个表达式
- 每个需要填写的函数用 ___FUNC1___ ___FUNC2___ 等标记
- 每个空需要填写3-10行代码

【示例格式】
#include <stdio.h>
struct Node {
    int data;
    struct Node* next;
};
// 函数1：创建节点
struct Node* createNode(int val) {
___FUNC1___
}
// 函数2：插入节点
void insert(struct Node** head, int val) {
___FUNC2___
}
int main() {
    // main函数已实现
}

【JSON格式返回】
{
  "title": "简短标题（如：单链表基本操作）",
  "description": "完成以下程序中标记的函数实现",
  "difficulty": "${difficulty}",
  "codeTemplate": {
    "c": "完整C语言程序，函数体用___FUNC1___等标记"
  },
  "blanks": [
    {"id": "FUNC1", "answer": "完整的函数实现代码（多行）", "hint": "函数功能提示"},
    {"id": "FUNC2", "answer": "完整的函数实现代码（多行）", "hint": "函数功能提示"}
  ],
  "explanation": "解释每个函数的实现思路"
}

【重要规则】
1. 必须有2-4个需要填写的函数
2. 每个函数答案是完整的函数体代码（多行）
3. 给出的代码框架必须完整可编译（填空后）
4. 代码换行用\\n表示
5. 只返回JSON，不要其他文字`;

  const response = await callAI(prompt);
  return parseAIJsonResponse(response, 'fill blank');
}

// 通用JSON解析函数 - 处理AI返回中的换行问题
function parseAIJsonResponse(response: string, type: string): any {
  console.log(`Parsing ${type}, response length:`, response.length);
  
  let jsonStr = response;
  
  // 移除可能的markdown代码块
  jsonStr = jsonStr.replace(/```json\s*/gi, '').replace(/```\s*/gi, '');
  
  // 找到JSON的起始和结束位置
  const startIdx = jsonStr.indexOf('{');
  const endIdx = jsonStr.lastIndexOf('}');
  
  if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
    console.error(`No JSON found in ${type} response`);
    throw new Error('AI返回中未找到JSON');
  }
  
  const rawJson = jsonStr.substring(startIdx, endIdx + 1);
  console.log('Extracted JSON length:', rawJson.length);
  
  // 方法1: 直接尝试解析
  try {
    const result = JSON.parse(rawJson);
    console.log(`Parsed ${type} directly`);
    return result;
  } catch (e1) {
    console.log('Direct parse failed, trying fix...', (e1 as Error).message);
  }
  
  // 方法2: 智能处理字符串内的换行符
  try {
    let fixed = '';
    let inString = false;
    let escape = false;
    
    for (let i = 0; i < rawJson.length; i++) {
      const char = rawJson[i];
      
      if (escape) {
        fixed += char;
        escape = false;
        continue;
      }
      
      if (char === '\\') {
        fixed += char;
        escape = true;
        continue;
      }
      
      if (char === '"') {
        inString = !inString;
        fixed += char;
        continue;
      }
      
      if (inString) {
        // 在字符串内部，转义实际换行符
        if (char === '\n') {
          fixed += '\\n';
        } else if (char === '\r') {
          // 忽略CR
        } else if (char === '\t') {
          fixed += '\\t';
        } else {
          fixed += char;
        }
      } else {
        // 在字符串外部，直接添加（包括换行，这在JSON中是合法的）
        fixed += char;
      }
    }
    
    const result = JSON.parse(fixed);
    console.log(`Parsed ${type} with smart fix`);
    return result;
  } catch (e2) {
    console.error('Smart fix failed:', e2);
  }
  
  // 方法3: 移除字符串外的换行，保留字符串内的转义
  try {
    let fixed = '';
    let inString = false;
    let escape = false;
    
    for (let i = 0; i < rawJson.length; i++) {
      const char = rawJson[i];
      
      if (escape) {
        fixed += char;
        escape = false;
        continue;
      }
      
      if (char === '\\') {
        fixed += char;
        escape = true;
        continue;
      }
      
      if (char === '"') {
        inString = !inString;
        fixed += char;
        continue;
      }
      
      if (char === '\n' || char === '\r') {
        if (inString) {
          fixed += '\\n';
        }
        // 字符串外的换行直接跳过
        continue;
      }
      
      fixed += char;
    }
    
    const result = JSON.parse(fixed);
    console.log(`Parsed ${type} with compact fix`);
    return result;
  } catch (e3) {
    console.error('Compact fix failed:', e3);
  }
  
  const preview = rawJson.substring(0, 300);
  throw new Error(`AI返回格式错误: ${preview}...`);
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
