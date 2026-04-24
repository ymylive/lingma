import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  BookMarked,
  CheckCircle2,
  Code2,
  Flame,
  Lock,
  LogIn,
  Mail,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  User as UserIcon,
  UserPlus,
} from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';
import { useUser } from '../contexts/UserContext';
import { SKILL_LEVEL_META, type UserSkillLevel } from '../utils/userPersonalization';
import { TARGET_LANGUAGE_OPTIONS, type TargetLanguage } from '../utils/targetLanguages';
import { Button, GlassCard } from '../components/ui';

type AuthMode = 'login' | 'register' | 'forgot';

const INPUT_CLASS =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-klein-500 focus-visible:ring-2 focus-visible:ring-klein-500/60 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500';

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [resetRequested, setResetRequested] = useState(false);
  const [skillLevel, setSkillLevel] = useState<UserSkillLevel>('beginner');
  const [targetLanguage, setTargetLanguage] = useState<TargetLanguage>('cpp');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { isEnglish } = useI18n();
  const { login, register, requestPasswordReset, confirmPasswordReset, isLoggedIn, isAuthLoading } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || '/dashboard';
  const isLogin = mode === 'login';
  const isRegister = mode === 'register';
  const isForgot = mode === 'forgot';

  const copy = useMemo(() => ({
    title: isLogin
      ? (isEnglish ? 'Welcome back' : '欢迎回来')
      : isRegister
        ? (isEnglish ? 'Create your account' : '创建账户')
        : (isEnglish ? 'Recover your password' : '找回密码'),
    subtitle: isLogin
      ? (isEnglish ? 'Sign in to sync your learning progress.' : '登录以同步你的学习进度。')
      : isRegister
        ? (isEnglish ? 'Start your structured learning journey today.' : '开始你的数据结构学习之旅。')
        : (isEnglish ? 'Request a verification code and set a new password.' : '获取验证码并设置新密码。'),
    username: isEnglish ? 'Username' : '用户名',
    level: isEnglish ? 'Current level' : '当前水平',
    targetLanguage: isEnglish ? 'Primary programming language' : '主学编程语言',
    email: isEnglish ? 'Email' : '邮箱',
    password: isEnglish ? 'Password' : '密码',
    confirmPassword: isEnglish ? 'Confirm password' : '确认密码',
    verificationCode: isEnglish ? 'Verification code' : '验证码',
    usernamePlaceholder: isEnglish ? 'Enter your username' : '请输入用户名',
    emailPlaceholder: isEnglish ? 'Enter your email' : '请输入邮箱',
    passwordPlaceholder: isEnglish ? 'Enter your password' : '请输入密码',
    confirmPasswordPlaceholder: isEnglish ? 'Enter your password again' : '请再次输入密码',
    verificationCodePlaceholder: isEnglish ? 'Enter verification code' : '请输入验证码',
    levelHint: isEnglish
      ? 'Your level drives recommended tracks, daily picks, and AI problem difficulty.'
      : '你的水平会驱动推荐题库、每日推荐和 AI 出题难度。',
    languageHint: isEnglish
      ? 'AI prompts and editor defaults will prioritize this language.'
      : 'AI 出题提示词和编辑器默认语言会优先采用该语言。',
    loading: isAuthLoading ? (isEnglish ? 'Checking...' : '验证中...') : (isEnglish ? 'Working...' : '处理中...'),
    submit: isLogin
      ? (isEnglish ? 'Sign In' : '登录')
      : isRegister
        ? (isEnglish ? 'Sign Up' : '注册')
        : resetRequested
          ? (isEnglish ? 'Reset password' : '重置密码')
          : (isEnglish ? 'Send verification code' : '发送验证码'),
    toggle: isLogin ? (isEnglish ? 'No account? Create one now' : '没有账户？立即注册') : (isEnglish ? 'Already have an account? Sign in' : '已有账户？立即登录'),
    forgotAction: isEnglish ? 'Forgot password?' : '忘记密码？',
    backToLogin: isEnglish ? 'Back to sign in' : '返回登录',
    usernameRequired: isEnglish ? 'Please enter a username.' : '请输入用户名',
    passwordMismatch: isEnglish ? 'Passwords do not match.' : '两次密码输入不一致',
    passwordTooShort: isEnglish ? 'Password must be at least 6 characters.' : '密码至少 6 位',
    invalidVerificationCode: isEnglish ? 'Enter a valid 6-digit verification code.' : '请输入有效的 6 位验证码。',
    invalidLogin: isEnglish ? 'Incorrect email or password.' : '邮箱或密码错误',
    emailExists: isEnglish ? 'This email is already registered.' : '该邮箱已被注册',
    resetRequestSuccess: isEnglish ? 'If that email is registered, we have sent a verification code.' : '如果该邮箱已注册，我们已发送验证码。',
    resetConfirmSuccess: isEnglish ? 'Password reset successfully. Please sign in with your new password.' : '密码已重置，请使用新密码登录。',
    genericError: isEnglish ? 'Action failed. Please try again.' : '操作失败，请重试',
    feature1: isEnglish ? 'Progress Sync' : '进度同步',
    feature1Desc: isEnglish ? 'Completed lessons and exercises stay aligned across devices.' : '课程与练习进度跨设备无缝同步。',
    feature2: isEnglish ? 'Learning History' : '学习记录',
    feature2Desc: isEnglish ? 'Replay your journey, revisit past lessons, and review exercises.' : '回看学习路径，随时回顾课程与练习。',
    feature3: isEnglish ? 'Daily Streak' : '连续打卡',
    feature3Desc: isEnglish ? 'A gentle streak counter keeps the habit alive without pressure.' : '温和的连续打卡，让学习习惯自然延续。',
    marketingEyebrow: isEnglish ? 'Lingma · 灵码' : 'Lingma · 灵码',
    marketingTitle: isEnglish ? 'Learn data structures with visuals, AI, and deliberate practice.' : '在可视化、AI 与刻意练习中掌握数据结构与算法。',
  }), [isAuthLoading, isEnglish, isLogin, isRegister, resetRequested]);

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
    if (!isForgot) {
      setSuccessMessage('');
    }
    setLoading(true);

    try {
      if (isLogin) {
        const success = await login(email, password);
        if (success) {
          navigate(from, { replace: true });
        } else {
          setError(copy.invalidLogin);
        }
      } else if (isRegister) {
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
      } else if (!resetRequested) {
        await requestPasswordReset(email);
        setResetRequested(true);
        setSuccessMessage(copy.resetRequestSuccess);
      } else {
        if (!/^[0-9]{6}$/.test(resetCode)) {
          setError(copy.invalidVerificationCode);
          setLoading(false);
          return;
        }
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

        await confirmPasswordReset(email, resetCode, password);
        setMode('login');
        setResetRequested(false);
        setResetCode('');
        setPassword('');
        setConfirmPassword('');
        setSuccessMessage(copy.resetConfirmSuccess);
      }
    } catch {
      setError(copy.genericError);
    }

    setLoading(false);
  };

  const submitIcon = isLogin ? (
    <LogIn className="h-5 w-5" strokeWidth={1.75} aria-hidden />
  ) : isRegister ? (
    <UserPlus className="h-5 w-5" strokeWidth={1.75} aria-hidden />
  ) : (
    <ShieldCheck className="h-5 w-5" strokeWidth={1.75} aria-hidden />
  );

  const features = [
    {
      icon: TrendingUp,
      title: copy.feature1,
      desc: copy.feature1Desc,
    },
    {
      icon: BookMarked,
      title: copy.feature2,
      desc: copy.feature2Desc,
    },
    {
      icon: Flame,
      title: copy.feature3,
      desc: copy.feature3Desc,
    },
  ];

  return (
    <div className="page-safe-top min-h-screen px-4 pb-12 transition-colors duration-300 sm:px-6">
      <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        {/* Marketing column */}
        <div className="order-2 space-y-10 lg:order-1 lg:pr-4">
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-klein-500 via-klein-600 to-klein-700 font-serif text-2xl font-semibold text-white shadow-lg shadow-klein-600/20 ring-1 ring-klein-400/30">
                灵
              </span>
              <span className="flex flex-col leading-tight">
                <span className="font-serif text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                  Lingma
                </span>
                <span className="text-[9px] font-mono uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                  灵码
                </span>
              </span>
            </Link>
            <div className="mt-6">
              <span className="inline-flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                <span className="h-px w-6 bg-current opacity-50" aria-hidden />
                00 · {copy.marketingEyebrow}
              </span>
            </div>
            <h1 className="mt-4 font-serif text-4xl font-medium leading-[1.05] tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
              {copy.marketingTitle}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-slate-600 dark:text-slate-400">
              {isEnglish
                ? 'Sign in to unlock synced progress, a daily recommendation engine, and AI-assisted practice tailored to your level.'
                : '登录后可同步学习进度、每日推荐与基于水平的 AI 辅助练习。'}
            </p>
          </div>

          <ul className="space-y-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <li key={feature.title} className="flex items-start gap-4">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-klein-200/60 bg-klein-50/70 text-klein-600 dark:border-klein-800/50 dark:bg-klein-950/40 dark:text-klein-300">
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 dark:text-white">{feature.title}</div>
                    <p className="mt-0.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {feature.desc}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400" strokeWidth={1.75} aria-hidden />
            {isEnglish ? 'Your data is private and never shared.' : '你的数据私密保存，绝不外流。'}
          </div>
        </div>

        {/* Form column */}
        <div className="order-1 lg:order-2">
          <div className="mx-auto w-full max-w-lg">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="font-serif text-3xl font-medium tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                {copy.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{copy.subtitle}</p>
            </div>

            <GlassCard variant="frosted" padding="lg" hoverable={false}>
              <form onSubmit={handleSubmit} className="space-y-5">
                {isRegister && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      <span className="inline-flex items-center gap-1.5">
                        <UserIcon className="h-4 w-4 text-klein-500 dark:text-klein-400" strokeWidth={1.75} aria-hidden />
                        {copy.username}
                      </span>
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      placeholder={copy.usernamePlaceholder}
                      className={INPUT_CLASS}
                      required={isRegister}
                    />
                  </div>
                )}

                {isRegister && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      <span className="inline-flex items-center gap-1.5">
                        <TrendingUp className="h-4 w-4 text-klein-500 dark:text-klein-400" strokeWidth={1.75} aria-hidden />
                        {copy.level}
                      </span>
                    </label>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {Object.values(SKILL_LEVEL_META).map((item) => {
                        const active = skillLevel === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setSkillLevel(item.id)}
                            aria-pressed={active}
                            className={`min-h-[88px] cursor-pointer rounded-xl border px-4 py-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klein-500/60 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
                              active
                                ? 'border-klein-500 bg-klein-50/80 shadow-sm dark:border-klein-400 dark:bg-klein-900/30'
                                : 'border-slate-200/70 bg-white/70 hover:border-klein-300 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-900/50 dark:hover:border-klein-500/40'
                            }`}
                          >
                            <div className="text-sm font-semibold text-slate-900 dark:text-white">{item.label}</div>
                            <div className="mt-1 text-xs text-klein-600 dark:text-klein-300">{item.recommendedTrack}</div>
                            <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{item.description}</p>
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{copy.levelHint}</p>
                  </div>
                )}

                {isRegister && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      <span className="inline-flex items-center gap-1.5">
                        <Code2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400" strokeWidth={1.75} aria-hidden />
                        {copy.targetLanguage}
                      </span>
                    </label>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {TARGET_LANGUAGE_OPTIONS.map((item) => {
                        const active = targetLanguage === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setTargetLanguage(item.id)}
                            aria-pressed={active}
                            className={`min-h-[80px] cursor-pointer rounded-xl border px-4 py-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
                              active
                                ? 'border-emerald-500 bg-emerald-50/80 shadow-sm dark:border-emerald-400 dark:bg-emerald-900/30'
                                : 'border-slate-200/70 bg-white/70 hover:border-emerald-300 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-900/50 dark:hover:border-emerald-500/40'
                            }`}
                          >
                            <div className="text-sm font-semibold text-slate-900 dark:text-white">{item.label}</div>
                            <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                              {isEnglish ? item.descriptionEn : item.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{copy.languageHint}</p>
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    <span className="inline-flex items-center gap-1.5">
                      <Mail className="h-4 w-4 text-klein-500 dark:text-klein-400" strokeWidth={1.75} aria-hidden />
                      {copy.email}
                    </span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={copy.emailPlaceholder}
                    className={INPUT_CLASS}
                    required
                  />
                </div>

                {(isLogin || isRegister || resetRequested) && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      <span className="inline-flex items-center gap-1.5">
                        <Lock className="h-4 w-4 text-klein-500 dark:text-klein-400" strokeWidth={1.75} aria-hidden />
                        {copy.password}
                      </span>
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder={copy.passwordPlaceholder}
                      className={INPUT_CLASS}
                      required={!isForgot || resetRequested}
                    />
                  </div>
                )}

                {isLogin && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setError('');
                        setSuccessMessage('');
                        setPassword('');
                        setConfirmPassword('');
                        setResetCode('');
                        setResetRequested(false);
                      }}
                      className="cursor-pointer text-sm font-medium text-klein-600 transition-colors hover:text-klein-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klein-500/60 dark:text-klein-400 dark:hover:text-klein-300"
                    >
                      {copy.forgotAction}
                    </button>
                  </div>
                )}

                {(isRegister || (isForgot && resetRequested)) && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      <span className="inline-flex items-center gap-1.5">
                        {isForgot ? (
                          <ShieldCheck className="h-4 w-4 text-klein-500 dark:text-klein-400" strokeWidth={1.75} aria-hidden />
                        ) : (
                          <Lock className="h-4 w-4 text-klein-500 dark:text-klein-400" strokeWidth={1.75} aria-hidden />
                        )}
                        {isForgot ? copy.verificationCode : copy.confirmPassword}
                      </span>
                    </label>
                    <input
                      type={isForgot ? 'text' : 'password'}
                      inputMode={isForgot ? 'numeric' : undefined}
                      value={isForgot ? resetCode : confirmPassword}
                      onChange={(event) => {
                        if (isForgot) {
                          setResetCode(event.target.value);
                        } else {
                          setConfirmPassword(event.target.value);
                        }
                      }}
                      placeholder={isForgot ? copy.verificationCodePlaceholder : copy.confirmPasswordPlaceholder}
                      className={INPUT_CLASS}
                      required
                    />
                  </div>
                )}

                {isForgot && resetRequested && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      <span className="inline-flex items-center gap-1.5">
                        <Lock className="h-4 w-4 text-klein-500 dark:text-klein-400" strokeWidth={1.75} aria-hidden />
                        {copy.confirmPassword}
                      </span>
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder={copy.confirmPasswordPlaceholder}
                      className={INPUT_CLASS}
                      required
                    />
                  </div>
                )}

                {successMessage && (
                  <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-sm text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-900/20 dark:text-emerald-300">
                    <CheckCircle2 className="h-4 w-4 shrink-0 translate-y-0.5" strokeWidth={1.75} aria-hidden />
                    <span className="leading-relaxed">{successMessage}</span>
                  </div>
                )}

                {error && (
                  <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50/80 p-3 text-sm text-rose-600 dark:border-rose-800/60 dark:bg-rose-900/20 dark:text-rose-300">
                    <Activity className="h-4 w-4 shrink-0 translate-y-0.5" strokeWidth={1.75} aria-hidden />
                    <span className="leading-relaxed">{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={loading || isAuthLoading}
                  loading={loading || isAuthLoading}
                  icon={submitIcon}
                >
                  {loading || isAuthLoading ? copy.loading : copy.submit}
                </Button>
              </form>

              <div className="mt-6 text-center">
                {!isForgot ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMode((value) => (value === 'login' ? 'register' : 'login'));
                      setError('');
                      setSuccessMessage('');
                    }}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-klein-600 transition-colors hover:text-klein-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klein-500/60 dark:text-klein-400 dark:hover:text-klein-300"
                  >
                    <Sparkles className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                    {copy.toggle}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setResetRequested(false);
                      setResetCode('');
                      setPassword('');
                      setConfirmPassword('');
                      setError('');
                    }}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-klein-600 transition-colors hover:text-klein-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klein-500/60 dark:text-klein-400 dark:hover:text-klein-300"
                  >
                    <LogIn className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                    {copy.backToLogin}
                  </button>
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
