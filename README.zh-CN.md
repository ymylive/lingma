<p align="right">
  <a href="./README.md">English</a> · <b>简体中文</b>
</p>

<h1 align="center">Lingma · 灵码</h1>

<p align="center">
  <img src="docs/hero/readme-hero.gif" alt="灵码 — 看见算法" width="100%" />
</p>

<p align="center">
  <i>交互式数据结构与算法学习平台 —— 可视化、学习、练习。</i>
</p>

<p align="center">
  <a href="https://lingma.cornna.xyz"><b>🔗 在线体验</b></a> ·
  <a href="./README.md">English</a> ·
  <a href="./CONTRIBUTING.md">贡献指南</a> ·
  <a href="./LICENSE">AGPL-3.0 许可证</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript&logoColor=white" alt="TypeScript 5.9" />
  <img src="https://img.shields.io/badge/Vite-rolldown-ffe135?logo=vite&logoColor=002FA7" alt="Vite (rolldown)" />
  <img src="https://img.shields.io/badge/FastAPI-后端-009688?logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Docker-compose-2496ed?logo=docker&logoColor=white" alt="Docker Compose" />
  <img src="https://img.shields.io/badge/许可证-AGPL--3.0-002FA7" alt="AGPL-3.0 许可证" />
</p>

---

## 灵码是什么？

**灵码 (Lingma)** 是一个单页学习平台，把抽象的数据结构和算法概念变成可以*看见*、*阅读*、*练习*、*梳理*的东西。它把交互式教材、算法动画可视化、AI 辅助编程工作区、思维导图编辑器、方法论文库，统一打包在一个中英双语的 Web 应用里。

面向：准备技术面试的学生、讲授 CS 基础课程的老师、以及偏好视觉直觉而非文字堆砌的自学者。

## ✨ 功能亮点

### 📊 分步算法动画
快速排序、BFS/DFS、二叉树、链表操作、排序家族、动态规划 —— 每一个算法都是可暂停、可回放、可拖动时间轴的关键帧动画。不是抽象的伪代码，而是看着 pivot 移动、递归分支展开、指针向前推进。

### 📖 结构化教程（`/book`）
章节层级明确、内嵌代码样例和可视化组件的课程内容。按用户维度记录学习进度。教程内容全部数据化在 `src/data/`，新增章节不用重新发版。

### 🤖 AI 练习工作区（`/practice`）
写代码 → 发起流式评审 → 一边看模型思考一边拿到渐进反馈。FastAPI 代理统一对接多家模型供应商（ModelScope、上游 API），通过 SSE 推送。包含 **Vibe Coding Lab** 和 **Prompt Arena** 两个提示词驱动的训练模块。

### 🧠 交互式思维导图（`/mindmap`）
对算法家族和题型模式搭建、调整、保存自己的知识图谱。面试前用来把"排序、查找、图算法之间到底什么关系"理清楚。

### 📐 方法论文库（`/methodology`）
基于模式的解题 playbook —— "看到 X 就用 Y" —— 按技法分类：双指针、滑动窗口、单调栈、DP 状态设计等等。

### 📈 学习仪表盘（`/dashboard`）
追踪已解题目、课程进度、最近活动。通过 API 代理做鉴权。

### 🌐 双语 & 可访问
通过 `I18nContext` 实现完整的中英 UI 切换。`ThemeContext` 控制暗色模式。通过 `useLowMotionMode` 尊重用户的 `prefers-reduced-motion` 偏好。桌面端与移动端响应式适配。

## 🗺️ 路由

| 路径 | 页面 | 需登录 |
|------|------|:-----:|
| `/` | 首页（公开落地页） | — |
| `/algorithms` | 算法目录 | ✓ |
| `/algorithms/:id` | 算法详情 + 可视化 | ✓ |
| `/book` | 教程主页 | ✓ |
| `/book/*` | 课程阅读器 | ✓ |
| `/practice` | AI 编程工作区 | ✓ |
| `/mindmap` | 思维导图编辑器 | ✓ |
| `/methodology` | 方法论文库 | ✓ |
| `/dashboard` | 学习仪表盘 | ✓ |
| `/auth` | 登录 / 注册 | — |

所有受保护路由都通过 `React.lazy` 做代码分割，并包在 `<ProtectedRoute>` 里（见 `src/App.tsx`）。

## 🏗️ 技术栈

| 层 | 技术 |
|---|------|
| **前端** | React 19、TypeScript 5.9、Vite (rolldown-vite)、Tailwind CSS 3、Framer Motion、React Router 7、Prism.js |
| **API 代理** | FastAPI、Uvicorn、SQLite、SSE 流式传输 |
| **判题服务** | Node.js、Express、严格沙箱（`cap_drop` / `pids_limit` / tmpfs） |
| **测试** | Vitest + Testing Library（前端）、Pytest（API 代理） |
| **部署** | Docker Compose（3 容器）、Nginx 反向代理、Let's Encrypt HTTPS |

