# AI Agent Guidelines — NMQ B2B Match

## Project Context
This is a Tinder-style B2B matching mobile app built with Expo + React Native. Businesses discover relevant partners via AI-driven intent matching, swipe to express interest, and convert matches into conversations and meetings. Hosted on GCP.

## Protocol Binding
I will follow the **AI Agent Development Protocol (AADP)** as defined in `docs/AI_AGENT_DEV_PROTOCOL.md`.

### Core Rules I Am Bound To:
1. **State Persistence**: Documentation is my memory. Update handoffs and GRANDPLAN religiously.
2. **Structure over Speed**: Follow the GRANDPLAN phases strictly. Never skip ahead.
3. **Granular Progress**: Small, verifiable steps with frequent git commits.
4. **Clean Architecture**: Modular, DRY, TypeScript-strict from line one.

### Session Workflow:
- **Start**: Read latest `SESSION_XXX_HANDOFF.md` + `docs/GRANDPLAN.md`
- **During**: Frequent commits, map every action to GRANDPLAN phase/task ID
- **End**: Create new handoff document with next session prompt. Update GRANDPLAN checklist.

---

## Coding Standards

### Architecture
- **Separation of Concerns**: UI components must NOT contain business logic
- **Hooks for Logic**: All data fetching and state logic in custom hooks
- **Services for API**: Abstract all data access into service files (mock-first, swap for real API later)
- **Zustand for State**: Global state management with Zustand stores
- **Zod for Validation**: All forms validated with Zod schemas (will be shared with backend)

### File Organization
```
app/           → Expo Router screens only (minimal logic)
components/    → Reusable UI components
  ui/          → Design system primitives (Button, Card, Input, Avatar, Badge, etc.)
  features/    → Feature-specific components (SwipeCard, MatchCard, ChatBubble, etc.)
hooks/         → Custom React hooks (useSwipeDeck, useMatches, useChat, etc.)
services/      → Data layer (authService, companyService, matchService, swipeService, chatService)
  mockData/    → JSON mock data mirroring expected API responses
stores/        → Zustand stores (useAuthStore, useCompanyStore, useMatchStore, etc.)
models/        → TypeScript interfaces/types (Company, User, Intent, Match, Message, etc.)
constants/     → Theme tokens, config, colors
docs/          → GRANDPLAN, handoffs, architecture docs
```

### Naming Conventions
- **Components**: PascalCase (`SwipeCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useSwipeDeck.ts`)
- **Services**: camelCase with `Service` suffix (`matchService.ts`)
- **Stores**: camelCase with `use` prefix and `Store` suffix (`useMatchStore.ts`)
- **Types/Interfaces**: PascalCase with descriptive names (`Company`, `Match`, `SwipeAction`)
- **Constants**: camelCase for objects, UPPER_SNAKE_CASE for primitives

### TypeScript
- Strict mode enabled (`"strict": true` in tsconfig)
- No `any` types — use proper typing or `unknown`
- Export interfaces from `models/` directory
- Use type inference where obvious, explicit types for function params/returns
- Barrel exports (`index.ts`) in every module directory

### Styling
- **NativeWind v4** for Tailwind-style classes (no inline styles)
- Design tokens in `constants/theme.ts` and `tailwind.config.js`
- 8px grid system for spacing
- B2B-professional color palette: blues, grays, clean whites
- Card-heavy UI with consistent border radius and shadow tokens

### Component Rules
- Props interface defined and exported
- Destructure props in function signature
- No inline styles — use NativeWind classes exclusively
- Wrap with `memo()` only when performance requires it
- Keep components under 150 lines; extract sub-components if larger

---

## Git Commit Convention
Use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting, no code change
- `refactor:` Code restructure
- `test:` Adding tests
- `chore:` Maintenance, config, dependencies

Commit after every meaningful unit of work. Never commit broken code.

---

## Mock Data Strategy
- All mock data in `services/mockData/` as JSON files
- Structure mirrors expected API/tRPC response shapes
- Services return `Promise<T>` with `setTimeout` delay (simulates network)
- Easy to swap for real tRPC client calls later (same interface)

---

## Quality Checklist
Before ending a session:
- [ ] All files TypeScript-valid (no red squiggles)
- [ ] App compiles and runs without crashes (`npx expo start`)
- [ ] Changes committed to git with descriptive messages
- [ ] Handoff document created in `docs/handoffs/`
- [ ] GRANDPLAN.md updated (checked off completed tasks)

---

## Key Dependencies & Versions (Pinned)
These versions are proven to work together (from reference project):
- `expo`: ~54.0.30
- `expo-router`: ~6.0.21
- `react`: 19.1.0
- `react-native`: 0.81.5
- `nativewind`: ^4.2.1
- `tailwindcss`: ^3.4.19
- `react-native-reanimated`: ~4.1.1
- `zustand`: ^5.0.9
- `lucide-react-native`: ^0.562.0
- `typescript`: ~5.9.2
- `react-native-svg`: ^15.15.1
- `react-native-screens`: ~4.16.0
- `react-native-safe-area-context`: ~5.6.0
- `react-native-css-interop`: ^0.2.1

Do NOT upgrade these without explicit instruction. Version mismatches cause build failures.

---

## B2B-Specific Design Principles
- **Trust First**: Verification badges, clear company identities, professional tone
- **Explain the Match**: Every match must show "why" — never opaque
- **Low Friction**: Minimum viable fields for onboarding; progressive detail collection
- **Action-Oriented**: Every screen should have a clear next action (swipe, chat, schedule)
- **Respect Time**: Business users are busy — fast load, clear CTAs, no unnecessary steps
