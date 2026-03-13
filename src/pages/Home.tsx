import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useI18n } from '../contexts/I18nContext';
import { motion, type Variants } from 'framer-motion';

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

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

export default function Home() {
  const { theme } = useTheme();
  const { t, isEnglish } = useI18n();

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
      <section className="relative pt-32 pb-20 px-6">
        <motion.div 
          className="max-w-4xl mx-auto text-center relative z-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-klein-100 dark:border-klein-900/30 text-klein-600 dark:text-klein-400 px-4 py-1.5 rounded-full text-sm font-medium mb-8 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-klein-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-klein-500"></span>
            </span>
            交互式数据结构学习平台
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-extrabold text-slate-900 dark:text-white mb-8 leading-tight tracking-tight">
            用<span className="text-gradient">动画</span>学懂
            <br />数据结构与算法
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl text-slate-600 dark:text-slate-300 mb-12 leading-relaxed max-w-2xl mx-auto">
            告别枯燥的理论，通过交互式动画直观理解每一步操作。
            <br className="hidden md:block" />
            代码与可视化同步，轻松掌握核心概念。
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-5">
            <Link
              to="/book"
              className="px-8 py-4 bg-klein-600 text-white rounded-2xl font-semibold hover:bg-klein-700 transition-all shadow-xl shadow-klein-600/20 hover:shadow-klein-600/40 hover:-translate-y-1 flex items-center gap-2"
            >
              <span>📚</span> 开始学习
            </Link>
            <Link
              to="/algorithms"
              className="px-8 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-700 dark:text-slate-200 rounded-2xl font-semibold border border-slate-200 dark:border-slate-700 hover:border-klein-300 dark:hover:border-pine-500 hover:text-klein-600 dark:hover:text-pine-400 transition-all shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 hover:-translate-y-1 flex items-center gap-2"
            >
              <span>🎬</span> 查看演示
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-8 px-6 relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-3xl border border-white/20 dark:border-slate-700/50 p-8 grid grid-cols-2 md:grid-cols-4 gap-8 shadow-xl dark:shadow-slate-900/50">
            <div className="text-center group">
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 mb-2 group-hover:scale-110 transition-transform">6</div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400">章节内容</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 mb-2 group-hover:scale-110 transition-transform">35+</div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400">知识点</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 mb-2 group-hover:scale-110 transition-transform">7</div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400">排序算法</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-rose-600 to-pink-600 dark:from-rose-400 dark:to-pink-400 mb-2 group-hover:scale-110 transition-transform">3</div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400">编程语言</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Learning Paths */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">🎯 学习路径</h2>
            <p className="text-slate-600 dark:text-slate-400">为不同阶段的学习者量身定制</p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {learningPaths.map((path) => (
              <motion.div key={path.title} variants={itemVariants}>
                <Link
                  to={path.link}
                  className="block h-full bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/50 p-8 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-${path.color}-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-${path.color}-500/10`} />
                  
                  <h3 className="font-bold text-xl text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 mb-3 relative z-10">
                    {path.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed relative z-10">{path.desc}</p>
                  
                  <div className="space-y-4 relative z-10">
                    {path.steps.map((step, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full bg-${path.color}-50 dark:bg-${path.color}-900/20 text-${path.color}-600 dark:text-${path.color}-400 flex items-center justify-center text-xs font-bold border border-${path.color}-100 dark:border-${path.color}-800`}>
                          {i + 1}
                        </span>
                        <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{step}</span>
                      </div>
                    ))}
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-20 px-6 bg-slate-50/50 dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">⚡ 快速体验</h2>
            <p className="text-slate-600 dark:text-slate-400">精选算法可视化演示，即点即用</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {algorithms.map((algo, idx) => (
              <motion.div
                key={algo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link
                  to={`/algorithms/${algo.id}`}
                  className="flex items-center gap-4 p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 group"
                >
                  <span className="text-3xl bg-slate-50 dark:bg-slate-700 w-12 h-12 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">{algo.icon}</span>
                  <div>
                    <span className="text-xs text-indigo-500 dark:text-indigo-400 font-semibold tracking-wide uppercase">
                      {algo.category}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
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
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">✨ 为什么选择我们</h2>
            <p className="text-slate-600 dark:text-slate-400">精心打磨的每一个细节</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: '🎬', title: '动画演示', desc: '流畅的动画效果，直观展示数据结构的每一次变化过程', color: 'indigo' },
              { icon: '💻', title: '代码同步', desc: '动画执行与代码高亮实时同步，真正理解每行代码的含义', color: 'emerald' },
              { icon: '🌐', title: '多语言', desc: '支持 C++、Java、Python 三种主流语言，满足不同需求', color: 'amber' },
              { icon: '📝', title: '详细教程', desc: '配套详尽的图文教程和针对性练习题，巩固所学知识', color: 'rose' },
            ].map((feature, idx) => (
              <motion.div 
                key={feature.title}
                className="text-center p-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-100 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className={`w-16 h-16 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3 hover:rotate-6 transition-transform`}>
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
      <section className="py-20 px-6">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-700 rounded-[2.5rem] p-12 text-center text-white shadow-2xl shadow-indigo-500/30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />
            
            <h2 className="text-4xl font-bold mb-6 relative z-10">准备好开启算法之旅了吗？</h2>
            <p className="text-indigo-100 mb-10 text-lg max-w-xl mx-auto relative z-10">
              不需要繁琐的配置，打开浏览器即可开始学习。
              <br />从基础到进阶，我们陪你一起成长。
            </p>
            <Link
              to="/book"
              className="relative z-10 inline-flex items-center gap-2 px-10 py-5 bg-white text-indigo-700 rounded-2xl font-bold hover:bg-indigo-50 transition-colors shadow-lg shadow-black/10 hover:shadow-black/20 hover:-translate-y-0.5"
            >
              <span>🚀</span> 立即免费开始
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
