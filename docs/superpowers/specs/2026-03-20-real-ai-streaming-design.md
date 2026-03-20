# Real AI Streaming Design

**Goal**

Make `Vibe Coding` and `Judge AI Review` use true streaming from the backend instead of local post-response progressive reveal.

**Scope**

- Add dedicated SSE endpoints for `Vibe` challenge generation and evaluation.
- Add a dedicated SSE endpoint for `Judge AI Review` while keeping deterministic judge results on the existing `/api/judge` path.
- Update frontend services and tutorial components to consume SSE incrementally and render live preview panels during generation.
- Remove pseudo-stream behavior from these two paths only.

**Approach**

- Keep the existing JSON endpoints and storage model intact for compatibility.
- Introduce new stream endpoints that emit small typed SSE events:
  - `preview` events for raw incremental text
  - `final` events with normalized structured JSON payloads
  - `error` events for recoverable failures
- Reuse the existing upstream OpenAI Responses stream, accumulate text server-side, normalize once on completion, and only persist after `final`.
- For judge flow, split the UX into two phases:
  - `/api/judge` returns deterministic judge output immediately
  - `/api/judge/review/stream` streams only the AI review derived from that deterministic payload

**Frontend State Model**

- `VibeCodingLab`
  - `streamingChallengePreview`
  - `streamingEvaluationPreview`
  - final structured `challenge` / `evaluation`
- `CodingExercise`
  - deterministic judge summary remains immediate
  - `streamingAiReviewPreview`
  - incremental `aiReview` object updated from stream final payload

**Why This Version**

- Smallest change that produces true streaming.
- Avoids redesigning the entire judge contract.
- Keeps fallback behavior simple: if streaming fails, deterministic judge result is still valid.

**Validation**

- Backend tests for SSE event generation and final normalization.
- Frontend tests for SSE consumer parsing.
- Type check, targeted pytest, production build, and post-deploy smoke verification.
