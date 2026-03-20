import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

type ProgressiveValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ProgressiveValue[]
  | { [key: string]: ProgressiveValue };

function countStringChars(value: ProgressiveValue): number {
  if (typeof value === 'string') {
    return value.length;
  }
  if (Array.isArray(value)) {
    let total = 0;
    for (const item of value) {
      total += countStringChars(item);
    }
    return total;
  }
  if (value && typeof value === 'object') {
    let total = 0;
    for (const item of Object.values(value)) {
      total += countStringChars(item);
    }
    return total;
  }
  return 0;
}

function revealString(value: string, progress: number): string {
  if (progress <= 0) {
    return '';
  }
  if (progress >= 1) {
    return value;
  }
  const visibleLength = Math.max(1, Math.ceil(value.length * progress));
  return value.slice(0, visibleLength);
}

function revealValue<T extends ProgressiveValue>(value: T, progress: number): T {
  if (typeof value === 'string') {
    return revealString(value, progress) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => revealValue(item, progress)) as T;
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, revealValue(item, progress)]),
    ) as T;
  }
  return value;
}

export default function useProgressiveAiObject<T extends ProgressiveValue>(
  value: T,
  enabled = true,
): T {
  const prefersReducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState<T>(value);

  useEffect(() => {
    if (!enabled || prefersReducedMotion || value == null) {
      setDisplayValue(value);
      return undefined;
    }

    const totalChars = countStringChars(value);
    if (!totalChars) {
      setDisplayValue(value);
      return undefined;
    }

    const durationMs = Math.min(2400, Math.max(320, totalChars * 4));
    let frameId = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      setDisplayValue(revealValue(value, progress));
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    setDisplayValue(revealValue(value, 0));
    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [enabled, prefersReducedMotion, value]);

  return displayValue;
}
