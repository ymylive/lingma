import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { useI18n } from '../contexts/I18nContext';
import { curriculum, type Chapter } from '../data/curriculum';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
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

const colorMap: Record<string, { bg: string; text: string; light: string; border: string; darkSurface: string; darkText: string; darkBorder: string }> = {
  indigo: { bg: 'bg-indigo-500', text: 'text-indigo-600', light: 'bg-indigo-50', border: 'border-indigo-200', darkSurface: 'dark:bg-indigo-950/40', darkText: 'dark:text-indigo-300', darkBorder: 'dark:border-indigo-500/50' },
  emerald: { bg: 'bg-emerald-500', text: 'text-emerald-600', light: 'bg-emerald-50', border: 'border-emerald-200', darkSurface: 'dark:bg-emerald-950/40', darkText: 'dark:text-emerald-300', darkBorder: 'dark:border-emerald-500/50' },
  amber: { bg: 'bg-amber-500', text: 'text-amber-600', light: 'bg-amber-50', border: 'border-amber-200', darkSurface: 'dark:bg-amber-950/40', darkText: 'dark:text-amber-300', darkBorder: 'dark:border-amber-500/50' },
  rose: { bg: 'bg-rose-500', text: 'text-rose-600', light: 'bg-rose-50', border: 'border-rose-200', darkSurface: 'dark:bg-rose-950/40', darkText: 'dark:text-rose-300', darkBorder: 'dark:border-rose-500/50' },
  cyan: { bg: 'bg-cyan-500', text: 'text-cyan-600', light: 'bg-cyan-50', border: 'border-cyan-200', darkSurface: 'dark:bg-cyan-950/40', darkText: 'dark:text-cyan-300', darkBorder: 'dark:border-cyan-500/50' },
  purple: { bg: 'bg-purple-500', text: 'text-purple-600', light: 'bg-purple-50', border: 'border-purple-200', darkSurface: 'dark:bg-purple-950/40', darkText: 'dark:text-purple-300', darkBorder: 'dark:border-purple-500/50' },
};

const difficultyConfig = {
  easy: { label: '入门', color: 'bg-emerald-100 text-emerald-700' },
  medium: { label: '进阶', color: 'bg-amber-100 text-amber-700' },
  hard: { label: '困难', color: 'bg-rose-100 text-rose-700' },
};

const difficultyToneClass: Record<keyof typeof difficultyConfig, string> = {
  easy: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300',
  hard: 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300',
};

