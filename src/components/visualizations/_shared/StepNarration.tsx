import { AnimatePresence, motion } from 'framer-motion';
import useLowMotionMode from '../../../hooks/useLowMotionMode';

export interface StepNarrationProps {
  description: string;
  lineNumber?: number;
  totalSteps: number;
  currentIndex: number;
  className?: string;
}

export function StepNarration({
  description,
  lineNumber,
  totalSteps,
  currentIndex,
  className,
}: StepNarrationProps) {
  const lowMotion = useLowMotionMode();

  const wrapperClass = [
    'flex items-start justify-between gap-3 rounded-2xl border border-slate-200/60 bg-white/55 backdrop-blur-md px-4 py-3 dark:border-slate-700/40 dark:bg-slate-900/50',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const displayTotal = Math.max(totalSteps, 0);
  const displayCurrent =
    displayTotal > 0 ? Math.min(Math.max(currentIndex, 0) + 1, displayTotal) : 0;

  const body = (
    <div className="flex flex-1 items-center gap-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
      {typeof lineNumber === 'number' ? (
        <span className="inline-flex shrink-0 items-center rounded-md bg-klein-500/10 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-klein-600 dark:text-klein-200">
          L{lineNumber}
        </span>
      ) : null}
      <span className="min-w-0 flex-1">{description}</span>
    </div>
  );

  return (
    <div className={wrapperClass} aria-live="polite">
      <div className="min-w-0 flex-1">
        {lowMotion ? (
          body
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {body}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
      <span className="inline-flex shrink-0 items-center rounded-full bg-slate-900/5 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-100/10 dark:text-slate-300">
        Step {displayCurrent} / {displayTotal}
      </span>
    </div>
  );
}
