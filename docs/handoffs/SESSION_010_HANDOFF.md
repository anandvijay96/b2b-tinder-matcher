# Session 010 Handoff — NMQ B2B Match

## Session Summary
Phase 7 kickoff session: fixed EAS build failure (committed missing PNG assets), added working company logo upload via `expo-image-picker`, restructured the project into a Turborepo monorepo, and scaffolded the full API stack (Hono + tRPC + Better-Auth + Drizzle) in `apps/api/` along with shared Zod schemas in `packages/shared/` and the complete Drizzle schema in `packages/db/`.

---

## Completed This Session

### 1. EAS Build Fix
**Problem**: EAS cloud builds from git HEAD — all PNG asset files were untracked, causing `ENOENT` during Android prebuild.

**Fix**:
- Staged and committed all 4 PNG assets: `icon.png`, `splash-icon.png`, `adaptive-icon.png`, `favicon.png`
- Added generic learning to `docs/AI_AGENT_DEV_PROTOCOL.md` § 6.9 (EAS build: missing asset files)

### 2. Company Logo Upload (`expo-image-picker`)
**Files changed**:
- `apps/mobile/package.json` — added `expo-image-picker: ~16.1.4`
- `apps/mobile/app.json` — added `expo-image-picker` plugin with custom photos permission string
- `apps/mobile/app/(auth)/onboarding/step4.tsx`
  - Added `handlePickLogo()`: requests media library permission → launches square-crop image picker
  - Logo preview renders the selected image in the upload button (replaces `+` placeholder)
  - "Change Logo" + "Remove" buttons appear once a logo is selected
  - URI stored in `draft.logoUrl` via `updateDraft()` — passed through to `companyService.createCompany` as before

### 3. Turborepo Monorepo Restructure
**Old root → New `apps/mobile/`** — all Expo app directories and config files moved:
```
apps/mobile/
  app/          (Expo Router screens)
  assets/
  components/
  constants/
  hooks/
  models/
  services/
  stores/
  app.json
  babel.config.js
  metro.config.js
  tailwind.config.js
  tsconfig.json   ← paths: @/* → ./* (still works, relative to apps/mobile/)
  package.json    ← name changed to @nmq/mobile
  eas.json
  global.css
  nativewind-env.d.ts
```

**New root-level files**:
- `package.json` — npm workspace root: `workspaces: ["apps/*", "packages/*"]`
- `turbo.json` — Turborepo task pipeline (build, dev, lint, db:*)
- `.gitignore` — updated with turbo cache, API dist, API .env
- `.dockerignore` — excludes mobile app from Docker build context
- `docker-compose.prod.yml` — Cloud Run production deployment template

### 4. `packages/shared/` — Zod v3 Schemas
> Note: Uses Zod v3 (not v4) for compatibility with drizzle-orm, better-auth, @trpc/server adapters.

Schemas created:
- `schemas/auth.ts` — `requestOtpSchema`, `verifyOtpSchema`, `sessionSchema`
- `schemas/company.ts` — `createCompanySchema`, `updateCompanySchema`, `companyProfileSchema` + enums
- `schemas/match.ts` — `recordSwipeSchema`, `matchSchema`, `matchListItemSchema`
- `schemas/message.ts` — `sendMessageSchema`, `messageSchema`
- `schemas/scheduling.ts` — `proposeMeetingSchema`, `respondMeetingSchema`, `meetingSlotSchema`

### 5. `packages/db/` — Drizzle Schema (libSQL/Turso)
All 8 tables defined as `sqliteTable`:
- `companies` — full profile, verification status, embedding vector placeholder
- `users` — email, role, companyId FK, pushToken
- `intents` — offerings/needs per company, tags as JSON text
- `matches` — double-opt-in, status enum, matchScore, matchReasons JSON
- `messages` — chat messages with messageType enum, metadata JSON, readAt
- `meeting_slots` — slots JSON array, selectedSlot, status, durationMinutes, timezone
- `swipe_actions` — swiper/target company FK, action enum (like/pass/super_like)
- `verification_requests` — document URLs JSON, review workflow

Files: `src/schema/*.ts`, `src/index.ts` (barrel), `drizzle.config.ts`, `src/migrations/.gitkeep`

### 6. `apps/api/` — Hono + tRPC + Better-Auth
**Entry**: `src/index.ts` — Hono app with CORS, logger, Better-Auth routes at `/api/auth/**`, tRPC at `/trpc/*`, `/health` endpoint

**Auth** (`src/lib/auth.ts`):
- Better-Auth v1 with `drizzleAdapter` (sqlite provider)
- `emailOTP` plugin: 6-digit, 5-min expiry, `console.log` stub → replace with Resend/SendGrid in next session
- `BETTER_AUTH_SECRET` env var required

**Database** (`src/lib/db.ts`):
- `@libsql/client` + `drizzle-orm/libsql`
- `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN` env vars

