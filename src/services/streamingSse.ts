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
  const prematureCloseMessage = 'Streaming connection closed before the final payload arrived';

  if (!response.ok) {
    const rawText = await response.text();
    if (!rawText) {
      throw new Error(`Streaming request failed: ${response.status}`);
    }

    let payload: { detail?: string; error?: string } | null = null;
    try {
      payload = JSON.parse(rawText) as { detail?: string; error?: string };
    } catch {
      throw new Error(rawText);
    }

    const detail = payload.detail || payload.error;
    if (detail) {
      throw new Error(detail);
    }

    throw new Error(rawText);
  }

  if (!response.body) {
    throw new Error('Streaming response body is unavailable');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let pending = '';
  let finalPayload: T | undefined;

  const flushEvent = (rawEvent: string) => {
    const lines = rawEvent
      .split('\n')
      .map((line) => line.trimEnd())
      .filter(Boolean);
    const dataLines = lines
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.slice(5).trim());
    const data = dataLines.length > 1 ? dataLines.join('') : dataLines.join('\n').trim();

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

  const flushPendingEvent = (allowPartialPayloadFailure = false) => {
    if (!pending.trim()) return;

    const buffered = pending;
    pending = '';

    try {
      flushEvent(buffered);
    } catch (error) {
      if (allowPartialPayloadFailure && error instanceof SyntaxError) {
        return;
      }
      throw error;
    }
  };

  while (true) {
    let chunk: ReadableStreamReadResult<Uint8Array>;
    try {
      chunk = await reader.read();
    } catch (error) {
      flushPendingEvent(true);

      if (finalPayload !== undefined) {
        return finalPayload;
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw error;
      }
      throw new Error(prematureCloseMessage);
    }

    const { done, value } = chunk;
    pending += decoder.decode(value || new Uint8Array(), { stream: !done });
    const events = pending.split('\n\n');
    pending = events.pop() || '';

    for (const event of events) {
      flushEvent(event);
    }

    if (done) break;
  }

  flushPendingEvent();

  if (finalPayload === undefined) {
    throw new Error('Streaming response completed without a final payload');
  }

  return finalPayload;
}
