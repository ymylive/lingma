import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useI18n } from '../contexts/I18nContext';
import { useUser } from '../contexts/UserContext';
import { SKILL_LEVEL_META, type UserSkillLevel } from '../utils/userPersonalization';
import { TARGET_LANGUAGE_OPTIONS, type TargetLanguage } from '../utils/targetLanguages';

export default function Dashboard() {
  const { user, progress, isLoggedIn, logout, updatePreferences } = useUser();
  const { formatDate, isEnglish } = useI18n();
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

  if (!user) return null;

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
    <div className="min-h-screen bg-slate-50 pb-12 pt-20 transition-colors duration-300 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {greeting}, {user.username}
            </h1>
            <p className="mt-1 text-slate-600 dark:text-slate-400">{copy.subtitle}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/book"
              className="min-h-[44px] rounded-xl bg-klein-500 px-4 py-2 font-medium text-white transition-colors hover:bg-klein-600"
            >
              {copy.continueLearning}
            </Link>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="min-h-[44px] cursor-pointer px-4 py-2 text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              {copy.signOut}
            </button>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl dark:bg-slate-700/60">
                  {item.icon}
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{item.value}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{item.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-6 md:col-span-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{copy.recentLearning}</h2>
                <Link to="/book" className="text-sm text-klein-500 hover:text-klein-600 dark:text-klein-400 dark:hover:text-klein-300">
                  {copy.viewAll}
                </Link>
              </div>

              {recentLessons.length > 0 ? (
                <div className="space-y-3">
                  {recentLessons.map((record) => (
                    <Link
                      key={`${record.lessonId}-${record.completedAt}`}
                      to={`/book/${record.lessonId}`}
                      className="flex items-center justify-between rounded-lg bg-slate-50 p-3 transition-colors hover:bg-slate-100 dark:bg-slate-700/30 dark:hover:bg-slate-700/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-klein-100 text-sm font-medium text-klein-500 dark:bg-klein-900/30 dark:text-klein-300">
                          {record.category.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">{record.lessonTitle}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{record.category}</div>
                        </div>
                      </div>
                      <div className="text-xs text-slate-400 dark:text-slate-500">
                        {formatDate(record.completedAt, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <div className="mb-3 text-4xl">📚</div>
                  <p className="text-slate-500 dark:text-slate-400">{copy.noLessons}</p>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">{copy.preferences}</h2>
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <div className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">{copy.currentLevel}</div>
                  <div className="grid gap-2">
                    {Object.values(SKILL_LEVEL_META).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSkillLevel(item.id)}
                        className={`min-h-[44px] cursor-pointer rounded-xl border px-4 py-3 text-left text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klein-500/60 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
                          skillLevel === item.id
                            ? 'border-klein-500 bg-klein-50 text-klein-700 dark:border-klein-400 dark:bg-klein-900/20 dark:text-klein-200'
                            : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-200'
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
                        className={`min-h-[44px] cursor-pointer rounded-xl border px-4 py-3 text-left text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
                          targetLanguage === item.id
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-900/20 dark:text-emerald-200'
                            : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-200'
                        }`}
                      >
                        <div className="font-semibold">{item.label}</div>
                        <div className="mt-1 text-xs opacity-80">{isEnglish ? item.descriptionEn : item.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="min-h-[44px] cursor-pointer rounded-xl bg-klein-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-klein-600 disabled:opacity-60"
                >
                  {copy.save}
                </button>
                {saveMessage && <div className="text-sm text-emerald-600 dark:text-emerald-400">{saveMessage}</div>}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl bg-gradient-to-br from-klein-500 to-klein-600 p-6 text-white shadow-lg shadow-klein-500/20">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-2xl">
                  👤
                </div>
                <div>
                  <div className="text-lg font-bold">{user.username}</div>
                  <div className="text-sm text-klein-200">{user.email}</div>
                </div>
              </div>
              <div className="text-sm text-klein-100">
                {copy.joinedOn} {formatDate(user.createdAt, { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-4 font-bold text-slate-900 dark:text-white">{copy.quickLinks}</h3>
              <div className="space-y-2">
                <Link to="/algorithms" className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <span className="text-xl">🎬</span>
                  <span className="text-slate-700 dark:text-slate-300">{copy.algorithms}</span>
                </Link>
                <Link to="/practice" className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <span className="text-xl">🤖</span>
                  <span className="text-slate-700 dark:text-slate-300">{copy.aiPractice}</span>
                </Link>
                <Link to="/book" className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <span className="text-xl">📚</span>
                  <span className="text-slate-700 dark:text-slate-300">{copy.tutorials}</span>
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-4 font-bold text-slate-900 dark:text-white">{copy.practiceHistory}</h3>
              {recentExercises.length > 0 ? (
                <div className="space-y-2">
                  {recentExercises.map((record) => (
                    <div
                      key={`${record.exerciseId}-${record.completedAt}`}
                      className="flex items-center justify-between rounded-lg bg-slate-50 p-2 dark:bg-slate-700/30"
                    >
                      <div className="flex items-center gap-2">
                        <span className={record.isCorrect ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}>
                          {record.isCorrect ? '✅' : '❌'}
                        </span>
                        <span className="max-w-[140px] truncate text-sm text-slate-700 dark:text-slate-300">
                          {record.exerciseTitle}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        {formatDate(record.completedAt, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-4 text-center text-sm text-slate-500 dark:text-slate-400">{copy.noExercises}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
