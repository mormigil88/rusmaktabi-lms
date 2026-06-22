#!/bin/bash
# Подключение production Supabase к Vercel + деплой миграций
# Запустить ОДИН РАЗ после создания проекта на supabase.com
#
# Использование:
#   chmod +x scripts/setup-supabase-prod.sh
#   SUPABASE_ACCESS_TOKEN=sbp_xxxx ./scripts/setup-supabase-prod.sh

set -e

if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
  echo "ERROR: SUPABASE_ACCESS_TOKEN не задан"
  echo ""
  echo "Получить токен:"
  echo "  1. Зайти на https://supabase.com/dashboard/account/tokens"
  echo "  2. Generate new token → скопировать"
  echo "  3. Запустить: SUPABASE_ACCESS_TOKEN=sbp_xxxx ./scripts/setup-supabase-prod.sh"
  exit 1
fi

VTOKEN_FILE="$HOME/Library/Application Support/com.vercel.cli/auth.json"
VTOKEN=$(python3 -c "import json; print(json.load(open('$VTOKEN_FILE'))['token'])" 2>/dev/null)
if [ -z "$VTOKEN" ]; then
  echo "ERROR: Vercel не залогинен. Запустите: vercel login"
  exit 1
fi

PROJECT_ID="prj_jFWsA9x5tvx2Vh45AeY4pi7iv3Y9"
TEAM_ID="team_V8x5GK80cnEg6njLxumSColp"

echo "=== Шаг 1: Создание Supabase проекта ==="
echo "(если уже создан — введите существующий project ref)"

read -p "Supabase project ref (например: abcdefghijklmnop): " SUPABASE_REF

if [ -z "$SUPABASE_REF" ]; then
  echo "Создаём новый Supabase проект..."
  read -p "Название региона (eu-central-1 / ap-southeast-1 / us-east-1): " REGION
  read -p "Пароль БД (min 8 символов): " -s DB_PASS
  echo ""

  RESULT=$(curl -s -X POST "https://api.supabase.com/v1/projects" \
    -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"rusmaktabi-lms\",
      \"organization_id\": \"\",
      \"plan\": \"free\",
      \"region\": \"${REGION:-eu-central-1}\",
      \"db_pass\": \"$DB_PASS\"
    }")

  SUPABASE_REF=$(echo "$RESULT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('id', d.get('error','ERROR')))")
  echo "Project ref: $SUPABASE_REF"
fi

SUPABASE_URL="https://${SUPABASE_REF}.supabase.co"

echo ""
echo "=== Шаг 2: Получение API ключей ==="
KEYS=$(curl -s "https://api.supabase.com/v1/projects/${SUPABASE_REF}/api-keys" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN")

ANON_KEY=$(echo "$KEYS" | python3 -c "import sys,json; keys=json.load(sys.stdin); print(next((k['api_key'] for k in keys if k['name']=='anon'), ''))")
SERVICE_KEY=$(echo "$KEYS" | python3 -c "import sys,json; keys=json.load(sys.stdin); print(next((k['api_key'] for k in keys if k['name']=='service_role'), ''))")

echo "SUPABASE_URL: $SUPABASE_URL"
echo "ANON_KEY: ${ANON_KEY:0:20}..."
echo "SERVICE_KEY: ${SERVICE_KEY:0:20}..."

echo ""
echo "=== Шаг 3: Применение миграций ==="
SUPABASE_ACCESS_TOKEN=$SUPABASE_ACCESS_TOKEN supabase link --project-ref "$SUPABASE_REF"
supabase db push

echo ""
echo "=== Шаг 4: Обновление Vercel env vars ==="

update_env() {
  local key="$1"
  local value="$2"

  # Удалить старый
  OLD_ID=$(curl -s "https://api.vercel.com/v10/projects/${PROJECT_ID}/env?teamId=${TEAM_ID}" \
    -H "Authorization: Bearer $VTOKEN" | python3 -c "
import sys,json
envs = json.load(sys.stdin).get('envs', [])
e = next((e for e in envs if e['key']=='$key'), None)
print(e['id'] if e else '')
")
  if [ -n "$OLD_ID" ]; then
    curl -s -X DELETE "https://api.vercel.com/v10/projects/${PROJECT_ID}/env/${OLD_ID}?teamId=${TEAM_ID}" \
      -H "Authorization: Bearer $VTOKEN" > /dev/null
  fi

  # Добавить новый
  curl -s -X POST "https://api.vercel.com/v10/projects/${PROJECT_ID}/env?teamId=${TEAM_ID}" \
    -H "Authorization: Bearer $VTOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"key\":\"$key\",\"value\":\"$value\",\"type\":\"encrypted\",\"target\":[\"production\"]}" > /dev/null

  echo "  ✓ $key"
}

update_env "NEXT_PUBLIC_SUPABASE_URL" "$SUPABASE_URL"
update_env "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$ANON_KEY"
update_env "SUPABASE_SERVICE_ROLE_KEY" "$SERVICE_KEY"

echo ""
echo "=== Шаг 5: Редеплой ==="
vercel --prod --yes

echo ""
echo "=== Готово! ==="
echo "Сайт: https://rusmaktabi-lms.vercel.app"
echo ""
echo "Осталось:"
echo "  1. Добавить реальные ключи Payme и YooKassa в Vercel:"
echo "     vercel env add PAYME_MERCHANT_ID"
echo "     vercel env add PAYME_KEY"
echo "     vercel env add YOOKASSA_SHOP_ID"
echo "     vercel env add YOOKASSA_SECRET_KEY"
echo "  2. vercel --prod"
echo "  3. Настроить домен: vercel domains add rusmaktabi.com"
