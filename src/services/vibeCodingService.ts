import type {
  VibeChallenge,
  VibeEvaluation,
  VibeHistoryItem,
  VibeProfile,
  VibeTrack,
} from '../types/vibeCoding';

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

export async function fetchVibeProfile(): Promise<VibeProfile> {
  const response = await fetch('/api/vibe-coding/profile', {
    credentials: 'include',
  });
  return readJson<VibeProfile>(response);
}

export async function fetchVibeHistory(): Promise<VibeHistoryItem[]> {
  const response = await fetch('/api/vibe-coding/history', {
    credentials: 'include',
  });
  const payload = await readJson<{ items: VibeHistoryItem[] }>(response);
  return payload.items;
}

export async function generateVibeChallenge(track: VibeTrack): Promise<VibeChallenge> {
  const response = await fetch('/api/vibe-coding/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ track }),
  });
  return readJson<VibeChallenge>(response);
}

export async function evaluateVibePrompt(challengeId: string, userPrompt: string): Promise<VibeEvaluation> {
  const response = await fetch('/api/vibe-coding/evaluate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      challenge_id: challengeId,
      user_prompt: userPrompt,
    }),
  });
  return readJson<VibeEvaluation>(response);
}
