# Vibe Coding Prompt Arena Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first production-ready Prompt Arena inside `Vibe Coding Lab` so authenticated users can receive AI-generated prompt exercises, submit prompts for AI-only quality scoring, persist attempt history, and get adaptive recommendations.

**Architecture:** Keep the feature inside the existing `/practice` flow. Use `api-proxy/main.py` as the only backend surface for challenge generation, prompt evaluation, profile aggregation, and SQLite persistence. On the frontend, keep `VibeCodingLab.tsx` as the host screen, but move API calls and payload shaping into a dedicated service module so the UI can evolve without turning into one large state machine.

**Tech Stack:** React 19 + TypeScript + Vite frontend, FastAPI + SQLite backend, existing auth session model, OpenAI-compatible upstream AI provider via `api-proxy`, pytest for new backend endpoint tests.

---

## File Map

- Modify: `src/components/tutorials/VibeCodingLab.tsx`
  - Add the real Prompt Arena UI states: idle, challenge ready, evaluating, evaluated, history review.
- Create: `src/services/vibeCodingService.ts`
  - Encapsulate generate/evaluate/history/profile API calls and response typing.
- Create: `src/types/vibeCoding.ts`
  - Shared TypeScript shapes for challenge, evaluation, profile, history, and UI state.
- Modify: `src/i18n/practiceTranslations.ts`
  - Add user-facing copy for Prompt Arena states, scores, history, errors, and track labels.
- Modify: `api-proxy/main.py`
  - Add SQLite tables, generation/evaluation/profile/history endpoints, and adaptive recommendation logic.
- Create: `api-proxy/requirements-dev.txt`
  - Add pytest test dependency without polluting production requirements.
- Create: `api-proxy/tests/test_vibe_coding_api.py`
  - Cover table init, authenticated generation, evaluation payload shape, history persistence, and profile recommendation.
- Optional modify: `deploy/docker/api-proxy.Dockerfile`
  - Only if tests or local execution need an explicit copy/layout change. Avoid if not required.

## Verification Strategy

- Frontend baseline: `npm run build`
- Frontend targeted lint: `npx eslint src/components/tutorials/VibeCodingLab.tsx src/services/vibeCodingService.ts src/types/vibeCoding.ts`
- Backend syntax: `python -m py_compile api-proxy/main.py`
- Backend tests: `python -m pytest api-proxy/tests/test_vibe_coding_api.py -q`
- End-to-end smoke (manual or scripted):
  - authenticated `POST /api/vibe-coding/generate`
  - authenticated `POST /api/vibe-coding/evaluate`
  - authenticated `GET /api/vibe-coding/history`
  - authenticated `GET /api/vibe-coding/profile`

## Chunk 1: Backend Persistence Foundation

### Task 1: Add vibe coding tables to auth SQLite initialization

**Files:**
- Modify: `api-proxy/main.py`

- [ ] **Step 1: Locate `init_auth_db()` and list the existing schema blocks**

Run: `rg -n "def init_auth_db|CREATE TABLE IF NOT EXISTS users|user_sessions" api-proxy/main.py`
Expected: find the auth schema section and the best insertion point for new tables.

- [ ] **Step 2: Add new table DDL for challenges, attempts, and profile aggregates**

Implement in `init_auth_db()`:
- `vibe_challenges`
- `vibe_prompt_attempts`
- `vibe_user_profiles`
- useful indexes on `user_id`, `challenge_id`, and `created_at`

Keep the first version schema simple:
- JSON stored as text
- nullable recommendation/profile fields allowed where useful

- [ ] **Step 3: Add lightweight migration guards for future-safe rollout**

Implement column checks with `PRAGMA table_info(...)` where needed so old deployments upgrade cleanly instead of requiring a DB reset.

- [ ] **Step 4: Run backend syntax validation**

Run: `python -m py_compile api-proxy/main.py`
Expected: no syntax errors.

## Chunk 2: Backend Domain Helpers

### Task 2: Add backend models and normalization helpers

**Files:**
- Modify: `api-proxy/main.py`

- [ ] **Step 1: Add constants for valid tracks, difficulties, and score dimensions**

Define:
- track enum: `frontend`, `backend`, `debugging`, `refactoring`, `review`
- difficulty enum: `beginner`, `intermediate`, `advanced`
- score dimension keys

