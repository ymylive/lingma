# AI Progressive Text And Encoding Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix shared AI text decoding so Chinese text no longer appears garbled, and progressively reveal all AI-returned frontend fields across AI exercise generation, Vibe Coding, and judge AI review.

**Architecture:** Keep the backend API contracts stable and fix the shared UTF-8 decoding boundary in `api-proxy/main.py`. In the frontend, add one reusable progressive AI payload hook that reveals string leaves over time, then wire it into the three existing AI surfaces without changing deterministic content or page structure.

**Tech Stack:** FastAPI + requests + pytest on the backend, React 19 + TypeScript + Vite on the frontend.

---

## File Map

- Modify: `api-proxy/main.py`
  - Fix shared AI response decoding.
- Modify: `api-proxy/tests/test_judge_ai_review.py`
  - Add a focused decoding regression test.
- Create: `src/hooks/useProgressiveAiObject.ts`
  - Reusable progressive reveal hook for parsed AI payloads.
- Modify: `src/components/tutorials/AIExerciseGenerator.tsx`
  - Render generated exercise and fill-blank payloads through progressive mirrors.
- Modify: `src/components/tutorials/VibeCodingLab.tsx`
  - Render challenge and evaluation AI text through progressive mirrors.
- Modify: `src/components/tutorials/CodingExercise.tsx`
  - Render judge AI review text through progressive mirrors.

## Verification Strategy

- Backend syntax: `python -m py_compile api-proxy/main.py`
- Backend tests: `python -m pytest api-proxy/tests/test_judge_ai_review.py -q`
- Frontend type check: `npx tsc -b`
- Frontend build: `npx vite build`

## Chunk 1: Backend decoding fix

### Task 1: Add a failing decoding regression test

**Files:**
- Modify: `api-proxy/tests/test_judge_ai_review.py`

- [ ] **Step 1: Write the failing test**

Add a test that constructs a fake response object with UTF-8 bytes for Chinese text, a wrong declared encoding, and asserts `decode_response_text()` still returns correct Chinese output.

- [ ] **Step 2: Run the test to verify it fails**

Run: `python -m pytest api-proxy/tests/test_judge_ai_review.py -q -k decode_response_text_prefers_utf8_bytes`
Expected: FAIL because the current implementation trusts `response.text`.

- [ ] **Step 3: Implement the minimal backend fix**

Update `decode_response_text()` to decode from raw bytes with UTF-8 first and only fall back when needed.

- [ ] **Step 4: Re-run the focused test**

Run: `python -m pytest api-proxy/tests/test_judge_ai_review.py -q -k decode_response_text_prefers_utf8_bytes`
Expected: PASS.

## Chunk 2: Reusable frontend progressive reveal

### Task 2: Add the reusable hook

**Files:**
- Create: `src/hooks/useProgressiveAiObject.ts`

- [ ] **Step 1: Implement a recursive progressive reveal helper**

Support:
- strings
- arrays of strings or objects
- nested objects
- immediate pass-through for numbers, booleans, and null

- [ ] **Step 2: Respect reduced motion**

If the user prefers reduced motion, return the full payload immediately.

- [ ] **Step 3: Support replay on payload replacement**

When a new payload arrives, restart the reveal sequence from the beginning.

## Chunk 3: Surface wiring

### Task 3: AI exercise generator

**Files:**
- Modify: `src/components/tutorials/AIExerciseGenerator.tsx`

- [ ] **Step 1: Feed generated AI payloads into the progressive hook**
- [ ] **Step 2: Render progressively revealed exercise fields**
- [ ] **Step 3: Render progressively revealed fill-blank fields**

### Task 4: Vibe Coding

**Files:**
- Modify: `src/components/tutorials/VibeCodingLab.tsx`

- [ ] **Step 1: Feed challenge and evaluation payloads into the progressive hook**
- [ ] **Step 2: Render progressively revealed scenario and list fields**
- [ ] **Step 3: Render progressively revealed rewrite example**

### Task 5: Judge AI review

**Files:**
- Modify: `src/components/tutorials/CodingExercise.tsx`

- [ ] **Step 1: Feed generated AI review payload into the progressive hook**
- [ ] **Step 2: Render progressively revealed diagnosis and suggestion fields**

## Chunk 4: Verification

### Task 6: Run final validation

**Files:**
- Modify: none

- [ ] **Step 1: Run backend syntax check**

Run: `python -m py_compile api-proxy/main.py`
Expected: PASS.

- [ ] **Step 2: Run backend tests**

Run: `python -m pytest api-proxy/tests/test_judge_ai_review.py -q`
Expected: PASS.

- [ ] **Step 3: Run frontend type check**

Run: `npx tsc -b`
Expected: PASS.

- [ ] **Step 4: Run frontend production build**

Run: `npx vite build`
Expected: PASS.
