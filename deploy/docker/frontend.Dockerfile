FROM node:20-alpine AS build
WORKDIR /app

ARG VITE_ENABLE_REMOTE_MINDMAP_SYNC=false
ENV VITE_ENABLE_REMOTE_MINDMAP_SYNC=${VITE_ENABLE_REMOTE_MINDMAP_SYNC}

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig*.json vite.config.ts tailwind.config.js postcss.config.js index.html ./
COPY src ./src
COPY public ./public
RUN npm run build

FROM nginx:alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