- [ ] **Step 2: Add payload validation helpers**

Implement helper functions to:
- sanitize track and difficulty
- validate prompt length
- validate evaluation payload shape
- validate generated challenge payload shape

Use small pure helpers so pytest can target them directly if needed.

- [ ] **Step 3: Add persistence helpers**

Implement helpers for:
- inserting generated challenges
- inserting evaluated attempts
- reading user history
- reading/upserting user profile aggregates

Keep SQL isolated in small functions rather than embedded directly in route handlers.

- [ ] **Step 4: Add adaptive recommendation calculator**

Implement one pure function that:
- reads recent attempts
- computes average score over recent window
- returns recommended difficulty
- identifies weakest track and weakest dimension

Use the explainable rules from the approved spec.

- [ ] **Step 5: Re-run syntax validation**

Run: `python -m py_compile api-proxy/main.py`
Expected: pass.

## Chunk 3: Backend AI Generation and Evaluation Endpoints

### Task 3: Add challenge generation endpoint

**Files:**
- Modify: `api-proxy/main.py`

- [ ] **Step 1: Reuse existing authenticated user flow**

Find and reuse `require_authenticated_user(request)` so Prompt Arena endpoints are session-protected like existing AI routes.

- [ ] **Step 2: Add challenge generator prompt template**

Create a small dedicated generator prompt builder near the current AI request helpers.

It must:
- require JSON output
- produce title, scenario, requirements, constraints, success criteria, expected focus
- honor track and difficulty

- [ ] **Step 3: Add `POST /api/vibe-coding/generate`**

Route behavior:
- require auth
- derive user profile context
- call AI provider
- validate returned JSON
- persist challenge row
- return normalized challenge payload

- [ ] **Step 4: Handle upstream failures cleanly**

Map malformed AI output or upstream failures to stable API errors:
- no raw provider dump
- keep response shape predictable

- [ ] **Step 5: Run syntax validation**

Run: `python -m py_compile api-proxy/main.py`
Expected: pass.

### Task 4: Add prompt evaluation endpoint

**Files:**
- Modify: `api-proxy/main.py`

- [ ] **Step 1: Add evaluator prompt template**

Create a dedicated evaluator prompt builder that:
- scores prompt text only
- uses the 100-point rubric
- returns total score, dimension scores, strengths, weaknesses, rewrite example, and next difficulty recommendation

- [ ] **Step 2: Add `POST /api/vibe-coding/evaluate`**

Route behavior:
- require auth
- validate `challenge_id` ownership
- validate prompt text length
- call AI provider
- validate evaluation JSON shape
- persist attempt row
- update profile aggregate
- return normalized evaluation payload

- [ ] **Step 3: Add `GET /api/vibe-coding/history` and `GET /api/vibe-coding/profile`**

History:
- latest-first attempt list
- include challenge summary and stored evaluation fields

Profile:
- current recommended track
- recommended difficulty
- weakest dimension
- recent average

- [ ] **Step 4: Re-run syntax validation**

Run: `python -m py_compile api-proxy/main.py`
Expected: pass.

## Chunk 4: Backend Tests

### Task 5: Add minimal pytest harness

**Files:**
- Create: `api-proxy/requirements-dev.txt`
- Create: `api-proxy/tests/test_vibe_coding_api.py`

- [ ] **Step 1: Add test dependency file**

Add:
- `pytest`

Keep production `requirements.txt` untouched.

- [ ] **Step 2: Add a test app fixture and temp DB setup**

In `api-proxy/tests/test_vibe_coding_api.py`:
- create temporary auth DB path
- import app and initialization helpers
- use a predictable user/session row

- [ ] **Step 3: Write failing tests for the new endpoints**

Cover:
- table initialization creates vibe tables
- unauthenticated generate/evaluate/history/profile requests fail with 401
- authenticated generate returns normalized challenge shape
- authenticated evaluate persists attempt and returns score structure
- profile endpoint reflects updated recommendation data

- [ ] **Step 4: Run the tests to confirm expected failures before implementation completion**

Run: `python -m pytest api-proxy/tests/test_vibe_coding_api.py -q`
Expected initially: failing tests for missing routes/helpers until implementation is complete.

- [ ] **Step 5: After implementation, rerun the same test command until green**

Run: `python -m pytest api-proxy/tests/test_vibe_coding_api.py -q`
Expected final state: all tests pass.

