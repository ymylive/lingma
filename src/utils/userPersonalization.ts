import type { Exercise, ExerciseDifficulty } from '../data/exercises';
import { sortExercisesForPractice } from './practiceProgression';
import { localizeRuntimeText, pickRuntimeText } from './runtimeLocale';

export type UserSkillLevel = 'beginner' | 'foundation' | 'intermediate' | 'advanced';
export type LearningState = 'onboarding' | 'review' | 'steady' | 'challenge';

export interface ExerciseHistorySnapshot {
  exerciseId: string;
  exerciseTitle: string;
  category: string;
  completedAt: string;
  score: number;
  isCorrect: boolean;
  verdict?: string;
}

export interface UserProgressSnapshot {
  completedExercises: string[];
  exerciseHistory: ExerciseHistorySnapshot[];
  skillLevel?: UserSkillLevel;
}

export interface SkillLevelMeta {
  id: UserSkillLevel;
  label: string;
  shortLabel: string;
  description: string;
  defaultDifficulty: ExerciseDifficulty;
  recommendedTrack: string;
  practiceCategories: string[];
  aiCategories: string[];
  aiMessage: string;
}

export interface DailyRecommendation {
  dateKey: string;
  exercise: Exercise | null;
  declaredLevel: UserSkillLevel;
  effectiveLevel: UserSkillLevel;
  learningState: LearningState;
  recommendedDifficulty: ExerciseDifficulty;
  recommendedTrack: string;
  reason: string;
  focusCategory: string;
  ctaLabel: string;
}

interface LocalizedPair {
  zh: string;
  en: string;
}

interface SkillLevelMetaDefinition {
  id: UserSkillLevel;
  label: LocalizedPair;
  shortLabel: LocalizedPair;
  description: LocalizedPair;
  defaultDifficulty: ExerciseDifficulty;
  recommendedTrack: LocalizedPair;
  practiceCategories: string[];
  aiCategories: string[];
  aiMessage: LocalizedPair;
}

const SKILL_LEVEL_ORDER: UserSkillLevel[] = ['beginner', 'foundation', 'intermediate', 'advanced'];

function localText(zh: string, en: string): LocalizedPair {
  return { zh, en };
}

function resolveLocalized(pair: LocalizedPair): string {
  return pickRuntimeText(pair.zh, pair.en);
}

function createSkillLevelMeta(definition: SkillLevelMetaDefinition): SkillLevelMeta {
  return {
    id: definition.id,
    get label() {
      return resolveLocalized(definition.label);
    },
    get shortLabel() {
      return resolveLocalized(definition.shortLabel);
    },
    get description() {
      return resolveLocalized(definition.description);
    },
    defaultDifficulty: definition.defaultDifficulty,
    get recommendedTrack() {
      return resolveLocalized(definition.recommendedTrack);
    },
    practiceCategories: definition.practiceCategories,
    aiCategories: definition.aiCategories,
    get aiMessage() {
      return resolveLocalized(definition.aiMessage);
    },
  } as SkillLevelMeta;
}

