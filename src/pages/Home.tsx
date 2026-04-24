import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Code2,
  FileText,
  GitBranch,
  Globe2,
  Layers,
  Link2,
  Play,
  RefreshCw,
  Volume2,
  VolumeX,
  Waves,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useI18n } from '../contexts/I18nContext';
import useLowMotionMode from '../hooks/useLowMotionMode';
import {
  GlassCard,
  getTone,
} from '../components/ui';
import type { ToneName } from '../components/ui';

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

const algorithms: Array<{
  id: string;
  name: string;
  category: string;
  Icon: LucideIcon;
}> = [
  { id: 'link-head-node', name: '单链表', category: '线性表', Icon: Link2 },
  { id: 'stack-sequence', name: '顺序栈', category: '栈', Icon: Layers },
  { id: 'queue-sequence', name: '循环队列', category: '队列', Icon: RefreshCw },
  { id: 'binary-tree', name: '二叉树遍历', category: '树', Icon: GitBranch },
  { id: 'sort-bubble', name: '冒泡排序', category: '排序', Icon: Waves },
  { id: 'sort-quick', name: '快速排序', category: '排序', Icon: Zap },
];

const learningPaths: Array<{
  title: string;
  desc: string;
  steps: string[];
  tone: ToneName;
  link: string;
  featured?: boolean;
}> = [
  {
    title: '入门路径',
    desc: '从零开始学习数据结构基础',
    steps: ['复杂度分析', '数组与链表', '栈和队列'],
    tone: 'emerald',
    link: '/book',
    featured: true,
  },
  {
    title: '进阶路径',
    desc: '掌握树和图的核心算法',
    steps: ['二叉树', '二叉搜索树', 'BFS/DFS'],
    tone: 'indigo',
    link: '/book',
  },
  {
    title: '算法专项',
    desc: '系统学习经典排序算法',
    steps: ['冒泡/选择', '快速/归并', '堆排序'],
    tone: 'amber',
    link: '/algorithms/sort-bubble',
  },
];

const features: Array<{
  Icon: LucideIcon;
  title: string;
  desc: string;
  tone: ToneName;
}> = [
  { Icon: Play, title: '动画演示', desc: '流畅的动画效果，直观展示数据结构的每一次变化过程', tone: 'indigo' },
  { Icon: Code2, title: '代码同步', desc: '动画执行与代码高亮实时同步，真正理解每行代码的含义', tone: 'emerald' },
  { Icon: Globe2, title: '多语言', desc: '支持 C++、Java、Python 三种主流语言，满足不同需求', tone: 'amber' },
  { Icon: FileText, title: '详细教程', desc: '配套详尽的图文教程和针对性练习题，巩固所学知识', tone: 'rose' },
];

// ─── Editorial eyebrow "01 · PRELUDE" 风格的 section 标号 ────────────
function EyebrowMarker({ num, label }: { num: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
      <span className="h-px w-6 bg-current opacity-50" />
      {num} · {label}
    </span>
  );
}

// ─── 签名手写感下划线 SVG ─────────────────────────────────────────
function SignatureUnderline() {
  return (
    <svg viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden>
      <path d="M 4 12 Q 60 4, 130 10 T 296 10" />
    </svg>
  );
}