export default function Book() {
  const [expandedChapter, setExpandedChapter] = useState<string | null>('intro');
  const { progress, isLoggedIn } = useUser();
  const { t, isEnglish } = useI18n();

  useEffect(() => {
    syncPageMetadata(
      isEnglish ? 'Book | Tumafang' : '教程 | Tumafang',
      t('系统学习数据结构与算法，从入门到精通'),
    );
  }, [isEnglish, t]);

  const totalTopics = curriculum.reduce((sum, ch) => sum + ch.topics.length, 0);
  const completedCount = progress.completedLessons.length;

  // 检查课程是否完成
  const isCompleted = (link: string) => {
    const lessonId = link.replace('/book/', '').replace('/algorithms/', '');
    return progress.completedLessons.some(id => id.includes(lessonId) || lessonId.includes(id));
  };

  // 获取章节完成数
  const getChapterProgress = (chapter: Chapter) => {
    return chapter.topics.filter(t => isCompleted(t.link)).length;
  };

  const chapterCountLabel = isEnglish ? 'Chapters' : '章节';
  const topicCountLabel = isEnglish ? 'Topics' : '知识点';
  const learnedCountLabel = isEnglish ? 'Learned' : '已学习';
  const hourCountLabel = isEnglish ? 'Hours' : '小时';
  const chapterProgressLabel = (completed: number, total: number) => isEnglish ? `${completed}/${total} learned` : `${completed}/${total} 已学`;
  const topicCountSummary = (count: number) => isEnglish ? `${count} lessons` : `${count} 节`;
  const chapterBadgeLabel = (index: number) => t(`第${index}章`);
  const topicDifficultyLabel = (difficulty: keyof typeof difficultyConfig) => {
    if (!isEnglish) return difficultyConfig[difficulty].label;
    if (difficulty === 'easy') return 'Beginner';
    if (difficulty === 'medium') return 'Intermediate';
    return 'Advanced';
  };

  return (
    <div className="min-h-screen transition-colors duration-300 pt-24 pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h1 className="mb-3 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">📖 {isEnglish ? 'Data Structure Tutorials' : '数据结构教程'}</h1>
          <p className="text-base text-slate-600 dark:text-slate-300 sm:text-lg">{t('系统学习数据结构与算法，从入门到精通')}</p>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:flex sm:justify-center sm:gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-klein-500 dark:text-klein-400">{curriculum.length}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">{chapterCountLabel}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{totalTopics}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">{topicCountLabel}</div>
            </div>
            {isLoggedIn && (
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{completedCount}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{learnedCountLabel}</div>
              </div>
            )}
            <div className="text-center">
              <div className="text-3xl font-bold text-rose-600 dark:text-rose-400">15+</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">{hourCountLabel}</div>
            </div>
          </div>
        </motion.div>

        {/* 学习路径提示 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 rounded-2xl bg-gradient-to-r from-klein-500 to-klein-600 p-5 text-white shadow-lg shadow-klein-500/20 sm:p-6"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
            <span className="text-3xl sm:text-4xl">🎯</span>
            <div>
              <h3 className="font-bold text-lg mb-1">{t('推荐学习路径')}</h3>
              <p className="text-klein-100 text-sm leading-relaxed">
                建议按顺序学习：先掌握<strong>绑论</strong>中的复杂度分析，然后学习<strong>线性表</strong>打好基础，
                再进阶<strong>树</strong>和<strong>图</strong>，最后通过<strong>查找</strong>和<strong>排序</strong>综合应用所学知识。
              </p>
            </div>
          </div>
        </motion.div>

        {/* 章节列表 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4"
        >
          {curriculum.map((chapter, index) => {
            const colors = colorMap[chapter.color];
            const isExpanded = expandedChapter === chapter.id;

            return (
              <motion.div
                key={chapter.id}
                variants={itemVariants}
                className={`bg-white dark:bg-slate-800 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                  isExpanded ? `${colors.border} ${colors.darkBorder}` : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                {/* 章节头部 */}
                <button
                  onClick={() => setExpandedChapter(isExpanded ? null : chapter.id)}
                  className="flex w-full cursor-pointer flex-col items-start gap-4 p-4 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 focus-visible:ring-inset dark:hover:bg-slate-700/50 sm:flex-row sm:items-center sm:p-5"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl sm:h-12 sm:w-12 sm:text-2xl ${colors.light} ${colors.darkSurface}`}>
                    {chapter.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-xs font-medium ${colors.text} ${colors.light} ${colors.darkSurface} ${colors.darkText} px-2 py-0.5 rounded`}>
                        {chapterBadgeLabel(index + 1)}
                      </span>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">{t(chapter.name)}</h2>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t(chapter.desc)}</p>
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
                    <svg
                      className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* 章节内容 */}
                {isExpanded && (
                  <div className="border-t border-slate-100 px-4 pb-4 dark:border-slate-700 sm:px-5 sm:pb-5">
                    <div className="grid gap-3 mt-4">
                      {chapter.topics.map((topic, topicIndex) => (
                        <Link
                          key={t(topic.name)}
                          to={topic.link}
                          className={`group flex items-center gap-3 rounded-xl p-3.5 transition-all sm:gap-4 sm:p-4 ${
                            isCompleted(topic.link)
                              ? 'bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                              : 'bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                            isCompleted(topic.link)
                              ? 'bg-emerald-500 text-white'
                              : `${colors.light} ${colors.darkSurface} ${colors.text} ${colors.darkText}`
                           }`}>
                            {isCompleted(topic.link) ? (
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              topicIndex + 1
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`font-medium transition-colors ${
                                isCompleted(topic.link)
                                  ? 'text-emerald-700 dark:text-emerald-400 group-hover:text-emerald-800 dark:group-hover:text-emerald-300'
                                  : 'text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                              }`}>
                                {t(topic.name)}
                              </span>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${difficultyToneClass[topic.difficulty]}`}>
                                {topicDifficultyLabel(topic.difficulty)}
                              </span>
                              {isCompleted(topic.link) && (
                                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{learnedCountLabel}</span>
                              )}
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{t(topic.desc)}</p>
                          </div>
                          <div className="text-xs text-slate-400 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {topic.duration}
                          </div>
                          <svg className={`w-5 h-5 transition-colors ${
                            isCompleted(topic.link)
                              ? 'text-emerald-400 dark:text-emerald-600 group-hover:text-emerald-500 dark:group-hover:text-emerald-500'
                              : 'text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 dark:group-hover:text-indigo-400'
                          }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* 底部提示 */}
        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2 text-sm text-slate-600 dark:text-slate-400">
            <span>💡</span>
            <span>{isEnglish ? 'Expand a chapter to browse lessons, then open a topic to start learning.' : '点击章节展开查看详细内容，点击具体知识点进入学习'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
