# Tumafang 项目规范

## 技术栈

- 前端：React 19 + TypeScript + Vite + Tailwind CSS + framer-motion
- 后端代理：FastAPI (Python 3.11) + uvicorn
- 判题服务：Node.js 18 + judge-server
- 部署：Docker Compose（3 服务：frontend / api-proxy / judge-server）

## 生产服务器

- 地址与登录凭据：通过安全渠道单独分发，不在仓库记录
- 项目路径：`/var/www/lingma`
- 前端端口：`18081`（nginx → 0.0.0.0:18081:80）
- Docker Compose 文件：`/var/www/lingma/deploy/docker-compose.yml`
- 环境变量：`/var/www/lingma/deploy/.env`

## 部署流程

服务器没有 `docker compose`（v2 plugin），必须使用 `docker-compose`（连字符版本）。

### 标准部署步骤

1. 本地打 tarball（仅包含 deploy 下受控部署文件、api-proxy/、judge-server/、src/、public/ 及配置文件；禁止把本地 `deploy/.env`、日志、证书、临时产物打包上传）
2. 通过 paramiko SFTP 上传到 `/var/www/lingma/deploy-bundle.tar.gz`
3. 远程解压：`cd /var/www/lingma && tar xzf deploy-bundle.tar.gz && rm deploy-bundle.tar.gz`
4. 仅前端改动时：`docker-compose build --no-cache frontend && docker-compose up -d frontend`
5. 全量重建时：`docker-compose down && docker-compose build --no-cache && docker-compose up -d`
6. 清理旧镜像：`docker image prune -af`
7. 验证：`docker ps | grep deploy` + `curl -sf http://127.0.0.1:18081/api/health`

### 部署脚本

`deploy/docker-deploy.py` — 基于 paramiko 的自动化部署脚本（Windows 兼容）。

```bash
python deploy/docker-deploy.py
```

运行前要求：

- 先通过本地 shell、CI secret store 或未纳管的本地环境文件注入 VPS 凭据，禁止把真实值写进命令历史、文档或仓库
- 通过环境变量显式提供 `LINGMA_JUDGE_INTERNAL_TOKEN`，部署脚本会把它同步到服务器 `deploy/.env`，判题链路不再接受默认回退 token
- 首次连接前先把生产服务器 host key 写入可信 `known_hosts`；如需显式指定，可设置 `LINGMA_SSH_KNOWN_HOSTS`
- 如果凭据曾经出现在仓库或聊天记录中，先轮换再部署

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
