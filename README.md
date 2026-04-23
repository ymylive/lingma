<p align="right">
  <b>English</b> · <a href="./README.zh-CN.md">简体中文</a>
</p>

<h1 align="center">Lingma · 灵码</h1>

<p align="center">
  <img src="docs/hero/readme-hero.gif" alt="Lingma — See the algorithm" width="100%" />
</p>

<p align="center">
  <i>Interactive data-structure & algorithm learning platform — visualize, learn, practice.</i>
</p>

<p align="center">
  <a href="https://lingma.cornna.xyz"><b>🔗 Live demo</b></a> ·
  <a href="./README.zh-CN.md">中文版</a> ·
  <a href="./CONTRIBUTING.md">Contributing</a> ·
  <a href="./LICENSE">AGPL-3.0 License</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript&logoColor=white" alt="TypeScript 5.9" />
  <img src="https://img.shields.io/badge/Vite-rolldown-ffe135?logo=vite&logoColor=002FA7" alt="Vite (rolldown)" />
  <img src="https://img.shields.io/badge/FastAPI-backend-009688?logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Docker-compose-2496ed?logo=docker&logoColor=white" alt="Docker Compose" />
  <img src="https://img.shields.io/badge/license-AGPL--3.0-002FA7" alt="AGPL-3.0 License" />
</p>

---

## What is Lingma?

**Lingma (灵码)** is a single-page learning platform that turns abstract data-structure and algorithm concepts into things you can *see*, *read*, *practice*, and *map*. It bundles an interactive textbook, animated algorithm visualizations, an AI-assisted coding workspace, a mind-map editor, and a methodology library into one bilingual (Chinese / English) web app.

Built for students preparing for technical interviews, instructors running CS fundamentals courses, and self-learners who prefer visual intuition over dense textbooks.

## ✨ Features

### 📊 Step-by-step algorithm visualizations
Quicksort, BFS/DFS, binary trees, linked-list operations, sorting families, and dynamic programming — each rendered as a keyframe-driven animation you can scrub, pause, and replay. No hand-wavy pseudocode; you see the pivot move, the recursion branch, the pointer advance.

### 📖 Structured tutorials (`/book`)
Curriculum-backed lesson content with chapter hierarchy, inline code samples, and embedded visualizers. Progress is persisted per user. Lessons are data-driven from `src/data/` so new chapters don't require a new deploy.

### 🤖 AI practice workspace (`/practice`)
Write code, request a streaming review, and get progressive feedback as the model thinks. Powered by a FastAPI proxy that brokers multiple model providers (ModelScope, upstream APIs) with SSE streaming. Includes the **Vibe Coding Lab** and **Prompt Arena** for prompt-driven training loops.

### 🧠 Interactive mind-map editor (`/mindmap`)
Build, reshape, and save concept maps for algorithm families and problem patterns. Useful before an interview to crystallize how sorting, searching, and graph algorithms relate.

### 📐 Methodology library (`/methodology`)
Pattern-based problem-solving playbooks — "when you see X, reach for Y" — organized by technique (two pointers, sliding window, monotonic stack, DP state design, etc.).

### 📈 Learner dashboard (`/dashboard`)
Track solved exercises, lesson progress, and recent activity. Authenticated via the API proxy.

### 🌐 Bilingual & accessible
Full Chinese / English UI switch via `I18nContext`. Dark mode via `ThemeContext`. Respects `prefers-reduced-motion` through `useLowMotionMode`. Responsive layouts for desktop and mobile.

## 🗺️ Routes

| Path | Page | Auth |
|------|------|:---:|
| `/` | Home (public landing) | — |
| `/algorithms` | Algorithm catalog | ✓ |
| `/algorithms/:id` | Algorithm detail + visualization | ✓ |
| `/book` | Tutorial home | ✓ |
| `/book/*` | Lesson reader | ✓ |
| `/practice` | AI coding workspace | ✓ |
| `/mindmap` | Mind-map editor | ✓ |
| `/methodology` | Methodology library | ✓ |
| `/dashboard` | Learner dashboard | ✓ |
| `/auth` | Login / register | — |

All protected routes are lazy-loaded via `React.lazy` and wrapped in `<ProtectedRoute>` (see `src/App.tsx`).

## 🏗️ Tech stack

| Layer | Stack |
|-------|-------|
| **Frontend** | React 19, TypeScript 5.9, Vite (rolldown-vite), Tailwind CSS 3, Framer Motion, React Router 7, Prism.js |
| **API proxy** | FastAPI, Uvicorn, SQLite, SSE streaming |
| **Judge service** | Node.js, Express, sandboxed execution with strict `cap_drop`/`pids_limit`/tmpfs constraints |
| **Testing** | Vitest + Testing Library (frontend), Pytest (API proxy) |
| **Deployment** | Docker Compose (3 containers), Nginx reverse proxy, HTTPS via Let's Encrypt |

