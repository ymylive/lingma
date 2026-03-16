import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, BookOpen, List, Lightbulb, TriangleAlert, X } from 'lucide-react';
import { methodologyUnits } from '../data/methodologyUnits';
import { useI18n } from '../contexts/I18nContext';

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
              className={`flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all ${
                isActive
                  ? 'bg-klein-50 text-klein-700 dark:bg-klein-900/30 dark:text-klein-300'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50'
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  isActive
                    ? 'bg-klein-500 text-white'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {idx + 1}
              </span>
              <span className="truncate">{t(unit.title)}</span>
            </button>
            {isActive && (
              <div className="ml-9 mt-1 space-y-1 border-l-2 border-klein-200 pl-3 dark:border-klein-800 lg:space-y-0.5">
                {unit.points.map((pt, pi) => (
                  <button
                    key={pi}
                    type="button"
                    onClick={() => onSelect(`${unit.id}-${pi}`)}
                    className="block min-h-11 w-full cursor-pointer rounded-xl px-2 py-2 text-left text-sm leading-5 text-slate-500 transition-colors hover:text-klein-600 dark:text-slate-500 dark:hover:text-klein-400 lg:min-h-0 lg:rounded-none lg:px-0 lg:py-1 lg:text-xs lg:leading-4 lg:truncate"
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
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-klein-500 text-white shadow-lg shadow-klein-500/30 transition-transform hover:scale-105 active:scale-95 lg:hidden"
        aria-label={t('目录')}
      >
        <List className="h-6 w-6" />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[70vh] overflow-y-auto rounded-t-3xl border-t border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900 lg:hidden"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('目录')}</h3>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close table of contents"
                  className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-slate-400 transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <MethodologySidebar activeId={activeId} onSelect={handleSelect} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Chapter Content ─── */
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

  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Hero */}
        <div className="mb-12">
          <Link
            to="/book"
            className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-klein-600 dark:text-slate-400 dark:hover:text-klein-400"
          >
            <ArrowLeft className="h-4 w-4" />
            {isEnglish ? 'Back to Tutorials' : '返回教程'}
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-klein-500 to-klein-600 shadow-lg shadow-klein-500/20">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                {isEnglish ? 'Vibe Coding Methodology' : 'Vibe Coding 方法论'}
              </h1>
              <p className="mt-1 text-base text-slate-500 dark:text-slate-400">
                {isEnglish
                  ? '10 units covering the professional workflow for AI-assisted development'
                  : '10 个学习单元，系统掌握 AI 辅助开发的专业工作流'}
              </p>
            </div>
          </div>
        </div>

        {/* Grid: Sidebar + Content */}
        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-[28px] border border-slate-200/60 bg-white/70 p-4 shadow-sm backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-800/70">
              <MethodologySidebar activeId={activeId} onSelect={handleSelect} />
            </div>
          </aside>

          {/* Content */}
          <div className="min-w-0 space-y-16">
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
                <motion.div variants={fadeUp} className="mb-8 flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-klein-50 dark:bg-klein-900/30">
                    <unit.icon className="h-6 w-6 text-klein-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-klein-500">
                      {isEnglish ? `Chapter ${unitIdx + 1}` : `第 ${unitIdx + 1} 章`}
                    </p>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {t(unit.title)}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {t(unit.summary)}
                    </p>
                  </div>
                </motion.div>

                {/* Overview */}
                <motion.p
                  variants={fadeUp}
                  className="mb-8 text-base leading-7 text-slate-700 dark:text-slate-300"
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
                      className="scroll-mt-24 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8"
                    >
                      <div className="mb-3 flex items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-klein-100 text-xs font-bold text-klein-700 dark:bg-klein-900/40 dark:text-klein-300">
                          {pi + 1}
                        </span>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {t(pt.title)}
                        </h3>
                      </div>
                      <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                        {t(pt.detail)}
                      </p>
                      {pt.example && (
                        <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-xl bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700 dark:bg-slate-900 dark:text-slate-300 sm:text-xs">
                          {pt.example}
                        </pre>
                      )}
                      {pt.tips && (
                        <div className="mt-4 flex items-start gap-2 rounded-xl bg-klein-50/60 px-4 py-3 dark:bg-klein-900/20">
                          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-klein-500" />
                          <p className="text-sm leading-6 text-klein-700 dark:text-klein-300 sm:text-xs sm:leading-5">
                            {t(pt.tips)}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Practice callout */}
                <motion.div
                  variants={fadeUp}
                  className="mt-8 rounded-[28px] border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900/50 dark:bg-emerald-950/20"
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
                    {t('实战练习')}
                  </div>
                  <p className="mt-2 text-sm leading-7 text-emerald-900 dark:text-emerald-100">
                    {t(unit.practice)}
                  </p>
                  {unit.relatedTrack && (
                    <Link
                      to={`/practice?tab=vibe&track=${unit.relatedTrack}`}
                      className="mt-4 inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-emerald-500"
                    >
                      {t('前往 Prompt Arena 练习')}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </motion.div>

                {/* Pitfalls callout */}
                <motion.div
                  variants={fadeUp}
                  className="mt-4 rounded-[28px] border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/50 dark:bg-amber-950/20"
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300">
                    <TriangleAlert className="h-3.5 w-3.5" />
                    {t('常见误区')}
                  </div>
                  <ul className="mt-2 space-y-1.5">
                    {unit.pitfalls.map((p) => (
                      <li
                        key={p}
                        className="text-sm leading-7 text-amber-900 dark:text-amber-100"
                      >
                        · {t(p)}
                      </li>
                    ))}
                  </ul>
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
