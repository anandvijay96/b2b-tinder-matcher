# NMQ B2B Match — Screen Recording Script (Stakeholder PoC)

> **Purpose**: Record a polished demo video showing the complete app flow for stakeholder review.
> **Duration**: ~5–7 minutes total across 3 scenarios.
> **Setup**: Use the built APK or Expo Go on an Android device. Clear app data before recording for a fresh start.

---

## Pre-Recording Setup

1. **Clear app data** — Settings → Apps → NMQ B2B Match → Clear Data (ensures fresh start with login screen)
2. **Enable Do Not Disturb** — No notifications interrupting the recording
3. **Portrait orientation** — Hold phone vertically throughout
4. **Wi-Fi on** — Even in demo mode, the app loads faster with connectivity

---

## Scenario 1: Full Onboarding Flow (LinkedIn Login)
**Goal**: Show the complete new-user experience from login to first swipe.

| Step | Action | What to Show |
|------|--------|-------------|
| 1 | Open app | Branded splash screen → Login screen |
| 2 | Tap **"Continue with LinkedIn"** | Brief loading → Redirects to onboarding Step 1 |
| 3 | **Step 1 — Company Basics** | Fill in: Company Name, Website, select Industry, Company Size, HQ Location → Tap "Continue" |
| 4 | **Step 2 — Offerings & Needs** | Write offering summary, tap quick-add tags for offerings. Write needs summary, add need tags → Tap "Continue" |
| 5 | **Step 3 — Deal Preferences** | Select deal size range, tap geographies, select engagement models → Tap "Continue" |
| 6 | **Step 4 — Review & Submit** | Upload logo (optional), write description, review summary card → Tap "Complete Profile" |
| 7 | **Discover tab loads** | Swipe cards appear with company profiles, match scores |

**Narrator script**: *"New users sign in via LinkedIn — one tap, no passwords. They're guided through a 4-step company profile setup. The AI uses this to find relevant B2B matches."*

---

## Scenario 2: Discover & Match Flow
**Goal**: Show swiping, viewing profiles, and getting a match.

| Step | Action | What to Show |
|------|--------|-------------|
| 1 | **View a card** | Scroll through card content — company name, match %, "Why this match" reasons, offerings, needs |
| 2 | Tap **"View Full Profile"** (bottom button) | CompanyExpandModal opens with full company details |
| 3 | Close modal | Tap X or swipe down |
| 4 | **Swipe left** (Pass) | Card animates left with "PASS" overlay |
| 5 | **Swipe right** (Interested) | Card animates right with "INTERESTED" overlay |
| 6 | Swipe right **2 more times** | On the 3rd right-swipe → **Match celebration screen** appears |
| 7 | **Match celebration** | Animated "It's a Match!" with partner avatars, match %, match reasons |
| 8 | Tap **"Chat Now"** | Opens chat with the matched company |
| 9 | Type a message and send | Message appears in chat bubble |
| 10 | Go back → Tap **"Schedule Meeting"** | (Navigate from match screen or chat header) |

**Narrator script**: *"Users discover partner companies through AI-ranked cards. Each card explains WHY it's a match. Swipe right to express interest — when both sides swipe right, it's a match. From there, they can chat or schedule a meeting."*

---

## Scenario 3: Matches, Chat & Profile
**Goal**: Show the ongoing engagement features.

| Step | Action | What to Show |
|------|--------|-------------|
| 1 | Tap **Matches tab** | List of matches — "New" section and "In progress" section |
| 2 | Tap a **new match** | Match celebration / detail screen |
| 3 | Go back → Tap an **active match** | Opens chat screen with conversation history |
| 4 | Tap **Messages tab** | Conversation list with last message preview, timestamps, unread badges |
| 5 | Tap a conversation | Chat screen with message history, "Why you matched" card pinned at top |
| 6 | Send a message | Real-time bubble appears |
| 7 | Tap **Profile tab** | Company profile card with all details — offerings, needs, deal preferences |
| 8 | Tap **"Edit"** button | Edit profile screen — modify company info, offerings, needs |
| 9 | Make a change → Tap **"Save"** | Updated profile |
| 10 | Tap **"Sign Out"** | Confirmation dialog → Returns to login |

**Narrator script**: *"Matched businesses can chat directly in-app. The 'Why you matched' insight stays pinned in every conversation. Users manage their company profile and deal preferences from the Profile tab."*

---

## Key Talking Points for Stakeholders

- **AI-Powered Matching**: Every card shows WHY it's a match — transparency builds trust
- **B2B-First Design**: Professional, clean UI designed for business users
- **Low Friction**: LinkedIn SSO, 4-step onboarding, swipe-based discovery
- **Full Engagement Cycle**: Discover → Match → Chat → Schedule Meeting
- **Offline-Ready Prototype**: Entire app works without a server — ready for investor demos
- **Cross-Platform**: Built with React Native/Expo — one codebase for iOS + Android

---

## Demo Credentials (if needed)

- **Email OTP**: Enter any email → Use code `123456`
- **LinkedIn**: One-tap sign in (emulated in demo mode)

---

**Last Updated**: Mar 21, 2026
