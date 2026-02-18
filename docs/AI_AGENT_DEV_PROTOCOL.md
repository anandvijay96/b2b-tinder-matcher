# AI Agent Development Protocol (AADP)

A structured, disciplined workflow for high-velocity software development using AI assistants. This protocol ensures continuity, code quality, and project visibility across multiple sessions.

## 1. Core Philosophy
*   **State Persistence**: The AI has no long-term memory between sessions. Documentation is the memory.
*   **Structure over Speed**: A well-defined roadmap (`GRANDPLAN.md`) prevents scope creep and confusion.
*   **Granular Progress**: Small, verifiable steps with frequent git commits.
*   **Clean Architecture**: Enforce modularity, DRY principles, and modern standards from line one.

---

## 2. Project Initialization

### 2.1 The Master Plan (`GRANDPLAN.md`)
Every project must start with a `docs/GRANDPLAN.md`. This is the source of truth for project status.

**Structure:**
*   **High-Level Vision**: 1-2 sentences on what we are building.
*   **Tech Stack**: Definitive list of tools (e.g., React Native, Expo, Supabase).
*   **Phased Roadmap**: Break the project into Phases (1, 2, 3...).
*   **Checklist**: Detailed tasks within phases.
    *   `[ ]` Pending
    *   `[x]` Completed
    *   `[-]` Skipped/Deprecated
*   **Session Log**: A table tracking session numbers, dates, and key outcomes.

### 2.2 Documentation Folder
Create a `docs/` directory at the root:
*   `docs/GRANDPLAN.md`: The roadmap.
*   `docs/handoffs/`: Directory for session summaries.
*   `docs/architecture/`: (Optional) Diagrams or technical specs.
*   `AGENTS.md`: (Root level) Specific rules for the AI agent (code style, behaviors).

---

## 3. The Development Cycle (Session Workflow)

### 3.1 Start of Session
1.  **Ingest Context**: Read the latest `SESSION_XXX_HANDOFF.md` and `GRANDPLAN.md`.
2.  **Verify State**: Check the current git branch and latest commit.
3.  **Update Plan**: Mark items as "In Progress" in your internal todo list.

### 3.2 Development Execution
*   **TDD First**: Where possible, write the test (or define the requirement) before the code.
*   **Modular & DRY**:
    *   Never duplicate logic. Extract utilities.
    *   Keep components small and focused (Single Responsibility Principle).
    *   Use strong typing (TypeScript) strictly.
*   **Filesystem Discipline**:
    *   Group related files (colocation).
    *   Use clear, descriptive naming conventions.

### 3.3 Version Control (Git)
*   **Frequent Commits**: Commit after every meaningful unit of work (e.g., "Add User service", "Fix login bug").
*   **Descriptive Messages**: Use conventional commits (e.g., `feat:`, `fix:`, `docs:`, `refactor:`).
*   **Safety**: Never commit broken code. Ensure the build passes before committing.

### 3.4 End of Session (The Handoff)
**CRITICAL**: This step ensures the "brain" of the project survives to the next session.

Create a new file: `docs/handoffs/SESSION_XXX_HANDOFF.md`.

**Content Requirements:**
1.  **Session Summary**: Brief overview of what was achieved.
2.  **Completed Tasks**: Bullet points of finished features/fixes.
3.  **Technical Decisions**: Why a certain library was chosen, or a schema changed.
4.  **Known Issues/TODOs**: What is broken or incomplete?
5.  **Prompt for Next Session**: A pre-written prompt block that the user can copy-paste to start the next session immediately.
    *   *Must include*: Current version, Context summary, Next immediate priorities.

---

## 4. Coding Standards & Best Practices

### 4.1 Architecture
*   **Separation of Concerns**: UI components should not contain heavy business logic. Use Services or Hooks.
*   **State Management**: Use appropriate stores (Zustand, Redux, Context) to avoid prop drilling.
*   **API Layer**: Abstract all external calls (API, Firebase, Supabase) into dedicated service files.

### 4.2 Quality Assurance
*   **Linting/Formatting**: Enforce ESLint/Prettier rules automatically.
*   **Testing**: Unit tests for logic-heavy services; Integration tests for critical user flows.
*   **Error Handling**: Fail gracefully. User-friendly error messages, not white screens of death.

---

## 5. Templates

### 5.1 GRANDPLAN.md Template
```markdown
# 🗺️ Project Grand Plan

## Vision
[Brief description of the project]

## 🛠️ Tech Stack
- Frontend: [e.g. React Native]
- Backend: [e.g. Node.js]
- Database: [e.g. PostgreSQL]

## 📅 Roadmap

### Phase 1: Foundation
- [x] Project Setup
- [ ] Authentication
- [ ] Database Schema

### Phase 2: Core Features
- [ ] Feature A
- [ ] Feature B

## 📝 Session Log
| Session | Date | Focus | Status |
|---------|------|-------|--------|
| 001     | ...  | Setup | Done   |
```

---

## 6. Docker & Dokploy Deployment Learnings

Hard-won lessons from deploying Bun/Hono monorepo APIs to Dokploy with Docker Compose.

### 6.1 Monorepo Workspace Dependencies in Docker
**Problem**: If your API package depends on a shared workspace package (e.g., `@myapp/shared: workspace:*`), a Dockerfile that only copies the API's `package.json` will fail with `Workspace dependency not found`.

