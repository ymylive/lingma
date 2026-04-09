import { lazy, Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bot,
  Code2,
  Lightbulb,
  MessageSquareText,
  Sparkles,
  Terminal,
  Wrench,
  Zap,
} from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';
import useLowMotionMode from '../hooks/useLowMotionMode';
import type { VibeTrack } from '../types/vibeCoding';

const VALID_TRACKS = new Set<VibeTrack>(['frontend', 'backend', 'debugging', 'refactoring', 'review']);

const VibeCodingLab = lazy(() => import('../components/tutorials/VibeCodingLab'));

function syncPageMetadata(title: string, description: string) {
  if (typeof document === 'undefined') return;
  document.title = title;
  let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'description';
    document.head.appendChild(meta);
  }
  meta.content = description;
}

const TOOLS = [
  {
    name: 'Cursor',
    desc: 'AI 原生代码编辑器，支持自然语言编辑、代码补全和对话式编程',
    descEn: 'AI-native code editor with natural language editing, completion, and conversational coding',
    icon: Terminal,
    color: 'indigo',
  },
  {
    name: 'Claude Code',
    desc: 'Anthropic 的 CLI 编程助手，擅长复杂代码理解和多文件重构',
    descEn: "Anthropic's CLI coding assistant excelling at complex code comprehension and multi-file refactoring",
    icon: Bot,
    color: 'amber',
  },
  {
    name: 'GitHub Copilot',
    desc: 'GitHub 的 AI 编程伙伴，内嵌于 VS Code 等主流编辑器',
    descEn: "GitHub's AI pair programmer embedded in VS Code and major IDEs",
    icon: Code2,
    color: 'emerald',
  },
  {
    name: 'Windsurf',
    desc: '基于 Codeium 的 AI IDE，提供流畅的代码生成和上下文感知',
    descEn: "Codeium's AI IDE offering smooth code generation and context awareness",
    icon: Zap,
    color: 'rose',
  },
];

const TOOL_COLOR_CLASS: Record<string, { bg: string; text: string }> = {
  indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-600 dark:text-indigo-400' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400' },
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400' },
  rose: { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-600 dark:text-rose-400' },
};

const CORE_IDEAS = [
  {
    icon: MessageSquareText,
    title: '自然语言驱动',
    titleEn: 'Natural Language Driven',
    desc: '用清晰的 prompt 描述需求，让 AI 生成代码。核心技能是"如何准确描述你想要什么"。',
    descEn: 'Describe your requirements with clear prompts and let AI generate code. The core skill is "how to accurately describe what you want".',
  },
  {
    icon: Wrench,
    title: '迭代式构建',
    titleEn: 'Iterative Building',
    desc: '不需要一步到位。先让 AI 生成初版，再通过对话不断修正、完善和扩展功能。',
    descEn: "You don't need to get it right in one shot. Let AI generate a first draft, then iteratively refine and extend through conversation.",
  },
  {
    icon: Lightbulb,
    title: '理解优于背诵',
    titleEn: 'Understanding Over Memorization',
    desc: '不用死记语法，但必须理解逻辑。你需要能判断 AI 生成的代码是否正确、是否高效。',
    descEn: "No need to memorize syntax, but you must understand the logic. You need to judge whether AI-generated code is correct and efficient.",
  },
];

type PageSection = 'intro' | 'lab';

