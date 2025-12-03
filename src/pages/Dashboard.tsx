import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useEffect } from 'react';

export default function Dashboard() {
  const { user, progress, isLoggedIn, logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/auth');
    }
  }, [isLoggedIn, navigate]);

  if (!user) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '早上好';
    if (hour < 18) return '下午好';
    return '晚上好';
  };

  const stats = [
    { label: '已完成课程', value: progress.completedLessons.length, icon: '📚', color: 'indigo' },
    { label: '已完成练习', value: progress.completedExercises.length, icon: '✅', color: 'emerald' },
    { label: '连续学习', value: `${progress.streak} 天`, icon: '🔥', color: 'amber' },
    { label: '学习记录', value: progress.learningHistory.length, icon: '📝', color: 'rose' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20 pb-12 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {getGreeting()}，{user.username}！
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">继续您的学习之旅</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/book"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <span>📖</span> 继续学习
            </Link>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              退出登录
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5"
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-xl flex items-center justify-center text-2xl`}>
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Recent Learning */}
          <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>📖</span> 最近学习
              </h2>
              <Link to="/book" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">
                查看全部 →
              </Link>
            </div>

            {progress.learningHistory.length > 0 ? (
              <div className="space-y-3">
                {progress.learningHistory.slice(0, 5).map((record, index) => (
                  <Link
                    key={index}
                    to={`/book/${record.lessonId}`}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                        <span className="text-indigo-600 dark:text-indigo-400 font-medium text-sm">
                          {record.category.slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">{record.lessonTitle}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{record.category}</div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 dark:text-slate-500">
                      {formatDate(record.completedAt)}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📚</div>
                <p className="text-slate-500 dark:text-slate-400">还没有学习记录</p>
                <Link
                  to="/book"
                  className="inline-block mt-3 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                >
                  开始学习 →
                </Link>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* User Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg shadow-indigo-500/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                  👤
                </div>
                <div>
                  <div className="font-bold text-lg">{user.username}</div>
                  <div className="text-indigo-200 text-sm">{user.email}</div>
                </div>
              </div>
              <div className="text-sm text-indigo-100">
                注册于 {new Date(user.createdAt).toLocaleDateString('zh-CN')}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">快捷入口</h3>
              <div className="space-y-2">
                <Link
                  to="/algorithms"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <span className="text-xl">🎬</span>
                  <span className="text-slate-700 dark:text-slate-300">算法演示</span>
                </Link>
                <Link
                  to="/practice"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <span className="text-xl">🤖</span>
                  <span className="text-slate-700 dark:text-slate-300">AI练习</span>
                </Link>
                <Link
                  to="/book"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <span className="text-xl">📚</span>
                  <span className="text-slate-700 dark:text-slate-300">教程文档</span>
                </Link>
              </div>
            </div>

            {/* Exercise History */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span>✅</span> 练习记录
              </h3>
              {progress.exerciseHistory.length > 0 ? (
                <div className="space-y-2">
                  {progress.exerciseHistory.slice(0, 3).map((record, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-700/30"
                    >
                      <div className="flex items-center gap-2">
                        <span className={record.isCorrect ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}>
                          {record.isCorrect ? '✓' : '✗'}
                        </span>
                        <span className="text-sm text-slate-700 dark:text-slate-300 truncate max-w-[120px]">
                          {record.exerciseTitle}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        {formatDate(record.completedAt)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 dark:text-slate-400 text-sm text-center py-4">
                  还没有练习记录
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Learning Progress Section */}
        <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span>📊</span> 学习进度
          </h2>
          <div className="grid md:grid-cols-6 gap-4">
            {[
              { name: '绑论', total: 4, icon: '📖' },
              { name: '线性表', total: 6, icon: '🔗' },
              { name: '树', total: 4, icon: '🌳' },
              { name: '图', total: 6, icon: '🕸️' },
              { name: '查找', total: 3, icon: '🔍' },
              { name: '排序', total: 4, icon: '📊' },
            ].map((category) => {
              const completed = progress.completedLessons.filter(
                (id) => id.includes(category.name.toLowerCase().slice(0, 4))
              ).length;
              const percent = Math.round((completed / category.total) * 100) || 0;

              return (
                <div key={category.name} className="text-center">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <div className="text-sm font-medium text-slate-900 dark:text-white">{category.name}</div>
                  <div className="mt-2 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{percent}%</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
