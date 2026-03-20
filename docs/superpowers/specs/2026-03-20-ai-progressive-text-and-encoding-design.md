# AI Progressive Text And Encoding Design

**Date:** 2026-03-20

**Status:** Approved in chat

## Goal

Make all AI-generated text in the frontend render with a progressive typewriter-style reveal while fixing the current garbled-text issue caused by inconsistent response decoding in the shared AI proxy path.

## Scope

This change covers three user-visible AI surfaces:

- AI exercise generation in `src/components/tutorials/AIExerciseGenerator.tsx`
- Vibe Coding challenge and evaluation content in `src/components/tutorials/VibeCodingLab.tsx`
- judge AI review content in `src/components/tutorials/CodingExercise.tsx`

The change also covers the shared backend decoding path in `api-proxy/main.py` used by:

- `/api/ai`
- `/api/ai/stream`
- `/api/vibe-coding/generate`
- `/api/vibe-coding/evaluate`
- `/api/judge` AI review

## Non-Goals

This release does not:

- change the upstream AI protocol
- introduce field-level SSE contracts for Vibe or judge AI review
- animate deterministic judge text
- animate user-authored text or locally static copy
- add a frontend unit-test stack

## Root Cause

The current backend helper `decode_response_text()` relies on `requests.Response.text`, which can decode bytes using an incorrect inferred encoding when the upstream response omits or misstates charset information. Because the same helper is reused across AI exercise generation, Vibe, and judge AI review, a single decoding error can surface as garbled Chinese text in multiple products.

## Architecture

### 1. Backend decoding fix

Keep the backend contract unchanged and fix the shared decode boundary.

Implementation rule:

- prefer `response.content.decode("utf-8")`
- if strict UTF-8 decoding fails, fall back to `response.content.decode("utf-8", errors="replace")`
- only use response metadata as a last resort if needed

This keeps all AI text paths on a consistent UTF-8-first strategy.

### 2. Frontend progressive reveal

Add one reusable progressive-render helper for AI payloads.

Behavior:

- `string` values reveal character by character
- `string[]` values reveal item by item, with each string progressing character by character
- nested objects recurse
- numbers, booleans, and null render immediately
- reduced-motion users receive the full payload immediately
- when a new AI payload arrives, the reveal state resets and replays from the start

### 3. Surface-specific integration

#### AI Exercise Generator

Use the final parsed AI payload as the source of truth, then render a progressively revealed mirror object for:

- `title`
- `description`
- `testCases[].description`
- `hints[]`
- `explanation`
- fill-blank `description`
- fill-blank `blanks[].hint`
- fill-blank `explanation`

Code templates, solutions, and expected outputs remain exact text from the payload, but still reveal progressively because the requirement is to apply the effect to all AI-returned fields.

#### Vibe Coding

Apply the progressive reveal to:

- challenge `title`
- challenge `scenario`
- challenge `requirements[]`
- challenge `constraints[]`
- challenge `successCriteria[]`
- evaluation `strengths[]`
- evaluation `weaknesses[]`
- evaluation `rewrite_example`

Scores and numeric indicators remain immediate.

#### Judge AI Review

Apply the progressive reveal to:

- `overallDiagnosis`
- `errorPoints[]`
- `fixSuggestions[]`
- `optimizationSuggestions[]`
- `nextStep`

The deterministic judge summary remains unchanged.

## Risks And Mitigations

### Risk: progressive rendering causes excessive rerenders

Mitigation:

- centralize scheduling in one helper
- only animate leaf text fields
- keep numeric and boolean fields immediate

### Risk: reduced-motion accessibility regression

Mitigation:

- detect reduced-motion and bypass animation entirely

### Risk: malformed AI payloads break reveal logic

Mitigation:

- progressive helper operates on already-parsed, typed payloads
- parsing and normalization stay unchanged

## Validation

- backend focused pytest coverage for decoding behavior
- `python -m py_compile api-proxy/main.py`
- `npx tsc -b`
- `npx vite build`
