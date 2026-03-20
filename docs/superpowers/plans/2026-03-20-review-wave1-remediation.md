# Review Wave 1 Remediation Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the highest-risk issues found in the parallel review by hardening deployment secrets/config, reducing judge-path blocking, and adding the most critical missing tests.

**Architecture:** Keep this wave narrow and conflict-resistant. Make one focused pass on security/deploy configuration, one focused pass on judge hot-path behavior, and one focused pass on regression coverage. Defer large structural refactors like splitting `api-proxy/main.py` or externalizing `Lesson.tsx` content to a later wave.

**Tech Stack:** FastAPI + sqlite backend, Node/Express judge server, React 19 + TypeScript frontend, pytest for backend tests, npm build tooling.

---

## File Map

- Modify: `AGENTS.md`
  - Remove plaintext production credentials and replace with safe deployment guidance.
- Modify: `CLAUDE.md`
  - Remove plaintext production credentials and replace with safe deployment guidance.
- Modify: `deploy/docker-deploy.py`
  - Enforce SSH host verification and fail fast when host trust is not configured.
- Modify: `deploy/runtime_config.py`
  - Align runtime SSH behavior with strict host verification.
- Modify: `api-proxy/main.py`
  - Remove predictable judge token fallback, normalize auth/register behavior, and decouple synchronous judge result handling from slower advisory work where feasible.
- Modify: `judge-server/server.js`
  - Replace synchronous compilation on the request thread and reduce avoidable serial bottlenecks.
- Modify: `src/services/judgeService.ts`
  - Match the new backend judge flow contract if response shape changes.
- Create or modify: `api-proxy/tests/test_auth_api.py`
  - Add direct regression coverage for auth/session/cookie behavior.
- Create or modify: `api-proxy/tests/test_judge_proxy_contract.py`
  - Add direct coverage for judge token/config and degraded advisory behavior.
- Create: `judge-server/tests/*.test.js`
  - Add local assertions for compile/run/token/busy branches.
- Modify: `judge-server/package.json`
  - Add a test script for the new judge-server test entry points.

## Verification Strategy

- Baseline backend tests: `python -m pytest api-proxy/tests -q`
- Backend syntax: `python -m py_compile api-proxy/main.py`
- Judge-server tests: `npm test --prefix judge-server`
- Frontend build: `npm run build`

## Chunk 1: Deploy Hardening

### Task 1: Remove plaintext secrets from repo docs

**Files:**
- Modify: `AGENTS.md`
- Modify: `CLAUDE.md`

- [ ] **Step 1: Write the failing review expectation as a checklist**

Checklist:
- docs must not contain a production password
- docs must not instruct readers to inline real secrets in commands
- docs must still explain where deployment settings live

- [ ] **Step 2: Inspect current credential-bearing lines**

Run: `Select-String -Path AGENTS.md,CLAUDE.md -Pattern '8\\.134\\.33\\.19|root|Qq159741|LINGMA_VPS_PASSWORD'`
Expected: matches the current plaintext values that must be removed.

- [ ] **Step 3: Replace raw credentials with safe placeholders and rotation guidance**

Requirements:
- keep server path and deployment workflow guidance only if still useful
- replace passwords with environment-variable placeholders
- add a short note that credentials must be supplied out-of-band and rotated if exposed

- [ ] **Step 4: Re-run the credential search**

Run: `Select-String -Path AGENTS.md,CLAUDE.md -Pattern 'Qq159741'`
Expected: no matches.

### Task 2: Enforce SSH host verification in deploy scripts

**Files:**
- Modify: `deploy/docker-deploy.py`
- Modify: `deploy/runtime_config.py`

- [ ] **Step 1: Write the failing test or executable check first**

Implement either:
- a focused pytest-style unit test if the deploy code is testable, or
- a deterministic static assertion script that fails while `AutoAddPolicy` is still present

- [ ] **Step 2: Run the check to confirm failure**

Run: `Select-String -Path deploy/docker-deploy.py,deploy/runtime_config.py -Pattern 'AutoAddPolicy'`
Expected initially: matches in both files.

- [ ] **Step 3: Replace trust-on-first-use with strict host verification**

Requirements:
- stop using `paramiko.AutoAddPolicy()`
- use strict rejection by default
- make the missing-host-key failure actionable in the error message
- do not silently fall back to insecure behavior

- [ ] **Step 4: Re-run the static assertion**

Run: `Select-String -Path deploy/docker-deploy.py,deploy/runtime_config.py -Pattern 'AutoAddPolicy'`
Expected: no matches.

## Chunk 2: Judge Hot Path

### Task 3: Remove predictable judge token fallback and tighten judge auth contract

**Files:**
- Modify: `api-proxy/main.py`
- Modify: `judge-server/server.js`
- Test: `api-proxy/tests/test_judge_proxy_contract.py`

- [ ] **Step 1: Write a failing backend test for missing judge token configuration**

Test cases:
- proxy should not silently use `local-judge-token`
- judge-server should require an explicit token
- startup or request path should fail clearly when token config is absent

- [ ] **Step 2: Run the targeted test to verify it fails for the right reason**

Run: `python -m pytest api-proxy/tests/test_judge_proxy_contract.py -q -k judge_token`
Expected initially: FAIL because the fallback token still exists.

