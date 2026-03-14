# Vibe Coding Prompt Arena Design

**Date:** 2026-03-14

**Status:** Approved in chat, pending final user review

## Goal

Add a new `Prompt Arena` experience inside the existing `/practice -> Vibe Coding Lab` flow so users can train professional AI prompting through AI-generated exercises, AI-only prompt scoring, rewrite suggestions, persistent history, and adaptive difficulty.

## Product Scope

This feature stays inside the current `Vibe Coding Lab` rather than becoming a separate product.

The first release includes:

- AI-generated prompt-writing challenges
- Five training tracks:
  - Frontend
  - Backend
  - Debugging
  - Refactoring
  - Review
- AI scoring for prompt quality only
- Score breakdown with explanations
- AI rewrite example
- Account-level history persistence
- Adaptive track and difficulty recommendation

The first release does not include:

- Code execution scoring
- Leaderboards
- Social sharing
- Achievements
- Multi-step conversational tutoring

## Core User Flow

1. User enters `/practice` and opens `Vibe Coding Lab`.
2. System loads the user's profile and recommends a track and difficulty.
3. User starts a new exercise.
4. AI generates a structured challenge.
5. User writes a prompt in the training editor.
6. User submits the prompt.
7. AI scores prompt quality only.
8. UI shows:
   - total score
   - four dimension scores
   - strengths
   - weaknesses
   - rewrite example
9. Attempt is stored to the user's account history.
10. System updates next recommended difficulty and track.

## Information Architecture

The Vibe Coding Lab page will contain four main areas.

### 1. Today Panel

Purpose:

- show recommended track
- show current difficulty
- show latest score snapshot
- provide a clear start action

### 2. Prompt Arena

Purpose:

- present one AI-generated challenge
- let the user write a prompt
- submit and receive AI evaluation

Layout:

- left: challenge card
- center: prompt editor
- right: evaluation result

### 3. Adaptive Track Panel

Purpose:

- explain active recommendation
- show track options
- show system-selected difficulty

Tracks:

- frontend
- backend
- debugging
- refactoring
- review

Difficulty:

- beginner
- intermediate
- advanced

Difficulty is AI-selected, not manually controlled in the main mode.

### 4. History Panel

Purpose:

- show previous attempts
- support replay and review

Actions:

- retry same challenge
- retry using rewrite example as reference

## Scoring Model

The first release uses a fixed 100-point rubric.

### Dimensions

1. Goal Clarity: 30
- Is the task objective concrete?
- Is the deliverable explicit?
- Does it avoid vague requests?

2. Boundary Constraints: 25
- Does it state what should not change?
- Does it control scope?
- Does it reduce prompt sprawl?

3. Verification Design: 25
- Does it define how success will be checked?
- Does it request tests, build checks, or acceptance evidence?

4. Output Format: 20
- Does it specify patch, review findings, steps, or another exact deliverable?

### Evaluation Output

Each evaluation returns:

- `total_score`
- `dimension_scores`
- `strengths`
- `weaknesses`
- `rewrite_example`
- `next_difficulty_recommendation`

Important rule:

- the AI evaluates the prompt text only
- it must not score based on hypothetical generated code quality

## AI Capabilities

The backend uses two separate AI prompt templates.

### A. Challenge Generator

Purpose:

- generate one structured prompt-writing exercise

Required output:

- `challenge_id`
- `title`
- `scenario`
- `requirements`
- `constraints`
- `success_criteria`
- `expected_focus`

Requirements:

- challenge must be scorable
- challenge must fit the selected track
- challenge must fit the recommended difficulty
- challenge must avoid being too broad or too trivial

### B. Prompt Evaluator

Purpose:

- score the user's prompt quality only

Required output:

- `total_score`
- four dimension scores
- strengths
- weaknesses
- rewrite example
- next difficulty recommendation

Requirements:

- must return structured JSON
- must not drift into style preference only
- must not score based on code execution result

