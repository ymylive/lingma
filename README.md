# Lingma / 灵码

Interactive data structure and algorithm learning platform — visual demos, guided tutorials, AI-assisted practice, mind mapping, and methodology training in one web app.

交互式数据结构与算法学习平台——可视化演示、教程学习、AI 辅助练习、思维导图和方法论训练，集于同一个 Web 应用。

**Live / 在线体验**: [lingma.cornna.xyz](https://lingma.cornna.xyz)

## Features / 功能亮点

- Algorithm visualizations with step-by-step animations / 算法动画与分步讲解
- Structured tutorials and lesson content (`/book`) / 结构化教程内容
- AI Practice workspace with streaming code review / AI 练习工作区，支持流式代码评审
- Vibe Coding Lab & Prompt Arena for prompt-driven training / 提示词驱动训练模块
- Interactive mind map editor (`/mindmap`) / 交互式思维导图编辑器
- Methodology documentation (`/methodology`) / 方法论文档
- Learner dashboard with progress tracking / 学习仪表盘与进度追踪
- Dark mode & bilingual UI (Chinese / English) / 暗色模式与中英双语
- Responsive design for desktop and mobile / 桌面端与移动端适配

## Tech Stack / 技术栈

| Layer | Tech |
|-------|------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Framer Motion |
| API Proxy | FastAPI, Uvicorn, SQLite |
| Judge Service | Node.js, Express (sandboxed execution) |
| Deployment | Docker Compose, Nginx, HTTPS |

## Project Structure / 目录结构

```text
src/
  pages/              route-level components (lazy-loaded)
  components/         shared UI, lesson, tutorial, visualization components
  contexts/           UserContext, ThemeContext, I18nContext
  services/           API communication (AI, judge, mindmap, SSE streaming)
  hooks/              custom hooks (low-motion, streaming, progressive AI)
  data/               curriculum content, exercise banks, methodology units
  i18n/               translation strings by domain
api-proxy/
  main.py             FastAPI backend with modular route handlers
  app_modules/        route handler modules
judge-server/
  server.js           sandboxed code execution service
deploy/
  docker-compose.yml  production services (3 containers)
  docker-deploy.py    automated VPS deployment script
  nginx.conf          reverse proxy config
```

## Getting Started / 快速开始

### Prerequisites / 前置依赖

- Node.js 20+, npm 10+
- Python 3.11+ (for API proxy)

### Frontend / 前端

```bash
npm install
npm run dev       # dev server
npm run build     # type check + production build
npm run lint      # ESLint
npm run test      # vitest
```

### API Proxy / API 代理

```bash
cd api-proxy
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 3001 --reload
```

### Judge Server / 判题服务

```bash
cd judge-server
npm install
node server.js
```

## Deployment / 部署

Three Docker containers orchestrated by `deploy/docker-compose.yml`:

由 `deploy/docker-compose.yml` 编排的三个 Docker 容器：

| Container | Role | Port |
|-----------|------|------|
| `frontend` | Nginx static serving | 18081 |
| `api-proxy` | FastAPI backend | 3001 (internal) |
| `judge-server` | Code judging | 3002 (internal) |

### Environment / 环境变量

Create `deploy/.env` with runtime variables. Minimum:

在 `deploy/.env` 中配置运行时变量，最小示例：

```env
FRONTEND_BIND_HOST=0.0.0.0
FRONTEND_BIND_PORT=18081
```

For AI features, add the corresponding API keys in `deploy/.env` on the server.

启用 AI 功能需要在服务器的 `deploy/.env` 中配置对应的 API 密钥。

### Deploy to VPS / VPS 部署

```bash
python deploy/docker-deploy.py
```

The script packages the workspace, uploads via SFTP, rebuilds Docker images, starts containers, and runs a health check.

脚本会自动打包工作区、上传 SFTP、重建镜像、启动容器并执行健康检查。

## Design System / 设计语言

Brand colors: **Klein Blue** (`#002FA7`) as primary, **Pine Yellow** (`#FFE135`) as accent. Full spec in `src/DESIGN_SYSTEM.md`.

品牌色：**克莱因蓝** (`#002FA7`) 为主色，**松花黄** (`#FFE135`) 为强调色。完整规范见 `src/DESIGN_SYSTEM.md`。

## Contributing / 贡献

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License / 许可证

[MIT](./LICENSE)
