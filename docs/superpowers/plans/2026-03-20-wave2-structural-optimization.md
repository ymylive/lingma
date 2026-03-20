# Wave 2 Structural Optimization Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce the maintenance cost of the oversized backend and lesson page files without changing runtime behavior.

**Architecture:** Keep FastAPI route wiring in `api-proxy/main.py`, but extract stable helper groups into importable modules under `api-proxy/api_proxy_core/` and re-export them through `main.py` so existing tests can keep monkeypatching module-level names. Split `src/pages/Lesson.tsx` into data and presentational pieces by moving the large lesson catalog into topic modules and extracting reusable page sections while preserving the current page flow.

**Tech Stack:** FastAPI, sqlite3, requests, React 19, TypeScript, Vite, Tailwind CSS

---

## Chunk 1: Backend helper extraction

### Task 1: Create backend core modules

**Task Card**
- Workflow Skill: `C:\Users\Ymy_l\.codex\superpowers\skills\dispatching-parallel-agents\SKILL.md`
- Primary Role: `agency-backend-architect`
- Role Path: `C:\Users\Ymy_l\.codex\agents\agency-agents\agency-backend-architect.toml`
- Scope: `api-proxy/main.py`, `api-proxy/api_proxy_core/`
- Done: `main.py` is meaningfully smaller because helper groups move into focused modules while API behavior and test monkeypatch points stay intact.
- Verify: `python -m pytest api-proxy/tests -q`

**Files:**
- Create: `api-proxy/api_proxy_core/__init__.py`
- Create: `api-proxy/api_proxy_core/auth.py`
- Create: `api-proxy/api_proxy_core/judge.py`
- Create: `api-proxy/api_proxy_core/upstream.py`
- Modify: `api-proxy/main.py`

- [ ] **Step 1: Add an import bootstrap that makes `api-proxy/api_proxy_core` importable when `main.py` is loaded by file path**

Run: `python -m pytest api-proxy/tests/test_auth_api.py -q`
Expected: PASS before refactor so the baseline is known-good.

- [ ] **Step 2: Move auth sanitizers, password/session helpers, and cookie helpers into `api_proxy_core/auth.py`**

Keep public names re-exported from `main.py` so tests that patch `verify_password` still work.

- [ ] **Step 3: Move judge payload/review helpers into `api_proxy_core/judge.py`**

Keep `perform_internal_judge_request` and `read_upstream_responses_json` reachable from `main.py`.

- [ ] **Step 4: Move upstream AI request-building helpers into `api_proxy_core/upstream.py`**

Keep route handlers in `main.py` for this wave to avoid route wiring churn.

- [ ] **Step 5: Update `main.py` to import and re-export the extracted helpers, then remove the duplicated inline implementations**

Run: `python -m pytest api-proxy/tests -q`
Expected: PASS

## Chunk 2: Lesson page decomposition

### Task 2: Split lesson content and page chrome

**Task Card**
- Workflow Skill: `C:\Users\Ymy_l\.codex\superpowers\skills\dispatching-parallel-agents\SKILL.md`
- Primary Role: `agency-frontend-developer`
- Role Path: `C:\Users\Ymy_l\.codex\agents\agency-agents\agency-frontend-developer.toml`
- Secondary Role: `ui-ux-pro-max`
- Scope: `src/pages/Lesson.tsx`, `src/components/lesson/`, `src/data/lesson-content/`
- Done: `Lesson.tsx` keeps routing/state orchestration only, lesson catalog moves out of the page file, and sidebar / related exercise rendering is extracted without visual regression.
- Verify: `npm run build`

**Files:**
- Create: `src/components/lesson/LessonSidebar.tsx`
- Create: `src/components/lesson/LessonHeader.tsx`
- Create: `src/components/lesson/RelatedExercises.tsx`
- Create: `src/data/lesson-content/types.ts`
- Create: `src/data/lesson-content/index.tsx`
- Create: `src/data/lesson-content/intro.tsx`
- Create: `src/data/lesson-content/linear-list.tsx`
- Create: `src/data/lesson-content/stack-queue.tsx`
- Create: `src/data/lesson-content/tree-graph.tsx`
- Modify: `src/pages/Lesson.tsx`

- [ ] **Step 1: Define shared lesson content types in `src/data/lesson-content/types.ts`**

Run: `npm run build`
Expected: PASS baseline

- [ ] **Step 2: Move the lesson catalog out of `Lesson.tsx` into grouped topic modules plus a central `index.tsx` export**

Prefer stable topic-based splits over one-file-per-lesson to keep imports manageable.

- [ ] **Step 3: Extract desktop/mobile sidebar rendering into `LessonSidebar.tsx`**

Keep current navigation classes, touch targets, and `cursor-pointer` behavior intact.

- [ ] **Step 4: Extract lesson header and related exercises cards into focused components**

Keep routing, `navigate('/practice')`, and completion badges unchanged.

- [ ] **Step 5: Reduce `Lesson.tsx` to routing, small state, and component composition**

Run: `npm run build`
Expected: PASS

## Chunk 3: Integrated verification

### Task 3: Re-run cross-module validation

**Task Card**
- Workflow Skill: `C:\Users\Ymy_l\.codex\superpowers\skills\verification-before-completion\SKILL.md`
- Primary Role: `agency-code-reviewer`
- Role Path: `C:\Users\Ymy_l\.codex\agents\agency-agents\agency-code-reviewer.toml`
- Scope: workspace-wide validation only
- Done: backend tests, judge-server tests, and frontend build all pass on the Wave 2 branch.
- Verify: commands below

**Files:**
- Modify: `api-proxy/main.py`
- Modify: `src/pages/Lesson.tsx`
- Modify: any files created in tasks 1-2

- [ ] **Step 1: Run backend regression checks**

Run: `python -m pytest api-proxy/tests -q`
Expected: PASS

- [ ] **Step 2: Run judge server tests**

Run: `npm test --prefix judge-server`
Expected: PASS

- [ ] **Step 3: Run frontend production build**

Run: `npm run build`
Expected: PASS
