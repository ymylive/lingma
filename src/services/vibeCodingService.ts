import type {
  VibeChallenge,
  VibeEvaluation,
  VibeFrontendBuildSession,
  VibeFrontendBuildSessionDetail,
  VibeHistoryItem,
  VibeProfile,
  VibeTrack,
} from '../types/vibeCoding';
import type { AppLocale } from '../i18n';
import { getConfiguredModelOverride } from './aiService';
import { readStreamingSse } from './streamingSse';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

const PROFILE_TTL = 30_000;
const HISTORY_TTL = 15_000;

function getCached<T>(key: string, ttlMs: number): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp >= ttlMs) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

function invalidateVibeCache(): void {
  cache.delete('vibe-profile');
  cache.delete('vibe-history');
}

export function clearVibeCache(): void {
  invalidateVibeCache();
}

async function readJson<T>(response: Response): Promise<T> {
  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};
  if (!response.ok) {
    const detail =
      typeof payload?.detail === 'string'
        ? payload.detail
        : 'Request failed';
    throw new Error(detail);
  }
  return payload as T;
}

export async function fetchVibeProfile(forceRefresh?: boolean): Promise<VibeProfile> {
  if (!forceRefresh) {
    const cached = getCached<VibeProfile>('vibe-profile', PROFILE_TTL);
    if (cached) return cached;
  }
  const response = await fetch('/api/vibe-coding/profile', {
    credentials: 'include',
  });
  const data = await readJson<VibeProfile>(response);
  setCache('vibe-profile', data);
  return data;
}

export async function fetchVibeHistory(forceRefresh?: boolean): Promise<VibeHistoryItem[]> {
  if (!forceRefresh) {
    const cached = getCached<VibeHistoryItem[]>('vibe-history', HISTORY_TTL);
    if (cached) return cached;
  }
  const response = await fetch('/api/vibe-coding/history', {
    credentials: 'include',
  });
  const payload = await readJson<{ items: VibeHistoryItem[] }>(response);
  setCache('vibe-history', payload.items);
  return payload.items;
}

export async function generateVibeChallenge(track: VibeTrack, locale: AppLocale): Promise<VibeChallenge> {
  const modelOverride = getConfiguredModelOverride();
  const response = await fetch('/api/vibe-coding/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(modelOverride ? { track, locale, model: modelOverride } : { track, locale }),
  });
  const data = await readJson<VibeChallenge>(response);
  invalidateVibeCache();
  return data;
}

export async function generateVibeChallengeStream(
  track: VibeTrack,
  locale: AppLocale,
  onProgress?: (text: string) => void,
): Promise<VibeChallenge> {
  const modelOverride = getConfiguredModelOverride();
  const response = await fetch('/api/vibe-coding/generate/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(modelOverride ? { track, locale, model: modelOverride } : { track, locale }),
  });
  const data = await readStreamingSse<VibeChallenge>(response, onProgress);
  invalidateVibeCache();
  return data;
}

export async function evaluateVibePrompt(challengeId: string, userPrompt: string, locale: AppLocale): Promise<VibeEvaluation> {
  const modelOverride = getConfiguredModelOverride();
  const response = await fetch('/api/vibe-coding/evaluate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(
      modelOverride
        ? {
            challenge_id: challengeId,
            user_prompt: userPrompt,
            locale,
            model: modelOverride,
          }
        : {
            challenge_id: challengeId,
            user_prompt: userPrompt,
            locale,
          }
    ),
  });
  const data = await readJson<VibeEvaluation>(response);
  invalidateVibeCache();
  return data;
}

export async function evaluateVibePromptStream(
  challengeId: string,
  userPrompt: string,
  locale: AppLocale,
  onProgress?: (text: string) => void,
): Promise<VibeEvaluation> {
  const modelOverride = getConfiguredModelOverride();
  const response = await fetch('/api/vibe-coding/evaluate/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(
      modelOverride
        ? {
            challenge_id: challengeId,
            user_prompt: userPrompt,
            locale,
            model: modelOverride,
          }
        : {
            challenge_id: challengeId,
            user_prompt: userPrompt,
            locale,
          },
    ),
  });
  const data = await readStreamingSse<VibeEvaluation>(response, onProgress);
  invalidateVibeCache();
  return data;
}

export async function createFrontendBuildSession(prompt: string, locale: AppLocale): Promise<VibeFrontendBuildSessionDetail> {
  const modelOverride = getConfiguredModelOverride();
  const response = await fetch('/api/vibe-coding/frontend/session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(modelOverride ? { prompt, locale, model: modelOverride } : { prompt, locale }),
  });
  return readJson<VibeFrontendBuildSessionDetail>(response);
}

export async function createFrontendBuildSessionStream(
  prompt: string,
  locale: AppLocale,
  onProgress?: (text: string) => void,
): Promise<VibeFrontendBuildSessionDetail> {
  const modelOverride = getConfiguredModelOverride();
  const response = await fetch('/api/vibe-coding/frontend/session/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(modelOverride ? { prompt, locale, model: modelOverride } : { prompt, locale }),
  });
  return readStreamingSse<VibeFrontendBuildSessionDetail>(response, onProgress);
}

export async function appendFrontendBuildTurn(
  sessionId: string,
  prompt: string,
  locale: AppLocale,
): Promise<VibeFrontendBuildSessionDetail> {
  const modelOverride = getConfiguredModelOverride();
  const response = await fetch(`/api/vibe-coding/frontend/session/${sessionId}/turns`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(modelOverride ? { prompt, locale, model: modelOverride } : { prompt, locale }),
  });
  return readJson<VibeFrontendBuildSessionDetail>(response);
}

export async function appendFrontendBuildTurnStream(
  sessionId: string,
  prompt: string,
  locale: AppLocale,
  onProgress?: (text: string) => void,
): Promise<VibeFrontendBuildSessionDetail> {
  const modelOverride = getConfiguredModelOverride();
  const response = await fetch(`/api/vibe-coding/frontend/session/${sessionId}/turns/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(modelOverride ? { prompt, locale, model: modelOverride } : { prompt, locale }),
  });
  return readStreamingSse<VibeFrontendBuildSessionDetail>(response, onProgress);
}

export async function fetchFrontendBuildSessions(): Promise<VibeFrontendBuildSession[]> {
  const response = await fetch('/api/vibe-coding/frontend/sessions', {
    credentials: 'include',
  });
  const payload = await readJson<{ items: VibeFrontendBuildSession[] }>(response);
  return payload.items;
}

export async function fetchFrontendBuildSessionDetail(sessionId: string): Promise<VibeFrontendBuildSessionDetail> {
  const response = await fetch(`/api/vibe-coding/frontend/session/${sessionId}`, {
    credentials: 'include',
  });
  return readJson<VibeFrontendBuildSessionDetail>(response);
}

export function getFrontendBuildDownloadUrl(sessionId: string): string {
  return `/api/vibe-coding/frontend/session/${sessionId}/download`;
}
