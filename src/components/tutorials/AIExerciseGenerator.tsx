import { useState, useEffect } from 'react';
import {
  generateCodingExercise,
  generateFillBlank,
  getAIConfig,
  setAIConfig,
  loadAIConfig,
  type GeneratedExercise,
  type GeneratedFillBlank,
  type AIConfig,
} from '../../services/aiService';
import CodingExercise, { FillInBlank } from './CodingExercise';

const PROVIDERS = [
  { id: 'aabao', name: 'AABao AI', baseUrl: 'https://api.aabao.top/v1/chat/completions', model: 'deepseek-v3.2-thinking' },
  { id: 'deepseek', name: 'DeepSeek', baseUrl: 'https://api.deepseek.com/v1', model: 'deepseek-chat' },
  { id: 'openai', name: 'OpenAI', baseUrl: 'https://api.openai.com/v1', model: 'gpt-3.5-turbo' },
  { id: 'zhipu', name: '智谱AI', baseUrl: 'https://open.bigmodel.cn/api/paas/v4', model: 'glm-4' },
  { id: 'custom', name: '自定义', baseUrl: '', model: '' },
];

// 知识点分类 - 扩展至C语言基础和更多内容
const CATEGORIES = [
  { id: 'c-basic', name: 'C语言基础', icon: '🔧', group: 'C语言' },
  { id: 'c-pointer', name: '指针与内存', icon: '📍', group: 'C语言' },
  { id: 'c-struct', name: '结构体与文件', icon: '📦', group: 'C语言' },
  { id: '链表', name: '链表', icon: '🔗', group: '数据结构' },
  { id: '栈', name: '栈', icon: '📚', group: '数据结构' },
  { id: '队列', name: '队列', icon: '🚶', group: '数据结构' },
  { id: '二叉树', name: '二叉树', icon: '🌳', group: '数据结构' },
  { id: '图', name: '图', icon: '🕸️', group: '数据结构' },
  { id: '排序', name: '排序算法', icon: '📊', group: '算法' },
  { id: '查找', name: '查找算法', icon: '🔍', group: '算法' },
  { id: '递归', name: '递归与分治', icon: '🔄', group: '算法' },
  { id: '动态规划', name: '动态规划', icon: '📈', group: '算法' },
  { id: '贪心', name: '贪心算法', icon: '💰', group: '算法' },
];

const TOPICS: Record<string, string[]> = {
  // C语言基础
  'c-basic': ['变量与数据类型', '运算符与表达式', '条件语句', '循环结构', '数组操作', '函数定义与调用', '字符串处理'],
  'c-pointer': ['指针基础', '指针与数组', '指针运算', '动态内存分配', '多级指针', '函数指针'],
  'c-struct': ['结构体定义', '结构体数组', '结构体指针', '共用体', '枚举类型', '文件读写', '二进制文件操作'],
  // 数据结构
  '链表': ['单链表插入', '单链表删除', '链表反转', '链表合并', '环形链表检测', '双向链表'],
  '栈': ['栈的基本操作', '括号匹配', '表达式求值', '最小栈实现', '栈排序'],
  '队列': ['队列基本操作', '循环队列', '双端队列', '用队列实现栈', '优先队列'],
  '二叉树': ['前序遍历', '中序遍历', '后序遍历', '层序遍历', '二叉搜索树', '平衡树判断'],
  '图': ['BFS广度优先', 'DFS深度优先', '最短路径', '拓扑排序', '最小生成树'],
  // 算法
  '排序': ['冒泡排序', '选择排序', '插入排序', '快速排序', '归并排序', '堆排序', '计数排序'],
  '查找': ['顺序查找', '二分查找', '哈希表查找', '插值查找'],
  '递归': ['斐波那契数列', '汉诺塔', '全排列', '组合问题', '回溯算法'],
  '动态规划': ['最长公共子序列', '背包问题', '最长递增子序列', '编辑距离', '矩阵链乘法'],
  '贪心': ['活动选择', '零钱兑换', '任务调度', '哈夫曼编码'],
};

