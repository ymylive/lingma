# Real AI Streaming Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Vibe Coding and Judge AI Review use true backend streaming with live preview panels and final structured payloads.

**Architecture:** Keep existing JSON APIs for compatibility, add new SSE endpoints for Vibe generate/evaluate and Judge Review, then teach the frontend service layer to consume typed SSE events and update UI state incrementally. Deterministic judge execution stays synchronous; only the AI review becomes a second streaming phase.

**Tech Stack:** FastAPI, requests SSE consumption, React 19, TypeScript, Vite, pytest.

---

## Chunk 1: Stream Contract

### Task 1: Define shared SSE event shapes in frontend and backend touchpoints

**Files:**
- Modify: `api-proxy/main.py`
- Modify: `src/services/vibeCodingService.ts`
- Modify: `src/services/judgeService.ts`

- [ ] Document event names and payloads:
  - `preview`
  - `final`
  - `error`
- [ ] Keep payload shape flat and JSON-safe.
- [ ] Ensure `final` always carries the normalized object used by current UI.

## Chunk 2: Backend TDD

### Task 2: Add failing tests for Vibe generation/evaluation stream endpoints

**Files:**
- Modify: `api-proxy/tests/test_judge_ai_review.py`
- Create: `api-proxy/tests/test_vibe_streaming.py`

- [ ] Write failing tests for:
  - stream emits preview chunks
  - stream emits final normalized payload
  - stream persists final Vibe records after completion
- [ ] Run the targeted tests and verify they fail for the missing endpoints.

### Task 3: Add failing tests for Judge Review stream endpoint

**Files:**
- Modify: `api-proxy/tests/test_judge_proxy_contract.py`
- Modify: `api-proxy/tests/test_judge_ai_review.py`

- [ ] Write failing tests for:
  - `/api/judge/review/stream` requires auth and internal token configuration
  - endpoint emits preview chunks and final normalized AI review payload
  - unavailable/deferred modes emit final advisory payloads instead of crashing
- [ ] Run targeted tests and verify they fail for the missing endpoint/behavior.

## Chunk 3: Backend Implementation

### Task 4: Implement reusable upstream text streaming helpers

**Files:**
- Modify: `api-proxy/main.py`

- [ ] Add helper to convert upstream Responses SSE into accumulated text plus yielded preview deltas.
- [ ] Reuse UTF-8-safe decoding path already added for `/api/ai/stream`.
- [ ] Keep normalization/persistence at the end of the stream only.

### Task 5: Implement Vibe streaming endpoints

**Files:**
- Modify: `api-proxy/main.py`

- [ ] Add `/api/vibe-coding/generate/stream`
- [ ] Add `/api/vibe-coding/evaluate/stream`
- [ ] Emit `preview`, `final`, and `error` events.
- [ ] Persist challenge/attempt rows after successful `final`.

### Task 6: Implement Judge Review streaming endpoint

**Files:**
- Modify: `api-proxy/main.py`

- [ ] Add `/api/judge/review/stream`
- [ ] Accept deterministic judge payload plus exercise context.
- [ ] Reuse existing review prompt + normalization.
- [ ] Emit advisory `final` payloads for `deferred` / `unavailable`.

## Chunk 4: Frontend TDD

### Task 7: Add failing tests for SSE consumers

**Files:**
- Create: `src/services/__tests__/vibeCodingService.streaming.test.ts`
- Create: `src/services/__tests__/judgeService.streaming.test.ts`

- [ ] Write tests for parsing `preview`, `final`, and `error` events from SSE bodies.
- [ ] Verify the consumers call progress callbacks before final resolution.
- [ ] Run targeted tests and verify they fail first.

## Chunk 5: Frontend Implementation

### Task 8: Add streaming service helpers

**Files:**
- Modify: `src/services/vibeCodingService.ts`
- Modify: `src/services/judgeService.ts`

- [ ] Add SSE reader utility for Vibe and Judge Review.
- [ ] Expose `onProgress` callback support and final resolved structured payload.
- [ ] Preserve existing non-streaming APIs when still needed elsewhere.

### Task 9: Update Vibe Coding UI

**Files:**
- Modify: `src/components/tutorials/VibeCodingLab.tsx`

- [ ] Replace `useProgressiveAiObject` for challenge/evaluation rendering on active generation paths.
- [ ] Add preview cards with `aria-live="polite"` and stable layout.
- [ ] Keep history rendering unchanged.

### Task 10: Update Judge Review UI

**Files:**
- Modify: `src/components/tutorials/CodingExercise.tsx`

- [ ] Keep deterministic judge summary immediate.
- [ ] Start AI review stream right after judge result indicates review should run.
- [ ] Replace pseudo progressive review rendering with streamed preview + final structured review.

### Task 11: Update changelog

**Files:**
- Modify: `CHANGELOG.md`

- [ ] Record true streaming rollout for Vibe and Judge AI Review.

## Chunk 6: Verification

### Task 12: Run targeted verification

**Files:**
- No code changes

- [ ] Run: `python -m pytest api-proxy/tests/test_vibe_streaming.py api-proxy/tests/test_judge_ai_review.py api-proxy/tests/test_judge_proxy_contract.py -q`
- [ ] Run: `npx tsc -b`
- [ ] Run: `npm run build`

### Task 13: Deploy and smoke test

**Files:**
- No code changes

- [ ] Run deploy with UTF-8 console env.
- [ ] Verify `docker-compose ps`
- [ ] Verify `/api/health`
- [ ] Manually exercise Vibe generate/evaluate and Judge AI Review live streaming on production.
