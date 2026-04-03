FROM node:18-bullseye

RUN sed -i 's|deb.debian.org|mirrors.aliyun.com|g; s|security.debian.org|mirrors.aliyun.com|g' /etc/apt/sources.list \
  && apt-get update -o Acquire::Retries=5 \
  && apt-get install -y --fix-missing --no-install-recommends \
    ca-certificates \
    gcc \
    g++ \
    make \
    python3 \
    openjdk-17-jdk-headless \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV NODE_ENV=production
ENV npm_config_registry=https://registry.npmmirror.com
RUN useradd --create-home --shell /usr/sbin/nologin judge

COPY judge-server/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --chown=judge:judge judge-server/server.js ./

USER judge

EXPOSE 3002
CMD ["node", "server.js"]
