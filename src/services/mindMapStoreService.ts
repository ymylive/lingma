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
  if (text) return text;
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

export async function loadMindMapsFromServer(userId: string): Promise<MindMapLoadResponse> {
  assertRemoteSyncEnabled();

  const response = await fetch(`${MINDMAP_STORE_BASE_URL}/load`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(normalizeError(response.status, text));
  }

  return response.json() as Promise<MindMapLoadResponse>;
}

export async function saveMindMapsToServer(userId: string, maps: MindMapData[]): Promise<MindMapSaveResponse> {
  assertRemoteSyncEnabled();

  const response = await fetch(`${MINDMAP_STORE_BASE_URL}/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, maps }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(normalizeError(response.status, text));
  }

  return response.json() as Promise<MindMapSaveResponse>;
}
