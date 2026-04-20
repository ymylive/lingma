import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./useLowMotionMode', () => ({
  default: vi.fn(() => false),
}));

import useLowMotionMode from './useLowMotionMode';
import { useAlgorithmPlayer } from './useAlgorithmPlayer';

const mockedUseLowMotionMode = vi.mocked(useLowMotionMode);

describe('useAlgorithmPlayer', () => {
  beforeEach(() => {
    mockedUseLowMotionMode.mockReturnValue(false);
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns empty initial state when steps is empty', () => {
    const { result } = renderHook(() =>
      useAlgorithmPlayer<number>({ steps: [] }),
    );
    expect(result.current.index).toBe(-1);
    expect(result.current.currentStep).toBeNull();
    expect(result.current.playing).toBe(false);
    expect(result.current.canStepBack).toBe(false);
    expect(result.current.canStepForward).toBe(false);
    expect(result.current.atEnd).toBe(true);
  });

  it('returns first step when steps has items', () => {
    const steps = [10, 20, 30, 40, 50];
    const { result } = renderHook(() => useAlgorithmPlayer({ steps }));
    expect(result.current.index).toBe(0);
    expect(result.current.currentStep).toBe(10);
    expect(result.current.progress).toBe(0);
    expect(result.current.speed).toBe(1);
    expect(result.current.canStepBack).toBe(false);
    expect(result.current.canStepForward).toBe(true);
    expect(result.current.atEnd).toBe(false);
  });

  it('play() advances index via RAF + fake timers, invoking onStepChange', () => {
    const steps = ['a', 'b', 'c', 'd'];
    const onStepChange = vi.fn();
    const { result } = renderHook(() =>
      useAlgorithmPlayer({ steps, stepDurationMs: 1000, onStepChange }),
    );

    act(() => {
      result.current.play();
    });
    expect(result.current.playing).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1050);
    });

    expect(result.current.index).toBe(1);
    expect(result.current.currentStep).toBe('b');
    expect(onStepChange).toHaveBeenCalledWith('b', 1);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.index).toBe(2);
    expect(onStepChange).toHaveBeenCalledWith('c', 2);
  });

  it('pause() stops RAF progression', () => {
    const steps = [1, 2, 3, 4];
    const { result } = renderHook(() =>
      useAlgorithmPlayer({ steps, stepDurationMs: 1000 }),
    );

    act(() => {
      result.current.play();
    });

    act(() => {
      vi.advanceTimersByTime(1100);
    });
    const idxAfterFirstTick = result.current.index;
    expect(idxAfterFirstTick).toBe(1);

    act(() => {
      result.current.pause();
    });
    expect(result.current.playing).toBe(false);

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current.index).toBe(idxAfterFirstTick);
  });

  it('stepForward and stepBack respect bounds', () => {
    const steps = [1, 2, 3];
    const { result } = renderHook(() => useAlgorithmPlayer({ steps }));

    act(() => {
      result.current.stepBack();
    });
    expect(result.current.index).toBe(0);

    act(() => {
      result.current.stepForward();
    });
    expect(result.current.index).toBe(1);

    act(() => {
      result.current.stepForward();
    });
    expect(result.current.index).toBe(2);

    act(() => {
      result.current.stepForward();
    });
    expect(result.current.index).toBe(2);
    expect(result.current.atEnd).toBe(true);

    act(() => {
      result.current.stepBack();
    });
    expect(result.current.index).toBe(1);
  });

  it('seek(3) lands at index 3 and pauses', () => {
    const steps = [0, 1, 2, 3, 4, 5];
    const { result } = renderHook(() =>
      useAlgorithmPlayer({ steps, stepDurationMs: 500 }),
    );

    act(() => {
      result.current.play();
    });
    expect(result.current.playing).toBe(true);

    act(() => {
      result.current.seek(3);
    });
    expect(result.current.index).toBe(3);
    expect(result.current.currentStep).toBe(3);
    expect(result.current.playing).toBe(false);
  });

  it('seek clamps out-of-bounds values', () => {
    const steps = [0, 1, 2];
    const { result } = renderHook(() => useAlgorithmPlayer({ steps }));

    act(() => {
      result.current.seek(-5);
    });
    expect(result.current.index).toBe(0);

    act(() => {
      result.current.seek(100);
    });
    expect(result.current.index).toBe(2);
  });

  it('reset() returns to index 0', () => {
    const steps = [10, 20, 30];
    const { result } = renderHook(() => useAlgorithmPlayer({ steps }));

    act(() => {
      result.current.seek(2);
    });
    expect(result.current.index).toBe(2);

    act(() => {
      result.current.reset();
    });
    expect(result.current.index).toBe(0);
    expect(result.current.playing).toBe(false);
    expect(result.current.progress).toBe(0);
  });

  it('setSpeed(2) halves time-per-step', () => {
    const steps = [1, 2, 3, 4, 5];
    const { result } = renderHook(() =>
      useAlgorithmPlayer({ steps, stepDurationMs: 1000 }),
    );

    act(() => {
      result.current.setSpeed(2);
    });
    expect(result.current.speed).toBe(2);

    act(() => {
      result.current.play();
    });

    // With speed=2 and duration=1000, threshold=500ms per step.
    // At default speed (1) this would be 1000ms/step, so 600ms would yield index=0.
    // At speed=2 it should advance at least once.
    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(result.current.index).toBeGreaterThanOrEqual(1);

    act(() => {
      vi.advanceTimersByTime(550);
    });
    expect(result.current.index).toBeGreaterThanOrEqual(2);
  });

  it('setSpeed clamps to [0.25, 4]', () => {
    const { result } = renderHook(() =>
      useAlgorithmPlayer<number>({ steps: [1, 2, 3] }),
    );
    act(() => {
      result.current.setSpeed(10);
    });
    expect(result.current.speed).toBe(4);
    act(() => {
      result.current.setSpeed(0.01);
    });
    expect(result.current.speed).toBe(0.25);
  });

  it('loop=true wraps at end', () => {
    const steps = [1, 2, 3];
    const onStepChange = vi.fn();
    const { result } = renderHook(() =>
      useAlgorithmPlayer({
        steps,
        stepDurationMs: 100,
        loop: true,
        onStepChange,
      }),
    );

    act(() => {
      result.current.play();
    });

    // Advance through all three steps.
    act(() => {
      vi.advanceTimersByTime(350);
    });
    // Should have wrapped at least once.
    expect(result.current.playing).toBe(true);

    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current.playing).toBe(true);
    // Wrap sent us back to 0 at some point:
    expect(onStepChange).toHaveBeenCalledWith(1, 0);
  });

  it('loop=false calls onComplete and pauses at end', () => {
    const steps = ['x', 'y', 'z'];
    const onComplete = vi.fn();
    const { result } = renderHook(() =>
      useAlgorithmPlayer({
        steps,
        stepDurationMs: 100,
        loop: false,
        onComplete,
      }),
    );

    act(() => {
      result.current.play();
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.playing).toBe(false);
    expect(result.current.atEnd).toBe(true);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('resets when steps array reference changes', () => {
    const first = [1, 2, 3, 4];
    const second = [10, 20];
    const { result, rerender } = renderHook(
      ({ steps }: { steps: number[] }) =>
        useAlgorithmPlayer({ steps, stepDurationMs: 500 }),
      { initialProps: { steps: first } },
    );

    act(() => {
      result.current.seek(3);
    });
    expect(result.current.index).toBe(3);

    rerender({ steps: second });

    expect(result.current.index).toBe(0);
    expect(result.current.currentStep).toBe(10);
    expect(result.current.progress).toBe(0);
    expect(result.current.playing).toBe(false);
  });

  it('respects autoPlay on fresh mount', () => {
    const steps = [1, 2, 3];
    const { result } = renderHook(() =>
      useAlgorithmPlayer({ steps, stepDurationMs: 500, autoPlay: true }),
    );
    expect(result.current.playing).toBe(true);
  });

  it('low-motion mode: autoPlay ignored, RAF not scheduled, manual stepping works', () => {
    mockedUseLowMotionMode.mockReturnValue(true);
    const rafSpy = vi.spyOn(globalThis, 'requestAnimationFrame');

    const steps = [1, 2, 3, 4];
    const { result } = renderHook(() =>
      useAlgorithmPlayer({ steps, stepDurationMs: 500, autoPlay: true }),
    );

    expect(result.current.playing).toBe(false);

    // play() should be a no-op under low motion.
    act(() => {
      result.current.play();
    });
    expect(result.current.playing).toBe(false);

    // Manual step still works.
    act(() => {
      result.current.stepForward();
    });
    expect(result.current.index).toBe(1);
    act(() => {
      result.current.stepForward();
    });
    expect(result.current.index).toBe(2);
    act(() => {
      result.current.stepBack();
    });
    expect(result.current.index).toBe(1);

    // Even if fake time advances, no RAF-driven work happens.
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current.index).toBe(1);
    expect(rafSpy).not.toHaveBeenCalled();
  });
});
