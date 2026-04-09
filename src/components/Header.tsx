import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import { useI18n } from '../contexts/I18nContext';

export default function Header() {
  const location = useLocation();
  const { user, isLoggedIn, isAuthLoading, progress, logout } = useUser();
  const { theme, toggleTheme, isAuto } = useTheme();
  const { isEnglish, locale, setLocale, t } = useI18n();
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  const navItems = useMemo(() => [
    { path: '/algorithms', label: isEnglish ? 'Algorithms' : '算法演示', icon: '🎬' },
    { path: '/book', label: isEnglish ? 'Tutorials' : '教程', icon: '📚' },
    { path: '/methodology', label: isEnglish ? 'Methodology' : '方法论', icon: '📖' },
    { path: '/practice', label: isEnglish ? 'AI Practice' : 'AI练习', icon: '🤖' },
    { path: '/mindmap', label: 'MindMap', icon: '🧠' },
  ], [isEnglish]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setShowDropdown(false);
  }, [location.pathname]);

  useEffect(() => {
    const target = headerRef.current;
    if (!target || typeof document === 'undefined') {
      return undefined;
    }

    const applyHeight = () => {
      const measured = target.offsetHeight || 64;
      document.documentElement.style.setProperty('--app-header-height', `${measured}px`);
    };

    applyHeight();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(() => {
        applyHeight();
      });
      observer.observe(target);
      return () => observer.disconnect();
    }

    window.addEventListener('resize', applyHeight);
    return () => window.removeEventListener('resize', applyHeight);
  }, [isEnglish, locale, isLoggedIn, isAuthLoading, mobileMenuOpen, showDropdown]);

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-slate-200/40 bg-white/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] backdrop-blur-xl dark:border-white/[0.06] dark:bg-slate-950/80'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="group flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-klein-500 to-klein-600 text-xs font-bold tracking-wider text-white shadow-md shadow-klein-500/15 transition-transform duration-300 group-hover:scale-105">
            DS
          </div>
          <span className="hidden text-base font-bold tracking-tight text-slate-800 transition-colors group-hover:text-klein-600 dark:text-white dark:group-hover:text-pine-500 sm:inline">
            {isEnglish ? 'Data Structures' : '数据结构'}
          </span>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-4">
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="relative cursor-pointer rounded-full p-2 text-slate-600 transition-all hover:bg-slate-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klein-500/60 dark:text-slate-400 dark:hover:bg-slate-800 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <div className="hidden items-center rounded-full border border-slate-200/40 bg-slate-100/40 p-1 backdrop-blur-sm dark:border-white/[0.06] dark:bg-slate-800/40 md:flex">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klein-500/60 ${
                    isActive
                      ? 'text-klein-600 dark:text-white'
                      : 'text-slate-600 hover:bg-white/50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-white shadow-sm dark:bg-klein-600"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      style={{ zIndex: -1 }}
                    />
                  )}
                  {item.icon} {item.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 border-l border-slate-200 pl-2 dark:border-slate-800 sm:gap-3 sm:pl-5">
            <div className="hidden items-center rounded-full border border-slate-200 bg-white/70 backdrop-blur-sm p-1 text-xs dark:border-slate-700 dark:bg-slate-900/70 sm:flex">
              <button
                type="button"
                onClick={() => setLocale('zh-CN')}
                  className={`min-h-[36px] min-w-[44px] cursor-pointer rounded-full px-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klein-500/60 ${
                  locale === 'zh-CN'
                    ? 'bg-klein-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                中
              </button>
              <button
                type="button"
                onClick={() => setLocale('en-US')}
                  className={`min-h-[36px] min-w-[44px] cursor-pointer rounded-full px-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klein-500/60 ${
                  locale === 'en-US'
                    ? 'bg-klein-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                EN
              </button>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className="relative min-h-[44px] min-w-[44px] cursor-pointer rounded-full p-2 text-slate-500 transition-all hover:scale-105 hover:bg-slate-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klein-500/60 dark:text-slate-400 dark:hover:bg-slate-800"
              title={isAuto ? t('自动模式 (19:30-7:30开启夜间)') : t('点击切换主题')}
            >
              {theme === 'light' ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
              {isAuto && (
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-pine-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {isAuthLoading ? (
              <div className="px-4 py-2 text-sm text-slate-500 dark:text-slate-400">
                {t('验证中...')}
              </div>
            ) : isLoggedIn ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowDropdown((value) => !value)}
                  className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pl-2 pr-1 transition-all hover:border-klein-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klein-500/60 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-pine-500"
                >
                  <div className="hidden text-right sm:block">
                    <div className="mb-0.5 text-xs font-bold leading-none text-slate-900 dark:text-white">{user?.username}</div>
                    <div className="text-[10px] leading-none text-slate-500 dark:text-slate-400">
                      🔥 {progress.streak}{isEnglish ? 'd' : '天'}
                    </div>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-klein-500 to-klein-600 text-xs font-bold text-white shadow-md">
                    {user?.username.slice(0, 1).toUpperCase()}
                  </div>
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full z-50 mt-3 w-64 rounded-2xl border border-slate-200/50 bg-white/90 py-2 shadow-xl shadow-slate-200/20 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-800/90 dark:shadow-black/20"
                      >
                        <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-700/50">
                          <div className="text-lg font-bold text-slate-900 dark:text-white">{user?.username}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</div>
                        </div>
                        <div className="space-y-1 p-2">
                          <Link
                            to="/dashboard"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klein-500/60 dark:text-slate-300 dark:hover:bg-slate-700/50"
                          >
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-klein-50 text-lg dark:bg-klein-900/30">📊</span>
                            {isEnglish ? 'Dashboard' : '学习中心'}
                          </Link>
                          <div className="grid grid-cols-2 gap-2 px-2">
                            <div className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-700/30">
                              <div className="text-2xl font-bold text-klein-500 dark:text-klein-400">{progress.completedLessons.length}</div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400">{isEnglish ? 'Lessons' : '已修课程'}</div>
                            </div>
                            <div className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-700/30">
                              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{progress.completedExercises.length}</div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400">{isEnglish ? 'Exercises' : '完成练习'}</div>
                            </div>
                          </div>
                        </div>
                        <div className="border-t border-slate-100 px-2 pb-2 pt-2 dark:border-slate-700/50">
                          <button
                            type="button"
                            onClick={() => {
                              logout();
                              setShowDropdown(false);
                            }}
                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/60 dark:text-rose-400 dark:hover:bg-rose-900/10"
                          >
                            🚪 {isEnglish ? 'Sign Out' : '退出登录'}
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
                className="rounded-full bg-klein-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-klein-500/20 transition-all hover:-translate-y-0.5 hover:bg-klein-600 hover:shadow-klein-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klein-500/60 sm:px-5"
              >
                {isEnglish ? 'Sign In' : '登录'}
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile navigation panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-slate-200/50 bg-white/90 backdrop-blur-xl dark:border-white/5 dark:bg-slate-950/90 md:hidden"
          >
            <div className="space-y-3 px-4 py-4">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-1 dark:border-slate-800 dark:bg-slate-900/70 sm:hidden">
                <button
                  type="button"
                  onClick={() => setLocale('zh-CN')}
                  className={`min-h-[44px] flex-1 cursor-pointer rounded-xl px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klein-500/60 ${
                    locale === 'zh-CN'
                      ? 'bg-klein-600 text-white'
                      : 'text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  中文
                </button>
                <button
                  type="button"
                  onClick={() => setLocale('en-US')}
                  className={`min-h-[44px] flex-1 cursor-pointer rounded-xl px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klein-500/60 ${
                    locale === 'en-US'
                      ? 'bg-klein-600 text-white'
                      : 'text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  English
                </button>
              </div>
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-klein-50 text-klein-600 dark:bg-klein-900/30 dark:text-white'
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                    }`}
                  >
                    {item.icon} {item.label}
                  </Link>
                );
              })}
              {!isAuthLoading && !isLoggedIn && (
                <Link
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-[44px] items-center justify-center rounded-xl bg-klein-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-klein-500/20 transition-colors hover:bg-klein-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klein-500/60"
                >
                  {isEnglish ? 'Sign In / Sign Up' : '登录 / 注册'}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
