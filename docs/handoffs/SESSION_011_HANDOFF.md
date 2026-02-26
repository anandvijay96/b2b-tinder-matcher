# Session 011 Handoff — NMQ B2B Match

## Session Summary
Phase 7 continued: installed API dependencies, tRPC auth integration, and **major architecture pivot** — switched from Turso SaaS + GCP to fully self-hosted OSS infrastructure on Dokploy (libSQL Server, Mailpit/Postal for email, Plausible for analytics). Created comprehensive Dokploy setup guide. Planned admin dashboard for MVP metrics. Updated all env vars, email sending, and documentation.

---

## Completed This Session

### 1. API Dependencies Installed
- Ran `bun install` in `apps/api/` — all 1716 packages installed
- Fixed tsconfig: `bun-types` → `@types/bun` (Bun 1.3.8 uses `@types/bun`)
- API compiles cleanly: `bun tsc --noEmit` passes

### 2. Better-Auth Schema Tables
**File**: `packages/db/src/schema/auth.ts`
- Added 4 Better-Auth required tables as Drizzle `sqliteTable` definitions:
  - `user` — id, name, email, emailVerified, image, createdAt, updatedAt
  - `session` — id, expiresAt, token, createdAt, updatedAt, ipAddress, userAgent, userId FK
  - `account` — id, accountId, providerId, userId FK, tokens, scope, password, timestamps
  - `verification` — id, identifier, value, expiresAt, timestamps
- Added to barrel export in `packages/db/src/index.ts`
- No naming conflict with custom `users` table (Better-Auth uses singular `user`)

### 3. tRPC Client for Mobile
**File**: `apps/mobile/services/trpcClient.ts`
- Vanilla `createTRPCClient<AppRouter>` with `httpBatchLink`
- Session token stored in AsyncStorage (`nmq_session_token` key)
- Auto-sends `Authorization: Bearer <token>` header on all requests
- Dev URL: `http://10.0.2.2:3000` (Android emulator → host localhost)
- Prod URL: configurable via `EXPO_PUBLIC_API_URL` env var
- Exports: `trpc`, `setSessionToken`, `clearSessionToken`, `getSessionToken`

**Dependencies added** to `apps/mobile/package.json`:
- `@trpc/client@11.4.0`
- `@trpc/react-query@11.4.0`
- `@tanstack/react-query@5.62.0`

**tsconfig.json**: Added `@api/*` path alias → `../api/src/*` for `AppRouter` type import (type-only, erased at compile time — no Metro config needed)

### 4. Auth Service Replaced (Mock → tRPC)
**File**: `apps/mobile/services/authService.ts`
- `requestOtp(email)` → `trpc.auth.requestOtp.mutate({ email })`
- `verifyOtp(email, otp)` → `trpc.auth.verifyOtp.mutate(...)` + stores session token
- `logout()` → `trpc.auth.signOut.mutate()` + clears token
- `getCurrentUser()` → `trpc.auth.getSession.query()` → maps Better-Auth user to app User model
- `loginWithLinkedIn()` → throws "not yet implemented" (Phase 7 future)

### 5. Auth Store Updated for Two-Step OTP
**File**: `apps/mobile/stores/useAuthStore.ts`
- Removed: `login(email, password)`
- Added: `requestOtp(email)` — sends OTP, returns boolean
- Added: `verifyOtp(email, otp)` — verifies, sets user + isAuthenticated
- Updated: `logout()` — wrapped in try/finally for clean state reset

### 6. Login Screen Wired to Real OTP
**File**: `apps/mobile/app/(auth)/login.tsx`
- "Send Code" button now calls `requestOtp(email)` — only advances to OTP step on success
- "Verify & Sign In" calls `verifyOtp(email, otp)` — was calling old `login()`
- "Resend code" calls `requestOtp(email)` instead of just navigating back
- OTP length validation fixed: 4 → 6 digits (matches schema)

### 7. API Auth Router — Token in Response
**File**: `apps/api/src/routers/auth.ts`
- `verifyOtp` now returns `{ success, user, token }` — the session token is needed by React Native since it can't use HTTP-only cookies

