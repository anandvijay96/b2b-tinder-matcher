# 🗺️ NMQ B2B Match — Project Grand Plan

## Vision
A mobile-first B2B estimation and networking application for NMQ that connects verified businesses using AI-driven intent matching. Borrows Tinder-style swipe UX (swipe cards, double-opt-in matches, lightweight onboarding) while maintaining trust, professionalism, and commercial clarity expected in B2B platforms. Businesses discover relevant partners faster, validate fit through AI-generated summaries, and convert matches into conversations and meetings.

## 🛠️ Tech Stack

### Mobile App (Primary)
- **Framework**: Expo SDK 54 (React Native 0.81+, New Architecture enabled)
- **Router**: Expo Router v6 (file-based routing)
- **Styling**: NativeWind v4 (Tailwind CSS for React Native) + TailwindCSS 3.4
- **State Management**: Zustand 5
- **Animations**: React Native Reanimated 4 + Gesture Handler
- **Icons**: Lucide React Native
- **Swipe Cards**: `rn-tinder-card` (primary) or `react-native-tinder-swipe` (fallback)
- **Language**: TypeScript 5.9+ (strict mode)

### Backend / API (Phase 1: Mock → Phase 2: Real)
- **Runtime**: Bun
- **Framework**: Hono + tRPC (Better-T-Stack pattern)
- **ORM**: Drizzle ORM
- **Database**: libSQL (Turso) for structured data; pgvector or Vertex AI Vector Search for embeddings
- **Auth**: Better-Auth (LinkedIn OAuth + Email OTP)
- **Validation**: Zod (shared schemas via monorepo packages)

### AI / Matching
- **Embeddings**: Google Vertex AI Text Embeddings API (`gemini-embedding-001`)
- **Vector Store**: Vertex AI Vector Search or pgvector-enabled Cloud SQL
- **Matching**: Cosine similarity + hard filters + feedback signals

### Infrastructure (GCP)
- **Compute**: Cloud Run (containerized API)
- **Storage**: Cloud Storage (documents, media)
- **Messaging**: Firestore (real-time chat) or WebSocket microservice
- **Push Notifications**: Expo Notifications + Firebase Cloud Messaging (FCM)
- **Analytics**: Firebase Analytics / GA4, BigQuery
- **Admin Web**: React (Better-T-Stack template), deployed to Cloud Run or Vercel

### Dev Tooling
- **Package Manager**: Bun
- **Linting**: ESLint (flat config)
- **Formatting**: Prettier
- **Git**: Conventional commits (`feat:`, `fix:`, `docs:`, `refactor:`, etc.)
- **CI/CD**: EAS Build (mobile), Docker + Cloud Run (API)

---

## 📅 Roadmap

### Phase 0: Project Foundation & Scaffolding ✦ Sessions 1–2
> Goal: Buildable, runnable Expo app skeleton with proven config from the reference project. All architectural patterns established. Zero business logic, but every folder, config, and pattern in place.

- [x] **0.1** Initialize Expo project (SDK 54, TypeScript strict, New Arch)
- [x] **0.2** Configure NativeWind v4 (babel, metro, tailwind, global.css)
- [x] **0.3** Configure path aliases (`@/*`) in tsconfig
- [x] **0.4** Setup Expo Router file structure: `(auth)`, `(tabs)`, root `_layout.tsx`
- [x] **0.5** Create folder scaffold: `components/ui/`, `components/features/`, `hooks/`, `services/`, `stores/`, `models/`, `constants/`, `services/mockData/`
- [x] **0.6** Create design system constants: `constants/theme.ts`, `constants/Colors.ts`, `constants/index.ts`
- [x] **0.7** Create TypeScript models: `Company`, `User`, `Intent`, `Match`, `Message`, `MeetingSlot`, `SwipeAction`
- [x] **0.8** Create barrel exports (`index.ts`) for models, hooks, services, stores, components/ui, components/features
- [x] **0.9** Create UI primitives: `Button`, `Card`, `Input`, `Avatar`, `Badge`, `Pill`, `EmptyState`, `Skeleton`, `Modal`, `SectionHeader`
- [x] **0.10** Create Zustand stores: `useAuthStore`, `useCompanyStore`, `useMatchStore`, `useSwipeStore`, `useChatStore`
- [x] **0.11** Create service stubs (returning mock data via Promises): `authService`, `companyService`, `matchService`, `swipeService`, `chatService`, `schedulingService`
- [x] **0.12** Create hook stubs: `useAuth`, `useCompanyProfile`, `useSwipeDeck`, `useMatches`, `useChat`, `useHaptics`
- [x] **0.13** Setup `app.json` / `eas.json` for NMQ B2B Match
- [x] **0.14** Verify app compiles and runs on Android/iOS simulator with blank tabs
- [x] **0.15** Git init, initial commit, push to remote

