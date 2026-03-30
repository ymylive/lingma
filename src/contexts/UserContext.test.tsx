import { act, render, waitFor } from '@testing-library/react';
import { useEffect } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { UserProvider, useUser } from './UserContext';

const { clearVibeCacheMock } = vi.hoisted(() => ({
  clearVibeCacheMock: vi.fn(),
}));

vi.mock('../services/vibeCodingService', () => ({
  clearVibeCache: clearVibeCacheMock,
}));

function TestConsumer({ onReady }: { onReady: (value: ReturnType<typeof useUser>) => void }) {
  const value = useUser();

  useEffect(() => {
    onReady(value);
  }, [onReady, value]);

  return null;
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function textResponse(body: string, status: number) {
  return new Response(body, { status });
}

function createAuthFetchMock(options: {
  session: Response;
  login?: Response;
  register?: Response;
  logout?: Response;
}) {
  return vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString();
    const method = init?.method ?? 'GET';

    if (url.endsWith('/session') && method === 'GET') {
      return options.session;
    }

    if (url.endsWith('/login') && method === 'POST') {
      return options.login ?? textResponse('missing login response', 500);
    }

    if (url.endsWith('/register') && method === 'POST') {
      return options.register ?? textResponse('missing register response', 500);
    }

    if (url.endsWith('/logout') && method === 'POST') {
      return options.logout ?? textResponse('', 200);
    }

    throw new Error(`Unexpected fetch request: ${method} ${url}`);
  });
}

async function renderUserProvider() {
  let api: ReturnType<typeof useUser> | undefined;

  render(
    <UserProvider>
      <TestConsumer onReady={(nextValue) => {
        api = nextValue;
      }} />
    </UserProvider>,
  );

  await waitFor(() => {
    expect(api).toBeDefined();
    expect(api?.isAuthLoading).toBe(false);
  });

  return api as ReturnType<typeof useUser>;
}

describe('UserProvider auth transitions', () => {
  beforeEach(() => {
    clearVibeCacheMock.mockReset();
    const storage = new Map<string, string>();

    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => storage.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => {
        storage.set(key, value);
      }),
      removeItem: vi.fn((key: string) => {
        storage.delete(key);
      }),
      clear: vi.fn(() => {
        storage.clear();
      }),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it.each([
    {
      name: 'missing session restore',
      session: new Response('', { status: 401 }),
      expectedCalls: 1,
    },
    {
      name: 'failed session restore',
      session: textResponse('restore failed', 500),
      expectedCalls: 1,
    },
  ])('clears Vibe cache on $name', async ({ session, expectedCalls }) => {
    vi.stubGlobal('fetch', createAuthFetchMock({ session }));

    await renderUserProvider();

    expect(clearVibeCacheMock).toHaveBeenCalledTimes(expectedCalls);
  });

  it('clears Vibe cache when switching users or logging out', async () => {
    const fetchMock = createAuthFetchMock({
      session: jsonResponse({
        user: {
          id: 'user-a',
          username: 'Alpha',
          email: 'alpha@example.com',
          createdAt: '2026-03-01T00:00:00.000Z',
          skillLevel: 'intermediate',
          targetLanguage: 'python',
        },
      }),
      login: jsonResponse({
        user: {
          id: 'user-b',
          username: 'Beta',
          email: 'beta@example.com',
          createdAt: '2026-03-02T00:00:00.000Z',
          skillLevel: 'foundation',
          targetLanguage: 'cpp',
        },
      }),
      register: jsonResponse({
        user: {
          id: 'user-c',
          username: 'Gamma',
          email: 'gamma@example.com',
          createdAt: '2026-03-03T00:00:00.000Z',
          skillLevel: 'beginner',
          targetLanguage: 'java',
        },
      }),
      logout: new Response('', { status: 200 }),
    });

    vi.stubGlobal('fetch', fetchMock);

    const api = await renderUserProvider();

    expect(clearVibeCacheMock).toHaveBeenCalledTimes(1);

    await act(async () => {
      await api.login('beta@example.com', 'secret');
    });
    expect(clearVibeCacheMock).toHaveBeenCalledTimes(2);

    await act(async () => {
      await api.register('Gamma', 'gamma@example.com', 'secret', 'beginner', 'java');
    });
    expect(clearVibeCacheMock).toHaveBeenCalledTimes(3);

    act(() => {
      api.logout();
    });
    expect(clearVibeCacheMock).toHaveBeenCalledTimes(4);
  });
});
