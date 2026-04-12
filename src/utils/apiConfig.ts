/** Shared API URL resolution — single source of truth for proxy origins. */

const DEFAULT_PROXY_ORIGIN =
  typeof window !== 'undefined' && window.location
    ? window.location.origin
    : 'https://lingma.cornna.xyz';

const DEV_PROXY = 'http://localhost:3001';

/**
 * Resolve a proxy URL for the given API path.
 * In development, points to the local dev proxy; in production,
 * uses the configured env var or the current origin.
 */
export function resolveProxyUrl(
  path: string,
  envOverride?: string,
): string {
  if (import.meta.env.DEV) {
    return `${DEV_PROXY}${path}`;
  }
  return envOverride || `${DEFAULT_PROXY_ORIGIN}${path}`;
}
