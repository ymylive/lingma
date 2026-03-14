# 灵码

灵码是一个面向算法学习与 AI 协作开发训练的在线平台。

在线地址：`https://lingma.cornna.xyz`

## 项目亮点

- 分层算法题库与练习路径
- 受保护的在线判题与 AI 代理链路
- AI 智能出题与填空题练习
- `Vibe Coding Lab` 方法论学习界面
- 全新的 `Prompt Arena` 训练场：
  - AI 自动生成 prompt 练习题
  - 五条训练赛道：前端、后端、调试、重构、审查
  - 只评估 prompt 质量，不评估代码结果
  - 返回总分、维度分、优点、问题点、改写示范
  - 支持账号级历史记录与自适应难度

## 技术栈

- React 19
- TypeScript
- Vite
- Tailwind CSS
- FastAPI
- SQLite
- Docker Compose

## 本地开发

### 前端

```bash
npm install
npm run dev
```

### 生产构建

```bash
npm run build
```

### API Proxy

```bash
cd api-proxy
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 3001
```

## 关键目录

- `src/pages/Practice.tsx`：练习页入口与 tab 切换
- `src/components/tutorials/VibeCodingLab.tsx`：Vibe Coding 学习与 Prompt Arena 界面
- `src/services/vibeCodingService.ts`：Prompt Arena 前端 API 服务层
- `src/types/vibeCoding.ts`：Prompt Arena 类型定义
- `api-proxy/main.py`：鉴权、AI 代理、判题代理、Prompt Arena 后端
- `deploy/docker-compose.yml`：生产环境 Docker 编排

## 验证命令

```bash
python -m pytest api-proxy/tests/test_vibe_coding_api.py -q
python -m py_compile api-proxy/main.py
npx eslint src/components/tutorials/VibeCodingLab.tsx src/services/vibeCodingService.ts src/types/vibeCoding.ts
npm run build
```

## 部署说明

当前生产环境通过 `deploy/docker-compose.yml` 部署在 VPS 上，由 `lingma.cornna.xyz` 对外提供访问。

标准发布流程：

1. 本地完成构建与最小验证
2. 同步源码到 `/opt/tumafang`
3. 保留服务器上的 `deploy/.env`
4. 执行 `docker-compose up -d --build`
5. 验证首页与 `/api/health`

## 许可证

MIT