## Chunk 5: Frontend Service and Types

### Task 6: Add typed frontend service layer

**Files:**
- Create: `src/types/vibeCoding.ts`
- Create: `src/services/vibeCodingService.ts`

- [ ] **Step 1: Add shared TypeScript types**

Create typed interfaces for:
- `VibeTrack`
- `VibeDifficulty`
- `VibeChallenge`
- `VibeEvaluation`
- `VibeHistoryEntry`
- `VibeProfile`

- [ ] **Step 2: Add API service wrappers**

Create service functions:
- `generateVibeChallenge()`
- `evaluateVibePrompt()`
- `fetchVibeHistory()`
- `fetchVibeProfile()`

Service rules:
- use same-origin `/api/...`
- include credentials
- normalize error messages

- [ ] **Step 3: Add one small service-only smoke validation via build**

Run: `npm run build`
Expected: type-safe service integration compiles.

## Chunk 6: Frontend Prompt Arena UI

### Task 7: Upgrade Vibe Coding Lab into a real training surface

**Files:**
- Modify: `src/components/tutorials/VibeCodingLab.tsx`
- Modify: `src/i18n/practiceTranslations.ts`

- [ ] **Step 1: Add UI state model**

Inside `VibeCodingLab.tsx`, add explicit state for:
- profile loading
- challenge loading
- current challenge
- prompt draft
- evaluation loading
- latest evaluation
- history loading
- history list
- selected history entry
- recoverable error

- [ ] **Step 2: Replace static training placeholders with live Prompt Arena sections**

Implement sections for:
- today panel
- challenge card
- prompt editor
- evaluation panel
- history panel

Keep the rest of the current module cards intact unless they block the Prompt Arena flow.

- [ ] **Step 3: Add prompt submission UX guards**

Implement:
- min length guard
- disabled submit while evaluating
- preserved draft on API failure
- retry action on generate/evaluate failure

- [ ] **Step 4: Add history replay actions**

Allow:
- retry same challenge
- prefill retry using rewrite example as a learning aid

- [ ] **Step 5: Add translation strings**

In `src/i18n/practiceTranslations.ts`, add new labels for:
- tracks
- difficulties
- scoring dimensions
- loading states
- evaluation states
- errors
- history actions

- [ ] **Step 6: Run targeted frontend verification**

Run:
- `npx eslint src/components/tutorials/VibeCodingLab.tsx src/services/vibeCodingService.ts src/types/vibeCoding.ts`
- `npm run build`

Expected: both pass.

## Chunk 7: End-to-End Verification

### Task 8: Add minimum reproducible smoke flow

**Files:**
- Option A: Create `scripts/test_vibe_prompt_arena.py`
- Option B: Document exact manual smoke commands in the final delivery if a script is not worth adding

- [ ] **Step 1: Authenticate as a test user**

Re-use the existing auth flow to obtain session cookies.

- [ ] **Step 2: Call generate endpoint**

Verify:
- 200 response
- challenge payload shape

- [ ] **Step 3: Call evaluate endpoint**

Verify:
- 200 response
- score payload shape
- rewrite example exists

- [ ] **Step 4: Call history/profile endpoints**

Verify:
- history contains the new attempt
- profile reflects the attempt in its aggregate fields

- [ ] **Step 5: Rebuild and, if deploying immediately, run live health checks**

Run:
- `npm run build`
- `python -m py_compile api-proxy/main.py`
- `python -m pytest api-proxy/tests/test_vibe_coding_api.py -q`

If deploying in the same session:
- rebuild Docker stack
- verify `/api/health`
- verify authenticated Prompt Arena flow against production

## Recommended Implementation Order

1. Backend schema and helpers
2. Backend generate/evaluate/history/profile routes
3. Backend pytest coverage
4. Frontend types and service layer
5. Frontend Prompt Arena UI
6. End-to-end smoke validation

## Guardrails

- Keep Prompt Arena inside the existing `/practice -> Vibe Coding Lab` surface
- Do not introduce a separate route in the first slice
- Do not score generated code outputs in v1
- Do not add gamification in v1
- Preserve existing auth/session behavior
- Prefer additive schema changes over risky rewrites

Plan complete and saved to `docs/superpowers/plans/2026-03-14-vibe-coding-prompt-arena.md`. Ready to execute?
