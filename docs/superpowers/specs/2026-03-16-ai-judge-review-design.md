# AI Judge Review Design

**Date:** 2026-03-16

**Status:** Approved in chat, pending final user review

## Goal

Add an AI-assisted review layer to the existing coding judge so failed or non-perfect submissions receive structured diagnosis, multi-dimensional scoring, and targeted improvement advice.

## Product Scope

This feature extends the current coding exercise judge flow. It does not replace deterministic judging.

The first release includes:

- deterministic judge runs first and remains the source of truth
- AI review runs only when the submission is not fully passing or the score is below 100
- four scoring dimensions:
  - correctness
  - boundary robustness
  - complexity and performance
  - code quality and readability
- AI diagnosis of likely failure points
- fix suggestions for current errors
- optimization suggestions for non-perfect but mostly correct code
- frontend rendering of the AI review below the existing judge result

The first release does not include:

- AI review on perfect 100-point submissions
- asynchronous polling or background jobs
- persistence of AI review history
- changes to sandbox execution behavior
- replacement of existing summary, checkpoints, or test-case feedback

## Core User Flow

1. User writes code in the existing coding exercise editor.
2. User submits the solution for judging.
3. The deterministic judge evaluates compilation, execution, checkpoints, and score.
4. If the result is fully passed and the score is 100, the response returns with `aiReview.status = skipped` and no generated analysis content.
5. If the result is not fully passed or the score is below 100, the API proxy sends a structured review request to the configured AI model.
6. The frontend renders the standard judge result first, then shows the AI review section when present.
7. If AI review fails or times out, the deterministic result still returns successfully and the page remains usable.

## Architecture

The first release keeps the current split of responsibilities.

### 1. `judge-server`

Purpose:

- compile and run submitted code
- compare outputs
- compute deterministic results, checkpoint summaries, and score

Boundary:

- no AI calls
- no prompt construction
- no user model resolution

Reason:

- preserve execution isolation and keep judge behavior predictable

### 2. `api-proxy`

Purpose:

- proxy the judge request
- decide whether AI review should run
- resolve the active AI model using the existing default-plus-user-override logic
- build the AI prompt from exercise context, submitted code, and deterministic judge output
- validate and normalize the AI JSON response
- attach `aiReview` to the judge response

Boundary:

- AI review is optional and non-blocking for overall judge success
- if AI output is invalid, missing, or timed out, the proxy returns the original judge result with an unavailable review status

### 3. Frontend Judge UI

Purpose:

- submit enough exercise context for AI review
- continue rendering the current judge summary, checkpoints, and failed-case details
- render the optional `aiReview` block below the existing result card

Boundary:

- must degrade cleanly when `aiReview` is missing or unavailable
- must not depend on AI review for baseline judge usability

## Trigger Rules

AI review is triggered only when either of these conditions is true:

- `allPassed === false`
- `summary.score < 100`

AI review is skipped when both of these conditions are true:

- `allPassed === true`
- `summary.score === 100`

This rule keeps cost and latency focused on the submissions that need coaching.

## Request and Response Contract

### Request Additions

The judge request should carry enough exercise context for the AI review to understand the problem without scraping frontend-only state.

Required context:

- `exerciseId` when available
- `title`
- `description`
- `difficulty`

Optional context:

- `category`
- `explanation`

The existing `code`, `language`, and `testCases` request fields remain unchanged.

### Response Additions

The existing judge response remains backward compatible and gains an optional `aiReview` object.

Response shape:

- `triggered`: boolean
- `status`: `generated | skipped | unavailable`
- `model`: string
- `totalScore`: number
- `dimensionScores`:
  - `correctness`
  - `boundaryRobustness`
  - `complexityAndPerformance`
  - `codeQualityAndReadability`
- `overallDiagnosis`: string
- `errorPoints`: string[]
- `fixSuggestions`: string[]
- `optimizationSuggestions`: string[]
- `nextStep`: string

Canonical state rules:

### `generated`

- `triggered` is `true`
- `status` is `generated`
- all scoring and analysis fields are required

### `skipped`

