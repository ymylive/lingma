import { useState, type ReactNode } from 'react';
import { useI18n } from '../../contexts/I18nContext';
import {
  BookOpenIcon,
  DiagramIcon,
  ImportantIcon,
  PlayMediaIcon,
  StarRating,
  TipIcon,
  WarningIcon,
} from '../ui';

interface Section {
  title: string;
  icon: ReactNode;
  content: React.ReactNode;
}

interface TutorialPanelProps {
  title: string;
  sections: Section[];
}

export default function TutorialPanel({ title, sections }: TutorialPanelProps) {
  const [activeTab, setActiveTab] = useState(0);
  const { isEnglish, t } = useI18n();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* 标题 */}
      <div className="bg-gradient-to-r from-klein-600 to-purple-600 px-4 py-4 sm:px-6">
        <h2 className="flex flex-wrap items-center gap-2 text-lg font-bold text-white sm:text-xl">
          <BookOpenIcon size={20} className="text-white/90" /> {t(title)} - {t('学习教程')}
        </h2>
      </div>

      {/* 标签页 */}
      <div className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
        <div className="overflow-x-auto px-2 sm:px-0">
          <div className="flex min-w-max">
            {sections.map((section, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`flex min-h-[44px] items-center gap-2 whitespace-nowrap px-4 py-3 text-[15px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klein-500/60 focus-visible:ring-inset sm:text-sm ${activeTab === i
                  ? 'border-b-2 border-klein-600 bg-white text-klein-600 dark:bg-slate-800 dark:text-klein-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <span>{section.icon}</span>
                {t(section.title)}
              </button>
            ))}
          </div>
        </div>
        {sections.length > 2 && (
          <div className="px-4 pb-3 text-[11px] text-slate-500 dark:text-slate-400 sm:hidden">
            {isEnglish ? 'Swipe sideways to switch sections.' : t('左右滑动切换章节')}
          </div>
        )}
      </div>

      {/* 内容 */}
      <div className="p-4 sm:p-6">
        {sections[activeTab]?.content}
      </div>
    </div>
  );
}

function MobileScrollHint() {
  const { isEnglish, t } = useI18n();

  return (
    <div className="sm:hidden">
      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500 dark:bg-slate-700 dark:text-slate-300">
        {isEnglish ? 'Swipe sideways for full content.' : t('左右滑动查看完整内容')}
      </span>
    </div>
  );
}

// 工具组件：知识点卡片
export function KnowledgeCard({ title, children, color = 'klein' }: { 
  title: string; 
  children: React.ReactNode; 
  color?: 'klein' | 'emerald' | 'amber' | 'rose' 
}) {
  const colors = {
    klein: 'border-klein-200 dark:border-klein-800 bg-klein-50 dark:bg-klein-900/30',
    emerald: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/30',
    amber: 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/30',
    rose: 'border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/30',
  };
  
  return (
    <div className={`rounded-xl border p-4 sm:p-5 ${colors[color]}`}>
      <h4 className="mb-2 text-base font-bold text-slate-800 dark:text-slate-200">{title}</h4>
      <div className="text-[15px] leading-7 text-slate-700 dark:text-slate-300 sm:text-sm">{children}</div>
    </div>
  );
}

// 工具组件：步骤列表
export function StepList({ steps }: { steps: { title: string; desc: string }[] }) {
  return (
    <div className="space-y-4">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-klein-600 text-sm font-bold text-white">
            {i + 1}
          </div>
          <div>
            <div className="text-base font-medium text-slate-800 dark:text-slate-200">{step.title}</div>
            <div className="text-[15px] leading-6 text-slate-600 dark:text-slate-400 sm:text-sm">{step.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// 工具组件：对比表格
export function CompareTable({ headers, rows }: { 
  headers: string[]; 
  rows: string[][] 
}) {
  const { t } = useI18n();
  return (
    <div className="space-y-2">
      <MobileScrollHint />
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="min-w-[420px] w-full text-[13px] sm:min-w-[540px] sm:text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-700">
              {headers.map((h, i) => (
                <th key={i} className="px-3 py-2.5 text-left font-medium text-slate-700 dark:text-slate-200 sm:px-4">{t(h)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-slate-200 dark:border-slate-600">
                {row.map((cell, j) => (
                  <td key={j} className="px-3 py-2.5 align-top text-slate-600 dark:text-slate-300 sm:px-4">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 工具组件：单语言代码示例
export function CodeExample({ code, lang = 'cpp' }: { code: string; lang?: string }) {
  useI18n();

  return (
    <div className="space-y-2">
      <MobileScrollHint />
      <div className="overflow-x-auto rounded-xl bg-slate-800 p-3 sm:p-4">
        <div className="mb-2 text-xs text-slate-400">{lang.toUpperCase()}</div>
        <pre className="min-w-max whitespace-pre font-mono text-[13px] leading-6 text-slate-300 sm:text-sm">{code}</pre>
      </div>
    </div>
  );
}

// 工具组件：多语言代码示例（带切换）
export function MultiLangCode({ codes, title }: { 
  codes: { cpp?: string; java?: string; python?: string };
  title?: string;
}) {
  const [lang, setLang] = useState<'cpp' | 'java' | 'python'>('cpp');
  const { t } = useI18n();
  const langNames = { cpp: 'C++', java: 'Java', python: 'Python' };
  const available = Object.keys(codes).filter(k => codes[k as keyof typeof codes]) as ('cpp' | 'java' | 'python')[];

  return (
    <div className="overflow-hidden rounded-xl bg-slate-800">
      <div className="flex flex-col gap-3 bg-slate-700/50 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-2">
        {title && <span className="text-sm font-medium text-slate-300">{t(title)}</span>}
        <div className="flex flex-wrap gap-1.5">
          {available.map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`min-h-[40px] rounded-lg px-3 py-2 text-sm font-medium transition-all sm:py-1 sm:text-xs ${lang === l ? 'bg-klein-600 text-white' : 'bg-slate-600 text-slate-300 hover:bg-slate-500'}`}
            >
              {langNames[l]}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2 p-3 sm:p-4">
        <MobileScrollHint />
        <div className="overflow-x-auto">
          <pre className="min-w-max whitespace-pre font-mono text-[13px] leading-6 text-slate-300 sm:text-sm">{codes[lang]}</pre>
        </div>
      </div>
    </div>
  );
}

// 工具组件：演示链接
export function DemoLink({ to, text, icon }: { to: string; text: string; icon?: ReactNode }) {
  return (
    <a
      href={to}
      className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-klein-500 to-purple-500 px-4 py-3 text-sm font-medium text-white shadow-md transition-all hover:from-klein-600 hover:to-purple-600 sm:justify-start sm:py-2"
    >
      <span className="inline-flex items-center">{icon ?? <PlayMediaIcon size={16} />}</span>
      {text}
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </a>
  );
}

// 工具组件：图解说明（用于展示概念）
export function Diagram({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800 sm:p-5">
      <div className="mb-3 flex items-center gap-2 text-[15px] font-medium text-slate-700 dark:text-slate-300 sm:text-sm">
        <DiagramIcon size={16} className="text-klein-500 dark:text-klein-300" /> {title}
      </div>
      <div className="flex justify-center">{children}</div>
    </div>
  );
}

// 工具组件：术语解释
export function Term({ word, meaning }: { word: string; meaning: string }) {
  return (
    <span className="group relative cursor-help border-b border-dashed border-klein-400 text-klein-600">
      {word}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
        {meaning}
      </span>
    </span>
  );
}

// 工具组件：难度标签
export function DifficultyBadge({ level }: { level: 'easy' | 'medium' | 'hard' }) {
  const { t } = useI18n();
  const config = {
    easy: { text: '入门', stars: 1 as const, color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' },
    medium: { text: '进阶', stars: 2 as const, color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' },
    hard: { text: '困难', stars: 3 as const, color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400' },
  };
  const c = config[level];
  return (
    <span className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-[13px] font-medium ${c.color}`}>
      <StarRating level={c.stars} size={11} />
      {t(c.text)}
    </span>
  );
}

