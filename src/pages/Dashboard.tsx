import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useI18n } from '../contexts/I18nContext';
import { useUser } from '../contexts/UserContext';
import { SKILL_LEVEL_META, type UserSkillLevel } from '../utils/userPersonalization';
import { TARGET_LANGUAGE_OPTIONS, type TargetLanguage } from '../utils/targetLanguages';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/Card';
import { Container } from '../components/Container';
import { Grid, GridItem } from '../components/Grid';


export default function Dashboard() {
  const { user, progress, isLoggedIn, logout, updatePreferences } = useUser();
  const { formatDate, isEnglish, t } = useI18n();
  const navigate = useNavigate();
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

  const stats = [
    { label: isEnglish ? 'Lessons Done' : '已完成课程', value: progress.completedLessons.length, icon: '📚' },
    { label: isEnglish ? 'Exercises Done' : '已完成练习', value: progress.completedExercises.length, icon: '✅' },
    { label: isEnglish ? 'Learning Streak' : '连续学习', value: `${progress.streak} ${isEnglish ? 'days' : '天'}`, icon: '🔥' },
    { label: isEnglish ? 'History' : '学习记录', value: progress.learningHistory.length, icon: '📝' },
  ];

  const recentExercises = progress.exerciseHistory.slice(0, 3);
  const recentLessons = progress.learningHistory.slice(0, 5);

  const copy = useMemo(() => ({
    subtitle: isEnglish ? 'Keep building your learning momentum.' : '继续保持你的学习节奏。',
    continueLearning: isEnglish ? 'Continue Learning' : '继续学习',
    signOut: isEnglish ? 'Sign Out' : '退出登录',
    recentLearning: isEnglish ? 'Recent Learning' : '最近学习',
    viewAll: isEnglish ? 'View all' : '查看全部',
    noLessons: isEnglish ? 'No learning history yet.' : '还没有学习记录。',
    quickLinks: isEnglish ? 'Quick Links' : '快捷入口',
    practiceHistory: isEnglish ? 'Exercise History' : '练习记录',
    noExercises: isEnglish ? 'No exercise history yet.' : '还没有练习记录。',
    preferences: isEnglish ? 'Personalized Settings' : '个性化设置',
    currentLevel: isEnglish ? 'Current level' : '当前水平',
    targetLanguage: isEnglish ? 'Primary language' : '主学语言',
    save: saving ? (isEnglish ? 'Saving...' : '保存中...') : (isEnglish ? 'Save Preferences' : '保存偏好'),
    saveSuccess: isEnglish ? 'Preferences updated.' : '偏好已更新。',
    joinedOn: isEnglish ? 'Joined on' : '注册于',
    dashboard: isEnglish ? 'Dashboard' : '学习中心',
    algorithms: isEnglish ? 'Algorithms' : '算法演示',
    aiPractice: isEnglish ? 'AI Practice' : 'AI练习',
    tutorials: isEnglish ? 'Tutorials' : '教程文档',
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

  return (
    <div className="page-safe-top min-h-screen pb-12 transition-colors duration-300">
      <Container size="lg" className="!max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              {greeting}, {user.username}
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 sm:text-base">{copy.subtitle}</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end sm:gap-4">
            <Link
              to="/book"
              className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl bg-klein-500 px-5 py-2.5 font-medium text-white transition-all hover:bg-klein-600 hover:shadow-lg hover:shadow-klein-500/30 sm:w-auto"
            >
              {copy.continueLearning}
            </Link>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl px-5 py-2.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white sm:w-auto"
            >
              {copy.signOut}
            </button>
          </div>
        </motion.div>

        <Grid cols={{ default: 1, sm: 2, xl: 4 }} gap="md" className="mb-8">
          {stats.map((item, index) => (
            <GridItem key={item.label} delay={index * 0.1}>
              <Card variant="default" hover padding="md">
                <div className="flex items-start gap-3 sm:items-center">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-klein-100 to-klein-50 text-2xl dark:from-klein-900/30 dark:to-klein-800/20">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">{item.value}</div>
                    <div className="truncate text-sm leading-5 text-slate-500 dark:text-slate-400">{item.label}</div>
                  </div>
                </div>
              </Card>
            </GridItem>
          ))}
        </Grid>

        <div className="grid gap-8 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6 lg:col-span-2"
          >
            <Card variant="default" padding="md">
              <CardHeader>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle>{copy.recentLearning}</CardTitle>
                  <Link to="/book" className="inline-flex min-h-[44px] items-center self-start text-sm font-medium text-klein-500 transition-colors hover:text-klein-600 dark:text-klein-400 dark:hover:text-klein-300">
                    {copy.viewAll} →
                  </Link>
                </div>
              </CardHeader>

              <CardContent>
                {recentLessons.length > 0 ? (
                  <div className="space-y-2">
                    {recentLessons.map((record, index) => (
                      <motion.div
                        key={`${record.lessonId}-${record.completedAt}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          to={`/book/${record.lessonId}`}
                          className="flex flex-col gap-3 rounded-xl bg-slate-50 p-3 transition-all hover:bg-slate-100 hover:shadow-sm dark:bg-slate-700/30 dark:hover:bg-slate-700/50 sm:flex-row sm:items-center sm:justify-between sm:p-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-klein-100 to-klein-50 text-sm font-semibold text-klein-600 dark:from-klein-900/30 dark:to-klein-800/20 dark:text-klein-300">
                              {record.category.slice(0, 2)}
                            </div>
                            <div className="min-w-0">
                              <div className="truncate font-medium text-slate-900 dark:text-white">{record.lessonTitle}</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">{record.category}</div>
                            </div>
                          </div>
                          <div className="self-end text-xs text-slate-400 dark:text-slate-500 sm:self-auto sm:text-right">
                            {formatDate(record.completedAt, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <div className="mb-3 text-5xl">📚</div>
                    <p className="text-slate-500 dark:text-slate-400">{copy.noLessons}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card variant="default" padding="md">
              <CardHeader>
                <CardTitle>{copy.preferences}</CardTitle>
                <CardDescription className="mt-1">调整你的学习偏好设置</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <div className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">{copy.currentLevel}</div>
                    <div className="grid gap-2">
                      {Object.values(SKILL_LEVEL_META).map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSkillLevel(item.id)}
                          className={`min-h-[44px] cursor-pointer rounded-xl border px-4 py-3 text-left text-sm transition-all hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klein-500/60 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
                            skillLevel === item.id
                              ? 'border-klein-500 bg-klein-50 text-klein-700 shadow-sm dark:border-klein-400 dark:bg-klein-900/20 dark:text-klein-200'
                              : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-200 dark:hover:border-slate-600'
                          }`}
                        >
                          <div className="font-semibold">{item.label}</div>
                          <div className="mt-1 text-xs opacity-80">{item.recommendedTrack}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">{copy.targetLanguage}</div>
                    <div className="grid gap-2">
                      {TARGET_LANGUAGE_OPTIONS.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setTargetLanguage(item.id)}
                          className={`min-h-[44px] cursor-pointer rounded-xl border px-4 py-3 text-left text-sm transition-all hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
                            targetLanguage === item.id
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm dark:border-emerald-400 dark:bg-emerald-900/20 dark:text-emerald-200'
                              : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-200 dark:hover:border-slate-600'
                          }`}
                        >
                          <div className="font-semibold">{item.label}</div>
                          <div className="mt-1 text-xs opacity-80">{isEnglish ? item.descriptionEn : item.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="min-h-[44px] cursor-pointer rounded-xl bg-klein-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-klein-600 hover:shadow-lg hover:shadow-klein-500/30 disabled:opacity-60 disabled:hover:shadow-none"
                  >
                    {copy.save}
                  </button>
                  {saveMessage && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-sm font-medium text-emerald-600 dark:text-emerald-400"
                    >
                      ✓ {saveMessage}
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="space-y-6"
          >
            <Card variant="elevated" padding="none" className="overflow-hidden bg-gradient-to-br from-klein-500 to-klein-600 text-white shadow-xl shadow-klein-500/20">
              <div className="p-5 sm:p-6">
                <div className="mb-4 flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/20 text-2xl backdrop-blur-sm">
                    👤
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-lg font-bold">{user.username}</div>
                    <div className="break-all text-sm text-klein-100">{user.email}</div>
                  </div>
                </div>
                <div className="text-sm text-klein-100">
                  {copy.joinedOn} {formatDate(user.createdAt, { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
              </div>
            </Card>

            <Card variant="default" padding="md">
              <CardHeader>
                <CardTitle className="text-base">{copy.quickLinks}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <Link to="/algorithms" className="flex min-h-[44px] items-center gap-3 rounded-xl p-3 transition-all hover:bg-slate-50 hover:shadow-sm dark:hover:bg-slate-700/50">
                    <span className="text-xl">🎬</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{copy.algorithms}</span>
                  </Link>
                  <Link to="/practice" className="flex min-h-[44px] items-center gap-3 rounded-xl p-3 transition-all hover:bg-slate-50 hover:shadow-sm dark:hover:bg-slate-700/50">
                    <span className="text-xl">🤖</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{copy.aiPractice}</span>
                  </Link>
                  <Link to="/book" className="flex min-h-[44px] items-center gap-3 rounded-xl p-3 transition-all hover:bg-slate-50 hover:shadow-sm dark:hover:bg-slate-700/50">
                    <span className="text-xl">📚</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{copy.tutorials}</span>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card variant="default" padding="md">
              <CardHeader>
                <CardTitle className="text-base">{copy.practiceHistory}</CardTitle>
              </CardHeader>
              <CardContent>
                {recentExercises.length > 0 ? (
                  <div className="space-y-2">
                    {recentExercises.map((record, index) => (
                      <motion.div
                        key={`${record.exerciseId}-${record.completedAt}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 p-3 transition-all hover:bg-slate-100 dark:bg-slate-700/30 dark:hover:bg-slate-700/50"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <span className={`text-lg ${record.isCorrect ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
                            {record.isCorrect ? '✅' : '❌'}
                          </span>
                          <span className="truncate text-sm font-medium text-slate-700 dark:text-slate-300">
                            {t(record.exerciseTitle)}
                          </span>
                        </div>
                        <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">
                          {formatDate(record.completedAt, { month: 'short', day: 'numeric' })}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <div className="mb-2 text-4xl">📝</div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{copy.noExercises}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}
