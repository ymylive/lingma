import { motion } from 'framer-motion';
import useLowMotionMode from '../../../hooks/useLowMotionMode';

export type PointerTone =
  | 'klein'
  | 'pine'
  | 'rose'
  | 'emerald'
  | 'amber'
  | 'slate';

const TONE_CLASSES: Record<
  PointerTone,
  { chip: string; triangle: string }
> = {
  klein: {
    chip: 'bg-klein-500 text-white',
    triangle: 'border-t-klein-500',
  },
  pine: {
    chip: 'bg-pine-500 text-slate-900',
    triangle: 'border-t-pine-500',
  },
  rose: {
    chip: 'bg-rose-500 text-white',
    triangle: 'border-t-rose-500',
  },
  emerald: {
    chip: 'bg-emerald-500 text-white',
    triangle: 'border-t-emerald-500',
  },
  amber: {
    chip: 'bg-amber-400 text-slate-900',
    triangle: 'border-t-amber-400',
  },
  slate: {
    chip: 'bg-slate-500 text-white',
    triangle: 'border-t-slate-500',
  },
};

export type PointerPlacement = 'top' | 'bottom';

export interface PointerLabelProps {
  label: string;
  tone?: PointerTone;
  placement?: PointerPlacement;
  offset?: number;
  className?: string;
}

/**
 * A floating arrow-chip label pointing at a target element.
 * Parent must be `position: relative`. The label anchors to the
 * parent's top-center (default) or bottom-center and points to the
 * parent element with a small triangle.
 */
export function PointerLabel({
  label,
  tone = 'klein',
  placement = 'top',
  offset = 0,
  className,
}: PointerLabelProps) {
  const lowMotion = useLowMotionMode();
  const tones = TONE_CLASSES[tone];
  const isTop = placement === 'top';

  return (
    <motion.div
      layout={!lowMotion}
      transition={{ type: 'spring', stiffness: 280, damping: 26, mass: 0.8 }}
      className={
        'pointer-events-none absolute left-1/2 -translate-x-1/2 flex flex-col items-center z-20 ' +
        (isTop ? '' : 'flex-col-reverse ') +
        (className ?? '')
      }
      style={
        isTop
          ? { top: -(28 + offset) }
          : { bottom: -(28 + offset) }
      }
    >
      <span
        className={
          'rounded-md px-1.5 py-0.5 text-[10px] font-mono font-bold shadow-sm shadow-black/20 ' +
          tones.chip
        }
      >
        {label}
      </span>
      <div
        className={
          'w-0 h-0 ' +
          (isTop
            ? 'border-l-[5px] border-r-[5px] border-t-[6px] border-transparent ' + tones.triangle
            : 'border-l-[5px] border-r-[5px] border-b-[6px] border-transparent ' +
              tones.triangle.replace('border-t-', 'border-b-'))
        }
      />
    </motion.div>
  );
}