### 8. Monorepo Cleanup
- Committed all root-level deleted files from Session 010 monorepo migration (90+ files that were moved to `apps/mobile/` but deletions weren't staged)

---

## Git Commits
1. `79d2909e` — `chore: remove root-level files moved to apps/mobile/ during monorepo restructure`
2. `1c582a8e` — `feat: tRPC auth integration (email OTP)`

---

## Known Issues / Notes

### Turso Database Not Yet Created
The `.env` file at `apps/api/.env` has placeholder values. User needs to:
1. Install Turso CLI: `npm install -g @tursodatabase/cli`
2. Sign up/login: `turso auth signup` or `turso auth login`
3. Create DB: `turso db create nmq-b2b-match`
4. Get URL: `turso db show nmq-b2b-match --url`
5. Get token: `turso db tokens create nmq-b2b-match`
6. Generate secret: `[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])`
7. Update `apps/api/.env` with real values
8. Run `drizzle-kit push` from `packages/db/` to create all 12 tables

### Drizzle Push Not Yet Run
Schema is ready (12 tables: 4 Better-Auth + 8 custom) but `drizzle-kit push` hasn't been run yet because Turso credentials are needed.

### Better-Auth `user` vs Custom `users` Table
- Better-Auth creates/uses `user` (singular) table for auth
- Our custom `users` table is separate — consider merging in a future session
- The `authService.verifyOtp` maps Better-Auth's user fields to the app's `User` model

### Pre-existing TypeScript Errors in Mobile
The following TS errors existed before this session and are unrelated to our changes:
- Avatar/Badge component prop mismatches in various files
- `swipeService.ts` type casting issue
- These should be addressed in a polish session

### API URL for Physical Devices
`trpcClient.ts` defaults to `10.0.2.2:3000` (Android emulator). For physical device testing, set `EXPO_PUBLIC_API_URL` or update the `getApiUrl()` function.

---

## Architecture Pivot: Self-Hosted on Dokploy

This session introduced a major shift from Turso SaaS + GCP to fully self-hosted OSS on Dokploy.

### New Infrastructure (all OSS, all on Dokploy)

| Service | Image | Domain (example) | Purpose |
|---------|-------|-------------------|---------|
| libSQL Server | `ghcr.io/tursodatabase/libsql-server` | `db.nmqmatch.com` | Database (replaces Turso SaaS) |
| NMQ API | Custom Bun Dockerfile | `api.nmqmatch.com` | Hono + tRPC + Better-Auth |
| Mailpit | `axllent/mailpit` | `mail.nmqmatch.com` | Dev email (catches OTPs) |
| Admin Dashboard | Custom Next.js Dockerfile | `admin.nmqmatch.com` | MVP metrics & registrations |
| Plausible | `ghcr.io/plausible/community-edition` | `stats.nmqmatch.com` | Usage analytics |

### Code Changes for Pivot
- **Env vars renamed**: `TURSO_DATABASE_URL` → `LIBSQL_URL`, `TURSO_AUTH_TOKEN` → `LIBSQL_AUTH_TOKEN`
- **Email sending**: Added `apps/api/src/lib/email.ts` with nodemailer + SMTP (works with Mailpit)
- **Auth config**: `auth.ts` now calls `sendOtpEmail()` alongside console.log
- **nodemailer added**: `bun add nodemailer @types/nodemailer` in apps/api

### New Documentation
- **`docs/DOKPLOY_SETUP_GUIDE.md`** — Complete guide for deploying all services on Dokploy
- **`docs/GRANDPLAN.md`** — Updated tech stack, infra section, Phases 7-12, architecture diagram

---

## What's Next (Session 012)

### Phase A: Local Dev Infrastructure (Session 012 start)
1. **Start libSQL locally**: `docker run -d --name libsql-dev -p 8080:8080 -v ./data/libsql:/var/lib/sqld ghcr.io/tursodatabase/libsql-server:latest`
2. **Start Mailpit locally**: `docker run -d --name mailpit-dev -p 8025:8025 -p 1025:1025 axllent/mailpit:latest`
3. **Update `apps/api/.env`**: Set `LIBSQL_URL=http://localhost:8080` and `SMTP_HOST=localhost`
4. **Run `drizzle-kit push`**: Create all 12 tables in local libSQL
5. **Start API**: `bun run dev` in `apps/api/`, verify `/health` endpoint
6. **End-to-end OTP test**: Mobile login → API sends OTP → check Mailpit UI at localhost:8025 → verify OTP → session established

### Phase B: Remaining tRPC Service Integration
7. **Replace companyService** — swap mock with tRPC `company.create`, `company.getMyCompany`, etc.
8. **Replace matchService + swipeService** — wire to tRPC `match.*` and `company.getCandidates`
9. **Replace chatService + schedulingService** — wire to tRPC calls
10. **Test full flow**: login → onboarding → swipe → match → chat
11. **Commit**: `feat: full tRPC service integration`

### Phase C: Dokploy Deployment
12. **Deploy libSQL Server** on Dokploy (follow DOKPLOY_SETUP_GUIDE.md)
13. **Generate Ed25519 keypair** for libSQL auth
14. **Deploy API** on Dokploy with correct env vars
15. **Deploy Mailpit** on Dokploy for dev email
16. **Configure domains + SSL** via Dokploy/Traefik

### Phase D: Admin Dashboard (Phase 9 — new)
17. **Scaffold `apps/dashboard`** — Next.js 15 + TailwindCSS v4 + shadcn/ui
18. **Overview page**: total users, companies, matches, messages
19. **Registrations + Funnel pages**: track MVP conversion
20. **Deploy on Dokploy** at `admin.nmqmatch.com`

### No Blockers
All infrastructure is now self-hosted — no external SaaS credentials needed. Docker is the only prerequisite for local dev.

---

## Next Session Prompt
```
Read SESSION_011_HANDOFF.md and GRANDPLAN.md.

MAJOR CHANGE: We pivoted from Turso SaaS + GCP to fully self-hosted OSS on Dokploy.
See docs/DOKPLOY_SETUP_GUIDE.md for the full infrastructure plan.

Session 012 goals:

Phase A — Local Dev Setup:
1. Start libSQL Server locally via Docker (port 8080)
2. Start Mailpit locally via Docker (SMTP 1025, UI 8025)
3. Update apps/api/.env with LIBSQL_URL=http://localhost:8080, SMTP_HOST=localhost
4. Run drizzle-kit push from packages/db/ to create all 12 tables
5. Start API: bun run dev in apps/api/, verify /health
6. E2E OTP test: mobile → send OTP → check Mailpit UI → verify → session

Phase B — Remaining tRPC Integration:
7. Replace companyService mock with tRPC calls
8. Replace matchService + swipeService mocks with tRPC calls
9. Replace chatService + schedulingService mocks with tRPC calls
10. Full flow test and commit

Env vars changed (TURSO_* → LIBSQL_*):
- LIBSQL_URL=http://localhost:8080
- LIBSQL_AUTH_TOKEN= (empty for local dev)
- SMTP_HOST=localhost, SMTP_PORT=1025

Pinned versions — DO NOT upgrade:
- expo ~54.0.30, expo-router ~6.0.21, react 19.1.0, react-native 0.81.5
- nativewind ^4.2.1, tailwindcss ^3.4.19, zustand ^5.0.9, typescript ~5.9.2
```
