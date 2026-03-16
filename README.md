# Lingma / 灵码

Lingma is an interactive data structure and algorithm learning platform that combines visual demos, guided tutorials, AI-assisted practice, and methodology training in a single web app.

灵码是一个面向数据结构与算法学习的交互式平台，把可视化演示、教程学习、AI 辅助练习和方法论文档整合在同一个 Web 应用中。

Live site / 在线地址: `https://lingma.cornna.xyz`

## Overview / 项目概览

- Interactive algorithm visualizations and step-by-step explanations
- Structured tutorial content under `/book`
- Protected learner dashboard and progress tracking
- AI practice workspace for coding exercises
- `Vibe Coding Lab` and `Prompt Arena` for prompt-driven training
- Dedicated methodology documentation at `/methodology`
- Responsive frontend optimized for desktop and mobile
- Bilingual UI foundation with Chinese and English support

- 交互式算法动画与分步骤讲解
- `/book` 下的结构化教程内容
- 受保护的学习仪表盘与进度追踪
- 面向编码练习的 AI Practice 工作区
- `Vibe Coding Lab` 与 `Prompt Arena` 提示词训练模块
- 独立的 `/methodology` 方法论文档页面
- 已适配桌面端与移动端的响应式前端
- 支持中英文双语基础能力

## Tech Stack / 技术栈

- Frontend / 前端: React 19, TypeScript, Vite, Tailwind CSS, Framer Motion
- API proxy / 代理后端: FastAPI, Uvicorn, SQLite
- Judge service / 判题服务: Node.js, Express
- Deployment / 部署: Docker Compose, Nginx, HTTPS

## Project Structure / 目录结构

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

## Local Development / 本地开发

### Frontend / 前端

Requirements / 依赖要求:

- Node.js 20+
- npm 10+

```bash
npm install
npm run dev
```

### Production Build / 生产构建

```bash
npm run build
```

### API Proxy / API 代理服务

Requirements / 依赖要求:

- Python 3.11+

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

## Environment Notes / 环境说明

Docker deployment expects `deploy/.env` for backend runtime values.

Docker 部署依赖 `deploy/.env` 提供后端运行时变量。

Minimum example / 最小示例:

```env
FRONTEND_BIND_HOST=0.0.0.0
FRONTEND_BIND_PORT=18081
```

If you use AI-related features in production, add the corresponding API variables in `deploy/.env` on the server.

如果你需要在生产环境启用 AI 相关能力，需要在服务器上的 `deploy/.env` 中补充对应的 API 环境变量。

## Deploy to VPS / VPS 部署

This repository includes a Windows-friendly deployment script based on `paramiko`.

仓库内置了基于 `paramiko` 的 Windows 友好型 VPS 部署脚本。

Default target from the script / 脚本默认目标:

- Host: `8.134.33.19`
- User: `root`
- Remote path: `/var/www/lingma`

Run / 执行命令:

```bash
LINGMA_VPS_PASSWORD=<your-password> python deploy/docker-deploy.py
```

The script will / 脚本会自动执行:

1. Package the current workspace
2. Upload it to the VPS
3. Extract the bundle into `/var/www/lingma`
4. Stop old services
5. Rebuild Docker images and start containers
6. Run a health check against `http://127.0.0.1:18081/api/health`

1. 打包当前工作区
2. 上传到 VPS
3. 解压到 `/var/www/lingma`
4. 停止旧服务
5. 重建 Docker 镜像并启动容器
6. 对 `http://127.0.0.1:18081/api/health` 做健康检查

## Production Services / 生产服务

`deploy/docker-compose.yml` starts three containers:

`deploy/docker-compose.yml` 会启动 3 个容器:

- `frontend`: static frontend served by Nginx on port `18081`
- `api-proxy`: FastAPI service on internal port `3001`
- `judge-server`: judging service on internal port `3002`

- `frontend`: 由 Nginx 提供静态前端，暴露端口 `18081`
- `api-proxy`: FastAPI 服务，容器内端口 `3001`
- `judge-server`: 判题服务，容器内端口 `3002`

## Contributing / 贡献说明

See [CONTRIBUTING.md](./CONTRIBUTING.md).

详细贡献流程见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## Current Verification / 当前验证

Latest checks completed:

最近一次已完成验证:

- `npm run build`
- VPS deployment via `python deploy/docker-deploy.py`
- Health check: `curl http://127.0.0.1:18081/api/health`

## License / 许可证

MIT
