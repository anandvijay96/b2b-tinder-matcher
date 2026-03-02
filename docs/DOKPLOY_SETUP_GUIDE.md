# Dokploy Self-Hosted Infrastructure Guide — NMQ B2B Match

> All services are OSS and deployed on your own server via Dokploy.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Dokploy Server                        │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │  libSQL       │  │  NMQ API     │  │  Admin        │ │
│  │  Server       │  │  (Hono+tRPC) │  │  Dashboard    │ │
│  │  :8080        │  │  :3000       │  │  (Next.js)    │ │
│  │  db.nmq.your  │  │  api.nmq.your│  │  admin.nmq.your│
│  └──────┬───────┘  └──────┬───────┘  └──────┬────────┘ │
│         │                  │                  │          │
│  ┌──────┴──────────────────┴──────────────────┘         │
│  │  Internal Docker Network (dokploy-network)           │
│  └──────────────────────────────────────────────────────┘
│                                                         │
│  ┌──────────────┐  ┌──────────────┐                     │
│  │  Mailpit      │  │  Plausible   │                     │
│  │  (Dev Email)  │  │  Analytics   │                     │
│  │  :8025/:1025  │  │  :8000       │                     │
│  │  mail.nmq.your│  │  stats.nmq.your                   │
│  └──────────────┘  └──────────────┘                     │
│                                                         │
│          Traefik (built into Dokploy)                   │
│          SSL via Let's Encrypt                          │
└─────────────────────────────────────────────────────────┘
```

### Services

| Service | Image | Purpose | OSS License |
|---------|-------|---------|-------------|
| **libSQL Server** | `ghcr.io/tursodatabase/libsql-server` | SQLite-compatible database (replaces Turso SaaS) | MIT |
| **NMQ API** | Custom Dockerfile (Bun) | Hono + tRPC + Better-Auth backend | — |
| **Admin Dashboard** | Custom Dockerfile (Next.js) | Registration metrics, MVP data | — |
| **Mailpit** | `axllent/mailpit` | Email testing (catches all OTP emails in dev) | MIT |
| **Plausible** | `ghcr.io/plausible/community-edition` | Privacy-friendly usage analytics | AGPL-3.0 |

---

## Prerequisites

- A VPS/server with Dokploy installed ([docs.dokploy.com/docs/core/installation](https://docs.dokploy.com/docs/core/installation))
- A domain name with DNS access (e.g., `nmqmatch.com`)
- DNS A records pointing to your server IP for each subdomain

### DNS Records (example)

| Type | Name | Value |
|------|------|-------|
| A | `db.nmqmatch.com` | `YOUR_SERVER_IP` |
| A | `api.nmqmatch.com` | `YOUR_SERVER_IP` |
| A | `admin.nmqmatch.com` | `YOUR_SERVER_IP` |
| A | `mail.nmqmatch.com` | `YOUR_SERVER_IP` |
| A | `stats.nmqmatch.com` | `YOUR_SERVER_IP` |

---

## 1. libSQL Server (Database)

### 1.1 Deploy via Dokploy Docker Compose

In Dokploy UI → **Create Project** → **Docker Compose** → paste:

```yaml
services:
  libsql:
    image: ghcr.io/tursodatabase/libsql-server:latest
    platform: linux/amd64
    ports:
      - "8080:8080"
      - "5001:5001"
    environment:
      - SQLD_NODE=primary
      # Auth: set this AFTER generating keys (see step 1.2)
      # - SQLD_AUTH_JWT_KEY=${LIBSQL_PUBLIC_KEY}
    volumes:
      - libsql-data:/var/lib/sqld
    networks:
      - dokploy-network
    restart: unless-stopped

volumes:
  libsql-data:

networks:
  dokploy-network:
    external: true
```

### 1.2 Generate Auth Keys (JWT-based)

libSQL Server uses Ed25519 JWT authentication. Generate a keypair:

**Option A: Using Node.js/Bun** (on your local machine)

```js
// save as gen-keys.mjs, run with: node gen-keys.mjs
import * as jose from 'jose';

const keyPair = await crypto.subtle.generateKey(
  { name: 'Ed25519' },
  true,
  ['sign', 'verify']
);

const rawPublicKey = await crypto.subtle.exportKey('raw', keyPair.publicKey);
const urlSafeBase64PublicKey = btoa(
  String.fromCharCode(...new Uint8Array(rawPublicKey))
)
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=+$/, '');

