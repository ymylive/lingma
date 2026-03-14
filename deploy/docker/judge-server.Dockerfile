FROM node:18-bullseye

RUN sed -i 's|deb.debian.org|mirrors.aliyun.com|g' /etc/apt/sources.list \
  && sed -i 's|security.debian.org|mirrors.aliyun.com/debian-security|g' /etc/apt/sources.list \
  && apt-get update -o Acquire::Retries=3 \
  && apt-get install -y --no-install-recommends \
    ca-certificates \
    gcc \
    g++ \
    make \
    python3 \
    openjdk-17-jdk-headless \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV NODE_ENV=production
RUN useradd --create-home --shell /usr/sbin/nologin judge

COPY judge-server/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --chown=judge:judge judge-server/server.js ./

USER judge

EXPOSE 3002
CMD ["node", "server.js"]
