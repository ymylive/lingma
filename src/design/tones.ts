// Single source of truth for brand-adjacent accent "tones".
// IMPORTANT: Tailwind JIT scans files for LITERAL class strings. Every class
// value below must remain a complete, static string so Tailwind can emit it.
// Do NOT refactor into template literals with interpolated color names.

export type ToneName =
  | 'klein'
  | 'pine'
  | 'emerald'
  | 'indigo'
  | 'amber'
  | 'rose'
  | 'cyan'
  | 'purple';

export interface ToneStyles {
  /** Soft translucent surface fill. */
  bg: string;
  /** Primary text color for the tone. */
  text: string;
  /** Border color variant that works on translucent surfaces. */
  border: string;
  /** Blurred orb fill (use on an absolutely-positioned blur-3xl div). */
  glow: string;
  /** Focus ring utility. */
  ring: string;
  /** Solid dot / indicator fill. */
  dot: string;
  /** `from-X to-Y` fragment for `bg-gradient-to-*`. */
  gradient: string;
}

const TONES: Record<ToneName, ToneStyles> = {
  klein: {
    bg: 'bg-klein-50/60 dark:bg-klein-950/30',
    text: 'text-klein-600 dark:text-klein-300',
    border: 'border-klein-200/60 dark:border-klein-800/50',
    glow: 'bg-klein-500/10 dark:bg-klein-400/10',
    ring: 'ring-klein-500/40',
    dot: 'bg-klein-500',
    gradient: 'from-klein-500 to-klein-600',
  },
  pine: {
    bg: 'bg-pine-50/60 dark:bg-pine-950/30',
    text: 'text-pine-600 dark:text-pine-300',
    border: 'border-pine-200/60 dark:border-pine-800/50',
    glow: 'bg-pine-500/10 dark:bg-pine-400/10',
    ring: 'ring-pine-500/40',
    dot: 'bg-pine-500',
    gradient: 'from-pine-500 to-pine-600',
  },
  emerald: {
    bg: 'bg-emerald-50/60 dark:bg-emerald-950/30',
    text: 'text-emerald-600 dark:text-emerald-300',
    border: 'border-emerald-200/60 dark:border-emerald-800/50',
    glow: 'bg-emerald-500/10 dark:bg-emerald-400/10',
    ring: 'ring-emerald-500/40',
    dot: 'bg-emerald-500',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  indigo: {
    bg: 'bg-indigo-50/60 dark:bg-indigo-950/30',
    text: 'text-indigo-600 dark:text-indigo-300',
    border: 'border-indigo-200/60 dark:border-indigo-800/50',
    glow: 'bg-indigo-500/10 dark:bg-indigo-400/10',
    ring: 'ring-indigo-500/40',
    dot: 'bg-indigo-500',
    gradient: 'from-indigo-500 to-indigo-600',
  },
  amber: {
    bg: 'bg-amber-50/60 dark:bg-amber-950/30',
    text: 'text-amber-600 dark:text-amber-300',
    border: 'border-amber-200/60 dark:border-amber-800/50',
    glow: 'bg-amber-500/10 dark:bg-amber-400/10',
    ring: 'ring-amber-500/40',
    dot: 'bg-amber-500',
    gradient: 'from-amber-500 to-amber-600',
  },
  rose: {
    bg: 'bg-rose-50/60 dark:bg-rose-950/30',
    text: 'text-rose-600 dark:text-rose-300',
    border: 'border-rose-200/60 dark:border-rose-800/50',
    glow: 'bg-rose-500/10 dark:bg-rose-400/10',
    ring: 'ring-rose-500/40',
    dot: 'bg-rose-500',
    gradient: 'from-rose-500 to-rose-600',
  },
  cyan: {
    bg: 'bg-cyan-50/60 dark:bg-cyan-950/30',
    text: 'text-cyan-600 dark:text-cyan-300',
    border: 'border-cyan-200/60 dark:border-cyan-800/50',
    glow: 'bg-cyan-500/10 dark:bg-cyan-400/10',
    ring: 'ring-cyan-500/40',
    dot: 'bg-cyan-500',
    gradient: 'from-cyan-500 to-cyan-600',
  },
  purple: {
    bg: 'bg-purple-50/60 dark:bg-purple-950/30',
    text: 'text-purple-600 dark:text-purple-300',
    border: 'border-purple-200/60 dark:border-purple-800/50',
    glow: 'bg-purple-500/10 dark:bg-purple-400/10',
    ring: 'ring-purple-500/40',
    dot: 'bg-purple-500',
    gradient: 'from-purple-500 to-purple-600',
  },
};

export function getTone(name: ToneName): ToneStyles {
  return TONES[name];
}
