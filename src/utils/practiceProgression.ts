import type { Exercise, ExerciseDifficulty, PracticeStage } from '../data/exercises';
import { pickRuntimeText } from './runtimeLocale';

export interface CategoryMeta {
  id: string;
  name: string;
  group: string;
  summary: string;
}

export interface PracticeStageMeta {
  id: PracticeStage;
  label: string;
  summary: string;
  difficultyLabel: string;
  accent: string;
  pill: string;
}

export interface PracticeStageBucket extends PracticeStageMeta {
  exercises: Exercise[];
  total: number;
  completed: number;
  unlocked: boolean;
}

export interface PracticePath {
  category: string;
  total: number;
  completed: number;
  remaining: number;
  completionRate: number;
  currentStageId: PracticeStage | null;
  nextExercise: Exercise | null;
  stages: PracticeStageBucket[];
}

export interface DifficultyMeta {
  id: ExerciseDifficulty;
  label: string;
  stars: string;
  accent: string;
}

export interface ExerciseProgressionMeta {
  stageId: PracticeStage;
  stageIndex: number;
  orderInCategory: number;
}

interface LocalizedPair {
  zh: string;
  en: string;
}

interface CategoryMetaDefinition {
  id: string;
  name: LocalizedPair;
  group: LocalizedPair;
  summary: LocalizedPair;
}

interface StageMetaDefinition {
  id: PracticeStage;
  label: LocalizedPair;
  summary: LocalizedPair;
  difficultyLabel: LocalizedPair;
  accent: string;
  pill: string;
}

interface DifficultyMetaDefinition {
  id: ExerciseDifficulty;
  label: LocalizedPair;
  stars: string;
  accent: string;
}

const difficultyRank: Record<ExerciseDifficulty, number> = {
  easy: 0,
  medium: 1,
  hard: 2,
};

const stageOrder: PracticeStage[] = ['warmup', 'solid', 'upgrade', 'sprint'];

function localText(zh: string, en: string): LocalizedPair {
  return { zh, en };
}

function resolveLocalized(pair: LocalizedPair): string {
  return pickRuntimeText(pair.zh, pair.en);
}

function createStageMeta(definition: StageMetaDefinition): PracticeStageMeta {
  return {
    id: definition.id,
    get label() {
      return resolveLocalized(definition.label);
    },
    get summary() {
      return resolveLocalized(definition.summary);
    },
    get difficultyLabel() {
      return resolveLocalized(definition.difficultyLabel);
    },
    accent: definition.accent,
    pill: definition.pill,
  } as PracticeStageMeta;
}

function createDifficultyMeta(definition: DifficultyMetaDefinition): DifficultyMeta {
  return {
    id: definition.id,
    get label() {
      return resolveLocalized(definition.label);
    },
    stars: definition.stars,
    accent: definition.accent,
  } as DifficultyMeta;
}

function createCategoryMeta(definition: CategoryMetaDefinition): CategoryMeta {
  return {
    id: definition.id,
    get name() {
      return resolveLocalized(definition.name);
    },
    get group() {
      return resolveLocalized(definition.group);
    },
    get summary() {
      return resolveLocalized(definition.summary);
    },
  } as CategoryMeta;
}

const PRACTICE_STAGE_DEFINITIONS: StageMetaDefinition[] = [
  {
    id: 'warmup',
    label: localText('热身层', 'Warmup'),
    summary: localText(
      '先用模板题和样例题把输入输出与解题套路跑通。',
      'Warm up with template and sample problems to stabilize I/O and basic solving patterns.',
    ),
    difficultyLabel: localText('建议难度: 简单起步', 'Suggested difficulty: Start with easy'),
    accent: 'border-sky-200 bg-sky-50 text-sky-700',
    pill: 'bg-sky-100 text-sky-700',
  },
  {
    id: 'solid',
    label: localText('巩固层', 'Solidify'),
    summary: localText(
      '开始稳定通过同类题型，减少重复犯错。',
      'Aim to pass similar problem types consistently and reduce repeated mistakes.',
    ),
    difficultyLabel: localText('建议难度: 简单进阶', 'Suggested difficulty: Easy plus'),
    accent: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    pill: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 'upgrade',
    label: localText('进阶层', 'Upgrade'),
    summary: localText(
      '拉高复杂度与边界覆盖，进入中阶题节奏。',
      'Increase complexity and edge-case coverage to enter a medium-difficulty rhythm.',
    ),
    difficultyLabel: localText('建议难度: 中等主练', 'Suggested difficulty: Medium focus'),
    accent: 'border-amber-200 bg-amber-50 text-amber-700',
    pill: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'sprint',
    label: localText('冲刺层', 'Sprint'),
    summary: localText(
      '集中处理高频难题、综合题和考试重点题。',
      'Focus on high-frequency hard problems, composite questions, and exam hotspots.',
    ),
    difficultyLabel: localText('建议难度: 困难与重点', 'Suggested difficulty: Hard and key topics'),
    accent: 'border-rose-200 bg-rose-50 text-rose-700',
    pill: 'bg-rose-100 text-rose-700',
  },
];