### Phase 1: Authentication & Onboarding ✦ Sessions 3–5
> Goal: Users can sign up, log in, and complete a basic business profile. Auth-gated navigation works.

- [x] **1.1** Login screen UI (LinkedIn SSO button + Email OTP input)
- [x] **1.2** Auth flow logic in `useAuthStore` (mock initially, Better-Auth later)
- [x] **1.3** Auth-gated navigation: redirect unauthenticated → `(auth)/login`, authenticated → `(tabs)`
- [x] **1.4** Custom animated splash screen (Lottie or Reanimated)
- [x] **1.5** Profile Builder — Step 1: Company basics (name, website, HQ location, industry, employee range)
- [x] **1.6** Profile Builder — Step 2: Offerings & Needs (free-form text + category tags)
- [x] **1.7** Profile Builder — Step 3: Deal preferences (size, geography, engagement model)
- [x] **1.8** Profile Builder — Step 4: Logo upload + review & submit
- [x] **1.9** Profile completion indicator / progress bar component
- [x] **1.10** Store completed profile in `useCompanyStore` (mock persistence via AsyncStorage)
- [x] **1.11** "Edit Profile" screen accessible from profile tab
- [x] **1.12** Form validation with Zod schemas (shared with future backend)
- [ ] **1.13** Unit tests for auth store logic
- [ ] **1.14** Git checkpoint: `feat: auth and onboarding complete`

### Phase 2: Swipe Deck & Discovery ✦ Sessions 6–9
> Goal: Core Tinder-style swipe experience. AI-ordered candidate deck with rich cards. Swipe right/left with animations and haptic feedback.

- [x] **2.1** Install and configure `rn-tinder-card` (or `react-native-tinder-swipe`) — used PanResponder + RN Animated (no extra dep needed)
- [x] **2.2** `SwipeCard` component: company logo, name, industry, location, top offerings, top needs, verification badge
- [x] **2.3** Swipe deck screen (main tab): renders stack of `SwipeCard` components
- [x] **2.4** Swipe right (interested) / left (pass) gesture handling with PanResponder + Animated
- [x] **2.5** Haptic feedback on swipe actions via `expo-haptics`
- [x] **2.6** "Tap to expand" — full company profile modal on card tap
- [x] **2.7** AI explanation section on expanded card: "Why this match" bullet points
- [x] **2.8** `useSwipeDeck` hook: fetches candidates, manages deck state, records swipe actions
- [x] **2.9** `swipeService` with mock data: returns paginated candidate list (8 rich B2B candidates)
- [x] **2.10** Basic filters sheet: industry, company size, geography, verification level
- [x] **2.11** Filter state in `useSwipeStore` + filtered results
- [x] **2.12** Empty state when no more candidates ("You've seen everyone for now!")
- [x] **2.13** Daily swipe counter UI (free tier limit indicator)
- [x] **2.14** Swipe undo (premium placeholder — disabled in MVP)
- [x] **2.15** Super-like gesture (premium placeholder — disabled in MVP)
- [x] **2.16** Smooth card stack animation (next card peek behind current — scale 1.0/0.95/0.90 stack)
- [ ] **2.17** Unit tests for swipe logic
- [x] **2.18** Git checkpoint: `feat: swipe deck discovery complete`

