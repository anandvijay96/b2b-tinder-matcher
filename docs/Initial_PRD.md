<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# There's a requirement to build a Tinder kind of mobile app (please check youtube for any references and share them) . The twist is, this is for Business to Business matching.  This will be hosted in GCP .

Overview: This is a mobile first B2B estimation and networking  application for NMQ that connects verified businesses using AI driven intent matching. The product experience borrows interaction patterns from modern dating applications while maintaining trust, professionalism, and commercial clarity expected in B2B platforms.
The platform enables businesses to discover relevant partners faster, validate fit through AI generated summaries, and convert matches into conversations and meetings.

Attached screenshots are additional information on what we want to build, now imagine that you are a senior architect who has developed multiple mobile apps like these and even helped with bringing large profits over a short period of time. Your job now is to evaluate the idea and research the modern tools to build this solution. I would prefer Expo as it's faster to get a MVP product/app. Also
you can suggest what all options to consider in better-t-stack(https://www.better-t-stack.dev/new) as I'm planning to scaffold an error free project from there. Your main task is to generate a PRD which covers all the details I shared above and which I can take and start building using modern tools like Cursor, Antigravity etc., Since it'll be AI tools which will use this PRD, please make sure the idea is envisioned and detailed in a very indepth way. Please plan for an initial MVP and then a bit more usable one and a fully grade professional one towards the end. Provide OSS for references for faster development

Here is a detailed PRD and technical plan for a Tinder‑style, GCP‑hosted B2B matching app built with Expo plus a Better‑T‑Stack backend, including OSS and YouTube references you can use to move fast. The document is structured so tools like Cursor/Antigravity can directly turn it into code.

***

## Product vision

A mobile‑first B2B estimation and networking app that connects verified businesses based on intents such as “looking for contract manufacturing for aluminum parts” or “seeking agency to handle performance marketing in EU.”

The experience borrows familiar dating‑app interactions (swipe cards, double‑opt‑in matches, lightweight onboarding) while enforcing business trust, documentation, and clear next steps (chat, document sharing, meeting scheduling, estimation workflows).

***

## Objectives and success metrics

- Reduce time to discover a relevant partner from weeks to days or hours.
- Deliver explainable AI‑based matches that clearly state “why this match” to build trust.
- Convert a high percentage of matches into qualified conversations and scheduled meetings.

Example metrics:

- D1/D7 retention for businesses.
- Median time from signup to first match, and to first scheduled meeting.
- Match quality (thumbs‑up/down on “this was relevant”) and NPS post‑meeting.
- Volume of verified businesses onboarded and monthly active accounts.

***

## Target users and primary use cases

### Personas

- **Buyer / Estimation Lead**
    - Needs vetted vendors for RFQs, quick estimates, and capacity.
    - Cares about trust, delivery times, references, and pricing transparency.
- **Seller / Business Development Lead**
    - Wants qualified leads, not spam.
    - Cares about intent fit, deal size, and closing probability.
- **NMQ Operations / Admin**
    - Manages verification, fraud prevention, moderation, and high‑level analytics.


### Core use cases

- A manufacturer finds component suppliers matching detailed capability and MOQ needs.
- An agency finds SaaS companies looking for specific GTM support.
- A startup founder finds vetted implementation partners in a geography or vertical.
- NMQ runs curated “programs” (e.g., “EU compliance vendors”) using the same matching core.

***

## Release scope by phase

### Scope evolution table

| Area | Initial MVP | Usable v1.1 | Production‑grade v2 |
| :-- | :-- | :-- | :-- |
| Auth \& onboarding | LinkedIn SSO, email OTP; minimal business profile | Multi‑user teams per company, role‑based access | SSO (Azure AD/Google Workspace), audit logs, org‑level settings |
| Profiles \& verification | Basic company details, industries, offers/needs, manual NMQ verification | Upload documents, simple doc approval workflow | KYB integrations, automated risk scoring, tiered verification badges |
| Intent capture \& AI | Text fields for “What we offer / need”; baseline embedding‑based matching | Structured intents (categories, budget, geography), AI‑generated intent summaries | Multi‑modal signals (behavior, feedback), adaptive ranking, segment‑specific models |
| Discovery UX | Tinder‑style swipe deck, basic filters (industry, location) | Saved filters, “AI picks”, negative feedback loop for bad matches | Campaigns (“Open for RFQs”), programmatic cohorts, sponsored placements |
| Matching logic | Double‑opt‑in matches only, deterministic “min bar” filters | Explainability cards (“Matched because…”) and reranking | Multi‑objective optimization (fit, recency, diversity); A/B‑tested strategies |
| Communication | In‑app 1:1 chat, text only | File attachments, templated messages (RFQ, intro) | Threaded conversations, integrations to email/Slack, export logs |
| Scheduling | Simple proposer suggests 2–3 slots, manual confirmation | Time‑zone handling, calendar invites via ICS | Calendar integration (Google/M365), reminders \& rescheduling workflows |
| Admin \& analytics | Basic admin dashboard with manual moderation | Funnel analytics (onboarding → match → meeting), segment performance | Cohort analysis, pricing experiments, fraud dashboards, BI integration (BigQuery/Looker) |
| Monetization | Free to use; track usage only | Simple paid plans with higher daily discovery limit | Tiered SaaS (per seat / per org), pay‑per‑lead experiments, in‑app upsells |


***

## User flows and engagement loop

### Core engagement loop (aligned with your table)

1. **Profile** – Business onboarding, capture “offer” and “need” plus key attributes.
2. **Verification** – NMQ approval of entity, docs, and LinkedIn‑based identity.
3. **AI Discovery** – Embedding‑based semantic matching of offers and needs.[^1][^2]
4. **Swipe Interaction** – AI‑ordered deck; user makes quick decisions (left/right). Inspired by React Native swipe card components.[^3][^4][^5]
5. **Mutual Match** – Double‑opt‑in confirmation; match record created.[^6]
6. **Real‑Time Chat** – Businesses converse, share docs, clarify scope.
7. **Meeting Setup** – Scheduler proposes time slots and captures confirmed meeting.

This loop must be fast to complete, with visible trust signals and clear explanations at each step.

***

## Key UX screens

These align with the wireframes and tables you shared:

- **Welcome \& Login**
    - Options: “Login with LinkedIn” and “Email/OTP”.
    - Shows NMQ branding, short value prop, and trust markers.
- **Profile Builder**
    - Multi‑step wizard to collect: company basics, capabilities, interests, intent (“Looking for”, “Can provide”), deal size preferences, geography, and documents.
    - AI assistant helps summarize “What we offer” and “What we need.”
- **Swipe Deck**
    - Card‑based discovery of potential partners; each card shows company name, logo, location, high‑level offers/needs, badges (verified, response speed).
    - Swipe right/left, with tap to open full profile and AI explanation.
- **Match Confirmation (“It’s a Match”)**
    - Shows both logos and top‑3 reasons the match is relevant.
    - CTAs: “Chat now” and “Schedule meeting”.
- **Chat Interface**
    - Real‑time messaging with typing indicators, unread counts.
    - Support for attachments (PDFs, images) and canned actions (Send RFQ, Send capability deck).
- **Scheduler**
    - Suggest a few time slots, respecting both parties’ time zones.
    - Optional link out to calendar invite while storing meeting metadata in app.
- **Admin Dashboard (Web)**
    - Business verification queue, dispute handling, content moderation.
    - KPI tiles: active users, swipe → match conversion, match → meeting conversion.

***

## Functional requirements by feature area

### Authentication and access

- Support LinkedIn OAuth for business users; use LinkedIn API to pull company and profile basics for identity validation and to reduce friction.
- Email OTP login as backup for users who cannot use LinkedIn (send codes via Firebase Auth or custom email service).[^7][^8]
- Basic RBAC:
    - Roles: Owner, Member, Admin.
    - Permissions: manage company profile, send messages, manage billing (later phase).


### Company profile \& verification

- Required fields: legal name, brand name, website, HQ location, industry, employee range, core offerings, core needs, key contacts.
- Optional but recommended: certifications, reference customers, documents (e.g., ISO, capability deck).
- Verification workflow:
    - Automatic checks (domain vs email, LinkedIn consistency).
    - Manual review by NMQ admins.
    - Verification badge levels (e.g., “Verified identity”, “Verified documents”).


### Intent capture and AI understanding

- Intent schema:
    - “Offers” (what the company sells or can deliver).
    - “Needs” (what the company is actively seeking).
    - Metadata: industries served, geographies, deal sizes, preferred engagement models.
- AI processing:
    - Generate dense embeddings from free‑form text using Vertex AI Text Embeddings (e.g., `gemini-embedding-001`).[^1][^2]
    - Store embeddings in a vector store (Vertex AI Vector Search or pgvector) keyed by company and intent type.[^2][^1]
    - For each user session, compute an embedding for their active intent and run a semantic similarity search to produce candidate matches.[^1][^2]
- Explainability:
    - For each match, present a bullet list “Matched because: overlapping markets, complementary offers/needs, same geography”, derived from overlapping fields plus semantic similarity.


### Discovery and swipe deck

- Card stack showing one candidate at a time, with support for:
    - Swipe right (interested), swipe left (pass), super‑like (later).
    - Undo last swipe (premium / later).
- Implementation should reuse OSS swipe libraries such as:
    - `rn-tinder-card` for lightning‑fast and customizable swipe cards.[^4]
    - Or `react-native-tinder-swipe` which allows using custom React Native components as card content.[^3]
    - Tutorials on implementing Tinder‑like swiping in React Native help as reference.[^5]
- Filters:
    - Industry, company size, geography, verification level.
    - Later: budget bands, tech stack tags, language.


### Matching and notifications

- Matching rules:
    - Only create a match when both parties swipe right.
    - Prevent duplicate active matches between the same pair.
- Notifications:
    - Push notifications for: new matches, new messages, meeting proposals, verification updates.
    - Use Expo Notifications + Firebase Cloud Messaging; guides show how to wire Expo with FCM and request tokens.[^9][^10][^11]
- Rate limits:
    - Daily swipe limit per user and per company; extend in paid tiers.


### Messaging and collaboration

- In‑app chat:
    - 1:1 threads per match with persistent history.
    - Support for basic markdown or rich text later.
- Attachments:
    - Upload capability decks, NDAs, SOWs; store in GCS.
- “Why this match?” card pinned at top of chat.


### Scheduling and estimation

- Scheduler:
    - Propose up to 3 slots; capture acceptance/rejection.
    - Store local times and convert to UTC.
    - Generate optional ICS files for calendar integration.
- Estimation support (later phases):
    - Structured RFQ form templates.
    - Status tracking from “Draft RFQ” → “Sent” → “Responded” → “Won/Lost”.


### Admin and governance

- Admin web app:
    - Business verification queue with search and filters.
    - Content flagging: suspicious profiles, spam messages.
    - Ability to soft‑ban and re‑verify companies.
- Governance:
    - Terms acceptance, data handling disclosures, clear reporting mechanisms.

***

## Non‑functional requirements

- **Performance**: Card swipes should feel instant; latency to fetch next set of candidates under 300 ms p95 on good networks.
- **Availability**: Target 99.5%+ uptime for early stages; design for 99.9% later.
- **Scalability**: Architecture should scale from hundreds to tens of thousands of businesses via autoscaled Cloud Run services and managed databases.
- **Security \& compliance**:
    - Encrypted data at rest (GCP default) and in transit (HTTPS).
    - Protect PII and business documents; restrict internal access.
- **Instrumentation**:
    - Use Firebase Analytics / GA4 and custom event tracking for swipes, matches, chats, meetings.[^8]

***

## High‑level architecture (GCP)

### Component overview

| Component | Tech choice | Responsibility |
| :-- | :-- | :-- |
| Mobile app | Expo React Native | All user interactions, swipe deck, chat UI |
| API / BFF | Better‑T‑Stack with Hono + tRPC, deployed to Cloud Run | Type‑safe API surface, auth, orchestration, validation [^12][^13] |
| AI service | Node/Bun service using Vertex AI SDK | Generate embeddings, run semantic matching and explanations [^1][^2] |
| Data layer | libSQL (Turso) or Cloud SQL via Drizzle; possibly Firestore | Structured data (users, companies, matches, messages) [^13][^7] |
| Vector search | Vertex AI Vector Search or pgvector | Store and query embeddings for offers/needs [^1][^2] |
| Auth \& identity | LinkedIn OAuth + Better‑Auth or Firebase Auth | Business identity plus session management [^13][^7] |
| Realtime chat | Firestore or a chat microservice (WebSockets) | Low‑latency messaging between matched users [^7] |
| Notifications | Expo Notifications + FCM | Push notifications cross‑platform [^9][^10][^11] |
| Storage | Cloud Storage | Documents and media uploads |
| Analytics | Firebase Analytics, BigQuery, Looker | Product analytics and reporting [^8] |
| Admin web | React (Better‑T‑Stack template) | Admin console, governance [^12][^13] |


***

## Using Better‑T‑Stack for the backend

Better‑T‑Stack is a modern TypeScript monorepo template using Bun, Hono, tRPC, Drizzle ORM, and libSQL/turso, designed for end‑to‑end type safety.[^12][^13]

Recommended layout:

- `apps/mobile`: Expo app.
- `apps/api`: Hono + tRPC API server exposing:
    - `/auth` (LinkedIn callback, session endpoints).
    - `/profiles`, `/intents`, `/matches`, `/messages`, `/scheduling`.
- `apps/admin`: React web app for NMQ admins.
- `packages/contracts`: Zod schemas and tRPC router definitions shared across client and server.
- `packages/db`: Drizzle schema for core tables (Company, User, Intent, Match, Message, MeetingSlot, VerificationRequest).

Deployment:

- Build `apps/api` as a container and deploy to Cloud Run.
- Use Drizzle migrations to keep DB schema in sync.
- Configure environment for Vertex AI credentials in Cloud Run to call the Text Embeddings API for semantic similarity tasks.[^1][^2]

***

## Expo, Firebase, and push notifications

### Firestore / database connectivity from Expo

Expo‑managed React Native apps can connect directly to Firestore using the web SDK; they require a `metro.config.js` tweak to support `.cjs` modules, as documented in community answers.[^7]

For more advanced use cases, React Native Firebase can be integrated into Expo apps via `expo-dev-client` and config plugins for native modules, as shown in guidance on adding `@react-native-firebase` to Expo projects.[^14]

### Expo + FCM push notifications

- Use `expo-notifications` on the client to handle permission prompts and to retrieve Expo or FCM push tokens.[^9][^10]
- Configure FCM/APNs keys and use the documented pattern to send notifications via FCM endpoints or directly from a Cloud Run “notification service.”[^10][^11][^9]
- Set up config plugins as in community examples to resolve conflicts between Expo Notifications and React Native Firebase messaging on Android, ensuring background notifications function reliably.[^10]

This setup keeps most native complexity abstracted while still using Firebase’s messaging infrastructure.[^11][^9][^10]

***

## AI matching design with Vertex AI

Vertex AI’s Text Embeddings API converts text into dense vectors that capture semantic meaning, enabling high‑quality matching beyond keyword overlap.[^1][^2]

Design:

- For each company profile, generate embeddings for:
    - Offers (what they provide).
    - Needs (what they seek).
- Use `task_type=SEMANTIC_SIMILARITY` to support similarity ranking between offers and needs within and across companies.[^2]
- Store vectors in Vertex AI Vector Search or a pgvector‑enabled database; queries return the top‑N most semantically similar candidates for the current user’s active intent.[^1][^2]
- Combine semantic scores with hard filters (industry, geography, verification level) and feedback signals (negative swipes, positive matches) to produce a final ranking.

***

## Implementation phases

### Phase 1 – Initial MVP (4–6 weeks)

Goal: Prove core loop works – onboarding → swipe → match → chat → schedule meeting.

Included:

- Expo mobile app with:
    - LinkedIn SSO + email OTP.
    - Company profile builder (minimal fields).
    - Swipe deck powered by `rn-tinder-card` or `react-native-tinder-swipe`.[^3][^4]
    - Basic filters and settings.
- Backend:
    - Better‑T‑Stack API deployed to Cloud Run with Drizzle/libSQL for core data.[^13]
    - Vertex AI embeddings for matching; simple cosine similarity search.[^1][^2]
    - Firestore or a minimal messaging table with polling/long‑poll endpoints for chat.[^7]
- Notifications:
    - Push notifications for new matches and messages using Expo + FCM.[^9][^10]
- Admin:
    - Simple admin web for manual verification, user search, and metrics.

Deliverables: Working app testable by early pilot customers; basic instrumentation.

### Phase 2 – Usable product (additional 6–10 weeks)

Goal: Make the product sticky and commercially valuable.

Add:

- Richer intent modeling (categories, budgets, geographies) and better AI ranking.
- AI explanations for matches.
- Real‑time chat (WebSockets or Firestore real‑time listeners).
- Improved scheduler with time‑zone handling and ICS generation.
- Admin analytics: funnels, segment performance; push data into BigQuery.[^8]
- Simple monetization: daily swipe caps and a “business class” plan with higher limits.


### Phase 3 – Production‑grade platform

Goal: Robust, scalable, and monetizable product suitable for large enterprises.

Add:

- Organization accounts, multi‑user teams, and fine‑grained permissions.
- Stronger verification (KYB integrations, risk scores).
- Campaigns and programs (curated discovery tracks).
- BI integration via Looker, advanced segmentation and pricing experiments.[^8]
- Hardening:
    - SLOs and scaling policies.
    - Rate limiting, abuse detection, audit logs.

***

## Open‑source and reference material

### Tinder‑style UX and architecture

- System design and microservices architecture explanations for Tinder‑like apps:
    - “Tinder Microservices Architecture | Online Dating App System Design.” [^15]
    - “Tinder: Low‑Level System Design.”[^16]
- General tutorial on building Tinder‑like dating apps (good for feature breakdown and business logic thinking):[^17]


### B2B / professional networking inspirations

- Shapr – “Tinder for entrepreneurs” with professional, swipe‑based networking.[^6]
- CoffeeSpace‑style app that matches co‑founders and investors using Tinder‑like UX; interview shows workflow and premium feature model.[^18]


### React Native swipe UI and tutorials

- `rn-tinder-card` – lightning fast, customizable Tinder‑like swipe card for React Native.[^4]
- `react-native-tinder-swipe` – customizable swipe cards simulating Tinder interface.[^3]
- Detailed tutorial “How to Build React Native Swipe Cards Inspired by Tinder.”[^5]


### Better‑T‑Stack templates

- Better‑T‑Stack official GitHub repo with Hono, tRPC, Drizzle, Better‑Auth, Tailwind, etc., suitable for your backend/API and admin web.[^13]
- Template description and capabilities overview (frontend + backend choices, monorepo layout, Bun runtime).[^12]


### Expo, Firebase, and notifications

- Connecting Firestore to Expo‑managed React Native apps (metro config and initialization).[^7]
- Expo + Firebase boilerplate / tutorials on using Firebase SDK with Expo.[^8]
- Guides for integrating Firebase Cloud Messaging with Expo, including using `expo-notifications`.[^9][^10][^11]
- Expo + React Native Firebase guidance for managed projects.[^14]


### Vertex AI embeddings

- Vertex AI Text Embeddings API docs, including examples with `gemini-embedding-001` and semantic similarity usage.[^1][^2]

***

If you want, a next step could be turning this PRD into a concrete repo blueprint: folders, example schemas, and initial API contracts that Cursor/Antigravity can use to scaffold code automatically.
<span style="display:none">[^19][^20][^21][^22][^23][^24][^25][^26][^27][^28][^29]</span>

<div align="center">⁂</div>

[^1]: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/embeddings/get-text-embeddings

[^2]: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/model-reference/text-embeddings-api

[^3]: https://github.com/pedrorosarioo/react-native-tinder-swipe

[^4]: https://github.com/Joehoel/rn-tinder-card

[^5]: https://instamobile.io/blog/react-native-swipe-cards-tinder/

[^6]: https://fintechnews.hk/1072/various/shapr-matchmaking-app-a-tinder-for-entrepreneurs/

[^7]: https://stackoverflow.com/questions/72735741/connecting-firestore-to-expo-managed-react-native-app

[^8]: https://www.youtube.com/watch?v=mZlKwRV4MC8

[^9]: https://www.magicbell.com/blog/how-to-integrate-firebase-cloud-messaging-with-expo

[^10]: https://dev.to/totoledao/a-quick-guide-to-push-notifications-with-expo-notifications-and-firebase-3lf4

[^11]: https://docs.expo.dev/push-notifications/sending-notifications-custom/

[^12]: https://shadcn.io/template/amanvarshney01-create-better-t-stack

[^13]: https://github.com/AmanVarshney01/Better-T-Stack

[^14]: https://github.com/invertase/react-native-firebase/issues/6990

[^15]: https://www.youtube.com/watch?v=XFQIW2R_Klk

[^16]: https://www.youtube.com/watch?v=gQTI5HSVGfE

[^17]: https://www.youtube.com/watch?v=R69i5dHdk2c

[^18]: https://www.youtube.com/watch?v=G-qFkXX2jZ4

[^19]: image.jpg

[^20]: image.jpg

[^21]: image.jpg

[^22]: image.jpg

[^23]: image.jpg

[^24]: Vijay's Latest Resume(ReactJS).pdf

[^25]: https://dig2eco.ztu.edu.ua/wp-content/uploads/2023/06/maket_pidruchnik_digeco_31.05.23-u-vidavnicztvo.pdf

[^26]: https://news.ycombinator.com/item?id=24038520

[^27]: https://www.puebla.tecnm.mx/wp-content/archivos/CentroInformacion/PDFs/HARVARDBUSINESS/July-August_2022.pdf

[^28]: https://hnhiring.com/june-2020

[^29]: https://www.academia.edu/17231123/Apress_Big_Data_Bootcamp_What_Managers_Need_to_Know_to_Profit_from_the_Big_Data_Revolution_2014

