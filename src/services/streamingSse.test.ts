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
      'data: {"type":"preview","text":"partial"}\n',
      'data: {"type":"error","message":"model crashed"}\n',
    ]);

    await expect(readStreamingSse(response)).rejects.toThrow('model crashed');
  });

  it('throws when stream completes without final payload', async () => {
    const onProgress = vi.fn();
    const response = createSseResponse([
      'data: {"type":"preview","text":"partial"}\n',
      'data: [DONE]\n',
    ]);

    await expect(readStreamingSse(response, onProgress)).rejects.toThrow(
      'Streaming response completed without a final payload',
    );
    expect(onProgress).toHaveBeenCalledWith('partial');
  });

  it('throws on malformed JSON event payload', async () => {
    const response = createSseResponse(['data: {"type":"preview"\n']);

    await expect(readStreamingSse(response)).rejects.toThrow();
  });
});
