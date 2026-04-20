import { useCallback, useEffect, useRef, useState } from 'react';
import useLowMotionMode from './useLowMotionMode';

export interface AlgorithmPlayerOptions<TStep> {
  steps: TStep[];
  stepDurationMs?: number;
  autoPlay?: boolean;
  loop?: boolean;
  onStepChange?: (step: TStep, index: number) => void;
  onComplete?: () => void;
}

export interface AlgorithmPlayerState<TStep> {
  currentStep: TStep | null;
  index: number;
  playing: boolean;
  progress: number;
  speed: number;
  canStepBack: boolean;
  canStepForward: boolean;
  atEnd: boolean;

  play: () => void;
  pause: () => void;
  toggle: () => void;
  stepForward: () => void;
  stepBack: () => void;
  reset: () => void;
  seek: (index: number) => void;
  setSpeed: (s: number) => void;
}

const DEFAULT_STEP_DURATION_MS = 900;
const LOW_MOTION_MIN_DURATION_MS = 600;
const MIN_SPEED = 0.25;
const MAX_SPEED = 4;

function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export function useAlgorithmPlayer<TStep>(
  opts: AlgorithmPlayerOptions<TStep>,
): AlgorithmPlayerState<TStep> {
  const {
    steps,
    stepDurationMs = DEFAULT_STEP_DURATION_MS,
    autoPlay = false,
    loop = false,
    onStepChange,
    onComplete,
  } = opts;

  const lowMotion = useLowMotionMode();

  const effectiveDuration = lowMotion
    ? Math.max(stepDurationMs, LOW_MOTION_MIN_DURATION_MS)
    : stepDurationMs;

  const initialPlaying = lowMotion ? false : autoPlay;
  const initialIndex = steps.length > 0 ? 0 : -1;

  const [index, setIndex] = useState<number>(initialIndex);
  const [playing, setPlaying] = useState<boolean>(initialPlaying);
  const [progress, setProgress] = useState<number>(0);
  const [speed, setSpeedState] = useState<number>(1);

  // Refs mirror state for RAF loop reads to avoid re-subscribing.
  const rafIdRef = useRef<number | null>(null);
  const prevFrameTimeRef = useRef<number | null>(null);
  const elapsedRef = useRef<number>(0);
  const indexRef = useRef<number>(initialIndex);
  const playingRef = useRef<boolean>(initialPlaying);
  const speedRef = useRef<number>(1);
  const stepsRef = useRef<TStep[]>(steps);
  const loopRef = useRef<boolean>(loop);
  const durationRef = useRef<number>(effectiveDuration);
  const onStepChangeRef = useRef<typeof onStepChange>(onStepChange);
  const onCompleteRef = useRef<typeof onComplete>(onComplete);

  // Keep latest callback/config refs current without re-running the RAF loop.
  useEffect(() => {
    onStepChangeRef.current = onStepChange;
  }, [onStepChange]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    loopRef.current = loop;
  }, [loop]);

  useEffect(() => {
    durationRef.current = effectiveDuration;
  }, [effectiveDuration]);

  const cancelRaf = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (rafIdRef.current !== null) {
      window.cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    prevFrameTimeRef.current = null;
  }, []);

  // Reset whenever the steps *reference* changes.
  useEffect(() => {
    stepsRef.current = steps;
    cancelRaf();
    elapsedRef.current = 0;
    const nextIndex = steps.length > 0 ? 0 : -1;
    indexRef.current = nextIndex;
    setIndex(nextIndex);
    setProgress(0);
    const nextPlaying = lowMotion ? false : autoPlay;
    playingRef.current = nextPlaying;
    setPlaying(nextPlaying);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps]);

  // If lowMotion flips to true while playing, stop the loop.
  useEffect(() => {
    if (lowMotion && playingRef.current) {
      playingRef.current = false;
      setPlaying(false);
      cancelRaf();
    }
  }, [lowMotion, cancelRaf]);

  const runFrame = useCallback(
    (time: number) => {
      if (typeof window === 'undefined') return;
      if (!playingRef.current) {
        rafIdRef.current = null;
        prevFrameTimeRef.current = null;
        return;
      }

      if (prevFrameTimeRef.current === null) {
        prevFrameTimeRef.current = time;
        rafIdRef.current = window.requestAnimationFrame(runFrame);
        return;
      }

      const delta = time - prevFrameTimeRef.current;
      prevFrameTimeRef.current = time;
      elapsedRef.current += delta;

      const threshold = durationRef.current / speedRef.current;
      const stepsNow = stepsRef.current;

      if (elapsedRef.current >= threshold) {
        elapsedRef.current -= threshold;
        const currentIdx = indexRef.current;
        const lastIdx = stepsNow.length - 1;

        if (currentIdx >= lastIdx) {
          if (loopRef.current && stepsNow.length > 0) {
            const nextIdx = 0;
            indexRef.current = nextIdx;
            setIndex(nextIdx);
            if (onStepChangeRef.current) {
              onStepChangeRef.current(stepsNow[nextIdx], nextIdx);
            }
          } else {
            playingRef.current = false;
            setPlaying(false);
            setProgress(1);
            elapsedRef.current = 0;
            rafIdRef.current = null;
            prevFrameTimeRef.current = null;
            if (onCompleteRef.current) onCompleteRef.current();
            return;
          }
        } else {
          const nextIdx = currentIdx + 1;
          indexRef.current = nextIdx;
          setIndex(nextIdx);
          if (onStepChangeRef.current) {
            onStepChangeRef.current(stepsNow[nextIdx], nextIdx);
          }
        }
      }

      const nextProgress = clamp(elapsedRef.current / threshold, 0, 1);
      setProgress(nextProgress);
      rafIdRef.current = window.requestAnimationFrame(runFrame);
    },
    [],
  );

  // Drive RAF on play/pause transitions.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (lowMotion) return;
    if (!playing) {
      cancelRaf();
      return;
    }
    if (rafIdRef.current !== null) return;
    prevFrameTimeRef.current = null;
    rafIdRef.current = window.requestAnimationFrame(runFrame);
    return () => {
      cancelRaf();
    };
  }, [playing, lowMotion, runFrame, cancelRaf]);

  // Unmount cleanup.
  useEffect(() => {
    return () => {
      cancelRaf();
    };
  }, [cancelRaf]);

  const play = useCallback(() => {
    if (lowMotion) return;
    if (stepsRef.current.length === 0) return;
    if (indexRef.current === stepsRef.current.length - 1 && !loopRef.current) {
      // At end with no loop; restart from 0.
      indexRef.current = 0;
      setIndex(0);
      elapsedRef.current = 0;
      setProgress(0);
    }
    playingRef.current = true;
    setPlaying(true);
  }, [lowMotion]);

  const pause = useCallback(() => {
    playingRef.current = false;
    setPlaying(false);
    cancelRaf();
  }, [cancelRaf]);

  const toggle = useCallback(() => {
    if (playingRef.current) {
      pause();
    } else {
      play();
    }
  }, [pause, play]);

  const stepForward = useCallback(() => {
    const stepsNow = stepsRef.current;
    if (stepsNow.length === 0) return;
    const lastIdx = stepsNow.length - 1;
    const currentIdx = indexRef.current;
    if (currentIdx >= lastIdx) return;
    playingRef.current = false;
    setPlaying(false);
    cancelRaf();
    const nextIdx = currentIdx + 1;
    indexRef.current = nextIdx;
    elapsedRef.current = 0;
    setIndex(nextIdx);
    setProgress(0);
    if (onStepChangeRef.current) {
      onStepChangeRef.current(stepsNow[nextIdx], nextIdx);
    }
  }, [cancelRaf]);

  const stepBack = useCallback(() => {
    const stepsNow = stepsRef.current;
    if (stepsNow.length === 0) return;
    const currentIdx = indexRef.current;
    if (currentIdx <= 0) return;
    playingRef.current = false;
    setPlaying(false);
    cancelRaf();
    const nextIdx = currentIdx - 1;
    indexRef.current = nextIdx;
    elapsedRef.current = 0;
    setIndex(nextIdx);
    setProgress(0);
    if (onStepChangeRef.current) {
      onStepChangeRef.current(stepsNow[nextIdx], nextIdx);
    }
  }, [cancelRaf]);

  const reset = useCallback(() => {
    const stepsNow = stepsRef.current;
    playingRef.current = false;
    setPlaying(false);
    cancelRaf();
    const nextIdx = stepsNow.length > 0 ? 0 : -1;
    indexRef.current = nextIdx;
    elapsedRef.current = 0;
    setIndex(nextIdx);
    setProgress(0);
    if (nextIdx >= 0 && onStepChangeRef.current) {
      onStepChangeRef.current(stepsNow[nextIdx], nextIdx);
    }
  }, [cancelRaf]);

  const seek = useCallback(
    (target: number) => {
      const stepsNow = stepsRef.current;
      if (stepsNow.length === 0) return;
      const clamped = clamp(
        Math.trunc(target),
        0,
        stepsNow.length - 1,
      );
      playingRef.current = false;
      setPlaying(false);
      cancelRaf();
      indexRef.current = clamped;
      elapsedRef.current = 0;
      setIndex(clamped);
      setProgress(0);
      if (onStepChangeRef.current) {
        onStepChangeRef.current(stepsNow[clamped], clamped);
      }
    },
    [cancelRaf],
  );

  const setSpeed = useCallback((s: number) => {
    const next = clamp(s, MIN_SPEED, MAX_SPEED);
    speedRef.current = next;
    setSpeedState(next);
  }, []);

  // SSR: return a safely frozen state (no RAF touched).
  if (typeof window === 'undefined') {
    const ssrIdx = steps.length > 0 ? 0 : -1;
    return {
      currentStep: ssrIdx >= 0 ? steps[ssrIdx] : null,
      index: ssrIdx,
      playing: false,
      progress: 0,
      speed: 1,
      canStepBack: false,
      canStepForward: steps.length > 1,
      atEnd: steps.length <= 1,
      play: () => {},
      pause: () => {},
      toggle: () => {},
      stepForward: () => {},
      stepBack: () => {},
      reset: () => {},
      seek: () => {},
      setSpeed: () => {},
    };
  }

  const currentStep = index >= 0 && index < steps.length ? steps[index] : null;
  const atEnd = steps.length > 0 ? index === steps.length - 1 : true;
  const canStepBack = index > 0;
  const canStepForward = steps.length > 0 && index < steps.length - 1;

  return {
    currentStep,
    index,
    playing,
    progress,
    speed,
    canStepBack,
    canStepForward,
    atEnd,
    play,
    pause,
    toggle,
    stepForward,
    stepBack,
    reset,
    seek,
    setSpeed,
  };
}
