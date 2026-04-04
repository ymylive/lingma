import { describe, expect, it, vi } from 'vitest';

import { readStreamingSse } from './streamingSse';

function createSseResponse(lines: string[], status = 200): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const line of lines) {
        controller.enqueue(encoder.encode(line));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    status,
    headers: {
      'Content-Type': 'text/event-stream',
    },
  });
}

function createReaderResponse(
  steps: Array<
    | { done?: boolean; value?: string }
    | { error: Error }
  >,
): Response {
  const encoder = new TextEncoder();
  const reader = {
    read: vi.fn(async () => {
      const step = steps.shift();
      if (!step) {
        return { done: true, value: undefined };
      }
      if ('error' in step) {
        throw step.error;
      }
      return {
        done: Boolean(step.done),
        value: step.value ? encoder.encode(step.value) : undefined,
      };
    }),
  };

  return {
    ok: true,
    body: {
      getReader: () => reader,
    },
  } as Response;
}

describe('readStreamingSse', () => {
  it('throws status-based error when non-OK response has empty body', async () => {
    const response = new Response('', { status: 502 });

    await expect(readStreamingSse(response)).rejects.toThrow('Streaming request failed: 502');
  });

  it('surfaces detail message from non-OK JSON response', async () => {
    const response = new Response(JSON.stringify({ detail: 'gateway denied' }), { status: 502 });

    await expect(readStreamingSse(response)).rejects.toThrow('gateway denied');
  });

  it('surfaces plain-text body from non-OK response', async () => {
    const response = new Response('plain backend failure', { status: 500 });

    await expect(readStreamingSse(response)).rejects.toThrow('plain backend failure');
  });

  it('throws when OK response has no readable body', async () => {
    const response = new Response(null, { status: 204 });

    await expect(readStreamingSse(response)).rejects.toThrow('Streaming response body is unavailable');
  });

  it('throws error event message from stream', async () => {
    const response = createSseResponse([
      'data: {"type":"preview","text":"partial"}\n\n',
      'data: {"type":"error","message":"model crashed"}\n\n',
    ]);

    await expect(readStreamingSse(response)).rejects.toThrow('model crashed');
  });

  it('throws when stream completes without final payload', async () => {
    const onProgress = vi.fn();
    const response = createSseResponse([
      'data: {"type":"preview","text":"partial"}\n\n',
      'data: [DONE]\n\n',
    ]);

    await expect(readStreamingSse(response, onProgress)).rejects.toThrow(
      'Streaming response completed without a final payload',
    );
    expect(onProgress).toHaveBeenCalledWith('partial');
  });

  it('supports SSE events split by event boundaries instead of individual lines', async () => {
    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode('data: {"type":"preview","text":"partial"}\n\n'));
        controller.enqueue(encoder.encode('data: {"type":"final","payload":{"value":42}}\n\n'));
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    const response = new Response(stream, {
      status: 200,
      headers: { 'Content-Type': 'text/event-stream' },
    });
    const onProgress = vi.fn();

    await expect(readStreamingSse<{ value: number }>(response, onProgress)).resolves.toEqual({ value: 42 });
    expect(onProgress).toHaveBeenCalledWith('partial');
  });

  it('supports multi-line data fields in a single SSE event', async () => {
    const response = createSseResponse([
      'data: {"type":"preview","text":"partial"}\n',
      '\n',
      'data: {"type":"final",\n',
      'data: "payload":{"value":7}}\n',
      '\n',
      'data: [DONE]\n',
      '\n',
    ]);

    await expect(readStreamingSse<{ value: number }>(response)).resolves.toEqual({ value: 7 });
  });

  it('returns the final payload when the connection drops after the final event arrived', async () => {
    const response = createReaderResponse([
      { value: 'data: {"type":"preview","text":"partial"}\n\n' },
      { value: 'data: {"type":"final","payload":{"value":9}}\n\n' },
      { error: new Error('Response ended prematurely') },
    ]);
    const onProgress = vi.fn();

    await expect(readStreamingSse<{ value: number }>(response, onProgress)).resolves.toEqual({ value: 9 });
    expect(onProgress).toHaveBeenCalledWith('partial');
  });

  it('returns the final payload when the last buffered event is complete but the stream closes early', async () => {
    const response = createReaderResponse([
      { value: 'data: {"type":"final","payload":{"value":11}}' },
      { error: new Error('Response ended prematurely') },
    ]);

    await expect(readStreamingSse<{ value: number }>(response)).resolves.toEqual({ value: 11 });
  });

  it('normalizes abrupt connection termination before the final payload arrives', async () => {
    const response = createReaderResponse([
      { value: 'data: {"type":"preview","text":"partial"}\n\n' },
      { error: new Error('Response ended prematurely') },
    ]);

    await expect(readStreamingSse(response)).rejects.toThrow(
      'Streaming connection closed before the final payload arrived',
    );
  });
});
