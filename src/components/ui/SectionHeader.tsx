import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import useLowMotionMode from '../../hooks/useLowMotionMode';

export type SectionHeaderAlign = 'left' | 'center';
export type SectionHeaderSize = 'sm' | 'md' | 'lg';

export interface SectionHeaderProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: SectionHeaderAlign;
  size?: SectionHeaderSize;
  /** Optional slot rendered on the right side when align is 'left'. */
  rightSlot?: ReactNode;
  className?: string;
}

const TITLE_SIZES: Record<SectionHeaderSize, string> = {
  sm: 'text-xl sm:text-2xl',
  md: 'text-2xl sm:text-3xl',
  lg: 'text-3xl sm:text-4xl md:text-5xl',
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
  size = 'md',
  rightSlot,
  className,
}: SectionHeaderProps) {
  const lowMotion = useLowMotionMode();
  const wrapperAlign = align === 'center' ? 'text-center' : 'text-left';
  const wrapperClasses = ['mb-14 sm:mb-16', wrapperAlign, className ?? '']
    .filter(Boolean)
    .join(' ');

  const block = (
    <div>
      {eyebrow ? (
        <div className="section-label mb-3">{eyebrow}</div>
      ) : null}
      <h2
        className={`${TITLE_SIZES[size]} font-bold tracking-tight text-slate-900 dark:text-white`}
      >
        {title}
      </h2>
      {description ? (
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-3">
          {description}
        </p>
      ) : null}
    </div>
  );

  const motionProps = lowMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.3 },
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
      };

  if (align === 'left' && rightSlot) {
    return (
      <motion.div className={wrapperClasses} {...motionProps}>
        <div className="flex items-end justify-between gap-6">
          {block}
          <div className="shrink-0">{rightSlot}</div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className={wrapperClasses} {...motionProps}>
      {block}
    </motion.div>
  );
}
