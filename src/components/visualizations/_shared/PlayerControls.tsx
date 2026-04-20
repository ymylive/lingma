import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react';

export interface PlayerControlsProps {
  playing: boolean;
  canStepBack: boolean;
  canStepForward: boolean;
  atEnd: boolean;
  speed: number;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  stepBack: () => void;
  stepForward: () => void;
  reset: () => void;
  setSpeed: (s: number) => void;
  className?: string;
}

const SPEED_OPTIONS: ReadonlyArray<{ label: string; value: number }> = [
  { label: '0.5\u00d7', value: 0.5 },
  { label: '1\u00d7', value: 1 },
  { label: '1.5\u00d7', value: 1.5 },
  { label: '2\u00d7', value: 2 },
];

const iconButtonClass =
  'inline-flex items-center justify-center rounded-xl min-h-[40px] min-w-[40px] text-slate-700 dark:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klein-500/60 disabled:opacity-40 disabled:pointer-events-none';

export function PlayerControls({
  playing,
  canStepBack,
  canStepForward,
  atEnd,
  speed,
  toggle,
  stepBack,
  stepForward,
  reset,
  setSpeed,
  className,
}: PlayerControlsProps) {
  const toolbarClass = [
    'flex items-center gap-2 rounded-2xl border border-slate-200/60 bg-white/55 backdrop-blur-md px-3 py-2 dark:border-slate-700/40 dark:bg-slate-900/50',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const primaryClass = [
    'inline-flex items-center justify-center rounded-xl min-h-[40px] min-w-[40px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klein-500/60 disabled:opacity-40 disabled:pointer-events-none',
    playing
      ? 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white'
      : 'bg-klein-500 text-white hover:bg-klein-600',
  ].join(' ');

  return (
    <div role="toolbar" aria-label="Playback controls" className={toolbarClass}>
      <button
        type="button"
        onClick={reset}
        className={iconButtonClass}
        aria-label="Reset"
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={stepBack}
        disabled={!canStepBack}
        className={iconButtonClass}
        aria-label="Step back"
      >
        <SkipBack className="h-4 w-4" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={toggle}
        className={primaryClass}
        aria-label={playing ? 'Pause' : 'Play'}
        aria-pressed={playing}
      >
        {playing ? (
          <Pause className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Play className="h-5 w-5" aria-hidden="true" />
        )}
      </button>

      <button
        type="button"
        onClick={stepForward}
        disabled={!canStepForward || atEnd}
        className={iconButtonClass}
        aria-label="Step forward"
      >
        <SkipForward className="h-4 w-4" aria-hidden="true" />
      </button>

      <div
        role="group"
        aria-label="Playback speed"
        className="ml-1 flex items-center gap-1 rounded-xl bg-slate-100/70 p-1 dark:bg-slate-800/60"
      >
        {SPEED_OPTIONS.map((opt) => {
          const active = Math.abs(speed - opt.value) < 1e-6;
          const pillClass = [
            'min-h-[32px] min-w-[40px] rounded-lg px-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klein-500/60',
            active
              ? 'bg-klein-500 text-white shadow-sm'
              : 'text-slate-600 hover:bg-white/70 dark:text-slate-300 dark:hover:bg-slate-700/60',
          ].join(' ');
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSpeed(opt.value)}
              className={pillClass}
              aria-label={`Speed ${opt.label}`}
              aria-pressed={active}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
