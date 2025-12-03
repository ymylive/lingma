import { useState, useMemo, useRef } from 'react';
import { AIExerciseGenerator, CodingExercise, FillInBlank } from '../components/tutorials/TutorialPanel';
import { allExercises, type Exercise } from '../data/exercises';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';

// 分组分类
const CATEGORY_GROUPS = [
  {
    group: '全部',
    items: [{ id: 'all', name: '全部题目', icon: '📚' }]
  },
  {
    group: '数据结构',
    items: [
      { id: '链表', name: '链表', icon: '🔗' },
      { id: '栈', name: '栈', icon: '📦' },
      { id: '队列', name: '队列', icon: '🚶' },
      { id: '二叉树', name: '二叉树', icon: '🌳' },
      { id: '图', name: '图', icon: '🕸️' },
      { id: '哈希表', name: '哈希表', icon: '#️⃣' },
    ]
  },
  {
    group: '算法思想',
    items: [
      { id: '双指针', name: '双指针', icon: '👆' },
      { id: '滑动窗口', name: '滑动窗口', icon: '🪟' },
      { id: '贪心', name: '贪心', icon: '🎯' },
      { id: '动态规划', name: '动态规划', icon: '🧮' },
      { id: '回溯', name: '回溯', icon: '↩️' },
      { id: '递归', name: '递归', icon: '🔄' },
    ]
  },
  {
    group: '基础算法',
    items: [
      { id: '排序', name: '排序', icon: '📊' },
      { id: '查找', name: '查找', icon: '🔍' },
      { id: '字符串', name: '字符串', icon: '📝' },
      { id: '位运算', name: '位运算', icon: '⚡' },
      { id: '数学', name: '数学', icon: '🔢' },
    ]
  },
  {
    group: '入门',
    items: [
      { id: '基础概念', name: '基础概念', icon: '📖' },
    ]
  },
];

