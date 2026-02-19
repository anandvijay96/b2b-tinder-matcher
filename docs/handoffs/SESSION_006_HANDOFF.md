# Session 006 Handoff — NMQ B2B Match

## Session Summary
Completed Phase 3 (Matching & Match Screen) and Phase 4 core (In-App Chat).

## Completed This Session

### Phase 3 Final Tasks
- **`useMatchStore`** — `addMatch` deduplication (checks both `companyAId/companyBId` permutations)
- **`useMatchStore`** — `markMatchRead` action (sets `unreadCount = 0`)
- **`app/(tabs)/_layout.tsx`** — Red unread badge on Matches tab icon using `useMatchStore.getTotalUnread()`
- **`app/match/[id].tsx`** — "Chat Now" CTA navigates to `/chat/${id}` thread directly
- **`app/_layout.tsx`** — Registered `chat/[matchId]` stack screen

### Phase 4: In-App Chat
- **`services/mockData/messages.json`** — Mock conversations for `match_001` and `match_002`
  - Text messages, capability deck attachment type
- **`services/chatService.ts`** — Wired to mock JSON; `sendMessage` returns a real `Message` object
- **`hooks/useChat.ts`** — Full implementation:
  - Loads messages on mount via `chatService.getMessages`
  - Calls `chatService.markAsRead` + `markMatchRead` on open (clears unread badge)
  - `sendMessage` optimistically adds to store
  - Exposes `isSending`, `myUserId`, `error`
- **`components/features/ChatBubble.tsx`** — Message bubble component:
  - Own/other alignment (right/left)
  - `text`, `capability_deck`, `rfq_template`, `attachment` type rendering
  - FileText/Paperclip icons for attachments
  - Timestamp below each bubble
- **`app/chat/[matchId].tsx`** — Full chat screen:
  - Back button, company name + match score header
  - "Why you matched" pinned card (top 2 reasons)
  - `FlatList` with `ChatBubble` rows
  - `KeyboardAvoidingView` (ios=padding, android=height)
  - Empty state for new matches
  - `TextInput` multiline input bar + `Send` button (disabled when empty/sending)
  - Auto-scroll to bottom on new messages

## Git Commits
1. `5626b32a` — `feat: Phase 3 complete — unread badge, dedup, match status`
2. `e0a2217c` — `feat: Phase 4 chat — ChatBubble, chatService wired, useChat, chat screen`

## Known Issues / False Positives
- All `.tsx` lint errors are **false positives** from TS language server not recognizing JSX — Metro compiles fine. Documented since Session 002.

## Technical Decisions
- `useChat` uses `hasFetched` ref (same pattern as `useSwipeDeck`/`useMatches`) to prevent double-fetch
- `MY_USER_ID = 'user_me'` constant in `useChat` — will be replaced with `useAuthStore.user.id` in Phase 7
- `markMatchRead` called on chat open so unread badge disappears immediately (no network round-trip needed)
- Chat input uses inline `style` instead of NativeWind — `TextInput` multiline requires pixel-precise control for auto-grow

## Remaining Phase 4 Tasks
- [ ] **4.7** Unread message count badge on Chat tab icon (useChatStore + count unread per match)
- [ ] **4.6** Typing indicator (UI only)
- [ ] **4.9** File attachment picker (Phase 11 polish candidate)
- [ ] **4.11** Git checkpoint: `feat: in-app chat complete`

## Next Session Priorities
1. **4.7** Unread message badge on Chat tab icon in `(tabs)/_layout.tsx`
2. **Phase 5** Meeting Scheduler:
   - `app/schedule/[matchId].tsx` — propose up to 3 time slots
   - `useScheduling` hook wired with `schedulingService`
   - Meeting confirmation screen
   - "Schedule Meeting" CTA from match celebration wires here

## Next Session Prompt
```
Read SESSION_006_HANDOFF.md and GRANDPLAN.md.

We are finishing Phase 4 and starting Phase 5 (Meeting Scheduler).

Tasks:
1. 4.7: Add unread message count badge on the Chat tab icon in app/(tabs)/_layout.tsx
   - Use useChatStore messages record — count messages where isRead=false and senderId !== 'user_me'
2. Phase 5:
   - Create app/schedule/[matchId].tsx — meeting proposal screen (3 time slots with DateTimePicker)
   - Wire schedulingService with mock data
   - useScheduling hook: proposeSlots, loadSlots, acceptSlot
   - Register schedule/[matchId] in _layout.tsx
   - Wire "Schedule Meeting" CTA from match/[id].tsx to schedule/[matchId]
```
