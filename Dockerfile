FROM oven/bun:1.2.5-alpine AS base

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Install dependencies only when needed
FROM base AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules

COPY next.config.ts postcss.config.mjs tsconfig.json package.json bun.lock ./
COPY src ./src
COPY public ./public

RUN bun run build
RUN cp -r .next/static .next/standalone/.next/ && cp -r public .next/standalone/public/

# Production image, copy all the files and run the app
FROM base AS runner

COPY --from=builder /app/.next/standalone ./

ENV HOSTNAME="0.0.0.0"
EXPOSE 80
ENV PORT=80

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
CMD ["node", "server.js"]
