import { motion } from 'framer-motion';
import useLowMotionMode from '../../../hooks/useLowMotionMode';

export type CellTone =
  | 'neutral'
  | 'klein'
  | 'pine'
  | 'emerald'
  | 'amber'
  | 'rose'
  | 'ghost';

const TONE_CLASSES: Record<CellTone, string> = {
  neutral:
    'bg-white text-slate-800 border-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:border-slate-500',
  klein: 'bg-klein-500 text-white border-klein-600',
  pine: 'bg-pine-500 text-slate-900 border-pine-600',
  emerald: 'bg-emerald-500 text-white border-emerald-600',
  amber: 'bg-amber-400 text-slate-900 border-amber-500',
  rose: 'bg-rose-500 text-white border-rose-600',
  ghost:
    'bg-transparent text-slate-500 border-dashed border-slate-400/60 dark:border-slate-500/60',
};

export interface ArrayCellProps {
  value: number | string;
  index?: number;
  tone?: CellTone;
  active?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showIndex?: boolean;
  indexPlacement?: 'below' | 'above';
  children?: never;
}

const SIZE: Record<NonNullable<ArrayCellProps['size']>, string> = {
  sm: 'w-10 h-10 text-sm',
  md: 'w-12 h-12 text-base',
  lg: 'w-14 h-14 text-lg',
};

/**
 * One visual array cell: fixed-width box with a mono value and optional index.
 * Used by Queue slot rendering and other array-style scenes.
 */
export function ArrayCell({
  value,
  index,
  tone = 'neutral',
  active,
  size = 'md',
  showIndex = true,
  indexPlacement = 'below',
}: ArrayCellProps) {
  const lowMotion = useLowMotionMode();

  return (
    <div className="relative flex flex-col items-center">
      {showIndex && indexPlacement === 'above' && typeof index === 'number' && (
        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1">
          [{index}]
        </span>
      )}
      <motion.div
        layout={!lowMotion}
        transition={{ type: 'spring', stiffness: 320, damping: 28, mass: 0.7 }}
        animate={
          lowMotion
            ? undefined
            : {
                scale: active ? 1.06 : 1,
              }
        }
        className={
          'flex items-center justify-center rounded-xl border-2 font-mono font-semibold transition-colors duration-200 ' +
          TONE_CLASSES[tone] +
          ' ' +
          SIZE[size] +
          (active ? ' shadow-md shadow-klein-500/30 ring-2 ring-klein-400/50' : '')
        }
      >
        {value}
      </motion.div>
      {showIndex && indexPlacement === 'below' && typeof index === 'number' && (
        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1">
          [{index}]
        </span>
      )}
    </div>
  );
}