export default function AIExerciseGenerator() {
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState<AIConfig>(getAIConfig());
  const [dataStructure, setDataStructure] = useState('链表');
  const [topic, setTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [exerciseType, setExerciseType] = useState<'coding' | 'fillblank'>('coding');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedExercise, setGeneratedExercise] = useState<GeneratedExercise | null>(null);
  const [generatedFillBlank, setGeneratedFillBlank] = useState<GeneratedFillBlank | null>(null);

  useEffect(() => {
    loadAIConfig();
    setConfig(getAIConfig());
  }, []);

  const handleSaveConfig = () => {
    setAIConfig(config);
    setShowConfig(false);
  };

  const handleGenerate = async () => {
    const finalTopic = topic || customTopic || '基本操作';
    
    // API密钥已在服务器端配置，无需前端验证

    setLoading(true);
    setError('');
    setGeneratedExercise(null);
    setGeneratedFillBlank(null);

    try {
      if (exerciseType === 'coding') {
        const exercise = await generateCodingExercise(finalTopic, difficulty, dataStructure);
        setGeneratedExercise(exercise);
      } else {
        const fillBlank = await generateFillBlank(finalTopic, difficulty, dataStructure);
        setGeneratedFillBlank(fillBlank);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI配置面板 */}
      {showConfig && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span>⚙️</span> AI API 配置
            </h3>
            
            <div className="space-y-4">
              {/* 提供商选择 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">AI 服务商</label>
                <div className="grid grid-cols-2 gap-2">
                  {PROVIDERS.map(p => (
                    <button
                      key={p.id}
                      onClick={() => setConfig({ 
                        ...config, 
                        provider: p.id as AIConfig['provider'],
                        baseUrl: p.baseUrl,
                        model: p.model
                      })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        config.provider === p.id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* API密钥 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">API 密钥</label>
                <input
                  type="password"
                  value={config.apiKey}
                  onChange={e => setConfig({ ...config, apiKey: e.target.value })}
                  placeholder="输入你的API密钥"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-slate-500">
                  当前默认通过服务端代理请求 AI，此处输入不会持久化保存
                </p>
              </div>

              {/* 自定义配置 */}
              {config.provider === 'custom' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">API 地址</label>
                    <input
                      type="text"
                      value={config.baseUrl}
                      onChange={e => setConfig({ ...config, baseUrl: e.target.value })}
                      placeholder="https://api.example.com/v1"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">模型名称</label>
                    <input
                      type="text"
                      value={config.model}
                      onChange={e => setConfig({ ...config, model: e.target.value })}
                      placeholder="gpt-3.5-turbo"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowConfig(false)}
                className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200"
              >
                取消
              </button>
              <button
                onClick={handleSaveConfig}
                className="flex-1 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
              >
                保存配置
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 生成器主界面 */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🤖</span>
            <div>
              <h2 className="text-xl font-bold">AI 智能出题</h2>
              <p className="text-white/70 text-sm">根据主题自动生成编程练习题</p>
            </div>
          </div>
          <button
            onClick={() => setShowConfig(true)}
            className="px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
          >
            ⚙️ 配置API
          </button>
        </div>

        {/* 选项区 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 知识点分类 */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">知识点</label>
            <select
              value={dataStructure}
              onChange={e => { setDataStructure(e.target.value); setTopic(''); }}
              className="w-full px-4 py-2 bg-white/20 rounded-lg text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <optgroup label="C语言" className="text-slate-800">
                {CATEGORIES.filter(c => c.group === 'C语言').map(c => (
                  <option key={c.id} value={c.id} className="text-slate-800">{c.icon} {c.name}</option>
                ))}
              </optgroup>
              <optgroup label="数据结构" className="text-slate-800">
                {CATEGORIES.filter(c => c.group === '数据结构').map(c => (
                  <option key={c.id} value={c.id} className="text-slate-800">{c.icon} {c.name}</option>
                ))}
              </optgroup>
              <optgroup label="算法" className="text-slate-800">
                {CATEGORIES.filter(c => c.group === '算法').map(c => (
                  <option key={c.id} value={c.id} className="text-slate-800">{c.icon} {c.name}</option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* 主题 */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">题目主题</label>
            <select
              value={topic}
              onChange={e => setTopic(e.target.value)}
              className="w-full px-4 py-2 bg-white/20 rounded-lg text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="" className="text-slate-800">自定义主题</option>
              {(TOPICS[dataStructure] || []).map(t => (
                <option key={t} value={t} className="text-slate-800">{t}</option>
              ))}
            </select>
          </div>

          {/* 难度 */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">难度</label>
            <div className="flex gap-1">
              {[
                { id: 'easy', label: '⭐简单' },
                { id: 'medium', label: '⭐⭐中等' },
                { id: 'hard', label: '⭐⭐⭐困难' },
              ].map(d => (
                <button
                  key={d.id}
                  onClick={() => setDifficulty(d.id as 'easy' | 'medium' | 'hard')}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                    difficulty === d.id
                      ? 'bg-white text-indigo-600'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* 题型 */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">题型</label>
            <div className="flex gap-2">
              <button
                onClick={() => setExerciseType('coding')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  exerciseType === 'coding'
                    ? 'bg-white text-indigo-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                💻 编程题
              </button>
              <button
                onClick={() => setExerciseType('fillblank')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  exerciseType === 'fillblank'
                    ? 'bg-white text-indigo-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                ✏️ 填空题
              </button>
            </div>
          </div>
        </div>

        {/* 自定义主题输入 */}
        {!topic && (
          <div className="mt-4">
            <input
              type="text"
              value={customTopic}
              onChange={e => setCustomTopic(e.target.value)}
              placeholder="输入自定义题目主题，例如：链表反转的递归实现"
              className="w-full px-4 py-3 bg-white/20 rounded-lg text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        )}

        {/* 生成按钮 */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full mt-4 py-3 bg-white text-indigo-600 rounded-lg font-bold text-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="animate-spin">⏳</span>
              AI 正在生成题目...
            </>
          ) : (
            <>
              <span>✨</span>
              生成{exerciseType === 'coding' ? '编程题' : '填空题'}
            </>
          )}
        </button>

        {/* 错误提示 */}
        {error && (
          <div className="mt-4 p-3 bg-rose-500/20 border border-rose-400/30 rounded-lg text-rose-100">
            ❌ {error}
          </div>
        )}
      </div>

      {/* 生成的题目 */}
      {generatedExercise && (
        <div className="animate-fadeIn">
          <div className="mb-4 flex items-center gap-2 text-emerald-600">
            <span>✅</span>
            <span className="font-medium">题目已生成！</span>
          </div>
          <CodingExercise
            title={generatedExercise.title}
            description={generatedExercise.description}
            difficulty={generatedExercise.difficulty}
            templates={generatedExercise.templates}
            solutions={generatedExercise.solutions}
            testCases={generatedExercise.testCases}
            hints={generatedExercise.hints}
            explanation={generatedExercise.explanation}
          />
        </div>
      )}

      {generatedFillBlank && (
        <div className="animate-fadeIn">
          <div className="mb-4 flex items-center gap-2 text-emerald-600">
            <span>✅</span>
            <span className="font-medium">填空题已生成！</span>
          </div>
          <FillInBlank
            title={generatedFillBlank.title}
            description={generatedFillBlank.description}
            difficulty={generatedFillBlank.difficulty}
            codeTemplate={generatedFillBlank.codeTemplate}
            blanks={generatedFillBlank.blanks}
            explanation={generatedFillBlank.explanation}
          />
        </div>
      )}
    </div>
  );
}
