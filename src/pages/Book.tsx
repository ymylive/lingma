import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import {
  ArrowUpDown,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Compass,
  GitBranch,
  Layers,
  Lightbulb,
  Network,
  Search,
  Target,
  type LucideIcon,
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useI18n } from '../contexts/I18nContext';
import { curriculum, type Chapter } from '../data/curriculum';
import {
  DifficultyPill,
  GlassCard,
  PageHero,
  StatStrip,
  getTone,
} from '../components/ui';
import type { ToneName } from '../components/ui';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 },
  },
};

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

const VALID_TONES = new Set<ToneName>([
  'klein',
  'pine',
  'emerald',
  'indigo',
  'amber',
  'rose',
  'cyan',
  'purple',
]);

function toneOf(name: string): ToneName {
  return VALID_TONES.has(name as ToneName) ? (name as ToneName) : 'indigo';
}

const difficultyLabelCN: Record<'easy' | 'medium' | 'hard', string> = {
  easy: '入门',
  medium: '进阶',
  hard: '困难',
};

const CHAPTER_ICON: Record<string, LucideIcon> = {
  intro: Compass,
  linear: Layers,
  tree: GitBranch,
  graph: Network,
  search: Search,
  sort: ArrowUpDown,
};

function chapterIcon(id: string): LucideIcon {
  return CHAPTER_ICON[id] ?? BookOpen;
}

