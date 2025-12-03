import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import LinkedListVisualization from '../components/visualizations/LinkedListVisualization';
import StackVisualization from '../components/visualizations/StackVisualization';
import QueueVisualization from '../components/visualizations/QueueVisualization';
import SortVisualization from '../components/visualizations/SortVisualization';
import TreeVisualization from '../components/visualizations/TreeVisualization';
import { LinkedListTutorial, SortTutorial, TreeTutorial, StackTutorial } from '../components/tutorials';

type VisType = 'list' | 'stack' | 'queue' | 'sort' | 'tree';

const algorithms: Record<string, { title: string; desc: string; category: string; vis: VisType }> = {
  'link-head-node': { title: '单链表（带头结点）', desc: '带头结点的单向链表，便于操作统一处理', category: '线性表', vis: 'list' },
  'link-head-no': { title: '单链表（不带头结点）', desc: '不带头结点的单向链表', category: '线性表', vis: 'list' },
  'link-double': { title: '双链表', desc: '每个节点有前驱和后继指针', category: '线性表', vis: 'list' },
  'sequence': { title: '顺序表', desc: '使用数组实现的线性表', category: '线性表', vis: 'list' },
  
  'stack-sequence': { title: '顺序栈', desc: '使用数组实现的栈，后进先出（LIFO）', category: '栈', vis: 'stack' },
  'stack-link': { title: '链栈', desc: '使用链表实现的栈', category: '栈', vis: 'stack' },
  
  'queue-sequence': { title: '顺序队列', desc: '使用数组实现的队列，先进先出（FIFO）', category: '队列', vis: 'queue' },
  'queue-link': { title: '链队列', desc: '使用链表实现的队列', category: '队列', vis: 'queue' },
  
  'binary-tree': { title: '二叉树遍历', desc: '先序、中序、后序、层序遍历', category: '树', vis: 'tree' },
  'bst': { title: '二叉搜索树', desc: '左小右大的有序二叉树', category: '树', vis: 'tree' },
  
  'bfs': { title: '广度优先搜索 BFS', desc: '按层次遍历图的算法', category: '图', vis: 'tree' },
  'dfs': { title: '深度优先搜索 DFS', desc: '沿着路径深入遍历', category: '图', vis: 'tree' },
  
  'sort-bubble': { title: '冒泡排序', desc: '通过相邻元素比较交换实现排序', category: '排序', vis: 'sort' },
  'sort-insert': { title: '插入排序', desc: '将元素插入已排序序列', category: '排序', vis: 'sort' },
  'sort-select': { title: '选择排序', desc: '每次选择最小元素', category: '排序', vis: 'sort' },
  'sort-quick': { title: '快速排序', desc: '分治法排序，平均O(n log n)', category: '排序', vis: 'sort' },
};

export default function AlgorithmDetail() {
  const { id } = useParams<{ id: string }>();
  const info = id ? algorithms[id] : null;
  const [activeTab, setActiveTab] = useState<'visual' | 'tutorial'>('visual');

  if (!info) {
    return (
      <div className="min-h-screen pt-24 px-6 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            算法不存在
          </h1>
          <Link to="/algorithms" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            返回算法列表
          </Link>
        </div>
      </div>
    );
  }

  const renderTutorial = () => {
    switch (info.vis) {
      case 'list': return <LinkedListTutorial />;
      case 'stack': return <StackTutorial />;
      case 'queue': return <StackTutorial />; // 队列教程复用栈教程
      case 'sort': return <SortTutorial />;
      case 'tree': return <TreeTutorial />;
    }
  };

  const renderVisualization = () => {
    switch (info.vis) {
      case 'list': return <LinkedListVisualization />;
      case 'stack': return <StackVisualization />;
      case 'queue': return <QueueVisualization />;
      case 'sort': return <SortVisualization />;
      case 'tree': return <TreeVisualization />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20 pb-12 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6">
        {/* 面包屑 */}
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
          <Link to="/algorithms" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            算法列表
          </Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white">{info.title}</span>
        </div>

        {/* 标题区域 */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded">
                {info.category}
              </span>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-3">{info.title}</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">{info.desc}</p>
            </div>
            
            {/* 模式切换 */}
            <div className="flex bg-slate-100 dark:bg-slate-700/50 rounded-xl p-1">
              <button
                onClick={() => setActiveTab('visual')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  activeTab === 'visual'
                    ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>🎬</span> 动画演示
              </button>
              <button
                onClick={() => setActiveTab('tutorial')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  activeTab === 'tutorial'
                    ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>📚</span> 学习教程
              </button>
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        {activeTab === 'visual' ? renderVisualization() : renderTutorial()}
      </div>
    </div>
  );
}