export const PRACTICE_STAGE_META: PracticeStageMeta[] = PRACTICE_STAGE_DEFINITIONS.map(createStageMeta);

const DIFFICULTY_DEFINITIONS: Record<ExerciseDifficulty, DifficultyMetaDefinition> = {
  easy: {
    id: 'easy',
    label: localText('简单', 'Easy'),
    stars: '★',
    accent: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  },
  medium: {
    id: 'medium',
    label: localText('中等', 'Medium'),
    stars: '★★',
    accent: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  },
  hard: {
    id: 'hard',
    label: localText('困难', 'Hard'),
    stars: '★★★',
    accent: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  },
};

export const DIFFICULTY_META: Record<ExerciseDifficulty, DifficultyMeta> = {
  easy: createDifficultyMeta(DIFFICULTY_DEFINITIONS.easy),
  medium: createDifficultyMeta(DIFFICULTY_DEFINITIONS.medium),
  hard: createDifficultyMeta(DIFFICULTY_DEFINITIONS.hard),
};

const CATEGORY_GROUP_DEFINITIONS: Array<{ group: LocalizedPair; items: CategoryMetaDefinition[] }> = [
  {
    group: localText('全部', 'All'),
    items: [
      {
        id: 'all',
        name: localText('全部题目', 'All Problems'),
        group: localText('全部', 'All'),
        summary: localText('查看全题库并按推荐顺序继续练。', 'Browse the full library and continue in recommended order.'),
      },
    ],
  },
  {
    group: localText('数据结构', 'Data Structures'),
    items: [
      { id: '数组', name: localText('数组', 'Arrays'), group: localText('数据结构', 'Data Structures'), summary: localText('基础遍历、下标映射与原地修改。', 'Practice traversal, index mapping, and in-place updates.') },
      { id: '链表', name: localText('链表', 'Linked Lists'), group: localText('数据结构', 'Data Structures'), summary: localText('指针移动、插删反转与快慢指针。', 'Train pointer movement, insert/delete/reverse, and fast-slow pointers.') },
      { id: '栈', name: localText('栈', 'Stacks'), group: localText('数据结构', 'Data Structures'), summary: localText('后进先出、括号匹配与表达式处理。', 'Cover LIFO behavior, bracket matching, and expression handling.') },
      { id: '队列', name: localText('队列', 'Queues'), group: localText('数据结构', 'Data Structures'), summary: localText('先进先出、双端队列与层序遍历。', 'Cover FIFO behavior, deques, and level-order traversal.') },
      { id: '哈希表', name: localText('哈希表', 'Hash Tables'), group: localText('数据结构', 'Data Structures'), summary: localText('查重、计数、映射和频次统计。', 'Practice deduplication, counting, mapping, and frequency stats.') },
      { id: '堆', name: localText('堆', 'Heaps'), group: localText('数据结构', 'Data Structures'), summary: localText('Top K、优先级调度与堆维护。', 'Practice Top K, priority scheduling, and heap maintenance.') },
      { id: '结构体', name: localText('结构体', 'Structs'), group: localText('数据结构', 'Data Structures'), summary: localText('结构设计与题面抽象。', 'Practice structure design and problem abstraction.') },
      { id: '设计', name: localText('设计', 'Design'), group: localText('数据结构', 'Data Structures'), summary: localText('系统接口、缓存与数据结构设计题。', 'Practice interfaces, caches, and data-structure design problems.') },
    ],
  },
  {
    group: localText('树图系统', 'Trees and Graphs'),
    items: [
      { id: '二叉树', name: localText('二叉树', 'Binary Trees'), group: localText('树图系统', 'Trees and Graphs'), summary: localText('递归、遍历、层序和树形 DP。', 'Practice recursion, traversals, level order, and tree DP.') },
      { id: '图', name: localText('图', 'Graphs'), group: localText('树图系统', 'Trees and Graphs'), summary: localText('BFS、DFS、最短路和拓扑排序。', 'Practice BFS, DFS, shortest paths, and topological sort.') },
      { id: '并查集', name: localText('并查集', 'Union Find'), group: localText('树图系统', 'Trees and Graphs'), summary: localText('连通性、集合合并与判环。', 'Practice connectivity, set union, and cycle detection.') },
      { id: '矩阵', name: localText('矩阵', 'Matrices'), group: localText('树图系统', 'Trees and Graphs'), summary: localText('二维遍历、方向控制与状态压缩。', 'Practice 2D traversal, directional control, and state compression.') },
      { id: '区间', name: localText('区间', 'Intervals'), group: localText('树图系统', 'Trees and Graphs'), summary: localText('区间合并、插入和扫描线思维。', 'Practice interval merge/insert and sweep-line thinking.') },
    ],
  },
  {
    group: localText('算法思维', 'Algorithm Patterns'),
    items: [
      { id: '双指针', name: localText('双指针', 'Two Pointers'), group: localText('算法思维', 'Algorithm Patterns'), summary: localText('相向、同向与原地压缩。', 'Practice opposite-direction, same-direction, and in-place compression patterns.') },
      { id: '滑动窗口', name: localText('滑动窗口', 'Sliding Window'), group: localText('算法思维', 'Algorithm Patterns'), summary: localText('动态维护窗口与区间答案。', 'Practice dynamically maintaining windows and interval answers.') },
      { id: '前缀和', name: localText('前缀和', 'Prefix Sum'), group: localText('算法思维', 'Algorithm Patterns'), summary: localText('区间统计与哈希联动。', 'Practice interval statistics and hash-assisted reasoning.') },
      { id: '单调栈', name: localText('单调栈', 'Monotonic Stack'), group: localText('算法思维', 'Algorithm Patterns'), summary: localText('下一个更大元素与边界贡献。', 'Practice next-greater-element problems and boundary contributions.') },
      { id: '回溯', name: localText('回溯', 'Backtracking'), group: localText('算法思维', 'Algorithm Patterns'), summary: localText('搜索树、剪枝与组合枚举。', 'Practice search trees, pruning, and combinational enumeration.') },
      { id: '贪心', name: localText('贪心', 'Greedy'), group: localText('算法思维', 'Algorithm Patterns'), summary: localText('局部最优转全局最优。', 'Practice turning local optimum choices into global optimum results.') },
      { id: '动态规划', name: localText('动态规划', 'Dynamic Programming'), group: localText('算法思维', 'Algorithm Patterns'), summary: localText('状态设计、转移和空间优化。', 'Practice state design, transitions, and space optimization.') },
    ],
  },
  {
    group: localText('基础算法', 'Core Algorithms'),
    items: [
      { id: '排序', name: localText('排序', 'Sorting'), group: localText('基础算法', 'Core Algorithms'), summary: localText('比较排序、分治排序与稳定性。', 'Practice comparison sorts, divide-and-conquer sorts, and stability.') },
      { id: '查找', name: localText('查找', 'Searching'), group: localText('基础算法', 'Core Algorithms'), summary: localText('顺序查找、散列查找与索引定位。', 'Practice linear search, hash lookup, and indexed access.') },
      { id: '二分查找', name: localText('二分查找', 'Binary Search'), group: localText('基础算法', 'Core Algorithms'), summary: localText('边界收缩与答案二分。', 'Practice boundary shrinking and answer-based binary search.') },
      { id: '字符串', name: localText('字符串', 'Strings'), group: localText('基础算法', 'Core Algorithms'), summary: localText('匹配、解析、回文与模式串。', 'Practice matching, parsing, palindromes, and pattern strings.') },
      { id: '数学', name: localText('数学', 'Math'), group: localText('基础算法', 'Core Algorithms'), summary: localText('数论、快速幂、组合与模拟。', 'Practice number theory, fast power, combinatorics, and simulation.') },
      { id: '位运算', name: localText('位运算', 'Bit Manipulation'), group: localText('基础算法', 'Core Algorithms'), summary: localText('状态压缩、掩码与二进制技巧。', 'Practice state compression, masks, and binary tricks.') },
    ],
  },
  {
    group: localText('入门', 'Foundations'),
    items: [
      { id: '基础概念', name: localText('基础概念', 'Core Concepts'), group: localText('入门', 'Foundations'), summary: localText('概念辨析与算法基本功。', 'Practice concept clarity and core algorithm fundamentals.') },
      { id: '基础编程', name: localText('基础编程', 'Basic Programming'), group: localText('入门', 'Foundations'), summary: localText('输入输出、循环分支与函数练习。', 'Practice input/output, loops, branches, and function basics.') },
      { id: '填空题', name: localText('填空题', 'Fill-in-the-Blank'), group: localText('入门', 'Foundations'), summary: localText('先掌握代码片段和标准模板。', 'Master code snippets and standard templates first.') },
    ],
  },
];

