import type { Exercise, ExerciseDifficulty, PracticeStage } from '../data/exercises';

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

const difficultyRank: Record<ExerciseDifficulty, number> = {
  easy: 0,
  medium: 1,
  hard: 2,
};

const stageOrder: PracticeStage[] = ['warmup', 'solid', 'upgrade', 'sprint'];

export const PRACTICE_STAGE_META: PracticeStageMeta[] = [
  {
    id: 'warmup',
    label: '热身层',
    summary: '先用模板题和样例题把输入输出与解题套路跑通。',
    difficultyLabel: '建议难度: 简单起步',
    accent: 'border-sky-200 bg-sky-50 text-sky-700',
    pill: 'bg-sky-100 text-sky-700',
  },
  {
    id: 'solid',
    label: '巩固层',
    summary: '开始稳定通过同类题型，减少重复犯错。',
    difficultyLabel: '建议难度: 简单进阶',
    accent: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    pill: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 'upgrade',
    label: '进阶层',
    summary: '拉高复杂度与边界覆盖，进入中阶题节奏。',
    difficultyLabel: '建议难度: 中等主练',
    accent: 'border-amber-200 bg-amber-50 text-amber-700',
    pill: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'sprint',
    label: '冲刺层',
    summary: '集中处理高频难题、综合题和考试重点题。',
    difficultyLabel: '建议难度: 困难与重点',
    accent: 'border-rose-200 bg-rose-50 text-rose-700',
    pill: 'bg-rose-100 text-rose-700',
  },
];

export const DIFFICULTY_META: Record<ExerciseDifficulty, DifficultyMeta> = {
  easy: {
    id: 'easy',
    label: '简单',
    stars: '★',
    accent: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  },
  medium: {
    id: 'medium',
    label: '中等',
    stars: '★★',
    accent: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  },
  hard: {
    id: 'hard',
    label: '困难',
    stars: '★★★',
    accent: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  },
};

export const CATEGORY_GROUPS: Array<{ group: string; items: CategoryMeta[] }> = [
  {
    group: '全部',
    items: [{ id: 'all', name: '全部题目', group: '全部', summary: '查看全题库并按推荐顺序继续练。' }],
  },
  {
    group: '数据结构',
    items: [
      { id: '数组', name: '数组', group: '数据结构', summary: '基础遍历、下标映射与原地修改。' },
      { id: '链表', name: '链表', group: '数据结构', summary: '指针移动、插删反转与快慢指针。' },
      { id: '栈', name: '栈', group: '数据结构', summary: '后进先出、括号匹配与表达式处理。' },
      { id: '队列', name: '队列', group: '数据结构', summary: '先进先出、双端队列与层序遍历。' },
      { id: '哈希表', name: '哈希表', group: '数据结构', summary: '查重、计数、映射和频次统计。' },
      { id: '堆', name: '堆', group: '数据结构', summary: 'Top K、优先级调度与堆维护。' },
      { id: '结构体', name: '结构体', group: '数据结构', summary: '结构设计与题面抽象。' },
      { id: '设计', name: '设计', group: '数据结构', summary: '系统接口、缓存与数据结构设计题。' },
    ],
  },
  {
    group: '树图系统',
    items: [
      { id: '二叉树', name: '二叉树', group: '树图系统', summary: '递归、遍历、层序和树形 DP。' },
      { id: '图', name: '图', group: '树图系统', summary: 'BFS、DFS、最短路和拓扑排序。' },
      { id: '并查集', name: '并查集', group: '树图系统', summary: '连通性、集合合并与判环。' },
      { id: '矩阵', name: '矩阵', group: '树图系统', summary: '二维遍历、方向控制与状态压缩。' },
      { id: '区间', name: '区间', group: '树图系统', summary: '区间合并、插入和扫描线思维。' },
    ],
  },
  {
    group: '算法思维',
    items: [
      { id: '双指针', name: '双指针', group: '算法思维', summary: '相向、同向与原地压缩。' },
      { id: '滑动窗口', name: '滑动窗口', group: '算法思维', summary: '动态维护窗口与区间答案。' },
      { id: '前缀和', name: '前缀和', group: '算法思维', summary: '区间统计与哈希联动。' },
      { id: '单调栈', name: '单调栈', group: '算法思维', summary: '下一个更大元素与边界贡献。' },
      { id: '回溯', name: '回溯', group: '算法思维', summary: '搜索树、剪枝与组合枚举。' },
      { id: '贪心', name: '贪心', group: '算法思维', summary: '局部最优转全局最优。' },
      { id: '动态规划', name: '动态规划', group: '算法思维', summary: '状态设计、转移和空间优化。' },
    ],
  },
  {
    group: '基础算法',
    items: [
      { id: '排序', name: '排序', group: '基础算法', summary: '比较排序、分治排序与稳定性。' },
      { id: '查找', name: '查找', group: '基础算法', summary: '顺序查找、散列查找与索引定位。' },
      { id: '二分查找', name: '二分查找', group: '基础算法', summary: '边界收缩与答案二分。' },
      { id: '字符串', name: '字符串', group: '基础算法', summary: '匹配、解析、回文与模式串。' },
      { id: '数学', name: '数学', group: '基础算法', summary: '数论、快速幂、组合与模拟。' },
      { id: '位运算', name: '位运算', group: '基础算法', summary: '状态压缩、掩码与二进制技巧。' },
    ],
  },
  {
    group: '入门',
    items: [
      { id: '基础概念', name: '基础概念', group: '入门', summary: '概念辨析与算法基本功。' },
      { id: '基础编程', name: '基础编程', group: '入门', summary: '输入输出、循环分支与函数练习。' },
      { id: '填空题', name: '填空题', group: '入门', summary: '先掌握代码片段和标准模板。' },
    ],
  },
];

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
    group: '扩展',
    summary: '按当前专题继续刷题。',
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
