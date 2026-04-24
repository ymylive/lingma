import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity,
  Award,
  BookMarked,
  BookOpen,
  CheckCircle2,
  Code2,
  Flame,
  LayoutDashboard,
  LogOut,
  Sparkles,
  Target,
  TrendingUp,
  User as UserIcon,
  Wand2,
  XCircle,
} from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';
import { useUser } from '../contexts/UserContext';
import { SKILL_LEVEL_META, type UserSkillLevel } from '../utils/userPersonalization';
import { TARGET_LANGUAGE_OPTIONS, type TargetLanguage } from '../utils/targetLanguages';
import useLowMotionMode from '../hooks/useLowMotionMode';
import {
  Button,
  GlassCard,
  PageHero,
  SectionHeader,
  StatStrip,
} from '../components/ui';

export default function Dashboard() {
  const { user, progress, isLoggedIn, logout, updatePreferences } = useUser();
  const { formatDate, isEnglish, t } = useI18n();
  const navigate = useNavigate();
  const lowMotionMode = useLowMotionMode();
  const [skillLevel, setSkillLevel] = useState<UserSkillLevel>('beginner');
  const [targetLanguage, setTargetLanguage] = useState<TargetLanguage>('cpp');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/auth');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (!user) return;
    setSkillLevel(user.skillLevel);
    setTargetLanguage(user.targetLanguage);
  }, [user]);

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return isEnglish ? 'Good morning' : '早上好';
    if (hour < 18) return isEnglish ? 'Good afternoon' : '下午好';
    return isEnglish ? 'Good evening' : '晚上好';
  })();

  const recentExercises = progress.exerciseHistory.slice(0, 3);
  const recentLessons = progress.learningHistory.slice(0, 5);

  const copy = useMemo(() => ({
    subtitle: isEnglish ? 'Your learning momentum at a glance.' : '学习进展总览。',
    continueLearning: isEnglish ? 'Continue Learning' : '继续学习',
    signOut: isEnglish ? 'Sign Out' : '退出登录',
    recentLearning: isEnglish ? 'Recent Learning' : '最近学习',
    viewAll: isEnglish ? 'View all' : '查看全部',
    noLessons: isEnglish ? 'No learning history yet.' : '还没有学习记录。',
    quickLinks: isEnglish ? 'Quick Links' : '快捷入口',
    practiceHistory: isEnglish ? 'Exercise History' : '练习记录',
    noExercises: isEnglish ? 'No exercise history yet.' : '还没有练习记录。',
    preferences: isEnglish ? 'Personalized Settings' : '个性化设置',
    preferencesDesc: isEnglish ? 'Tune the experience to match your level and language.' : '根据你的水平和语言调整个性化设置。',
    currentLevel: isEnglish ? 'Current level' : '当前水平',
    targetLanguage: isEnglish ? 'Primary language' : '主学语言',
    save: saving ? (isEnglish ? 'Saving...' : '保存中...') : (isEnglish ? 'Save Preferences' : '保存偏好'),
    saveSuccess: isEnglish ? 'Preferences updated.' : '偏好已更新。',
    joinedOn: isEnglish ? 'Joined on' : '注册于',
    algorithms: isEnglish ? 'Algorithms' : '算法演示',
    aiPractice: isEnglish ? 'AI Practice' : 'AI练习',
    tutorials: isEnglish ? 'Tutorials' : '教程文档',
    statLessons: isEnglish ? 'Lessons Done' : '已完成课程',
    statExercises: isEnglish ? 'Exercises Done' : '已完成练习',
    statStreak: isEnglish ? 'Learning Streak' : '连续学习',
    statHistory: isEnglish ? 'History' : '学习记录',
    days: isEnglish ? 'days' : '天',
  }), [isEnglish, saving]);

  if (!user) return null;

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage('');
    try {
      const ok = await updatePreferences({ skillLevel, targetLanguage });
      setSaveMessage(ok ? copy.saveSuccess : '');
    } finally {
      setSaving(false);
    }
  };

  const revealUp = lowMotionMode
    ? {
        initial: false as const,
        whileInView: { opacity: 1 },
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0 },
      }
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0.45, ease: 'easeOut' as const },
      };

  const quickLinks = [
    { to: '/algorithms', label: copy.algorithms, icon: LayoutDashboard },
    { to: '/practice', label: copy.aiPractice, icon: Wand2 },
    { to: '/book', label: copy.tutorials, icon: BookOpen },
  ];

  return (
    <div className="min-h-screen pb-12">
      <PageHero
        marker={{ num: '05', label: isEnglish ? 'DASHBOARD · HOME' : '学习中心' }}
        title={
          <>
            {greeting}
            <span className="text-slate-500 dark:text-slate-400">,</span>{' '}
            <em className="italic font-normal text-klein-600 dark:text-pine-400">{user.username}</em>
          </>
        }
        description={copy.subtitle}
        primaryAction={{
          label: copy.continueLearning,
          to: '/book',
          icon: <BookOpen className="h-5 w-5" strokeWidth={1.75} aria-hidden />,
        }}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Stat strip */}
        <motion.section {...revealUp} className="relative z-10 mb-24 sm:mb-32">
          <StatStrip
            items={[
              { value: progress.completedLessons.length, label: copy.statLessons, tone: 'klein', icon: <BookMarked className="h-5 w-5" strokeWidth={1.75} aria-hidden /> },
              { value: progress.completedExercises.length, label: copy.statExercises, tone: 'emerald', icon: <CheckCircle2 className="h-5 w-5" strokeWidth={1.75} aria-hidden /> },
              { value: `${progress.streak} ${copy.days}`, label: copy.statStreak, tone: 'amber', icon: <Flame className="h-5 w-5" strokeWidth={1.75} aria-hidden /> },
              { value: progress.learningHistory.length, label: copy.statHistory, tone: 'indigo', icon: <Activity className="h-5 w-5" strokeWidth={1.75} aria-hidden /> },
            ]}
          />
        </motion.section>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column: Recent Learning + Preferences */}
          <motion.div {...revealUp} className="space-y-6 lg:col-span-2">
            {/* Recent Learning */}
            <GlassCard variant="soft" padding="md" hoverable={false}>
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="section-label mb-2">{isEnglish ? 'Progress' : '进度'}</div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                    {copy.recentLearning}
                  </h2>
                </div>
                <Link
                  to="/book"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-klein-600 transition-colors hover:text-klein-700 dark:text-klein-400 dark:hover:text-klein-300"
                >
                  {copy.viewAll}
                  <span aria-hidden>→</span>
                </Link>
              </div>

              {recentLessons.length > 0 ? (
                <ul className="space-y-2">
                  {recentLessons.map((record, index) => (
                    <motion.li
                      key={`${record.lessonId}-${record.completedAt}`}
                      initial={lowMotionMode ? false : { opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: lowMotionMode ? 0 : index * 0.06, duration: lowMotionMode ? 0 : 0.3 }}
                    >
                      <Link
                        to={`/book/${record.lessonId}`}
                        className="group flex flex-col gap-3 rounded-xl border border-slate-200/60 bg-white/50 p-3 transition-all duration-200 hover:shadow-md dark:border-slate-700/50 dark:bg-slate-900/50 sm:flex-row sm:items-center sm:justify-between sm:p-4"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-klein-200/60 bg-klein-50/70 text-sm font-semibold text-klein-600 dark:border-klein-800/50 dark:bg-klein-950/40 dark:text-klein-300">
                            {record.category.slice(0, 2)}
                          </span>
                          <div className="min-w-0">
                            <div className="truncate font-medium text-slate-900 transition-colors group-hover:text-klein-600 dark:text-white dark:group-hover:text-klein-400">
                              {record.lessonTitle}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{record.category}</div>
                          </div>
                        </div>
                        <div className="self-end text-xs text-slate-400 dark:text-slate-500 sm:self-auto sm:text-right">
                          {formatDate(record.completedAt, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center gap-3 py-10 text-center">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200/60 bg-slate-50/80 text-slate-400 dark:border-slate-700/50 dark:bg-slate-900/40 dark:text-slate-500">
                    <BookOpen className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                  </span>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{copy.noLessons}</p>
                </div>
              )}
            </GlassCard>

            {/* Preferences */}
            <GlassCard variant="soft" padding="md" hoverable={false}>
              <SectionHeader
                align="left"
                size="sm"
                eyebrow={isEnglish ? 'Preferences' : '偏好'}
                title={copy.preferences}
                description={copy.preferencesDesc}
                className="!mb-8"
              />

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Skill level */}
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <TrendingUp className="h-4 w-4 text-klein-500 dark:text-klein-400" strokeWidth={1.75} aria-hidden />
                    {copy.currentLevel}
                  </div>
                  <div className="grid gap-2">
                    {Object.values(SKILL_LEVEL_META).map((item) => {
                      const active = skillLevel === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSkillLevel(item.id)}
                          aria-pressed={active}
                          className={`min-h-[44px] cursor-pointer rounded-xl border px-4 py-3 text-left text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klein-500/60 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
                            active
                              ? 'border-klein-500 bg-klein-50/80 text-klein-700 shadow-sm dark:border-klein-400 dark:bg-klein-900/30 dark:text-klein-200'
                              : 'border-slate-200/60 bg-white/60 text-slate-700 hover:border-klein-300 hover:shadow-md dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:hover:border-klein-500/40'
                          }`}
                        >
                          <div className="font-semibold">{item.label}</div>
                          <div className="mt-1 text-xs opacity-80">{item.recommendedTrack}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Target language */}
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Code2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400" strokeWidth={1.75} aria-hidden />
                    {copy.targetLanguage}
                  </div>
                  <div className="grid gap-2">
                    {TARGET_LANGUAGE_OPTIONS.map((item) => {
                      const active = targetLanguage === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setTargetLanguage(item.id)}
                          aria-pressed={active}
                          className={`min-h-[44px] cursor-pointer rounded-xl border px-4 py-3 text-left text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
                            active
                              ? 'border-emerald-500 bg-emerald-50/80 text-emerald-700 shadow-sm dark:border-emerald-400 dark:bg-emerald-900/30 dark:text-emerald-200'
                              : 'border-slate-200/60 bg-white/60 text-slate-700 hover:border-emerald-300 hover:shadow-md dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-200 dark:hover:border-emerald-500/40'
                          }`}
                        >
                          <div className="font-semibold">{item.label}</div>
                          <div className="mt-1 text-xs opacity-80">{isEnglish ? item.descriptionEn : item.description}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSave}
                  disabled={saving}
                  loading={saving}
                  icon={<Sparkles className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
                >
                  {copy.save}
                </Button>
                {saveMessage && (
                  <motion.div
                    initial={lowMotionMode ? false : { opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400"
                  >
                    <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                    {saveMessage}
                  </motion.div>
                )}
              </div>
            </GlassCard>
          </motion.div>

          {/* Right column: Profile + Quick Links + Exercise History */}
          <motion.div {...revealUp} className="space-y-6">
            {/* Profile card (klein CTA tone) */}
            <GlassCard
              variant="solid"
              padding="none"
              hoverable={false}
              className="overflow-hidden border-klein-700/60 bg-gradient-to-br from-klein-500 via-klein-600 to-klein-700 text-white shadow-lg shadow-klein-600/20 dark:border-klein-700/60"
            >
              <div className="p-5 sm:p-6">
                <div className="mb-4 flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/30 bg-white/15 text-white backdrop-blur-sm">
                    <UserIcon className="h-7 w-7" strokeWidth={1.75} aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-lg font-bold">{user.username}</div>
                    <div className="break-all text-sm text-white/80">{user.email}</div>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 text-sm text-white/80">
                  <Award className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                  {copy.joinedOn} {formatDate(user.createdAt, { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="mt-5 inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  <LogOut className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                  {copy.signOut}
                </button>
              </div>
            </GlassCard>

            {/* Quick Links */}
            <GlassCard variant="soft" padding="md" hoverable={false}>
              <div className="mb-4 inline-flex items-center gap-2 text-base font-bold tracking-tight text-slate-900 dark:text-white">
                <Target className="h-4 w-4 text-klein-500 dark:text-klein-400" strokeWidth={1.75} aria-hidden />
                {copy.quickLinks}
              </div>
              <div className="space-y-1">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="group flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 transition-all duration-200 hover:bg-white/70 hover:shadow-sm dark:hover:bg-slate-800/60"
                    >
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200/60 bg-white/60 text-slate-500 transition-colors group-hover:border-klein-300 group-hover:text-klein-600 dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-400 dark:group-hover:text-klein-400">
                        <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                      </span>
                      <span className="font-medium text-slate-700 transition-colors group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-white">
                        {link.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </GlassCard>

            {/* Exercise History */}
            <GlassCard variant="soft" padding="md" hoverable={false}>
              <div className="mb-4 inline-flex items-center gap-2 text-base font-bold tracking-tight text-slate-900 dark:text-white">
                <Activity className="h-4 w-4 text-amber-500 dark:text-amber-400" strokeWidth={1.75} aria-hidden />
                {copy.practiceHistory}
              </div>
              {recentExercises.length > 0 ? (
                <ul className="space-y-2">
                  {recentExercises.map((record, index) => (
                    <motion.li
                      key={`${record.exerciseId}-${record.completedAt}`}
                      initial={lowMotionMode ? false : { opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: lowMotionMode ? 0 : index * 0.06, duration: lowMotionMode ? 0 : 0.3 }}
                      className="flex items-start justify-between gap-3 rounded-xl border border-slate-200/60 bg-white/50 p-3 transition-all duration-200 hover:shadow-sm dark:border-slate-700/50 dark:bg-slate-900/50"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        {record.isCorrect ? (
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500 dark:text-emerald-400" strokeWidth={1.75} aria-hidden />
                        ) : (
                          <XCircle className="h-5 w-5 shrink-0 text-rose-500 dark:text-rose-400" strokeWidth={1.75} aria-hidden />
                        )}
                        <span className="truncate text-sm font-medium text-slate-700 dark:text-slate-300">
                          {t(record.exerciseTitle)}
                        </span>
                      </div>
                      <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">
                        {formatDate(record.completedAt, { month: 'short', day: 'numeric' })}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/60 bg-slate-50/80 text-slate-400 dark:border-slate-700/50 dark:bg-slate-900/40 dark:text-slate-500">
                    <Activity className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{copy.noExercises}</p>
                </div>
              )}
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