const jwt = await new jose.SignJWT({ a: 'rw' })
  .setProtectedHeader({ alg: 'EdDSA', typ: 'JWT' })
  .setIssuedAt()
  .sign(keyPair.privateKey);

console.log('=== SAVE THESE VALUES ===');
console.log('LIBSQL_PUBLIC_KEY (for server env):\n', urlSafeBase64PublicKey);
console.log('\nLIBSQL_AUTH_TOKEN (for API .env):\n', jwt);
```

> **Important**: Install jose first: `npm install jose` or `bun add jose`

This outputs:
- **Public Key** → set as `SQLD_AUTH_JWT_KEY` env var on the libSQL server in Dokploy
- **JWT Token** → use as `LIBSQL_AUTH_TOKEN` in your API's `.env`

### 1.3 Enable Authentication

After generating keys:
1. In Dokploy → your libSQL compose → **Environment** tab
2. Add: `SQLD_AUTH_JWT_KEY=<your-public-key>`
3. Uncomment the env line in docker-compose and redeploy
4. Update the compose to:

```yaml
    environment:
      - SQLD_NODE=primary
      - SQLD_AUTH_JWT_KEY=${LIBSQL_PUBLIC_KEY}
```

### 1.4 Configure Domain

In Dokploy → your libSQL compose → **Domains** tab:
- Domain: `db.nmqmatch.com`
- Container Port: `8080`
- HTTPS: Enable (Let's Encrypt)

### 1.5 Test Connection

```js
import { createClient } from '@libsql/client';

const client = createClient({
  url: 'https://db.nmqmatch.com',     // or http://YOUR_SERVER_IP:8080
  authToken: '<your-jwt-token>',
});

const result = await client.execute('SELECT 1;');
console.log(result); // { columns: ['1'], rows: [{ '1': 1 }] }
```

### 1.6 Push Database Schema

Once the libSQL server is running and accessible:

```bash
cd packages/db

# Set env vars
export LIBSQL_URL=https://db.nmqmatch.com
export LIBSQL_AUTH_TOKEN=<your-jwt-token>

# Push all 12 tables (4 Better-Auth + 8 custom)
bun run db:push
```

---

## 2. NMQ API Server

### 2.1 Dockerfile

The API uses Bun. Create/verify `apps/api/Dockerfile`:

```dockerfile
FROM oven/bun:1.3 AS base
WORKDIR /app

# Copy workspace package files
COPY package.json bun.lock ./
COPY apps/api/package.json apps/api/
COPY packages/db/package.json packages/db/
COPY packages/shared/package.json packages/shared/

# Install deps
RUN bun install --frozen-lockfile

# Copy source
COPY packages/ packages/
COPY apps/api/ apps/api/

WORKDIR /app/apps/api
EXPOSE 3000
CMD ["bun", "run", "src/index.ts"]
```

### 2.2 Deploy via Dokploy

**Option A: Git Repository** (recommended)
1. In Dokploy → **Create Project** → **Application** → Git
2. Point to your repo, set build path to repo root
3. Set Dockerfile path: `apps/api/Dockerfile`

**Option B: Docker Compose**

```yaml
services:
  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - LIBSQL_URL=http://libsql:8080
      - LIBSQL_AUTH_TOKEN=${LIBSQL_AUTH_TOKEN}
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
      - ALLOWED_ORIGINS=${ALLOWED_ORIGINS}
      - PORT=3000
      - SMTP_HOST=mailpit
      - SMTP_PORT=1025
      - FROM_EMAIL=noreply@nmqmatch.com
    networks:
      - dokploy-network
    restart: unless-stopped
    depends_on:
      - libsql

networks:
  dokploy-network:
    external: true
```

### 2.3 Environment Variables

Set these in Dokploy → Application → **Environment** tab:

| Variable | Value | Notes |
|----------|-------|-------|
| `LIBSQL_URL` | `http://libsql:8080` | Internal Docker network URL (use service name) |
| `LIBSQL_AUTH_TOKEN` | `<jwt-from-step-1.2>` | The JWT token generated earlier |
| `BETTER_AUTH_SECRET` | `<random-32-char-string>` | Generate: `openssl rand -base64 32` |
| `ALLOWED_ORIGINS` | `http://localhost:8081,exp://localhost:8081,https://admin.nmqmatch.com` | CORS origins |
| `PORT` | `3000` | API listen port |
| `SMTP_HOST` | `mailpit` | Internal Docker service name (or `postal` in prod) |
| `SMTP_PORT` | `1025` | Mailpit SMTP port (or `25` for Postal) |
| `FROM_EMAIL` | `noreply@nmqmatch.com` | Sender address for OTP emails |

