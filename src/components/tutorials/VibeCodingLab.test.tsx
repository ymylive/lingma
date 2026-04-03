import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { I18nProvider } from '../../contexts/I18nContext';
import VibeCodingLab from './VibeCodingLab';
import type { VibeChallenge, VibeProfile } from '../../types/vibeCoding';

const challengeFixture: VibeChallenge = {
  id: 'challenge-1',
  userId: 'user-1',
  track: 'frontend',
  difficulty: 'intermediate',
  title: 'Repair Prompt Arena challenge rendering',
  scenario: 'The challenge payload is generated successfully, but the UI stays blank after generation completes.',
  requirements: [
    'Trace the generation-to-render state flow.',
    'Fix the rendering regression with the smallest safe patch.',
  ],
  constraints: [
    'Do not rewrite unrelated training panels.',
    'Keep the prompt scoring behavior unchanged.',
  ],
  successCriteria: [
    'The scenario text is visible after generation finishes.',
    'Requirements, constraints, and success criteria all render correctly.',
  ],
  expectedFocus: ['goal_clarity', 'verification_design'],
  createdAt: '2026-03-30T00:00:00.000Z',
};

const profileFixture: VibeProfile = {
  recommendedTrack: 'frontend',
  recommendedDifficulty: 'intermediate',
  weakestDimension: 'verification_design',
  recentAverageScore: 82,
  trackScores: {
    frontend: 75,
    backend: null,
    debugging: null,
    refactoring: null,
    review: null,
  },
};

const {
  fetchVibeProfileMock,
  fetchVibeHistoryMock,
  generateVibeChallengeStreamMock,
} = vi.hoisted(() => ({
  fetchVibeProfileMock: vi.fn(),
  fetchVibeHistoryMock: vi.fn(),
  generateVibeChallengeStreamMock: vi.fn(),
}));

vi.mock('../../services/vibeCodingService', () => ({
  fetchVibeProfile: fetchVibeProfileMock,
  fetchVibeHistory: fetchVibeHistoryMock,
  generateVibeChallengeStream: generateVibeChallengeStreamMock,
  evaluateVibePromptStream: vi.fn(),
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
    useReducedMotion: () => false,
  };
});

function renderLab() {
  return render(
    <MemoryRouter>
      <I18nProvider>
        <VibeCodingLab onOpenAiGenerator={() => {}} onOpenPracticeLibrary={() => {}} />
      </I18nProvider>
    </MemoryRouter>,
  );
}

function getStartTrainingButton() {
  return screen.getByRole('button', { name: /开始一轮训练|Start a Training Round/ });
}

describe('VibeCodingLab challenge rendering', () => {
  beforeEach(() => {
    fetchVibeProfileMock.mockResolvedValue(profileFixture);
    fetchVibeHistoryMock.mockResolvedValue([]);
    generateVibeChallengeStreamMock.mockResolvedValue(challengeFixture);

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
    vi.stubGlobal('matchMedia', vi.fn().mockImplementation(() => ({
      matches: false,
      media: '',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })));

    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      return window.setTimeout(() => callback(performance.now()), 16);
    });
    vi.stubGlobal('cancelAnimationFrame', (handle: number) => {
      window.clearTimeout(handle);
    });
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('renders generated challenge content after the stream completes', async () => {
    renderLab();

    await waitFor(() => {
      expect(fetchVibeProfileMock).toHaveBeenCalled();
      expect(fetchVibeHistoryMock).toHaveBeenCalled();
    });

    fireEvent.click(getStartTrainingButton());

    await waitFor(() => {
      expect(generateVibeChallengeStreamMock).toHaveBeenCalledWith('frontend', 'en-US', expect.any(Function));
    });

    expect(await screen.findByText(challengeFixture.scenario, {}, { timeout: 3500 })).toBeInTheDocument();
    expect(screen.getByText(challengeFixture.requirements[0])).toBeInTheDocument();
    expect(screen.getByText(challengeFixture.constraints[0])).toBeInTheDocument();
    expect(screen.getByText(challengeFixture.successCriteria[0])).toBeInTheDocument();
  }, 5000);

  it('shows full generated challenge content immediately without local fake streaming animation', async () => {
    let frameCount = 0;
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frameCount += 1;
      if (frameCount === 1) {
        return window.setTimeout(() => callback(performance.now() + 1), 0);
      }
      return 1;
    });
    vi.stubGlobal('cancelAnimationFrame', vi.fn());

    renderLab();

    await waitFor(() => {
      expect(fetchVibeProfileMock).toHaveBeenCalled();
      expect(fetchVibeHistoryMock).toHaveBeenCalled();
    });

    fireEvent.click(getStartTrainingButton());

    await waitFor(() => {
      expect(generateVibeChallengeStreamMock).toHaveBeenCalled();
    });

    expect(await screen.findByText(challengeFixture.scenario, {}, { timeout: 1000 })).toBeInTheDocument();
  });
});
