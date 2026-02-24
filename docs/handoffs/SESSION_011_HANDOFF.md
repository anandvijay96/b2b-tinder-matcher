# Session 011 Handoff — NMQ B2B Match

## Session Summary
Phase 7 continued: installed API dependencies with Bun, added Better-Auth table definitions to Drizzle schema, created tRPC client for mobile, replaced mock authService with real tRPC auth calls (requestOtp + verifyOtp), updated login flow for two-step email OTP, fixed API tsconfig, and cleaned up root-level files left over from the monorepo migration.

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

## What's Next: Phase 7 Continued (Session 012)

### Priority Tasks
1. **Turso DB setup** — create database, get credentials, update `.env`
2. **Drizzle push** — run `drizzle-kit push` to create all 12 tables
3. **Start API server** — `bun run dev` in `apps/api/`, verify `/health` endpoint
4. **End-to-end OTP test** — send OTP from mobile → check API console.log → verify OTP → confirm session
5. **Replace companyService** — swap mock with tRPC `company.create`, `company.getMyCompany`, etc.
6. **Replace matchService / swipeService** — wire to tRPC `match.*` and `company.getCandidates`
7. **Wire Resend for email** — replace console.log OTP stub with real Resend integration (optional, console.log works for dev)

### Blockers
- Turso database credentials (required for DB push and API startup)
- For production email: Resend API key (optional — console.log stub works for development)

---

## Next Session Prompt
```
Read SESSION_011_HANDOFF.md and GRANDPLAN.md.

Phase 7 tRPC auth integration is done. Code changes committed.
Remaining for this phase:

1. I have Turso credentials — update apps/api/.env with real values
2. Run drizzle-kit push to create all 12 tables (4 Better-Auth + 8 custom)
3. Start API: bun run dev in apps/api/
4. End-to-end test: mobile login → OTP → verify → session
5. Replace companyService mock with tRPC calls
6. Replace matchService + swipeService mocks with tRPC calls
7. Replace chatService + schedulingService mocks with tRPC calls
8. Test full flow: login → onboarding → swipe → match → chat
9. Commit: feat: full tRPC service integration

Pinned versions — DO NOT upgrade:
- expo ~54.0.30, expo-router ~6.0.21, react 19.1.0, react-native 0.81.5
- nativewind ^4.2.1, tailwindcss ^3.4.19, zustand ^5.0.9, typescript ~5.9.2
```
