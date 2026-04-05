FROM node:20-alpine AS build
WORKDIR /app

ARG VITE_ENABLE_REMOTE_MINDMAP_SYNC=false
ARG NPM_REGISTRY=https://registry.npmmirror.com
ENV VITE_ENABLE_REMOTE_MINDMAP_SYNC=${VITE_ENABLE_REMOTE_MINDMAP_SYNC}
ENV npm_config_registry=${NPM_REGISTRY}

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig*.json vite.config.ts tailwind.config.js postcss.config.js index.html ./
COPY src ./src
COPY public ./public
RUN npm run build

FROM nginx:alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY deploy/snippets/sse-proxy.conf /etc/nginx/snippets/sse-proxy.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
