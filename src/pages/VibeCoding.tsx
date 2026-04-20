import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bot,
  Code2,
  Lightbulb,
  MessageSquareText,
  Target,
  Terminal,
  Wand2,
  Wrench,
  Zap,
} from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';
import useLowMotionMode from '../hooks/useLowMotionMode';
import {
  GlassCard,
  PageHero,
  SectionHeader,
  Tabs,
  getTone,
} from '../components/ui';
import type { TabItem, ToneName } from '../components/ui';
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

interface ToolItem {
  name: string;
  desc: string;
  descEn: string;
  icon: typeof Terminal;
  tone: ToneName;
}

const TOOLS: ToolItem[] = [
  {
    name: 'Cursor',
    desc: 'AI 原生代码编辑器，支持自然语言编辑、代码补全和对话式编程',
    descEn: 'AI-native code editor with natural language editing, completion, and conversational coding',
    icon: Terminal,
    tone: 'indigo',
  },
  {
    name: 'Claude Code',
    desc: 'Anthropic 的 CLI 编程助手，擅长复杂代码理解和多文件重构',
    descEn: "Anthropic's CLI coding assistant excelling at complex code comprehension and multi-file refactoring",
    icon: Bot,
    tone: 'amber',
  },
  {
    name: 'GitHub Copilot',
    desc: 'GitHub 的 AI 编程伙伴，内嵌于 VS Code 等主流编辑器',
    descEn: "GitHub's AI pair programmer embedded in VS Code and major IDEs",
    icon: Code2,
    tone: 'emerald',
  },
  {
    name: 'Windsurf',
    desc: '基于 Codeium 的 AI IDE，提供流畅的代码生成和上下文感知',
    descEn: "Codeium's AI IDE offering smooth code generation and context awareness",
    icon: Zap,
    tone: 'rose',
  },
];

interface CoreIdea {
  icon: typeof MessageSquareText;
  title: string;
  titleEn: string;
  desc: string;
  descEn: string;
  tone: ToneName;
}