// 工具组件：提示框
export function TipBox({ type, children }: {
  type: 'tip' | 'warning' | 'important';
  children: React.ReactNode
}) {
  const { t } = useI18n();
  const styles = {
    tip: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/30',
      border: 'border-emerald-200 dark:border-emerald-800',
      iconColor: 'text-emerald-600 dark:text-emerald-300',
      Icon: TipIcon,
      title: '提示',
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/30',
      border: 'border-amber-200 dark:border-amber-800',
      iconColor: 'text-amber-600 dark:text-amber-300',
      Icon: WarningIcon,
      title: '注意',
    },
    important: {
      bg: 'bg-rose-50 dark:bg-rose-900/30',
      border: 'border-rose-200 dark:border-rose-800',
      iconColor: 'text-rose-600 dark:text-rose-300',
      Icon: ImportantIcon,
      title: '重要',
    },
  };
  const s = styles[type];
  const Icon = s.Icon;

  return (
    <div className={`${s.bg} ${s.border} rounded-xl border p-4 sm:p-5`}>
      <div className="mb-1 flex items-center gap-2 text-base font-medium text-slate-800 dark:text-slate-200">
        <Icon size={18} className={s.iconColor} /> {t(s.title)}
      </div>
      <div className="text-[15px] leading-7 text-slate-700 dark:text-slate-300 sm:text-sm">{children}</div>
    </div>
  );
}

// 导出编程练习组件
export { default as CodingExercise, FillInBlank } from './CodingExercise';

// 导出AI出题组件
export { default as AIExerciseGenerator } from './AIExerciseGenerator';

// 工具组件：选择题
export function QuizQuestion({ question, options, answer, explanation }: {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const { t } = useI18n();

  return (
    <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700 sm:p-5">
      <div className="mb-3 text-base font-medium text-slate-800 dark:text-slate-200">{question}</div>
      <div className="mb-3 space-y-2">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => { setSelected(i); setShowAnswer(true); }}
            className={`w-full rounded-lg px-4 py-3 text-left text-[15px] transition-all sm:text-sm ${showAnswer
                ? i === answer
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                  : i === selected
                    ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700'
                    : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                : selected === i
                  ? 'bg-klein-100 dark:bg-klein-900/30 text-klein-800 dark:text-klein-300 border border-klein-300 dark:border-klein-700'
                  : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600'
              }`}
          >
            {String.fromCharCode(65 + i)}. {opt}
          </button>
        ))}
      </div>
      {showAnswer && (
        <div className="rounded-lg bg-slate-50 p-3 text-[15px] dark:bg-slate-700 sm:text-sm">
          <span className="font-medium text-emerald-600 dark:text-emerald-400">{t('正确答案')}: {String.fromCharCode(65 + answer)}</span>
          <p className="mt-1 text-slate-600 dark:text-slate-300">{explanation}</p>
        </div>
      )}
    </div>
  );
}
