# Product Requirements Document (PRD)

## Product Name
Olympic Hockey Stats Tracker (Full-Stack Web)

## Document Owner
Product/Engineering

## Version
v2.1 (Single Full-Stack App: React + Vite)

## 1) Overview
Build a **single full-stack web application** that retrieves Olympic hockey statistics and live game data, then displays it in a modern browser-based UI built with **React + Vite**. The app should allow users to search and sort by team and player metrics to track standings and performance over time.

The solution must:
- Use **one deployable application** (not separate front-end/back-end apps).
- Use **React + Vite + TypeScript** for the UI.
- Include server-side API routes in the same project/runtime for provider integration, caching, and CSV export.
- Store configurable values (API endpoints, keys, update intervals, etc.) in environment variables.
- Keep UI theming in separate reusable files shared across views.
- Support both Olympic men’s and women’s hockey tournaments.
- Run in modern browsers and be deployable on Windows, macOS, and Linux.

---

## 2) Research Summary: Data Provider Selection
Goal: choose the source with the most frequent updates and richest hockey detail.

### Provider Candidates Evaluated
1. **Sportradar Ice Hockey/Olympic feeds (primary recommendation)**
   - Strengths: high-frequency live updates, broad event coverage, deep boxscore/player/team detail, strong historical support.
   - Tradeoffs: commercial licensing and API key required.
2. **Official Olympic/IOC public feeds (fallback)**
   - Strengths: official Olympic event context and schedule metadata.
   - Tradeoffs: public structures can change and may offer less detailed/consistent advanced stat depth.
3. **IIHF/public hockey sources (fallback)**
   - Strengths: useful as supplemental standings/schedule reference.
   - Tradeoffs: may not consistently provide Olympic live-play depth equivalent to commercial providers.

### Decision
- **Primary provider for V1: Sportradar** (or equivalent licensed enterprise feed with comparable frequency/detail).
- **Fallback strategy:** IOC/IIHF adapters retained as optional secondary sources for resilience.

---

## 3) Goals
1. Provide near-real-time visibility into Olympic hockey team standings and player statistics.
2. Enable fast filtering, searching, and sorting across key metrics.
3. Ensure maintainable full-stack architecture in a single codebase/runtime.
4. Make configuration portable and secure through `.env`-driven settings.
5. Support offline-aware behavior using cached server snapshots.
6. Allow CSV export for standings and player statistics.

## 4) Non-Goals (V1)
- No betting features or odds integrations.
- No user accounts/authentication in V1.
- No write-back to external provider systems.
- No dedicated native mobile app (responsive web only in V1 scope).
- No microservice split into separate independently deployed applications.

---

## 5) Users & Use Cases
### Primary Users
- Hockey fans tracking Olympic tournament progress.
- Analysts/journalists needing quick stat lookups.

### Core Use Cases
1. User opens app and sees live tournament summary (current games, scores, standings).
2. User searches for a player and views key stats (goals, assists, points, plus/minus, TOI if available).
3. User sorts team standings by points, goal differential, wins, etc.
4. User filters live games by group, stage, or country.
5. User refreshes data manually and/or lets auto-refresh run.
6. User continues viewing most recent cached data when live calls fail.
7. User exports current table view to CSV.

---

## 6) Functional Requirements

### 6.1 Data Acquisition
- Server routes in the same app must fetch data from Olympic hockey providers/APIs.
- Must support:
  - Team standings
  - Player statistics
  - Live game feed (score, period, time remaining, game state)
  - Tournament segmentation (men’s and women’s)
- Auto-refresh interval configurable via env var.
- Graceful handling of API failures/timeouts with retry/backoff.

### 6.2 Search
- Global search input in React UI that supports:
  - Team name (full/partial)
  - Player name (full/partial)
- Results update in-place with debounce (e.g., 250–400ms).
- Empty/invalid queries should not crash and should show clear UI state.

### 6.3 Sorting & Filtering
- Sortable columns in team and player tables.
- Multi-criteria sorting (optional V1.1, single-column required V1).
- Filters for:
  - Tournament (Men/Women)
  - Tournament stage (group/playoff/final)
  - Team
  - Position (for players)
  - Minimum games played

