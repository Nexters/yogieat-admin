FROM node:20-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY craco.config.cjs tsconfig.json ./
COPY public ./public
COPY src ./src
COPY packages ./packages

ARG BUILD_PATH=dist/admin
ARG REACT_APP_API_URL=https://api.yogieat.com
ARG REACT_APP_ADMIN_API_PREFIX=/api/v1/admin
ARG REACT_APP_USE_MOCK_API=false
ENV BUILD_PATH=$BUILD_PATH \
    REACT_APP_API_URL=$REACT_APP_API_URL \
    REACT_APP_ADMIN_API_PREFIX=$REACT_APP_ADMIN_API_PREFIX \
    REACT_APP_USE_MOCK_API=$REACT_APP_USE_MOCK_API \
    GENERATE_SOURCEMAP=false \
    NODE_ENV=production

RUN pnpm install --frozen-lockfile
RUN pnpm build

FROM nginx:1.27-alpine
ARG BUILD_PATH=dist/admin
RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/$BUILD_PATH /usr/share/nginx/html/

RUN cat > /etc/nginx/conf.d/default.conf <<'EOF'
server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location ~* \.(js|css|png|jpg|jpeg|gif|webp|svg|ico|woff2?)$ {
    try_files $uri =404;
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
EOF

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
