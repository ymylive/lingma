import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '../contexts/I18nContext';
import { useUser } from '../contexts/UserContext';
import { SKILL_LEVEL_META, type UserSkillLevel } from '../utils/userPersonalization';
import { TARGET_LANGUAGE_OPTIONS, type TargetLanguage } from '../utils/targetLanguages';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [skillLevel, setSkillLevel] = useState<UserSkillLevel>('beginner');
  const [targetLanguage, setTargetLanguage] = useState<TargetLanguage>('cpp');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { isEnglish } = useI18n();
  const { login, register, isLoggedIn, isAuthLoading } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || '/dashboard';

  const copy = useMemo(() => ({
    title: isLogin ? (isEnglish ? 'Welcome back' : '欢迎回来') : (isEnglish ? 'Create your account' : '创建账户'),
    subtitle: isLogin
      ? (isEnglish ? 'Sign in to sync your learning progress.' : '登录以同步你的学习进度。')
      : (isEnglish ? 'Start your structured learning journey today.' : '开始你的数据结构学习之旅。'),
    username: isEnglish ? 'Username' : '用户名',
    level: isEnglish ? 'Current level' : '当前水平',
    targetLanguage: isEnglish ? 'Primary programming language' : '主学编程语言',
    email: isEnglish ? 'Email' : '邮箱',
    password: isEnglish ? 'Password' : '密码',
    confirmPassword: isEnglish ? 'Confirm password' : '确认密码',
    usernamePlaceholder: isEnglish ? 'Enter your username' : '请输入用户名',
    emailPlaceholder: isEnglish ? 'Enter your email' : '请输入邮箱',
    passwordPlaceholder: isEnglish ? 'Enter your password' : '请输入密码',
    confirmPasswordPlaceholder: isEnglish ? 'Enter your password again' : '请再次输入密码',
    levelHint: isEnglish
      ? 'Your level drives recommended tracks, daily picks, and AI problem difficulty.'
      : '你的水平会驱动推荐题库、每日推荐和 AI 出题难度。',
    languageHint: isEnglish
      ? 'AI prompts and editor defaults will prioritize this language.'
      : 'AI 出题提示词和编辑器默认语言会优先采用该语言。',
    loading: isAuthLoading ? (isEnglish ? 'Checking...' : '验证中...') : (isEnglish ? 'Working...' : '处理中...'),
    submit: isLogin ? (isEnglish ? 'Sign In' : '登录') : (isEnglish ? 'Sign Up' : '注册'),
    toggle: isLogin ? (isEnglish ? 'No account? Create one now' : '没有账户？立即注册') : (isEnglish ? 'Already have an account? Sign in' : '已有账户？立即登录'),
    usernameRequired: isEnglish ? 'Please enter a username.' : '请输入用户名',
    passwordMismatch: isEnglish ? 'Passwords do not match.' : '两次密码输入不一致',
    passwordTooShort: isEnglish ? 'Password must be at least 6 characters.' : '密码至少 6 位',
    invalidLogin: isEnglish ? 'Incorrect email or password.' : '邮箱或密码错误',
    emailExists: isEnglish ? 'This email is already registered.' : '该邮箱已被注册',
    genericError: isEnglish ? 'Action failed. Please try again.' : '操作失败，请重试',
    feature1: isEnglish ? 'Progress Sync' : '进度同步',
    feature2: isEnglish ? 'Learning History' : '学习记录',
    feature3: isEnglish ? 'Daily Streak' : '连续打卡',
  }), [isAuthLoading, isEnglish, isLogin]);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }
    if (isLoggedIn) {
      navigate(from, { replace: true });
    }
  }, [from, isAuthLoading, isLoggedIn, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const success = await login(email, password);
        if (success) {
          navigate(from, { replace: true });
        } else {
          setError(copy.invalidLogin);
        }
      } else {
        if (password !== confirmPassword) {
          setError(copy.passwordMismatch);
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError(copy.passwordTooShort);
          setLoading(false);
          return;
        }
        if (!username.trim()) {
          setError(copy.usernameRequired);
          setLoading(false);
          return;
        }

        const success = await register(username.trim(), email, password, skillLevel, targetLanguage);
        if (success) {
          navigate(from, { replace: true });
        } else {
          setError(copy.emailExists);
        }
      }
    } catch {
      setError(copy.genericError);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-6 pb-12 pt-20 transition-colors duration-300 dark:from-slate-900 dark:to-slate-800">
      <div className="mx-auto max-w-lg">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600">
              <span className="text-xl font-bold text-white">DS</span>
            </div>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">{copy.title}</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">{copy.subtitle}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">{copy.username}</label>
                <input
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder={copy.usernamePlaceholder}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white dark:focus:ring-indigo-900/50"
                  required={!isLogin}
                />
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">{copy.level}</label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {Object.values(SKILL_LEVEL_META).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSkillLevel(item.id)}
                      className={`min-h-[96px] cursor-pointer rounded-2xl border px-4 py-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
                        skillLevel === item.id
                          ? 'border-indigo-500 bg-indigo-50 shadow-sm dark:border-indigo-400 dark:bg-indigo-900/20'
                          : 'border-slate-200 bg-slate-50 hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-900/50'
                      }`}
                    >
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">{item.label}</div>
                      <div className="mt-1 text-xs text-indigo-600 dark:text-indigo-300">{item.recommendedTrack}</div>
                      <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{item.description}</p>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{copy.levelHint}</p>
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">{copy.targetLanguage}</label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {TARGET_LANGUAGE_OPTIONS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTargetLanguage(item.id)}
                      className={`min-h-[84px] cursor-pointer rounded-2xl border px-4 py-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
                        targetLanguage === item.id
                          ? 'border-emerald-500 bg-emerald-50 shadow-sm dark:border-emerald-400 dark:bg-emerald-900/20'
                          : 'border-slate-200 bg-slate-50 hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-900/50'
                      }`}
                    >
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">{item.label}</div>
                      <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{isEnglish ? item.descriptionEn : item.description}</p>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{copy.languageHint}</p>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">{copy.email}</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={copy.emailPlaceholder}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white dark:focus:ring-indigo-900/50"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">{copy.password}</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={copy.passwordPlaceholder}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white dark:focus:ring-indigo-900/50"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">{copy.confirmPassword}</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder={copy.confirmPasswordPlaceholder}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white dark:focus:ring-indigo-900/50"
                  required={!isLogin}
                />
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-600 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || isAuthLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading || isAuthLoading ? (
                <>
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {copy.loading}
                </>
              ) : (
                copy.submit
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin((value) => !value);
                setError('');
              }}
              className="cursor-pointer text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              {copy.toggle}
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-2 text-2xl">📈</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">{copy.feature1}</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-2 text-2xl">🧭</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">{copy.feature2}</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-2 text-2xl">🔥</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">{copy.feature3}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