### 6.4 Web Views / UI
Required routes/screens:
1. **Dashboard** (live games + quick standings snapshot)
2. **Teams** (sortable standings/stat table)
3. **Players** (sortable/searchable player stats)
4. **Game Detail** (selected live game events/stat lines, if available)

UI requirements:
- Responsive layout for desktop/laptop and tablet.
- Loading skeletons and empty states.
- Error banner/toast when stale cache is shown.

### 6.5 Theming
- Theme tokens/styles isolated in dedicated front-end modules.
- Theme reusable globally across all screens.
- Support at least light and dark variants (dark can be default).

### 6.6 Configuration & Environment
- All runtime/config values (client + server) must come from environment variables.
- Use `.env` for local development and `.env.example` for documentation.
- Server config must validate required values at startup.

### 6.7 Runtime / Dev Environment
- Single project started via one command in development.
- Vite handles front-end build tooling.
- Integrated server process handles API proxy/integration, cache, and export endpoints.
- Production build outputs one deployable full-stack artifact.

### 6.8 Cache (Required)
- Integrated server persists last successful payloads to local cache storage.
- On connectivity/provider failure, server serves cached data with stale metadata.
- Front end shows visible “stale data” indicator and timestamp.

### 6.9 CSV Export (Required)
- Export current filtered/sorted team table to CSV.
- Export current filtered/sorted player table to CSV.
- Export endpoint returns downloadable file.
- Export file name pattern and delimiter configurable via env/default preferences.

---

## 7) Suggested Technical Architecture (Single App)

### 7.1 Repository Structure
- `app/` – single full-stack project
- `app/src/` – React + Vite client code
- `app/src/pages/*` – route-level views
- `app/src/components/*` – reusable UI components
- `app/src/features/*` – domain modules (teams, players, games)
- `app/src/theme/*` – design tokens, color modes, global styles
- `app/server/` – integrated server-side routes/services
- `app/server/routes/*` – API endpoints for standings/players/games/export
- `app/server/providers/*` – external provider clients/adapters
- `app/server/cache/*` – cache read/write + staleness handling
- `app/server/services/*` – business logic + transformations
- `app/server/models/*` – typed entities (Team, Player, Game, Standing)

### 7.2 Data Flow
1. React app triggers initial dashboard load.
2. Requests go to same-app server routes (`/api/*`).
3. Server calls provider adapters and normalizes payloads.
4. Cache stores latest successful snapshots.
5. Server returns normalized live or stale data with metadata.
6. React UI renders tables/cards and refreshes on configured interval.

### 7.3 Error Handling
- Distinguish between:
  - Network errors
  - API schema errors
  - Missing data
- Server returns typed error payloads.
- UI shows non-blocking notifications and fallback states.

---

## 8) Environment Variables (Initial)

### Single App (`app/.env`)
```env
# Runtime
APP_ENV=development
LOG_LEVEL=INFO
PORT=5173

# Provider
DATA_PROVIDER=sportradar
DATA_PROVIDER_BASE_URL=
DATA_PROVIDER_API_KEY=
DATA_PROVIDER_TIMEOUT_SECONDS=10

# Refresh/Retry
REFRESH_INTERVAL_SECONDS=30
MAX_RETRIES=3
RETRY_BACKOFF_SECONDS=2

# Tournament scope
DEFAULT_TOURNAMENT_YEAR=2026
DEFAULT_DIVISION=both   # men|women|both

# UI
DEFAULT_THEME=dark      # dark|light

# Cache
CACHE_ENABLED=true
CACHE_DIR=.cache
CACHE_TTL_SECONDS=300

# Export
EXPORT_DEFAULT_DIR=exports
EXPORT_DELIMITER=,
```

Notes:
- If provider does not require API key, keep variable present but optional in validation rules.
- Multi-provider support should be implemented through provider adapters.

---

## 9) Delivery Milestones
1. **M1 – Foundation (Week 1)**
   - Single full-stack Vite project scaffolded.
   - Integrated server routes scaffolded (`/api`).
   - Shared contracts and mock data.
2. **M2 – Core Stats UX (Week 2)**
   - Dashboard, Teams, Players pages complete.
   - Search/sort/filter working end-to-end.
3. **M3 – Live + Resilience (Week 3)**
   - Live game panel, refresh loop, cache fallback, stale indicators.
4. **M4 – Export + Hardening (Week 4)**
   - CSV export, error handling polish, performance checks, release docs.
