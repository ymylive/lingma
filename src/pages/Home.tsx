import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useI18n } from '../contexts/I18nContext';
import { motion, type Variants } from 'framer-motion';
import useLowMotionMode from '../hooks/useLowMotionMode';

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

const algorithms = [
  { id: 'link-head-node', name: '单链表', category: '线性表', icon: '🔗' },
  { id: 'stack-sequence', name: '顺序栈', category: '栈', icon: '📚' },
  { id: 'queue-sequence', name: '循环队列', category: '队列', icon: '🔄' },
  { id: 'binary-tree', name: '二叉树遍历', category: '树', icon: '🌳' },
  { id: 'sort-bubble', name: '冒泡排序', category: '排序', icon: '🫧' },
  { id: 'sort-quick', name: '快速排序', category: '排序', icon: '⚡' },
];

const learningPaths = [
  { 
    title: '入门路径', 
    desc: '从零开始学习数据结构基础',
    steps: ['复杂度分析', '数组与链表', '栈和队列'],
    color: 'emerald',
    link: '/book'
  },
  { 
    title: '进阶路径', 
    desc: '掌握树和图的核心算法',
    steps: ['二叉树', '二叉搜索树', 'BFS/DFS'],
    color: 'indigo',
    link: '/book'
  },
  { 
    title: '算法专项', 
    desc: '系统学习经典排序算法',
    steps: ['冒泡/选择', '快速/归并', '堆排序'],
    color: 'amber',
    link: '/algorithms/sort-bubble'
  },
];

const learningPathToneClass: Record<string, { glow: string; step: string }> = {
  emerald: {
    glow: 'bg-emerald-500/5 group-hover:bg-emerald-500/10 dark:bg-emerald-400/10 dark:group-hover:bg-emerald-400/15',
    step: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800',
  },
  indigo: {
    glow: 'bg-indigo-500/5 group-hover:bg-indigo-500/10 dark:bg-indigo-400/10 dark:group-hover:bg-indigo-400/15',
    step: 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800',
  },
  amber: {
    glow: 'bg-amber-500/5 group-hover:bg-amber-500/10 dark:bg-amber-400/10 dark:group-hover:bg-amber-400/15',
    step: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800',
  },
};

const featureToneClass: Record<string, string> = {
  indigo: 'bg-indigo-100 dark:bg-indigo-900/30',
  emerald: 'bg-emerald-100 dark:bg-emerald-900/30',
  amber: 'bg-amber-100 dark:bg-amber-900/30',
  rose: 'bg-rose-100 dark:bg-rose-900/30',
};

