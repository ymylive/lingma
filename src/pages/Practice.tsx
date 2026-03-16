import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AIExerciseGenerator, CodingExercise, FillInBlank } from '../components/tutorials/TutorialPanel';
import VibeCodingLab from '../components/tutorials/VibeCodingLab';
import { allExercises, type Exercise } from '../data/exercises';
import { useUser } from '../contexts/UserContext';
import { useI18n } from '../contexts/I18nContext';
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
import { buildDailyRecommendation, getSkillLevelMeta } from '../utils/userPersonalization';
import type { VibeTrack } from '../types/vibeCoding';

const VALID_TABS = new Set(['preset', 'ai', 'vibe']);
const VALID_TRACKS = new Set<VibeTrack>(['frontend', 'backend', 'debugging', 'refactoring', 'review']);

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

const LEARNING_STATE_LABELS = {
  onboarding: '起步期',
  review: '复盘期',
  steady: '稳步期',
  challenge: '挑战期',
} as const;

function syncPageMetadata(title: string, description: string) {
  if (typeof document === 'undefined') return;
  document.title = title;
  let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'description';
    document.head.appendChild(meta);
  }
  meta.content = description;
}

function fuzzyMatch(text: string, query: string) {
  if (!query.trim()) return true;
  const source = text.toLowerCase();
  const normalized = query.toLowerCase().trim();
  if (source.includes(normalized)) return true;
  return normalized.split(/\s+/).filter(Boolean).every((word) => source.includes(word));
}

