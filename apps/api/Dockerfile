FROM oven/bun:1.2 AS base
WORKDIR /app

# Install dependencies (build from monorepo root context)
COPY package.json bun.lock ./
COPY packages/shared/package.json ./packages/shared/package.json
COPY packages/db/package.json ./packages/db/package.json
COPY apps/api/package.json ./apps/api/package.json
RUN bun install --frozen-lockfile

# Copy source
COPY packages/shared/ ./packages/shared/
COPY packages/db/ ./packages/db/
COPY apps/api/ ./apps/api/

WORKDIR /app/apps/api

ENV PORT=3000
EXPOSE 3000

CMD ["bun", "run", "src/index.ts"]
