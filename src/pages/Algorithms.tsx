import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowRightLeft,
  ArrowUpDown,
  GitBranch,
  Layers,
  Link2,
  Network,
  Sparkles,
  Waves,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';
import useLowMotionMode from '../hooks/useLowMotionMode';
import {
  GlassCard,
  PageHero,
  Tabs,
  getTone,
} from '../components/ui';
import type { TabItem, ToneName } from '../components/ui';

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

type CategoryId = 'linear' | 'stack' | 'queue' | 'tree' | 'graph' | 'sort';

interface CategoryMeta {
  id: CategoryId;
  name: string;
  Icon: LucideIcon;
  tone: ToneName;
}

interface AlgorithmItem {
  id: string;
  name: string;
  desc: string;
  category: CategoryId;
  Icon: LucideIcon;
}

const CATEGORIES: CategoryMeta[] = [
  { id: 'linear', name: '线性表', Icon: Link2, tone: 'klein' },
  { id: 'stack', name: '栈', Icon: Layers, tone: 'indigo' },
  { id: 'queue', name: '队列', Icon: ArrowRightLeft, tone: 'cyan' },
  { id: 'tree', name: '树', Icon: GitBranch, tone: 'emerald' },
  { id: 'graph', name: '图', Icon: Network, tone: 'purple' },
  { id: 'sort', name: '排序', Icon: ArrowUpDown, tone: 'amber' },
];

const ALGORITHMS: AlgorithmItem[] = [
  { id: 'sequence', name: '顺序表', desc: '使用数组实现的线性表', category: 'linear', Icon: Layers },
  { id: 'link-head-node', name: '单链表（带头结点）', desc: '便于操作统一处理', category: 'linear', Icon: Link2 },
  { id: 'link-head-no', name: '单链表（不带头结点）', desc: '经典链式存储结构', category: 'linear', Icon: Link2 },
  { id: 'link-double', name: '双链表', desc: '前驱与后继双向指针', category: 'linear', Icon: Link2 },

  { id: 'stack-sequence', name: '顺序栈', desc: '数组实现，后进先出', category: 'stack', Icon: Layers },
  { id: 'stack-link', name: '链栈', desc: '链表实现的栈结构', category: 'stack', Icon: Layers },

  { id: 'queue-sequence', name: '顺序队列', desc: '数组实现，先进先出', category: 'queue', Icon: ArrowRightLeft },
  { id: 'queue-link', name: '链队列', desc: '链表实现的队列结构', category: 'queue', Icon: ArrowRightLeft },

  { id: 'binary-tree', name: '二叉树遍历', desc: '先序 / 中序 / 后序 / 层序', category: 'tree', Icon: GitBranch },
  { id: 'bst', name: '二叉搜索树', desc: '左小右大的有序二叉树', category: 'tree', Icon: GitBranch },

  { id: 'bfs', name: 'BFS 广度优先', desc: '按层次探索图结构', category: 'graph', Icon: Network },
  { id: 'dfs', name: 'DFS 深度优先', desc: '沿路径深入遍历', category: 'graph', Icon: Network },

  { id: 'sort-bubble', name: '冒泡排序', desc: '相邻比较，逐步冒泡', category: 'sort', Icon: Waves },
  { id: 'sort-insert', name: '插入排序', desc: '将元素插入已排序序列', category: 'sort', Icon: ArrowUpDown },
  { id: 'sort-select', name: '选择排序', desc: '每次选择最小元素', category: 'sort', Icon: ArrowUpDown },
  { id: 'sort-quick', name: '快速排序', desc: '分治法，O(n log n)', category: 'sort', Icon: Zap },
];

export default function Algorithms() {
  const { t, isEnglish } = useI18n();
  const lowMotionMode = useLowMotionMode();
  const [filter, setFilter] = useState<'all' | CategoryId>('all');

  useEffect(() => {
    syncPageMetadata(
      isEnglish ? 'Algorithms | Lingma' : '算法可视化 | Lingma',
      t('通过交互式动画探索数据结构与算法的魅力。点击下方卡片开始你的学习旅程。'),
    );
  }, [isEnglish, t]);

  const tabItems = useMemo<TabItem<'all' | CategoryId>[]>(
    () => [
      {
        id: 'all',
        label: t('全部'),
        icon: <Sparkles className="h-4 w-4" strokeWidth={1.75} aria-hidden />,
      },
      ...CATEGORIES.map((cat) => ({
        id: cat.id,
        label: t(cat.name),
        icon: <cat.Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />,
      })),
    ],
    [t],
  );

  const visibleAlgorithms = useMemo(
    () => (filter === 'all' ? ALGORITHMS : ALGORITHMS.filter((a) => a.category === filter)),
    [filter],
  );

  const categoryMap = useMemo(
    () => Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<CategoryId, CategoryMeta>,
    [],
  );

  return (
    <div className="min-h-screen pb-24 transition-colors duration-500 sm:pb-32">
      <PageHero
        marker={{ num: '02', label: isEnglish ? 'ALGORITHMS · VISUAL' : '算法 · 可视化' }}
        title={
          isEnglish ? (
            <>
              Algorithm <em className="italic text-klein-600 dark:text-pine-400 font-normal">visualizations</em>
            </>
          ) : (
            <>
              算法<em className="italic text-klein-600 dark:text-pine-400 font-normal">可视化</em>
            </>
          )
        }
        description={t('按数据结构分类，每个算法都支持逐步播放与代码同步。')}
      />

      <section className="relative z-10 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 flex justify-center sm:mb-14">
            <div className="w-full overflow-x-auto">
              <div className="flex min-w-max justify-center">
                <Tabs<'all' | CategoryId>
                  items={tabItems}
                  value={filter}
                  onChange={setFilter}
                  variant="pill"
                  ariaLabel={t('算法分类')}
                />
              </div>
            </div>
          </div>

          <motion.div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3"
            layout={!lowMotionMode}
          >
            {visibleAlgorithms.map((algo, idx) => {
              const cat = categoryMap[algo.category];
              const tone = getTone(cat.tone);
              const AlgoIcon = algo.Icon;
              return (
                <motion.div
                  key={algo.id}
                  layout={!lowMotionMode}
                  initial={lowMotionMode ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={
                    lowMotionMode
                      ? { duration: 0 }
                      : { duration: 0.32, ease: 'easeOut', delay: Math.min(idx * 0.03, 0.3) }
                  }
                >
                  <Link to={`/algorithms/${algo.id}`} className="group block h-full">
                    <GlassCard
                      variant="soft"
                      padding="md"
                      hoverable
                      className="flex h-full flex-col"
                    >
                      <div className="relative z-10 mb-5 flex items-center justify-between">
                        <span
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${tone.bg} ${tone.border} ${tone.text} transition-transform group-hover:scale-105`}
                        >
                          <AlgoIcon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${tone.bg} ${tone.border} ${tone.text}`}
                        >
                          {t(cat.name)}
                        </span>
                      </div>
                      <h3 className="relative z-10 mb-2 text-base font-bold tracking-tight text-slate-900 transition-colors group-hover:text-klein-600 dark:text-white dark:group-hover:text-klein-400 sm:text-lg">
                        {t(algo.name)}
                      </h3>
                      <p className="relative z-10 line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                        {t(algo.desc)}
                      </p>
                      <div className="relative z-10 mt-6 flex items-center gap-1.5 text-xs font-medium text-klein-500 opacity-0 transition-opacity group-hover:opacity-100 dark:text-klein-400">
                        <span>{t('开始演示')}</span>
                        <ArrowRight
                          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                          strokeWidth={1.75}
                          aria-hidden
                        />
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
