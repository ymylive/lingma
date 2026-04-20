import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Auth from './Auth';

const useUserMock = vi.fn();
const useI18nMock = vi.fn();
const navigateMock = vi.fn();

vi.mock('../contexts/UserContext', () => ({
  useUser: () => useUserMock(),
}));

vi.mock('../contexts/I18nContext', () => ({
  useI18n: () => useI18nMock(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe('Auth', () => {
  beforeEach(() => {
    navigateMock.mockReset();
    useI18nMock.mockReturnValue({ isEnglish: true });
    useUserMock.mockReturnValue({
      login: vi.fn(),
      register: vi.fn(),
      requestPasswordReset: vi.fn().mockResolvedValue(true),
      confirmPasswordReset: vi.fn().mockResolvedValue(true),
      isLoggedIn: false,
      isAuthLoading: false,
    });
    // Button now reads prefers-reduced-motion via useLowMotionMode, which
    // needs matchMedia to exist in jsdom.
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation(() => ({
        matches: false,
        media: '',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    );
  });

  it('switches into forgot mode and returns to login after successful reset', async () => {
    const requestPasswordReset = vi.fn().mockResolvedValue(true);
    const confirmPasswordReset = vi.fn().mockResolvedValue(true);
    useUserMock.mockReturnValue({
      login: vi.fn(),
      register: vi.fn(),
      requestPasswordReset,
      confirmPasswordReset,
      isLoggedIn: false,
      isAuthLoading: false,
    });

    render(
      <MemoryRouter initialEntries={['/auth']}>
        <Auth />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Forgot password?' }));
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'recover@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send verification code' }));

    await waitFor(() => expect(requestPasswordReset).toHaveBeenCalledWith('recover@example.com'));

    fireEvent.change(screen.getByPlaceholderText('Enter verification code'), { target: { value: '123456' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'UpdatedPassword123' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your password again'), { target: { value: 'UpdatedPassword123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Reset password' }));

    await waitFor(() => {
      expect(confirmPasswordReset).toHaveBeenCalledWith('recover@example.com', '123456', 'UpdatedPassword123');
    });
    await waitFor(() => expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument());
  });

  it('submits login and redirects to location.state.from when login succeeds', async () => {
    const login = vi.fn().mockResolvedValue(true);
    useUserMock.mockReturnValue({
      login,
      register: vi.fn(),
      requestPasswordReset: vi.fn(),
      confirmPasswordReset: vi.fn(),
      isLoggedIn: false,
      isAuthLoading: false,
    });

    render(
      <MemoryRouter initialEntries={[{ pathname: '/auth', state: { from: '/practice' } }]}>
        <Auth />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'learner@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'StrongPass123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('learner@example.com', 'StrongPass123');
    });
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/practice', { replace: true });
    });
  });

  it('redirects already logged-in users away from /auth using location.state.from', async () => {
    useUserMock.mockReturnValue({
      login: vi.fn(),
      register: vi.fn(),
      requestPasswordReset: vi.fn(),
      confirmPasswordReset: vi.fn(),
      isLoggedIn: true,
      isAuthLoading: false,
    });

    render(
      <MemoryRouter initialEntries={[{ pathname: '/auth', state: { from: '/dashboard?tab=daily' } }]}>
        <Auth />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/dashboard?tab=daily', { replace: true });
    });
  });

  it('does not redirect logged-in users while auth state is still loading', () => {
    useUserMock.mockReturnValue({
      login: vi.fn(),
      register: vi.fn(),
      requestPasswordReset: vi.fn(),
      confirmPasswordReset: vi.fn(),
      isLoggedIn: true,
      isAuthLoading: true,
    });

    render(
      <MemoryRouter initialEntries={[{ pathname: '/auth', state: { from: '/dashboard' } }]}>
        <Auth />
      </MemoryRouter>,
    );

    expect(navigateMock).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Checking...' })).toBeDisabled();
  });
});