### 2.4 Configure Domain

In Dokploy → API application → **Domains** tab:
- Domain: `api.nmqmatch.com`
- Container Port: `3000`
- HTTPS: Enable (Let's Encrypt)

---

## 3. Mailpit (Dev Email — OTP Testing)

Mailpit is a lightweight OSS email testing tool. It catches all outgoing emails and displays them in a web UI — perfect for testing OTP codes without a real email provider.

### 3.1 Deploy via Dokploy Docker Compose

```yaml
services:
  mailpit:
    image: axllent/mailpit:latest
    ports:
      - "8025:8025"   # Web UI
      - "1025:1025"   # SMTP
    environment:
      - MP_SMTP_AUTH_ACCEPT_ANY=true
      - MP_SMTP_AUTH_ALLOW_INSECURE=true
    volumes:
      - mailpit-data:/data
    networks:
      - dokploy-network
    restart: unless-stopped

volumes:
  mailpit-data:

networks:
  dokploy-network:
    external: true
```

### 3.2 Configure Domain

- Domain: `mail.nmqmatch.com`
- Container Port: `8025` (web UI)
- HTTPS: Enable

### 3.3 Usage

- **Web UI**: Visit `https://mail.nmqmatch.com` to see all captured emails (including OTP codes)
- **SMTP**: Your API connects to `mailpit:1025` (internal Docker network) to send emails
- All emails are caught by Mailpit — nothing actually leaves the server

### 3.4 Production Email: How OTP Delivery Actually Works

**Key question**: *Can Dokploy alone deliver real OTP emails without a domain or 3rd-party service?*

**Answer: No.** Dokploy is a PaaS/deployment platform — it runs your Docker containers and provides Traefik routing + SSL. It does **not** include an SMTP relay capable of delivering emails to real inboxes. Here's why and what to do:

#### Why Mailpit alone isn't enough for production
- Mailpit **catches** all outgoing emails locally — it never delivers them to actual inboxes
- It's perfect for dev/staging (you view OTP codes at `mail.yourdomain.com`)
- But real users will never receive their OTP codes via Mailpit

#### Option A: Free SMTP Relay (Recommended for MVP — No domain required)

The simplest path. Your API already uses `nodemailer` — just change env vars to point to a real SMTP relay:

| Provider | Free Tier | Domain Required? | Setup |
|----------|-----------|-------------------|-------|
| **Brevo** (ex-Sendinblue) | 300 emails/day | No (uses their domain) | Sign up → SMTP & API → Get SMTP credentials |
| **SendGrid** | 100 emails/day | No (uses their domain) | Sign up → Settings → API Keys → Create SMTP key |
| **Mailgun** | 100 emails/day (trial) | Yes (after trial) | Not recommended for free tier |
| **AWS SES** | 200 emails/day | Yes (sandbox mode first) | More complex setup |

**Brevo is the best free option** — 300 emails/day, no credit card, no domain needed, emails sent from their shared domain.

To switch from Mailpit to Brevo in production, just set these env vars in Dokploy:

```env
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-brevo-login@email.com
SMTP_PASS=your-brevo-smtp-key
FROM_EMAIL=noreply@nmqmatch.com
```

> The API code (`apps/api/src/lib/email.ts`) already supports authenticated SMTP via `SMTP_USER`/`SMTP_PASS` env vars. **Zero code changes needed** — just update env vars.

#### Option B: Self-Hosted Postal (Advanced — Requires domain + DNS)

For full control over email delivery with your own domain:

```yaml
# See https://docs.postalserver.io/install/docker for full setup
# Postal requires:
# - A domain with DNS access (MX, SPF, DKIM, DMARC records)
# - A dedicated IP (ideally not shared hosting)
# - DNS propagation time (24-48h)
# This is optional — Option A is simpler and sufficient for MVP
```

#### Recommended Deployment Strategy

| Stage | Email Solution | OTP Viewing |
|-------|---------------|-------------|
| **Dev (local)** | Mailpit on localhost | `http://localhost:8025` |
| **Staging (Dokploy)** | Mailpit on Dokploy | `https://mail.nmqmatch.com` |
| **Production (Dokploy)** | Brevo free SMTP relay | Real inbox delivery |

The transition requires **only env var changes** — no code modifications.

---

## 4. Admin Dashboard (New)

A Next.js application for viewing MVP metrics and managing registrations.

### 4.1 Tech Stack

- **Next.js 15** (App Router) + React 19
- **TailwindCSS v4** + **shadcn/ui** for UI components
- **@libsql/client** — direct connection to libSQL for read queries
- **Recharts** or **tremor** for charts/graphs
- **Better-Auth** admin session (reuse the same auth system)

### 4.2 Dashboard Pages & Metrics

| Page | Metrics |
|------|---------|
| **Overview** | Total users, companies, matches, messages. Daily/weekly trends. |
| **Registrations** | New users over time, email domains breakdown, onboarding completion funnel |
| **Companies** | Profiles created, industry breakdown, verification status, avg offerings/needs count |
| **Swipe Activity** | Total swipes, right/left/super ratio, swipes per user per day, peak hours |
| **Matches** | Match rate (swipes → matches), matches over time, avg time to first message |
| **Messages** | Messages sent over time, avg messages per match, active conversations |
| **OTP & Auth** | OTP requests, verification success rate, failed attempts, active sessions |
| **Funnel** | Registration → Profile → First Swipe → First Match → First Message → Meeting Scheduled |

### 4.3 Dockerfile

```dockerfile
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY apps/dashboard/package.json apps/dashboard/package-lock.json* ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY apps/dashboard/ .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3001
CMD ["node", "server.js"]
```

### 4.4 Deploy on Dokploy

Same pattern as the API — either Git-based or Docker Compose.

Domain: `admin.nmqmatch.com` → Container Port `3001`

---

## 5. Plausible Analytics (Usage Tracking)

Privacy-friendly, OSS analytics for tracking app/web usage patterns.

### 5.1 Deploy via Dokploy Docker Compose

```yaml
services:
  plausible:
    image: ghcr.io/plausible/community-edition:v2.1
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgres://plausible:plausible@plausible-db:5432/plausible
      - BASE_URL=https://stats.nmqmatch.com
      - SECRET_KEY_BASE=<generate-with-openssl-rand-base64-48>
      - TOTP_VAULT_KEY=<generate-with-openssl-rand-base64-32>
      - DISABLE_REGISTRATION=invite_only
    networks:
      - dokploy-network
    depends_on:
      - plausible-db
      - plausible-events-db
    restart: unless-stopped

  plausible-db:
    image: postgres:17-alpine
    environment:
      - POSTGRES_PASSWORD=plausible
      - POSTGRES_USER=plausible
      - POSTGRES_DB=plausible
    volumes:
      - plausible-pg-data:/var/lib/postgresql/data
    networks:
      - dokploy-network
    restart: unless-stopped

  plausible-events-db:
    image: clickhouse/clickhouse-server:24.8-alpine
    volumes:
      - plausible-ch-data:/var/lib/clickhouse
    networks:
      - dokploy-network
    restart: unless-stopped

volumes:
  plausible-pg-data:
  plausible-ch-data:

networks:
  dokploy-network:
    external: true
```

### 5.2 Configure Domain

- Domain: `stats.nmqmatch.com`
- Container Port: `8000`
- HTTPS: Enable

### 5.3 Integrate with Mobile App

Add the Plausible script to admin dashboard, and use the Plausible Events API to track mobile app events:

```typescript
// In mobile app — track key events via Plausible Events API
async function trackEvent(name: string, props?: Record<string, string>) {
  try {
    await fetch('https://stats.nmqmatch.com/api/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        domain: 'app.nmqmatch.com',
        name,
        url: `app://nmqmatch/${name}`,
        props,
      }),
    });
  } catch {
    // Silent fail — analytics should never break the app
  }
}
```

---

## 6. Full Docker Compose (All Services)

For deploying everything together on Dokploy:

```yaml
services:
  # ---- Database ----
  libsql:
    image: ghcr.io/tursodatabase/libsql-server:latest
    platform: linux/amd64
    environment:
      - SQLD_NODE=primary
      - SQLD_AUTH_JWT_KEY=${LIBSQL_PUBLIC_KEY}
    volumes:
      - libsql-data:/var/lib/sqld
    networks:
      - dokploy-network
    restart: unless-stopped

  # ---- API ----
  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    environment:
      - LIBSQL_URL=http://libsql:8080
      - LIBSQL_AUTH_TOKEN=${LIBSQL_AUTH_TOKEN}
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
      - ALLOWED_ORIGINS=${ALLOWED_ORIGINS}
      - PORT=3000
      - SMTP_HOST=mailpit
      - SMTP_PORT=1025
      - FROM_EMAIL=noreply@nmqmatch.com
    networks:
      - dokploy-network
    depends_on:
      - libsql
    restart: unless-stopped

  # ---- Admin Dashboard ----
  dashboard:
    build:
      context: .
      dockerfile: apps/dashboard/Dockerfile
    environment:
      - LIBSQL_URL=http://libsql:8080
      - LIBSQL_AUTH_TOKEN=${LIBSQL_AUTH_TOKEN}
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
      - NEXTAUTH_URL=https://admin.nmqmatch.com
    networks:
      - dokploy-network
    depends_on:
      - libsql
    restart: unless-stopped

  # ---- Dev Email ----
  mailpit:
    image: axllent/mailpit:latest
    environment:
      - MP_SMTP_AUTH_ACCEPT_ANY=true
      - MP_SMTP_AUTH_ALLOW_INSECURE=true
    volumes:
      - mailpit-data:/data
    networks:
      - dokploy-network
    restart: unless-stopped