export default function Practice() {
  const { theme } = useTheme();
  const { isExerciseCompleted, progress } = useUser();
  const [tab, setTab] = useState<'preset' | 'ai'>('preset');
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [typeFilter, setTypeFilter] = useState<'all' | 'coding' | 'fillblank'>('all');
  const exerciseAreaRef = useRef<HTMLDivElement>(null);

  // 选择题目并滚动到练习区
  const handleSelectExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    // 延迟滚动，等待DOM更新
    setTimeout(() => {
      exerciseAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // 统计信息
  const stats = useMemo(() => {
    const total = allExercises.length;
    const coding = allExercises.filter(e => e.type === 'coding').length;
    const fillblank = allExercises.filter(e => e.type === 'fillblank').length;
    const easy = allExercises.filter(e => e.difficulty === 'easy').length;
    const medium = allExercises.filter(e => e.difficulty === 'medium').length;
    const hard = allExercises.filter(e => e.difficulty === 'hard').length;
    const completed = progress.completedExercises.length;
    
    return { total, coding, fillblank, easy, medium, hard, completed };
  }, [progress.completedExercises.length]);

  const filteredExercises = allExercises.filter(e => {
    if (category !== 'all' && e.category !== category) return false;
    if (difficulty !== 'all' && e.difficulty !== difficulty) return false;
    if (typeFilter !== 'all' && e.type !== typeFilter) return false;
    return true;
  });

  const difficultyConfig = {
    easy: { text: '简单', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', stars: '⭐' },
    medium: { text: '中等', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', stars: '⭐⭐' },
    hard: { text: '困难', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400', stars: '⭐⭐⭐' },
  };

  const containerClass = theme === 'dark'
    ? 'min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 transition-colors duration-300 pt-20 pb-12'
    : 'min-h-screen bg-gradient-to-b from-slate-50 to-white transition-colors duration-300 pt-20 pb-12';

  return (
    <div className={containerClass}>
      <div className="max-w-6xl mx-auto px-6">
        {/* 页面标题与统计 */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">📝 编程练习</h1>
              <p className="text-slate-600 dark:text-slate-400">通过练习巩固数据结构与算法知识</p>
            </div>
            {/* 统计卡片 */}
            <div className="flex gap-3">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 shadow-sm">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats.total}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">题目总数</div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-emerald-200 dark:border-emerald-700 px-4 py-3 shadow-sm">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.completed}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">已完成</div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 shadow-sm">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.coding}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">编程题</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab切换 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('preset')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              tab === 'preset'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            📝 题库练习 <span className="ml-1 text-sm opacity-70">({allExercises.length}题)</span>
          </button>
          <button
            onClick={() => setTab('ai')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              tab === 'ai'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            🤖 AI智能出题
          </button>
        </div>

        {tab === 'ai' ? (
          <AIExerciseGenerator />
        ) : (
          <>
            {/* 筛选器 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 mb-6">
              <div className="space-y-4">
                {/* 分类筛选 - 分组显示 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">题目分类</label>
                  <div className="space-y-3">
                    {CATEGORY_GROUPS.map(group => (
                      <div key={group.group} className="flex items-start gap-2">
                        <span className="text-xs text-slate-500 dark:text-slate-400 w-16 pt-1.5 shrink-0 font-medium">{group.group}</span>
                        <div className="flex flex-wrap gap-1.5">
                          {group.items.map(c => (
                            <button
                              key={c.id}
                              onClick={() => setCategory(c.id)}
                              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                                category === c.id
                                  ? 'bg-indigo-600 text-white shadow-sm'
                                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                              }`}
                            >
                              {c.icon} {c.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 难度和题型筛选 */}
                <div className="flex flex-wrap gap-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                {/* 难度筛选 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">难度</label>
                  <div className="flex gap-1">
                    {[
                      { id: 'all', label: '全部' },
                      { id: 'easy', label: '⭐简单' },
                      { id: 'medium', label: '⭐⭐中等' },
                      { id: 'hard', label: '⭐⭐⭐困难' },
                    ].map(d => (
                      <button
                        key={d.id}
                        onClick={() => setDifficulty(d.id as 'all' | 'easy' | 'medium' | 'hard')}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                          difficulty === d.id
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
                {/* 题型筛选 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">题型</label>
                  <div className="flex gap-1">
                    {[
                      { id: 'all', label: '全部' },
                      { id: 'coding', label: '💻编程题' },
                      { id: 'fillblank', label: '✏️填空题' },
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => setTypeFilter(t.id as 'all' | 'coding' | 'fillblank')}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                          typeFilter === t.id
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                </div>
              </div>
            </div>

            {/* 题目列表或做题界面 */}
            <div ref={exerciseAreaRef} className="scroll-mt-24">
            {selectedExercise ? (
              <div className="animate-fadeIn">
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="mb-4 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:scale-105"
                >
                  ← 返回题目列表
                </button>
                {selectedExercise.type === 'coding' && selectedExercise.templates && selectedExercise.solutions && (
                  <CodingExercise
                    exerciseId={selectedExercise.id}
                    title={selectedExercise.title}
                    description={selectedExercise.description}
                    difficulty={selectedExercise.difficulty}
                    category={selectedExercise.category}
                    templates={selectedExercise.templates}
                    solutions={selectedExercise.solutions}
                    testCases={selectedExercise.testCases || []}
                    hints={selectedExercise.hints}
                    explanation={selectedExercise.explanation}
                  />
                )}
                {selectedExercise.type === 'fillblank' && selectedExercise.codeTemplate && selectedExercise.blanks && (
                  <FillInBlank
                    exerciseId={selectedExercise.id}
                    title={selectedExercise.title}
                    description={selectedExercise.description}
                    difficulty={selectedExercise.difficulty}
                    category={selectedExercise.category}
                    codeTemplate={selectedExercise.codeTemplate}
                    blanks={selectedExercise.blanks}
                    explanation={selectedExercise.explanation}
                  />
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredExercises.map(exercise => {
                  const dc = difficultyConfig[exercise.difficulty];
                  const completed = isExerciseCompleted(exercise.id);
                  return (
                    <div
                      key={exercise.id}
                      onClick={() => handleSelectExercise(exercise)}
                      className={`rounded-xl border p-5 hover:shadow-lg transition-all cursor-pointer group active:scale-95 ${
                        completed 
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700 hover:border-emerald-400 dark:hover:border-emerald-500'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${dc.color}`}>
                            {dc.stars} {dc.text}
                          </span>
                          {completed && (
                            <span className="px-2 py-1 rounded text-xs font-medium bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300">
                              ✓ 已完成
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                          {exercise.type === 'coding' ? '💻编程题' : '✏️填空题'}
                        </span>
                      </div>
                      <h3 className={`font-bold mb-2 transition-colors ${
                        completed 
                          ? 'text-emerald-700 dark:text-emerald-400 group-hover:text-emerald-800 dark:group-hover:text-emerald-300'
                          : 'text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                      }`}>{exercise.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{exercise.description}</p>
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                        <span className="text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded">
                          {exercise.category}
                        </span>
                        <span className={`text-sm font-medium ${
                          completed
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-indigo-600 dark:text-indigo-400'
                        }`}>{completed ? '再练一次 →' : '开始练习 →'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            </div>

            {filteredExercises.length === 0 && !selectedExercise && (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                暂无符合条件的题目
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