### Phase 3: Matching & Match Screen ✦ Sessions 10–11
> Goal: Double-opt-in matching. "It's a Match!" celebration screen. Match list with status.

- [x] **3.1** Match creation logic: both parties swiped right → match
- [x] **3.2** "It's a Match!" animation screen (both logos, confetti/Lottie, top-3 match reasons)
- [x] **3.3** CTAs on match screen: "Chat Now" and "Schedule Meeting"
- [x] **3.4** Matches tab: list of all matches with company info, match date, last message preview
- [ ] **3.5** Match detail screen: full company profile + match reasons + action buttons
- [x] **3.6** `useMatchStore` + `matchService` with mock data
- [x] **3.7** Prevent duplicate matches between same company pair
- [x] **3.8** Match status tracking: `new` → `chatting` → `meeting_scheduled` → `completed` / `declined`
- [x] **3.9** Unread match indicator (badge on tab icon)
- [x] **3.10** Git checkpoint: `feat: matching system complete`

### Phase 4: In-App Chat ✦ Sessions 12–14
> Goal: 1:1 messaging per match. Persistent history. "Why this match" pinned card.

- [x] **4.1** Chat screen UI: message bubbles, input bar, send button
- [x] **4.2** Message list with timestamps, read receipts placeholder
- [x] **4.3** "Why this match?" pinned card at top of chat thread
- [x] **4.4** `useChatStore` + `chatService` (mock data, polling-based initially)
- [x] **4.5** Text input with auto-grow, keyboard avoidance
- [ ] **4.6** Typing indicator (UI only in MVP)
- [x] **4.7** Unread message count badge on matches/chat tab
- [x] **4.8** Canned action buttons: "Send RFQ", "Send Capability Deck" (templates — ChatBubble renders capability_deck/rfq_template types)
- [ ] **4.9** File attachment support (PDF, images) — upload to mock storage
- [x] **4.10** Chat empty state for new matches
- [ ] **4.11** Git checkpoint: `feat: in-app chat complete`

### Phase 5: Meeting Scheduler ✦ Sessions 15–16
> Goal: Propose time slots, accept/reject, generate ICS. Complete the core engagement loop.

- [x] **5.1** Scheduler UI: propose up to 3 time slots (auto-generated, no date picker needed for MVP)
- [x] **5.2** Time zone display and conversion (UTC storage, local display)
- [x] **5.3** Slot acceptance/rejection flow
- [ ] **5.4** Meeting confirmation screen with details
- [ ] **5.5** ICS file generation (calendar invite export)
- [ ] **5.6** Meeting history in match detail screen
- [x] **5.7** `useScheduling` hook + `schedulingService` wired to mock data
- [x] **5.8** Git checkpoint: `feat: meeting scheduler complete`

### Phase 6: Push Notifications ✦ Session 17
> Goal: Push notifications for new matches, messages, meeting proposals.

- [x] **6.1** Configure `expo-notifications` plugin in app.json
- [x] **6.2** Request notification permissions on app start
- [ ] **6.3** Store push token in user profile (Phase 7 — needs backend)
- [x] **6.4** Notification handlers: new match, new message, meeting proposal
- [x] **6.5** Deep linking from notification tap → correct screen
- [x] **6.6** `notificationService` implementation (local + push token)
- [ ] **6.7** Git checkpoint: `feat: push notifications complete`

### Phase 7: Backend Integration (Better-T-Stack) ✦ Sessions 18–23
> Goal: Replace all mock services with real API calls. Monorepo setup with shared types.

