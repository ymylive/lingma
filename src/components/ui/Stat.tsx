import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { animate, useMotionValue } from 'framer-motion';
import { getTone } from '../../design/tones';
import type { ToneName } from '../../design/tones';
import useLowMotionMode from '../../hooks/useLowMotionMode';

export type StatSize = 'sm' | 'md';

export interface StatProps {
  value: string | number;
  label: string;
  icon?: ReactNode;
  tone?: ToneName;
  size?: StatSize;
  className?: string;
}

/** Parse a value like "35+" / "1.2k" / 42 into { numeric, prefix, suffix }. */
function splitNumeric(raw: string | number): {
  numeric: number | null;
  prefix: string;
  suffix: string;
} {
  if (typeof raw === 'number') {
    return { numeric: raw, prefix: '', suffix: '' };
  }
  // Match an optional leading non-numeric prefix, a numeric body (digits with
  // optional decimal), and an optional trailing suffix.
  const match = raw.match(/^([^0-9.-]*)(-?\d+(?:\.\d+)?)(.*)$/);
  if (!match) {
    return { numeric: null, prefix: '', suffix: '' };
  }
  const [, prefix, numStr, suffix] = match;
  const parsed = Number(numStr);
  if (!Number.isFinite(parsed)) {
    return { numeric: null, prefix: '', suffix: '' };
  }
  // Preserve decimal place count so rounding mid-tween doesn't look jittery.
  return { numeric: parsed, prefix, suffix };
}

function decimalPlaces(n: number): number {
  const s = String(n);
  const dot = s.indexOf('.');
  return dot === -1 ? 0 : s.length - dot - 1;
}

interface AnimatedNumberProps {
  target: number;
  prefix: string;
  suffix: string;
  fractionDigits: number;
}

function AnimatedNumber({
  target,
  prefix,
  suffix,
  fractionDigits,
}: AnimatedNumberProps) {
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState<string>(
    `${prefix}${(0).toFixed(fractionDigits)}${suffix}`,
  );

  useEffect(() => {
    const controls = animate(motionValue, target, {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        setDisplay(`${prefix}${latest.toFixed(fractionDigits)}${suffix}`);
      },
    });
    return () => controls.stop();
  }, [motionValue, target, prefix, suffix, fractionDigits]);

  return <>{display}</>;
}

export function Stat({
  value,
  label,
  icon,
  tone = 'klein',
  size = 'md',
  className,
}: StatProps) {
  const t = getTone(tone);
  const lowMotion = useLowMotionMode();
  const valueSize = size === 'md' ? 'text-3xl' : 'text-2xl';
  const classes = ['flex flex-col items-center gap-1', className ?? '']
    .filter(Boolean)
    .join(' ');

  const parsed = splitNumeric(value);
  const canAnimate =
    !lowMotion && parsed.numeric !== null && Number.isFinite(parsed.numeric);

  const valueNode = canAnimate ? (
    <AnimatedNumber
      target={parsed.numeric as number}
      prefix={parsed.prefix}
      suffix={parsed.suffix}
      fractionDigits={decimalPlaces(parsed.numeric as number)}
    />
  ) : (
    value
  );

  return (
    <div className={classes}>
      {icon ? (
        <div className={`mb-1 ${t.text}`} aria-hidden="true">
          {icon}
        </div>
      ) : null}
      <div
        className={`bg-gradient-to-br ${t.gradient} bg-clip-text text-transparent ${valueSize} font-bold`}
      >
        {valueNode}
      </div>
      <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
        {label}
      </div>
    </div>
  );
}
