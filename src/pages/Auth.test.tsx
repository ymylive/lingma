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

describe('Auth password recovery', () => {
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
});
