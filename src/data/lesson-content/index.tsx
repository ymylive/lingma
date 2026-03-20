import type { LessonContent } from './types';
import { graphLessons } from './graph';
import { introLessons } from './intro';
import { linearLessons } from './linear';
import { searchLessons } from './search';
import { sortLessons } from './sort';
import { treeLessons } from './tree';

export type { LessonContent } from './types';

export const lessons: Record<string, LessonContent> = {
  ...introLessons,
  ...searchLessons,
  ...graphLessons,
  ...treeLessons,
  ...sortLessons,
  ...linearLessons,
};