export default function VibeCoding() {
  const { isEnglish } = useI18n();
  const lowMotionMode = useLowMotionMode();
  const [searchParams, setSearchParams] = useSearchParams();
  const [section, setSection] = useState<PageSection>(() => {
    const s = searchParams.get('section');
    return s === 'lab' ? 'lab' : 'intro';
  });

  const paramTrack = searchParams.get('track');
  const initialTrack = paramTrack && VALID_TRACKS.has(paramTrack as VibeTrack)
    ? (paramTrack as VibeTrack)
    : undefined;

  useEffect(() => {
    syncPageMetadata(
      isEnglish ? 'Vibe Coding - Lingma' : 'Vibe Coding - 灵码',
      isEnglish
        ? 'Learn vibe coding: use AI tools and natural language to build software'
        : '学习 Vibe Coding：用 AI 工具和自然语言驱动编程',
    );
  }, [isEnglish]);

  const fadeIn = lowMotionMode
    ? {}
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, ease: 'easeOut' as const } };

  const staggerContainer = lowMotionMode
    ? {}
    : { animate: { transition: { staggerChildren: 0.08 } } };

  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      {/* Page Header */}
      <motion.div className="mb-10 text-center" {...fadeIn}>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm font-medium text-violet-700 dark:border-violet-800 dark:bg-violet-900/30 dark:text-violet-300">
          <Sparkles className="h-4 w-4" />
          {isEnglish ? 'AI-Powered Coding' : 'AI 驱动编程'}
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          Vibe Coding
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
          {isEnglish
            ? '"Vibe Coding" means describing what you want in natural language and letting AI handle the implementation. It\'s not about replacing coding skills — it\'s about amplifying them.'
            : '"Vibe Coding" 意味着用自然语言描述你的需求，让 AI 来处理实现。它不是取代编程能力，而是放大你的编程能力。'}
        </p>
      </motion.div>

      {/* Section Tabs */}
      <div className="mb-10 flex justify-center">
        <div className="inline-flex rounded-2xl border border-slate-200/60 bg-slate-100/50 p-1 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/50">
          <button
            type="button"
            onClick={() => { setSection('intro'); setSearchParams({}); }}
            className={`min-h-[44px] cursor-pointer rounded-xl px-6 py-2.5 text-sm font-semibold transition-all ${
              section === 'intro'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            {isEnglish ? 'What is Vibe Coding' : '什么是 Vibe Coding'}
          </button>
          <button
            type="button"
            onClick={() => { setSection('lab'); setSearchParams({ section: 'lab' }); }}
            className={`min-h-[44px] cursor-pointer rounded-xl px-6 py-2.5 text-sm font-semibold transition-all ${
              section === 'lab'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            {isEnglish ? 'Prompt Arena' : 'Prompt 训练场'}
          </button>
        </div>
      </div>

      {section === 'intro' ? (
        <div className="space-y-12">
          {/* Core Ideas */}
          <motion.section {...staggerContainer}>
            <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
              {isEnglish ? 'Core Ideas' : '核心理念'}
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {CORE_IDEAS.map((idea) => (
                <motion.div
                  key={idea.title}
                  {...fadeIn}
                  className="group rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/80"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-violet-100 p-2.5 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                    <idea.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-base font-bold text-slate-900 dark:text-white">
                    {isEnglish ? idea.titleEn : idea.title}
                  </h3>
                  <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {isEnglish ? idea.descEn : idea.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* How to Vibe Code */}
          <motion.section {...fadeIn}>
            <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
              {isEnglish ? 'How to Vibe Code' : '如何进行 Vibe Coding'}
            </h2>
            <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80">
              <ol className="space-y-4">
                {[
                  {
                    step: isEnglish ? 'Define the Goal' : '明确目标',
                    detail: isEnglish
                      ? 'Clearly describe what you want to build. The more specific your prompt, the better the result.'
                      : '清晰地描述你想构建什么。你的 prompt 越具体，结果就越好。',
                  },
                  {
                    step: isEnglish ? 'Set Constraints' : '设定约束',
                    detail: isEnglish
                      ? 'Specify tech stack, performance requirements, edge cases, and coding style.'
                      : '指定技术栈、性能要求、边界情况和代码风格。',
                  },
                  {
                    step: isEnglish ? 'Review & Iterate' : '审查与迭代',
                    detail: isEnglish
                      ? "Don't blindly accept AI output. Read the code, understand it, test it, and refine through follow-up prompts."
                      : '不要盲目接受 AI 的输出。阅读代码、理解它、测试它，然后通过后续 prompt 进行改进。',
                  },
                  {
                    step: isEnglish ? 'Verify & Ship' : '验证与交付',
                    detail: isEnglish
                      ? 'Run tests, check edge cases, and ensure the code meets your quality standards before committing.'
                      : '运行测试、检查边界情况，确保代码在提交前达到你的质量标准。',
                  },
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{item.step}</div>
                      <div className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.detail}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </motion.section>

          {/* Recommended Tools */}
          <motion.section {...staggerContainer}>
            <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
              {isEnglish ? 'Recommended Tools' : '推荐工具'}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {TOOLS.map((tool) => {
                const colors = TOOL_COLOR_CLASS[tool.color];
                return (
                  <motion.div
                    key={tool.name}
                    {...fadeIn}
                    className="group flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/80"
                  >
                    <div className={`shrink-0 rounded-xl p-2.5 ${colors.bg}`}>
                      <tool.icon className={`h-5 w-5 ${colors.text}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">{tool.name}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {isEnglish ? tool.descEn : tool.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* CTA to Lab */}
          <motion.div {...fadeIn} className="text-center">
            <button
              type="button"
              onClick={() => { setSection('lab'); setSearchParams({ section: 'lab' }); }}
              className="inline-flex items-center gap-2 rounded-full bg-klein-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-klein-500/20 transition-all hover:-translate-y-0.5 hover:bg-klein-700 hover:shadow-klein-500/40"
            >
              <Sparkles className="h-4 w-4" />
              {isEnglish ? 'Start Prompt Training' : '开始 Prompt 训练'}
            </button>
          </motion.div>
        </div>
      ) : (
        <Suspense
          fallback={
            <div
              role="status"
              aria-live="polite"
              className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {isEnglish ? 'Loading Prompt Arena...' : '正在加载 Prompt 训练场...'}
            </div>
          }
        >
          <VibeCodingLab
            onOpenAiGenerator={() => {
              window.location.href = '/practice?tab=ai';
            }}
            onOpenPracticeLibrary={() => {
              window.location.href = '/practice';
            }}
            initialTrack={initialTrack}
          />
        </Suspense>
      )}
    </div>
  );
}
