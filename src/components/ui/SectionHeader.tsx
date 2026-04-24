import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import useLowMotionMode from '../../hooks/useLowMotionMode';
import { Eyebrow } from './Eyebrow';

export type SectionHeaderAlign = 'left' | 'center';
export type SectionHeaderSize = 'sm' | 'md' | 'lg';
export type SectionHeaderFont = 'sans' | 'serif';

export interface SectionHeaderProps {
  /** Deprecated — use `marker` for the editorial eyebrow. Still honored when
   *  `marker` is absent, so existing call-sites keep working. */
  eyebrow?: ReactNode;
  /** Editorial eyebrow: pass `{ num: '01', label: 'PATHS' }` for the full marker,
   *  or `{ label: 'PATHS' }` for label-only. */
  marker?: { num?: string; label: ReactNode; variant?: 'default' | 'inverse' | 'brand' };
  title: ReactNode;
  description?: ReactNode;
  align?: SectionHeaderAlign;
  size?: SectionHeaderSize;
  /** Font family for the title. `serif` = Source Serif 4 editorial display. */
  font?: SectionHeaderFont;
  /** Optional slot rendered on the right side when align is 'left'. */
  rightSlot?: ReactNode;
  className?: string;
}

const TITLE_SIZES: Record<SectionHeaderSize, string> = {
  sm: 'text-xl sm:text-2xl',
  md: 'text-2xl sm:text-3xl lg:text-4xl',
  lg: 'text-3xl sm:text-4xl lg:text-5xl',
};

export function SectionHeader({
  eyebrow,
  marker,
  title,
  description,
  align = 'center',
  size = 'md',
  font = 'serif',
  rightSlot,
  className,
}: SectionHeaderProps) {
  const lowMotion = useLowMotionMode();
  const wrapperAlign = align === 'center' ? 'text-center' : 'text-left';
  const wrapperClasses = ['mb-10 sm:mb-14', wrapperAlign, className ?? '']
    .filter(Boolean)
    .join(' ');

  const fontClass = font === 'serif' ? 'font-serif font-medium' : 'font-sans font-bold';
  const containerAlign = align === 'center' ? 'items-center' : 'items-start';

  const block = (
    <div className={`flex flex-col gap-3 ${containerAlign}`}>
      {marker ? (
        <Eyebrow num={marker.num} label={marker.label} variant={marker.variant} />
      ) : eyebrow ? (
        <div className="section-label">{eyebrow}</div>
      ) : null}
      <h2
        className={`${TITLE_SIZES[size]} ${fontClass} tracking-tight text-slate-900 dark:text-white`}
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400 sm:text-base">
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
