import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { curriculum, type Chapter } from '../data/curriculum';

const colorMap: Record<string, { bg: string; text: string; light: string; border: string }> = {
  indigo: { bg: 'bg-indigo-500', text: 'text-indigo-600', light: 'bg-indigo-50', border: 'border-indigo-200' },
  emerald: { bg: 'bg-emerald-500', text: 'text-emerald-600', light: 'bg-emerald-50', border: 'border-emerald-200' },
  amber: { bg: 'bg-amber-500', text: 'text-amber-600', light: 'bg-amber-50', border: 'border-amber-200' },
  rose: { bg: 'bg-rose-500', text: 'text-rose-600', light: 'bg-rose-50', border: 'border-rose-200' },
  cyan: { bg: 'bg-cyan-500', text: 'text-cyan-600', light: 'bg-cyan-50', border: 'border-cyan-200' },
  purple: { bg: 'bg-purple-500', text: 'text-purple-600', light: 'bg-purple-50', border: 'border-purple-200' },
};

const difficultyConfig = {
  easy: { label: '入门', color: 'bg-emerald-100 text-emerald-700' },
  medium: { label: '进阶', color: 'bg-amber-100 text-amber-700' },
  hard: { label: '困难', color: 'bg-rose-100 text-rose-700' },
};

export default function Book() {
  const [expandedChapter, setExpandedChapter] = useState<string | null>('intro');
  const { progress, isLoggedIn } = useUser();

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 transition-colors duration-300 pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-6">
        {/* 页面标题 */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">📖 数据结构教程</h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg">系统学习数据结构与算法，从入门到精通</p>
          <div className="flex justify-center gap-6 mt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{curriculum.length}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">章节</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{totalTopics}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">知识点</div>
            </div>
            {isLoggedIn && (
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{completedCount}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">已学习</div>
              </div>
            )}
            <div className="text-center">
              <div className="text-3xl font-bold text-rose-600 dark:text-rose-400">15+</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">小时</div>
            </div>
          </div>
        </div>

        {/* 学习路径提示 */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 mb-8 text-white shadow-lg shadow-indigo-500/20">
          <div className="flex items-start gap-4">
            <span className="text-4xl">🎯</span>
            <div>
              <h3 className="font-bold text-lg mb-1">推荐学习路径</h3>
              <p className="text-indigo-100 text-sm leading-relaxed">
                建议按顺序学习：先掌握<strong>绑论</strong>中的复杂度分析，然后学习<strong>线性表</strong>打好基础，
                再进阶<strong>树</strong>和<strong>图</strong>，最后通过<strong>查找</strong>和<strong>排序</strong>综合应用所学知识。
              </p>
            </div>
          </div>
        </div>

        {/* 章节列表 */}
        <div className="space-y-4">
          {curriculum.map((chapter, index) => {
            const colors = colorMap[chapter.color];
            const isExpanded = expandedChapter === chapter.id;
            
            return (
              <div
                key={chapter.id}
                className={`bg-white dark:bg-slate-800 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                  isExpanded ? `${colors.border} dark:border-${chapter.color}-500/50` : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                {/* 章节头部 */}
                <button
                  onClick={() => setExpandedChapter(isExpanded ? null : chapter.id)}
                  className="w-full p-5 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div className={`w-12 h-12 ${colors.light} dark:bg-${chapter.color}-900/30 rounded-xl flex items-center justify-center text-2xl`}>
                    {chapter.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium ${colors.text} ${colors.light} dark:bg-${chapter.color}-900/30 dark:text-${chapter.color}-400 px-2 py-0.5 rounded`}>
                        第{index + 1}章
                      </span>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">{chapter.name}</h2>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{chapter.desc}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {isLoggedIn && (
                      <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                        {getChapterProgress(chapter)}/{chapter.topics.length} 已学
                      </span>
                    )}
                    {!isLoggedIn && (
                      <span className="text-sm text-slate-400">{chapter.topics.length} 节</span>
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
                  <div className="px-5 pb-5 border-t border-slate-100 dark:border-slate-700">
                    <div className="grid gap-3 mt-4">
                      {chapter.topics.map((topic, topicIndex) => (
                        <Link
                          key={topic.name}
                          to={topic.link}
                          className={`group flex items-center gap-4 p-4 rounded-xl transition-all ${
                            isCompleted(topic.link)
                              ? 'bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                              : 'bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                            isCompleted(topic.link)
                              ? 'bg-emerald-500 text-white'
                              : `${colors.light} dark:bg-${chapter.color}-900/30 ${colors.text} dark:text-${chapter.color}-400`
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
                                {topic.name}
                              </span>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${difficultyConfig[topic.difficulty].color} dark:bg-opacity-20`}>
                                {difficultyConfig[topic.difficulty].label}
                              </span>
                              {isCompleted(topic.link) && (
                                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">已学习</span>
                              )}
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{topic.desc}</p>
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
              </div>
            );
          })}
        </div>

        {/* 底部提示 */}
        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2 text-sm text-slate-600 dark:text-slate-400">
            <span>💡</span>
            <span>点击章节展开查看详细内容，点击具体知识点进入学习</span>
          </div>
        </div>
      </div>
    </div>
  );
}
