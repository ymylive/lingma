import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Waves,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useI18n } from '../contexts/I18nContext';
import useLowMotionMode from '../hooks/useLowMotionMode';
import {
  GlassCard,
  PageHero,
  SectionHeader,
  StatStrip,
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
}> = [
  {
    title: '入门路径',
    desc: '从零开始学习数据结构基础',
    steps: ['复杂度分析', '数组与链表', '栈和队列'],
    tone: 'emerald',
    link: '/book',
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

export default function Home() {
  const { theme } = useTheme();
  const { t, isEnglish } = useI18n();
  const lowMotionMode = useLowMotionMode();

  const revealUp = lowMotionMode
    ? {
        initial: false as const,
        whileInView: { opacity: 1 },
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0 },
      }
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0.45, ease: 'easeOut' as const },
      };

  useEffect(() => {
    syncPageMetadata(
      isEnglish ? 'Home | Tumafang' : '首页 | Tumafang',
      `${t('交互式数据结构学习平台')} · ${t('告别枯燥的理论，通过交互式动画直观理解每一步操作。')}`,
    );
  }, [isEnglish, t]);

  const containerClass =
    theme === 'dark'
      ? 'min-h-screen text-slate-100 transition-colors duration-500 overflow-hidden'
      : 'min-h-screen text-slate-900 transition-colors duration-500 overflow-hidden';

  return (
    <div className={containerClass}>
      {/* Hero */}
      <PageHero
        eyebrow={t('交互式数据结构学习平台')}
        title={
          isEnglish ? (
            <>
              Learn with <span className="text-gradient">Animation</span>
              <br />
              Data Structures &amp; Algorithms
            </>
          ) : (
            <>
              用<span className="text-gradient">动画</span>学懂
              <br />
              数据结构与算法
            </>
          )
        }
        description={
          <>
            {t('告别枯燥的理论，通过交互式动画直观理解每一步操作。')}
            <br className="hidden md:block" />
            {t('代码与可视化同步，轻松掌握核心概念。')}
          </>
        }
        primaryAction={{
          label: t('开始学习'),
          to: '/book',
          icon: <BookOpen className="h-5 w-5" strokeWidth={1.75} aria-hidden />,
        }}
        secondaryAction={{
          label: t('查看演示'),
          to: '/algorithms',
          icon: <Play className="h-5 w-5" strokeWidth={1.75} aria-hidden />,
        }}
      />

      {/* Stats */}
      <section className="relative z-10 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <StatStrip
            items={[
              { value: '6', label: t('章节内容'), tone: 'klein' },
              { value: '35+', label: t('知识点'), tone: 'emerald' },
              { value: '7', label: t('排序算法'), tone: 'amber' },
              { value: '3', label: t('编程语言'), tone: 'rose' },
            ]}
          />
        </div>
      </section>

      {/* Learning Paths */}
      <section className="relative z-10 px-4 py-24 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <SectionHeader
            eyebrow="Learning Paths"
            title={t('学习路径')}
            description={t('为不同阶段的学习者量身定制')}
          />

          <div className="grid gap-5 sm:gap-6 md:grid-cols-3">
            {learningPaths.map((path) => {
              const tone = getTone(path.tone);
              return (
                <Link key={path.title} to={path.link} className="group block h-full">
                  <GlassCard variant="soft" padding="md" hoverable glow={path.tone} className="h-full">
                    <h3 className="relative z-10 mb-2 text-lg font-bold text-slate-900 transition-colors group-hover:text-klein-600 dark:text-white dark:group-hover:text-klein-400">
                      {t(path.title)}
                    </h3>
                    <p className="relative z-10 mb-6 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                      {t(path.desc)}
                    </p>
                    <div className="relative z-10 space-y-3">
                      {path.steps.map((step, i) => (
                        <div key={step} className="flex items-center gap-3">
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold ${tone.bg} ${tone.text} ${tone.border}`}
                          >
                            {i + 1}
                          </span>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {t(step)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="relative z-10 mt-6 flex items-center gap-1.5 text-xs font-medium text-klein-500 opacity-0 transition-opacity group-hover:opacity-100 dark:text-klein-400">
                      <span>{t('开始学习')}</span>
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
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

      {/* Quick Access */}
      <section className="relative z-10 px-4 py-24 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="divider-fade mb-24 sm:mb-32" />
          <SectionHeader
            eyebrow="Quick Start"
            title={t('快速体验')}
            description={t('精选算法可视化演示，即点即用')}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3">
            {algorithms.map((algo, idx) => {
              const AlgoIcon = algo.Icon;
              return (
                <motion.div
                  key={algo.id}
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
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-klein-600 transition-transform group-hover:scale-105 dark:bg-slate-700/80 dark:text-klein-400 sm:h-12 sm:w-12">
                        <AlgoIcon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-klein-500 dark:text-klein-400">
                          {t(algo.category)}
                        </span>
                        <h3 className="truncate font-semibold text-slate-900 transition-colors group-hover:text-klein-600 dark:text-white dark:group-hover:text-klein-400">
                          {t(algo.name)}
                        </h3>
                      </div>
                      <ArrowRight
                        className="ml-auto h-4 w-4 shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-klein-400 dark:text-slate-600"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                    </GlassCard>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-4 py-24 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="divider-fade mb-24 sm:mb-32" />
          <SectionHeader
            eyebrow="Why Us"
            title={t('为什么选择我们')}
            description={t('精心打磨的每一个细节')}
          />

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
                  <GlassCard variant="soft" padding="md" hoverable className="text-center">
                    <div
                      className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${tone.bg} ${tone.border} ${tone.text} border`}
                    >
                      <FeatureIcon className="h-8 w-8" strokeWidth={1.75} aria-hidden />
                    </div>
                    <h3 className="mb-2 text-base font-bold text-slate-900 dark:text-white">
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

      {/* CTA */}
      <section className="relative z-10 px-4 pb-24 pt-8 sm:px-6 sm:pb-32 sm:pt-12">
        <motion.div className="mx-auto max-w-4xl" {...revealUp}>
          <PageHero
            variant="cta"
            title={t('准备好开启算法之旅了吗？')}
            description={
              <>
                {t('不需要繁琐的配置，打开浏览器即可开始学习。')}
                <br />
                {t('从基础到进阶，我们陪你一起成长。')}
              </>
            }
            primaryAction={{ label: t('立即免费开始'), to: '/book' }}
          />
        </motion.div>
      </section>
    </div>
  );
}
