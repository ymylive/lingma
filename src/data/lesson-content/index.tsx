import type { LessonContent } from './types';

type LessonModule = Record<string, LessonContent>;
type LessonChapter = 'intro' | 'search' | 'graph' | 'tree' | 'sort' | 'linear';

const chapterLoaders: Record<LessonChapter, () => Promise<LessonModule>> = {
  intro: async () => (await import('./intro')).introLessons,
  search: async () => (await import('./search')).searchLessons,
  graph: async () => (await import('./graph')).graphLessons,
  tree: async () => (await import('./tree')).treeLessons,
  sort: async () => (await import('./sort')).sortLessons,
  linear: async () => (await import('./linear')).linearLessons,
};

const chapterModuleCache = new Map<LessonChapter, Promise<LessonModule>>();

function resolveLessonChapter(path: string): LessonChapter | null {
  const prefix = path.split('/')[0];
  return prefix in chapterLoaders ? (prefix as LessonChapter) : null;
}

async function loadChapterLessons(chapter: LessonChapter): Promise<LessonModule> {
  const cached = chapterModuleCache.get(chapter);
  if (cached) {
    return cached;
  }

  const pending = chapterLoaders[chapter]();
  chapterModuleCache.set(chapter, pending);
  return pending;
}

export async function loadLesson(path: string): Promise<LessonContent | null> {
  const chapter = resolveLessonChapter(path);
  if (!chapter) {
    return null;
  }

  const lessons = await loadChapterLessons(chapter);
  return lessons[path] ?? null;
}

export async function preloadLessonChapter(path: string): Promise<void> {
  const chapter = resolveLessonChapter(path);
  if (!chapter) {
    return;
  }

  await loadChapterLessons(chapter);
}

export type { LessonContent } from './types';
