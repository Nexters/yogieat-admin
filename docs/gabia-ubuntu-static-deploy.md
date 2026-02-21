# 가비아 Ubuntu(Ubuntu LTS) two-domain Docker 배포 가이드

이 가이드는 `develop`/`main` 브랜치로 분리된 빌드 산출물을 동일 인스턴스에서 각각 컨테이너로 운영하는 방법입니다.

- `develop` → `dev-admin.yogieat.com` 대상(`dist/dev-admin`, `https://dev-api.yogieat.com`)
- `main` → `admin.yogieat.com` 대상(`dist/admin`, `https://api.yogieat.com`)
- HTTPS는 호스트 Nginx + Certbot에서 처리하고, 컨테이너는 HTTP만 제공합니다.

## 1) 인스턴스 초기 설정

```bash
sudo apt update
sudo apt install -y docker.io nginx ufw certbot python3-certbot-nginx curl ca-certificates

sudo systemctl enable --now docker
sudo usermod -aG docker deploy

sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

sudo mkdir -p /srv/yogieat-admin/source
sudo chown -R deploy:deploy /srv/yogieat-admin
```

## 2) Nginx(호스트) 설정

`/etc/nginx/sites-available/yogieat-admin` 예시:

```nginx
server {
    listen 80;
    server_name dev-admin.yogieat.com;
    return 301 https://$host$request_uri;
}

server {
    listen 80;
    server_name admin.yogieat.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name dev-admin.yogieat.com;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 443 ssl;
    server_name admin.yogieat.com;

    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo tee /etc/nginx/sites-available/yogieat-admin > /dev/null <<'EOF'
server {
    listen 80;
    server_name dev-admin.yogieat.com;
    return 301 https://$host$request_uri;
}
server {
    listen 80;
    server_name admin.yogieat.com;
    return 301 https://$host$request_uri;
}
server {
    listen 443 ssl;
    server_name dev-admin.yogieat.com;
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
server {
    listen 443 ssl;
    server_name admin.yogieat.com;
    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/yogieat-admin /etc/nginx/sites-enabled/yogieat-admin
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl enable --now nginx
```

## 3) SSL 인증서 발급

```bash
sudo certbot --nginx -d dev-admin.yogieat.com -d admin.yogieat.com \
  --non-interactive --agree-tos --email ops@yogieat.com --redirect
```

## 4) 배포 스크립트 준비

```bash
sudo cp scripts/deploy/deploy-yogieat-admin.sh /usr/local/bin/deploy-yogieat-admin.sh
sudo chmod +x /usr/local/bin/deploy-yogieat-admin.sh
```

`/usr/local/bin/deploy-yogieat-admin.sh`는 `dev`/`main` 타겟과 이미지 SHA, 환경(`develop`/`main`)을 받아 각 환경의 compose로 배포합니다.
- 배포 시점에는 `dev/.env`, `prod/.env`를 각각 `docker compose`의 `env_file`로 주입합니다.
- 정적 React 번들은 `REACT_APP_*` 빌드 아티팩트이므로, 런타임에서 `.env`를 변경해도 번들 내용은 바뀌지 않습니다. API 엔드포인트 분기 변경은 반드시 빌드 아규먼트 또는 워크플로 변수로 반영하세요.

## 5) GitHub Actions 워크플로

브랜치별 워크플로로 운영:

- `.github/workflows/deploy-admin-dev.yml` (`develop`)
- `.github/workflows/deploy-admin-production.yml` (`main`)

필요한 GitHub Secrets:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN` (Read/Write)
- `GABIA_HOST`
- `GABIA_USER` (`deploy` 권장)
- `GABIA_SSH_KEY`
- `GABIA_PORT`(기본 22)

워크플로 동작:

- `develop`/`main` 브랜치별로 `docker/Dockerfile`을 빌드해서 Docker Hub에 이미지 푸시
  - `develop-<sha>`, `develop-latest`, `main-<sha>`, `main-latest` 태그
- `deploy-yogieat-admin.sh` 실행 시 해당 환경의 이미지 태그를 전달해서 `docker compose up --pull always --remove-orphans` 수행
- 배포용 소스(Compose 파일 동기화)만 최소 패키지로 `/tmp/yogieat-admin-source.tgz`에 압축해 전달

## 6) 수동 배포

```bash
sudo DOCKERHUB_NAMESPACE=<DockerHub-네임스페이스> /usr/local/bin/deploy-yogieat-admin.sh dev <short_sha> develop
sudo DOCKERHUB_NAMESPACE=<DockerHub-네임스페이스> /usr/local/bin/deploy-yogieat-admin.sh main <short_sha> main
```

## 7) 검증

```bash
curl -I https://dev-admin.yogieat.com
curl -I https://admin.yogieat.com
curl -I https://dev-admin.yogieat.com/non-existing-path
curl -I https://admin.yogieat.com/non-existing-path
docker compose -f /srv/yogieat-admin/source/docker/docker-compose.yml -f /srv/yogieat-admin/source/docker/docker-compose.dev.yml ps
docker compose -f /srv/yogieat-admin/source/docker/docker-compose.yml -f /srv/yogieat-admin/source/docker/docker-compose.main.yml ps
```

## 8) 배포 로그

`/srv/yogieat-admin/deploy.log`

> 참고: 롤백은 원하는 이미지 SHA 태그로 재배포하면 됩니다.
