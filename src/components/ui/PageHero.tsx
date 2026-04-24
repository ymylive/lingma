import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import useLowMotionMode from '../../hooks/useLowMotionMode';
import { GlassCard } from './GlassCard';
import { Eyebrow } from './Eyebrow';

const MotionLink = motion.create(Link);

export type PageHeroVariant = 'default' | 'cta';
export type PageHeroFont = 'sans' | 'serif';

export interface PageHeroAction {
  label: ReactNode;
  to?: string;
  href?: string;
  icon?: ReactNode;
}

export interface PageHeroProps {
  /** Deprecated: prefer `marker`. Still honored when `marker` is absent. */
  eyebrow?: ReactNode;
  marker?: { num?: string; label: ReactNode; variant?: 'default' | 'inverse' | 'brand' };
  title: ReactNode;
  description?: ReactNode;
  primaryAction?: PageHeroAction;
  secondaryAction?: PageHeroAction;
  variant?: PageHeroVariant;
  /** Editorial (serif) or Sans. Defaults to serif — the Lingma signature type. */
  font?: PageHeroFont;
  className?: string;
}

function ActionButton({
  action,
  kind,
  variant,
  lowMotion,
}: {
  action: PageHeroAction;
  kind: 'primary' | 'secondary';
  variant: PageHeroVariant;
  lowMotion: boolean;
}) {
  const base =
    'inline-flex items-center justify-center gap-2.5 min-h-[52px] px-7 py-3 text-base rounded-2xl font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klein-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950';

  let style: string;
  if (variant === 'cta') {
    style =
      kind === 'primary'
        ? 'bg-white text-klein-700 shadow-lg shadow-black/10 hover:-translate-y-0.5 hover:shadow-black/20'
        : 'border border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20';
  } else {
    style =
      kind === 'primary'
        ? 'bg-klein-600 text-white shadow-lg shadow-klein-600/20 hover:bg-klein-700 hover:shadow-klein-600/40 hover:-translate-y-0.5'
        : 'border border-slate-200/80 bg-white/70 backdrop-blur-sm text-slate-700 hover:border-klein-300 hover:text-klein-600 dark:border-slate-700/80 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:border-pine-500/50 dark:hover:text-pine-400';
  }

  const content = (
    <>
      {action.icon}
      {action.label}
    </>
  );

  const classes = `${base} ${style}`;

  const whileHover =
    !lowMotion && kind === 'primary'
      ? { y: -2, transition: { duration: 0.18, ease: 'easeOut' as const } }
      : undefined;
  const whileTap = lowMotion
    ? undefined
    : { scale: 0.97, transition: { duration: 0.1, ease: 'easeOut' as const } };

  if (action.to) {
    return (
      <MotionLink
        to={action.to}
        className={classes}
        whileHover={whileHover}
        whileTap={whileTap}
      >
        {content}
      </MotionLink>
    );
  }
  if (action.href) {
    return (
      <motion.a
        href={action.href}
        className={classes}
        whileHover={whileHover}
        whileTap={whileTap}
      >
        {content}
      </motion.a>
    );
  }
  return (
    <motion.button
      type="button"
      className={classes}
      whileHover={whileHover}
      whileTap={whileTap}
    >
      {content}
    </motion.button>
  );
}

export function PageHero({
  eyebrow,
  marker,
  title,
  description,
  primaryAction,
  secondaryAction,
  variant = 'default',
  font = 'serif',
  className,
}: PageHeroProps) {
  const lowMotion = useLowMotionMode();

  const container = lowMotion
    ? undefined
    : {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.06, delayChildren: 0.04 },
        },
      };
  const child = lowMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 12 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
        },
      };

  const eyebrowNode = marker ? (
    <motion.div variants={child}>
      <Eyebrow
        num={marker.num}
        label={marker.label}
        variant={marker.variant ?? (variant === 'cta' ? 'inverse' : 'default')}
      />
    </motion.div>
  ) : eyebrow ? (
    <motion.div variants={child} className="inline-flex">
      <span
        className={
          variant === 'cta'
            ? 'inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm'
            : 'inline-flex items-center gap-2 rounded-full border border-klein-200/60 bg-white/60 px-4 py-2 text-xs font-medium text-klein-600 shadow-sm backdrop-blur-sm dark:border-klein-800/40 dark:bg-slate-800/60 dark:text-klein-400'
        }
      >
        <span className="relative flex h-1.5 w-1.5">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              variant === 'cta' ? 'bg-white' : 'bg-klein-400'
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
              variant === 'cta' ? 'bg-white' : 'bg-klein-500'
            }`}
          />
        </span>
        {eyebrow}
      </span>
    </motion.div>
  ) : null;

  const fontClass = font === 'serif' ? 'font-serif font-medium' : 'font-sans font-extrabold';
  const titleClasses =
    variant === 'cta'
      ? `${fontClass} text-4xl sm:text-6xl md:text-7xl leading-tight tracking-tight text-white`
      : `${fontClass} text-4xl sm:text-6xl md:text-7xl leading-[1.05] tracking-tight text-slate-900 dark:text-white`;

  const descriptionClasses =
    variant === 'cta'
      ? 'text-base sm:text-lg text-white/85 max-w-2xl mx-auto'
      : 'text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto';

  const inner = (
    <motion.div
      variants={container}
      initial={lowMotion ? false : 'hidden'}
      animate={lowMotion ? undefined : 'show'}
      className={`${variant === 'cta' ? '' : 'max-w-5xl mx-auto '}text-center relative z-10 flex flex-col items-center gap-6`}
    >
      {eyebrowNode}
      <motion.h1 variants={child} className={titleClasses}>
        {title}
      </motion.h1>
      {description ? (
        <motion.p variants={child} className={descriptionClasses}>
          {description}
        </motion.p>
      ) : null}
      {(primaryAction || secondaryAction) ? (
        <motion.div
          variants={child}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mt-2"
        >
          {primaryAction ? (
            <ActionButton
              action={primaryAction}
              kind="primary"
              variant={variant}
              lowMotion={lowMotion}
            />
          ) : null}
          {secondaryAction ? (
            <ActionButton
              action={secondaryAction}
              kind="secondary"
              variant={variant}
              lowMotion={lowMotion}
            />
          ) : null}
        </motion.div>
      ) : null}
    </motion.div>
  );

  if (variant === 'cta') {
    return (
      <GlassCard
        variant="solid"
        padding="lg"
        hoverable={false}
        className={`bg-gradient-to-br from-klein-500 via-klein-600 to-klein-700 text-white border-klein-700/60 dark:border-klein-700/60 ${className ?? ''}`}
      >
        {inner}
      </GlassCard>
    );
  }

  return (
    <section
      className={`page-safe-top relative px-4 pb-14 sm:px-6 sm:pb-20 lg:pb-28 ${className ?? ''}`}
    >
      {inner}
    </section>
  );
}
