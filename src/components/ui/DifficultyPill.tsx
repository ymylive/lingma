import { motion } from 'framer-motion';
import { getTone } from '../../design/tones';
import type { ToneName } from '../../design/tones';
import useLowMotionMode from '../../hooks/useLowMotionMode';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type DifficultyPillSize = 'sm' | 'md';

export interface DifficultyPillProps {
  level: DifficultyLevel;
  showStars?: boolean;
  size?: DifficultyPillSize;
  className?: string;
  label?: string;
}

const LEVEL_CONFIG: Record<
  DifficultyLevel,
  { tone: ToneName; stars: number; defaultLabel: string }
> = {
  easy: { tone: 'emerald', stars: 1, defaultLabel: 'Easy' },
  medium: { tone: 'amber', stars: 2, defaultLabel: 'Medium' },
  hard: { tone: 'rose', stars: 3, defaultLabel: 'Hard' },
};

export function DifficultyPill({
  level,
  showStars = true,
  size = 'sm',
  className,
  label,
}: DifficultyPillProps) {
  const cfg = LEVEL_CONFIG[level];
  const tone = getTone(cfg.tone);
  const lowMotion = useLowMotionMode();
  const sizeClasses =
    size === 'md'
      ? 'px-3 py-1.5 text-sm gap-2'
      : 'px-2.5 py-1 text-xs gap-1.5';

  const classes = [
    'inline-flex items-center rounded-full font-semibold border transition-transform duration-200 ease-out',
    sizeClasses,
    tone.bg,
    tone.text,
    tone.border,
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const whileHover = lowMotion
    ? undefined
    : { y: -1, transition: { duration: 0.18, ease: 'easeOut' as const } };

  const starNodes = showStars ? (
    <span aria-hidden="true" className="tracking-tighter inline-flex">
      {Array.from({ length: cfg.stars }).map((_, idx) =>
        lowMotion ? (
          <span key={idx}>★</span>
        ) : (
          <motion.span
            key={idx}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.12,
              delay: idx * 0.06,
              ease: 'easeOut',
            }}
          >
            ★
          </motion.span>
        ),
      )}
    </span>
  ) : null;

  return (
    <motion.span className={classes} whileHover={whileHover}>
      {starNodes}
      {label ?? cfg.defaultLabel}
    </motion.span>
  );
}
