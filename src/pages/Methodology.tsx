import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  Copy,
  Layers,
  Lightbulb,
  List,
  Sparkles,
  TriangleAlert,
  X,
} from 'lucide-react';
import { methodologyUnits } from '../data/methodologyUnits';
import { useI18n } from '../contexts/I18nContext';
import { GlassCard, SectionHeader, getTone } from '../components/ui';

/* ─── Sidebar TOC ─── */
function MethodologySidebar({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const { t } = useI18n();
  return (
    <nav className="space-y-1">
      {methodologyUnits.map((unit, idx) => {
        const isActive = activeId === unit.id;
        return (
          <div key={unit.id}>
            <button
              type="button"
              onClick={() => onSelect(unit.id)}
              className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-klein-50 text-klein-700 dark:bg-klein-900/30 dark:text-klein-300'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50'
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                  isActive
                    ? 'bg-klein-500 text-white'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                <Layers className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              </span>
              <span className="text-[11px] font-semibold tabular-nums text-slate-400 dark:text-slate-500">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <span className="truncate">{t(unit.title)}</span>
            </button>
            {isActive && (
              <div className="ml-9 mt-1 space-y-0.5 border-l-2 border-klein-200/60 pl-3 dark:border-klein-800/60">
                {unit.points.map((pt, pi) => (
                  <button
                    key={pi}
                    type="button"
                    onClick={() => onSelect(`${unit.id}-${pi}`)}
                    className="block min-h-11 w-full cursor-pointer rounded-lg px-2 py-1.5 text-left text-xs leading-5 text-slate-500 transition-colors duration-200 hover:text-klein-600 dark:text-slate-500 dark:hover:text-klein-400 lg:min-h-0 lg:truncate"
                  >
                    {t(pt.title)}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

/* ─── Mobile FAB + Overlay TOC ─── */
function MobileTOC({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  const handleSelect = (id: string) => {
    onSelect(id);
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-klein-600 text-white shadow-lg shadow-klein-500/30 transition-all duration-200 hover:scale-105 hover:bg-klein-700 active:scale-95 lg:hidden"
        aria-label={t('目录')}
      >
        <List className="h-6 w-6" strokeWidth={1.75} aria-hidden />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[70vh] overflow-hidden rounded-t-3xl lg:hidden"
            >
              <GlassCard
                variant="frosted"
                padding="md"
                hoverable={false}
                className="h-full overflow-y-auto rounded-b-none rounded-t-3xl"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                    <Compass className="h-5 w-5 text-klein-500" strokeWidth={1.75} aria-hidden />
                    {t('目录')}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close table of contents"
                    className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-slate-500 transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <X className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                  </button>
                </div>
                <MethodologySidebar activeId={activeId} onSelect={handleSelect} />
              </GlassCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Code block with copy button ─── */
function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const { t } = useI18n();

  const onCopy = useCallback(async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      }
    } catch {
      setCopied(false);
    }
  }, [code]);

  return (
    <GlassCard variant="frosted" padding="none" hoverable={false} className="mt-4 group">
      <button
        type="button"
        onClick={onCopy}
        aria-label={t('复制代码')}
        className="absolute right-2 top-2 z-10 inline-flex min-h-[32px] items-center gap-1 rounded-lg border border-slate-200/60 bg-white/70 px-2 py-1 text-xs font-medium text-slate-600 opacity-0 backdrop-blur-sm transition-all duration-200 hover:text-klein-600 group-hover:opacity-100 focus-visible:opacity-100 dark:border-slate-700/60 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:text-klein-400"
      >
        {copied ? (
          <>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" strokeWidth={1.75} aria-hidden />
            {t('已复制')}
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
            {t('复制')}
          </>
        )}
      </button>
      <pre className="overflow-x-auto whitespace-pre-wrap px-4 py-4 text-sm leading-6 text-slate-700 dark:text-slate-300 sm:text-xs">
        {code}
      </pre>
    </GlassCard>
  );
}

/* ─── Motion variants ─── */
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
};

/* ─── Main Page ─── */
export default function Methodology() {
  const { t, isEnglish } = useI18n();
  const [activeId, setActiveId] = useState(methodologyUnits[0].id);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  const scrollTo = useCallback((id: string) => {
    const el = sectionRefs.current.get(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleSelect = useCallback(
    (id: string) => {
      scrollTo(id);
    },
    [scrollTo],
  );

  /* IntersectionObserver for scroll-highlight */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-section-id');
            if (id) setActiveId(id);
          }
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 },
    );
    sectionRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const registerRef = useCallback((id: string, el: HTMLElement | null) => {
    if (el) sectionRefs.current.set(id, el);
    else sectionRefs.current.delete(id);
  }, []);

  const emeraldTone = getTone('emerald');
  const amberTone = getTone('amber');

  return (
    <div className="page-safe-top min-h-screen pb-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero */}
        <div className="mb-12">
          <Link
            to="/book"
            className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors duration-200 hover:text-klein-600 dark:text-slate-400 dark:hover:text-klein-400"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            {isEnglish ? 'Back to Tutorials' : '返回教程'}
          </Link>
          <div className="flex flex-col gap-3">
            <span className="inline-flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              <span className="h-px w-6 bg-current opacity-50" aria-hidden />
              03 · {isEnglish ? 'METHODOLOGY · VIBE CODING' : '方法论 · VIBE CODING'}
            </span>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-klein-500 to-klein-600 shadow-sm shadow-klein-500/20">
                <BookOpen className="h-7 w-7 text-white" strokeWidth={1.75} aria-hidden />
              </div>
              <div>
                <h1 className="font-serif text-4xl font-medium tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                  {isEnglish ? (
                    <><em className="italic font-normal">Vibe</em> Coding Methodology</>
                  ) : (
                    <>Vibe Coding <em className="italic font-normal">方法论</em></>
                  )}
                </h1>
                <p className="mt-2 text-base leading-relaxed text-slate-500 dark:text-slate-400">
                  {isEnglish
                    ? '10 units covering the professional workflow for AI-assisted development'
                    : '10 个学习单元，系统掌握 AI 辅助开发的专业工作流'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Grid: Sidebar + Content */}
        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-10">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <GlassCard variant="soft" padding="sm" hoverable={false}>
                <MethodologySidebar activeId={activeId} onSelect={handleSelect} />
              </GlassCard>
            </div>
          </aside>

          {/* Content */}
          <div className="min-w-0 space-y-20">
            {methodologyUnits.map((unit, unitIdx) => (
              <motion.section
                key={unit.id}
                ref={(el) => registerRef(unit.id, el)}
                data-section-id={unit.id}
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-10%' }}
                className="scroll-mt-24"
              >
                {/* Chapter heading */}
                <motion.div variants={fadeUp} className="mb-10">
                  <SectionHeader
                    align="left"
                    size="md"
                    eyebrow={
                      <span className="inline-flex items-center gap-1.5">
                        <unit.icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                        {isEnglish ? `Chapter ${unitIdx + 1}` : `第 ${unitIdx + 1} 章`}
                      </span>
                    }
                    title={t(unit.title)}
                    description={t(unit.summary)}
                    className="mb-0"
                  />
                </motion.div>

                {/* Overview */}
                <motion.p
                  variants={fadeUp}
                  className="mb-8 text-base leading-relaxed text-slate-700 dark:text-slate-300"
                >
                  {t(unit.overview)}
                </motion.p>

                {/* Knowledge points */}
                <div className="space-y-6">
                  {unit.points.map((pt, pi) => (
                    <motion.div
                      key={pi}
                      id={`${unit.id}-${pi}`}
                      ref={(el) => registerRef(`${unit.id}-${pi}`, el)}
                      data-section-id={unit.id}
                      variants={fadeUp}
                      className="scroll-mt-24"
                    >
                      <GlassCard variant="frosted" padding="lg" hoverable={false}>
                        <div className="mb-3 flex items-center gap-3">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-klein-50 text-xs font-bold text-klein-700 ring-1 ring-inset ring-klein-200/60 dark:bg-klein-900/30 dark:text-klein-300 dark:ring-klein-800/50">
                            {pi + 1}
                          </span>
                          <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                            {t(pt.title)}
                          </h3>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                          {t(pt.detail)}
                        </p>
                        {pt.example && <CodeBlock code={t(pt.example)} />}
                        {pt.tips && (
                          <div className="mt-4 flex items-start gap-2 rounded-xl bg-klein-50/60 px-4 py-3 dark:bg-klein-900/20">
                            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-klein-500" strokeWidth={1.75} aria-hidden />
                            <p className="text-sm leading-relaxed text-klein-700 dark:text-klein-300">
                              {t(pt.tips)}
                            </p>
                          </div>
                        )}
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>

                {/* Practice callout */}
                <motion.div variants={fadeUp} className="mt-8">
                  <GlassCard
                    variant="soft"
                    padding="md"
                    hoverable={false}
                    className={`${emeraldTone.bg} ${emeraldTone.border}`}
                  >
                    <div className={`section-label ${emeraldTone.text} flex items-center gap-1.5`}>
                      <Sparkles className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                      {t('实战练习')}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-emerald-900 dark:text-emerald-100">
                      {t(unit.practice)}
                    </p>
                    {unit.relatedTrack && (
                      <Link
                        to={`/practice?tab=vibe&track=${unit.relatedTrack}`}
                        className="mt-4 inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-500 hover:shadow-md"
                      >
                        {t('前往 Prompt Arena 练习')}
                        <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                      </Link>
                    )}
                  </GlassCard>
                </motion.div>

                {/* Pitfalls callout */}
                <motion.div variants={fadeUp} className="mt-4">
                  <GlassCard
                    variant="soft"
                    padding="md"
                    hoverable={false}
                    className={`${amberTone.bg} ${amberTone.border}`}
                  >
                    <div className={`section-label ${amberTone.text} flex items-center gap-1.5`}>
                      <TriangleAlert className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                      {t('常见误区')}
                    </div>
                    <ul className="mt-2 space-y-1.5">
                      {unit.pitfalls.map((p) => (
                        <li
                          key={p}
                          className="flex gap-2 text-sm leading-relaxed text-amber-900 dark:text-amber-100"
                        >
                          <span className="mt-2 block h-1 w-1 shrink-0 rounded-full bg-amber-500/70" aria-hidden />
                          <span>{t(p)}</span>
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                </motion.div>
              </motion.section>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile FAB TOC */}
      <MobileTOC activeId={activeId} onSelect={handleSelect} />
    </div>
  );
}