const SKILL_LEVEL_META_DEFINITIONS: Record<UserSkillLevel, SkillLevelMetaDefinition> = {
  beginner: {
    id: 'beginner',
    label: localText('入门起步', 'Beginner Start'),
    shortLabel: localText('入门', 'Beginner'),
    description: localText(
      '刚开始刷题，先打稳输入输出、基础编程和简单数据结构。',
      'You are just getting started. Focus on input/output, basic programming, and simple data structures first.',
    ),
    defaultDifficulty: 'easy',
    recommendedTrack: localText('基础编程 -> 数组 -> 链表', 'Fundamentals -> Arrays -> Linked Lists'),
    practiceCategories: ['基础编程', '基础概念', '数组', '链表', '填空题'],
    aiCategories: ['c-basic', '链表', '查找'],
    aiMessage: localText(
      '优先生成基础操作、清晰样例和低门槛实现题。',
      'Prefer foundational operations, clear examples, and low-barrier implementation tasks.',
    ),
  },
  foundation: {
    id: 'foundation',
    label: localText('基础巩固', 'Foundation Builder'),
    shortLabel: localText('巩固', 'Foundation'),
    description: localText(
      '已经能做基础题，继续扩大到链表、栈队列和排序查找。',
      'You can already solve basic problems. Expand into linked lists, stacks, queues, sorting, and searching.',
    ),
    defaultDifficulty: 'easy',
    recommendedTrack: localText('数组 -> 链表 -> 栈/队列', 'Arrays -> Linked Lists -> Stack/Queue'),
    practiceCategories: ['数组', '链表', '栈', '队列', '排序', '查找'],
    aiCategories: ['链表', '栈', '队列', '排序'],
    aiMessage: localText(
      '生成简单到中等过渡题，强调模板熟练度和常见边界。',
      'Generate easy-to-medium transition problems that emphasize template fluency and common edge cases.',
    ),
  },
  intermediate: {
    id: 'intermediate',
    label: localText('进阶刷题', 'Intermediate Track'),
    shortLabel: localText('进阶', 'Intermediate'),
    description: localText(
      '开始主刷典型算法题，重点练中等难度和专题技巧。',
      'Start working through classic algorithm problems with a focus on medium difficulty and topic-specific techniques.',
    ),
    defaultDifficulty: 'medium',
    recommendedTrack: localText('哈希表 -> 双指针 -> 二叉树', 'Hash Table -> Two Pointers -> Binary Tree'),
    practiceCategories: ['哈希表', '双指针', '字符串', '二叉树', '滑动窗口', '回溯'],
    aiCategories: ['二叉树', '递归', '查找', '贪心'],
    aiMessage: localText(
      '生成中等难度专题题，要求用户独立完成算法设计。',
      'Generate medium-difficulty topical problems that require the learner to design the algorithm independently.',
    ),
  },
  advanced: {
    id: 'advanced',
    label: localText('冲刺提升', 'Advanced Sprint'),
    shortLabel: localText('冲刺', 'Advanced'),
    description: localText(
      '已有较强刷题基础，优先挑战综合题、优化题和考试重点。',
      'You already have solid foundations. Prioritize composite problems, optimization tasks, and exam-focused practice.',
    ),
    defaultDifficulty: 'hard',
    recommendedTrack: localText('动态规划 -> 图 -> 设计', 'Dynamic Programming -> Graph -> Design'),
    practiceCategories: ['动态规划', '图', '设计', '并查集', '单调栈', '区间'],
    aiCategories: ['动态规划', '图', '贪心', '递归'],
    aiMessage: localText(
      '生成中高阶题，突出复杂度优化、状态设计和综合应用。',
      'Generate medium-to-advanced problems that emphasize complexity optimization, state design, and combined techniques.',
    ),
  },
};

export const SKILL_LEVEL_META: Record<UserSkillLevel, SkillLevelMeta> = {
  beginner: createSkillLevelMeta(SKILL_LEVEL_META_DEFINITIONS.beginner),
  foundation: createSkillLevelMeta(SKILL_LEVEL_META_DEFINITIONS.foundation),
  intermediate: createSkillLevelMeta(SKILL_LEVEL_META_DEFINITIONS.intermediate),
  advanced: createSkillLevelMeta(SKILL_LEVEL_META_DEFINITIONS.advanced),
};

function difficultyRank(difficulty: ExerciseDifficulty): number {
  if (difficulty === 'easy') return 0;
  if (difficulty === 'medium') return 1;
  return 2;
}

function clampLevel(index: number): UserSkillLevel {
  return SKILL_LEVEL_ORDER[Math.max(0, Math.min(SKILL_LEVEL_ORDER.length - 1, index))];
}

function shiftDifficulty(difficulty: ExerciseDifficulty, offset: number): ExerciseDifficulty {
  const values: ExerciseDifficulty[] = ['easy', 'medium', 'hard'];
  const nextIndex = Math.max(0, Math.min(values.length - 1, values.indexOf(difficulty) + offset));
  return values[nextIndex];
}

