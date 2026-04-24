import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowRightLeft,
  BookOpen,
  ChevronRight,
  GitBranch,
  Layers,
  Link2,
  Network,
  Play,
  ArrowUpDown,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';
import {
  GlassCard,
  Tabs,
  getTone,
} from '../components/ui';
import type { TabItem, ToneName } from '../components/ui';
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

const CATEGORY_META: Record<string, { Icon: LucideIcon; tone: ToneName }> = {
  '线性表': { Icon: Link2, tone: 'klein' },
  '栈': { Icon: Layers, tone: 'indigo' },
  '队列': { Icon: ArrowRightLeft, tone: 'cyan' },
  '树': { Icon: GitBranch, tone: 'emerald' },
  '图': { Icon: Network, tone: 'purple' },
  '排序': { Icon: ArrowUpDown, tone: 'amber' },
};

export default function AlgorithmDetail() {
  const { id } = useParams<{ id: string }>();
  const info = id ? algorithms[id] : null;
  const [activeTab, setActiveTab] = useState<'visual' | 'tutorial'>('visual');
  const { t, isEnglish } = useI18n();

  useEffect(() => {
    if (!info) {
      syncPageMetadata(
        isEnglish ? 'Algorithm Not Found | Lingma' : '算法不存在 | Lingma',
        isEnglish ? 'The requested algorithm demo or tutorial could not be found.' : '请求的算法演示或教程不存在。',
      );
      return;
    }

    syncPageMetadata(`${t(info.title)} | ${t('算法可视化')} | Lingma`, t(info.desc));
  }, [info, isEnglish, t]);

  const tabItems = useMemo<TabItem<'visual' | 'tutorial'>[]>(
    () => [
      {
        id: 'visual',
        label: t('动画演示'),
        icon: <Play className="h-4 w-4" strokeWidth={1.75} aria-hidden />,
      },
      {
        id: 'tutorial',
        label: t('学习教程'),
        icon: <BookOpen className="h-4 w-4" strokeWidth={1.75} aria-hidden />,
      },
    ],
    [t],
  );

  if (!info) {
    return (
      <div className="page-safe-top min-h-screen px-4 transition-colors duration-300 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t('算法不存在')}
          </h1>
          <Link to="/algorithms" className="text-klein-600 hover:underline dark:text-klein-400">
            {t('返回算法列表')}
          </Link>
        </div>
      </div>
    );
  }

  const categoryMeta = CATEGORY_META[info.category] ?? { Icon: Layers, tone: 'klein' as ToneName };
  const tone = getTone(categoryMeta.tone);
  const CategoryIcon = categoryMeta.Icon;

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
    <div className="min-h-screen pb-24 transition-colors duration-500 sm:pb-32">
      {/* Sticky breadcrumb bar */}
      <div className="page-safe-top sticky top-0 z-20 border-b border-slate-200/60 bg-white/70 backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/60">
        <div className="mx-auto flex max-w-5xl items-center gap-1.5 overflow-x-auto whitespace-nowrap px-4 py-3 text-sm text-slate-500 dark:text-slate-400 sm:px-6">
          <Link
            to="/algorithms"
            className="font-medium transition-colors hover:text-klein-600 dark:hover:text-klein-400"
          >
            {t('算法列表')}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" strokeWidth={1.75} aria-hidden />
          <span className="font-medium text-slate-900 dark:text-white">{t(info.title)}</span>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pt-10 sm:px-6 sm:pt-14">
        {/* Header card */}
        <GlassCard variant="solid" padding="lg" hoverable={false} className="mb-10 sm:mb-14">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border ${tone.bg} ${tone.border} ${tone.text}`}
              >
                <CategoryIcon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              </span>
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${tone.bg} ${tone.border} ${tone.text}`}
              >
                {t(info.category)}
              </span>
            </div>
            <div>
              <h1 className="font-serif text-3xl font-medium tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl">
                {t(info.title)}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400 sm:text-base">
                {t(info.desc)}
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Tab switcher */}
        <div className="mb-8 flex sm:mb-10">
          <Tabs<'visual' | 'tutorial'>
            items={tabItems}
            value={activeTab}
            onChange={setActiveTab}
            variant="underline"
            ariaLabel={t('内容切换')}
          />
        </div>

        {/* Content */}
        {activeTab === 'visual' ? renderVisualization() : renderTutorial()}
      </div>
    </div>
  );
}
