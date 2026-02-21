#!/usr/bin/env bash
set -euo pipefail

APP_ROOT="/srv/yogieat-admin"
SOURCE="/tmp/yogieat-admin-source.tgz"
TARGET="${1:-dev}"
IMAGE_TAG="${2:-latest}"
DEFAULT_ENV=""
PROJECT_ROOT="$APP_ROOT/source"
TARGET_ENV=""
RUNTIME_ENV_DIR=""

case "$TARGET" in
  dev|develop)
    COMPOSE_FILE="docker/docker-compose.dev.yml"
    DEFAULT_ENV="develop"
    TARGET_ENV="develop"
    RUNTIME_ENV_DIR="dev"
    TARGET_CONTAINER_NAME="yogieat-dev-admin"
    ;;
  main|admin)
    COMPOSE_FILE="docker/docker-compose.main.yml"
    DEFAULT_ENV="main"
    TARGET_ENV="main"
    RUNTIME_ENV_DIR="prod"
    TARGET_CONTAINER_NAME="yogieat-admin-prod"
    ;;
  *)
    echo "Invalid target: $TARGET. Use dev/main or develop/admin." >&2
    exit 1
    ;;
esac

if [ ! -w "$APP_ROOT" ]; then
  APP_ROOT="/tmp/yogieat-admin"
  PROJECT_ROOT="$APP_ROOT/source"
fi

mkdir -p "$APP_ROOT"
ENV_LABEL="${3:-$DEFAULT_ENV}"

if [ "$ENV_LABEL" != "develop" ] && [ "$ENV_LABEL" != "main" ]; then
  echo "Invalid env: $ENV_LABEL. Use develop or main." >&2
  exit 1
fi

if [ "$ENV_LABEL" != "$TARGET_ENV" ]; then
  echo "Env mismatch: target=$TARGET expects $TARGET_ENV but got $ENV_LABEL." >&2
  exit 1
fi

RUNTIME_ENV_FILE="$APP_ROOT/${RUNTIME_ENV_DIR}/.env"
if [ ! -f "$RUNTIME_ENV_FILE" ]; then
  for candidate in \
    "/srv/yogieat-admin/${RUNTIME_ENV_DIR}/.env" \
    "/tmp/yogieat-admin/${RUNTIME_ENV_DIR}.env" \
    "/tmp/yogieat-admin/${RUNTIME_ENV_DIR}/.env" \
    "$PROJECT_ROOT/${RUNTIME_ENV_DIR}.env" \
    "$PROJECT_ROOT/${RUNTIME_ENV_DIR}/.env"
  do
    if [ -f "$candidate" ]; then
      RUNTIME_ENV_FILE="$candidate"
      break
    fi
  done
fi

if [ ! -f "$RUNTIME_ENV_FILE" ]; then
  echo "WARN: missing runtime env file $RUNTIME_ENV_FILE, using /dev/null instead." >&2
  RUNTIME_ENV_FILE="/dev/null"
fi

if [ -z "${DOCKERHUB_NAMESPACE:-}" ] && [ -z "${DOCKERHUB_USERNAME:-}" ]; then
  echo "Missing image namespace. Set DOCKERHUB_NAMESPACE or DOCKERHUB_USERNAME on host or in deployment environment." >&2
  exit 1
fi

DOCKERHUB_NAMESPACE="${DOCKERHUB_NAMESPACE:-${DOCKERHUB_USERNAME}}"
APP_IMAGE="${DOCKERHUB_NAMESPACE}/yogieat-admin:${ENV_LABEL}-${IMAGE_TAG}"
COMPOSE_PROJECT_NAME="yogieat-admin-${ENV_LABEL}"

mkdir -p "$APP_ROOT"
mkdir -p "$PROJECT_ROOT"

if [ -f "$SOURCE" ]; then
  rm -rf "$PROJECT_ROOT"
  mkdir -p "$PROJECT_ROOT"
  tar -xzf "$SOURCE" -C "$PROJECT_ROOT"
  cd "$PROJECT_ROOT"
else
  if [ ! -d "$PROJECT_ROOT" ]; then
    echo "Missing source archive: $SOURCE" >&2
    echo "Expected existing source at $PROJECT_ROOT or a new archive at $SOURCE." >&2
    exit 1
  fi
  cd "$PROJECT_ROOT"
fi

APP_IMAGE="$APP_IMAGE" \
APP_ENV_FILE="$RUNTIME_ENV_FILE" \
COMPOSE_PROJECT_NAME="$COMPOSE_PROJECT_NAME" \
  docker compose -p "$COMPOSE_PROJECT_NAME" -f docker/docker-compose.yml -f "$COMPOSE_FILE" up -d --pull always --remove-orphans

if ! docker ps --filter "name=$TARGET_CONTAINER_NAME" --filter "status=running" --format '{{.Names}}' | grep -q "^$TARGET_CONTAINER_NAME$"; then
  echo "Deployment did not keep target container alive: $TARGET_CONTAINER_NAME" >&2
  docker compose -p "$COMPOSE_PROJECT_NAME" -f docker/docker-compose.yml -f "$COMPOSE_FILE" ps -a >&2
  docker logs --tail=80 "$TARGET_CONTAINER_NAME" 2>&1 | sed -n '1,80p' >&2 || true
  exit 1
fi

docker image prune -f >/dev/null 2>&1 || true

echo "$(date '+%F %T') target=$TARGET env=$ENV_LABEL image=$APP_IMAGE" >> "$APP_ROOT/deploy.log"
