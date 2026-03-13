import { useDeferredValue, useMemo, useState } from 'react';
import { AIExerciseGenerator, CodingExercise, FillInBlank } from '../components/tutorials/TutorialPanel';
import { allExercises, type Exercise } from '../data/exercises';
import { useUser } from '../contexts/UserContext';
import {
  CATEGORY_GROUPS,
  PRACTICE_STAGE_META,
  buildPracticePath,
  buildExerciseProgressionLookup,
  dedupeExercises,
  getCategoryMeta,
  getDifficultyMeta,
  getRecommendedExercise,
  sortExercisesForPractice,
} from '../utils/practiceProgression';

const LANGUAGE_SUPPORT = [
  {
    id: 'c',
    name: 'C',
    status: '在线判题 + 学习资源',
    summary: '基础指针、内存管理和底层实现训练。',
    docsUrl: 'https://en.cppreference.com/w/c/language',
    docsLabel: 'C Reference',
    bankUrl: 'https://exercism.org/tracks/c',
    bankLabel: 'Exercism C · 84 题',
  },
  {
    id: 'cpp',
    name: 'C++',
    status: '在线判题 + 学习资源',
    summary: 'STL、泛型、数据结构和高频算法题。',
    docsUrl: 'https://en.cppreference.com/w/cpp/language',
    docsLabel: 'C++ Reference',
    bankUrl: 'https://exercism.org/tracks/cpp',
    bankLabel: 'Exercism C++ · 100 题',
  },
  {
    id: 'java',
    name: 'Java',
    status: '在线判题 + 学习资源',
    summary: '面向对象、集合框架和工程化编码习惯。',
    docsUrl: 'https://docs.oracle.com/javase/tutorial/',
    docsLabel: 'Java Tutorial',
    bankUrl: 'https://exercism.org/tracks/java',
    bankLabel: 'Exercism Java · 156 题',
  },
  {
    id: 'csharp',
    name: 'C#',
    status: '在线判题 + 学习资源',
    summary: '.NET 基础、LINQ、集合和面向对象题解。',
    docsUrl: 'https://learn.microsoft.com/en-us/dotnet/csharp/',
    docsLabel: 'C# Docs',
    bankUrl: 'https://exercism.org/tracks/csharp',
    bankLabel: 'Exercism C# · 176 题',
  },
  {
    id: 'python',
    name: 'Python',
    status: '在线判题 + 学习资源',
    summary: '语法上手快，适合先把题感和算法表达跑顺。',
    docsUrl: 'https://docs.python.org/3/tutorial/',
    docsLabel: 'Python Tutorial',
    bankUrl: 'https://exercism.org/tracks/python',
    bankLabel: 'Exercism Python · 146 题',
  },
];

function fuzzyMatch(text: string, query: string) {
  if (!query.trim()) return true;
  const source = text.toLowerCase();
  const normalized = query.toLowerCase().trim();
  if (source.includes(normalized)) return true;
  return normalized.split(/\s+/).filter(Boolean).every((word) => source.includes(word));
}

