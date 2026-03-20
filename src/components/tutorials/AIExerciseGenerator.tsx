import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bot,
  ChevronDown,
  FileCode,
  FileQuestionMark,
  LoaderCircle,
  RefreshCw,
  Settings2,
  Sparkles,
  WandSparkles,
} from 'lucide-react';
import {
  clearAIConfig,
  DEFAULT_AI_MODEL,
  generateCodingExercise,
  generateFillBlank,
  getAIConfig,
  loadAIConfig,
  setAIConfig,
  type AIConfig,
  type GeneratedExercise,
  type GeneratedFillBlank,
} from '../../services/aiService';
import { useI18n } from '../../contexts/I18nContext';
import { useUser } from '../../contexts/UserContext';
import CodingExercise, { FillInBlank } from './CodingExercise';
import { buildAiDefaults, getSkillLevelMeta } from '../../utils/userPersonalization';
import { getTargetLanguageMeta } from '../../utils/targetLanguages';

const CATEGORIES = [
  { id: 'c-basic', name: 'C语言基础', group: 'C语言' },
  { id: 'c-pointer', name: '指针与内存', group: 'C语言' },
  { id: 'c-struct', name: '结构体与文件', group: 'C语言' },
  { id: '链表', name: '链表', group: '数据结构' },
  { id: '栈', name: '栈', group: '数据结构' },
  { id: '队列', name: '队列', group: '数据结构' },
  { id: '二叉树', name: '二叉树', group: '数据结构' },
  { id: '图', name: '图', group: '数据结构' },
  { id: '排序', name: '排序算法', group: '算法' },
  { id: '查找', name: '查找算法', group: '算法' },
  { id: '递归', name: '递归与分治', group: '算法' },
  { id: '动态规划', name: '动态规划', group: '算法' },
  { id: '贪心', name: '贪心算法', group: '算法' },
] as const;

const TOPICS: Record<string, string[]> = {
  'c-basic': ['变量与数据类型', '运算符与表达式', '条件语句', '循环结构', '数组操作', '函数定义与调用', '字符串处理'],
  'c-pointer': ['指针基础', '指针与数组', '指针运算', '动态内存分配', '多级指针', '函数指针'],
  'c-struct': ['结构体定义', '结构体数组', '结构体指针', '共用体', '枚举类型', '文件读写', '二进制文件操作'],
  '链表': ['单链表插入', '单链表删除', '链表反转', '链表合并', '环形链表检测', '双向链表'],
  '栈': ['栈的基本操作', '括号匹配', '表达式求值', '最小栈实现', '栈排序'],
  '队列': ['队列基本操作', '循环队列', '双端队列', '用队列实现栈', '优先队列'],
  '二叉树': ['前序遍历', '中序遍历', '后序遍历', '层序遍历', '二叉搜索树', '平衡树判断'],
  '图': ['BFS 广度优先', 'DFS 深度优先', '最短路径', '拓扑排序', '最小生成树'],
  '排序': ['冒泡排序', '选择排序', '插入排序', '快速排序', '归并排序', '堆排序', '计数排序'],
  '查找': ['顺序查找', '二分查找', '哈希表查找', '插值查找'],
  '递归': ['斐波那契数列', '汉诺塔', '全排列', '组合问题', '回溯算法'],
  '动态规划': ['最长公共子序列', '背包问题', '最长递增子序列', '编辑距离', '矩阵链乘法'],
  '贪心': ['活动选择', '零钱兑换', '任务调度', '哈夫曼编码'],
};

const LEARNING_STATE_LABELS = {
  onboarding: '起步期',
  review: '复盘期',
  steady: '稳步期',
  challenge: '挑战期',
} as const;

type Difficulty = 'easy' | 'medium' | 'hard';
type ExerciseType = 'coding' | 'fillblank';

interface GeneratorOption {
  value: string;
  label: string;
}

interface GeneratorOptionGroup {
  label: string;
  options: GeneratorOption[];
}

