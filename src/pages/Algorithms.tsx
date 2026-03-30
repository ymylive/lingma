import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { useI18n } from '../contexts/I18nContext';

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

const categories = [
  {
    name: '线性表',
    icon: '📊',
    color: 'klein',
    items: [
      { id: 'sequence', name: '顺序表' },
      { id: 'link-head-node', name: '单链表（带头结点）' },
      { id: 'link-head-no', name: '单链表（不带头结点）' },
      { id: 'link-double', name: '双链表' },
    ],
  },
  {
    name: '栈',
    icon: '📚',
    color: 'klein',
    items: [
      { id: 'stack-sequence', name: '顺序栈' },
      { id: 'stack-link', name: '链栈' },
    ],
  },
  {
    name: '队列',
    icon: '🔄',
    color: 'klein',
    items: [
      { id: 'queue-sequence', name: '顺序队列' },
      { id: 'queue-link', name: '链队列' },
    ],
  },
  {
    name: '树',
    icon: '🌳',
    color: 'pine',
    items: [
      { id: 'binary-tree', name: '二叉树遍历' },
      { id: 'bst', name: '二叉搜索树' },
    ],
  },
  {
    name: '图',
    icon: '🕸️',
    color: 'pine',
    items: [
      { id: 'bfs', name: 'BFS 广度优先' },
      { id: 'dfs', name: 'DFS 深度优先' },
    ],
  },
  {
    name: '排序',
    icon: '⚡',
    color: 'pine',
    items: [
      { id: 'sort-bubble', name: '冒泡排序' },
      { id: 'sort-insert', name: '插入排序' },
      { id: 'sort-select', name: '选择排序' },
      { id: 'sort-quick', name: '快速排序' },
    ],
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
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

export default function Algorithms() {
  const { t, isEnglish } = useI18n();

  useEffect(() => {
    syncPageMetadata(
      isEnglish ? 'Algorithms | Tumafang' : '算法可视化 | Tumafang',
      t('通过交互式动画探索数据结构与算法的魅力。点击下方卡片开始你的学习旅程。'),
    );
  }, [isEnglish, t]);

  return (
    <div className="page-safe-top min-h-screen pb-12 transition-colors duration-500">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {isEnglish ? <>Algorithm<span className="text-gradient"> Visualization</span></> : <>算法<span className="text-gradient">可视化</span></>}
          </h1>
          <p className="max-w-2xl text-base text-slate-600 dark:text-slate-400 sm:text-lg">
            {t('通过交互式动画探索数据结构与算法的魅力。点击下方卡片开始你的学习旅程。')}
          </p>
        </motion.div>

        <motion.div 
          className="space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((cat) => (
            <motion.div key={cat.name} variants={itemVariants}>
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className={`text-2xl p-2 rounded-xl shadow-sm border ${
                  cat.color === 'klein' 
                    ? 'bg-klein-50 dark:bg-klein-900/20 border-klein-100 dark:border-klein-800 text-klein-600 dark:text-klein-400' 
                    : 'bg-pine-50 dark:bg-pine-900/20 border-pine-100 dark:border-pine-800 text-pine-600 dark:text-pine-400'
                }`}>
                  {cat.icon}
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                  {t(cat.name)}
                </h2>
                <div className="hidden h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-700 sm:block"></div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cat.items.map((item) => (
                  <Link
                    key={item.id}
                    to={`/algorithms/${item.id}`}
                    className="glass-card group relative overflow-hidden p-4 hover:bg-white dark:hover:bg-slate-800/80 sm:p-5"
                  >
                    <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl -mr-12 -mt-12 transition-all opacity-0 group-hover:opacity-100 ${
                       cat.color === 'klein' ? 'bg-klein-500/10' : 'bg-pine-500/10'
                    }`} />
                    
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-klein-600 dark:group-hover:text-pine-400 transition-colors">
                        {t(item.name)}
                      </span>
                      <svg 
                        className={`w-5 h-5 transform group-hover:translate-x-1 transition-all ${
                          cat.color === 'klein' ? 'text-klein-400' : 'text-pine-400'
                        }`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
