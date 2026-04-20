import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PixelCat from './PixelCat';

vi.mock('framer-motion', () => {
  const React = require('react');
  const motion = new Proxy(
    {},
    {
      get: (_, tag: string) => {
        const Component = React.forwardRef(
          (
            {
              children,
              drag: _drag,
              dragMomentum: _dragMomentum,
              whileDrag: _whileDrag,
              whileHover: _whileHover,
              initial: _initial,
              animate: _animate,
              transition: _transition,
              ...props
            }: Record<string, unknown>,
            ref: React.Ref<HTMLElement>,
          ) => React.createElement(tag, { ...props, ref }, children),
        );
        Component.displayName = `motion.${tag}`;
        return Component;
      },
    },
  );

  return {
    motion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
  };
});

describe('PixelCat timeout cleanup', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('clears pending message timeout handles on cleanup', () => {
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
    const { container, unmount } = render(<PixelCat lowMotion />);

    fireEvent.click(container.firstElementChild as HTMLElement);
    fireEvent.click(container.firstElementChild as HTMLElement);

    const timeoutHandles = setTimeoutSpy.mock.results.map(result => result.value);
    expect(timeoutHandles.length).toBe(2);

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalledWith(timeoutHandles[0]);
    expect(clearTimeoutSpy).toHaveBeenCalledWith(timeoutHandles[1]);
  });
});