// ─── 数字 count-up（stats 条）──────────────────────────────────────
function CountUpNumber({ to, suffix = '', duration = 1400 }: { to: number; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(eased * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ─── Hero Film — editorial parchment 区块，嵌入宣传动画 ───────────
function HeroFilm({
  isEnglish,
  t,
  lowMotion,
}: {
  isEnglish: boolean;
  t: (k: string) => string;
  lowMotion: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(containerRef, { once: false, amount: 0.4 });
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || lowMotion) return;
    if (inView) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [inView, lowMotion]);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !muted;
    v.muted = next;
    setMuted(next);
    if (!next) v.play().catch(() => {});
  };

  return (
    <section
      ref={containerRef}
      className="relative z-10 px-4 pb-14 pt-4 sm:px-6 sm:pb-20 lg:pb-28"
      aria-label={isEnglish ? 'Brand film about algorithms' : '关于算法的品牌短片'}
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={lowMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="editorial-parchment relative overflow-hidden rounded-3xl shadow-[0_20px_60px_-20px_rgba(30,41,59,0.25)] ring-1 ring-black/5 dark:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] dark:ring-white/5"
        >
          {/* Editorial chrome — 左上 + 右上 eyebrow 标注 */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 pt-4 sm:px-8 sm:pt-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-500/70 dark:text-parchment-300/60">
              00 · Prelude
            </span>
            <span className="font-serif text-[12px] italic text-ink-500/70 dark:text-parchment-300/60">
              <span className="mr-2 inline-block h-px w-6 translate-y-[-4px] bg-current align-middle opacity-60" />
              {isEnglish ? 'a film about algorithms' : '一部关于算法的短片'}
            </span>
          </div>

          {/* Video */}
          <div className="relative aspect-video">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              src="/hero/lingma-hero.mp4"
              poster="/hero/lingma-hero.gif"
              playsInline
              muted={muted}
              loop
              preload="metadata"
            />
            {/* 透明点击区：让用户能通过点击视频切换 mute */}
            <button
              type="button"
              onClick={toggleMute}
              className="group absolute inset-0 flex items-end justify-end p-5 focus-visible:outline-none sm:p-6"
              aria-label={muted ? t('开启声音') : t('关闭声音')}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md ring-1 ring-white/20 transition-all group-hover:scale-105 group-hover:bg-black/50 sm:h-12 sm:w-12">
                {muted ? <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" /> : <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />}
              </span>
            </button>
          </div>

          {/* Editorial caption */}
          <div className="relative z-10 grid gap-6 border-t border-ink-500/10 px-5 py-6 text-ink-500 dark:border-parchment-300/10 dark:text-parchment-200 sm:grid-cols-[1fr_auto] sm:items-end sm:px-8 sm:py-7">
            <div>
              <h3 className="font-serif text-2xl font-medium leading-tight tracking-tight sm:text-3xl">
                {isEnglish ? (
                  <><em className="italic font-normal">Make</em> it visible.</>
                ) : (
                  <>让算法 <em className="italic font-normal">被看见</em>。</>
                )}
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-500/70 dark:text-parchment-200/70">
                {isEnglish
                  ? 'Algorithms think in abstractions. We render the invisible — one frame at a time.'
                  : '算法是看不见的思考过程。我们用一帧一帧的动画，把它还原成你能看懂的样子。'}
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.22em] text-ink-500/60 dark:text-parchment-200/60">
              <span className="h-px w-5 bg-current opacity-50" />
              {muted ? (isEnglish ? 'TAP TO UNMUTE' : '点击取消静音') : (isEnglish ? 'SOUND ON' : '声音已开启')}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  const { theme } = useTheme();
  const { t, isEnglish } = useI18n();
  const lowMotionMode = useLowMotionMode();

  useEffect(() => {
    syncPageMetadata(
      isEnglish ? 'Home | Lingma 灵码' : '首页 | Lingma 灵码',
      `${t('交互式数据结构学习平台')} · ${t('告别枯燥的理论，通过交互式动画直观理解每一步操作。')}`,
    );
  }, [isEnglish, t]);

  const containerClass =
    theme === 'dark'
      ? 'min-h-screen text-slate-100 transition-colors duration-500 overflow-hidden'
      : 'min-h-screen text-slate-900 transition-colors duration-500 overflow-hidden';

  const heroFadeIn = lowMotionMode
    ? { initial: false as const, animate: { opacity: 1 } }
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } };

  return (
    <div className={containerClass}>
      {/* ═════════════════════════════════════════════════════════════ */}
      {/* HERO — serif editorial title + signature underline            */}
      {/* ═════════════════════════════════════════════════════════════ */}
      <section className="page-safe-top relative z-10 px-4 pb-10 sm:px-6 sm:pb-14 lg:pb-16">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div {...heroFadeIn}>
            <div className="mb-6 flex justify-center">
              <EyebrowMarker num="00" label={isEnglish ? 'INTRODUCING · LINGMA' : '灵码 · 序章'} />
            </div>

            <h1 className="font-serif text-5xl font-medium leading-[1.05] tracking-tight text-slate-900 sm:text-6xl md:text-7xl lg:text-8xl dark:text-white">
              {isEnglish ? (
                <>
                  Learn algorithms<br />
                  by <span className="signature-underline relative inline-block text-klein-600 dark:text-pine-400">
                    seeing
                    <SignatureUnderline />
                  </span>
                  {' '}them think.
                </>
              ) : (
                <>
                  用<span className="signature-underline relative inline-block text-klein-600 dark:text-pine-400">
                    动画
                    <SignatureUnderline />
                  </span>学懂
                  <br />
                  数据结构与算法
                </>
              )}
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg dark:text-slate-400">
              {t('告别枯燥的理论，通过交互式动画直观理解每一步操作。')}
              <br className="hidden md:block" />
              {t('代码与可视化同步，轻松掌握核心概念。')}
            </p>

            <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Link
                to="/book"
                className="group inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-2xl bg-klein-600 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-klein-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-klein-700 hover:shadow-xl hover:shadow-klein-600/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klein-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950"
              >
                <BookOpen className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                {t('开始学习')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} aria-hidden />
              </Link>
              <Link
                to="/algorithms"
                className="inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white/70 px-7 py-3 text-base font-semibold text-slate-700 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-klein-300 hover:text-klein-600 dark:border-slate-700/80 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:border-pine-500/50 dark:hover:text-pine-400"
              >
                <Play className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                {t('查看演示')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════ */}
      {/* HERO FILM — 宣传动画嵌入                                      */}
      {/* ═════════════════════════════════════════════════════════════ */}
      <HeroFilm isEnglish={isEnglish} t={t} lowMotion={lowMotionMode} />

      {/* ═════════════════════════════════════════════════════════════ */}
      {/* STATS — 数字 count-up                                         */}
      {/* ═════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 px-4 pb-14 sm:px-6 sm:pb-20 lg:pb-28">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-slate-200/60 text-center ring-1 ring-slate-200/60 dark:bg-slate-800/50 dark:ring-slate-800/60 md:grid-cols-4">
            {[
              { value: 6, suffix: '', label: t('章节内容') },
              { value: 35, suffix: '+', label: t('知识点') },
              { value: 7, suffix: '', label: t('排序算法') },
              { value: 3, suffix: '', label: t('编程语言') },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="relative bg-white/80 px-4 py-6 backdrop-blur-md sm:py-8 dark:bg-slate-900/60"
              >
                <div className="font-serif text-3xl font-medium text-klein-600 sm:text-4xl lg:text-5xl dark:text-pine-400">
                  <CountUpNumber to={stat.value} suffix={stat.suffix} duration={1200 + i * 150} />
                </div>
                <div className="mt-2 text-[11px] font-mono uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════ */}
      {/* LEARNING PATHS — 非对称 bento（1 featured + 2 紧凑）           */}
      {/* ═════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 px-4 pb-14 sm:px-6 sm:pb-20 lg:pb-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 sm:mb-14">
            <EyebrowMarker num="01" label={isEnglish ? 'LEARNING PATHS' : '学习路径'} />
            <h2 className="mt-4 font-serif text-3xl font-medium tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
              {t('学习路径')}
            </h2>
            <p className="mt-3 max-w-xl text-sm text-slate-500 sm:text-base dark:text-slate-400">
              {t('为不同阶段的学习者量身定制')}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-5">
            {learningPaths.map((path) => {
              const tone = getTone(path.tone);
              const isFeatured = path.featured;
              return (
                <Link
                  key={path.title}
                  to={path.link}
                  className={`group ${isFeatured ? 'md:col-span-3 md:row-span-2' : 'md:col-span-2'}`}
                >
                  <GlassCard
                    variant={isFeatured ? 'frosted' : 'soft'}
                    padding={isFeatured ? 'lg' : 'md'}
                    hoverable
                    glow={path.tone}
                    className={`flex h-full flex-col ${isFeatured ? 'min-h-[320px]' : ''}`}
                  >
                    <div className="relative z-10 flex items-start justify-between gap-4">
                      <div>
                        <span className={`inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] ${tone.text}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
                          {isFeatured ? (isEnglish ? 'Recommended' : '推荐起点') : (isEnglish ? 'Path' : '路径')}
                        </span>
                        <h3 className={`mt-3 font-serif ${isFeatured ? 'text-3xl sm:text-4xl' : 'text-xl sm:text-2xl'} font-medium tracking-tight text-slate-900 transition-colors group-hover:text-klein-600 dark:text-white dark:group-hover:text-pine-400`}>
                          {t(path.title)}
                        </h3>
                        <p className={`mt-2 ${isFeatured ? 'text-base' : 'text-sm'} leading-relaxed text-slate-500 dark:text-slate-400`}>
                          {t(path.desc)}
                        </p>
                      </div>
                    </div>
                    <div className="relative z-10 mt-6 flex-1 space-y-3">
                      {path.steps.map((step, i) => (
                        <div key={step} className="flex items-center gap-3">
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-mono ${tone.bg} ${tone.text} ${tone.border}`}
                          >
                            {i + 1}
                          </span>
                          <span className={`${isFeatured ? 'text-base' : 'text-sm'} font-medium text-slate-700 dark:text-slate-300`}>
                            {t(step)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="relative z-10 mt-6 flex items-center gap-1.5 text-xs font-medium text-klein-500 opacity-70 transition-opacity group-hover:opacity-100 dark:text-pine-400">
                      <span>{t('开始学习')}</span>
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                    </div>
                  </GlassCard>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════ */}
      {/* QUICK START — 移动端 horizontal snap scroll                    */}
      {/* ═════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 pb-14 sm:pb-20 lg:pb-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-10 flex items-end justify-between gap-4 sm:mb-14">
            <div>
              <EyebrowMarker num="02" label={isEnglish ? 'QUICK START' : '快速开始'} />
              <h2 className="mt-4 font-serif text-3xl font-medium tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
                {t('快速体验')}
              </h2>
              <p className="mt-3 max-w-xl text-sm text-slate-500 sm:text-base dark:text-slate-400">
                {t('精选算法可视化演示，即点即用')}
              </p>
            </div>
            <Link
              to="/algorithms"
              className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-klein-600 transition-colors hover:text-klein-700 dark:text-pine-400 dark:hover:text-pine-300 sm:inline-flex"
            >
              {isEnglish ? 'All algorithms' : '全部算法'}
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </Link>
          </div>
        </div>

        {/* Mobile: horizontal snap scroll; ≥ sm: grid */}
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 [&::-webkit-scrollbar]:hidden sm:mx-auto sm:grid sm:max-w-5xl sm:grid-cols-2 sm:snap-none sm:gap-5 sm:overflow-visible sm:px-6 sm:pb-0 md:grid-cols-3">
          {algorithms.map((algo, idx) => {
            const AlgoIcon = algo.Icon;
            return (
              <motion.div
                key={algo.id}
                className="min-w-[78%] shrink-0 snap-center sm:min-w-0 sm:shrink"
                initial={lowMotionMode ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={
                  lowMotionMode
                    ? { duration: 0 }
                    : { duration: 0.35, ease: 'easeOut', delay: idx * 0.04 }
                }
              >
                <Link to={`/algorithms/${algo.id}`} className="group block">
                  <GlassCard variant="soft" padding="sm" hoverable className="flex items-center gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-klein-50 text-klein-600 transition-transform group-hover:scale-105 dark:bg-klein-900/30 dark:text-pine-400">
                      <AlgoIcon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                        {t(algo.category)}
                      </span>
                      <h3 className="truncate font-serif text-lg font-medium text-slate-900 transition-colors group-hover:text-klein-600 dark:text-white dark:group-hover:text-pine-400">
                        {t(algo.name)}
                      </h3>
                    </div>
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-klein-400 dark:text-slate-600"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                  </GlassCard>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════ */}
      {/* WHY US — 4 个特性                                              */}
      {/* ═════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 px-4 pb-14 sm:px-6 sm:pb-20 lg:pb-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center sm:mb-14">
            <div className="inline-block">
              <EyebrowMarker num="03" label={isEnglish ? 'WHY LINGMA' : '为什么是灵码'} />
            </div>
            <h2 className="mt-4 font-serif text-3xl font-medium tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
              {t('为什么选择我们')}
            </h2>
            <p className="mt-3 text-sm text-slate-500 sm:text-base dark:text-slate-400">
              {t('精心打磨的每一个细节')}
            </p>
          </div>

          <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature, idx) => {
              const tone = getTone(feature.tone);
              const FeatureIcon = feature.Icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={lowMotionMode ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={
                    lowMotionMode
                      ? { duration: 0 }
                      : { duration: 0.4, ease: 'easeOut', delay: idx * 0.06 }
                  }
                >
                  <GlassCard variant="soft" padding="md" hoverable className="h-full text-center">
                    <div
                      className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${tone.bg} ${tone.border} ${tone.text} border`}
                    >
                      <FeatureIcon className="h-7 w-7" strokeWidth={1.75} aria-hidden />
                    </div>
                    <h3 className="mb-2 font-serif text-xl font-medium text-slate-900 dark:text-white">
                      {t(feature.title)}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                      {t(feature.desc)}
                    </p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════ */}
      {/* CTA — Editorial 风格结尾                                      */}
      {/* ═════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 px-4 pb-20 sm:px-6 sm:pb-32">
        <motion.div
          initial={lowMotionMode ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mx-auto max-w-4xl"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-klein-500 via-klein-600 to-klein-700 px-6 py-14 text-center text-white shadow-2xl shadow-klein-700/30 sm:px-12 sm:py-20">
            {/* Pine Yellow sparkle corner */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-pine-500/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-klein-300/20 blur-3xl" />

            <span className="relative z-10 inline-flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.22em] text-pine-200">
              <span className="h-px w-6 bg-pine-300/70" />
              04 · {isEnglish ? 'BEGIN' : '启程'}
            </span>

            <h2 className="relative z-10 mt-5 font-serif text-3xl font-medium leading-tight tracking-tight sm:text-5xl md:text-6xl">
              {isEnglish ? (
                <>Ready to see<br />algorithms <em className="italic font-normal text-pine-300">think?</em></>
              ) : (
                <>准备好开启<br /><em className="italic font-normal text-pine-300">算法之旅</em>了吗？</>
              )}
            </h2>
            <p className="relative z-10 mx-auto mt-6 max-w-xl text-base text-white/85 sm:text-lg">
              {t('不需要繁琐的配置，打开浏览器即可开始学习。')}
              <br className="hidden sm:block" />
              {t('从基础到进阶，我们陪你一起成长。')}
            </p>
            <div className="relative z-10 mt-10">
              <Link
                to="/book"
                className="group inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-2xl bg-white px-8 py-3.5 text-base font-semibold text-klein-700 shadow-lg shadow-black/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-400 focus-visible:ring-offset-2 focus-visible:ring-offset-klein-600"
              >
                {t('立即免费开始')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.75} aria-hidden />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
