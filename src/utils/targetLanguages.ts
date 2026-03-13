export type TargetLanguage = 'c' | 'cpp' | 'java' | 'csharp' | 'python';

export interface TargetLanguageMeta {
  id: TargetLanguage;
  label: string;
  description: string;
  descriptionEn: string;
  aiLabel: string;
  accent: string;
}

export const TARGET_LANGUAGE_META: Record<TargetLanguage, TargetLanguageMeta> = {
  c: {
    id: 'c',
    label: 'C',
    description: '面向底层实现、内存与指针训练。',
    descriptionEn: 'Focus on low-level implementation, memory, and pointer training.',
    aiLabel: 'C language',
    accent: 'border-sky-200 bg-sky-50 text-sky-700',
  },
  cpp: {
    id: 'cpp',
    label: 'C++',
    description: '适合算法竞赛与高频面试刷题。',
    descriptionEn: 'Best for algorithm contests and high-frequency interview practice.',
    aiLabel: 'C++',
    accent: 'border-indigo-200 bg-indigo-50 text-indigo-700',
  },
  java: {
    id: 'java',
    label: 'Java',
    description: '强调面向对象、集合框架与工程规范。',
    descriptionEn: 'Great for object-oriented thinking, collections, and engineering patterns.',
    aiLabel: 'Java',
    accent: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  csharp: {
    id: 'csharp',
    label: 'C#',
    description: '适合 .NET 生态、集合与业务编码习惯。',
    descriptionEn: 'Fits .NET workflows, collection-heavy code, and business applications.',
    aiLabel: 'C#',
    accent: 'border-violet-200 bg-violet-50 text-violet-700',
  },
  python: {
    id: 'python',
    label: 'Python',
    description: '上手快，适合快速验证思路与算法表达。',
    descriptionEn: 'Fast to start with and ideal for rapid algorithm prototyping.',
    aiLabel: 'Python',
    accent: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
};

export const TARGET_LANGUAGE_OPTIONS = Object.values(TARGET_LANGUAGE_META);

export function normalizeTargetLanguage(value: unknown): TargetLanguage {
  if (typeof value === 'string' && value in TARGET_LANGUAGE_META) {
    return value as TargetLanguage;
  }
  return 'cpp';
}

export function getTargetLanguageMeta(value: unknown): TargetLanguageMeta {
  return TARGET_LANGUAGE_META[normalizeTargetLanguage(value)];
}