- [ ] **Step 3: Implement the minimal config hardening**

Requirements:
- remove `local-judge-token` fallback
- require an explicit token in both services
- keep local development usable with env configuration rather than code defaults

- [ ] **Step 4: Re-run the targeted test**

Run: `python -m pytest api-proxy/tests/test_judge_proxy_contract.py -q -k judge_token`
Expected: PASS.

### Task 4: Reduce blocking in `judge-server` compile/execute path

**Files:**
- Modify: `judge-server/server.js`
- Test: `judge-server/tests/judge-server.test.js`

- [ ] **Step 1: Write failing tests for the blocking-prone helpers**

Coverage targets:
- compile path does not rely on `execSync`
- token rejection returns `403`
- busy path returns `429`
- judge/run paths still preserve existing semantics for success and failure branches

- [ ] **Step 2: Run the targeted judge-server tests to confirm failure**

Run: `npm test --prefix judge-server -- --runInBand`
Expected initially: FAIL because tests either do not exist yet or still observe synchronous compile behavior.

- [ ] **Step 3: Implement the smallest safe async refactor**

Requirements:
- replace synchronous compile execution with async child-process handling
- keep cleanup behavior intact
- preserve existing result statuses (`CE`, `RE`, `TLE`, `OLE`)
- avoid widening scope into unrelated refactors

- [ ] **Step 4: Re-run judge-server tests**

Run: `npm test --prefix judge-server -- --runInBand`
Expected: PASS.

### Task 5: Shorten synchronous user wait on `/api/judge`

**Files:**
- Modify: `api-proxy/main.py`
- Modify: `src/services/judgeService.ts`
- Test: `api-proxy/tests/test_judge_proxy_contract.py`

- [ ] **Step 1: Write a failing backend test for the new response behavior**

Desired behavior:
- deterministic judge result returns without being blocked by optional advisory work, or
- advisory generation becomes explicit/deferred while the deterministic contract remains intact

- [ ] **Step 2: Run the targeted backend test to confirm initial failure**

Run: `python -m pytest api-proxy/tests/test_judge_proxy_contract.py -q -k advisory`
Expected initially: FAIL because `/api/judge` still waits inline for advisory generation.

- [ ] **Step 3: Implement the minimal contract change**

Requirements:
- deterministic judge truth remains primary
- frontend remains backward compatible or is updated in the same task
- degraded/unavailable advisory state is still represented clearly

- [ ] **Step 4: Re-run targeted backend test and frontend build**

Run: `python -m pytest api-proxy/tests/test_judge_proxy_contract.py -q -k advisory`
Expected: PASS.

Run: `npm run build`
Expected: PASS.

## Chunk 3: Auth and Regression Coverage

### Task 6: Add direct auth/session regression tests

**Files:**
- Create or modify: `api-proxy/tests/test_auth_api.py`

- [ ] **Step 1: Write the failing auth tests first**

Coverage targets:
- `register/login/session/profile/logout`
- duplicate email behavior
- wrong password behavior
- expired session handling
- secure-cookie decision with `x-forwarded-proto=https`

- [ ] **Step 2: Run the focused auth tests to verify failure**

Run: `python -m pytest api-proxy/tests/test_auth_api.py -q`
Expected initially: FAIL because the file is new or coverage is incomplete.

- [ ] **Step 3: Implement only the production changes required by the tests**

Requirements:
- if auth behavior changes, keep it minimal and security-oriented
- remove or reduce email enumeration signal if tests are written for that contract

- [ ] **Step 4: Re-run auth tests**

Run: `python -m pytest api-proxy/tests/test_auth_api.py -q`
Expected: PASS.

### Task 7: Add judge proxy contract tests around degraded states

**Files:**
- Create or modify: `api-proxy/tests/test_judge_proxy_contract.py`

- [ ] **Step 1: Write failing tests for the proxy edge cases**

Coverage targets:
- missing explicit judge token config
- advisory unavailable/deferred state
- deterministic payload remains intact on advisory failure

- [ ] **Step 2: Run the focused contract tests to verify failure**

Run: `python -m pytest api-proxy/tests/test_judge_proxy_contract.py -q`
Expected initially: FAIL.

- [ ] **Step 3: Implement or adjust only the code needed for those assertions**

- [ ] **Step 4: Re-run the focused contract tests**

Run: `python -m pytest api-proxy/tests/test_judge_proxy_contract.py -q`
Expected: PASS.

## Chunk 4: Integrated Verification

### Task 8: Run full wave-1 verification and summarize residual risk

**Files:**
- Modify only as needed from prior tasks

- [ ] **Step 1: Re-run backend test suite**

Run: `python -m pytest api-proxy/tests -q`
Expected: PASS.

- [ ] **Step 2: Re-run backend syntax validation**

Run: `python -m py_compile api-proxy/main.py`
Expected: PASS.

- [ ] **Step 3: Re-run judge-server tests**

Run: `npm test --prefix judge-server`
Expected: PASS.

- [ ] **Step 4: Re-run frontend build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 5: Record residual risks that remain intentionally deferred**

Deferred items for the delivery summary:
- `api-proxy/main.py` modular split
- `src/pages/Lesson.tsx` content extraction
- CORS/config deduplication beyond files already touched
