import type { MindMapData } from './mindMapService';

const DEFAULT_PROXY_ORIGIN =
  typeof window !== 'undefined' && window.location ? window.location.origin : 'https://lingma.cornna.xyz';

const MINDMAP_STORE_BASE_URL = import.meta.env.DEV
  ? 'http://localhost:3001/api/mindmaps'
  : (
      import.meta.env.VITE_MINDMAP_STORE_URL ||
      import.meta.env.VITE_AI_PROXY_URL?.replace('/api/ai', '/api/mindmaps') ||
      `${DEFAULT_PROXY_ORIGIN}/api/mindmaps`
    );

const REMOTE_MINDMAP_SYNC_ENABLED = import.meta.env.VITE_ENABLE_REMOTE_MINDMAP_SYNC === 'true';

interface MindMapLoadResponse {
  maps: MindMapData[];
  updatedAt?: string | null;
}

interface MindMapSaveResponse {
  maps: MindMapData[];
  updatedAt: string;
}

function normalizeError(status: number, text: string) {
  if (text) {
    try {
      const parsed = JSON.parse(text) as { detail?: string; error?: string };
      if (typeof parsed.detail === 'string' && parsed.detail) return parsed.detail;
      if (typeof parsed.error === 'string' && parsed.error) return parsed.error;
    } catch {
      return text;
    }
    return text;
  }
  return `mindmap store request failed: ${status}`;
}

function assertRemoteSyncEnabled() {
  if (!REMOTE_MINDMAP_SYNC_ENABLED) {
    throw new Error('Remote mind map sync is disabled');
  }
}

export function isRemoteMindMapSyncEnabled() {
  return REMOTE_MINDMAP_SYNC_ENABLED;
}

export async function loadMindMapsFromServer(): Promise<MindMapLoadResponse> {
  assertRemoteSyncEnabled();

  const response = await fetch(`${MINDMAP_STORE_BASE_URL}/load`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(normalizeError(response.status, text));
  }

  return response.json() as Promise<MindMapLoadResponse>;
}

export async function saveMindMapsToServer(maps: MindMapData[]): Promise<MindMapSaveResponse> {
  assertRemoteSyncEnabled();

  const response = await fetch(`${MINDMAP_STORE_BASE_URL}/save`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ maps }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(normalizeError(response.status, text));
  }

  return response.json() as Promise<MindMapSaveResponse>;
}
