# LingMa

LingMa is an AI-assisted algorithm and software engineering learning platform.

Live site: `https://lingma.cornna.xyz`

## Highlights

- Progressive practice library for data structures and algorithms
- Online judge flow with authenticated proxy protection
- AI exercise generation for coding and fill-in-the-blank practice
- `Vibe Coding Lab` for professional AI collaboration training
- New `Prompt Arena` workflow:
  - AI-generated prompt-writing challenges
  - Five tracks: frontend, backend, debugging, refactoring, review
  - AI scores prompt quality only
  - Score breakdown, strengths, weaknesses, rewrite example
  - Account-level history and adaptive difficulty

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- FastAPI
- SQLite
- Docker Compose

## Local Development

### Frontend

```bash
npm install
npm run dev
```

### Production Build

```bash
npm run build
```

### API Proxy

```bash
cd api-proxy
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 3001
```

## Key Paths

- `src/pages/Practice.tsx`: practice entry and tab routing
- `src/components/tutorials/VibeCodingLab.tsx`: vibe coding learning and Prompt Arena UI
- `src/services/vibeCodingService.ts`: Prompt Arena API client
- `src/types/vibeCoding.ts`: Prompt Arena types
- `api-proxy/main.py`: auth, AI proxy, judge proxy, and Prompt Arena backend
- `deploy/docker-compose.yml`: production Docker stack

## Verification

Useful commands for this repo:

```bash
python -m pytest api-proxy/tests/test_vibe_coding_api.py -q
python -m py_compile api-proxy/main.py
npx eslint src/components/tutorials/VibeCodingLab.tsx src/services/vibeCodingService.ts src/types/vibeCoding.ts
npm run build
```

## Deployment

Production currently runs from the Docker stack in `deploy/docker-compose.yml` on the VPS behind `lingma.cornna.xyz`.

Typical release flow:

1. Build and verify locally
2. Sync source to `/opt/tumafang`
3. Preserve `deploy/.env`
4. Run `docker-compose up -d --build`
5. Check `/api/health` and the public site

## License

MIT