export const CATEGORY_GROUPS: Array<{ group: string; items: CategoryMeta[] }> = CATEGORY_GROUP_DEFINITIONS.map((definition) => ({
  get group() {
    return resolveLocalized(definition.group);
  },
  items: definition.items.map(createCategoryMeta),
})) as Array<{ group: string; items: CategoryMeta[] }>;

export function dedupeExercises(exercises: Exercise[]): Exercise[] {
  const map = new Map<string, Exercise>();

  for (const exercise of exercises) {
    const current = map.get(exercise.id);
    if (!current) {
      map.set(exercise.id, exercise);
      continue;
    }

    map.set(exercise.id, {
      ...current,
      ...exercise,
      hints: exercise.hints?.length ? exercise.hints : current.hints,
      blanks: exercise.blanks?.length ? exercise.blanks : current.blanks,
      testCases: exercise.testCases?.length ? exercise.testCases : current.testCases,
      templates: exercise.templates ?? current.templates,
      solutions: exercise.solutions ?? current.solutions,
      codeTemplate: exercise.codeTemplate ?? current.codeTemplate,
      commonMistakes: exercise.commonMistakes?.length ? exercise.commonMistakes : current.commonMistakes,
      isExamFocus: current.isExamFocus || exercise.isExamFocus,
    });
  }

  return Array.from(map.values());
}

