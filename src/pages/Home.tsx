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
      <section className="page-safe-top relative px-4 pb-16 sm:px-6 sm:pb-20">
        <motion.div 
          className="max-w-6xl mx-auto text-center relative z-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="mb-6 inline-flex items-center gap-2 rounded-full border border-klein-100 bg-white/50 px-3.5 py-1.5 text-xs font-medium text-klein-600 shadow-sm backdrop-blur-sm dark:border-klein-900/30 dark:bg-slate-800/50 dark:text-klein-400 sm:mb-8 sm:px-4 sm:text-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-klein-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-klein-500"></span>
            </span>
            交互式数据结构学习平台
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="mb-6 text-5xl font-extrabold leading-[0.95] tracking-tight text-slate-900 dark:text-white sm:mb-8 sm:text-6xl sm:leading-tight md:text-8xl">
            用<span className="text-gradient">动画</span>学懂
            <br />数据结构与算法
          </motion.h1>
          
          <motion.p variants={itemVariants} className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:mb-12 sm:max-w-2xl sm:text-lg md:text-xl">
            告别枯燥的理论，通过交互式动画直观理解每一步操作。
            <br className="hidden md:block" />
            代码与可视化同步，轻松掌握核心概念。
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
            <Link
              to="/book"
              className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-klein-600 px-8 py-4 font-semibold text-white shadow-xl shadow-klein-600/20 transition-all hover:-translate-y-1 hover:bg-klein-700 hover:shadow-klein-600/40 sm:w-auto"
            >
              <span>📚</span> 开始学习
            </Link>
            <Link
              to="/algorithms"
              className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-8 py-4 font-semibold text-slate-700 shadow-lg shadow-slate-200/50 transition-all hover:-translate-y-1 hover:border-klein-300 hover:text-klein-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:shadow-slate-900/50 dark:hover:border-pine-500 dark:hover:text-pine-400 sm:w-auto"
            >
              <span>🎬</span> 查看演示
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="relative z-10 px-4 py-6 sm:px-6 sm:py-8">
        <motion.div 
          className="max-w-6xl mx-auto"
          {...revealUp}
        >
          <div className="grid grid-cols-2 gap-5 rounded-3xl border border-white/20 bg-white/60 p-5 shadow-xl backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-800/60 dark:shadow-slate-900/50 sm:gap-8 sm:p-8 md:grid-cols-4">
            <div className="text-center group">
              <div className="mb-2 bg-gradient-to-br from-klein-500 to-klein-600 bg-clip-text text-3xl font-bold text-transparent transition-transform group-hover:scale-110 dark:from-klein-400 dark:to-blue-400 sm:text-4xl">6</div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400">章节内容</div>
            </div>
            <div className="text-center group">
              <div className="mb-2 bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-3xl font-bold text-transparent transition-transform group-hover:scale-110 dark:from-emerald-400 dark:to-teal-400 sm:text-4xl">35+</div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400">知识点</div>
            </div>
            <div className="text-center group">
              <div className="mb-2 bg-gradient-to-br from-amber-600 to-orange-600 bg-clip-text text-3xl font-bold text-transparent transition-transform group-hover:scale-110 dark:from-amber-400 dark:to-orange-400 sm:text-4xl">7</div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400">排序算法</div>
            </div>
            <div className="text-center group">
              <div className="mb-2 bg-gradient-to-br from-rose-600 to-pink-600 bg-clip-text text-3xl font-bold text-transparent transition-transform group-hover:scale-110 dark:from-rose-400 dark:to-pink-400 sm:text-4xl">3</div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400">编程语言</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Learning Paths */}
      <section className="relative z-10 px-4 py-16 sm:px-6 sm:py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="mb-12 text-center sm:mb-16"
            {...revealUp}
          >
            <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">🎯 学习路径</h2>
            <p className="text-slate-600 dark:text-slate-400">为不同阶段的学习者量身定制</p>
          </motion.div>

          <motion.div 
            className="grid gap-4 sm:gap-8 md:grid-cols-3"
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
                  className="group relative block h-full overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:border-klein-300 hover:shadow-2xl hover:shadow-klein-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klein-500/60 dark:border-slate-700/50 dark:bg-slate-800 dark:hover:border-klein-500/50 sm:p-8"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-16 -mt-16 transition-all ${tone.glow}`} />
                  
                  <h3 className="font-bold text-xl text-slate-900 dark:text-white group-hover:text-klein-600 dark:group-hover:text-klein-400 mb-3 relative z-10">
                    {path.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed relative z-10">{path.desc}</p>
                  
                  <div className="space-y-4 relative z-10">
                    {path.steps.map((step, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold ${tone.step}`}>
                          {i + 1}
                        </span>
                        <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{step}</span>
                      </div>
                    ))}
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
      <section className="border-y border-slate-100 bg-slate-50/50 px-4 py-16 dark:border-slate-800 dark:bg-slate-900/50 sm:px-6 sm:py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="mb-12 text-center sm:mb-16"
            {...revealUp}
          >
            <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">⚡ 快速体验</h2>
            <p className="text-slate-600 dark:text-slate-400">精选算法可视化演示，即点即用</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3">
            {algorithms.map((algo, idx) => (
              <motion.div
                key={algo.id}
                initial={lowMotionMode ? false : { opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={lowMotionMode ? { duration: 0 } : { duration: 0.35, ease: 'easeOut', delay: idx * 0.04 }}
              >
                <Link
                  to={`/algorithms/${algo.id}`}
                  className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-klein-300 hover:shadow-xl hover:shadow-klein-500/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klein-500/60 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-klein-500 sm:gap-4 sm:p-6"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-2xl transition-transform group-hover:scale-110 dark:bg-slate-700 sm:h-12 sm:w-12 sm:text-3xl">{algo.icon}</span>
                  <div>
                    <span className="text-xs text-klein-500 dark:text-klein-400 font-semibold tracking-wide uppercase">
                      {algo.category}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-klein-600 dark:group-hover:text-klein-400 transition-colors">
                      {algo.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-4 py-20 sm:px-6 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="mb-12 text-center sm:mb-20"
            {...revealUp}
          >
            <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">✨ 为什么选择我们</h2>
            <p className="text-slate-600 dark:text-slate-400">精心打磨的每一个细节</p>
          </motion.div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              { icon: '🎬', title: '动画演示', desc: '流畅的动画效果，直观展示数据结构的每一次变化过程', color: 'indigo' },
              { icon: '💻', title: '代码同步', desc: '动画执行与代码高亮实时同步，真正理解每行代码的含义', color: 'emerald' },
              { icon: '🌐', title: '多语言', desc: '支持 C++、Java、Python 三种主流语言，满足不同需求', color: 'amber' },
              { icon: '📝', title: '详细教程', desc: '配套详尽的图文教程和针对性练习题，巩固所学知识', color: 'rose' },
            ].map((feature, idx) => (
              <motion.div 
                key={feature.title}
                className="rounded-3xl border border-slate-100 bg-white/50 p-6 text-center transition-colors backdrop-blur-sm hover:bg-white dark:border-slate-700/50 dark:bg-slate-800/50 dark:hover:bg-slate-800 sm:p-8"
                initial={lowMotionMode ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={lowMotionMode ? { duration: 0 } : { duration: 0.4, ease: 'easeOut', delay: idx * 0.06 }}
              >
                <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl rotate-3 transition-transform hover:rotate-6 ${featureToneClass[feature.color] || featureToneClass.indigo}`}>
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <motion.div 
          className="max-w-6xl mx-auto"
          {...revealScale}
        >
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-klein-500 to-klein-600 p-8 text-center text-white shadow-2xl shadow-klein-500/30 dark:from-slate-900 dark:to-klein-900 dark:shadow-slate-950/60 sm:rounded-[2.5rem] sm:p-12">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-3xl -mr-16 -mt-16 pointer-events-none dark:bg-klein-300/10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-klein-600/20 blur-3xl -ml-16 -mb-16 pointer-events-none dark:bg-klein-500/20" />

            <h2 className="relative z-10 mb-5 text-3xl font-bold sm:mb-6 sm:text-4xl">准备好开启算法之旅了吗？</h2>
            <p className="relative z-10 mx-auto mb-8 max-w-xl text-base text-klein-100 sm:mb-10 sm:text-lg">
              不需要繁琐的配置，打开浏览器即可开始学习。
              <br />从基础到进阶，我们陪你一起成长。
            </p>
            <Link
              to="/book"
              className="relative z-10 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 font-bold text-klein-600 shadow-lg shadow-black/10 transition-colors hover:-translate-y-0.5 hover:bg-klein-50 hover:shadow-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 dark:bg-slate-100 dark:text-klein-700 sm:w-auto sm:px-10 sm:py-5"
            >
              <span>🚀</span> 立即免费开始
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