**Fix**: Build from the **monorepo root context**, not the sub-package.
```yaml
# docker-compose.prod.yml
services:
  api:
    build:
      context: .                    # Monorepo root, NOT ./apps/api
      dockerfile: apps/api/Dockerfile
```
```dockerfile
# Dockerfile — copy ALL workspace package.json files
COPY package.json ./
COPY packages/shared/package.json ./packages/shared/package.json
COPY apps/api/package.json ./apps/api/package.json
RUN bun install
COPY packages/shared/ ./packages/shared/
COPY apps/api/ ./apps/api/
WORKDIR /app/apps/api
```

### 6.2 Bun Frozen Lockfile in CI/Docker
**Problem**: Bun auto-detects CI/Docker environments and enables `--frozen-lockfile` by default. If the root `bun.lock` references workspaces not present in the Docker context (e.g., a mobile app excluded via `.dockerignore`), the lockfile won't match and `bun install` fails with `lockfile had changes, but lockfile is frozen`.

**Fix**: **Do not copy `bun.lock`** into Docker when building a subset of a monorepo. Let Bun resolve fresh from `package.json`. The `BUN_FROZEN_LOCKFILE=0` env var does NOT reliably override this in all Bun versions.

### 6.3 devDependencies Needed at Runtime
**Problem**: `bun install --production` skips devDependencies. If your `CMD` runs a tool from devDependencies (e.g., `drizzle-kit push` for DB migrations), the container crashes immediately and Traefik returns 404 (no container to route to).

**Fix**: Use `bun install` (without `--production`) if any devDependency tool is needed at startup. Alternatively, move the tool to `dependencies`.

### 6.4 Dokploy Compose + Traefik Networking
**Problem**: Traefik runs on `dokploy-network`. By default, Docker Compose services are on their own isolated network. Traefik can't reach your container → returns `404 page not found`.

**Fix**: Add `dokploy-network` as an external network to the service that Traefik needs to route to:
```yaml
services:
  api:
    networks:
      - default          # Internal (for db communication)
      - dokploy-network  # External (for Traefik routing)

networks:
  dokploy-network:
    external: true
```

### 6.5 traefik.me Domains & HTTPS
**Problem**: Dokploy's auto-generated `*.traefik.me` domains do NOT support SSL/HTTPS. Accessing via `https://` may fail silently or show certificate errors.

**Fix**: Use `http://` for traefik.me domains. Only switch to `https://` after configuring a custom domain with Let's Encrypt in Dokploy.

### 6.6 .dockerignore for Monorepos
Always create a `.dockerignore` at the monorepo root when building from root context:
```
apps/mobile/
apps/web/
docs/
node_modules/
**/node_modules/
.git/
*.md
```
This prevents the entire mobile app (hundreds of MB) from being sent as Docker build context.

### 6.7 IP Address Access Returns 404
**Problem**: Hitting the server IP directly (e.g., `65.21.178.96/health`) returns Traefik's 404.

**Explanation**: Traefik routes based on **Host headers**, not IP. The IP doesn't match any configured Host rule. This is expected behavior, not a bug. Always use the configured domain name.

### 6.8 Debugging Checklist for "404 page not found" on Dokploy
If you see Traefik's 404 after a successful build:
1. **Check Logs tab** — Is the container actually running or did it crash on startup?
2. **Check networks** — Is `dokploy-network` added to the service?
3. **Check domain config** — Is the correct Service Name and Container Port set?
4. **Check protocol** — Use `http://` for traefik.me domains.
5. **Check CMD** — Does the startup command depend on any missing tools (devDependencies)?

---

### 6.9 EAS Update: Channel ↔ Branch Mismatch
**Problem**: OTA update published to `production` branch but the installed APK was built with `preview` profile (channel: `preview`). The app never detects the update.

**Explanation**: EAS builds have a **channel** (set in `eas.json` per build profile). EAS Update publishes to a **branch**. A channel maps to a branch (default: same name). An APK built with channel `preview` only checks the `preview` branch for updates.

**Fix**: Always publish OTA to the **same branch as the installed APK's channel**:
```bash
# If APK was built with --profile preview → channel is "preview"
eas update --branch preview --message "..."

# If APK was built with --profile production → channel is "production"
eas update --branch production --message "..."
```

**Best Practice**: Publish to ALL active branches when deploying critical updates:
```bash
eas update --branch preview --message "..."
eas update --branch production --message "..."
```

---

### 5.2 Handoff Document Template
```markdown
# Session [XXX] Handoff

## 📝 Session Summary
[Brief summary]

## ✅ Completed Tasks
- Task 1
- Task 2

## 🚧 Work in Progress / Known Issues
- Issue 1

## ⏭️ Next Steps
1. Priority Task 1
2. Priority Task 2

---
## 🤖 Prompt for Next Session
(Copy and paste this into the next chat)

I am continuing development on [Project Name].
Previous Session: [XXX]
Current Status: Phase [X] - [XX]% Complete.

Priorities for this session:
1. [Task 1]
2. [Task 2]

Please review `docs/GRANDPLAN.md` and `docs/handoffs/SESSION_[XXX]_HANDOFF.md` before starting.
```
