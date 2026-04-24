import { startTransition, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Clock,
  Film,
  Lock,
  Puzzle,
} from 'lucide-react';
import { LessonSidebar } from '../components/lesson/LessonSidebar';
import { useI18n } from '../contexts/I18nContext';
import { useUser } from '../contexts/UserContext';
import { getAdjacentTopics } from '../data/curriculum';
import { preloadAllExercises } from '../data/exercise-bank';
import { getExerciseSummariesByCategory } from '../data/exerciseSummaries';
import { loadLesson, preloadLessonChapter, type LessonContent } from '../data/lesson-content';
import {
  DifficultyPill,
  GlassCard,
  SectionHeader,
} from '../components/ui';

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
            <GlassCard variant="frosted" padding="lg" hoverable={false}>
              <div className="mb-4 flex gap-3">
                <div className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-700" />
                <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
              </div>
              <div className="h-10 w-2/3 rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="mt-6 h-4 w-48 rounded-full bg-slate-100 dark:bg-slate-700/70" />
            </GlassCard>

            {[0, 1].map((index) => (
              <GlassCard key={index} variant="frosted" padding="lg" hoverable={false}>
                <div className="mb-6 h-8 w-48 rounded-full bg-slate-200 dark:bg-slate-700" />
                <div className="space-y-3">
                  <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-slate-700/70" />
                  <div className="h-4 w-5/6 rounded-full bg-slate-100 dark:bg-slate-700/70" />
                  <div className="h-4 w-2/3 rounded-full bg-slate-100 dark:bg-slate-700/70" />
                </div>
              </GlassCard>
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
          <h1 className="mb-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">课程不存在</h1>
          <Link to="/book" className="text-klein-600 hover:underline dark:text-klein-400">
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
            {/* Breadcrumb bar */}
            <GlassCard
              variant="soft"
              padding="sm"
              hoverable={false}
              className="mb-6 sticky top-20 z-20"
            >
              <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                <Link
                  to="/book"
                  className="flex items-center gap-1 text-slate-600 transition-colors duration-200 hover:text-klein-600 dark:text-slate-300 dark:hover:text-klein-400"
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                  <span>教程</span>
                </Link>
                <span className="text-slate-300 dark:text-slate-600">/</span>
                <span className="text-klein-600 dark:text-klein-400">{lesson.category}</span>
                <span className="text-slate-300 dark:text-slate-600">/</span>
                <span className="truncate font-medium text-slate-900 dark:text-white">{lesson.title}</span>
              </div>
            </GlassCard>

            {/* Header */}
            <GlassCard variant="frosted" padding="lg" hoverable={false} className="mb-8">
              <div className="mb-4 flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center rounded-full border border-klein-200/60 bg-klein-50/60 px-2.5 py-1 text-xs font-semibold text-klein-700 dark:border-klein-800/50 dark:bg-klein-900/30 dark:text-klein-300">
                  {lesson.category}
                </span>
                {lesson.difficulty && <DifficultyPill level={lesson.difficulty} size="sm" />}
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/60 bg-slate-100/60 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700/50 dark:bg-slate-800/60 dark:text-slate-300">
                  <Clock className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                  {lesson.duration}
                </span>
                {completed && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/60 bg-emerald-50/60 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-900/30 dark:text-emerald-300">
                    <CircleDot className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                    已学习
                  </span>
                )}
              </div>
              <h1 className="mb-4 font-serif text-4xl font-medium tracking-tight leading-[1.1] text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                {lesson.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4">
                {lesson.demoLink && (
                  <Link
                    to={lesson.demoLink}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-klein-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-klein-700 hover:shadow-md"
                  >
                    <Film className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                    查看动画演示
                    <ChevronRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                  </Link>
                )}
                {!isLoggedIn && (
                  <Link
                    to="/auth"
                    className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors duration-200 hover:text-klein-600 dark:text-slate-400 dark:hover:text-klein-400"
                  >
                    <Lock className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                    登录以保存进度
                  </Link>
                )}
              </div>
            </GlassCard>

            {/* Body sections */}
            <div className="space-y-8">
              {lesson.sections.map((section, index) => (
                <GlassCard
                  key={section.title}
                  variant="frosted"
                  padding="lg"
                  hoverable={false}
                >
                  <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-700/60">
                    <span className="inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-full bg-klein-50/80 px-2 text-xs font-bold text-klein-700 ring-1 ring-inset ring-klein-200/60 dark:bg-klein-900/30 dark:text-klein-300 dark:ring-klein-800/50">
                      {index + 1}
                    </span>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                      {section.title}
                    </h2>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none">{section.content}</div>
                </GlassCard>
              ))}
            </div>

            {/* Prev / Next footer */}
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {prev ? (
                <Link to={prev.link} className="block group">
                  <GlassCard
                    variant="soft"
                    padding="md"
                    hoverable
                    className="flex h-full items-center gap-4"
                  >
                    <ChevronLeft
                      className="h-5 w-5 shrink-0 text-slate-400 transition-colors duration-200 group-hover:text-klein-600 dark:group-hover:text-klein-400"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 transition-colors duration-200 group-hover:text-klein-600 dark:text-slate-400 dark:group-hover:text-klein-400">
                        上一节
                      </div>
                      <div className="mt-1 truncate font-bold tracking-tight text-slate-900 transition-colors duration-200 group-hover:text-klein-700 dark:text-white dark:group-hover:text-klein-300">
                        {prev.name}
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link to={next.link} className="block group">
                  <GlassCard
                    variant="soft"
                    padding="md"
                    hoverable
                    className="flex h-full items-center gap-4 text-right"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 transition-colors duration-200 group-hover:text-klein-600 dark:text-slate-400 dark:group-hover:text-klein-400">
                        下一节
                      </div>
                      <div className="mt-1 truncate font-bold tracking-tight text-slate-900 transition-colors duration-200 group-hover:text-klein-700 dark:text-white dark:group-hover:text-klein-300">
                        {next.name}
                      </div>
                    </div>
                    <ChevronRight
                      className="h-5 w-5 shrink-0 text-slate-400 transition-colors duration-200 group-hover:text-klein-600 dark:group-hover:text-klein-400"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                  </GlassCard>
                </Link>
              ) : (
                <div />
              )}
            </div>

            {/* Related exercises */}
            {relatedExercises.length > 0 && (
              <section className="mt-16">
                <SectionHeader
                  align="left"
                  size="sm"
                  eyebrow={
                    <span className="inline-flex items-center gap-1.5">
                      <Puzzle className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                      相关练习
                    </span>
                  }
                  title={t('动手实践')}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  {relatedExercises.map((exercise) => (
                    <GlassCard
                      key={exercise.id}
                      as="button"
                      variant="soft"
                      padding="md"
                      hoverable
                      onClick={() => {
                        warmPracticeLibrary();
                        navigate('/practice');
                      }}
                      onMouseEnter={warmPracticeLibrary}
                      onFocus={warmPracticeLibrary}
                      className="group text-left flex flex-col"
                    >
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <DifficultyPill level="easy" size="sm" />
                        <span className="inline-flex items-center rounded-full bg-slate-100/80 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                          {t(exercise.type === 'coding' ? '编程题' : '填空题')}
                        </span>
                      </div>
                      <div className="font-semibold tracking-tight text-slate-900 transition-colors duration-200 group-hover:text-klein-700 dark:text-white dark:group-hover:text-klein-300">
                        {t(exercise.title)}
                      </div>
                      <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        {t(exercise.category)}
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
