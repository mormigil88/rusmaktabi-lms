# Bilimora — production Dockerfile для UZ-VPS
# Multi-stage build: deps → build → standalone runner
# Standalone output собирает только нужное в `.next/standalone/` (~80 MB вместо ~300 MB node_modules).

# ─── Stage 1: install deps ─────────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

# libc6-compat для Prisma (если появится), sharp для Next.js Image optimization
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json* ./
RUN npm ci --prefer-offline

# ─── Stage 2: build ────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ─── Stage 3: runner (standalone) ──────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=127.0.0.1

# Создать non-root пользователя
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Скопировать standalone (содержит server.js + минимальный node_modules)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Public + static отдельно (standalone их не включает)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Healthcheck для docker compose / k8s
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server.js"]