volumes:
  libsql-data:
  mailpit-data:

networks:
  dokploy-network:
    external: true
```

Then configure domains for each service in the Dokploy UI (Domains tab):
- `libsql` → `db.nmqmatch.com:8080`
- `api` → `api.nmqmatch.com:3000`
- `dashboard` → `admin.nmqmatch.com:3001`
- `mailpit` → `mail.nmqmatch.com:8025`

---

## 7. Environment Variable Reference

### API Server (`apps/api/.env`)

```env
# Database (self-hosted libSQL Server)
LIBSQL_URL=http://libsql:8080
LIBSQL_AUTH_TOKEN=<jwt-from-keygen>

# Auth
BETTER_AUTH_SECRET=<openssl-rand-base64-32>
ALLOWED_ORIGINS=http://localhost:8081,exp://localhost:8081,https://admin.nmqmatch.com

# Server
PORT=3000

# Email (SMTP — Mailpit for dev, Postal/relay for prod)
SMTP_HOST=mailpit
SMTP_PORT=1025
FROM_EMAIL=noreply@nmqmatch.com
```

### Admin Dashboard (`apps/dashboard/.env`)

```env
LIBSQL_URL=http://libsql:8080
LIBSQL_AUTH_TOKEN=<same-jwt>
BETTER_AUTH_SECRET=<same-secret>
NEXTAUTH_URL=https://admin.nmqmatch.com
```

---

## 8. Security Checklist

- [ ] libSQL Server secured with JWT auth (SQLD_AUTH_JWT_KEY set)
- [ ] All domains use HTTPS (Let's Encrypt via Dokploy/Traefik)
- [ ] API CORS restricted to known origins
- [ ] Admin dashboard behind authentication (Better-Auth admin role)
- [ ] Mailpit web UI not publicly accessible in production (remove domain or add basic auth)
- [ ] Regular database backups (volume snapshots or cron dump)
- [ ] Plausible registration disabled for public (invite_only)
- [ ] Environment secrets stored in Dokploy env vars (never in git)

---

## 9. Backup Strategy

### libSQL Database

```bash
# Option 1: Volume snapshot (via Dokploy)
# Dokploy supports volume backups — configure in Settings

# Option 2: Manual dump via API
curl -X POST https://db.nmqmatch.com/v1/execute \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"statements": [".dump"]}' > backup.sql

# Option 3: Copy the SQLite file directly from the volume
docker cp <container>:/var/lib/sqld/iku.db ./backup-$(date +%Y%m%d).db
```

---

## 10. Local Development

For local development, run libSQL and Mailpit locally:

```bash
# Start libSQL locally (no auth, for dev only)
docker run -d --name libsql-dev -p 8080:8080 \
  -v ./data/libsql:/var/lib/sqld \
  ghcr.io/tursodatabase/libsql-server:latest

# Start Mailpit locally
docker run -d --name mailpit-dev -p 8025:8025 -p 1025:1025 \
  axllent/mailpit:latest

# Set env vars
export LIBSQL_URL=http://localhost:8080
export LIBSQL_AUTH_TOKEN=  # empty for local dev without auth

# Push schema
cd packages/db && bun run db:push

# Start API
cd apps/api && bun run dev

# View OTP emails at http://localhost:8025
```
