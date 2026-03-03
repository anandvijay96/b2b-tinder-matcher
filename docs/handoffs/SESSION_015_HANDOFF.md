# SESSION 015 HANDOFF — SwipeCard UX Fix, Demo Onboarding, Production Deployment Config

**Date**: Mar 2, 2026  
**Duration**: ~1 hour  
**Objective**: Fix swipe card tap conflict, add demo onboarding flow, production-ready docker-compose + email/OTP guide  
**Status**: ✅ COMPLETE

---

## What Was Done

### 1. SwipeCard "View Full Profile" Button
**Problem**: Users couldn't tell where to tap to expand company details. The PanResponder swipe gestures consumed the entire card surface, making tap hotspots invisible and conflicting with swipe detection.

**Solution**: Added a visible "View Full Profile" button at the bottom of the SwipeCard (only on the top card). Uses `ChevronUp` icon + `Pressable` with a clear `bg-primary/10` background.

**Files Modified**:
- `apps/mobile/components/features/SwipeCard.tsx` — Added `onViewDetails` prop + Pressable button
- `apps/mobile/app/(tabs)/index.tsx` — Wired `onViewDetails` callback to open CompanyExpandModal

**Behavior**:
- The button only renders on the top (swipeable) card (`isTopCard && onViewDetails`)
- Tapping the button opens the full CompanyExpandModal (scrollable detail view)
- The existing tap-on-card behavior via PanResponder still works as a secondary gesture
- Swipe gestures are unaffected — button has a small `hitSlop` and doesn't conflict

### 2. Demo Mode: First-Time User Onboarding Flow
**Problem**: "Skip Login (Demo)" bypassed both authentication AND the 4-step company profile onboarding. First-time demo users never experienced the sign-up flow.

**Solution**: Split the single demo button into two options:

| Button | What it does |
|--------|-------------|
| **Demo (New User)** | Sets auth only → redirects to onboarding step 1 (company basics → offerings → deal prefs → review & submit) |
| **Skip to App (Demo)** | Sets auth + completes onboarding with mock company data → goes straight to swipe deck |

**How it works**: The root layout (`_layout.tsx`) already has auth-gated navigation:
- `isAuthenticated && !hasCompletedOnboarding` → redirect to onboarding
- `isAuthenticated && hasCompletedOnboarding` → redirect to tabs

"Demo (New User)" only calls `devBypass()` (sets `isAuthenticated = true`) without calling `completeOnboarding()`, so the nav guard redirects to onboarding.

**File Modified**: `apps/mobile/app/(auth)/login.tsx`

