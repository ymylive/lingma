import { useState } from 'react';

interface Section {
  title: string;
  icon: string;
  content: React.ReactNode;
}

interface TutorialPanelProps {
  title: string;
  sections: Section[];
}

export default function TutorialPanel({ title, sections }: TutorialPanelProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* 标题 */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>📚</span> {title} - 学习教程
        </h2>
      </div>

      {/* 标签页 */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
        {sections.map((section, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-3 text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === i
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 bg-white dark:bg-slate-800'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span>{section.icon}</span>
            {section.title}
          </button>
        ))}
      </div>

      {/* 内容 */}
      <div className="p-6">
        {sections[activeTab]?.content}
      </div>
    </div>
  );
}

// 工具组件：知识点卡片
export function KnowledgeCard({ title, children, color = 'indigo' }: { 
  title: string; 
  children: React.ReactNode; 
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' 
}) {
  const colors = {
    indigo: 'border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/30',
    emerald: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/30',
    amber: 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/30',
    rose: 'border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/30',
  };
  
  return (
    <div className={`rounded-lg border p-4 ${colors[color]}`}>
      <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">{title}</h4>
      <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{children}</div>
    </div>
  );
}

// 工具组件：步骤列表
export function StepList({ steps }: { steps: { title: string; desc: string }[] }) {
  return (
    <div className="space-y-3">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-3">
          <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
            {i + 1}
          </div>
          <div>
            <div className="font-medium text-slate-800 dark:text-slate-200">{step.title}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">{step.desc}</div>
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
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-100 dark:bg-slate-700">
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-2 text-left font-medium text-slate-700 dark:text-slate-200">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-slate-200 dark:border-slate-600">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2 text-slate-600 dark:text-slate-300">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// 工具组件：单语言代码示例
export function CodeExample({ code, lang = 'cpp' }: { code: string; lang?: string }) {
  return (
    <div className="bg-slate-800 rounded-lg p-4 overflow-x-auto">
      <div className="text-xs text-slate-400 mb-2">{lang.toUpperCase()}</div>
      <pre className="text-sm text-slate-300 font-mono whitespace-pre">{code}</pre>
    </div>
  );
}

// 工具组件：多语言代码示例（带切换）
export function MultiLangCode({ codes, title }: { 
  codes: { cpp?: string; java?: string; python?: string };
  title?: string;
}) {
  const [lang, setLang] = useState<'cpp' | 'java' | 'python'>('cpp');
  const langNames = { cpp: 'C++', java: 'Java', python: 'Python' };
  const available = Object.keys(codes).filter(k => codes[k as keyof typeof codes]) as ('cpp' | 'java' | 'python')[];
  
  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-700/50">
        {title && <span className="text-slate-300 text-sm font-medium">{title}</span>}
        <div className="flex gap-1">
          {available.map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                lang === l ? 'bg-indigo-600 text-white' : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
              }`}
            >
              {langNames[l]}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm text-slate-300 font-mono whitespace-pre">{codes[lang]}</pre>
      </div>
    </div>
  );
}

// 工具组件：演示链接
export function DemoLink({ to, text, icon = '🎬' }: { to: string; text: string; icon?: string }) {
  return (
    <a
      href={to}
      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:from-indigo-600 hover:to-purple-600 transition-all shadow-md"
    >
      <span>{icon}</span>
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
    <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
      <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
        <span>📐</span> {title}
      </div>
      <div className="flex justify-center">{children}</div>
    </div>
  );
}

// 工具组件：术语解释
export function Term({ word, meaning }: { word: string; meaning: string }) {
  return (
    <span className="group relative cursor-help border-b border-dashed border-indigo-400 text-indigo-600">
      {word}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
        {meaning}
      </span>
    </span>
  );
}

// 工具组件：难度标签
export function DifficultyBadge({ level }: { level: 'easy' | 'medium' | 'hard' }) {
  const config = {
    easy: { text: '⭐ 入门', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' },
    medium: { text: '⭐⭐ 进阶', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' },
    hard: { text: '⭐⭐⭐ 困难', color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400' },
  };
  const c = config[level];
  return <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${c.color}`}>{c.text}</span>;
}

// 工具组件：提示框
export function TipBox({ type, children }: { 
  type: 'tip' | 'warning' | 'important'; 
  children: React.ReactNode 
}) {
  const styles = {
    tip: { bg: 'bg-emerald-50 dark:bg-emerald-900/30', border: 'border-emerald-200 dark:border-emerald-800', icon: '💡', title: '提示' },
    warning: { bg: 'bg-amber-50 dark:bg-amber-900/30', border: 'border-amber-200 dark:border-amber-800', icon: '⚠️', title: '注意' },
    important: { bg: 'bg-rose-50 dark:bg-rose-900/30', border: 'border-rose-200 dark:border-rose-800', icon: '❗', title: '重要' },
  };
  const s = styles[type];
  
  return (
    <div className={`${s.bg} ${s.border} border rounded-lg p-4`}>
      <div className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200 mb-1">
        <span>{s.icon}</span> {s.title}
      </div>
      <div className="text-sm text-slate-700 dark:text-slate-300">{children}</div>
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

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
      <div className="font-medium text-slate-800 dark:text-slate-200 mb-3">{question}</div>
      <div className="space-y-2 mb-3">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => { setSelected(i); setShowAnswer(true); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
              showAnswer
                ? i === answer
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                  : i === selected
                    ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700'
                    : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                : selected === i
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700'
                  : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600'
            }`}
          >
            {String.fromCharCode(65 + i)}. {opt}
          </button>
        ))}
      </div>
      {showAnswer && (
        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-sm">
          <span className="font-medium text-emerald-600 dark:text-emerald-400">正确答案: {String.fromCharCode(65 + answer)}</span>
          <p className="text-slate-600 dark:text-slate-300 mt-1">{explanation}</p>
        </div>
      )}
    </div>
  );
}