export function getDifficultyRank(difficulty: ExerciseDifficulty): number {
  return difficultyRank[difficulty];
}

export function getDifficultyMeta(difficulty: ExerciseDifficulty): DifficultyMeta {
  return DIFFICULTY_META[difficulty];
}

export function getCategoryMeta(category: string): CategoryMeta {
  for (const group of CATEGORY_GROUPS) {
    const found = group.items.find((item) => item.id === category);
    if (found) {
      return found;
    }
  }

  return {
    id: category,
    name: category,
    group: pickRuntimeText('扩展', 'Extended'),
    summary: pickRuntimeText('按当前专题继续刷题。', 'Continue practicing in the current topic.'),
  };
}

export function sortExercisesForPractice(exercises: Exercise[], completedIds?: Set<string>): Exercise[] {
  const stageMap = assignStageByDifficulty(exercises);

  return [...exercises].sort((left, right) => {
    if (completedIds) {
      const leftCompleted = completedIds.has(left.id);
      const rightCompleted = completedIds.has(right.id);
      if (leftCompleted !== rightCompleted) {
        return leftCompleted ? 1 : -1;
      }
    }

    const leftStageId = left.practiceStage ?? stageMap.get(left.id);
    const rightStageId = right.practiceStage ?? stageMap.get(right.id);
    const leftStage = leftStageId ? stageOrder.indexOf(leftStageId) : -1;
    const rightStage = rightStageId ? stageOrder.indexOf(rightStageId) : -1;
    if (leftStage !== rightStage) {
      return leftStage - rightStage;
    }

    const leftOrder = left.practiceOrder ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = right.practiceOrder ?? Number.MAX_SAFE_INTEGER;
    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    const difficultyDelta = getDifficultyRank(left.difficulty) - getDifficultyRank(right.difficulty);
    if (difficultyDelta !== 0) {
      return difficultyDelta;
    }

    if (left.type !== right.type) {
      return left.type === 'fillblank' ? -1 : 1;
    }

    if ((left.isExamFocus ?? false) !== (right.isExamFocus ?? false)) {
      return left.isExamFocus ? -1 : 1;
    }

    return left.title.localeCompare(right.title);
  });
}

function assignStageByIndex(index: number, total: number): PracticeStage {
  if (total <= 1) {
    return 'warmup';
  }

  const normalizedIndex = Math.floor((index / total) * PRACTICE_STAGE_META.length);
  return PRACTICE_STAGE_META[Math.min(PRACTICE_STAGE_META.length - 1, normalizedIndex)].id;
}

