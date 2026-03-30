import '@testing-library/jest-dom/vitest';
import { cleanup, render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Header from './Header';

vi.mock('../contexts/UserContext', () => ({
  useUser: () => ({
    user: null,
    isLoggedIn: false,
    isAuthLoading: false,
    progress: { streak: 0, completedLessons: [], completedExercises: [] },
    logout: vi.fn(),
  }),
}));

vi.mock('../contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'dark',
    toggleTheme: vi.fn(),
    isAuto: false,
  }),
}));

vi.mock('../contexts/I18nContext', () => ({
  useI18n: () => ({
    isEnglish: false,
    locale: 'zh-CN',
    setLocale: vi.fn(),
    t: (value: string) => value,
  }),
}));

vi.mock('framer-motion', () => {
  const React = require('react');
  const motion = new Proxy({}, {
    get: (_, tag: string) => {
      const Component = React.forwardRef(({ children, ...props }: Record<string, unknown>, ref: React.Ref<HTMLElement>) =>
        React.createElement(tag, { ...props, ref }, children),
      );
      Component.displayName = `motion.${tag}`;
      return Component;
    },
  });
  return {
    motion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
  };
});

describe('Header layout offset', () => {
  beforeEach(() => {
    class ResizeObserverMock {
      private callback: ResizeObserverCallback;

      constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
      }

      observe(target: Element) {
        Object.defineProperty(target, 'offsetHeight', {
          configurable: true,
          value: 88,
        });
        this.callback([{ target } as ResizeObserverEntry], this as unknown as ResizeObserver);
      }

      disconnect() {}
      unobserve() {}
    }

    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
  });

  afterEach(() => {
    cleanup();
    document.documentElement.style.removeProperty('--app-header-height');
    vi.unstubAllGlobals();
  });

  it('writes the measured header height to a CSS variable', async () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(document.documentElement.style.getPropertyValue('--app-header-height')).toBe('88px');
    });
  });
});
