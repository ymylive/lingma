import { Link } from 'react-router-dom';

const categories = [
  {
    name: '线性表',
    items: [
      { id: 'sequence', name: '顺序表' },
      { id: 'link-head-node', name: '单链表（带头结点）' },
      { id: 'link-head-no', name: '单链表（不带头结点）' },
      { id: 'link-double', name: '双链表' },
    ],
  },
  {
    name: '栈',
    items: [
      { id: 'stack-sequence', name: '顺序栈' },
      { id: 'stack-link', name: '链栈' },
    ],
  },
  {
    name: '队列',
    items: [
      { id: 'queue-sequence', name: '顺序队列' },
      { id: 'queue-link', name: '链队列' },
    ],
  },
  {
    name: '树',
    items: [
      { id: 'binary-tree', name: '二叉树遍历' },
      { id: 'bst', name: '二叉搜索树' },
    ],
  },
  {
    name: '图',
    items: [
      { id: 'bfs', name: 'BFS 广度优先' },
      { id: 'dfs', name: 'DFS 深度优先' },
    ],
  },
  {
    name: '排序',
    items: [
      { id: 'sort-bubble', name: '冒泡排序' },
      { id: 'sort-insert', name: '插入排序' },
      { id: 'sort-select', name: '选择排序' },
      { id: 'sort-quick', name: '快速排序' },
    ],
  },
];

export default function Algorithms() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20 pb-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">算法可视化</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">选择一个算法开始学习</p>

        <div className="space-y-8">
          {categories.map((cat) => (
            <div key={cat.name}>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                {cat.name}
              </h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {cat.items.map((item) => (
                  <Link
                    key={item.id}
                    to={`/algorithms/${item.id}`}
                    className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-sm transition-all group"
                  >
                    <span className="font-medium text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {item.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
