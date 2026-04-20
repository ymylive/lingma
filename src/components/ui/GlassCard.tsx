import { createElement } from 'react';
import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { getTone } from '../../design/tones';
import type { ToneName } from '../../design/tones';

export type GlassCardVariant = 'soft' | 'frosted' | 'solid';
export type GlassCardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface GlassCardProps extends HTMLAttributes<HTMLElement> {
  variant?: GlassCardVariant;
  padding?: GlassCardPadding;
  /** When true, lifts on hover. Defaults to true. */
  hoverable?: boolean;
  /** Optional accent glow orb rendered in the top-right corner. */
  glow?: ToneName;
  /** Element tag to render as (div / section / article / ...). */
  as?: ElementType;
  children?: ReactNode;
}

const BASE =
  'relative overflow-hidden rounded-2xl transition-all duration-200 ease-out';

const VARIANTS: Record<GlassCardVariant, string> = {
  soft:
    'border border-slate-200/60 bg-white/55 backdrop-blur-md dark:border-slate-700/40 dark:bg-slate-900/50',
  frosted:
    'border border-slate-200/80 bg-white/75 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/70',
  solid:
    'border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
};

const HOVER =
  'group hover:-translate-y-1 hover:shadow-lg hover:shadow-klein-500/[0.08] dark:hover:shadow-klein-500/10';

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klein-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950';

const PADDINGS: Record<GlassCardPadding, string> = {
  none: 'p-0',
  sm: 'p-4 sm:p-5',
  md: 'p-6 sm:p-7',
  lg: 'p-8 sm:p-10',
};

export function GlassCard({
  variant = 'soft',
  padding = 'md',
  hoverable = true,
  glow,
  as,
  className,
  children,
  ...rest
}: GlassCardProps) {
  const Tag: ElementType = as ?? 'div';
  // Treat the card as interactive when it has an onClick / role=button, or
  // when it's rendered as an anchor-like element that can receive focus.
  const isClickable =
    typeof rest.onClick === 'function' ||
    rest.role === 'button' ||
    // react-router Link passes `to` through; anchors + buttons focus natively.
    Boolean((rest as Record<string, unknown>).to) ||
    Tag === 'a' ||
    Tag === 'button';

  const classes = [
    BASE,
    VARIANTS[variant],
    PADDINGS[padding],
    hoverable ? HOVER : '',
    isClickable ? FOCUS_RING : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const glowTone = glow ? getTone(glow) : null;

  return createElement(
    Tag,
    { className: classes, ...rest },
    glowTone ? (
      <div
        aria-hidden="true"
        className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none transition-all duration-300 ease-out ${glowTone.glow}${hoverable ? ' group-hover:scale-110 group-hover:opacity-100' : ''}`}
      />
    ) : null,
    children,
  );
}