function GeneratorSelect({
  label,
  placeholder,
  value,
  groups,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  groups: GeneratorOptionGroup[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const selected = useMemo(
    () => groups.flatMap((group) => group.options).find((option) => option.value === value),
    [groups, value],
  );

  useEffect(() => {
    if (!open) return undefined;
    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [open]);

  return (
    <div className={`relative ${open ? 'z-40' : 'z-0'}`} ref={containerRef}>
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</label>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((current) => !current)}
        className={`flex min-h-[48px] w-full cursor-pointer items-center justify-between rounded-2xl border bg-white px-4 py-3 text-left shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 dark:bg-slate-900 ${
          open
            ? 'border-indigo-400 ring-2 ring-indigo-500/15 dark:border-indigo-400/70 dark:ring-indigo-500/20'
            : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-indigo-500/50 dark:hover:bg-slate-800'
        }`}
      >
        <span className={`truncate text-sm font-medium ${selected ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'}`}>
          {selected?.label || placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 dark:text-slate-500 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_60px_-32px_rgba(15,23,42,0.45)] dark:border-slate-700 dark:bg-slate-900">
          <div className="max-h-72 overflow-y-auto p-2">
            {groups.map((group) => (
              <div key={group.label || 'default'} className="pb-2 last:pb-0">
                {group.label ? (
                  <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                    {group.label}
                  </div>
                ) : null}
                <div className="space-y-1">
                  {group.options.map((option) => {
                    const active = option.value === value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          onChange(option.value);
                          setOpen(false);
                        }}
                        className={`flex min-h-[44px] w-full cursor-pointer items-center rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                          active
                            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-200'
                            : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className="truncate">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AIExerciseGenerator() {
  const { user, progress } = useUser();
  const { isEnglish, t } = useI18n();
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState<AIConfig>(getAIConfig());
  const [dataStructure, setDataStructure] = useState('链表');
  const [topic, setTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [exerciseType, setExerciseType] = useState<ExerciseType>('coding');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedExercise, setGeneratedExercise] = useState<GeneratedExercise | null>(null);
  const [generatedFillBlank, setGeneratedFillBlank] = useState<GeneratedFillBlank | null>(null);
  const [hasManualDifficulty, setHasManualDifficulty] = useState(false);
  const [hasManualCategory, setHasManualCategory] = useState(false);

  const aiDefaults = buildAiDefaults(progress, user?.skillLevel || progress.skillLevel);
  const levelMeta = getSkillLevelMeta(aiDefaults.effectiveLevel);
  const targetLanguageMeta = getTargetLanguageMeta(user?.targetLanguage);
  const learningStateLabel = t(LEARNING_STATE_LABELS[aiDefaults.learningState]);
  const categoryLabel = (value: string) => t(CATEGORIES.find((item) => item.id === value)?.name || value);
  const profileHint = [
    isEnglish ? `Current effective level: ${t(levelMeta.label)}` : `用户当前有效水平：${t(levelMeta.label)}`,
    isEnglish ? `Current learning state: ${learningStateLabel}` : `当前学习状态：${learningStateLabel}`,
    isEnglish ? `Recommended topics: ${aiDefaults.suggestedCategories.slice(0, 3).map((item) => categoryLabel(item)).join(', ')}` : `系统推荐专题：${aiDefaults.suggestedCategories.slice(0, 3).map((item) => categoryLabel(item)).join('、')}`,
    isEnglish ? `Primary programming language: ${targetLanguageMeta.label}` : `主学编程语言：${targetLanguageMeta.label}`,
    isEnglish ? `Current requested topic: ${categoryLabel(dataStructure)}` : `当前出题专题：${categoryLabel(dataStructure)}`,
  ].join('\n');

  const categoryGroups = useMemo<GeneratorOptionGroup[]>(() => {
    const grouped = new Map<string, GeneratorOption[]>();
    for (const item of CATEGORIES) {
      const groupLabel = t(item.group);
      const options = grouped.get(groupLabel) || [];
      options.push({ value: item.id, label: t(item.name) });
      grouped.set(groupLabel, options);
    }
    return Array.from(grouped.entries()).map(([label, options]) => ({ label, options }));
  }, [t]);

  const topicGroups = useMemo<GeneratorOptionGroup[]>(() => {
    const options = (TOPICS[dataStructure] || []).map((item) => ({ value: item, label: t(item) }));
    if (!options.length) return [];
    return [{ label: isEnglish ? 'Suggested Topics' : '推荐主题', options }];
  }, [dataStructure, isEnglish, t]);

  const generatorSurfaceClass =
    'relative isolate overflow-visible rounded-[28px] border border-slate-200/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.97),rgba(241,245,249,0.92)),radial-gradient(circle_at_top_right,rgba(79,70,229,0.16),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.12),transparent_30%)] p-5 shadow-[0_30px_80px_-48px_rgba(15,23,42,0.45)] dark:border-slate-700/80 dark:bg-[linear-gradient(145deg,rgba(15,23,42,0.96),rgba(15,23,42,0.9)),radial-gradient(circle_at_top_right,rgba(99,102,241,0.2),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.15),transparent_34%)] sm:p-6';
  const fieldPanelClass =
    'relative rounded-2xl border border-slate-200/80 bg-white/85 p-4 shadow-sm backdrop-blur-sm focus-within:z-30 dark:border-slate-700/80 dark:bg-slate-900/70';
  const inputClass =
    'min-h-[44px] w-full rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500';

  useEffect(() => {
    loadAIConfig();
    setConfig(getAIConfig());
  }, []);

  useEffect(() => {
    if (!hasManualDifficulty) {
      setDifficulty(aiDefaults.difficulty as Difficulty);
    }
    if (!hasManualCategory) {
      setDataStructure(aiDefaults.dataStructure);
      setTopic('');
      setCustomTopic('');
    }
  }, [aiDefaults.dataStructure, aiDefaults.difficulty, hasManualCategory, hasManualDifficulty]);

  const handleSaveConfig = () => {
    setAIConfig({ model: config.model });
    setShowConfig(false);
  };

  const handleResetConfig = () => {
    clearAIConfig();
    setConfig(getAIConfig());
    setShowConfig(false);
  };

  const handleGenerate = async () => {
    const finalTopic = topic || customTopic || t('基本操作');

    setLoading(true);
    setError('');
    setGeneratedExercise(null);
    setGeneratedFillBlank(null);

    try {
      if (exerciseType === 'coding') {
        const exercise = await generateCodingExercise(finalTopic, difficulty, dataStructure, undefined, profileHint);
        setGeneratedExercise(exercise);
      } else {
        const fillBlank = await generateFillBlank(finalTopic, difficulty, dataStructure, undefined, profileHint);
        setGeneratedFillBlank(fillBlank);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('生成失败，请重试'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {showConfig && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/55 p-4 backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center">
            <div className="w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-200">
                  <Settings2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{isEnglish ? 'AI Model' : 'AI 模型配置'}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isEnglish ? `Leave blank to use the site default: ${DEFAULT_AI_MODEL}` : `留空时使用网站默认模型：${DEFAULT_AI_MODEL}`}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    {isEnglish ? 'Model name' : '模型名称'}
                  </label>
                  <input
                    type="text"
                    value={config.model ?? ''}
                    onChange={(event) => setConfig({ ...config, model: event.target.value })}
                    placeholder={DEFAULT_AI_MODEL}
                    className={inputClass}
                  />
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {isEnglish
                      ? 'This setting only overrides the model field sent to the server-side AI proxy.'
                      : '这里只覆盖发送给服务端 AI 代理的 model 字段，不会修改站点默认密钥和上游地址。'}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleResetConfig}
                  className="min-h-[44px] flex-1 cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  {isEnglish ? 'Use default' : '恢复默认'}
                </button>
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  className="min-h-[44px] flex-1 cursor-pointer rounded-2xl bg-slate-900 px-4 py-2 font-medium text-white transition-colors hover:bg-slate-800 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                >
                  {isEnglish ? 'Save model' : '保存模型'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={generatorSurfaceClass}>
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-950">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">{t('AI 智能出题')}</span>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">{learningStateLabel}</span>
              </div>
              <h2 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">{t('AI 智能出题')}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                {t('根据主题自动生成编程练习题')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowConfig(true)}
            className="inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800 sm:w-auto"
          >
            <Settings2 className="h-4 w-4" />
            {isEnglish ? 'Model settings' : '配置模型'}
          </button>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-4 md:grid-cols-2">
            <div className={`${fieldPanelClass} z-20`}>
              <GeneratorSelect
                label={t('知识点')}
                placeholder={isEnglish ? 'Choose a category' : '选择知识点'}
                value={dataStructure}
                groups={categoryGroups}
                onChange={(nextValue) => {
                  setDataStructure(nextValue);
                  setTopic('');
                  setCustomTopic('');
                  setHasManualCategory(true);
                }}
              />
            </div>

            <div className={`${fieldPanelClass} z-20`}>
              <GeneratorSelect
                label={t('题目主题')}
                placeholder={isEnglish ? 'Use a custom topic' : '自定义主题'}
                value={topic}
                groups={topicGroups}
                onChange={(nextValue) => setTopic(nextValue)}
              />
            </div>

            <div className={fieldPanelClass}>
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-500 dark:text-indigo-300" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{t('难度')}</span>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {[
                  { id: 'easy', label: '⭐简单' },
                  { id: 'medium', label: '⭐⭐中等' },
                  { id: 'hard', label: '⭐⭐⭐困难' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setDifficulty(item.id as Difficulty);
                      setHasManualDifficulty(true);
                    }}
                    className={`min-h-[44px] cursor-pointer rounded-2xl px-3 py-2 text-sm font-medium transition-all ${
                      difficulty === item.id
                        ? 'bg-slate-900 text-white shadow-sm dark:bg-indigo-500'
                        : 'border border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-500/50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {t(item.label)}
                  </button>
                ))}
              </div>
            </div>

            <div className={fieldPanelClass}>
              <div className="mb-3 flex items-center gap-2">
                <WandSparkles className="h-4 w-4 text-emerald-500 dark:text-emerald-300" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{t('题型')}</span>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setExerciseType('coding')}
                  className={`inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium transition-all ${
                    exerciseType === 'coding'
                      ? 'bg-slate-900 text-white shadow-sm dark:bg-indigo-500'
                      : 'border border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-500/50 dark:hover:bg-slate-800'
                  }`}
                >
                  <FileCode className="h-4 w-4" />
                  {t('编程题')}
                </button>
                <button
                  type="button"
                  onClick={() => setExerciseType('fillblank')}
                  className={`inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium transition-all ${
                    exerciseType === 'fillblank'
                      ? 'bg-slate-900 text-white shadow-sm dark:bg-indigo-500'
                      : 'border border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-500/50 dark:hover:bg-slate-800'
                  }`}
                >
                  <FileQuestionMark className="h-4 w-4" />
                  {t('填空题')}
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-[linear-gradient(145deg,rgba(15,23,42,0.04),rgba(79,70,229,0.1))] p-5 shadow-sm dark:border-slate-700/80 dark:bg-[linear-gradient(145deg,rgba(15,23,42,0.82),rgba(30,41,59,0.72))]">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-200">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">{isEnglish ? 'Generation Brief' : '生成策略'}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{targetLanguageMeta.label}</div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-200">{t(levelMeta.label)}</span>
              <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white dark:bg-white dark:text-slate-950">{learningStateLabel}</span>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{t(aiDefaults.message)}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {aiDefaults.suggestedCategories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setDataStructure(item);
                    setTopic('');
                    setCustomTopic('');
                    setHasManualCategory(true);
                  }}
                  className={`min-h-[40px] cursor-pointer rounded-full px-3 py-2 text-xs font-medium transition-all ${
                    dataStructure === item
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'border border-slate-200 bg-white/90 text-slate-700 hover:border-indigo-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-500/50 dark:hover:bg-slate-800'
                  }`}
                >
                  {categoryLabel(item)}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setDifficulty(aiDefaults.difficulty as Difficulty);
                setDataStructure(aiDefaults.dataStructure);
                setTopic('');
                setCustomTopic('');
                setHasManualCategory(false);
                setHasManualDifficulty(false);
              }}
              className="mt-4 inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300 dark:hover:bg-emerald-900/30"
            >
              <RefreshCw className="h-4 w-4" />
              {t('恢复我的水平推荐')}
            </button>
          </div>
        </div>

        {!topic && (
          <div className={`${fieldPanelClass} mt-4`}>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              {isEnglish ? 'Custom Topic' : '自定义主题'}
            </label>
            <input
              type="text"
              value={customTopic}
              onChange={(event) => setCustomTopic(event.target.value)}
              placeholder={t('输入自定义题目主题，例如：链表反转的递归实现')}
              className="min-h-[48px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
          </div>
        )}

        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="mt-4 inline-flex min-h-[52px] w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-base font-bold text-white transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-400 sm:text-lg"
        >
          {loading ? (
            <>
              <LoaderCircle className="h-5 w-5 animate-spin" />
              {t('AI 正在生成题目...')}
            </>
          ) : (
            <>
              <WandSparkles className="h-5 w-5" />
              {t(exerciseType === 'coding' ? '生成编程题' : '生成填空题')}
            </>
          )}
        </button>

        {error && (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-200">
            {error}
          </div>
        )}
      </div>

      {generatedExercise && (
        <div className="animate-fadeIn">
          <div className="mb-4 flex items-center gap-2 text-emerald-600 dark:text-emerald-300">
            <Sparkles className="h-4 w-4" />
            <span className="font-medium">{t('题目已生成！')}</span>
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
            progressiveAiText
          />
        </div>
      )}

      {generatedFillBlank && (
        <div className="animate-fadeIn">
          <div className="mb-4 flex items-center gap-2 text-emerald-600 dark:text-emerald-300">
            <Sparkles className="h-4 w-4" />
            <span className="font-medium">{t('填空题已生成！')}</span>
          </div>
          <FillInBlank
            title={generatedFillBlank.title}
            description={generatedFillBlank.description}
            difficulty={generatedFillBlank.difficulty}
            codeTemplate={generatedFillBlank.codeTemplate}
            blanks={generatedFillBlank.blanks}
            explanation={generatedFillBlank.explanation}
            progressiveAiText
          />
        </div>
      )}
    </div>
  );
}
