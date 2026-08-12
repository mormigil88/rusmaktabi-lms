#!/usr/bin/env bash
# Bilimora — деплой с github на andrey-claude-uz
# Запускать на сервере: bash scripts/deploy.sh
#
# Что делает:
#   1. git pull origin main
#   2. npm ci --omit=dev (production deps)
#   3. npm run build (standalone output)
#   4. rsync .next/standalone + .next/static + public → /opt/bilimora/
#   5. rsync .env → /opt/bilimora/.env (если локальный .env существует)
#   6. sudo systemctl restart bilimora
#
# Требования:
#   - На сервере уже есть /opt/bilimora (создан при первом деплое)
#   - /opt/bilimora принадлежит пользователю bilimora
#   - bilimora.service скопирован в /etc/systemd/system/
#   - nginx настроен по nginx/conf.d/bilimora.conf
#   - SSL сертификаты выпущены (certbot)

set -euo pipefail

APP_NAME="bilimora"
APP_DIR="/opt/${APP_NAME}"
REPO_DIR="${HOME}/workspace/projects/rusmaktabi-lms"
BRANCH="${BRANCH:-main}"
HEALTH_URL="http://127.0.0.1:3000/"

cd "${REPO_DIR}"

echo "▶ git pull origin ${BRANCH}"
git pull origin "${BRANCH}"

echo "▶ npm ci (production deps)"
npm ci --omit=dev

echo "▶ npm run build"
NODE_ENV=production npm run build

echo "▶ rsync → ${APP_DIR}/"
# Standalone содержит server.js + server-dependencies (минимальный node_modules)
rsync -a --delete .next/standalone/ "${APP_DIR}/"
# Public + static копируются отдельно (standalone их не включает)
rsync -a --delete .next/static/ "${APP_DIR}/.next/static/"
rsync -a --delete public/ "${APP_DIR}/public/"

# .env — копировать только если локальный .env существует
if [[ -f .env ]]; then
  install -m 600 .env "${APP_DIR}/.env"
  echo "  .env → ${APP_DIR}/.env (mode 600)"
else
  echo "  ⚠️  .env не найден в ${REPO_DIR}, использую существующий ${APP_DIR}/.env"
fi

echo "▶ systemctl restart ${APP_NAME}"
sudo systemctl restart "${APP_NAME}"

echo "▶ health check"
sleep 5
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${HEALTH_URL}")
if [[ "${HTTP_STATUS}" == "200" ]] || [[ "${HTTP_STATUS}" == "307" ]] || [[ "${HTTP_STATUS}" == "302" ]]; then
  echo "  ✓ HTTP ${HTTP_STATUS} — деплой ОК"
else
  echo "  ✗ HTTP ${HTTP_STATUS} — что-то не так, проверь: sudo journalctl -u ${APP_NAME} -n 50"
  exit 1
fi
