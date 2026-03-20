export interface StreamingPreviewEvent {
  type: 'preview';
  text: string;
}

export interface StreamingFinalEvent<T> {
  type: 'final';
  payload: T;
}

export interface StreamingErrorEvent {
  type: 'error';
  message: string;
}

type StreamingEvent<T> = StreamingPreviewEvent | StreamingFinalEvent<T> | StreamingErrorEvent;

export async function readStreamingSse<T>(
  response: Response,
  onProgress?: (text: string) => void,
): Promise<T> {
  if (!response.ok) {
    const rawText = await response.text();
    if (!rawText) {
      throw new Error(`Streaming request failed: ${response.status}`);
    }
    try {
      const payload = JSON.parse(rawText) as { detail?: string; error?: string };
      throw new Error(payload.detail || payload.error || rawText);
    } catch {
      throw new Error(rawText);
    }
  }

  if (!response.body) {
    throw new Error('Streaming response body is unavailable');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let pending = '';
  let finalPayload: T | undefined;

  const flushLine = (rawLine: string) => {
    const line = rawLine.trim();
    if (!line.startsWith('data:')) return;

    const data = line.slice(5).trim();
    if (!data || data === '[DONE]') return;

    const event = JSON.parse(data) as StreamingEvent<T>;
    if (event.type === 'preview') {
      onProgress?.(typeof event.text === 'string' ? event.text : '');
      return;
    }
    if (event.type === 'error') {
      throw new Error(event.message || 'Streaming request failed');
    }
    if (event.type === 'final') {
      finalPayload = event.payload;
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    pending += decoder.decode(value || new Uint8Array(), { stream: !done });
    const lines = pending.split('\n');
    pending = lines.pop() || '';

    for (const line of lines) {
      flushLine(line);
    }

    if (done) break;
  }

  if (pending.trim()) {
    flushLine(pending);
  }

  if (finalPayload === undefined) {
    throw new Error('Streaming response completed without a final payload');
  }

  return finalPayload;
}
