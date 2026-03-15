# Tumafang 项目规范

## 技术栈

- 前端：React 19 + TypeScript + Vite + Tailwind CSS + framer-motion
- 后端代理：FastAPI (Python 3.11) + uvicorn
- 判题服务：Node.js 18 + judge-server
- 部署：Docker Compose（3 服务：frontend / api-proxy / judge-server）

## 生产服务器

- 地址：`8.134.33.19`
- 用户：`root`
- 密码：`Qq159741`
- 项目路径：`/var/www/lingma`
- 前端端口：`18081`（nginx → 0.0.0.0:18081:80）
- Docker Compose 文件：`/var/www/lingma/deploy/docker-compose.yml`
- 环境变量：`/var/www/lingma/deploy/.env`

## 部署流程

服务器没有 `docker compose`（v2 plugin），必须使用 `docker-compose`（连字符版本）。

### 标准部署步骤

1. 本地打 tarball（包含 deploy/、api-proxy/、judge-server/、src/、public/ 及配置文件）
2. 通过 paramiko SFTP 上传到 `/var/www/lingma/deploy-bundle.tar.gz`
3. 远程解压：`cd /var/www/lingma && tar xzf deploy-bundle.tar.gz && rm deploy-bundle.tar.gz`
4. 仅前端改动时：`docker-compose build --no-cache frontend && docker-compose up -d frontend`
5. 全量重建时：`docker-compose down && docker-compose build --no-cache && docker-compose up -d`
6. 清理旧镜像：`docker image prune -af`
7. 验证：`docker ps | grep deploy` + `curl -sf http://127.0.0.1:18081/api/health`

### 部署脚本

`deploy/docker-deploy.py` — 基于 paramiko 的自动化部署脚本（Windows 兼容）。

```bash
LINGMA_VPS_PASSWORD=Qq159741 python deploy/docker-deploy.py
```

### 注意事项

- 本地 Windows 环境没有 sshpass，必须用 paramiko
- 服务器 `tsc -b` 比本地 `tsc --noEmit` 更严格（会报 unused imports），部署前用 `npx tsc -b` 验证
- tarball 必须包含 `judge-server/` 目录（server.js、package.json、package-lock.json）
- 服务器上还运行着其他服务（shuake、renling、easytier、headscale），部署时不要影响它们

## 构建验证

部署前必须通过：

```bash
npx tsc -b          # 类型检查（与服务器一致的严格模式）
npx vite build      # 构建产物
```
