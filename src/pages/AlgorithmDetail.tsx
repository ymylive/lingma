import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useI18n } from '../contexts/I18nContext';
import LinkedListVisualization from '../components/visualizations/LinkedListVisualization';
import StackVisualization from '../components/visualizations/StackVisualization';
import QueueVisualization from '../components/visualizations/QueueVisualization';
import SortVisualization from '../components/visualizations/SortVisualization';
import TreeVisualization from '../components/visualizations/TreeVisualization';
import { LinkedListTutorial, SortTutorial, TreeTutorial, StackTutorial } from '../components/tutorials';

type VisType = 'list' | 'stack' | 'queue' | 'sort' | 'tree';

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
  const { t, isEnglish } = useI18n();

  useEffect(() => {
    if (!info) {
      syncPageMetadata(
        isEnglish ? 'Algorithm Not Found | Tumafang' : '算法不存在 | Tumafang',
        isEnglish ? 'The requested algorithm demo or tutorial could not be found.' : '请求的算法演示或教程不存在。',
      );
      return;
    }

    syncPageMetadata(`${t(info.title)} | ${t('算法可视化')} | Tumafang`, t(info.desc));
  }, [info, isEnglish, t]);

  if (!info) {
    return (
      <div className="page-safe-top min-h-screen px-4 transition-colors duration-300 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            {t('算法不存在')}
          </h1>
          <Link to="/algorithms" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            {t('返回算法列表')}
          </Link>
        </div>
      </div>
    );
  }

  const renderTutorial = () => {
    switch (info.vis) {
      case 'list': return <LinkedListTutorial />;
      case 'stack': return <StackTutorial />;
      case 'queue': return <StackTutorial />;
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
    <div className="page-safe-top min-h-screen pb-12 transition-colors duration-300">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-6 flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-2 text-sm text-slate-500 dark:text-slate-400">
          <Link to="/algorithms" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            {t('算法列表')}
          </Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white">{t(info.title)}</span>
        </div>

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded">
                {t(info.category)}
              </span>
              <h1 className="mt-3 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">{t(info.title)}</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">{t(info.desc)}</p>
            </div>
            
            <div className="grid w-full grid-cols-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-700/50 sm:w-auto sm:grid-cols-2">
              <button
                onClick={() => setActiveTab('visual')}
                className={`flex min-h-[44px] items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === 'visual'
                    ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>🎬</span> {t('动画演示')}
              </button>
              <button
                onClick={() => setActiveTab('tutorial')}
                className={`flex min-h-[44px] items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === 'tutorial'
                    ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>📚</span> {t('学习教程')}
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'visual' ? renderVisualization() : renderTutorial()}
      </div>
    </div>
  );
}
