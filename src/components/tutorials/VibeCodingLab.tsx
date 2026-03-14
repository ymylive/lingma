import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  CheckCircle2,
  GitBranch,
  LoaderCircle,
  MessageSquareQuote,
  RefreshCw,
  Rocket,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Target,
  TerminalSquare,
  Workflow,
} from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';
import {
  evaluateVibePrompt,
  fetchVibeHistory,
  fetchVibeProfile,
  generateVibeChallenge,
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
}

const TRACK_ORDER: VibeTrack[] = ['frontend', 'backend', 'debugging', 'refactoring', 'review'];
const DIMENSION_ORDER: VibeDimensionKey[] = [
  'goal_clarity',
  'boundary_constraints',
  'verification_design',
  'output_format',
];

export default function VibeCodingLab({ onOpenAiGenerator, onOpenPracticeLibrary }: Props) {
  const { isEnglish } = useI18n();
  const text = (zh: string, en: string) => (isEnglish ? en : zh);

  const trackMeta: Record<VibeTrack, { label: string; summary: string }> = {
    frontend: {
      label: text('前端', 'Frontend'),
      summary: text('页面改造、交互、主题、组件拆分。', 'UI changes, interactions, theming, and component boundaries.'),
    },
    backend: {
      label: text('后端', 'Backend'),
      summary: text('接口、数据库、鉴权、部署链路。', 'APIs, persistence, auth, and deployment flows.'),
    },
    debugging: {
      label: text('调试', 'Debugging'),
      summary: text('复现、取证、根因、回归验证。', 'Reproduction, evidence, root cause, and regression checks.'),
    },
    refactoring: {
      label: text('重构', 'Refactoring'),
      summary: text('职责收口、重复抽离、小批次拆分。', 'Responsibility cleanup, extraction, and reversible splitting.'),
    },
    review: {
      label: text('审查', 'Review'),
      summary: text('风险分级、正确性、性能与安全。', 'Risk triage, correctness, performance, and security.'),
    },
  };

  const dimensionMeta: Record<VibeDimensionKey, { label: string; max: number }> = {
    goal_clarity: { label: text('目标清晰度', 'Goal Clarity'), max: 30 },
    boundary_constraints: { label: text('边界约束', 'Boundary Constraints'), max: 25 },
    verification_design: { label: text('验证设计', 'Verification Design'), max: 25 },
    output_format: { label: text('输出格式', 'Output Format'), max: 20 },
  };

  const moduleCards = [
    {
      icon: BrainCircuit,
      title: text('专业闭环', 'Core Loop'),
      summary: text('Define -> Gather -> Implement -> Verify -> Deliver。', 'Define, Gather, Implement, Verify, Deliver.'),
    },
    {
      icon: Sparkles,
      title: text('Skills', 'Skills'),
      summary: text('先流程型，再领域型；组合最小化。', 'Use workflow skills first, then add one domain skill if needed.'),
    },
    {
      icon: TerminalSquare,
      title: text('MCP', 'MCP'),
      summary: text('实时事实交给工具，模型只负责判断。', 'Let tools collect live evidence; let the model reason on it.'),
    },
    {
      icon: MessageSquareQuote,
      title: text('专业提示词', 'Professional Prompting'),
      summary: text('目标、范围、验证、交付格式都要写明。', 'Name the goal, scope, verification path, and deliverable format.'),
    },
    {
      icon: GitBranch,
      title: text('AI 蜂群', 'AI Swarm'),
      summary: text('按最小可交付单元拆任务，不让多人同时改一文件。', 'Split by smallest deliverable unit and avoid overlapping edits.'),
    },
    {
      icon: ScrollText,
      title: text('写作规范', 'Writing Standards'),
      summary: text('结论先行，证据具体，未验证要明说。', 'Lead with the conclusion, keep evidence concrete, and be honest about gaps.'),
    },
  ];

  const memoryRules = [
    text('先定义任务，再让 AI 开始产出。', 'Define the task before asking AI to generate.'),
    text('需要实时事实时，先上 MCP，不靠记忆瞎猜。', 'Use MCP before guessing when live facts matter.'),
    text('评分低分最常见原因不是词不够高级，而是没有边界和验证。', 'Most low scores come from missing boundaries and verification, not from wording quality.'),
    text('蜂群适合并行任务，不适合同文件混战。', 'Swarms fit parallel work, not file-level collisions.'),
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

  const loadArenaData = async () => {
    setLoading(true);
    setError('');
    try {
      const [profileData, historyData] = await Promise.all([fetchVibeProfile(), fetchVibeHistory()]);
      setProfile(profileData);
      setHistory(historyData);
      setSelectedTrack(profileData.recommendedTrack);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : text('加载训练场失败', 'Failed to load the Prompt Arena');
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
  const weakestDimensionLabel = profile.weakestDimension ? dimensionMeta[profile.weakestDimension].label : text('暂无', 'None yet');
  const canEvaluate = Boolean(challenge && draftPrompt.trim().length >= 24 && !evaluating);

  const generateChallengeForTrack = async (track: VibeTrack) => {
    setGenerating(true);
    setError('');
    setSelectedTrack(track);
    setEvaluation(null);
    try {
      const nextChallenge = await generateVibeChallenge(track);
      setChallenge(nextChallenge);
      setDraftPrompt('');
    } catch (generationError) {
      const message = generationError instanceof Error ? generationError.message : text('生成题目失败', 'Failed to generate challenge');
      setError(message);
    } finally {
      setGenerating(false);
    }
  };

  const evaluatePrompt = async () => {
    if (!challenge) return;
    setEvaluating(true);
    setError('');
    try {
      const nextEvaluation = await evaluateVibePrompt(challenge.id, draftPrompt);
      setEvaluation(nextEvaluation);
      const [profileData, historyData] = await Promise.all([fetchVibeProfile(), fetchVibeHistory()]);
      setProfile(profileData);
      setHistory(historyData);
      setSelectedTrack(profileData.recommendedTrack);
    } catch (evaluationError) {
      const message = evaluationError instanceof Error ? evaluationError.message : text('评分失败', 'Failed to score prompt');
      setError(message);
    } finally {
      setEvaluating(false);
    }
  };

  const loadHistoryItem = (item: VibeHistoryItem, mode: 'retry' | 'rewrite') => {
    setChallenge(item.challenge);
    setSelectedTrack(item.track);
    setEvaluation(null);
    setDraftPrompt(mode === 'rewrite' ? item.evaluation.rewrite_example : item.promptText);
  };

  return (
    <div className="space-y-6">
      <section className="relative isolate overflow-hidden rounded-[32px] border border-slate-200/80 bg-[linear-gradient(130deg,rgba(2,6,23,0.98),rgba(15,23,42,0.97)),radial-gradient(circle_at_top_left,rgba(34,197,94,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.2),transparent_32%)] p-6 text-slate-100 shadow-[0_40px_100px_-56px_rgba(15,23,42,0.9)] dark:border-slate-700/70 sm:p-7">
        <div className="relative grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex min-h-[36px] items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
                <Sparkles className="h-3.5 w-3.5" />
                {text('Vibe Coding 学习', 'Vibe Coding Lab')}
              </span>
              <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs text-slate-300">
                {text('Prompt Arena 雏形', 'Prompt Arena Prototype')}
              </span>
            </div>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
              {text('把 prompt 书写从“感觉差不多”训练成可评分、可复练的专业能力。', 'Train prompt writing from intuition into a scored, repeatable professional skill.')}
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
              {text(
                '这一版会根据你的账号历史推荐赛道与难度，由 AI 生成练习题，再只针对 prompt 质量做打分、维度点评和改写示范。',
                'This version recommends a track and difficulty from your account history, generates one AI challenge, and scores prompt quality only with dimension feedback and a rewrite example.',
              )}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void generateChallengeForTrack(selectedTrack)}
                className="inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition-all duration-200 hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70"
              >
                {generating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
                {text('开始一轮训练', 'Start a Training Round')}
              </button>
              <button
                type="button"
                onClick={onOpenAiGenerator}
                className="inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm font-semibold text-slate-100 transition-all duration-200 hover:border-slate-500 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70"
              >
                <ArrowRight className="h-4 w-4" />
                {text('切到 AI 出题', 'Open AI Generator')}
              </button>
              <button
                type="button"
                onClick={onOpenPracticeLibrary}
                className="inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                <Target className="h-4 w-4" />
                {text('回到题库练习', 'Back to Practice Library')}
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            {[
              {
                icon: Bot,
                title: text('今日推荐赛道', 'Recommended Track'),
                value: trackMeta[profile.recommendedTrack].label,
              },
              {
                icon: ShieldCheck,
                title: text('当前 AI 难度', 'Adaptive Difficulty'),
                value: text(
                  profile.recommendedDifficulty === 'beginner'
                    ? '入门'
                    : profile.recommendedDifficulty === 'intermediate'
                      ? '进阶'
                      : '困难',
                  profile.recommendedDifficulty,
                ),
              },
              {
                icon: CheckCircle2,
                title: text('最近分数', 'Recent Score'),
                value: latestScore == null ? text('暂无记录', 'No attempts yet') : `${Math.round(latestScore)}/100`,
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
      </section>

      {error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-100">
          {error}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1fr_0.92fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <Workflow className="h-4 w-4 text-indigo-500" />
            {text('Today Panel', 'Today Panel')}
          </div>
          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
            {text('系统会根据最近训练表现推荐赛道与难度。你也可以手动切换赛道，但难度依旧由 AI 自适应。', 'The system recommends a track and difficulty from recent attempts. You can switch tracks manually while difficulty remains adaptive.')}
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
                      {score == null ? text('未训练', 'No score') : `${Math.round(score)}/100`}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/80">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">{text('AI 推荐画像', 'Adaptive Profile')}</div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white px-4 py-3 dark:bg-slate-800">
                <div className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{text('推荐赛道', 'Recommended Track')}</div>
                <div className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{trackMeta[profile.recommendedTrack].label}</div>
              </div>
              <div className="rounded-2xl bg-white px-4 py-3 dark:bg-slate-800">
                <div className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{text('薄弱维度', 'Weakest Dimension')}</div>
                <div className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{weakestDimensionLabel}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <MessageSquareQuote className="h-4 w-4 text-indigo-500" />
            {text('Prompt Arena', 'Prompt Arena')}
          </div>
          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
            {text('左边是 AI 题目，中间写 prompt，右边拿评分。首版只评 prompt 质量，不评代码结果。', 'AI gives the challenge, you write the prompt, and the arena scores prompt quality only.')}
          </p>

          <div className="mt-5 space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/80">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    {challenge?.title || text('尚未生成题目', 'No challenge generated yet')}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    {trackMeta[selectedTrack].label} · {text(
                      profile.recommendedDifficulty === 'beginner'
                        ? '入门'
                        : profile.recommendedDifficulty === 'intermediate'
                          ? '进阶'
                          : '困难',
                      profile.recommendedDifficulty,
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => void generateChallengeForTrack(selectedTrack)}
                  className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500"
                >
                  {generating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  {text('换一道题', 'Generate Challenge')}
                </button>
              </div>

              {challenge ? (
                <div className="mt-4 space-y-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{text('场景', 'Scenario')}</div>
                    <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-200">{challenge.scenario}</p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    <BulletPanel title={text('要求', 'Requirements')} items={challenge.requirements} />
                    <BulletPanel title={text('限制', 'Constraints')} items={challenge.constraints} />
                    <BulletPanel title={text('成功标准', 'Success Criteria')} items={challenge.successCriteria} />
                  </div>
                </div>
              ) : (
                <EmptyState
                  title={text('先生成一道练习题', 'Generate your first challenge')}
                  description={text('建议先使用系统推荐赛道；如果你要专项训练，也可以手动切换赛道后再生成。', 'Start with the system recommendation or switch tracks manually for focused practice.')}
                />
              )}
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-slate-900 dark:text-white">{text('Prompt Editor', 'Prompt Editor')}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{draftPrompt.trim().length} {text('字符', 'chars')}</div>
              </div>
              <textarea
                value={draftPrompt}
                onChange={(event) => setDraftPrompt(event.target.value)}
                placeholder={text(
                  '写出你的专业 prompt：目标、范围、验证、输出格式都要有。',
                  'Write your professional prompt here: include goal, scope, verification, and deliverable format.',
                )}
                className="mt-3 min-h-[220px] w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-800 transition-colors duration-200 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={!canEvaluate}
                  onClick={() => void evaluatePrompt()}
                  className="inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                >
                  {evaluating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {text('提交评分', 'Evaluate Prompt')}
                </button>
                <button
                  type="button"
                  onClick={() => setDraftPrompt('')}
                  className="inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500"
                >
                  <RefreshCw className="h-4 w-4" />
                  {text('清空重写', 'Clear Draft')}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <ShieldCheck className="h-4 w-4 text-indigo-500" />
            {text('评分结果', 'Evaluation Result')}
          </div>
          {evaluation ? (
            <div className="mt-4 space-y-4">
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
                <div className="text-xs uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">{text('总分', 'Total Score')}</div>
                <div className="mt-2 text-4xl font-black text-emerald-900 dark:text-emerald-100">{evaluation.total_score}<span className="ml-1 text-lg font-semibold">/100</span></div>
                <div className="mt-2 text-sm text-emerald-900 dark:text-emerald-100">
                  {text('下一轮难度建议：', 'Next difficulty recommendation: ')}
                  {text(
                    evaluation.next_difficulty_recommendation === 'beginner'
                      ? '入门'
                      : evaluation.next_difficulty_recommendation === 'intermediate'
                        ? '进阶'
                        : '困难',
                    evaluation.next_difficulty_recommendation,
                  )}
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

              <FeedbackPanel title={text('做得好的地方', 'Strengths')} items={evaluation.strengths} tone="emerald" />
              <FeedbackPanel title={text('需要补强的地方', 'Weaknesses')} items={evaluation.weaknesses} tone="amber" />

              <div className="rounded-3xl border border-slate-900 bg-slate-950 p-4 text-slate-100 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.9)]">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{text('改写示范', 'Rewrite Example')}</div>
                <pre className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-200">{evaluation.rewrite_example}</pre>
                <button
                  type="button"
                  onClick={() => setDraftPrompt(evaluation.rewrite_example)}
                  className="mt-4 inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-100 transition-all duration-200 hover:border-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60"
                >
                  <ArrowRight className="h-4 w-4" />
                  {text('用示范重练', 'Retry with Rewrite')}
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState
                title={text('这里会显示评分结果', 'The scorecard appears here')}
                description={text('提交 prompt 后，你会看到总分、4 个维度分、优点、问题点和 AI 改写示范。', 'After submission you will see the total score, four dimension scores, strengths, weaknesses, and an AI rewrite example.')}
              />
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.92fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">{text('训练历史', 'Training History')}</div>
            <button
              type="button"
              onClick={() => void loadArenaData()}
              className="inline-flex min-h-[40px] cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition-all duration-200 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-500"
            >
              {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              {text('刷新', 'Refresh')}
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
                        className="inline-flex min-h-[40px] cursor-pointer items-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-all duration-200 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500"
                      >
                        {text('重做同题', 'Retry')}
                      </button>
                      <button
                        type="button"
                        onClick={() => loadHistoryItem(item, 'rewrite')}
                        className="inline-flex min-h-[40px] cursor-pointer items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-900 transition-all duration-200 hover:border-emerald-300 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-100"
                      >
                        {text('载入改写示范', 'Use Rewrite')}
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
                title={text('还没有训练记录', 'No training history yet')}
                description={text('完成第一轮评分后，这里会显示你的历史成绩与复练入口。', 'After your first scored attempt, this panel will keep your history and replay actions.')}
              />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">{text('方法论模块', 'Method Modules')}</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {moduleCards.map((card) => (
                <div key={card.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                  <card.icon className="h-5 w-5 text-indigo-500" />
                  <div className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">{card.title}</div>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{card.summary}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">{text('一句话记忆法', 'One-Line Memory Rules')}</div>
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

function BulletPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{title}</div>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div key={item} className="rounded-2xl bg-slate-50 px-3 py-3 text-sm leading-7 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
            {item}
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

  return (
    <div className={`rounded-3xl border p-4 ${toneClasses}`}>
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div key={item} className="rounded-2xl bg-white/70 px-4 py-3 text-sm leading-7 dark:bg-slate-900/40">
            {item}
          </div>
        ))}
      </div>
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
