import '@testing-library/jest-dom/vitest';
import { cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import InteractiveGrid from './InteractiveGrid';

let currentTheme: 'light' | 'dark' = 'light';

vi.mock('../contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: currentTheme,
  }),
}));

describe('InteractiveGrid cleanup', () => {
  beforeEach(() => {
    currentTheme = 'light';

    const canvasContextMock = {
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
    };

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => canvasContextMock as unknown as CanvasRenderingContext2D);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('cancels the scheduled animation frame on unmount', () => {
    let frameId = 0;
    vi.stubGlobal('requestAnimationFrame', vi.fn(() => ++frameId));
    const cancelAnimationFrameSpy = vi.fn();
    vi.stubGlobal('cancelAnimationFrame', cancelAnimationFrameSpy);

    const { unmount } = render(<InteractiveGrid />);

    unmount();

    expect(cancelAnimationFrameSpy).toHaveBeenCalledWith(1);
  });

  it('cancels the previous animation frame before restarting on theme change', () => {
    let frameId = 0;
    vi.stubGlobal('requestAnimationFrame', vi.fn(() => ++frameId));
    const cancelAnimationFrameSpy = vi.fn();
    vi.stubGlobal('cancelAnimationFrame', cancelAnimationFrameSpy);

    const { rerender } = render(<InteractiveGrid />);

    currentTheme = 'dark';
    rerender(<InteractiveGrid />);

    expect(cancelAnimationFrameSpy).toHaveBeenCalledWith(1);
  });
});