- [ ] **7.1** Monorepo setup: `apps/mobile`, `apps/api`, `packages/shared`, `packages/db`
- [ ] **7.2** Drizzle schema: `companies`, `users`, `intents`, `matches`, `messages`, `meeting_slots`, `swipe_actions`, `verification_requests`
- [ ] **7.3** Better-Auth setup: LinkedIn OAuth callback + email OTP endpoints
- [ ] **7.4** tRPC routers: `auth`, `company`, `intent`, `match`, `message`, `scheduling`
- [ ] **7.5** Zod schemas in `packages/shared` — shared between mobile and API
- [ ] **7.6** Mobile app: replace mock services with tRPC client calls
- [ ] **7.7** Database migrations with Drizzle
- [ ] **7.8** Cloud Run deployment config (Dockerfile, docker-compose)
- [ ] **7.9** Environment variable management (`.env`, GCP Secret Manager)
- [ ] **7.10** Integration tests for critical API endpoints
- [ ] **7.11** Git checkpoint: `feat: backend integration complete`

### Phase 8: AI Matching Engine ✦ Sessions 24–26
> Goal: Real Vertex AI embeddings for offers/needs. Semantic similarity matching. Explainability.

- [ ] **8.1** Vertex AI SDK integration in API service
- [ ] **8.2** Embedding generation for company offers and needs on profile save
- [ ] **8.3** Vector storage (pgvector or Vertex AI Vector Search)
- [ ] **8.4** Candidate retrieval: semantic similarity search for current user's active intents
- [ ] **8.5** Hard filter overlay: industry, geography, verification level, company size
- [ ] **8.6** Feedback loop: negative swipes reduce similar candidates, positive matches boost
- [ ] **8.7** Explainability: generate "Matched because..." bullet points from overlapping fields + similarity
- [ ] **8.8** Ranking pipeline: semantic score × filter score × diversity bonus
- [ ] **8.9** A/B test infrastructure for ranking strategies (feature flags)
- [ ] **8.10** Git checkpoint: `feat: AI matching engine complete`

### Phase 9: Admin Dashboard ✦ Sessions 27–28
> Goal: Web admin panel for NMQ operations team. Verification queue, moderation, analytics.

- [ ] **9.1** Admin web app scaffold (React + Better-T-Stack template)
- [ ] **9.2** Business verification queue: search, filter, approve/reject
- [ ] **9.3** User management: search, view profiles, soft-ban
- [ ] **9.4** Content moderation: flagged profiles, spam messages
- [ ] **9.5** KPI dashboard: active users, swipe→match conversion, match→meeting conversion
- [ ] **9.6** Admin RBAC (admin roles via Better-Auth)
- [ ] **9.7** Git checkpoint: `feat: admin dashboard complete`

### Phase 10: Real-Time Chat Upgrade ✦ Session 29
> Goal: Replace polling with Firestore real-time listeners or WebSocket.

- [ ] **10.1** Firestore integration for real-time message syncing
- [ ] **10.2** Typing indicators (real-time)
- [ ] **10.3** Online/offline presence
- [ ] **10.4** Message read receipts (real-time)
- [ ] **10.5** Git checkpoint: `feat: real-time chat upgrade complete`

### Phase 11: Polish, Testing & Hardening ✦ Sessions 30–32
> Goal: Production-ready quality. Edge cases, error handling, performance.

- [ ] **11.1** Comprehensive error boundaries on all screens
- [ ] **11.2** Network error handling + retry logic
- [ ] **11.3** Offline mode graceful degradation
- [ ] **11.4** Loading skeletons on all data-dependent screens
- [ ] **11.5** Performance profiling and optimization (FlatList, memo, lazy loading)
- [ ] **11.6** Accessibility audit (screen readers, contrast, touch targets)
- [ ] **11.7** Unit tests for all stores and services
- [ ] **11.8** Integration tests for critical user flows (auth → swipe → match → chat → schedule)
- [ ] **11.9** Firebase Analytics event tracking for key actions
- [ ] **11.10** App icon, splash screen, store metadata
- [ ] **11.11** Git checkpoint: `chore: polish and hardening complete`

### Phase 12: Monetization & Advanced Features ✦ Sessions 33+
> Goal: Paid tiers, advanced discovery, organization features.