const CORE_IDEAS: CoreIdea[] = [
  {
    icon: MessageSquareText,
    title: '自然语言驱动',
    titleEn: 'Natural Language Driven',
    desc: '用清晰的 prompt 描述需求，让 AI 生成代码。核心技能是"如何准确描述你想要什么"。',
    descEn: 'Describe your requirements with clear prompts and let AI generate code. The core skill is "how to accurately describe what you want".',
    tone: 'klein',
  },
  {
    icon: Wrench,
    title: '迭代式构建',
    titleEn: 'Iterative Building',
    desc: '不需要一步到位。先让 AI 生成初版，再通过对话不断修正、完善和扩展功能。',
    descEn: "You don't need to get it right in one shot. Let AI generate a first draft, then iteratively refine and extend through conversation.",
    tone: 'indigo',
  },
  {
    icon: Lightbulb,
    title: '理解优于背诵',
    titleEn: 'Understanding Over Memorization',
    desc: '不用死记语法，但必须理解逻辑。你需要能判断 AI 生成的代码是否正确、是否高效。',
    descEn: "No need to memorize syntax, but you must understand the logic. You need to judge whether AI-generated code is correct and efficient.",
    tone: 'amber',
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

  const revealUp = lowMotionMode
    ? {
        initial: false as const,
        animate: { opacity: 1 },
        transition: { duration: 0 },
      }
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3, ease: 'easeOut' as const },
      };

  const tabs: TabItem<PageSection>[] = useMemo(() => [
    {
      id: 'intro',
      label: isEnglish ? 'What is Vibe Coding' : '什么是 Vibe Coding',
      icon: <Lightbulb className="h-4 w-4" strokeWidth={1.75} aria-hidden />,
    },
    {
      id: 'lab',
      label: isEnglish ? 'Prompt Arena' : 'Prompt 训练场',
      icon: <Target className="h-4 w-4" strokeWidth={1.75} aria-hidden />,
    },
  ], [isEnglish]);

  const handleSectionChange = (next: PageSection) => {
    setSection(next);
    if (next === 'lab') {
      setSearchParams({ section: 'lab' });
    } else {
      setSearchParams({});
    }
  };

  const steps = [
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
  ];

  return (
    <div className="min-h-screen pb-12">
      <PageHero
        eyebrow="Vibe Coding"
        title={isEnglish ? 'Code With AI Collaboration' : '与 AI 协作编程'}
        description={
          isEnglish
            ? '"Vibe Coding" means describing what you want in natural language and letting AI handle the implementation. It amplifies your coding ability rather than replacing it.'
            : '用自然语言描述需求，让 AI 放大你的编程能力。Vibe Coding 不是取代程序员，而是重塑协作方式。'
        }
        primaryAction={{
          label: isEnglish ? 'Open AI Practice' : '开始练习',
          to: '/practice',
          icon: <Wand2 className="h-5 w-5" strokeWidth={1.75} aria-hidden />,
        }}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative z-10 mb-14 flex justify-center sm:mb-16">
          <Tabs
            items={tabs}
            value={section}
            onChange={handleSectionChange}
            variant="pill"
            size="md"
            ariaLabel={isEnglish ? 'Vibe Coding sections' : 'Vibe Coding 分区'}
          />
        </div>

        {section === 'intro' ? (
          <div className="relative z-10 space-y-24 sm:space-y-32">
            {/* Intro: Tools (left) + Core Ideas (right) */}
            <section>
              <SectionHeader
                eyebrow={isEnglish ? 'Intro' : '入门'}
                title={isEnglish ? 'Tools & Core Ideas' : '工具与核心理念'}
                description={
                  isEnglish
                    ? 'Meet the modern AI coding workspace, then internalise the three habits that make it pay off.'
                    : '先了解现代 AI 编程工作区，再内化三条让它真正有用的习惯。'
                }
              />

              <div className="grid gap-6 lg:grid-cols-2">
                {/* Tools */}
                <motion.div {...revealUp}>
                  <GlassCard variant="soft" padding="md" glow="klein" hoverable={false} className="h-full">
                    <div className="mb-6 flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-klein-200/60 bg-klein-50/70 text-klein-600 dark:border-klein-800/50 dark:bg-klein-950/40 dark:text-klein-300">
                        <Wrench className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                      </span>
                      <div>
                        <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                          {isEnglish ? 'Recommended Tools' : '推荐工具'}
                        </h3>
                        <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                          {isEnglish ? 'The editors & agents engineers actually use today.' : '当代工程师日常使用的编辑器与智能体。'}
                        </p>
                      </div>
                    </div>

                    <ul className="space-y-3">
                      {TOOLS.map((tool) => {
                        const tone = getTone(tool.tone);
                        const Icon = tool.icon;
                        return (
                          <li
                            key={tool.name}
                            className="flex items-start gap-4 rounded-xl border border-slate-200/60 bg-white/60 p-4 transition-all duration-200 hover:shadow-md dark:border-slate-700/50 dark:bg-slate-900/50"
                          >
                            <span
                              className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${tone.bg} ${tone.text} ${tone.border}`}
                            >
                              <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                            </span>
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-900 dark:text-white">{tool.name}</div>
                              <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                {isEnglish ? tool.descEn : tool.desc}
                              </p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </GlassCard>
                </motion.div>

                {/* Core Ideas */}
                <motion.div {...revealUp}>
                  <GlassCard variant="soft" padding="md" glow="indigo" hoverable={false} className="h-full">
                    <div className="mb-6 flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-200/60 bg-indigo-50/70 text-indigo-600 dark:border-indigo-800/50 dark:bg-indigo-950/40 dark:text-indigo-300">
                        <Lightbulb className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                      </span>
                      <div>
                        <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                          {isEnglish ? 'Core Ideas' : '核心理念'}
                        </h3>
                        <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                          {isEnglish ? 'Three habits that separate prompt noise from craft.' : '区分"试试看"与"真做事"的三条习惯。'}
                        </p>
                      </div>
                    </div>

                    <ul className="space-y-3">
                      {CORE_IDEAS.map((idea) => {
                        const tone = getTone(idea.tone);
                        const Icon = idea.icon;
                        return (
                          <li
                            key={idea.title}
                            className="flex items-start gap-4 rounded-xl border border-slate-200/60 bg-white/60 p-4 transition-all duration-200 hover:shadow-md dark:border-slate-700/50 dark:bg-slate-900/50"
                          >
                            <span
                              className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${tone.bg} ${tone.text} ${tone.border}`}
                            >
                              <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                            </span>
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-900 dark:text-white">
                                {isEnglish ? idea.titleEn : idea.title}
                              </div>
                              <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                {isEnglish ? idea.descEn : idea.desc}
                              </p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </GlassCard>
                </motion.div>
              </div>
            </section>

            {/* How to Vibe Code */}
            <section>
              <SectionHeader
                eyebrow={isEnglish ? 'Workflow' : '工作流'}
                title={isEnglish ? 'How to Vibe Code' : '如何进行 Vibe Coding'}
                description={
                  isEnglish
                    ? 'A repeatable four-step loop — specify, constrain, review, ship.'
                    : '可复用的四步循环 —— 明确、约束、审阅、交付。'
                }
              />

              <motion.div {...revealUp}>
                <GlassCard variant="soft" padding="lg" hoverable={false}>
                  <ol className="grid gap-5 sm:grid-cols-2">
                    {steps.map((item, i) => (
                      <li key={item.step} className="flex gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-klein-200/60 bg-klein-50/70 text-sm font-bold text-klein-600 dark:border-klein-800/50 dark:bg-klein-950/40 dark:text-klein-300">
                          {i + 1}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 dark:text-white">{item.step}</div>
                          <div className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.detail}</div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </GlassCard>
              </motion.div>
            </section>

            {/* CTA to Lab */}
            <section>
              <motion.div {...revealUp} className="text-center">
                <button
                  type="button"
                  onClick={() => handleSectionChange('lab')}
                  className="inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-2xl bg-klein-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-klein-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-klein-700 hover:shadow-klein-600/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klein-500/60"
                >
                  <Wand2 className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  {isEnglish ? 'Enter Prompt Arena' : '进入 Prompt 训练场'}
                </button>
              </motion.div>
            </section>
          </div>
        ) : (
          <div className="relative z-10">
            <SectionHeader
              eyebrow={isEnglish ? 'Lab' : '训练场'}
              title={isEnglish ? 'Prompt Arena' : 'Prompt 训练场'}
              description={
                isEnglish
                  ? 'Work through real prompt scenarios and compare AI-assisted iterations.'
                  : '在真实 prompt 场景中练习，比较多轮 AI 协作结果。'
              }
            />

            <Suspense
              fallback={
                <GlassCard
                  variant="soft"
                  padding="lg"
                  hoverable={false}
                  role="status"
                  aria-live="polite"
                  className="text-center text-sm text-slate-500 dark:text-slate-300"
                >
                  {isEnglish ? 'Loading Prompt Arena...' : '正在加载 Prompt 训练场...'}
                </GlassCard>
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
          </div>
        )}
      </div>

    </div>
  );
}