## 📁 Project structure

```text
lingma/
├── src/
│   ├── pages/              # Route-level components (lazy-loaded)
│   ├── components/         # Shared UI + lesson/tutorials/visualizations
│   ├── contexts/           # UserContext · ThemeContext · I18nContext
│   ├── services/           # aiService · judgeService · streamingSse · mindMapService
│   ├── hooks/              # useLowMotionMode · useStreamingTypewriterText · ...
│   ├── data/               # Curriculum, exercise banks, methodology units
│   ├── i18n/               # Translation strings by domain
│   └── DESIGN_SYSTEM.md    # Brand tokens, spacing, animation rules
├── api-proxy/
│   ├── main.py             # FastAPI entry
│   ├── app_modules/        # Modular route handlers
│   └── tests/              # Pytest suite
├── judge-server/
│   ├── server.js           # Sandboxed code execution
│   └── tests/
├── deploy/
│   ├── docker-compose.yml  # 3 containers: frontend · api-proxy · judge-server
│   ├── docker-deploy.py    # Automated VPS deploy (SFTP + rebuild + health check)
│   ├── nginx.conf          # Reverse proxy + HTTPS
│   └── setup-*.py / .sh    # SSL, service, env bootstrap helpers
├── docs/hero/              # README hero animation assets
└── README.md
```

## 🚀 Getting started

### Prerequisites
- **Node.js** 20+ & **npm** 10+
- **Python** 3.11+ (for the API proxy)
- **Docker** + `docker-compose` (only for production-style local runs or VPS deploy)

### 1 · Frontend
```bash
npm install
npm run dev         # Vite dev server on http://localhost:5173
npm run build       # tsc -b && vite build  (stricter than --noEmit; matches CI)
npm run lint        # ESLint
npm run test        # Vitest (jsdom)
```

### 2 · API proxy
```bash
cd api-proxy
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 3001 --reload
```
The proxy handles auth, progress, AI streaming, and doc requests. SQLite database is created on first run.

### 3 · Judge server
```bash
cd judge-server
npm install
node server.js      # Internal port 3002
```
Runs user-submitted code inside a sandboxed subprocess. Communicates with the API proxy via `JUDGE_BASE_URL`.

### Running all three at once
For a full local stack, open three terminals (or run Docker Compose — see below).

## 🐳 Deployment

The production stack is three containers orchestrated by `deploy/docker-compose.yml`:

| Container | Role | Port |
|-----------|------|:----:|
| `frontend` | Nginx serving the Vite build | 18081 (public) |
| `api-proxy` | FastAPI backend | 3001 (internal) |
| `judge-server` | Sandboxed code execution | 3002 (internal) |

### Environment
Create `deploy/.env` with at minimum:

```env
FRONTEND_BIND_HOST=0.0.0.0
FRONTEND_BIND_PORT=18081
# Add AI provider keys here to enable the /practice workspace
# ANTHROPIC_API_KEY=...
# MODELSCOPE_API_KEY=...
LINGMA_JUDGE_INTERNAL_TOKEN=<random-long-string>
```

Never commit this file. The judge token is a shared secret between `api-proxy` and `judge-server`.

### One-shot VPS deploy
```bash
python deploy/docker-deploy.py
```
The script packages the workspace, uploads via SFTP, rebuilds Docker images on the server, restarts containers with `docker-compose`, and runs a health check. Requires VPS credentials in your environment.

> Note: the server uses `docker-compose` (hyphenated v1), not `docker compose` v2 plugin.

## 🎨 Design system

Brand tokens live in [`src/DESIGN_SYSTEM.md`](src/DESIGN_SYSTEM.md).

| Token | Value | Role |
|-------|-------|------|
| `klein-500` | `#002FA7` | Primary (IKB — International Klein Blue) |
| `pine-500` | `#FFE135` | Accent (pine yellow / 松花黄) |

Page transitions use Framer Motion with a `useLowMotionMode` accessibility fallback. Radii: `rounded-xl` (12px) for inputs/buttons, `rounded-2xl` (16px) for cards. Layout maxes at `max-w-6xl` with `pt-24` to clear the sticky header.

## 🤝 Contributing

Conventions, branch strategy, and the PR checklist live in [CONTRIBUTING.md](./CONTRIBUTING.md). Short version:

- Commit style: Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`)
- Both `npx tsc -b` **and** `npx vite build` must pass before deploy (server `tsc -b` is stricter than local `--noEmit`)
- Verify both desktop and mobile layouts for UI changes
- Keep diffs minimal and scoped to the task

## 📄 License

[AGPL-3.0](./LICENSE) © Lingma contributors