- [ ] **12.1** Subscription tiers: Free (limited swipes), Business (unlimited swipes, super-likes, undo)
- [ ] **12.2** In-app purchase / payment integration
- [ ] **12.3** Organization accounts: multi-user teams per company
- [ ] **12.4** Role-based access within organization
- [ ] **12.5** Advanced filters: budget bands, tech stack tags, language
- [ ] **12.6** "AI Picks" — daily curated top-5 matches
- [ ] **12.7** Campaigns / Programs: curated discovery tracks (e.g., "EU Compliance Vendors")
- [ ] **12.8** Sponsored placements
- [ ] **12.9** KYB integrations for automated verification
- [ ] **12.10** Calendar integration (Google Calendar / Microsoft 365)
- [ ] **12.11** Chat integrations (Slack, email export)
- [ ] **12.12** BI integration: BigQuery + Looker dashboards
- [ ] **12.13** Git checkpoint: `feat: monetization and advanced features`

---

## 🏗️ Architecture Overview

```
┌──────────────────────────────────────────────────────┐
│                    Expo Mobile App                     │
│  ┌─────────┐ ┌──────────┐ ┌─────────┐ ┌───────────┐ │
│  │  Screens │ │Components│ │  Hooks  │ │  Stores   │ │
│  │(auth)    │ │  ui/     │ │useSwipe │ │useAuthSt  │ │
│  │(tabs)    │ │  features│ │useMatch │ │useMatchSt │ │
│  │ modals   │ │          │ │useChat  │ │useSwipeSt │ │
│  └────┬─────┘ └──────────┘ └────┬────┘ └─────┬─────┘ │
│       │                         │             │       │
│       └──────── Services ───────┘             │       │
│                    │                          │       │
│              ┌─────┴─────┐                    │       │
│              │ tRPC Client│◄───────────────────┘       │
│              └─────┬─────┘                            │
└────────────────────┼──────────────────────────────────┘
                     │ HTTPS
┌────────────────────┼──────────────────────────────────┐
│              Cloud Run (GCP)                           │
│  ┌─────────────────┴────────────────────────────┐     │
│  │           Hono + tRPC API Server              │     │
│  │  ┌──────┐ ┌───────┐ ┌──────┐ ┌───────────┐  │     │
│  │  │ Auth │ │Company│ │Match │ │  Message   │  │     │
│  │  │Router│ │Router │ │Router│ │  Router    │  │     │
│  │  └──┬───┘ └───┬───┘ └──┬───┘ └─────┬─────┘  │     │
│  │     └─────────┼────────┼───────────┘         │     │
│  │               │  Drizzle ORM                  │     │
│  └───────────────┼──────────────────────────────┘     │
│                  │                                     │
│  ┌───────────────┼──────────────────────────────┐     │
│  │         Data Layer                            │     │
│  │  ┌─────────┐ ┌──────────┐ ┌───────────────┐ │     │
│  │  │  Turso  │ │ Vertex AI│ │  Firestore    │ │     │
│  │  │ (libSQL)│ │ Vectors  │ │  (Real-time)  │ │     │
│  │  └─────────┘ └──────────┘ └───────────────┘ │     │
│  └──────────────────────────────────────────────┘     │
└───────────────────────────────────────────────────────┘
```

### Folder Structure (Mobile App — Phase 0)

