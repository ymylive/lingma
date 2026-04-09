import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProtectedRoute from './ProtectedRoute';

const useUserMock = vi.fn();

vi.mock('../contexts/UserContext', () => ({
  useUser: () => useUserMock(),
}));

function AuthLocationProbe() {
  const location = useLocation();
  return (
    <div>
      <h1>Auth Page</h1>
      <p data-testid="from-path">{String((location.state as { from?: string } | null)?.from ?? '')}</p>
    </div>
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    useUserMock.mockReset();
  });

  it('shows loading state while auth status is being checked', () => {
    useUserMock.mockReturnValue({
      isLoggedIn: false,
      isAuthLoading: true,
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route
            path="/dashboard"
            element={(
              <ProtectedRoute>
                <div>Protected content</div>
              </ProtectedRoute>
            )}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('正在验证登录状态...')).toBeInTheDocument();
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });

  it('redirects unauthenticated users to /auth with original path in state.from', () => {
    useUserMock.mockReturnValue({
      isLoggedIn: false,
      isAuthLoading: false,
    });

    render(
      <MemoryRouter initialEntries={['/practice']}>
        <Routes>
          <Route
            path="/practice"
            element={(
              <ProtectedRoute>
                <div>Protected content</div>
              </ProtectedRoute>
            )}
          />
          <Route path="/auth" element={<AuthLocationProbe />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Auth Page' })).toBeInTheDocument();
    expect(screen.getByTestId('from-path')).toHaveTextContent('/practice');
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });

  it('renders children for authenticated users', () => {
    useUserMock.mockReturnValue({
      isLoggedIn: true,
      isAuthLoading: false,
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route
            path="/dashboard"
            element={(
              <ProtectedRoute>
                <div>Protected content</div>
              </ProtectedRoute>
            )}
          />
          <Route path="/auth" element={<AuthLocationProbe />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Protected content')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Auth Page' })).not.toBeInTheDocument();
  });
});