## 📁 目录结构

```text
lingma/
├── src/
│   ├── pages/              # 路由级页面（代码分割）
│   ├── components/         # 共用 UI + lesson/tutorials/visualizations
│   ├── contexts/           # UserContext · ThemeContext · I18nContext
│   ├── services/           # aiService · judgeService · streamingSse · mindMapService
│   ├── hooks/              # useLowMotionMode · useStreamingTypewriterText · ...
│   ├── data/               # 课程内容、题库、方法论单元
│   ├── i18n/               # 按域划分的翻译字符串
│   └── DESIGN_SYSTEM.md    # 品牌 token、间距、动画规范
├── api-proxy/
│   ├── main.py             # FastAPI 入口
│   ├── app_modules/        # 模块化路由处理
│   └── tests/              # Pytest 测试
├── judge-server/
│   ├── server.js           # 沙箱化代码执行
│   └── tests/
├── deploy/
│   ├── docker-compose.yml  # 3 个容器: frontend · api-proxy · judge-server
│   ├── docker-deploy.py    # VPS 自动化部署（SFTP + 重建 + 健康检查）
│   ├── nginx.conf          # 反代 + HTTPS
│   └── setup-*.py / .sh    # SSL、服务、环境引导脚本
├── docs/hero/              # README 片头动画资源
└── README.md
```

## 🚀 快速开始

### 前置依赖
- **Node.js** 20+ 与 **npm** 10+
- **Python** 3.11+（API 代理需要）
- **Docker** + `docker-compose`（仅在本地跑生产镜像或部署 VPS 时需要）

### 1 · 前端
```bash
npm install
npm run dev         # Vite 开发服务器 http://localhost:5173
npm run build       # tsc -b && vite build（比 --noEmit 更严格，和 CI 一致）
npm run lint        # ESLint
npm run test        # Vitest（jsdom）
```

### 2 · API 代理
```bash
cd api-proxy
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 3001 --reload
```
代理负责鉴权、进度、AI 流式、文档请求。SQLite 数据库首次运行自动创建。

### 3 · 判题服务
```bash
cd judge-server
npm install
node server.js      # 内部端口 3002
```
在沙箱子进程里执行用户提交的代码，通过 `JUDGE_BASE_URL` 和 API 代理通信。

### 同时跑三个服务
本地完整链路需要三个终端（或者直接用 Docker Compose，见下）。

## 🐳 部署

生产环境由 `deploy/docker-compose.yml` 编排三个容器：

| 容器 | 角色 | 端口 |
|------|------|:---:|
| `frontend` | Nginx 静态托管 Vite 构建 | 18081（对外） |
| `api-proxy` | FastAPI 后端 | 3001（内部） |
| `judge-server` | 代码沙箱执行 | 3002（内部） |

### 环境变量
在 `deploy/.env` 至少配置：

```env
FRONTEND_BIND_HOST=0.0.0.0
FRONTEND_BIND_PORT=18081
# 启用 /practice 工作区需要配置 AI 密钥
# ANTHROPIC_API_KEY=...
# MODELSCOPE_API_KEY=...
LINGMA_JUDGE_INTERNAL_TOKEN=<随机长字符串>
```

**不要** 提交这个文件。判题 token 是 `api-proxy` 和 `judge-server` 之间共享的密钥。

### 一键部署到 VPS
```bash
python deploy/docker-deploy.py
```
脚本会打包工作区 → SFTP 上传 → 服务器上重建镜像 → 用 `docker-compose` 重启容器 → 执行健康检查。需要在本机环境变量里配好 VPS 凭据。

> 注意：服务器使用 `docker-compose`（带连字符的 v1），而不是 `docker compose` v2 插件。

## 🎨 设计语言

品牌 token 见 [`src/DESIGN_SYSTEM.md`](src/DESIGN_SYSTEM.md)。

| Token | 值 | 角色 |
|-------|------|------|
| `klein-500` | `#002FA7` | 主色（IKB · 克莱因蓝） |
| `pine-500` | `#FFE135` | 强调色（松花黄） |

页面切换用 Framer Motion + `useLowMotionMode` 无障碍降级。圆角规范：`rounded-xl`（12px）用于输入框/按钮，`rounded-2xl`（16px）用于卡片。布局最大宽 `max-w-6xl`，`pt-24` 避开粘性顶栏。

## 🤝 贡献

规范、分支策略、PR 清单见 [CONTRIBUTING.md](./CONTRIBUTING.md)。简版：

- Commit 风格：Conventional Commits（`feat:`、`fix:`、`docs:`、`refactor:`）
- 部署前 `npx tsc -b` **和** `npx vite build` 都必须通过（服务器上的 `tsc -b` 比本地 `--noEmit` 更严）
- UI 改动要在桌面端和移动端都验证一遍
- 保持 diff 最小化，只改任务相关的部分

## 📄 许可证

[AGPL-3.0](./LICENSE) © Lingma contributors
