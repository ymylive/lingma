# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lingma (灵码) is an interactive data structure and algorithm learning platform. It combines visual demos, guided tutorials, AI-assisted practice, and methodology training in a single web app. Live at `https://lingma.cornna.xyz`.

## Tech Stack

- Frontend: React 19 + TypeScript + Vite (rolldown-vite) + Tailwind CSS + framer-motion
- API proxy: FastAPI (Python 3.11+) + uvicorn + SQLite
- Judge service: Node.js + Express (sandboxed code execution)
- Deployment: Docker Compose (3 services: frontend / api-proxy / judge-server)
- Bilingual: Chinese (primary) and English via `src/i18n/` translation modules

## Common Commands

```bash
# Frontend dev server
npm run dev

# Type check + build (must pass before deploy)
npx tsc -b            # stricter than tsc --noEmit; matches server behavior
npx vite build

# Lint
npm run lint           # ESLint with typescript-eslint + react-hooks + react-refresh

# Tests (vitest, jsdom environment)
npm run test           # all tests
npx vitest run src/path/to/file.test.tsx   # single test file

# API proxy (from repo root)
cd api-proxy && pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 3001 --reload

# Judge server (from repo root)
cd judge-server && npm install && node server.js
```

## Architecture

### Frontend (`src/`)

- **Pages** (`src/pages/`): Route-level components, all lazy-loaded via `React.lazy` in `App.tsx`. Most pages behind `ProtectedRoute` (auth required). Key routes: `/` Home, `/algorithms` listing, `/book` tutorials, `/practice` AI workspace, `/mindmap`, `/methodology`, `/dashboard`.
- **Components** (`src/components/`): Shared UI (`Header`, `Footer`, `PixelCat`), plus subdirectories for `lesson/`, `tutorials/`, `visualizations/`.
- **Contexts** (`src/contexts/`): `UserContext` (auth/progress), `ThemeContext` (dark mode), `I18nContext` (locale switching).
- **Services** (`src/services/`): Backend communication — `aiService.ts` (AI endpoints), `judgeService.ts` (code execution), `docService.ts`, `vibeCodingService.ts`, `streamingSse.ts` (SSE streaming helper), `mindMapService.ts`.
- **Data** (`src/data/`): Curriculum content, exercise banks, lesson content, methodology units. Exercise data is split across multiple files (`classicExercises.ts`, `leetcodeClassics.ts`, `digitalLogicExercises.ts`, etc.).
- **i18n** (`src/i18n/`): Translation strings organized by domain (page, content, exercise titles, visualization, etc.). `I18nContext` consumes these.
- **Hooks** (`src/hooks/`): `useLowMotionMode` (accessibility), `useProgressiveAiObject`, `useStreamingTypewriterText`.

### API Proxy (`api-proxy/`)

FastAPI app in `main.py` with modular route handlers in `app_modules/`. Proxies AI requests and handles user auth/progress. Uses SQLite for persistence. Has its own test suite in `api-proxy/tests/`.

### Judge Server (`judge-server/`)

Node.js/Express service (`server.js`) that executes user-submitted code in a sandboxed environment. Runs read-only in Docker with strict security constraints (cap_drop ALL, pids_limit, tmpfs). Has tests in `judge-server/tests/`.

### Docker Services (`deploy/`)

`docker-compose.yml` orchestrates three containers. Frontend is served by Nginx on port 18081. API proxy on internal port 3001, judge server on internal port 3002. Judge server communicates with api-proxy via `JUDGE_BASE_URL` env var.

## Design System

Brand colors: Klein Blue (`#002FA7`) as primary, Pine Yellow (`#FFE135`) as accent. See `src/DESIGN_SYSTEM.md` for full spec including dark mode layers, border radii, animation patterns, and button styles.

## Deployment

Server uses `docker-compose` (hyphenated v1 command, not `docker compose` v2 plugin).

```bash
# Automated deployment (Windows-compatible, uses paramiko)
python deploy/docker-deploy.py
```

Requires VPS credentials and `LINGMA_JUDGE_INTERNAL_TOKEN` via environment variables — never commit these. The deploy script packages workspace files, uploads via SFTP, rebuilds Docker images, and runs a health check.

**Pre-deploy checklist**: `npx tsc -b` and `npx vite build` must both pass. Server `tsc -b` is stricter than local `tsc --noEmit` (catches unused imports).

## Key Conventions

- Commit messages: conventional style (`feat:`, `fix:`, `docs:`)
- Frontend changes: verify both desktop and mobile layouts
- Keep diffs minimal and scoped to the task
- Pages that require auth use `ProtectedRoute` wrapper in `App.tsx`
- Page transitions use framer-motion with `useLowMotionMode` accessibility fallback
