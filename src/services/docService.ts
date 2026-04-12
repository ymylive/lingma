import { localizeRuntimeText, pickRuntimeText } from '../utils/runtimeLocale';
import { resolveProxyUrl } from '../utils/apiConfig';

const DOC_PROXY_URL = resolveProxyUrl(
  '/api/doc',
  import.meta.env.VITE_DOC_PROXY_URL || import.meta.env.VITE_AI_PROXY_URL?.replace('/api/ai', '/api/doc'),
);

export interface DocFetchResult {
  url: string;
  title: string;
  text: string;
  length: number;
}

export async function fetchDocumentFromUrl(targetUrl: string, maxLength = 16000): Promise<DocFetchResult> {
  const response = await fetch(DOC_PROXY_URL, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: targetUrl, maxLength }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text ? localizeRuntimeText(text) : pickRuntimeText(`URL 获取失败: ${response.status}`, `Failed to fetch URL: ${response.status}`));
  }

  return response.json() as Promise<DocFetchResult>;
}
