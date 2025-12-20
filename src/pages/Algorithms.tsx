import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';

const categories = [
  {
    name: '线性表',
    icon: '📊',
    color: 'blue',
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
    color: 'indigo',
    items: [
      { id: 'stack-sequence', name: '顺序栈' },
      { id: 'stack-link', name: '链栈' },
    ],
  },
  {
    name: '队列',
    icon: '🔄',
    color: 'emerald',
    items: [
      { id: 'queue-sequence', name: '顺序队列' },
      { id: 'queue-link', name: '链队列' },
    ],
  },
  {
    name: '树',
    icon: '🌳',
    color: 'green',
    items: [
      { id: 'binary-tree', name: '二叉树遍历' },
      { id: 'bst', name: '二叉搜索树' },
    ],
  },
  {
    name: '图',
    icon: '🕸️',
    color: 'purple',
    items: [
      { id: 'bfs', name: 'BFS 广度优先' },
      { id: 'dfs', name: 'DFS 深度优先' },
    ],
  },
  {
    name: '排序',
    icon: '⚡',
    color: 'amber',
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
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] pt-28 pb-12 transition-colors duration-500">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            算法可视化
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            通过交互式动画探索数据结构与算法的魅力。点击下方卡片开始你的学习旅程。
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
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  {cat.icon}
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {cat.name}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-slate-200 dark:from-slate-700 to-transparent ml-4"></div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cat.items.map((item) => (
                  <Link
                    key={item.id}
                    to={`/algorithms/${item.id}`}
                    className="group relative p-5 bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700/50 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl -mr-12 -mt-12 transition-all group-hover:bg-indigo-500/10" />
                    
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {item.name}
                      </span>
                      <svg 
                        className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transform group-hover:translate-x-1 transition-all" 
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