export default function Practice() {
  const { isExerciseCompleted, progress, user } = useUser();
  const { formatDate, isEnglish, t } = useI18n();
  const [searchParams] = useSearchParams();
  const paramTab = searchParams.get('tab');
  const paramTrack = searchParams.get('track');
  const initialTab = paramTab && VALID_TABS.has(paramTab) ? (paramTab as 'preset' | 'ai' | 'vibe') : 'preset';
  const initialTrack = paramTrack && VALID_TRACKS.has(paramTrack as VibeTrack) ? (paramTrack as VibeTrack) : undefined;
  const [tab, setTab] = useState<'preset' | 'ai' | 'vibe'>(initialTab);
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
    if (deferredQuery.trim()) {
      const categoryMeta = getCategoryMeta(exercise.category);
      const difficultyMeta = getDifficultyMeta(exercise.difficulty);
      const searchSource = [
        exercise.title,
        t(exercise.title),
        exercise.description,
        t(exercise.description),
        exercise.category,
        t(exercise.category),
        categoryMeta.name,
        t(categoryMeta.name),
        categoryMeta.summary,
        t(categoryMeta.summary),
        t(exercise.type === 'coding' ? '编程题' : '填空题'),
        difficultyMeta.label,
        t(difficultyMeta.label),
      ].join(' ');
      if (!fuzzyMatch(searchSource, deferredQuery)) return false;
    }
    return true;
  }), [category, completedSet, deferredQuery, difficulty, exercises, focusOnly, showCompleted, t, typeFilter]);

  const orderedExercises = useMemo(() => sortExercisesForPractice(filteredExercises, completedSet), [completedSet, filteredExercises]);
  const recommendedExercise = useMemo(() => getRecommendedExercise(filteredExercises, completedSet), [completedSet, filteredExercises]);
  const dailyRecommendation = useMemo(
    () => buildDailyRecommendation(exercises, progress, user?.id, user?.skillLevel || progress.skillLevel),
    [exercises, progress, user?.id, user?.skillLevel],
  );
  const levelMeta = useMemo(
    () => getSkillLevelMeta(dailyRecommendation.effectiveLevel),
    [dailyRecommendation.effectiveLevel],
  );
  const activePathCategory = category !== 'all'
    ? category
    : (dailyRecommendation.exercise?.category || recommendedExercise?.category || orderedExercises[0]?.category || levelMeta.practiceCategories[0] || '基础编程');
  const activePath = useMemo(() => buildPracticePath(exercises.filter((exercise) => exercise.category === activePathCategory), completedSet, activePathCategory), [activePathCategory, completedSet, exercises]);
  const reviewQueue = useMemo(() => Array.from(latestAttemptMap.values()).filter((record) => !record.isCorrect), [latestAttemptMap]);
  const recentAttempts = progress.exerciseHistory.slice(0, 8);
  const recentScore = recentAttempts.length ? Math.round(recentAttempts.reduce((sum, record) => sum + record.score, 0) / recentAttempts.length) : 0;
  const activeFilters = [category !== 'all', difficulty !== 'all', typeFilter !== 'all', showCompleted !== 'all', focusOnly, Boolean(searchQuery.trim())].filter(Boolean).length;
  const difficultyFilterOptions = [
    { id: 'all' as const, label: isEnglish ? 'All' : '全部' },
    { id: 'easy' as const, label: `${getDifficultyMeta('easy').stars} ${t(getDifficultyMeta('easy').label)}` },
    { id: 'medium' as const, label: `${getDifficultyMeta('medium').stars} ${t(getDifficultyMeta('medium').label)}` },
    { id: 'hard' as const, label: `${getDifficultyMeta('hard').stars} ${t(getDifficultyMeta('hard').label)}` },
  ];
  const typeFilterOptions = [
    { id: 'all' as const, label: isEnglish ? 'All' : '全部' },
    { id: 'coding' as const, label: t('编程题') },
    { id: 'fillblank' as const, label: t('填空题') },
  ];
  const completionOptions = [
    { id: 'all' as const, label: isEnglish ? 'All' : '全部' },
    { id: 'incomplete' as const, label: isEnglish ? 'Incomplete' : '未完成' },
    { id: 'completed' as const, label: isEnglish ? 'Completed' : '已完成' },
  ];
  const formatRecommendationDate = (dateKey: string) => {
    const [year, month, day] = dateKey.split('-').map(Number);
    if (![year, month, day].every(Number.isFinite)) return dateKey;
    return formatDate(new Date(year, month - 1, day), { year: 'numeric', month: 'short', day: 'numeric' });
  };
  const formatStageLabel = (stageIndex?: number, label?: string) => {
    if (!stageIndex || !label) return '';
    return isEnglish ? `Stage ${stageIndex} · ${t(label)}` : `第 ${stageIndex} 层 · ${label}`;
  };
  const translateType = (type: Exercise['type']) => t(type === 'coding' ? '编程题' : '填空题');
  const formatProblemCount = (count: number) => isEnglish ? `${count} problems` : `${count} 题`;
  const formatCompletionCount = (completed: number, total: number) => isEnglish ? `${completed}/${total} completed` : `${completed}/${total} 已完成`;
  const formatRecentAttempts = (count: number) => isEnglish ? `${count} submissions` : `${count} 次提交`;
  const formatStageOrder = (order?: number) => isEnglish ? `Path order ${order ?? '-'}` : `路径序号 ${order ?? '-'}`;

  useEffect(() => {
    syncPageMetadata(
      isEnglish ? 'Practice | Tumafang' : '刷题中心 | Tumafang',
      isEnglish
        ? 'Progressive practice paths with personalized recommendations, searchable problems, and online judging.'
        : '层级刷题路径、个性化推荐、可搜索题库和在线判题。',
    );
  }, [isEnglish]);

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
    <div className="min-h-screen pt-24 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-2xl border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),_transparent_45%),linear-gradient(135deg,_rgba(255,255,255,0.96),_rgba(241,245,249,0.86))] p-5 shadow-sm dark:border-slate-700 dark:bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.2),_transparent_42%),linear-gradient(135deg,_rgba(15,23,42,0.98),_rgba(30,41,59,0.94))] sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-klein-100 px-3 py-1 text-xs font-semibold text-klein-700 dark:bg-klein-900/40 dark:text-klein-300">{isEnglish ? 'LeetCode-style Practice' : 'LeetCode 风格刷题'}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-200">{t('层级递进')}</span>
            </div>
            <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">{t('刷题路径 + 专业判题 + 多语言学习支持')}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              {isEnglish ? 'The library is no longer a flat list. Practice now groups problems into warmup, solid, upgrade, and sprint stages, then surfaces the next recommended problem, review queue, and checkpoint feedback.' : '现在不再只是平铺题库。页面会按专题和难度自动生成热身、巩固、进阶、冲刺四层路径，并给出推荐下一题、待复盘题和检查点反馈。'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-4"><div className="text-xs text-slate-500 dark:text-slate-400">{isEnglish ? 'Unique Problems' : '去重后题量'}</div><div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">{exercises.length}</div></div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 shadow-sm dark:border-emerald-800 dark:bg-emerald-900/20 sm:p-4"><div className="text-xs text-emerald-700 dark:text-emerald-300">{isEnglish ? 'Completed' : '已完成'}</div><div className="mt-2 text-2xl font-bold text-emerald-700 dark:text-emerald-300 sm:text-3xl">{progress.completedExercises.length}</div></div>
            <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-4"><div className="text-xs text-slate-500 dark:text-slate-400">{isEnglish ? 'Review Queue' : '待复盘'}</div><div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">{reviewQueue.length}</div></div>
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-3.5 shadow-sm dark:border-indigo-800 dark:bg-indigo-900/20 sm:p-4"><div className="text-xs text-indigo-700 dark:text-indigo-300">{isEnglish ? 'Recent Avg Score' : '近期平均得分'}</div><div className="mt-2 text-2xl font-bold text-indigo-700 dark:text-indigo-300 sm:text-3xl">{recentScore}</div></div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <button onClick={() => setTab('preset')} className={`min-h-[48px] cursor-pointer rounded-2xl px-6 py-3 text-sm font-semibold transition-all ${tab === 'preset' ? 'bg-klein-500 text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}>{t('题库练习')}</button>
          <button onClick={() => setTab('ai')} className={`min-h-[48px] cursor-pointer rounded-2xl px-6 py-3 text-sm font-semibold transition-all ${tab === 'ai' ? 'bg-klein-500 text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}>{t('AI 智能出题')}</button>
          <button onClick={() => setTab('vibe')} className={`min-h-[48px] cursor-pointer rounded-2xl px-6 py-3 text-sm font-semibold transition-all ${tab === 'vibe' ? 'bg-klein-500 text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}>{isEnglish ? 'Vibe Coding Lab' : 'Vibe Coding 学习'}</button>
        </div>

        {tab === 'ai' ? <AIExerciseGenerator /> : tab === 'vibe' ? (
          <VibeCodingLab
            onOpenAiGenerator={() => setTab('ai')}
            onOpenPracticeLibrary={() => {
              setSelectedExercise(null);
              setTab('preset');
            }}
            initialTrack={initialTrack}
          />
        ) : (
          <>
            {!selectedExercise && (
              <>
                <div className="mb-6 rounded-2xl border border-indigo-200 bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.16),_transparent_45%),linear-gradient(135deg,_rgba(238,242,255,0.95),_rgba(255,255,255,0.92))] p-4 shadow-sm dark:border-indigo-800 dark:bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.22),_transparent_42%),linear-gradient(135deg,_rgba(15,23,42,0.98),_rgba(30,41,59,0.94))] sm:p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">{t('每日推荐')}</span>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">{t(levelMeta.label)}</span>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">{t(LEARNING_STATE_LABELS[dailyRecommendation.learningState])}</span>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{isEnglish ? `Recommended focus today: ${t(dailyRecommendation.focusCategory)}` : `今天建议先刷 ${dailyRecommendation.focusCategory}`}</h2>
                        <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{t(dailyRecommendation.reason)}</p>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl border border-white/70 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-800/80">
                          <div className="text-xs text-slate-500 dark:text-slate-400">{t('目标难度')}</div>
                          <div className="mt-1 text-base font-semibold text-slate-900 dark:text-white">{t(getDifficultyMeta(dailyRecommendation.recommendedDifficulty).label)}</div>
                        </div>
                        <div className="rounded-2xl border border-white/70 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-800/80">
                          <div className="text-xs text-slate-500 dark:text-slate-400">{t('推荐路径')}</div>
                          <div className="mt-1 text-base font-semibold text-slate-900 dark:text-white">{t(dailyRecommendation.recommendedTrack)}</div>
                        </div>
                        <div className="rounded-2xl border border-white/70 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-800/80">
                          <div className="text-xs text-slate-500 dark:text-slate-400">{t('今日日期')}</div>
                          <div className="mt-1 text-base font-semibold text-slate-900 dark:text-white">{formatRecommendationDate(dailyRecommendation.dateKey)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full max-w-md rounded-2xl border border-white/70 bg-white/85 p-4 dark:border-slate-700 dark:bg-slate-800/85 sm:p-5">
                      {dailyRecommendation.exercise ? (
                        <>
                          <div className="flex flex-wrap gap-2">
                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${getDifficultyMeta(dailyRecommendation.exercise.difficulty).accent}`}>
                              {getDifficultyMeta(dailyRecommendation.exercise.difficulty).stars} {t(getDifficultyMeta(dailyRecommendation.exercise.difficulty).label)}
                            </span>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200">{t(dailyRecommendation.exercise.category)}</span>
                          </div>
                          <div className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{t(dailyRecommendation.exercise.title)}</div>
                          <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-300">{t(dailyRecommendation.exercise.description)}</p>
                          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                            <button onClick={() => openExercise(dailyRecommendation.exercise!)} className="min-h-[44px] cursor-pointer rounded-2xl bg-klein-500 px-4 py-2 text-sm font-semibold text-white hover:bg-klein-600">{t(dailyRecommendation.ctaLabel)}</button>
                            <button onClick={() => { setCategory(dailyRecommendation.exercise!.category); setShowCompleted('incomplete'); }} className="min-h-[44px] cursor-pointer rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-100">{t('切到对应题库')}</button>
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-slate-600 dark:text-slate-300">{t('当前题库都已完成，今天可以切到 AI 出题或更高层级继续训练。')}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-5">
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
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">{t(item.name)}</div>
                        <div className="mt-1 text-xs text-klein-500 dark:text-klein-300">{item.status}</div>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.summary}</p>
                        <div className="mt-4 space-y-2">
                          <a href={item.docsUrl} target="_blank" rel="noreferrer" className="flex min-h-[44px] items-center rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700">{item.docsLabel}</a>
                          <a href={item.bankUrl} target="_blank" rel="noreferrer" className="flex min-h-[44px] items-center rounded-xl bg-klein-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-klein-600">{item.bankLabel}</a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">{t('推荐下一题')}</div>
                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t(getCategoryMeta(activePathCategory).name)}</div>
                      </div>
                      {recommendedExercise && <button onClick={() => openExercise(recommendedExercise)} className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-2xl bg-klein-500 px-4 py-2 text-sm font-semibold text-white hover:bg-klein-600">{isEnglish ? 'Continue Practice' : '继续刷题'}</button>}
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
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-200">{t(recommendedExercise.category)}</span>
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${difficultyMeta.accent}`}>{difficultyMeta.stars} {t(difficultyMeta.label)}</span>
                          {stageMeta && <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">{formatStageLabel(progression?.stageIndex, stageMeta.label)}</span>}
                          {recommendedExercise.isExamFocus && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">{t('考试重点')}</span>}
                        </div>
                        <div className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{t(recommendedExercise.title)}</div>
                        <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-300">{t(recommendedExercise.description)}</p>
                        {stageMeta && <div className="mt-3 rounded-2xl bg-white/80 px-3 py-2 text-xs text-slate-600 dark:bg-slate-900/60 dark:text-slate-200">{t(stageMeta.difficultyLabel)}</div>}
                            </>
                          );
                        })()}
                      </div>
                    ) : <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">{isEnglish ? 'Everything in the current filter is complete. Switch categories or challenge the AI generator next.' : '当前筛选范围已经全部完成，可以切换分类或挑战 AI 出题。'}</div>}
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{t('刷题效率面板')}</div>
                    <div className="mt-4 space-y-3">
                      <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900"><div className="text-xs text-slate-500 dark:text-slate-400">{t('当前路径')}</div><div className="mt-1 text-base font-semibold text-slate-900 dark:text-white">{t(getCategoryMeta(activePath.category).name)}</div><div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{formatCompletionCount(activePath.completed, activePath.total)}</div></div>
                      <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900"><div className="text-xs text-slate-500 dark:text-slate-400">{t('待复盘题')}</div><div className="mt-1 text-base font-semibold text-slate-900 dark:text-white">{formatProblemCount(reviewQueue.length)}</div><div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{reviewQueue[0] ? t(reviewQueue[0].exerciseTitle) : (isEnglish ? 'Keep submitting and incorrect attempts will be collected here.' : '继续提交后会自动沉淀错题记录。')}</div></div>
                      <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900"><div className="text-xs text-slate-500 dark:text-slate-400">{t('最近状态')}</div><div className="mt-1 text-base font-semibold text-slate-900 dark:text-white">{recentAttempts.length ? formatRecentAttempts(recentAttempts.length) : (isEnglish ? 'No submissions yet' : '暂无提交')}</div><div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{recentAttempts[0]?.verdict ? t(recentAttempts[0].verdict) : (isEnglish ? 'Your recent performance will appear here after you start practicing.' : '开始刷题后这里会显示你的近期表现。')}</div></div>
                    </div>
                  </div>
                </div>

                <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-5">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{t('层级刷题路径')}</h2>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{t(getCategoryMeta(activePath.category).summary)}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{isEnglish ? 'Default order: easy warmup -> easy solid -> medium upgrade -> hard and exam focus.' : '默认顺序: 简单起步 -> 简单进阶 -> 中等主练 -> 困难与考试重点。'}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-200">{isEnglish ? `${activePath.completionRate}% complete` : `${activePath.completionRate}% 完成`}</span>
                  </div>
                  <div className="grid gap-3 lg:grid-cols-4">
                    {activePath.stages.filter((stage) => stage.total > 0).map((stage) => (
                      <div key={stage.id} className={`rounded-2xl border p-4 ${stage.accent} ${activePath.currentStageId === stage.id ? 'ring-2 ring-klein-400/60' : ''}`}>
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-semibold">{t(stage.label)}</div>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${stage.pill}`}>{stage.completed}/{stage.total}</span>
                        </div>
                        <p className="mt-2 text-sm opacity-90">{t(stage.summary)}</p>
                        <div className="mt-2 text-xs font-medium opacity-90">{t(stage.difficultyLabel)}</div>
                        <div className="mt-3 text-xs opacity-80">{stage.unlocked ? (isEnglish ? 'Available now' : '当前可刷') : (isEnglish ? 'Unlock after the previous stage' : '完成前一层后解锁')}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-5">
              <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
                <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={t('搜索题目、描述、分类')} className="min-h-[48px] rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base outline-none transition-all focus:border-klein-500 focus:ring-2 focus:ring-klein-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:ring-klein-400/20 sm:text-sm" />
                {activeFilters > 0 && <button onClick={clearFilters} className="min-h-[48px] cursor-pointer rounded-2xl bg-rose-100 px-4 text-sm font-semibold text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">{t('清空筛选')} {activeFilters}</button>}
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <div className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">{t('专题分类')}</div>
                  <div className="space-y-3">
                    {CATEGORY_GROUPS.map((group) => (
                      <div key={group.group} className="flex flex-col gap-2 lg:flex-row lg:items-start">
                        <span className="shrink-0 text-xs font-medium text-slate-500 dark:text-slate-400 lg:w-20 lg:pt-2">{t(group.group)}</span>
                        <div className="flex flex-wrap gap-2">
                          {group.items.map((item) => (
                            <button key={item.id} onClick={() => setCategory(item.id)} className={`min-h-[44px] cursor-pointer rounded-2xl px-3.5 py-2 text-sm font-medium transition-colors ${category === item.id ? 'bg-klein-500 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200'}`}>{t(item.name)}</button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-4 border-t border-slate-100 pt-4 dark:border-slate-700 lg:flex-row lg:flex-wrap">
                  <div>
                    <div className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">{t('难度')}</div>
                    <div className="flex flex-wrap gap-2">{difficultyFilterOptions.map((item) => <button key={item.id} onClick={() => setDifficulty(item.id)} className={`min-h-[44px] cursor-pointer rounded-2xl px-3.5 py-2 text-sm font-medium ${difficulty === item.id ? 'bg-klein-500 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200'}`}>{item.label}</button>)}</div>
                  </div>
                  <div>
                    <div className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">{t('题型')}</div>
                    <div className="flex flex-wrap gap-2">{typeFilterOptions.map((item) => <button key={item.id} onClick={() => setTypeFilter(item.id)} className={`min-h-[44px] cursor-pointer rounded-2xl px-3.5 py-2 text-sm font-medium ${typeFilter === item.id ? 'bg-klein-500 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200'}`}>{item.label}</button>)}</div>
                  </div>
                  <div>
                    <div className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">{t('完成状态')}</div>
                    <div className="flex flex-wrap gap-2">{completionOptions.map((item) => <button key={item.id} onClick={() => setShowCompleted(item.id)} className={`min-h-[44px] cursor-pointer rounded-2xl px-3.5 py-2 text-sm font-medium ${showCompleted === item.id ? 'bg-klein-500 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200'}`}>{item.label}</button>)}</div>
                  </div>
                  <div>
                    <div className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">{t('效率快捷项')}</div>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => recommendedExercise && openExercise(recommendedExercise)} disabled={!recommendedExercise} className="min-h-[44px] cursor-pointer rounded-2xl bg-klein-500 px-3.5 py-2 text-sm font-medium text-white disabled:opacity-50 hover:bg-klein-600">{t('推荐下一题')}</button>
                      <button onClick={() => setShowCompleted('incomplete')} className="min-h-[44px] cursor-pointer rounded-2xl bg-slate-100 px-3.5 py-2 text-sm font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200">{t('继续未完成')}</button>
                      <button onClick={() => setFocusOnly((value) => !value)} className={`min-h-[44px] cursor-pointer rounded-2xl px-3.5 py-2 text-sm font-medium ${focusOnly ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200'}`}>{t('考试重点')}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {selectedExercise ? (
              <div className="animate-fadeIn">
                <button onClick={() => setSelectedExercise(null)} className="mb-4 min-h-[44px] cursor-pointer rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-100">{t('返回题目列表')}</button>
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
                      className={`cursor-pointer rounded-2xl border p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${completed ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'}`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-2">
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${difficultyMeta.accent}`}>{difficultyMeta.stars} {t(difficultyMeta.label)}</span>
                          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">{translateType(exercise.type)}</span>
                          {stageMeta && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200">{formatStageLabel(progression?.stageIndex, stageMeta.label)}</span>}
                          {exercise.isExamFocus && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">{t('考试重点')}</span>}
                        </div>
                        {completed && <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">{isEnglish ? 'Completed' : '已完成'}</span>}
                      </div>
                      <div className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{t(exercise.title)}</div>
                      <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-300">{t(exercise.description)}</p>
                      {stageMeta && <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">{t(stageMeta.difficultyLabel)}</div>}
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 text-sm dark:border-slate-700">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-200">{t(exercise.category)}</span>
                        <span className="text-slate-500 dark:text-slate-400">{latestAttempt ? (isEnglish ? `${latestAttempt.score} pts · ${latestAttempt.verdict ? t(latestAttempt.verdict) : 'Recent submission'}` : `${latestAttempt.score} 分 · ${latestAttempt.verdict || '最近提交'}`) : (completed ? (isEnglish ? 'Practice Again' : '可再次练习') : formatStageOrder(progression?.orderInCategory))}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">{isEnglish ? 'No problems match the current filters. Clear filters or switch categories.' : '当前筛选范围没有题目，建议清空筛选或切换专题。'}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
