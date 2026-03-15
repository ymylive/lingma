# 灵码

灵码是一个面向算法学习与 AI 协作开发训练的在线平台。

在线地址：[https://lingma.cornna.xyz](https://lingma.cornna.xyz)

## 项目亮点

- 统一的 Klein Blue (#002FA7) + Pine Yellow (#FFE135) 品牌设计体系
- 分层算法题库与练习路径
- 受保护的在线判题与 AI 代理链路
- AI 智能出题与填空题练习
- `Vibe Coding Lab` 方法论学习界面
- `Prompt Arena` 训练场：AI 生成 prompt 练习题，五条赛道，评分与改写示范
- 独立的 `/methodology` 方法论文档阅读页面（侧边栏 TOC + 滚动高亮 + 移动端 FAB）
- 完整的中英文国际化支持
- 响应式布局，移动端汉堡菜单

## 技术栈

- React 19 + TypeScript + Vite
- Tailwind CSS + Framer Motion
- FastAPI (Python) + SQLite
- Node.js 判题服务
- Docker Compose 三服务部署
- Nginx + HTTPS (Let's Encrypt)

## 本地开发

### 前端

```bash
npm install
npm run dev
```

### 生产构建

```bash
npx tsc -b          # 类型检查
npx vite build      # 构建产物
```

### API Proxy

```bash
cd api-proxy
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 3001
```

## 关键目录

- `src/pages/` — 页面组件（Home、Algorithms、Book、Practice、Dashboard、MindMap、Methodology）
- `src/components/Header.tsx` — 全局导航（含移动端汉堡菜单）
- `src/components/Footer.tsx` — 全局页脚（品牌信息、快捷链接、技术栈）
- `src/components/tutorials/VibeCodingLab.tsx` — Vibe Coding 学习与 Prompt Arena
- `api-proxy/main.py` — 鉴权、AI 代理、判题代理、Prompt Arena 后端
- `deploy/docker-compose.yml` — 生产环境 Docker 编排
- `deploy/docker-deploy.py` — 一键部署脚本（paramiko，Windows 兼容）
- `tailwind.config.js` — 品牌色阶定义（klein-50~900、pine-50~900）

## 部署

```bash
LINGMA_VPS_PASSWORD=<密码> python deploy/docker-deploy.py
```

脚本自动完成打包、上传、解压、构建镜像、启动容器、清理旧镜像和健康检查。

生产环境通过 `lingma.cornna.xyz` 对外提供 HTTPS 访问，Nginx 反向代理到 Docker 容器的 18081 端口。

## 许可证

MIT