export default function Home() {
  const { theme } = useTheme();
  const { t, isEnglish } = useI18n();
  const lowMotionMode = useLowMotionMode();

  const containerVariants: Variants = lowMotionMode
    ? {
        hidden: { opacity: 1 },
        visible: { opacity: 1 }
      }
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.08,
            delayChildren: 0.12
          }
        }
      };

  const itemVariants: Variants = lowMotionMode
    ? {
        hidden: { opacity: 1, y: 0 },
        visible: { opacity: 1, y: 0 }
      }
    : {
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: { type: "spring", stiffness: 100 }
        }
      };

  const revealUp = lowMotionMode
    ? {
        initial: false as const,
        whileInView: { opacity: 1 },
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0 }
      }
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0.45, ease: 'easeOut' as const }
      };

  const revealScale = lowMotionMode
    ? {
        initial: false as const,
        whileInView: { opacity: 1 },
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0 }
      }
    : {
        initial: { opacity: 0, scale: 0.95 },
        whileInView: { opacity: 1, scale: 1 },
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0.45, ease: 'easeOut' as const }
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
      <section className="page-safe-top relative px-4 pb-24 sm:px-6 sm:pb-32">
        <motion.div
          className="max-w-5xl mx-auto text-center relative z-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-klein-200/60 bg-white/60 px-4 py-2 text-xs font-medium text-klein-600 shadow-sm backdrop-blur-sm dark:border-klein-800/40 dark:bg-slate-800/60 dark:text-klein-400 sm:mb-10 sm:text-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-klein-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-klein-500"></span>
            </span>
            {t('交互式数据结构学习平台')}
          </motion.div>

          <motion.h1 variants={itemVariants} className="mb-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:mb-8 sm:text-6xl sm:leading-[1.08] md:text-7xl md:leading-[1.05]">
            {isEnglish ? (<>Learn with <span className="text-gradient">Animation</span><br />Data Structures & Algorithms</>) : (<>用<span className="text-gradient">动画</span>学懂<br />数据结构与算法</>)}
          </motion.h1>

          <motion.p variants={itemVariants} className="mx-auto mb-10 max-w-lg text-base leading-relaxed text-slate-500 dark:text-slate-400 sm:mb-14 sm:max-w-2xl sm:text-lg">
            {t('告别枯燥的理论，通过交互式动画直观理解每一步操作。')}
            <br className="hidden md:block" />
            {t('代码与可视化同步，轻松掌握核心概念。')}
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link
              to="/book"
              className="group flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-2xl bg-klein-600 px-8 py-4 font-semibold text-white shadow-lg shadow-klein-600/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-klein-700 hover:shadow-xl hover:shadow-klein-600/25 sm:w-auto"
            >
              <span>📚</span> {t('开始学习')}
            </Link>
            <Link
              to="/algorithms"
              className="group flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white/70 px-8 py-4 font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-klein-300 hover:text-klein-600 hover:shadow-md dark:border-slate-700/80 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:border-pine-500/60 dark:hover:text-pine-400 sm:w-auto"
            >
              <span>🎬</span> {t('查看演示')}
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="relative z-10 px-4 sm:px-6">
        <motion.div
          className="mx-auto max-w-4xl"
          {...revealUp}
        >
          <div className="flex flex-wrap items-center justify-center rounded-2xl border border-slate-200/60 bg-white/50 py-6 shadow-sm backdrop-blur-md dark:border-slate-700/40 dark:bg-slate-800/40 sm:rounded-3xl sm:py-8">
            {[
              { value: '6', label: '章节内容', gradient: 'from-klein-500 to-klein-600 dark:from-klein-400 dark:to-blue-400' },
              { value: '35+', label: '知识点', gradient: 'from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400' },
              { value: '7', label: '排序算法', gradient: 'from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400' },
              { value: '3', label: '编程语言', gradient: 'from-rose-600 to-pink-600 dark:from-rose-400 dark:to-pink-400' },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center">
                {i > 0 && <div className="mx-4 hidden h-10 w-px bg-slate-200/80 dark:bg-slate-700/60 sm:mx-6 md:mx-8 sm:block" />}
                <div className="w-28 px-3 py-2 text-center sm:w-32 sm:px-4">
                  <div className={`mb-1 bg-gradient-to-br ${stat.gradient} bg-clip-text text-2xl font-bold text-transparent sm:text-3xl`}>{stat.value}</div>
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">{t(stat.label)}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Learning Paths */}
      <section className="relative z-10 px-4 py-24 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <motion.div
            className="mb-14 text-center sm:mb-16"
            {...revealUp}
          >
            <p className="section-label mb-3">Learning Paths</p>
            <h2 className="mb-3 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">{t('学习路径')}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 sm:text-base">{t('为不同阶段的学习者量身定制')}</p>
          </motion.div>

          <motion.div
            className="grid gap-5 sm:gap-6 md:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {learningPaths.map((path) => (
              <motion.div key={path.title} variants={itemVariants}>
                {(() => {
                  const tone = learningPathToneClass[path.color] || learningPathToneClass.indigo;
                  return (
                <Link
                  to={path.link}
                  className="group relative block h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-klein-300/60 hover:shadow-lg hover:shadow-klein-500/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klein-500/60 dark:border-slate-700/60 dark:bg-slate-800/80 dark:hover:border-klein-500/40 sm:p-7"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-16 -mt-16 transition-all ${tone.glow}`} />

                  <h3 className="relative z-10 mb-2 text-lg font-bold text-slate-900 transition-colors group-hover:text-klein-600 dark:text-white dark:group-hover:text-klein-400">
                    {t(path.title)}
                  </h3>
                  <p className="relative z-10 mb-6 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{t(path.desc)}</p>

                  <div className="relative z-10 space-y-3">
                    {path.steps.map((step, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold ${tone.step}`}>
                          {i + 1}
                        </span>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t(step)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="relative z-10 mt-6 flex items-center gap-1.5 text-xs font-medium text-klein-500 opacity-0 transition-opacity group-hover:opacity-100 dark:text-klein-400">
                    <span>{t('开始学习')}</span>
                    <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </Link>
                  );
                })()}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="relative z-10 px-4 py-24 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="divider-fade mb-24 sm:mb-32" />
          <motion.div
            className="mb-14 text-center sm:mb-16"
            {...revealUp}
          >
            <p className="section-label mb-3">Quick Start</p>
            <h2 className="mb-3 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">{t('快速体验')}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 sm:text-base">{t('精选算法可视化演示，即点即用')}</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3">
            {algorithms.map((algo, idx) => (
              <motion.div
                key={algo.id}
                initial={lowMotionMode ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={lowMotionMode ? { duration: 0 } : { duration: 0.35, ease: 'easeOut', delay: idx * 0.04 }}
              >
                <Link
                  to={`/algorithms/${algo.id}`}
                  className="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white/60 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-klein-300/60 hover:shadow-md hover:shadow-klein-500/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klein-500/60 dark:border-slate-700/60 dark:bg-slate-800/60 dark:hover:border-klein-500/40 sm:p-5"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-xl transition-transform group-hover:scale-105 dark:bg-slate-700/80 sm:h-12 sm:w-12 sm:text-2xl">{algo.icon}</span>
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-klein-500 dark:text-klein-400">
                      {t(algo.category)}
                    </span>
                    <h3 className="truncate font-semibold text-slate-900 transition-colors group-hover:text-klein-600 dark:text-white dark:group-hover:text-klein-400">
                      {t(algo.name)}
                    </h3>
                  </div>
                  <svg className="ml-auto h-4 w-4 shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-klein-400 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-4 py-24 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="divider-fade mb-24 sm:mb-32" />
          <motion.div
            className="mb-14 text-center sm:mb-16"
            {...revealUp}
          >
            <p className="section-label mb-3">Why Us</p>
            <h2 className="mb-3 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">{t('为什么选择我们')}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 sm:text-base">{t('精心打磨的每一个细节')}</p>
          </motion.div>

          <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              { icon: '🎬', title: '动画演示', desc: '流畅的动画效果，直观展示数据结构的每一次变化过程', color: 'indigo' },
              { icon: '💻', title: '代码同步', desc: '动画执行与代码高亮实时同步，真正理解每行代码的含义', color: 'emerald' },
              { icon: '🌐', title: '多语言', desc: '支持 C++、Java、Python 三种主流语言，满足不同需求', color: 'amber' },
              { icon: '📝', title: '详细教程', desc: '配套详尽的图文教程和针对性练习题，巩固所学知识', color: 'rose' },
            ].map((feature, idx) => (
              <motion.div
                key={feature.title}
                className="rounded-2xl border border-slate-200/80 bg-white/50 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-md hover:shadow-slate-200/40 dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:bg-slate-800 dark:hover:shadow-slate-900/40 sm:p-7"
                initial={lowMotionMode ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={lowMotionMode ? { duration: 0 } : { duration: 0.4, ease: 'easeOut', delay: idx * 0.06 }}
              >
                <div className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${featureToneClass[feature.color] || featureToneClass.indigo}`}>
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="mb-2 text-base font-bold text-slate-900 dark:text-white">{t(feature.title)}</h3>
                <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {t(feature.desc)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-24 pt-8 sm:px-6 sm:pb-32 sm:pt-12">
        <motion.div
          className="mx-auto max-w-4xl"
          {...revealScale}
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-klein-500 via-klein-600 to-klein-700 px-8 py-14 text-center text-white shadow-xl shadow-klein-500/20 dark:from-slate-900 dark:via-klein-900 dark:to-slate-900 dark:shadow-slate-950/50 sm:px-12 sm:py-16">
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/[0.07] blur-3xl -mr-20 -mt-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-klein-400/10 blur-3xl -ml-20 -mb-20 pointer-events-none" />

            <h2 className="relative z-10 mb-4 text-2xl font-bold sm:mb-5 sm:text-3xl md:text-4xl">{t('准备好开启算法之旅了吗？')}</h2>
            <p className="relative z-10 mx-auto mb-8 max-w-lg text-sm leading-relaxed text-white/70 sm:mb-10 sm:text-base">
              {t('不需要繁琐的配置，打开浏览器即可开始学习。')}
              <br />{t('从基础到进阶，我们陪你一起成长。')}
            </p>
            <Link
              to="/book"
              className="relative z-10 inline-flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-2xl bg-white px-8 py-4 font-bold text-klein-600 shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-klein-50 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 dark:bg-slate-100 dark:text-klein-700 sm:w-auto sm:px-10"
            >
              {t('立即免费开始')}
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