export default function Book() {
  const [expandedChapter, setExpandedChapter] = useState<string | null>('intro');
  const { progress, isLoggedIn } = useUser();
  const { t, isEnglish } = useI18n();

  useEffect(() => {
    syncPageMetadata(
      isEnglish ? 'Book | Lingma' : '教程 | Lingma',
      t('系统学习数据结构与算法，从入门到精通'),
    );
  }, [isEnglish, t]);

  const totalTopics = curriculum.reduce((sum, ch) => sum + ch.topics.length, 0);
  const completedCount = progress.completedLessons.length;

  const isCompleted = (link: string) => {
    const lessonId = link.replace('/book/', '').replace('/algorithms/', '');
    return progress.completedLessons.some((id) => id.includes(lessonId) || lessonId.includes(id));
  };

  const getChapterProgress = (chapter: Chapter) => {
    return chapter.topics.filter((tp) => isCompleted(tp.link)).length;
  };

  const chapterCountLabel = isEnglish ? 'Chapters' : '章节';
  const topicCountLabel = isEnglish ? 'Topics' : '知识点';
  const learnedCountLabel = isEnglish ? 'Learned' : '已学习';
  const hourCountLabel = isEnglish ? 'Hours' : '小时';
  const chapterProgressLabel = (completed: number, total: number) =>
    isEnglish ? `${completed}/${total} learned` : `${completed}/${total} 已学`;
  const topicCountSummary = (count: number) => (isEnglish ? `${count} lessons` : `${count} 节`);
  const chapterBadgeLabel = (index: number) => t(`第${index}章`);
  const topicDifficultyLabel = (difficulty: 'easy' | 'medium' | 'hard') => {
    if (!isEnglish) return difficultyLabelCN[difficulty];
    if (difficulty === 'easy') return 'Beginner';
    if (difficulty === 'medium') return 'Intermediate';
    return 'Advanced';
  };

  const statItems = [
    { value: String(curriculum.length), label: chapterCountLabel, tone: 'klein' as const },
    { value: String(totalTopics), label: topicCountLabel, tone: 'emerald' as const },
    ...(isLoggedIn
      ? [{ value: String(completedCount), label: learnedCountLabel, tone: 'amber' as const }]
      : []),
    { value: '15+', label: hourCountLabel, tone: 'rose' as const },
  ];

  return (
    <div className="min-h-screen pb-12 transition-colors duration-300">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <PageHero
          marker={{ num: '01', label: isEnglish ? 'TUTORIALS · BOOK' : '教程 · 书' }}
          title={
            <span className="inline-flex items-center gap-4">
              <BookOpen className="h-10 w-10 sm:h-12 sm:w-12" strokeWidth={1.5} aria-hidden />
              {isEnglish ? 'Data Structure Tutorials' : '数据结构教程'}
            </span>
          }
          description={t('系统学习数据结构与算法，从入门到精通')}
        />

        <section className="relative z-10 mb-10">
          <StatStrip items={statItems} />
        </section>

        {/* 学习路径提示 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative z-10 mb-10"
        >
          <GlassCard
            variant="solid"
            padding="md"
            hoverable={false}
            className="bg-gradient-to-r from-klein-500 to-klein-600 text-white border-klein-700/40 dark:border-klein-700/40"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-inset ring-white/20">
                <Target className="h-6 w-6" strokeWidth={1.75} aria-hidden />
              </span>
              <div>
                <h3 className="font-bold text-lg mb-1">{t('推荐学习路径')}</h3>
                <p className="text-klein-100 text-sm leading-relaxed">
                  {isEnglish ? (
                    <>
                      We recommend studying in order: start with <strong>complexity analysis</strong>, then build a
                      foundation with <strong>linear lists</strong>, advance to <strong>trees</strong> and{' '}
                      <strong>graphs</strong>, and finally apply your knowledge through <strong>searching</strong> and{' '}
                      <strong>sorting</strong>.
                    </>
                  ) : (
                    <>
                      建议按顺序学习：先掌握<strong>绪论</strong>中的复杂度分析，然后学习<strong>线性表</strong>
                      打好基础，再进阶<strong>树</strong>和<strong>图</strong>，最后通过<strong>查找</strong>和
                      <strong>排序</strong>综合应用所学知识。
                    </>
                  )}
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* 章节列表 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative z-10 space-y-4"
        >
          {curriculum.map((chapter, index) => {
            const tone = getTone(toneOf(chapter.color));
            const isExpanded = expandedChapter === chapter.id;
            const ChapterIcon = chapterIcon(chapter.id);

            return (
              <motion.div key={chapter.id} variants={itemVariants}>
                <GlassCard
                  variant="soft"
                  padding="none"
                  hoverable={false}
                  className={isExpanded ? tone.border : ''}
                >
                  <button
                    onClick={() => setExpandedChapter(isExpanded ? null : chapter.id)}
                    className="flex w-full cursor-pointer flex-col items-start gap-4 p-4 text-left transition-colors duration-200 hover:bg-slate-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klein-500/60 focus-visible:ring-inset dark:hover:bg-slate-700/40 sm:flex-row sm:items-center sm:p-5"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12 ${tone.bg} ${tone.text}`}
                    >
                      <ChapterIcon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${tone.bg} ${tone.text} ${tone.border}`}
                        >
                          {chapterBadgeLabel(index + 1)}
                        </span>
                        <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">
                          {t(chapter.name)}
                        </h2>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 mt-1">{t(chapter.desc)}</p>
                    </div>
                    <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
                      {isLoggedIn && (
                        <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                          {chapterProgressLabel(getChapterProgress(chapter), chapter.topics.length)}
                        </span>
                      )}
                      {!isLoggedIn && (
                        <span className="text-sm text-slate-400">{topicCountSummary(chapter.topics.length)}</span>
                      )}
                      <ChevronDown
                        className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        strokeWidth={1.75}
                        aria-hidden
                      />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-slate-200/60 px-4 pb-4 dark:border-slate-700/60 sm:px-5 sm:pb-5">
                      <div className="grid gap-3 mt-5">
                        {chapter.topics.map((topic, topicIndex) => {
                          const completed = isCompleted(topic.link);
                          return (
                            <Link
                              key={t(topic.name)}
                              to={topic.link}
                              className={`group flex items-center gap-3 rounded-xl p-3.5 transition-all duration-200 sm:gap-4 sm:p-4 ${
                                completed
                                  ? 'bg-emerald-50/80 dark:bg-emerald-900/20 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/30'
                                  : 'bg-slate-50/80 dark:bg-slate-700/30 hover:bg-slate-100/80 dark:hover:bg-slate-700/50'
                              }`}
                            >
                              <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                                  completed
                                    ? 'bg-emerald-500 text-white'
                                    : `${tone.bg} ${tone.text}`
                                }`}
                              >
                                {completed ? (
                                  <CheckCircle2 className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                                ) : (
                                  topicIndex + 1
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span
                                    className={`font-medium transition-colors duration-200 ${
                                      completed
                                        ? 'text-emerald-700 dark:text-emerald-400 group-hover:text-emerald-800 dark:group-hover:text-emerald-300'
                                        : 'text-slate-800 dark:text-slate-200 group-hover:text-klein-600 dark:group-hover:text-klein-400'
                                    }`}
                                  >
                                    {t(topic.name)}
                                  </span>
                                  <DifficultyPill
                                    level={topic.difficulty}
                                    showStars={false}
                                    size="sm"
                                    label={topicDifficultyLabel(topic.difficulty)}
                                  />
                                  {completed && (
                                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                      {learnedCountLabel}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 mt-0.5">{t(topic.desc)}</p>
                              </div>
                              <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400">
                                <Clock className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                                {topic.duration}
                              </div>
                              <ChevronRight
                                className={`h-5 w-5 shrink-0 transition-colors duration-200 ${
                                  completed
                                    ? 'text-emerald-400 dark:text-emerald-600 group-hover:text-emerald-500 dark:group-hover:text-emerald-500'
                                    : 'text-slate-300 dark:text-slate-600 group-hover:text-klein-500 dark:group-hover:text-klein-400'
                                }`}
                                strokeWidth={1.75}
                                aria-hidden
                              />
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>

        {/* 底部提示 */}
        <div className="relative z-10 mt-10 text-center">
          <div className="inline-flex items-center gap-2 bg-slate-100/80 dark:bg-slate-800/80 rounded-full px-5 py-2.5 backdrop-blur-sm text-sm text-slate-600 dark:text-slate-400">
            <Lightbulb className="h-4 w-4 text-amber-500" strokeWidth={1.75} aria-hidden />
            <span>
              {isEnglish
                ? 'Expand a chapter to browse lessons, then open a topic to start learning.'
                : '点击章节展开查看详细内容，点击具体知识点进入学习'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
