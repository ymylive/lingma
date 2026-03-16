# Contributing to Lingma

## Scope

This project contains a React frontend, a FastAPI proxy, a Node.js judge service, and Docker-based deployment assets. Keep changes focused and avoid mixing unrelated refactors into one submission.

## Basic Workflow

1. Create a branch from `main`.
2. Make the smallest possible change that solves the problem.
3. Run the smallest relevant verification before you commit.
4. Open a pull request with a clear summary, validation evidence, and any known risks.

## Development Setup

### Frontend

```bash
npm install
npm run dev
```

### Build Check

```bash
npm run build
```

### API Proxy

```bash
cd api-proxy
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 3001 --reload
```

### Judge Server

```bash
cd judge-server
npm install
node server.js
```

## Change Guidelines

- Keep diffs minimal and reviewable.
- Do not commit secrets, passwords, or server-specific `.env` values.
- Preserve existing product behavior unless the task explicitly changes it.
- For frontend changes, check desktop and mobile layouts.
- For deployment changes, document any required environment variables.

## Pull Request Checklist

- The change is limited to the task scope.
- Related docs were updated when behavior or setup changed.
- `npm run build` passes if frontend code changed.
- Any deployment or runtime assumptions are called out in the PR description.

## Commit Messages

Prefer short, conventional-style messages such as:

- `feat: improve mobile responsiveness`
- `fix: handle auth form error state`
- `docs: update deployment instructions`

## Deployment Notes

Production deployment uses:

```bash
LINGMA_VPS_PASSWORD=<your-password> python deploy/docker-deploy.py
```

The script target and runtime details are documented in [README.md](./README.md).
