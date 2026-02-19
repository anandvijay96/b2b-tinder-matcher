# Session 009 Handoff — NMQ B2B Match

## Session Summary
Frontend polish session: fixed swipe UX, applied global KeyboardAvoidingWrapper across all input screens, and implemented OTA updates via expo-updates.

## Completed This Session

### 1. Swipe UX Fix (Phase 2 polish)
**Problem**: Swipe cards were not swipeable — Pressable/ScrollView conflicted with PanResponder; stale closures caused gesture callbacks to reference outdated state.

**Files changed**:
- `app/(tabs)/index.tsx`
  - Replaced `onStartShouldSetPanResponder` with `onStartShouldSetPanResponderCapture` to beat Pressable/ScrollView children
  - Added `topCandidateRef`, `visibleCountRef`, `handleSwipeRef`, `setExpandedRef` — read from refs inside PanResponder to eliminate stale closures
  - Wrapped `swipeCardRef` as a stable `useRef` function; public `swipeCard()` delegates to it
  - Added `snapBack()` helper + `onPanResponderTerminate` to handle interrupted gestures
  - Taps (dx < 8, dy < 8) now open `CompanyExpandModal` directly from PanResponder release
  - Removed nested `<Pressable>` wrapper around `<SwipeCard>` — was the root conflict cause
  - Updated action button `onPress` handlers to use `topCandidateRef.current`
  - Updated `hasReachedLimit` call to `hasReachedLimit()` (it's a function, not a boolean)

- `components/features/SwipeCard.tsx`
  - Replaced `panX?: SharedValue<number>` prop with `scrollEnabled?: boolean` prop
  - `ScrollView` now uses `scrollEnabled` prop (default `false`) — prevents vertical scroll stealing horizontal swipe
  - Removed dead Reanimated overlay block (`likeOverlayStyle` / `passOverlayStyle`) — overlays are now owned by the deck screen

### 2. Global KeyboardAvoidingWrapper (Phase 4 polish)
**Problem**: Keyboard covered input fields on mobile devices — each screen had its own inline `KeyboardAvoidingView` inconsistently.

**Files changed**:
- `components/ui/KeyboardAvoidingWrapper.tsx` *(new)*
  - Props: `enabled`, `mode` (`'screen' | 'modal'`), `keyboardVerticalOffset`, `withScroll`
  - `behavior`: `'padding'` on iOS, `'height'` on Android
  - Optional `ScrollView` wrapper via `withScroll` prop
- `components/ui/index.ts` — exported `KeyboardAvoidingWrapper` + `KeyboardAvoidingWrapperProps`
- Applied to all input screens (replaced inline `KeyboardAvoidingView`):
  - `app/chat/[matchId].tsx`
  - `app/(auth)/login.tsx` — with `withScroll` prop
  - `app/(auth)/onboarding/step1.tsx`
  - `app/(auth)/onboarding/step2.tsx`
  - `app/(auth)/onboarding/step3.tsx`
  - `app/(auth)/onboarding/step4.tsx`
- Removed unused imports (`KeyboardAvoidingView`, `Platform`, `ScrollView` where applicable)

### 3. OTA Updates via expo-updates (Phase 6 supplement)
**Files changed**:
- `package.json` — added `expo-updates@29.0.16` (SDK 54 compatible)
- `app.json`
  - Added `runtimeVersion: { policy: "appVersion" }`
  - Added `updates: { url: "https://u.expo.dev/c86b27ef-...", checkAutomatically: "ON_LOAD" }`
  - Added `"expo-updates"` to plugins array
- `hooks/useOTAUpdates.ts` *(new)*
  - No-op in dev (`Updates.isEnabled === false`)
  - In production: `checkForUpdateAsync` → `fetchUpdateAsync` → `reloadAsync`
  - Cleanup via cancelled flag to prevent state updates on unmounted hook
- `hooks/index.ts` — exported `useOTAUpdates` + `OTAUpdateState`
- `app/_layout.tsx` — added `useOTAUpdates()` call in `RootLayout`

## Git Commits
1. `0267ef40` — `feat: fix swipe UX and add global KeyboardAvoidingWrapper`
2. `bf5f209d` — `feat: implement OTA updates via expo-updates`

## Known Issues / False Positives
- All `.tsx` lint errors remain JSX false positives (TS language server doesn't process JSX in `.tsx` files correctly in this workspace config). Metro compiles and runs fine. Documented since Session 002.

## Technical Decisions
- `onStartShouldSetPanResponderCapture` chosen over `onStartShouldSetPanResponder` — "capture" phase runs before child responder negotiation, ensuring the deck wins against nested Pressable/ScrollView.
- `runtimeVersion: { policy: "appVersion" }` — OTA update channel is tied to the native binary version. When native code changes require a new build, bump `version` in `app.json`. Pure JS/asset changes can be pushed via `eas update`.
- `useOTAUpdates()` is fire-and-forget — no loading UI shown. Silent reload on update available. Can add a "Restart to update" alert in future if needed.

## OTA Deployment Workflow (for reference)
```bash
# Push a JS-only update to production channel
eas update --channel production --message "fix: ..."
```
Requires EAS CLI (`npm i -g eas-cli`) and being logged in (`eas login`).

## Remaining Frontend Items (non-blocking for Phase 7)
- [ ] **4.6** Typing indicator in chat (UI only)
- [ ] **4.9** File attachment support
- [ ] **4.11** Git checkpoint: `feat: in-app chat complete`
- [ ] **5.5** ICS file generation (calendar invite export)
- [ ] **5.6** Meeting history in match detail screen
- [ ] **6.3** Store push token in user profile (needs Phase 7 backend)

## What's Next: Phase 7 — Backend Integration
Phase 7 is the largest phase. It involves setting up a Turborepo monorepo and replacing all mock services with real tRPC API calls.

High-level Phase 7 work:
1. **Monorepo setup** — Turborepo, move Expo app to `apps/mobile/`, create `apps/api/`, `packages/shared/`, `packages/db/`
2. **Drizzle schema** — `companies`, `users`, `intents`, `matches`, `messages`, `meeting_slots`, `swipe_actions`, `verification_requests`
3. **Better-Auth** — email OTP endpoints; LinkedIn OAuth deferred
4. **tRPC routers** — `auth`, `company`, `intent`, `match`, `message`, `scheduling`
5. **Zod schemas** in `packages/shared` — shared between mobile and API
6. **Replace mock services** one by one
7. **Cloud Run deployment config** (Dockerfile, docker-compose)

## Next Session Prompt
```
Read SESSION_009_HANDOFF.md and GRANDPLAN.md.

Frontend polish (Sessions 008–009) is complete. The app has:
- Working swipe gesture (PanResponder fixed, no stale closures)
- Global KeyboardAvoidingWrapper on all input screens
- OTA updates via expo-updates (runtimeVersion + useOTAUpdates hook)

We are now ready to start Phase 7: Backend Integration.

Tasks for this session:
1. Set up Turborepo monorepo:
   - Move current Expo app to apps/mobile/
   - Create apps/api/ with Hono + tRPC + Better-Auth (Bun runtime)
   - Create packages/shared/ for Zod schemas (shared between mobile + API)
   - Create packages/db/ for Drizzle schema + migrations
2. Define Drizzle schema (libSQL/Turso):
   - companies, users, intents, matches, messages, meeting_slots, swipe_actions, verification_requests
3. Wire Better-Auth with email OTP (LinkedIn OAuth deferred to Phase 8)
4. Commit: chore: Phase 7 monorepo setup

Pinned versions — DO NOT upgrade:
- expo ~54.0.30, expo-router ~6.0.21, react 19.1.0, react-native 0.81.5
- nativewind ^4.2.1, tailwindcss ^3.4.19, zustand ^5.0.9, typescript ~5.9.2
```
