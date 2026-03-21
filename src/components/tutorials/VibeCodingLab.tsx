import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Code2,
  LoaderCircle,
  MessageSquareQuote,
  Play,
  RefreshCw,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  TriangleAlert,
  Workflow,
} from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';
import { methodologyUnits } from '../../data/methodologyUnits';
import {
  evaluateVibePromptStream,
  fetchVibeHistory,
  fetchVibeProfile,
  generateVibeChallengeStream,
} from '../../services/vibeCodingService';
import type {
  VibeChallenge,
  VibeDimensionKey,
  VibeEvaluation,
  VibeHistoryItem,
  VibeProfile,
  VibeTrack,
} from '../../types/vibeCoding';

interface Props {
  onOpenAiGenerator: () => void;
  onOpenPracticeLibrary: () => void;
  initialTrack?: VibeTrack;
}

const TRACK_ORDER: VibeTrack[] = ['frontend', 'backend', 'debugging', 'refactoring', 'review'];
const DIMENSION_ORDER: VibeDimensionKey[] = [
  'goal_clarity',
  'boundary_constraints',
  'verification_design',
  'output_format',
];

const DIFFICULTY_LABEL: Record<string, string> = {
  beginner: '入门',
  intermediate: '进阶',
  advanced: '困难',
};

const fadeInUp = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, ease: 'easeOut' as const } };
const stagger = { animate: { transition: { staggerChildren: 0.06 } } };

function useCountUp(target: number, duration = 600) {
  const [value, setValue] = useState(0);
  const raf = useRef(0);
  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setValue(Math.round(p * target));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return value;
}

