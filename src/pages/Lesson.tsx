import { startTransition, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LessonSidebar } from '../components/lesson/LessonSidebar';
import { DemoLink, DifficultyBadge } from '../components/tutorials/TutorialPanel';
import { useI18n } from '../contexts/I18nContext';
import { useUser } from '../contexts/UserContext';
import { getAdjacentTopics } from '../data/curriculum';
import { preloadAllExercises } from '../data/exercise-bank';
import { getExerciseSummariesByCategory } from '../data/exerciseSummaries';
import { loadLesson, preloadLessonChapter, type LessonContent } from '../data/lesson-content';

function LessonLoadingShell({ currentLink, isSidebarOpen, onOpen, onClose }: {
  currentLink: string;
  isSidebarOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  return (
    <div className="page-safe-top min-h-screen transition-colors duration-300">
      <div className="mx-auto flex max-w-5xl min-w-0">
        <LessonSidebar
          currentLink={currentLink}
          isOpen={isSidebarOpen}
          onOpen={onOpen}
          onClose={onClose}
        />

        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div
            role="status"
            aria-live="polite"
            className="mx-auto max-w-3xl space-y-8"
          >
            <div className="mb-6 h-4 w-40 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
              <div className="mb-4 flex gap-3">
                <div className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-700" />
                <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
              </div>
              <div className="h-10 w-2/3 rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="mt-6 h-4 w-48 rounded-full bg-slate-100 dark:bg-slate-700/70" />
            </div>

            {[0, 1].map((index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8"
              >
                <div className="mb-6 h-8 w-48 rounded-full bg-slate-200 dark:bg-slate-700" />
                <div className="space-y-3">
                  <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-slate-700/70" />
                  <div className="h-4 w-5/6 rounded-full bg-slate-100 dark:bg-slate-700/70" />
                  <div className="h-4 w-2/3 rounded-full bg-slate-100 dark:bg-slate-700/70" />
                </div>
              </div>
            ))}

            <p className="text-sm text-slate-500 dark:text-slate-400">正在加载课程内容...</p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function Lesson() {
  const { '*': path } = useParams();
  const { recordLessonVisit, isLessonCompleted, isLoggedIn } = useUser();
  const { t } = useI18n();
  const currentPathKey = path ?? '';
  const currentLink = path ? `/book/${path}` : '';
  const [openSidebarPath, setOpenSidebarPath] = useState<string | null>(null);
  const [lesson, setLesson] = useState<LessonContent | null>(null);
  const [isLessonLoading, setIsLessonLoading] = useState(Boolean(path));
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    if (!path) {
      setLesson(null);
      setIsLessonLoading(false);
      return () => {
        cancelled = true;
      };
    }

    setIsLessonLoading(true);

    void loadLesson(path)
      .then((loadedLesson) => {
        if (cancelled) {
          return;
        }

        startTransition(() => {
          setLesson(loadedLesson);
          setIsLessonLoading(false);
        });
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        startTransition(() => {
          setLesson(null);
          setIsLessonLoading(false);
        });
      });

    return () => {
      cancelled = true;
    };
  }, [path]);

  useEffect(() => {
    if (path && lesson) {
      recordLessonVisit(path, lesson.title, lesson.category);
    }
  }, [lesson, path, recordLessonVisit]);

  const { prev, next } = getAdjacentTopics(currentLink);

  useEffect(() => {
    if (!lesson) {
      return;
    }

    const adjacentLessonLinks = [prev, next]
      .map((topic) => topic?.link)
      .filter((link): link is string => Boolean(link && link.startsWith('/book/')))
      .map((link) => link.replace('/book/', ''));

    adjacentLessonLinks.forEach((lessonPath) => {
      void preloadLessonChapter(lessonPath);
    });
  }, [lesson, next, prev]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);

  if (isLessonLoading) {
    return (
      <LessonLoadingShell
        currentLink={currentLink}
        isSidebarOpen={openSidebarPath === currentPathKey}
        onOpen={() => setOpenSidebarPath(currentPathKey)}
        onClose={() => setOpenSidebarPath(null)}
      />
    );
  }

  if (!lesson) {
    return (
      <div className="page-safe-top min-h-screen px-4 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-2xl font-bold text-slate-900">课程不存在</h1>
          <Link to="/book" className="text-indigo-600 hover:underline">
            返回教程目录
          </Link>
        </div>
      </div>
    );
  }

  const completed = path ? isLessonCompleted(path) : false;
  const isSidebarOpen = openSidebarPath === currentPathKey;
  const relatedExercises = getExerciseSummariesByCategory(lesson.category)
    .filter((exercise) => exercise.category === lesson.category && exercise.difficulty === 'easy')
    .slice(0, 3);
  const warmPracticeLibrary = () => {
    preloadAllExercises();
  };

  return (
    <div key={path} className="page-safe-top min-h-screen transition-colors duration-300">
      <div className="mx-auto flex max-w-5xl min-w-0">
        <LessonSidebar
          currentLink={currentLink}
          isOpen={isSidebarOpen}
          onOpen={() => setOpenSidebarPath(currentPathKey)}
          onClose={() => setOpenSidebarPath(null)}
        />

        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-2 text-sm text-slate-500 dark:text-slate-400">
              <Link to="/book" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                教程
              </Link>
              <span>/</span>
              <span className="text-indigo-600 dark:text-indigo-400">{lesson.category}</span>
              <span>/</span>
              <span className="font-medium text-slate-900 dark:text-white">{lesson.title}</span>
            </div>

            <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                  {lesson.category}
                </span>
                {lesson.difficulty && <DifficultyBadge level={lesson.difficulty} />}
                <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                  ⏱️ {lesson.duration}
                </span>
                {completed && (
                  <span className="flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:border-emerald-900/50 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <span>✓</span> 已学习
                  </span>
                )}
              </div>
              <h1 className="mb-4 text-3xl font-bold leading-tight text-slate-900 dark:text-white sm:text-4xl">
                {lesson.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                {lesson.demoLink && <DemoLink to={lesson.demoLink} text="查看动画演示" icon="🎬" />}
                {!isLoggedIn && (
                  <Link
                    to="/auth"
                    className="flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                  >
                    <span>🔒</span> 登录以保存进度
                  </Link>
                )}
              </div>
            </div>

            <div className="space-y-8">
              {lesson.sections.map((section, index) => (
                <div
                  key={section.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8"
                >
                  <h2 className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4 text-xl font-bold text-slate-800 dark:border-slate-700 dark:text-white">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white shadow-sm">
                      {index + 1}
                    </span>
                    {section.title}
                  </h2>
                  <div className="prose prose-slate max-w-none dark:prose-invert">{section.content}</div>
                </div>
              ))}
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {prev ? (
                <Link
                  to={prev.link}
                  className="group rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-500"
                >
                  <div className="mb-1 text-xs text-slate-500 transition-colors group-hover:text-indigo-600 dark:text-slate-400 dark:group-hover:text-indigo-400">
                    ← 上一节
                  </div>
                  <div className="font-bold text-slate-900 transition-colors group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-300">
                    {prev.name}
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link
                  to={next.link}
                  className="group rounded-xl border border-slate-200 bg-white p-4 text-right transition-all hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-500"
                >
                  <div className="mb-1 text-xs text-slate-500 transition-colors group-hover:text-indigo-600 dark:text-slate-400 dark:group-hover:text-indigo-400">
                    下一节 →
                  </div>
                  <div className="font-bold text-slate-900 transition-colors group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-300">
                    {next.name}
                  </div>
                </Link>
              ) : (
                <div />
              )}
            </div>

            {relatedExercises.length > 0 && (
              <div className="mt-12">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                  <span>📝</span> {t('课后练习')}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {relatedExercises.map((exercise) => (
                    <button
                      key={exercise.id}
                      type="button"
                      onClick={() => {
                        warmPracticeLibrary();
                        navigate('/practice');
                      }}
                      onMouseEnter={warmPracticeLibrary}
                      onFocus={warmPracticeLibrary}
                      className="group cursor-pointer rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-left transition-all hover:border-indigo-300 hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-indigo-900/50 dark:bg-indigo-900/20 dark:hover:border-indigo-500"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <span className="rounded bg-white px-2 py-1 text-xs font-bold text-indigo-600 dark:bg-slate-800 dark:text-indigo-400">
                          {t(exercise.type === 'coding' ? '编程题' : '填空题')}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{t('简单')}</span>
                      </div>
                      <div className="font-medium text-slate-900 group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-300">
                        {t(exercise.title)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
