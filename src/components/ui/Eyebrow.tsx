import type { ReactNode } from 'react';

export interface EyebrowProps {
  /** Optional section number like "00" / "01" — rendered before the label. */
  num?: string;
  /** Section label, all-caps tracked letterspacing. */
  label: ReactNode;
  /** Color variant — default matches body text; inverse is for dark backgrounds. */
  variant?: 'default' | 'inverse' | 'brand';
  className?: string;
}

/**
 * Editorial eyebrow — the "01 · PRELUDE" marker paired with a short rule.
 * Signature element of the Lingma design language; mirrors the hero film.
 */
export function Eyebrow({ num, label, variant = 'default', className }: EyebrowProps) {
  const colorClass =
    variant === 'inverse'
      ? 'text-white/80'
      : variant === 'brand'
        ? 'text-klein-600 dark:text-pine-400'
        : 'text-slate-500 dark:text-slate-400';

  return (
    <span
      className={`inline-flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.22em] ${colorClass} ${className ?? ''}`}
    >
      <span className="h-px w-6 bg-current opacity-50" aria-hidden />
      {num ? <span>{num} · {label}</span> : <span>{label}</span>}
    </span>
  );
}