export default function VibeCodingLab({ onOpenAiGenerator, onOpenPracticeLibrary, initialTrack }: Props) {
  const { locale, t } = useI18n();

  const difficultyLabel = (level: string) => t(DIFFICULTY_LABEL[level] ?? level);

  const trackMeta: Record<VibeTrack, { label: string; summary: string }> = {
    frontend: {
      label: t('前端'),
      summary: t('页面改造、交互、主题、组件拆分。'),
    },
    backend: {
      label: t('后端'),
      summary: t('接口、数据库、鉴权、部署链路。'),
    },
    debugging: {
      label: t('调试'),
      summary: t('复现、取证、根因、回归验证。'),
    },
    refactoring: {
      label: t('重构'),
      summary: t('职责收口、重复抽离、小批次拆分。'),
    },
    review: {
      label: t('审查'),
      summary: t('风险分级、正确性、性能与安全。'),
    },
  };

  const dimensionMeta: Record<VibeDimensionKey, { label: string; max: number }> = {
    goal_clarity: { label: t('目标清晰度'), max: 30 },
    boundary_constraints: { label: t('边界约束'), max: 25 },
    verification_design: { label: t('验证设计'), max: 25 },
    output_format: { label: t('输出格式'), max: 20 },
  };

  const memoryRules = [
    t('先定义任务，再让 AI 开始产出。'),
    t('需要实时事实时，先上 MCP，不靠记忆瞎猜。'),
    t('评分低分最常见原因不是词不够高级，而是没有边界和验证。'),
    t('蜂群适合并行任务，不适合同文件混战。'),
    t('上下文窗口是战略资源，用 Plan 文档管理，别把整个仓库丢给 AI。'),
    t('三层门禁：Vibe Check → Objective Check → Release Ready，最低标准是 diff + 运行 + 一个边界用例。'),
    t('修 3 轮没修好就回滚，用新证据重新构造 prompt。'),
    t('快模型起草，强模型审查，测试验证一切。'),
  ];

  const [profile, setProfile] = useState<VibeProfile>({
    recommendedTrack: 'frontend',
    recommendedDifficulty: 'beginner',
    weakestDimension: null,
    recentAverageScore: null,
    trackScores: {
      frontend: null,
      backend: null,
      debugging: null,
      refactoring: null,
      review: null,
    },
  });
  const [history, setHistory] = useState<VibeHistoryItem[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<VibeTrack>('frontend');
  const [challenge, setChallenge] = useState<VibeChallenge | null>(null);
  const [draftPrompt, setDraftPrompt] = useState('');
  const [evaluation, setEvaluation] = useState<VibeEvaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState('');
  const [streamingChallengePreview, setStreamingChallengePreview] = useState('');
  const [streamingEvaluationPreview, setStreamingEvaluationPreview] = useState('');

  const loadArenaData = async () => {
    setLoading(true);
    setError('');
    try {
      const [profileData, historyData] = await Promise.all([fetchVibeProfile(), fetchVibeHistory()]);
      setProfile(profileData);
      setHistory(historyData);
      setSelectedTrack(initialTrack ?? profileData.recommendedTrack);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : t('加载训练场失败');
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadArenaData();
    // Initial load only. Subsequent refreshes are user-driven.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const latestScore = history[0]?.evaluation.total_score ?? profile.recentAverageScore;
  const weakestDimensionLabel = profile.weakestDimension ? dimensionMeta[profile.weakestDimension].label : t('暂无');
  const canEvaluate = Boolean(challenge && draftPrompt.trim().length >= 24 && !evaluating);

  const generateChallengeForTrack = async (track: VibeTrack) => {
    setGenerating(true);
    setError('');
    setSelectedTrack(track);
    setChallenge(null);
    setEvaluation(null);
    setStreamingChallengePreview('');
    setStreamingEvaluationPreview('');
    try {
      const nextChallenge = await generateVibeChallengeStream(track, locale, setStreamingChallengePreview);
      setChallenge(nextChallenge);
      setDraftPrompt('');
      setStreamingChallengePreview('');
    } catch (generationError) {
      const message = generationError instanceof Error ? generationError.message : t('生成题目失败');
      setError(message);
    } finally {
      setGenerating(false);
    }
  };

  const evaluatePrompt = async () => {
    if (!challenge) return;
    setEvaluating(true);
    setError('');
    setEvaluation(null);
    setStreamingEvaluationPreview('');
    try {
      const nextEvaluation = await evaluateVibePromptStream(challenge.id, draftPrompt, locale, setStreamingEvaluationPreview);
      setEvaluation(nextEvaluation);
      setStreamingEvaluationPreview('');
      const [profileData, historyData] = await Promise.all([fetchVibeProfile(), fetchVibeHistory()]);
      setProfile(profileData);
      setHistory(historyData);
      setSelectedTrack(profileData.recommendedTrack);
    } catch (evaluationError) {
      const message = evaluationError instanceof Error ? evaluationError.message : t('评分失败');
      setError(message);
    } finally {
      setEvaluating(false);
    }
  };

  const loadHistoryItem = (item: VibeHistoryItem, mode: 'retry' | 'rewrite') => {
    setChallenge(item.challenge);
    setSelectedTrack(item.track);
    setEvaluation(null);
    setStreamingChallengePreview('');
    setStreamingEvaluationPreview('');
    setDraftPrompt(mode === 'rewrite' ? item.evaluation.rewrite_example : item.promptText);
  };

  return (
    <div className="space-y-6">
      <motion.section {...fadeInUp} className="relative isolate overflow-visible rounded-[32px] border border-slate-200/80 bg-[linear-gradient(130deg,rgba(2,6,23,0.98),rgba(15,23,42,0.97)),radial-gradient(circle_at_top_left,rgba(34,197,94,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.2),transparent_32%)] p-6 text-slate-100 shadow-[0_40px_100px_-56px_rgba(15,23,42,0.9)] dark:border-slate-700/70 sm:p-7">
        <div className="relative grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex min-h-[36px] items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
                <Sparkles className="h-3.5 w-3.5" />
                {t('Vibe Coding 学习')}
              </span>
              <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs text-slate-300">
                {t('Prompt Arena 雏形')}
              </span>
            </div>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
              {t('把 prompt 书写从"感觉差不多"训练成可评分、可复练的专业能力。')}
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
              {t('这一版会根据你的账号历史推荐赛道与难度，由 AI 生成练习题，再只针对 prompt 质量做打分、维度点评和改写示范。')}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void generateChallengeForTrack(selectedTrack)}
                aria-busy={generating}
                className="inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition-all duration-200 hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70"
              >
                {generating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
                {t('开始一轮训练')}
              </button>
              <button
                type="button"
                onClick={onOpenAiGenerator}
                className="inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm font-semibold text-slate-100 transition-all duration-200 hover:border-slate-500 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70"
              >
                <ArrowRight className="h-4 w-4" />
                {t('切到 AI 出题')}
              </button>
              <button
                type="button"
                onClick={onOpenPracticeLibrary}
                className="inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                <Target className="h-4 w-4" />
                {t('回到题库练习')}
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            {[
              {
                icon: Bot,
                title: t('今日推荐赛道'),
                value: trackMeta[profile.recommendedTrack].label,
              },
              {
                icon: ShieldCheck,
                title: t('当前 AI 难度'),
                value: difficultyLabel(profile.recommendedDifficulty),
              },
              {
                icon: CheckCircle2,
                title: t('最近分数'),
                value: latestScore == null ? t('暂无记录') : `${Math.round(latestScore)}/100`,
              },
            ].map((card) => (
              <div key={card.title} className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <card.icon className="h-5 w-5 text-emerald-300" />
                <div className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{card.title}</div>
                <div className="mt-2 text-lg font-semibold text-white">{card.value}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <AnimatePresence>
      {error ? (
        <motion.div role="alert" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-100">
          {error}
        </motion.div>
      ) : null}
      </AnimatePresence>

      <motion.section initial="initial" animate="animate" variants={stagger} className="grid gap-6 xl:grid-cols-[1fr_1.1fr_1fr]">
        <motion.div variants={fadeInUp} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <Workflow className="h-4 w-4 text-indigo-500" />
            {t('训练赛道')}
          </div>
          <p className="mt-2 text-sm leading-8 text-slate-600 dark:text-slate-300">
            {t('系统会根据最近训练表现推荐赛道与难度。你也可以手动切换赛道，但难度依旧由 AI 自适应。')}
          </p>

          <div className="mt-5 grid gap-3">
            {TRACK_ORDER.map((track) => {
              const isActive = track === selectedTrack;
              const score = profile.trackScores[track];
              return (
                <button
                  key={track}
                  type="button"
                  onClick={() => setSelectedTrack(track)}
                  className={`cursor-pointer rounded-3xl border p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 ${
                    isActive
                      ? 'border-slate-900 bg-slate-900 text-white dark:border-indigo-500 dark:bg-indigo-500'
                      : 'border-slate-200 bg-slate-50 text-slate-900 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">{trackMeta[track].label}</div>
                      <div className={`mt-1 text-xs leading-6 ${isActive ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                        {trackMeta[track].summary}
                      </div>
                    </div>
                    <div className={`rounded-full px-3 py-1 text-[11px] font-medium ${isActive ? 'bg-white/10 text-white' : 'bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
                      {score == null ? t('未训练') : `${Math.round(score)}/100`}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/80">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">{t('AI 推荐画像')}</div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white px-4 py-3 dark:bg-slate-800">
                <div className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{t('推荐赛道')}</div>
                <div className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{trackMeta[profile.recommendedTrack].label}</div>
              </div>
              <div className="rounded-2xl bg-white px-4 py-3 dark:bg-slate-800">
                <div className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{t('薄弱维度')}</div>
                <div className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{weakestDimensionLabel}</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <MessageSquareQuote className="h-4 w-4 text-indigo-500" />
            {t('Prompt Arena 训练场')}
          </div>
          <p className="mt-2 text-sm leading-8 text-slate-600 dark:text-slate-300">
            {t('左边是 AI 题目，中间写 prompt，右边拿评分。首版只评 prompt 质量，不评代码结果。')}
          </p>

          <div className="mt-4 space-y-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/80">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    {challenge?.title || (generating ? t('AI 正在生成题目...') : t('尚未生成题目'))}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    {trackMeta[selectedTrack].label} · {difficultyLabel(profile.recommendedDifficulty)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => void generateChallengeForTrack(selectedTrack)}
                  className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500"
                >
                  {generating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  {challenge ? t('换一道题') : t('生成第一道题')}
                </button>
              </div>

              {generating ? (
                <LiveStreamingPanel title={t('AI 正在实时生成题目')} text={streamingChallengePreview || t('正在等待首个流式分片...')} />
              ) : challenge ? (
                <div className="mt-4 space-y-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{t('场景')}</div>
                    <p className="mt-2 text-sm leading-8 text-slate-700 dark:text-slate-200">{challenge.scenario}</p>
                  </div>
                  <div className="grid gap-3 xl:grid-cols-2">
                    <BulletPanel title={t('要求')} items={challenge.requirements} />
                    <BulletPanel title={t('限制')} items={challenge.constraints} />
                    <BulletPanel title={t('成功标准')} items={challenge.successCriteria} className="xl:col-span-2" />
                  </div>
                </div>
              ) : (
                <EmptyState
                  title={t('先生成一道练习题')}
                  description={t('建议先使用系统推荐赛道；如果你要专项训练，也可以手动切换赛道后再生成。')}
                />
              )}
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-slate-900 dark:text-white">{t('Prompt 编辑器')}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{draftPrompt.trim().length} {t('字符')}</div>
              </div>
              <textarea
                value={draftPrompt}
                onChange={(event) => setDraftPrompt(event.target.value)}
                aria-label={t('Prompt 编辑器')}
                placeholder={t('写出你的专业 prompt：目标、范围、验证、输出格式都要有。')}
                className="mt-2 min-h-[200px] w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-8 text-slate-800 transition-colors duration-200 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
              <div className="mt-3 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={!canEvaluate}
                  aria-busy={evaluating}
                  onClick={() => void evaluatePrompt()}
                  className="inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                >
                  {evaluating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {t('提交评分')}
                </button>
                <button
                  type="button"
                  onClick={() => setDraftPrompt('')}
                  className="inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500"
                >
                  <RefreshCw className="h-4 w-4" />
                  {t('清空重写')}
                </button>
              </div>
            </div>

            {selectedTrack === 'frontend' && <CodePreview t={t} />}
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <ShieldCheck className="h-4 w-4 text-indigo-500" />
            {t('评分结果')}
          </div>
          <AnimatePresence mode="wait">
          {evaluating ? (
            <motion.div key="streaming-eval" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="mt-4">
              <LiveStreamingPanel title={t('AI 正在实时评分')} text={streamingEvaluationPreview || t('正在等待首个流式分片...')} />
            </motion.div>
          ) : evaluation ? (
            <motion.div key="eval" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="mt-4 space-y-4">
              <div role="status" aria-live="polite" className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
                <div className="text-xs uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">{t('总分')}</div>
                <ScoreDisplay score={evaluation.total_score} />
                <div className="mt-2 text-sm text-emerald-900 dark:text-emerald-100">
                  {t('下一轮难度建议：')}{difficultyLabel(evaluation.next_difficulty_recommendation)}
                </div>
              </div>

              <div className="space-y-3">
                {DIMENSION_ORDER.map((dimension) => {
                  const value = evaluation.dimension_scores[dimension];
                  const meta = dimensionMeta[dimension];
                  return (
                    <div key={dimension} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">{meta.label}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">{value}/{meta.max}</div>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                        <div
                          className="h-2 rounded-full bg-emerald-500 transition-all duration-300"
                          style={{ width: `${(value / meta.max) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <FeedbackPanel title={t('做得好的地方')} items={evaluation.strengths} tone="emerald" />
              <FeedbackPanel title={t('需要补强的地方')} items={evaluation.weaknesses} tone="amber" />

              <div className="rounded-3xl border border-slate-900 bg-slate-950 p-4 text-slate-100 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.9)]">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{t('改写示范')}</div>
                <pre className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-200">{evaluation.rewrite_example}</pre>
                <button
                  type="button"
                  aria-label={t('用示范重练')}
                  onClick={() => setDraftPrompt(evaluation.rewrite_example)}
                  className="mt-4 inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-100 transition-all duration-200 hover:border-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60"
                >
                  <ArrowRight className="h-4 w-4" />
                  {t('用示范重练')}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
              <EmptyState
                title={t('这里会显示评分结果')}
                description={t('提交 prompt 后，你会看到总分、4 个维度分、优点、问题点和 AI 改写示范。')}
              />
            </motion.div>
          )}
          </AnimatePresence>
        </motion.div>
      </motion.section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.92fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">{t('训练历史')}</div>
            <button
              type="button"
              onClick={() => void loadArenaData()}
              aria-label={t('刷新')}
              aria-busy={loading}
              className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition-all duration-200 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-500"
            >
              {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              {t('刷新')}
            </button>
          </div>

          {history.length ? (
            <div className="mt-4 space-y-3">
              {history.slice(0, 6).map((item) => (
                <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">{item.challenge.title}</div>
                      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {trackMeta[item.track].label} · {Math.round(item.evaluation.total_score)}/100
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => loadHistoryItem(item, 'retry')}
                        className="inline-flex min-h-[44px] cursor-pointer items-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-all duration-200 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500"
                      >
                        {t('重做同题')}
                      </button>
                      <button
                        type="button"
                        onClick={() => loadHistoryItem(item, 'rewrite')}
                        className="inline-flex min-h-[44px] cursor-pointer items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-900 transition-all duration-200 hover:border-emerald-300 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-100"
                      >
                        {t('载入改写示范')}
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.challenge.scenario}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState
                title={t('还没有训练记录')}
                description={t('完成第一轮评分后，这里会显示你的历史成绩与复练入口。')}
              />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">{t('方法论模块')}</div>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('点击卡片展开完整学习单元')}</p>
              <Link
                to="/methodology"
                className="inline-flex items-center gap-1 rounded-full bg-klein-50 px-3 py-1 text-xs font-medium text-klein-600 transition-colors hover:bg-klein-100 dark:bg-klein-900/30 dark:text-klein-400 dark:hover:bg-klein-900/50"
              >
                {t('阅读完整文档')}
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <MethodologyGuide t={t} />
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">{t('一句话记忆法')}</div>
            <div className="mt-4 space-y-3">
              {memoryRules.map((rule) => (
                <div key={rule} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  {rule}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ScoreDisplay({ score }: { score: number }) {
  const display = useCountUp(score);
  return <div className="mt-2 text-4xl font-black text-emerald-900 dark:text-emerald-100">{display}<span className="ml-1 text-lg font-semibold">/100</span></div>;
}

function BulletPanel({ title, items, className }: { title: string; items: string[]; className?: string }) {
  const visibleItems = items.filter(Boolean);
  return (
    <div className={`rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 ${className ?? ''}`}>
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{title}</div>
      <div className="mt-3 space-y-2">
        {visibleItems.map((item, index) => (
          <div key={`${title}-${index}`} className="flex min-w-0 gap-3 rounded-2xl bg-slate-50 px-3 py-3 dark:bg-slate-900">
            <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500" />
            <span className="min-w-0 break-words text-sm leading-6 text-slate-700 dark:text-slate-200">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeedbackPanel({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: 'emerald' | 'amber';
}) {
  const toneClasses =
    tone === 'emerald'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-100'
      : 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-100';
  const visibleItems = items.filter(Boolean);

  return (
    <div className={`rounded-3xl border p-4 ${toneClasses}`}>
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-3 space-y-2">
        {visibleItems.map((item, index) => (
          <div key={`${title}-${index}`} className="rounded-2xl bg-white/70 px-4 py-3 text-sm leading-7 dark:bg-slate-900/40">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function LiveStreamingPanel({ title, text }: { title: string; text: string }) {
  return (
    <div aria-live="polite" className="mt-4 rounded-3xl border border-indigo-200 bg-indigo-50/80 p-4 shadow-sm dark:border-indigo-800 dark:bg-indigo-950/20">
      <div className="mb-2 flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
        <LoaderCircle className="h-4 w-4 animate-spin" />
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <pre className="max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-2xl bg-white/80 p-4 text-xs leading-6 text-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
        {text}
      </pre>
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center dark:border-slate-700 dark:bg-slate-900/60">
      <div className="text-sm font-semibold text-slate-900 dark:text-white">{title}</div>
      <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{description}</p>
    </div>
  );
}

function MethodologyGuide({ t }: { t: (s: string) => string }) {
  const [activeUnit, setActiveUnit] = useState<string | null>(null);
  const [expandedPoint, setExpandedPoint] = useState<string | null>(null);

  const toggle = (id: string) => {
    setActiveUnit(activeUnit === id ? null : id);
    setExpandedPoint(null);
  };

  const togglePoint = (key: string) => {
    setExpandedPoint(expandedPoint === key ? null : key);
  };

  return (
    <div className="mt-4 space-y-3">
      {methodologyUnits.map((unit) => {
        const isOpen = activeUnit === unit.id;
        return (
          <div key={unit.id} className="rounded-3xl border border-slate-200 bg-slate-50 transition-all dark:border-slate-700 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => toggle(unit.id)}
              className="flex w-full cursor-pointer items-center gap-3 p-4 text-left"
            >
              <unit.icon className="h-5 w-5 shrink-0 text-indigo-500" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-slate-900 dark:text-white">{t(unit.title)}</div>
                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{t(unit.summary)}</p>
              </div>
              <ChevronRight className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 border-t border-slate-200 px-4 pb-5 pt-4 dark:border-slate-700">
                    <p className="text-sm leading-7 text-slate-700 dark:text-slate-200">{t(unit.overview)}</p>

                    <div className="space-y-2">
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-400">{t('知识点')}</div>
                      {unit.points.map((pt, i) => {
                        const key = `${unit.id}-${i}`;
                        const ptOpen = expandedPoint === key;
                        return (
                          <div key={key} className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                            <button
                              type="button"
                              onClick={() => togglePoint(key)}
                              className="flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left"
                            >
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">{i + 1}</span>
                              <span className="flex-1 text-sm font-medium text-slate-900 dark:text-white">{t(pt.title)}</span>
                              <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-200 ${ptOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence>
                              {ptOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="space-y-3 border-t border-slate-100 px-4 pb-4 pt-3 dark:border-slate-700">
                                    <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{t(pt.detail)}</p>
                                    {pt.example && (
                                      <pre className="whitespace-pre-wrap rounded-xl bg-slate-50 px-3 py-3 text-xs leading-6 text-slate-700 dark:bg-slate-900 dark:text-slate-300">{pt.example}</pre>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>

                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">{t('实战练习')}</div>
                      <p className="mt-2 text-sm leading-7 text-emerald-900 dark:text-emerald-100">{t(unit.practice)}</p>
                      {unit.relatedTrack && (
                        <Link
                          to={`/practice?tab=vibe&track=${unit.relatedTrack}`}
                          className="mt-3 inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-emerald-500"
                        >
                          {t('前往 Prompt Arena 练习')}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      )}
                    </div>

                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
                      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300">
                        <TriangleAlert className="h-3.5 w-3.5" />
                        {t('常见误区')}
                      </div>
                      <ul className="mt-2 space-y-1.5">
                        {unit.pitfalls.map((p) => (
                          <li key={p} className="text-sm leading-7 text-amber-900 dark:text-amber-100">· {t(p)}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

const DEFAULT_PREVIEW_CODE = `<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: system-ui, sans-serif; padding: 2rem; background: #f8fafc; color: #1e293b; }
  h1 { color: #10b981; }
</style>
</head>
<body>
  <h1>Hello Vibe Coding!</h1>
  <p>Edit the code on the left to see live preview here.</p>
</body>
</html>`;

function CodePreview({ t }: { t: (s: string) => string }) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState(DEFAULT_PREVIEW_CODE);
  const [srcdoc, setSrcdoc] = useState(DEFAULT_PREVIEW_CODE);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const debounceRef = useRef(0);

  const runPreview = useCallback(() => {
    setSrcdoc(code);
  }, [code]);

  // Auto-preview with debounce
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => setSrcdoc(code), 800);
    return () => clearTimeout(debounceRef.current);
  }, [code]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-indigo-300 bg-indigo-50/50 px-4 py-3 text-sm font-medium text-indigo-700 transition-all duration-200 hover:border-indigo-400 hover:bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-950/20 dark:text-indigo-300 dark:hover:border-indigo-600"
      >
        <Code2 className="h-4 w-4" />
        {t('打开前端代码预览')}
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.3 }}
      className="mt-4 overflow-hidden rounded-3xl border border-indigo-200 bg-indigo-50/30 dark:border-indigo-900/50 dark:bg-indigo-950/10"
    >
      <div className="flex items-center justify-between gap-3 border-b border-indigo-200 px-4 py-3 dark:border-indigo-900/50">
        <div className="flex items-center gap-2 text-sm font-semibold text-indigo-900 dark:text-indigo-200">
          <Code2 className="h-4 w-4" />
          {t('前端代码预览')}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={runPreview}
            className="inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-500"
          >
            <Play className="h-3.5 w-3.5" />
            {t('运行')}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex min-h-[36px] cursor-pointer items-center rounded-xl border border-indigo-200 px-2 py-1.5 text-xs text-indigo-700 transition-colors hover:bg-indigo-100 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-900/30"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="grid md:grid-cols-2">
        <div className="border-r border-indigo-200 dark:border-indigo-900/50">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            aria-label={t('前端代码编辑器')}
            className="h-[360px] w-full resize-none bg-slate-950 p-4 font-mono text-xs leading-6 text-slate-100 focus-visible:outline-none"
          />
        </div>
        <div className="bg-white dark:bg-slate-900">
          <iframe
            ref={iframeRef}
            srcDoc={srcdoc}
            sandbox="allow-scripts"
            title={t('前端代码预览')}
            className="h-[360px] w-full border-0"
          />
        </div>
      </div>
    </motion.div>
  );
}