### 3. Production Docker Compose (Complete Rewrite)
**Problems found in old `docker-compose.prod.yml`**:
- ❌ Used `TURSO_DATABASE_URL`/`TURSO_AUTH_TOKEN` (wrong env var names — should be `LIBSQL_URL`/`LIBSQL_AUTH_TOKEN`)
- ❌ Missing libSQL server service (API had no database to connect to)
- ❌ Missing Mailpit/email service (OTP emails couldn't be sent)
- ❌ Missing SMTP env vars (`SMTP_HOST`, `SMTP_PORT`, `FROM_EMAIL`)
- ❌ No Docker network config (services couldn't communicate)
- ❌ No health checks or service dependencies
- ❌ No `bun.lock` in Dockerfile (non-reproducible builds)

**Solution**: Complete rewrite with:
- **3 services**: libSQL, API, Mailpit — all on `dokploy-network`
- **Health checks** on libSQL and API with proper `start_period`
- **`depends_on` with `condition: service_healthy`** — API waits for DB
- **All SMTP env vars** with defaults (Mailpit for dev, overridable for prod)
- **Dockerfile fix**: added `bun.lock` copy + `--frozen-lockfile`

**Files Modified**:
- `docker-compose.prod.yml` — Complete rewrite
- `apps/api/Dockerfile` — Added `bun.lock` + `--frozen-lockfile`

### 4. Production Email/OTP Documentation
**User Question**: "Can we implement OTP features just by having a Dokploy server? Shouldn't we use a 3rd-party service like SendGrid?"

**Answer**: Dokploy is a PaaS — it runs containers but doesn't include an SMTP relay. For production OTP delivery:
- **Mailpit** catches emails locally (dev/staging only)
- **Brevo** (free tier: 300 emails/day, no credit card, no domain needed) is the recommended production solution
- The API code already supports `SMTP_USER`/`SMTP_PASS` — zero code changes needed, just update env vars

**Files Modified**:
- `docs/DOKPLOY_SETUP_GUIDE.md` — New section 3.4 with provider comparison table, Brevo setup, deployment strategy
- `.env.example` — New file with all env vars documented (includes Brevo/SendGrid examples)

### 5. Badge `neutral` Variant — Already Fixed
The `Badge.tsx` component already has `neutral` in its `BadgeVariant` type and both `variantContainer`/`variantText` maps. No changes needed.

---

## GRANDPLAN Completion Analysis

### Overall: **82/149 tasks = ~55% complete**

| Phase | Tasks | Done | % |
|-------|-------|------|---|
| 0: Foundation | 15 | 15 | 100% |
| 1: Auth & Onboarding | 14 | 14 | 100% |
| 2: Swipe Deck | 18 | 17 | 94% |
| 3: Matching | 10 | 9 | 90% |
| 4: Chat | 11 | 8 | 73% |
| 5: Scheduler | 8 | 5 | 63% |
| 6: Push Notifications | 7 | 5 | 71% |
| 7: Backend Integration | 11 | 9 | 82% |
| **Core MVP (0–7)** | **94** | **82** | **87%** |
| 8: AI Matching | 10 | 0 | 0% |
| 9: Admin Dashboard | 16 | 0 | 0% |
| 10: Real-Time Chat | 5 | 0 | 0% |
| 11: Polish & Testing | 11 | 0 | 0% |
| 12: Monetization | 13 | 0 | 0% |

### Remaining Core MVP Tasks (12 items):
- **2.17** Unit tests for swipe logic
- **3.5** Match detail screen
- **4.6** Typing indicator (UI only)
- **4.9** File attachment support
- **4.11** Git checkpoint
- **5.4** Meeting confirmation screen
- **5.5** ICS file generation
- **5.6** Meeting history in match detail
- **6.3** Store push token (needs backend)
- **6.7** Git checkpoint
- **7.10** Integration tests for API
- **7.11** Git checkpoint

---

## Git Commits This Session

```
5f64a34 feat: swipe card View Details button, demo onboarding flow, production docker-compose + email OTP
055e350 docs: session 015 handoff + GRANDPLAN session log update
b8582dc feat: full demo mode — all services work offline with mock data, no server needed
```

---

## Files Modified This Session

| File | Change |
|------|--------|
| `apps/mobile/constants/demoMode.ts` | **NEW** — `DEMO_MODE` flag + `DEMO_OTP_CODE` ('123456') |
| `apps/mobile/constants/index.ts` | Export `DEMO_MODE`, `DEMO_OTP_CODE` |
| `apps/mobile/services/authService.ts` | Demo LinkedIn login emulates success, OTP accepts '123456' |
| `apps/mobile/services/swipeService.ts` | Demo mode skips tRPC, returns candidates instantly |
| `apps/mobile/services/matchService.ts` | Demo mode uses AsyncStorage for match persistence |
| `apps/mobile/services/chatService.ts` | Demo mode stores messages in AsyncStorage |
| `apps/mobile/services/companyService.ts` | Demo mode returns mock data, skips tRPC |
| `apps/mobile/services/schedulingService.ts` | Demo mode stores meetings in AsyncStorage |
| `apps/mobile/app/(auth)/login.tsx` | LinkedIn + OTP work in demo, OTP hint shows '123456', single 'Skip Everything' button |
| `apps/mobile/components/features/SwipeCard.tsx` | Added `onViewDetails` prop + "View Full Profile" button |
| `apps/mobile/app/(tabs)/index.tsx` | Wired `onViewDetails` to open CompanyExpandModal |
| `apps/api/Dockerfile` | Added `bun.lock` copy + `--frozen-lockfile` |
| `docker-compose.prod.yml` | Complete rewrite with all services + health checks |
| `.env.example` | **NEW** — All env vars documented (Brevo/SendGrid examples) |
| `docs/DOKPLOY_SETUP_GUIDE.md` | Production email/OTP section (3.4) |
| `docs/GRANDPLAN.md` | Updated session log (013→Done, added 014, 015) |

---

## Demo Mode Architecture

All services check `DEMO_MODE` (from `constants/demoMode.ts`) and skip tRPC calls entirely when `true`.

| Service | Demo Behavior |
|---------|--------------|
| **authService** | LinkedIn emulates success (800ms delay), Email OTP accepts '123456' |
| **swipeService** | Returns `DEMO_CANDIDATES` instantly, match on every 3rd right-swipe |
| **matchService** | Merges static `DEMO_MATCHES` + AsyncStorage-persisted live matches |
| **chatService** | Merges static `DEMO_MESSAGES` + AsyncStorage-persisted user messages |
| **companyService** | Returns mock data, skips tRPC. Profile managed by `useCompanyStore`/AsyncStorage |
| **schedulingService** | Meetings stored in AsyncStorage. Propose/respond work locally |

**To switch to production**: Set `DEMO_MODE = false` in `constants/demoMode.ts`. All services will use tRPC calls to the real API.

---

## Demo Flows Available

| Flow | How to Test |
|------|------------|
| **LinkedIn Login** | Tap "Continue with LinkedIn" → emulates OAuth → redirects to onboarding |
| **Email OTP Login** | Tap "Sign in with Email OTP" → enter any email → use code `123456` → redirects to onboarding |
| **Skip Everything** | Tap "Skip Everything (Demo)" → straight to swipe deck with pre-filled company |
| **Onboarding** | 4-step flow: Company basics → Offerings & Needs → Deal preferences → Review & Submit |
| **Discover/Swipe** | Swipe cards with company info, "View Full Profile" button opens detailed modal |
| **Matches** | Static demo matches + live matches from right-swipes (every 3rd swipe) |
| **Chat** | Send messages, they persist in AsyncStorage across app restarts |
| **Schedule Meeting** | Propose time slots, they persist locally |
| **Profile** | Edit company info, persisted in AsyncStorage |

---

## Known Issues

- **IDE lint noise**: `index.tsx` shows ~500+ TSX parsing errors in the IDE — pre-existing monorepo tsconfig resolution. App compiles and runs fine.
- **Pre-existing TS errors**: `Pill` component doesn't have `neutral` variant, `Badge` doesn't accept `style` prop, tRPC fetch type mismatch. None block runtime.
- **Build quota**: 12 remaining. Demo mode changes are JS-only → push via OTA update.

---

## Next Session Prompt

> Read `docs/handoffs/SESSION_015_HANDOFF.md` + `docs/GRANDPLAN.md`
>
> **Objective**: Complete the UI prototype — every screen should be polished, interactive, and demo-ready. Think of this as a native Figma prototype.
>
> **Context**: Full demo mode is now implemented. All services work offline with `DEMO_MODE = true`. LinkedIn login, Email OTP (code: 123456), swipe, match, chat, scheduling, and profile all work without any server. Data persists in AsyncStorage.
>
> **Priority Tasks (UI Completeness)**:
> 1. Push OTA update with demo mode changes to test on APK
> 2. Test all demo flows on device: LinkedIn → onboarding → swipe → matches → chat → schedule → profile
> 3. Fix any remaining UI issues discovered during testing
> 4. Match detail screen (GRANDPLAN 3.5) — tap a match card to see full company profile + chat/schedule actions
> 5. Polish: empty states, loading skeletons, transitions between screens
> 6. Review all screens for B2B professional look and feel
>
> **Deferred (for later sessions)**:
> - Dokploy server setup + real API integration
> - Brevo SMTP for production OTP delivery
> - AI matching engine (Phase 8)
> - Admin dashboard (Phase 9)
>
> **Build Quota**: 12 remaining. Use OTA for JS-only changes.

---

**Handoff Created**: Mar 2, 2026  
**Updated**: Mar 3, 2026 — Added full demo mode implementation  
**Next Session**: TBD
