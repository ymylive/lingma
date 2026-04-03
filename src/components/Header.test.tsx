import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Header from './Header';

const useUserMock = vi.fn();
const useThemeMock = vi.fn();
const useI18nMock = vi.fn();

vi.mock('../contexts/UserContext', () => ({
  useUser: () => useUserMock(),
}));

vi.mock('../contexts/ThemeContext', () => ({
  useTheme: () => useThemeMock(),
}));

vi.mock('../contexts/I18nContext', () => ({
  useI18n: () => useI18nMock(),
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
    useUserMock.mockReset();
    useThemeMock.mockReset();
    useI18nMock.mockReset();

    useUserMock.mockReturnValue({
      user: null,
      isLoggedIn: false,
      isAuthLoading: false,
      progress: { streak: 0, completedLessons: [], completedExercises: [] },
      logout: vi.fn(),
    });
    useThemeMock.mockReturnValue({
      theme: 'dark',
      toggleTheme: vi.fn(),
      isAuto: false,
    });
    useI18nMock.mockReturnValue({
      isEnglish: false,
      locale: 'zh-CN',
      setLocale: vi.fn(),
      t: (value: string) => value,
    });

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

  it('shows auth-loading indicator while auth is resolving', () => {
    useUserMock.mockReturnValue({
      user: null,
      isLoggedIn: false,
      isAuthLoading: true,
      progress: { streak: 0, completedLessons: [], completedExercises: [] },
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.getByText('验证中...')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: '登录' })).not.toBeInTheDocument();
  });

  it('shows auth call-to-action when logged out', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: '登录' })).toBeInTheDocument();
  });

  it('opens user dropdown for logged-in users and triggers logout action', () => {
    const logout = vi.fn();
    useUserMock.mockReturnValue({
      user: { username: 'Alice', email: 'alice@example.com' },
      isLoggedIn: true,
      isAuthLoading: false,
      progress: { streak: 7, completedLessons: ['l1', 'l2'], completedExercises: ['e1'] },
      logout,
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: /Alice/i }));

    expect(screen.getByRole('link', { name: /学习中心/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /退出登录/ }));
    expect(logout).toHaveBeenCalledTimes(1);
  });
});