export default function Practice() {
  const { isExerciseCompleted, progress } = useUser();
  const [tab, setTab] = useState<'preset' | 'ai'>('preset');
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'coding' | 'fillblank'>('all');
  const [showCompleted, setShowCompleted] = useState<'all' | 'completed' | 'incomplete'>('all');
  const [focusOnly, setFocusOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const deferredQuery = useDeferredValue(searchQuery);

  const exercises = useMemo(() => dedupeExercises(allExercises), []);
  const completedSet = useMemo(() => new Set(progress.completedExercises), [progress.completedExercises]);
  const progressionLookup = useMemo(() => buildExerciseProgressionLookup(exercises), [exercises]);
  const stageMetaLookup = useMemo(() => new Map(PRACTICE_STAGE_META.map((item) => [item.id, item])), []);
  const latestAttemptMap = useMemo(() => {
    const map = new Map<string, (typeof progress.exerciseHistory)[number]>();
    for (const record of progress.exerciseHistory) {
      if (!map.has(record.exerciseId)) map.set(record.exerciseId, record);
    }
    return map;
  }, [progress.exerciseHistory]);

  const filteredExercises = useMemo(() => exercises.filter((exercise) => {
    if (category !== 'all' && exercise.category !== category) return false;
    if (difficulty !== 'all' && exercise.difficulty !== difficulty) return false;
    if (typeFilter !== 'all' && exercise.type !== typeFilter) return false;
    if (focusOnly && !exercise.isExamFocus) return false;
    if (showCompleted === 'completed' && !completedSet.has(exercise.id)) return false;
    if (showCompleted === 'incomplete' && completedSet.has(exercise.id)) return false;
    if (deferredQuery.trim() && !fuzzyMatch(`${exercise.title} ${exercise.description} ${exercise.category}`, deferredQuery)) return false;
    return true;
  }), [category, completedSet, deferredQuery, difficulty, exercises, focusOnly, showCompleted, typeFilter]);

  const orderedExercises = useMemo(() => sortExercisesForPractice(filteredExercises, completedSet), [completedSet, filteredExercises]);
  const recommendedExercise = useMemo(() => getRecommendedExercise(filteredExercises, completedSet), [completedSet, filteredExercises]);
  const activePathCategory = category !== 'all' ? category : (recommendedExercise?.category || orderedExercises[0]?.category || '数组');
  const activePath = useMemo(() => buildPracticePath(exercises.filter((exercise) => exercise.category === activePathCategory), completedSet, activePathCategory), [activePathCategory, completedSet, exercises]);
  const reviewQueue = useMemo(() => Array.from(latestAttemptMap.values()).filter((record) => !record.isCorrect), [latestAttemptMap]);
  const recentAttempts = progress.exerciseHistory.slice(0, 8);
  const recentScore = recentAttempts.length ? Math.round(recentAttempts.reduce((sum, record) => sum + record.score, 0) / recentAttempts.length) : 0;
  const activeFilters = [category !== 'all', difficulty !== 'all', typeFilter !== 'all', showCompleted !== 'all', focusOnly, Boolean(searchQuery.trim())].filter(Boolean).length;

  const openExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 120);
  };

  const clearFilters = () => {
    setCategory('all');
    setDifficulty('all');
    setTypeFilter('all');
    setShowCompleted('all');
    setFocusOnly(false);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-20 pb-12 dark:from-slate-900 dark:to-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),_transparent_45%),linear-gradient(135deg,_rgba(255,255,255,0.96),_rgba(241,245,249,0.86))] p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">LeetCode 风格刷题</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-200">层级递进</span>
            </div>
            <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">刷题路径 + 专业判题 + 多语言学习支持</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              现在不再只是平铺题库。页面会按专题和难度自动生成热身、巩固、进阶、冲刺四层路径，并给出推荐下一题、待复盘题和检查点反馈。
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"><div className="text-xs text-slate-500 dark:text-slate-400">去重后题量</div><div className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{exercises.length}</div></div>
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm dark:border-emerald-800 dark:bg-emerald-900/20"><div className="text-xs text-emerald-700 dark:text-emerald-300">已完成</div><div className="mt-2 text-3xl font-bold text-emerald-700 dark:text-emerald-300">{progress.completedExercises.length}</div></div>
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"><div className="text-xs text-slate-500 dark:text-slate-400">待复盘</div><div className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{reviewQueue.length}</div></div>
            <div className="rounded-3xl border border-indigo-200 bg-indigo-50 p-4 shadow-sm dark:border-indigo-800 dark:bg-indigo-900/20"><div className="text-xs text-indigo-700 dark:text-indigo-300">近期平均得分</div><div className="mt-2 text-3xl font-bold text-indigo-700 dark:text-indigo-300">{recentScore}</div></div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button onClick={() => setTab('preset')} className={`min-h-[48px] rounded-2xl px-6 py-3 text-sm font-semibold transition-all ${tab === 'preset' ? 'bg-indigo-600 text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}>题库练习</button>
          <button onClick={() => setTab('ai')} className={`min-h-[48px] rounded-2xl px-6 py-3 text-sm font-semibold transition-all ${tab === 'ai' ? 'bg-indigo-600 text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}>AI 智能出题</button>
        </div>

        {tab === 'ai' ? <AIExerciseGenerator /> : (
          <>
            {!selectedExercise && (
              <>
                <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">多语言学习支持</h2>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">站内题库支持 C / C++ / Java / C# / Python 切换，下面补充官方文档和公开语言题库入口。</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-200">在线搜集后接入</span>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                    {LANGUAGE_SUPPORT.map((item) => (
                      <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">{item.name}</div>
                        <div className="mt-1 text-xs text-indigo-600 dark:text-indigo-300">{item.status}</div>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.summary}</p>
                        <div className="mt-4 space-y-2">
                          <a href={item.docsUrl} target="_blank" rel="noreferrer" className="block rounded-xl bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700">{item.docsLabel}</a>
                          <a href={item.bankUrl} target="_blank" rel="noreferrer" className="block rounded-xl bg-indigo-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-indigo-700">{item.bankLabel}</a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">推荐下一题</div>
                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{getCategoryMeta(activePathCategory).name}</div>
                      </div>
                      {recommendedExercise && <button onClick={() => openExercise(recommendedExercise)} className="min-h-[44px] rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">继续刷题</button>}
                    </div>
                    {recommendedExercise ? (
                      <div className="mt-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-800 dark:bg-indigo-900/20">
                        {(() => {
                          const progression = progressionLookup.get(recommendedExercise.id);
                          const difficultyMeta = getDifficultyMeta(recommendedExercise.difficulty);
                          const stageMeta = progression ? stageMetaLookup.get(progression.stageId) : undefined;
                          return (
                            <>
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-200">{recommendedExercise.category}</span>
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${difficultyMeta.accent}`}>{difficultyMeta.stars} {difficultyMeta.label}</span>
                          {stageMeta && <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">第 {progression?.stageIndex} 层 · {stageMeta.label}</span>}
                          {recommendedExercise.isExamFocus && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">考试重点</span>}
                        </div>
                        <div className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{recommendedExercise.title}</div>
                        <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-300">{recommendedExercise.description}</p>
                        {stageMeta && <div className="mt-3 rounded-2xl bg-white/80 px-3 py-2 text-xs text-slate-600 dark:bg-slate-900/60 dark:text-slate-200">{stageMeta.difficultyLabel}</div>}
                            </>
                          );
                        })()}
                      </div>
                    ) : <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">当前筛选范围已经全部完成，可以切换分类或挑战 AI 出题。</div>}
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">刷题效率面板</div>
                    <div className="mt-4 space-y-3">
                      <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900"><div className="text-xs text-slate-500 dark:text-slate-400">当前路径</div><div className="mt-1 text-base font-semibold text-slate-900 dark:text-white">{getCategoryMeta(activePath.category).name}</div><div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{activePath.completed}/{activePath.total} 已完成</div></div>
                      <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900"><div className="text-xs text-slate-500 dark:text-slate-400">待复盘题</div><div className="mt-1 text-base font-semibold text-slate-900 dark:text-white">{reviewQueue.length} 题</div><div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{reviewQueue[0]?.exerciseTitle || '继续提交后会自动沉淀错题记录。'}</div></div>
                      <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900"><div className="text-xs text-slate-500 dark:text-slate-400">最近状态</div><div className="mt-1 text-base font-semibold text-slate-900 dark:text-white">{recentAttempts.length ? `${recentAttempts.length} 次提交` : '暂无提交'}</div><div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{recentAttempts[0]?.verdict || '开始刷题后这里会显示你的近期表现。'}</div></div>
                    </div>
                  </div>
                </div>

                <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">层级刷题路径</h2>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{getCategoryMeta(activePath.category).summary}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{'默认顺序: 简单起步 -> 简单进阶 -> 中等主练 -> 困难与考试重点。'}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-200">{activePath.completionRate}% 完成</span>
                  </div>
                  <div className="grid gap-3 lg:grid-cols-4">
                    {activePath.stages.filter((stage) => stage.total > 0).map((stage) => (
                      <div key={stage.id} className={`rounded-2xl border p-4 ${stage.accent} ${activePath.currentStageId === stage.id ? 'ring-2 ring-indigo-400/60' : ''}`}>
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-semibold">{stage.label}</div>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${stage.pill}`}>{stage.completed}/{stage.total}</span>
                        </div>
                        <p className="mt-2 text-sm opacity-90">{stage.summary}</p>
                        <div className="mt-2 text-xs font-medium opacity-90">{stage.difficultyLabel}</div>
                        <div className="mt-3 text-xs opacity-80">{stage.unlocked ? '当前可刷' : '完成前一层后解锁'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
                <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="搜索题目、描述、分类" className="min-h-[48px] rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
                {activeFilters > 0 && <button onClick={clearFilters} className="min-h-[48px] rounded-2xl bg-rose-100 px-4 text-sm font-semibold text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">清空筛选 {activeFilters}</button>}
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <div className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">专题分类</div>
                  <div className="space-y-3">
                    {CATEGORY_GROUPS.map((group) => (
                      <div key={group.group} className="flex flex-col gap-2 lg:flex-row lg:items-start">
                        <span className="shrink-0 text-xs font-medium text-slate-500 dark:text-slate-400 lg:w-20 lg:pt-2">{group.group}</span>
                        <div className="flex flex-wrap gap-2">
                          {group.items.map((item) => (
                            <button key={item.id} onClick={() => setCategory(item.id)} className={`min-h-[40px] rounded-2xl px-3 py-2 text-sm font-medium transition-colors ${category === item.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200'}`}>{item.name}</button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-4 border-t border-slate-100 pt-4 dark:border-slate-700 lg:flex-row lg:flex-wrap">
                  <div>
                    <div className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">难度</div>
                    <div className="flex flex-wrap gap-2">{['all', 'easy', 'medium', 'hard'].map((item) => <button key={item} onClick={() => setDifficulty(item as typeof difficulty)} className={`min-h-[40px] rounded-2xl px-3 py-2 text-sm font-medium ${difficulty === item ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200'}`}>{item}</button>)}</div>
                  </div>
                  <div>
                    <div className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">题型</div>
                    <div className="flex flex-wrap gap-2">{['all', 'coding', 'fillblank'].map((item) => <button key={item} onClick={() => setTypeFilter(item as typeof typeFilter)} className={`min-h-[40px] rounded-2xl px-3 py-2 text-sm font-medium ${typeFilter === item ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200'}`}>{item}</button>)}</div>
                  </div>
                  <div>
                    <div className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">完成状态</div>
                    <div className="flex flex-wrap gap-2">{['all', 'incomplete', 'completed'].map((item) => <button key={item} onClick={() => setShowCompleted(item as typeof showCompleted)} className={`min-h-[40px] rounded-2xl px-3 py-2 text-sm font-medium ${showCompleted === item ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200'}`}>{item}</button>)}</div>
                  </div>
                  <div>
                    <div className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">效率快捷项</div>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => recommendedExercise && openExercise(recommendedExercise)} disabled={!recommendedExercise} className="min-h-[40px] rounded-2xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-50">推荐下一题</button>
                      <button onClick={() => setShowCompleted('incomplete')} className="min-h-[40px] rounded-2xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200">继续未完成</button>
                      <button onClick={() => setFocusOnly((value) => !value)} className={`min-h-[40px] rounded-2xl px-3 py-2 text-sm font-medium ${focusOnly ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200'}`}>考试重点</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {selectedExercise ? (
              <div className="animate-fadeIn">
                <button onClick={() => setSelectedExercise(null)} className="mb-4 min-h-[44px] rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-100">返回题目列表</button>
                {selectedExercise.type === 'coding' && selectedExercise.templates && selectedExercise.solutions && (
                  <CodingExercise
                    exerciseId={selectedExercise.id}
                    title={selectedExercise.title}
                    description={selectedExercise.description}
                    difficulty={selectedExercise.difficulty}
                    category={selectedExercise.category}
                    templates={selectedExercise.templates}
                    solutions={selectedExercise.solutions}
                    testCases={selectedExercise.testCases || []}
                    hints={selectedExercise.hints}
                    explanation={selectedExercise.explanation}
                    commonMistakes={selectedExercise.commonMistakes}
                  />
                )}
                {selectedExercise.type === 'fillblank' && selectedExercise.codeTemplate && selectedExercise.blanks && (
                  <FillInBlank
                    exerciseId={selectedExercise.id}
                    title={selectedExercise.title}
                    description={selectedExercise.description}
                    difficulty={selectedExercise.difficulty}
                    category={selectedExercise.category}
                    codeTemplate={selectedExercise.codeTemplate}
                    blanks={selectedExercise.blanks}
                    explanation={selectedExercise.explanation}
                  />
                )}
              </div>
            ) : orderedExercises.length ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {orderedExercises.map((exercise) => {
                  const latestAttempt = latestAttemptMap.get(exercise.id);
                  const completed = isExerciseCompleted(exercise.id);
                  const progression = progressionLookup.get(exercise.id);
                  const stageMeta = progression ? stageMetaLookup.get(progression.stageId) : undefined;
                  const difficultyMeta = getDifficultyMeta(exercise.difficulty);
                  return (
                    <button
                      key={exercise.id}
                      onClick={() => openExercise(exercise)}
                      className={`cursor-pointer rounded-3xl border p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${completed ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'}`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-2">
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${difficultyMeta.accent}`}>{difficultyMeta.stars} {difficultyMeta.label}</span>
                          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">{exercise.type}</span>
                          {stageMeta && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200">第 {progression?.stageIndex} 层 · {stageMeta.label}</span>}
                          {exercise.isExamFocus && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">考试重点</span>}
                        </div>
                        {completed && <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">已完成</span>}
                      </div>
                      <div className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{exercise.title}</div>
                      <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-300">{exercise.description}</p>
                      {stageMeta && <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">{stageMeta.difficultyLabel}</div>}
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 text-sm dark:border-slate-700">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-200">{exercise.category}</span>
                        <span className="text-slate-500 dark:text-slate-400">{latestAttempt ? `${latestAttempt.score} 分 · ${latestAttempt.verdict || '最近提交'}` : (completed ? '可再次练习' : `路径序号 ${progression?.orderInCategory || '-'}`)}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">当前筛选范围没有题目，建议清空筛选或切换专题。</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