## Backend Design

The feature should stay behind the existing `api-proxy`.

### Endpoints

`POST /api/vibe-coding/generate`

- input:
  - `track`
  - `difficulty`
  - derived user profile context
- output:
  - structured challenge payload

`POST /api/vibe-coding/evaluate`

- input:
  - `challenge_id`
  - `user_prompt`
- output:
  - structured score payload

`GET /api/vibe-coding/history`

- returns attempt history for current user

`GET /api/vibe-coding/profile`

- returns aggregated profile for recommendations

## Persistence Model

Three tables are enough for the first version.

### 1. `vibe_challenges`

- `id`
- `user_id`
- `track`
- `difficulty`
- `title`
- `scenario`
- `requirements_json`
- `constraints_json`
- `success_criteria_json`
- `expected_focus_json`
- `created_at`

### 2. `vibe_prompt_attempts`

- `id`
- `challenge_id`
- `user_id`
- `prompt_text`
- `total_score`
- `goal_clarity_score`
- `boundary_constraints_score`
- `verification_design_score`
- `output_format_score`
- `strengths_json`
- `weaknesses_json`
- `rewrite_example`
- `created_at`

### 3. `vibe_user_profiles`

- `user_id`
- `recommended_track`
- `recommended_difficulty`
- `frontend_score`
- `backend_score`
- `debug_score`
- `refactor_score`
- `review_score`
- `last_10_avg_score`
- `weakest_dimension`
- `updated_at`

## Adaptive Recommendation Rules

Keep the first version explainable.

- average of last 5 attempts `< 60`: lower difficulty
- average of last 5 attempts `60-84`: keep difficulty
- average of last 5 attempts `>= 85`: raise difficulty
- if one track is consistently below the user's overall average, recommend it again
- if one scoring dimension is repeatedly weakest, future challenges should emphasize it

## Frontend State Model

The UI should support these states.

### Idle

- shows recommendation and start action

### Challenge Ready

- challenge visible
- prompt editor enabled
- submit enabled

### Evaluating

- submit disabled
- loading state visible
- no double submit

### Evaluated

- score panel visible
- retry actions visible

### History Review

- old attempts can be reopened

## Failure Handling

The first release must handle these cases.

### Challenge generation failure

- show retry action
- do not freeze the page

### Evaluation failure

- preserve the user's prompt text
- allow retry

### Invalid AI response format

- backend validates structure
- frontend shows generic failure message

### Empty or too-short prompt

- frontend validation blocks submission

### History load failure

- training flow still works
- history panel fails independently

## Acceptance Criteria

1. The system can generate structured exercises for all five tracks.
2. The user can submit a prompt and receive a 100-point prompt-quality score.
3. The score result always includes dimension breakdown, commentary, and rewrite example.
4. Training history is saved per account and can be reviewed later.
5. The system changes recommended difficulty using recent score performance.
6. AI failures do not wipe user input or dead-end the UI.

## Implementation Boundary

First implementation should remain reviewable and incremental.

Preferred first slice:

- add Prompt Arena UI inside existing `Vibe Coding Lab`
- add generate endpoint
- add evaluate endpoint
- add persistence tables
- add history/profile read endpoints
- wire adaptive recommendation to the current user

Avoid in the first slice:

- new standalone route
- multi-page onboarding
- gamification
- public sharing
- complex analytics dashboards

## Risks

- AI outputs may drift from required JSON shape
- score quality may feel inconsistent without tight evaluator prompting
- adaptive difficulty may feel unfair if profile updates are too jumpy
- history persistence adds backend and schema complexity beyond the current frontend-only vibe module

## Recommended First Execution Order

1. Define and persist data model
2. Add backend generation/evaluation endpoints
3. Add frontend Prompt Arena UI
4. Add history/profile views
5. Add adaptive recommendation wiring
6. Add minimum end-to-end verification