- `triggered` is `false`
- `status` is `skipped`
- `model` may be omitted
- `totalScore`, `dimensionScores`, `overallDiagnosis`, `errorPoints`, `fixSuggestions`, `optimizationSuggestions`, and `nextStep` are omitted

### `unavailable`

- `triggered` is `true`
- `status` is `unavailable`
- `model` should be included when known
- `totalScore`, `dimensionScores`, `overallDiagnosis`, `errorPoints`, `fixSuggestions`, `optimizationSuggestions`, and `nextStep` are omitted
- deterministic judge payload still returns normally

## Scoring Model

The AI review uses a fixed 100-point rubric:

1. `correctness`: 40
2. `boundaryRobustness`: 20
3. `complexityAndPerformance`: 20
4. `codeQualityAndReadability`: 20

Contract rule:

- `totalScore` must equal the sum of the four dimension scores
- response normalization should reject generated reviews that violate this invariant

Guidance for the model:

- score against the submitted code and deterministic judge evidence
- do not ignore judge failures
- do not invent hidden test details
- do not over-penalize style when correctness is the dominant issue
- focus on actionable teaching value rather than generic praise

## AI Prompt Design

The proxy should send one structured request that includes:

- exercise metadata
- submitted language
- submitted code
- deterministic summary
- checkpoint summaries
- failed test-case details
- compile or runtime error text when present

The model should return JSON only.

Evidence rules by failure type:

- compile-error submissions must include the compilation error output
- runtime-error submissions must include the runtime error text and any relevant failing case metadata
- wrong-answer submissions must include failed case inputs, expected output, actual output, and checkpoint context
- if hidden cases are involved, the prompt must only use the redacted values already exposed by the deterministic judge

Required review behavior:

- explain the likely root cause of failure or lost points
- highlight at most a few high-signal error points
- give concrete fix suggestions tied to the observed judge output
- give optimization suggestions only when relevant
- provide a short next step the learner can apply immediately

## Error Handling and Fallbacks

The first release must treat AI review as advisory, not required.

Failure handling:

- deterministic judge failure still returns its normal error/result payload
- AI timeout does not fail the whole judge request
- invalid AI JSON is discarded after normalization failure
- frontend must not crash if `aiReview` is absent

Operational rule:

- if AI review fails, return the deterministic response and mark AI review unavailable rather than surfacing a full request error to the user

## Frontend Presentation

The current judge summary remains the primary result.

The AI review section should appear below the existing summary and failed-case details.

When `aiReview.status = skipped`, the frontend should hide the AI review section rather than render an empty card.

Recommended content order:

1. AI review header and status
2. total AI score
3. four dimension scores
4. overall diagnosis
5. error points
6. fix suggestions
7. optimization suggestions
8. next step

Presentation goals:

- readable on mobile without horizontal overflow
- clearly secondary to deterministic judge truth
- useful even when only one or two dimensions are weak

## Validation Strategy

The minimum validation for this feature should cover:

### Backend

- AI review is skipped on perfect submissions
- AI review is triggered on failed submissions
- AI review is triggered on passed-but-not-100 submissions
- invalid AI output degrades to `status: unavailable`
- compile-error submissions include compiler output in AI review evidence
- runtime-error submissions include runtime error text in AI review evidence

### Frontend

- existing judge UI still renders when `aiReview` is absent
- AI review panel renders when `status: generated`
- unavailable review state renders without breaking the result card

## Risks and Non-Goals

Primary risks:

- added latency on non-perfect submissions
- noisy AI advice if prompt scope is too broad
- schema drift if AI output is not strictly normalized

Mitigations:

- trigger only when coaching is needed
- reuse existing structured JSON validation patterns
- keep the first version transient and synchronous

Non-goals for this version:

- storing AI review history
- comparing multiple attempts
- auto-fixing user code
- turning AI review into the final judge verdict

## Implementation Boundaries

The first implementation should touch only the minimum required files:

- `api-proxy/main.py`
- `src/services/judgeService.ts`
- `src/components/tutorials/CodingExercise.tsx`

`judge-server/server.js` should remain unchanged unless a small compatibility adjustment is proven necessary during implementation.