```
B2B-Tinder/
├── app/
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── onboarding/
│   │       ├── step1.tsx
│   │       ├── step2.tsx
│   │       ├── step3.tsx
│   │       └── step4.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx          // Swipe Deck (Home)
│   │   ├── matches.tsx        // Match list
│   │   ├── chat.tsx           // Chat list (or nested)
│   │   └── profile.tsx        // User/Company profile
│   ├── match/
│   │   └── [id].tsx           // Match detail
│   ├── chat/
│   │   └── [matchId].tsx      // Chat thread
│   ├── schedule/
│   │   └── [matchId].tsx      // Meeting scheduler
│   ├── _layout.tsx            // Root layout
│   ├── +not-found.tsx
│   └── modal.tsx
├── components/
│   ├── ui/                    // Design system primitives
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Avatar.tsx
│   │   ├── Badge.tsx
│   │   ├── Pill.tsx
│   │   ├── Modal.tsx
│   │   ├── Skeleton.tsx
│   │   ├── EmptyState.tsx
│   │   ├── SectionHeader.tsx
│   │   └── index.ts
│   ├── features/              // Feature-specific components
│   │   ├── SwipeCard.tsx
│   │   ├── MatchCard.tsx
│   │   ├── ChatBubble.tsx
│   │   ├── CompanyProfile.tsx
│   │   ├── IntentTag.tsx
│   │   ├── MatchReasons.tsx
│   │   ├── TimeSlotPicker.tsx
│   │   └── index.ts
│   └── SplashScreen.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useCompanyProfile.ts
│   ├── useSwipeDeck.ts
│   ├── useMatches.ts
│   ├── useChat.ts
│   ├── useScheduling.ts
│   ├── useHaptics.ts
│   └── index.ts
├── services/
│   ├── authService.ts
│   ├── companyService.ts
│   ├── matchService.ts
│   ├── swipeService.ts
│   ├── chatService.ts
│   ├── schedulingService.ts
│   ├── notificationService.ts
│   ├── mockData/
│   │   ├── companies.json
│   │   ├── matches.json
│   │   ├── messages.json
│   │   └── candidates.json
│   └── index.ts
├── stores/
│   ├── useAuthStore.ts
│   ├── useCompanyStore.ts
│   ├── useMatchStore.ts
│   ├── useSwipeStore.ts
│   ├── useChatStore.ts
│   └── index.ts
├── models/
│   ├── Company.ts
│   ├── User.ts
│   ├── Intent.ts
│   ├── Match.ts
│   ├── Message.ts
│   ├── MeetingSlot.ts
│   ├── SwipeAction.ts
│   └── index.ts
├── constants/
│   ├── Colors.ts
│   ├── theme.ts
│   └── index.ts
├── assets/
│   ├── fonts/
│   ├── images/
│   └── animations/
├── docs/
│   ├── GRANDPLAN.md
│   ├── Initial_PRD.md
│   ├── AI_AGENT_DEV_PROTOCOL.md
│   ├── handoffs/
│   └── architecture/
├── AGENTS.md
├── app.json
├── babel.config.js
├── metro.config.js
├── tailwind.config.js
├── tsconfig.json
├── global.css
├── eas.json
├── package.json
├── .gitignore
└── README.md
```

---

## 📝 Session Log

| Session | Date       | Focus                                | Phase | Status      |
|---------|------------|--------------------------------------|-------|-------------|
| 001     | 2026-02-18 | GRANDPLAN + AGENTS.md + Scaffolding  | 0     | Done        |
| 002     | 2026-02-18 | UI Primitives + Login Screen + Compile Verify | 0–1   | Done        |
| 003     | 2026-02-19 | Profile Builder Onboarding (4 steps) + Zod + Persistence | 1     | Done        |
| 004     | 2026-02-20 | SwipeCard + Swipe Deck screen + PanResponder animations | 2     | Done        |
| 005     | 2026-02-20 | CompanyExpandModal + FiltersSheet + MatchCard + match creation | 2–3   | Done        |
| 006     | 2026-02-20 | Phase 3 complete + Phase 4 Chat (ChatBubble, chatService, useChat, chat screen) | 3–4   | Done        |
| 007     | 2026-02-20 | Phase 4 finish (4.7 chat badge) + Phase 5 Scheduler + matches nav fix | 4–5   | Done        |
| 008     | 2026-02-20 | Phase 6 push notifications scaffold (expo-notifications, deep links) | 6     | Done        |
| 009     | 2026-02-20 | Frontend polish: swipe UX fixes, global KeyboardAvoidingWrapper, OTA updates | 2/4/6 | Done        |