function hashString(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function pickByDay<T>(items: T[], seed: string): T | null {
  if (items.length === 0) return null;
  return items[hashString(seed) % items.length];
}

function getDifficultyLabel(difficulty: ExerciseDifficulty): string {
  if (difficulty === 'easy') return pickRuntimeText('简单', 'Easy');
  if (difficulty === 'medium') return pickRuntimeText('中等', 'Medium');
  return pickRuntimeText('困难', 'Hard');
}

export function normalizeSkillLevel(value: unknown): UserSkillLevel {
  if (typeof value === 'string' && value in SKILL_LEVEL_META) {
    return value as UserSkillLevel;
  }
  return 'beginner';
}

export function getSkillLevelMeta(level: unknown): SkillLevelMeta {
  return SKILL_LEVEL_META[normalizeSkillLevel(level)];
}

export function deriveLearningState(progress: UserProgressSnapshot): LearningState {
  const recent = progress.exerciseHistory.slice(0, 6);
  if (progress.completedExercises.length < 3 || recent.length < 3) {
    return 'onboarding';
  }

  const recentFailed = recent.filter((record) => !record.isCorrect).length;
  if (recentFailed >= 2) {
    return 'review';
  }

  const averageScore = Math.round(recent.reduce((sum, record) => sum + record.score, 0) / recent.length);
  const passRate = recent.filter((record) => record.isCorrect).length / recent.length;

  if (averageScore >= 88 && passRate >= 0.7) {
    return 'challenge';
  }

  return 'steady';
}

export function deriveEffectiveSkillLevel(level: unknown, progress: UserProgressSnapshot): UserSkillLevel {
  const declaredLevel = normalizeSkillLevel(level);
  const recent = progress.exerciseHistory.slice(0, 6);
  if (recent.length < 4) {
    return declaredLevel;
  }

  const averageScore = Math.round(recent.reduce((sum, record) => sum + record.score, 0) / recent.length);
  const passRate = recent.filter((record) => record.isCorrect).length / recent.length;
  const baseIndex = SKILL_LEVEL_ORDER.indexOf(declaredLevel);

  if (averageScore >= 92 && passRate >= 0.75) {
    return clampLevel(baseIndex + 1);
  }

  if (averageScore <= 45 && passRate < 0.35) {
    return clampLevel(baseIndex - 1);
  }

  return declaredLevel;
}

function selectCandidates(
  exercises: Exercise[],
  progress: UserProgressSnapshot,
  effectiveLevel: UserSkillLevel,
  learningState: LearningState,
): Exercise[] {
  const meta = getSkillLevelMeta(effectiveLevel);
  const completedSet = new Set(progress.completedExercises);
  const lastFailed = progress.exerciseHistory.find((record) => !record.isCorrect);
  const targetDifficulty =
    learningState === 'challenge'
      ? shiftDifficulty(meta.defaultDifficulty, meta.defaultDifficulty === 'hard' ? 0 : 1)
      : learningState === 'review'
        ? shiftDifficulty(meta.defaultDifficulty, -1)
        : meta.defaultDifficulty;

  const baseCandidates = exercises.filter((exercise) => {
    if (completedSet.has(exercise.id)) return false;
    if (!meta.practiceCategories.includes(exercise.category)) return false;
    if (learningState !== 'challenge' && difficultyRank(exercise.difficulty) > difficultyRank(targetDifficulty)) return false;
    if (learningState === 'challenge' && difficultyRank(exercise.difficulty) < difficultyRank(meta.defaultDifficulty)) return false;
    return true;
  });

  if (learningState === 'review' && lastFailed) {
    const failedCategoryCandidates = baseCandidates.filter((exercise) => exercise.category === lastFailed.category);
    if (failedCategoryCandidates.length > 0) {
      return failedCategoryCandidates;
    }
  }

  if (baseCandidates.length > 0) {
    return baseCandidates;
  }

  const fallbackByDifficulty = exercises.filter((exercise) => {
    if (completedSet.has(exercise.id)) return false;
    return difficultyRank(exercise.difficulty) <= difficultyRank(targetDifficulty);
  });

  return fallbackByDifficulty.length > 0
    ? fallbackByDifficulty
    : exercises.filter((exercise) => !completedSet.has(exercise.id));
}

export function buildDailyRecommendation(
  exercises: Exercise[],
  progress: UserProgressSnapshot,
  userId?: string,
  requestedLevel?: UserSkillLevel,
): DailyRecommendation {
  const today = new Date();
  const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const declaredLevel = normalizeSkillLevel(requestedLevel || progress.skillLevel);
  const effectiveLevel = deriveEffectiveSkillLevel(declaredLevel, progress);
  const learningState = deriveLearningState(progress);
  const levelMeta = getSkillLevelMeta(effectiveLevel);
  const sortedCandidates = sortExercisesForPractice(
    selectCandidates(exercises, progress, effectiveLevel, learningState),
    new Set(progress.completedExercises),
  );
  const primaryPool = sortedCandidates.slice(0, Math.min(6, sortedCandidates.length));
  const exercise = pickByDay(primaryPool, `${userId || 'guest'}:${dateKey}:${effectiveLevel}:${learningState}`) || sortedCandidates[0] || null;
  const recommendedDifficulty =
    learningState === 'challenge'
      ? shiftDifficulty(levelMeta.defaultDifficulty, levelMeta.defaultDifficulty === 'hard' ? 0 : 1)
      : learningState === 'review'
        ? shiftDifficulty(levelMeta.defaultDifficulty, -1)
        : levelMeta.defaultDifficulty;
  const focusCategory = exercise?.category || levelMeta.practiceCategories[0];

  const zhReason =
    learningState === 'review'
      ? `最近出现连续失分，今天优先回到 ${focusCategory} 做复盘修正。`
      : learningState === 'challenge'
        ? `你最近状态稳定，今天可以把 ${focusCategory} 提升到更高难度。`
        : learningState === 'onboarding'
          ? `先从 ${levelMeta.recommendedTrack} 起步，建立稳定题感。`
          : `按你当前水平继续推进 ${focusCategory}，保持稳定刷题节奏。`;
  const enReason =
    learningState === 'review'
      ? `You have hit consecutive misses recently. Return to ${focusCategory} for targeted review today.`
      : learningState === 'challenge'
        ? `Your recent form is steady. You can push ${focusCategory} to a higher difficulty today.`
        : learningState === 'onboarding'
          ? `Start with ${levelMeta.recommendedTrack} to build a steady problem-solving rhythm.`
          : `Keep advancing through ${focusCategory} at your current level and maintain a steady practice rhythm.`;

  return {
    dateKey,
    exercise,
    declaredLevel,
    effectiveLevel,
    learningState,
    recommendedDifficulty,
    recommendedTrack: levelMeta.recommendedTrack,
    reason: localizeRuntimeText(zhReason, enReason),
    focusCategory,
    ctaLabel: localizeRuntimeText(
      learningState === 'review' ? '开始复盘' : '开始今日题',
      learningState === 'review' ? 'Start Review' : 'Start Today',
    ),
  };
}

export function buildAiDefaults(progress: UserProgressSnapshot, requestedLevel?: UserSkillLevel) {
  const declaredLevel = normalizeSkillLevel(requestedLevel || progress.skillLevel);
  const effectiveLevel = deriveEffectiveSkillLevel(declaredLevel, progress);
  const learningState = deriveLearningState(progress);
  const meta = getSkillLevelMeta(effectiveLevel);
  const difficulty =
    learningState === 'review'
      ? shiftDifficulty(meta.defaultDifficulty, -1)
      : learningState === 'challenge'
        ? shiftDifficulty(meta.defaultDifficulty, meta.defaultDifficulty === 'hard' ? 0 : 1)
        : meta.defaultDifficulty;

  return {
    declaredLevel,
    effectiveLevel,
    learningState,
    difficulty,
    dataStructure: meta.aiCategories[0],
    suggestedCategories: meta.aiCategories,
    message:
      learningState === 'review'
        ? localizeRuntimeText(
            '已按你的最近状态切到更稳的难度，先修复基础和边界题。',
            'Difficulty has been lowered to stabilize your recent performance. Repair fundamentals and edge cases first.',
          )
        : pickRuntimeText(
            `${meta.aiMessage} 当前建议难度为 ${getDifficultyLabel(difficulty)}。`,
            `${meta.aiMessage} Current recommended difficulty is ${getDifficultyLabel(difficulty)}.`,
          ),
  };
}
