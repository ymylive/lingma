import { useEffect, useRef, useState } from 'react';
import useLowMotionMode from './useLowMotionMode';

function nextStepSize(remaining: number): number {
  if (remaining > 160) return 18;
  if (remaining > 80) return 10;
  if (remaining > 24) return 4;
  return 1;
}

export default function useStreamingTypewriterText(targetText: string, enabled = true): string {
  const lowMotionMode = useLowMotionMode();
  const [displayText, setDisplayText] = useState(targetText);
  const frameRef = useRef<number | null>(null);
  const immediateFrameRef = useRef<number | null>(null);
  const visibleTextRef = useRef(targetText);
  const targetTextRef = useRef(targetText);
  const lastFrameAtRef = useRef(0);

  useEffect(() => {
    targetTextRef.current = targetText;

    if (!enabled || lowMotionMode) {
      visibleTextRef.current = targetText;
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      if (immediateFrameRef.current !== null) {
        cancelAnimationFrame(immediateFrameRef.current);
      }
      immediateFrameRef.current = requestAnimationFrame(() => {
        immediateFrameRef.current = null;
        setDisplayText(targetText);
      });
      return;
    }

    if (!targetText.startsWith(visibleTextRef.current)) {
      visibleTextRef.current = '';
      lastFrameAtRef.current = 0;
      if (immediateFrameRef.current !== null) {
        cancelAnimationFrame(immediateFrameRef.current);
      }
      immediateFrameRef.current = requestAnimationFrame(() => {
        immediateFrameRef.current = null;
        setDisplayText('');
      });
    }

    if (frameRef.current !== null) {
      return;
    }

    const tick = (now: number) => {
      if (lastFrameAtRef.current && now - lastFrameAtRef.current < 18) {
        frameRef.current = requestAnimationFrame(tick);
        return;
      }
      lastFrameAtRef.current = now;

      const current = visibleTextRef.current;
      const nextTarget = targetTextRef.current;

      if (!nextTarget.startsWith(current)) {
        visibleTextRef.current = '';
        setDisplayText('');
        frameRef.current = requestAnimationFrame(tick);
        return;
      }

      if (current === nextTarget) {
        frameRef.current = null;
        lastFrameAtRef.current = 0;
        return;
      }

      const remaining = nextTarget.length - current.length;
      const nextVisible = nextTarget.slice(0, current.length + nextStepSize(remaining));
      visibleTextRef.current = nextVisible;
      setDisplayText(nextVisible);
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      if (immediateFrameRef.current !== null) {
        cancelAnimationFrame(immediateFrameRef.current);
        immediateFrameRef.current = null;
      }
    };
  }, [enabled, lowMotionMode, targetText]);

  return displayText;
}
