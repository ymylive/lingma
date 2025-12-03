import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

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

export default function Home() {
  const { theme } = useTheme();

  const containerClass =
    theme === 'dark'
      ? 'min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100 transition-colors duration-300'
      : 'min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900 transition-colors duration-300';

  return (
    <div className={containerClass}>
      {/* Hero */}
      <section className="pt-28 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span>✨</span> 交互式数据结构学习平台
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            用<span className="text-indigo-600 dark:text-indigo-400">动画</span>学懂
            <br />数据结构与算法
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto">
            告别枯燥的理论，通过交互式动画直观理解每一步操作。
            代码与可视化同步，轻松掌握核心概念。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/book"
              className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 flex items-center gap-2"
            >
              <span>📚</span> 开始学习
            </Link>
            <Link
              to="/algorithms"
              className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-medium border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center gap-2"
            >
              <span>🎬</span> 查看演示
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 grid grid-cols-2 md:grid-cols-4 gap-6 shadow-sm dark:shadow-slate-900/50">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">6</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">章节内容</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">35+</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">知识点</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">7</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">排序算法</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-rose-600 dark:text-rose-400">3</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">编程语言</div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">🎯 学习路径</h2>
          <p className="text-slate-600 dark:text-slate-400 text-center mb-8">选择适合你的学习路线</p>
          <div className="grid md:grid-cols-3 gap-6">
            {learningPaths.map((path) => (
              <Link
                key={path.title}
                to={path.link}
                className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-lg transition-all"
              >
                <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 mb-2">
                  {path.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{path.desc}</p>
                <div className="space-y-2">
                  {path.steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className={`w-5 h-5 rounded-full bg-${path.color}-100 dark:bg-${path.color}-900/30 text-${path.color}-600 dark:text-${path.color}-400 flex items-center justify-center text-xs font-medium`}>
                        {i + 1}
                      </span>
                      <span className="text-slate-600 dark:text-slate-300">{step}</span>
                    </div>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-12 px-6 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">⚡ 快速体验</h2>
          <p className="text-slate-600 dark:text-slate-400 text-center mb-8">点击直接进入可视化演示</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {algorithms.map((algo) => (
              <Link
                key={algo.id}
                to={`/algorithms/${algo.id}`}
                className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{algo.icon}</span>
                  <div>
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                      {algo.category}
                    </span>
                    <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {algo.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">✨ 平台特色</h2>
          <p className="text-slate-600 dark:text-slate-400 text-center mb-10">为学习体验精心设计的功能</p>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎬</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">动画演示</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                每个操作都有流畅的动画，直观展示数据变化
              </p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💻</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">代码同步</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                动画与代码高亮同步，理解每行代码的作用
              </p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌐</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">多语言</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                支持 C++、Java、Python 三种语言代码
              </p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="w-14 h-14 bg-rose-100 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">详细教程</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                配套教程和练习题，巩固所学知识
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-10 text-center text-white shadow-xl shadow-indigo-500/20">
            <h2 className="text-3xl font-bold mb-4">准备好开始学习了吗？</h2>
            <p className="text-indigo-100 mb-8">
              从基础开始，系统掌握数据结构与算法
            </p>
            <Link
              to="/book"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 transition-colors"
            >
              <span>🚀</span> 立即开始
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
