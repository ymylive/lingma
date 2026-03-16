# Lingma

Lingma is an interactive data structure and algorithm learning platform that combines visual demos, guided tutorials, AI-assisted practice, and methodology training in a single web app.

Live site: `https://lingma.cornna.xyz`

## What It Includes

- Interactive algorithm visualizations and step-by-step explanations
- Structured tutorial content under `/book`
- Protected learner dashboard and progress tracking
- AI practice workspace for coding exercises
- `Vibe Coding Lab` and `Prompt Arena` for prompt-driven training
- Dedicated methodology documentation at `/methodology`
- Responsive frontend optimized for desktop and mobile
- Bilingual UI foundation with Chinese and English support

## Tech Stack

- Frontend: React 19, TypeScript, Vite, Tailwind CSS, Framer Motion
- API proxy: FastAPI, Uvicorn, SQLite
- Judge service: Node.js, Express
- Deployment: Docker Compose, Nginx, HTTPS

## Project Structure

```text
src/
  components/        shared UI and tutorial components
  contexts/          auth, i18n, and app state
  data/              curriculum and methodology content
  pages/             route-level pages
api-proxy/
  main.py            FastAPI backend proxy
judge-server/
  server.js          code judging service
deploy/
  docker-compose.yml production services
  docker-deploy.py   VPS deployment script
  nginx.conf         reverse proxy config
```

## Local Development

### Frontend

Requirements:

- Node.js 20+
- npm 10+

```bash
npm install
npm run dev
```

### Production Build

```bash
npm run build
```

### API Proxy

Requirements:

- Python 3.11+

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

## Environment Notes

The Docker deployment expects `deploy/.env` for backend-related runtime values. At minimum, the deployment script will create:

```env
FRONTEND_BIND_HOST=0.0.0.0
FRONTEND_BIND_PORT=18081
```

If you use AI-related features in production, add the corresponding API variables to `deploy/.env` on the server.

## Deploy to VPS

This repository includes a Windows-friendly deployment script based on `paramiko`.

Default target from the script:

- Host: `8.134.33.19`
- User: `root`
- Remote path: `/var/www/lingma`

Run:

```bash
LINGMA_VPS_PASSWORD=<your-password> python deploy/docker-deploy.py
```

The script will:

1. Package the current workspace
2. Upload it to the VPS
3. Extract the bundle into `/var/www/lingma`
4. Stop old services
5. Rebuild Docker images and start containers
6. Run a health check against `http://127.0.0.1:18081/api/health`

## Production Services

`deploy/docker-compose.yml` starts three containers:

- `frontend`: static frontend served by Nginx on port `18081`
- `api-proxy`: FastAPI service on internal port `3001`
- `judge-server`: judging service on internal port `3002`

## Current Verification

Latest checks completed locally:

- `npm run build`
- VPS deployment via `python deploy/docker-deploy.py`
- Health check: `curl http://127.0.0.1:18081/api/health`

## License

MIT
