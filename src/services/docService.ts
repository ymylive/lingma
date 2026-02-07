const DEFAULT_PROXY_ORIGIN =
  typeof window !== 'undefined' && window.location ? window.location.origin : 'https://lingma.cornna.xyz';

const DOC_PROXY_URL = import.meta.env.DEV
  ? 'http://localhost:3001/api/doc'
  : (import.meta.env.VITE_DOC_PROXY_URL ||
     import.meta.env.VITE_AI_PROXY_URL?.replace('/api/ai', '/api/doc') ||
     `${DEFAULT_PROXY_ORIGIN}/api/doc`);

export interface DocFetchResult {
  url: string;
  title: string;
  text: string;
  length: number;
}

export async function fetchDocumentFromUrl(targetUrl: string, maxLength = 16000): Promise<DocFetchResult> {
  const response = await fetch(DOC_PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: targetUrl, maxLength }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `URL 获取失败: ${response.status}`);
  }

  return response.json() as Promise<DocFetchResult>;
}
