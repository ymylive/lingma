import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { path: '/algorithms', label: '🎬 算法演示' },
  { path: '/book', label: '📚 教程' },
  { path: '/practice', label: '🤖 AI练习' },
  { path: '/mindmap', label: 'MindMap' },
];

export default function Header() {
  const location = useLocation();
  const { user, isLoggedIn, isAuthLoading, progress, logout } = useUser();
  const { theme, toggleTheme, isAuto } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/70 dark:bg-[#0B1120]/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5 shadow-sm' 
          : 'bg-transparent border-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-gradient-to-br from-klein-500 to-klein-600 rounded-xl flex items-center justify-center shadow-lg shadow-klein-500/20 group-hover:scale-105 transition-transform duration-300">
            <span className="text-white font-bold text-sm tracking-wider">DS</span>
          </div>
          <span className="font-bold text-lg text-slate-800 dark:text-white hidden sm:inline tracking-tight group-hover:text-klein-600 dark:group-hover:text-pine-500 transition-colors">
            数据结构
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-6">
          <div className="flex items-center bg-slate-100/50 dark:bg-slate-800/50 rounded-full p-1 backdrop-blur-sm border border-slate-200/50 dark:border-white/5">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all duration-300 ${
                    isActive
                      ? 'text-klein-600 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white dark:bg-klein-600 shadow-sm rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      style={{ zIndex: -1 }}
                    />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3 pl-2 sm:pl-6 border-l border-slate-200 dark:border-slate-800">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-all relative hover:scale-105 active:scale-95"
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
              {isAuto && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-pine-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
              )}
            </button>

            {/* User Section */}
            {isAuthLoading ? (
              <div className="ml-2 px-5 py-2 text-sm text-slate-500 dark:text-slate-400">
                验证中...
              </div>
            ) : isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 p-1 pl-2 pr-1 rounded-full border border-slate-200 dark:border-slate-700 hover:border-klein-300 dark:hover:border-pine-500 transition-all bg-white dark:bg-slate-900"
                >
                  <div className="hidden sm:block text-right mr-1">
                    <div className="text-xs font-bold text-slate-900 dark:text-white leading-none mb-0.5">{user?.username}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-none">
                      <span className="text-amber-500">🔥</span> {progress.streak}天
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-br from-klein-500 to-klein-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md">
                    {user?.username.slice(0, 1).toUpperCase()}
                  </div>
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowDropdown(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-3 w-64 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl shadow-slate-200/20 dark:shadow-black/20 py-2 z-50"
                      >
                        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50">
                          <div className="font-bold text-slate-900 dark:text-white text-lg">{user?.username}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</div>
                        </div>
                        <div className="p-2 space-y-1">
                          <Link
                            to="/dashboard"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors"
                          >
                            <span className="w-8 h-8 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-lg">📊</span>
                            学习中心
                          </Link>
                          <div className="grid grid-cols-2 gap-2 px-2">
                             <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-3 text-center">
                                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{progress.completedLessons.length}</div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400">已修课程</div>
                             </div>
                             <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-3 text-center">
                                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{progress.completedExercises.length}</div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400">完成练习</div>
                             </div>
                          </div>
                        </div>
                        <div className="border-t border-slate-100 dark:border-slate-700/50 pt-2 px-2 pb-2">
                          <button
                            onClick={() => {
                              logout();
                              setShowDropdown(false);
                            }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-xl transition-colors"
                          >
                            <span>🚪</span> 退出登录
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/auth"
                className="ml-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm font-medium transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
              >
                登录
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
