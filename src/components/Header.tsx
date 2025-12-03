import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';

const navItems = [
  { path: '/algorithms', label: '🎬 算法演示' },
  { path: '/book', label: '📚 教程' },
  { path: '/practice', label: '🤖 AI练习' },
];

export default function Header() {
  const location = useLocation();
  const { user, isLoggedIn, progress, logout } = useUser();
  const { theme, toggleTheme, isAuto } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 z-50 transition-colors duration-300">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">DS</span>
          </div>
          <span className="font-semibold text-slate-900 dark:text-white hidden sm:inline">数据结构</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-xs sm:text-sm font-medium transition-colors ${
                location.pathname.startsWith(item.path)
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors relative group"
            title={isAuto ? "自动模式 (19:30-7:30开启夜间)" : "点击切换主题"}
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
            <span className="hidden md:inline-block ml-1 text-xs text-slate-500 dark:text-slate-400">
              {theme === 'dark' ? '夜间' : '白天'}
            </span>
            {isAuto && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full ring-1 ring-white dark:ring-slate-900"></span>
            )}
          </button>

          {/* User Section */}
          {isLoggedIn ? (
            <div className="relative ml-2">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 dark:text-indigo-300 font-medium text-sm">
                    {user?.username.slice(0, 1).toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-slate-900 dark:text-white">{user?.username}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <span className="text-amber-500">🔥</span>
                    {progress.streak}天
                  </div>
                </div>
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showDropdown && (
                <>
                  <div
                    className="fixed inset-0"
                    onClick={() => setShowDropdown(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                      <div className="font-medium text-slate-900 dark:text-white">{user?.username}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</div>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                      >
                        <span>📊</span> 学习中心
                      </Link>
                      <div className="px-4 py-2 text-sm text-slate-500 dark:text-slate-400 flex items-center justify-between">
                        <span>已完成课程</span>
                        <span className="font-medium text-indigo-600 dark:text-indigo-400">{progress.completedLessons.length}</span>
                      </div>
                      <div className="px-4 py-2 text-sm text-slate-500 dark:text-slate-400 flex items-center justify-between">
                        <span>已完成练习</span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">{progress.completedExercises.length}</span>
                      </div>
                    </div>
                    <div className="border-t border-slate-100 dark:border-slate-700 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setShowDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                      >
                        <span>🚪</span> 退出登录
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              登录
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