function assignStageByDifficulty(sorted: Exercise[]): Map<string, PracticeStage> {
  const stageMap = new Map<string, PracticeStage>();
  const easyExercises = sorted.filter((exercise) => exercise.difficulty === 'easy');
  const mediumExercises = sorted.filter((exercise) => exercise.difficulty === 'medium');
  const hardExercises = sorted.filter((exercise) => exercise.difficulty === 'hard');

  const easyWarmupCount = easyExercises.length <= 1 ? easyExercises.length : Math.max(1, Math.ceil(easyExercises.length * 0.5));
  const mediumSolidCount = easyExercises.length === 0 && mediumExercises.length > 1 ? Math.max(1, Math.floor(mediumExercises.length * 0.35)) : 0;
  const hardUpgradeCount = mediumExercises.length === 0 && hardExercises.length > 1 ? Math.max(1, Math.floor(hardExercises.length * 0.4)) : 0;

  easyExercises.forEach((exercise, index) => {
    stageMap.set(exercise.id, index < easyWarmupCount ? 'warmup' : 'solid');
  });

  mediumExercises.forEach((exercise, index) => {
    stageMap.set(exercise.id, index < mediumSolidCount ? 'solid' : 'upgrade');
  });

  hardExercises.forEach((exercise, index) => {
    stageMap.set(exercise.id, index < hardUpgradeCount ? 'upgrade' : 'sprint');
  });

  sorted
    .filter((exercise) => exercise.isExamFocus && exercise.difficulty !== 'easy')
    .forEach((exercise) => {
      stageMap.set(exercise.id, 'sprint');
    });

  return stageMap;
}

function groupIntoStages(exercises: Exercise[]): Map<PracticeStage, Exercise[]> {
  const sorted = sortExercisesForPractice(exercises);
  const grouped = new Map<PracticeStage, Exercise[]>(stageOrder.map((stage) => [stage, []]));
  const difficultyStageMap = assignStageByDifficulty(sorted);

  sorted.forEach((exercise, index) => {
    const stageId = exercise.practiceStage ?? difficultyStageMap.get(exercise.id) ?? assignStageByIndex(index, sorted.length);
    grouped.get(stageId)?.push(exercise);
  });

  return grouped;
}

export function buildExerciseProgressionLookup(exercises: Exercise[]): Map<string, ExerciseProgressionMeta> {
  const byCategory = new Map<string, Exercise[]>();
  const lookup = new Map<string, ExerciseProgressionMeta>();

  exercises.forEach((exercise) => {
    const current = byCategory.get(exercise.category) ?? [];
    current.push(exercise);
    byCategory.set(exercise.category, current);
  });

  byCategory.forEach((categoryExercises) => {
    const grouped = groupIntoStages(categoryExercises);
    let orderInCategory = 1;
    stageOrder.forEach((stageId) => {
      const stageExercises = grouped.get(stageId) ?? [];
      stageExercises.forEach((exercise) => {
        lookup.set(exercise.id, {
          stageId,
          stageIndex: stageOrder.indexOf(stageId) + 1,
          orderInCategory,
        });
        orderInCategory += 1;
      });
    });
  });

  return lookup;
}

export function getRecommendedExercise(exercises: Exercise[], completedIds: Set<string>): Exercise | null {
  return sortExercisesForPractice(exercises, completedIds).find((exercise) => !completedIds.has(exercise.id)) ?? null;
}

export function buildPracticePath(
  exercises: Exercise[],
  completedIds: Set<string>,
  category: string,
): PracticePath {
  const stageGroups = groupIntoStages(exercises);
  const total = exercises.length;
  const completed = exercises.filter((exercise) => completedIds.has(exercise.id)).length;
  const nextExercise = getRecommendedExercise(exercises, completedIds);
  const currentStageId =
    nextExercise
      ? [...stageGroups.entries()].find(([, groupExercises]) => groupExercises.some((exercise) => exercise.id === nextExercise.id))?.[0] ?? null
      : [...stageGroups.entries()].reverse().find(([, groupExercises]) => groupExercises.length > 0)?.[0] ?? null;

  let unlocked = true;
  const stages = PRACTICE_STAGE_META.map((stageMeta) => {
    const stageExercises = stageGroups.get(stageMeta.id) ?? [];
    const stageCompleted = stageExercises.filter((exercise) => completedIds.has(exercise.id)).length;
    const stageUnlocked = stageExercises.length > 0 ? unlocked : false;

    if (stageExercises.length > 0 && stageCompleted < stageExercises.length) {
      unlocked = false;
    }

    return {
      ...stageMeta,
      exercises: stageExercises,
      total: stageExercises.length,
      completed: stageCompleted,
      unlocked: stageUnlocked,
    };
  });

  return {
    category,
    total,
    completed,
    remaining: Math.max(0, total - completed),
    completionRate: total ? Math.round((completed / total) * 100) : 0,
    currentStageId,
    nextExercise,
    stages,
  };
}