**tRPC** (`src/lib/trpc.ts`):
- `createContext` reads Better-Auth session from request headers
- `publicProcedure` — open
- `protectedProcedure` — throws `UNAUTHORIZED` if no session

**Routers** (`src/routers/`):
- `auth` — `requestOtp`, `verifyOtp`, `signOut`, `getSession`
- `company` — `getMyCompany`, `getById`, `create`, `update`, `getCandidates` (TODO: Phase 8 vector search)
- `match` — `listMatches`, `getById`, `recordSwipe` (auto-creates match on mutual like), `updateStatus`
- `message` — `listByMatch`, `send`, `markRead`
- `scheduling` — `listByMatch`, `propose`, `respond`, `cancel`

**Infrastructure**:
- `Dockerfile` — Bun 1.2 image, builds from monorepo root context (per AADP § 6.1)
- `docker-compose.prod.yml` — at repo root, env-var driven
- `.dockerignore` — excludes `apps/mobile/` (per AADP § 6.6)
- `.env.example` — documents all required env vars

---

## Git Commits
1. `f5e5660c` — `chore: Phase 7 monorepo setup (Turborepo + apps/api + packages/shared + packages/db)`
2. `ed2c26bd` — `fix: commit app assets for EAS build + add expo-image-picker for logo upload`

---

## Known Issues / Notes

### Lint errors in apps/api/ (EXPECTED — pre-install)
All TypeScript errors in `apps/api/src/**` are unresolved module errors (`@trpc/server`, `drizzle-orm`, `@nmq/db`, etc.). These are **false positives** — the IDE's TS server cannot resolve workspace packages until dependencies are installed inside `apps/api/` separately (Bun installs them independently from npm).

**To resolve**: Run `bun install` inside `apps/api/` after installing Bun.

### Running the mobile app after monorepo restructure
```bash
cd apps/mobile
npm start   # or: npx expo start
```
The mobile app still uses npm and node_modules hoisted to the repo root by the npm workspace.

### Mobile `@/*` path alias
Still works — `tsconfig.json` in `apps/mobile/` maps `@/*` to `./*` (relative to itself).

### package-lock.json
The root `package-lock.json` was regenerated by the workspace install. It covers all workspaces except `apps/api/` (which uses Bun).

---

## What's Next: Phase 7 Continued (Session 011)

### Priority Tasks
1. **Install API deps with Bun** — run `bun install` inside `apps/api/` to resolve all TS errors
2. **Better-Auth DB migration** — Better-Auth needs its own tables (`user`, `session`, `account`, `verification`). Run:
   ```bash
   # Inside apps/api/
   bun run node -e "import('./src/lib/auth.ts').then(m => m.auth.api.generateSchema())"
   ```
   Or use Better-Auth CLI: `bunx @better-auth/cli generate`
3. **Wire email OTP** — replace `console.log` in `auth.ts` with a real email provider (Resend is the easiest integration with Better-Auth)
4. **Drizzle migrations** — run `bun run db:push` from `apps/api/` to create all 8 tables in Turso
5. **tRPC client in mobile** — add `@trpc/client` + `@trpc/react-query` to mobile app, create `services/trpcClient.ts`
6. **Replace first mock service** — start with `authService.ts` → replace with tRPC `auth.requestOtp` + `auth.verifyOtp`

### Blockers Before Starting
- Need a Turso database: `turso db create nmq-b2b-match` (requires Turso CLI + account)
- Need `BETTER_AUTH_SECRET`: generate with `openssl rand -base64 32`
- Need an email provider API key (Resend recommended — free tier: 3000 emails/month)

---

## Next Session Prompt
```
Read SESSION_010_HANDOFF.md and GRANDPLAN.md.

Monorepo is set up. Phase 7 structure is ready:
- apps/mobile/ — Expo app (npm workspace)
- apps/api/ — Hono + tRPC + Better-Auth + Drizzle (Bun)
- packages/shared/ — Zod v3 schemas
- packages/db/ — Drizzle schema (8 tables for libSQL/Turso)

Tasks for this session:
1. Set up Turso DB: `turso db create nmq-b2b-match` (user does this manually and provides URL + token)
2. Install API deps: `cd apps/api && bun install`
3. Run Better-Auth schema generation to create auth tables
4. Run Drizzle push: `bun run db:push` to create all 8 tables
5. Wire Resend (or console.log stub) for email OTP in apps/api/src/lib/auth.ts
6. Add tRPC client to mobile: install @trpc/client, @trpc/react-query, @tanstack/react-query
7. Create apps/mobile/services/trpcClient.ts
8. Replace authService.ts mock with real tRPC auth calls (requestOtp + verifyOtp)
9. Update login.tsx to use real OTP flow
10. Commit: feat: tRPC auth integration (email OTP)

Pinned versions — DO NOT upgrade:
- expo ~54.0.30, expo-router ~6.0.21, react 19.1.0, react-native 0.81.5
- nativewind ^4.2.1, tailwindcss ^3.4.19, zustand ^5.0.9, typescript ~5.9.2
```
