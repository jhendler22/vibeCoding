# Product Requirements Document (PRD)

## Product Name
Olympic Hockey Stats Tracker

## Document Owner
Product/Engineering

## Version
v1.1 (Decision Update)

## 1) Overview
Build a Python application that automatically retrieves Olympic hockey statistics and live game data, then displays it in a user-friendly GUI. The app should allow users to search and sort by team and player metrics to track standings and performance over time.

The solution must:
- Use a Python virtual environment (`venv`) for local development/runtime isolation.
- Store configurable values (API endpoints, keys, update intervals, etc.) in environment variables.
- Keep GUI theming in a separate, reusable file that can be shared across views.
- Support both Olympic men’s and women’s hockey tournaments.
- Run on Windows, macOS, and Linux.

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
3. Ensure clean architecture for maintainability (data layer, domain layer, GUI layer, theme layer).
4. Make configuration portable and secure through `.env`-driven settings.
5. Support offline cache behavior so the app remains usable during temporary connectivity loss.
6. Allow CSV export for standings and player statistics.

## 4) Non-Goals (V1)
- No betting features or odds integrations.
- No user accounts/authentication in V1.
- No write-back to external provider systems.
- No mobile app (desktop/web-desktop only in V1 scope).

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
6. User continues viewing most recent cached data when offline.
7. User exports current table view to CSV.

---

## 6) Functional Requirements

### 6.1 Data Acquisition
- The app must fetch data from Olympic hockey data providers/APIs.
- Must support:
  - Team standings
  - Player statistics
  - Live game feed (score, period, time remaining, game state)
  - Tournament segmentation (men’s and women’s)
- Auto-refresh interval configurable via env var.
- Graceful handling of API failures/timeouts with retry/backoff.

### 6.2 Search
- Global search input that supports:
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

### 6.4 Views / GUI
- Primary implementation: Python desktop GUI (`PySide6` recommended).
- Required screens/panels:
  1. **Dashboard** (live games + quick standings snapshot)
  2. **Teams** (sortable standings/stat table)
  3. **Players** (sortable/searchable player stats)
  4. **Game Detail** (selected live game events/stat lines, if available)
- Responsive layout for common laptop resolutions.

### 6.5 Theming
- Theme definition must be isolated in a dedicated file/module.
- Theme should be reusable globally across all screens.
- Support at least light and dark variants (dark can be default).

### 6.6 Configuration & Environment
- All runtime/configurable values must come from environment variables.
- Use `.env` + loader for local development.
- Include `.env.example` with required keys documented.

### 6.7 Virtual Environment
- Project must include clear setup instructions using `python -m venv .venv`.
- All dependencies installed in `.venv` only.

### 6.8 Offline Cache (Required)
- Persist last successful payloads to local cache storage.
- On connectivity/provider failure, show cached data with a visible “stale data” indicator and timestamp.
- Auto-recover to live mode when connection returns.

### 6.9 CSV Export (Required)
- Export current filtered/sorted team table to CSV.
- Export current filtered/sorted player table to CSV.
- Export file path and delimiter configurable via env/default preferences.

---

## 7) Suggested Technical Architecture

### 7.1 Python-Native Architecture (Primary)
- `app/main.py` – app entry point
- `app/config.py` – env var loading/validation
- `app/data/clients/*.py` – external API clients
- `app/data/repositories/*.py` – normalized data access
- `app/services/*.py` – business logic (standings, rankings, transformations)
- `app/cache/*.py` – local cache read/write + staleness handling
- `app/export/csv_exporter.py` – CSV export service
- `app/gui/views/*.py` – screens/components
- `app/gui/widgets/*.py` – reusable GUI widgets
- `app/gui/theme.py` – universal theme definitions
- `app/models/*.py` – typed entities (Team, Player, Game, Standing)

### 7.2 Alternative Option: Vite + TypeScript Front-End
Because you suggested Vite/TypeScript as an alternative, this is a valid option if preferred for richer table UX:
- Front-end: Vite + React + TypeScript.
- Back-end: Python (`FastAPI`) for provider integrations/cache/export logic.
- Packaging choices:
  - Browser-hosted internal app, or
  - Desktop bundle via Tauri/Electron if local desktop distribution is needed.

**Recommendation:** keep Python-native GUI as default for fastest delivery to the original requirement, while preserving a migration path to Vite/TS if UI complexity grows.

### 7.3 Data Flow
1. GUI triggers initial load.
2. Service layer requests repositories.
3. Repositories call API clients and normalize provider-specific fields.
4. Services compute derived metrics (e.g., points per game).
5. Cache layer stores latest successful snapshots.
6. GUI binds data to tables/cards and updates on refresh timer.

### 7.4 Error Handling
- Distinguish between:
  - Network errors
  - API schema errors
  - Missing data
- Show non-blocking notifications in GUI.
- Use last known good cached data when available.

---

## 8) Environment Variables (Initial)

```env
# Runtime
APP_ENV=development
LOG_LEVEL=INFO

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

# UI/Theme
THEME_MODE=dark         # dark|light

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

## 9) UX Requirements
- Fast startup (<3 seconds in normal network conditions).
- Table interactions (sort/filter/search) should feel immediate.
- Clear empty/error/loading states.
- Keyboard-friendly navigation for search and table traversal.
- Visible stale/offline banner when serving cached data.

---

## 10) Performance Requirements
- Initial data load target: <= 2.5s on stable broadband.
- Periodic refresh should not freeze UI thread (use worker thread/async task).
- Search/filter operations on currently loaded dataset should complete <= 100ms for typical tournament-size data.
- Cache read fallback should render within <= 500ms after network failure detection.

---

## 11) Security & Compliance
- Secrets (API keys) only from env, never hardcoded.
- `.env` excluded from version control.
- No personally sensitive data expected; still sanitize logs and avoid dumping raw credentials.

---

## 12) Observability
- Structured logging for fetch, transform, cache, export, and GUI update cycles.
- Log levels controlled by env var.
- Optional telemetry hooks for API latency, refresh success rate, and cache-hit ratio.

---

## 13) Testing Strategy
- Unit tests:
  - API response normalization
  - standings/stat calculations
  - config validation
  - cache freshness logic
  - CSV export formatting
- Integration tests:
  - API client + repository contract tests with mocked responses
- GUI tests:
  - smoke tests for rendering major views
  - sorting/search behavior tests where feasible

---

## 14) Delivery Milestones
1. **M1 – Foundation**
   - Project scaffolding, venv setup docs, env config loader, base GUI shell, theme module.
2. **M2 – Data Layer + Cache**
   - Provider integration, models, repositories, refresh pipeline, offline cache.
3. **M3 – Core UX**
   - Dashboard, men/women toggles, team/player tables, sorting/search/filter.
4. **M4 – Export + Hardening**
   - CSV export, error states, logging, tests, packaging for Windows/macOS/Linux.

---

## 15) Acceptance Criteria (V1)
- App runs from inside `.venv` and launches successfully on Windows, macOS, and Linux.
- `.env` controls provider URL, API key, refresh interval, cache behavior, and theme.
- Live game panel updates automatically at configured interval.
- Team standings and player stats are visible, searchable, and sortable for both men’s and women’s tournaments.
- Theme is loaded from a standalone module and applied globally.
- App falls back to cached data when offline and clearly indicates stale timestamp.
- User can export displayed team/player stats to CSV.

---

## 16) Resolved Product Decisions (from stakeholder feedback)
1. **Data source:** prioritize the most frequently updated, most detailed provider (Sportradar-class feed).
2. **Tournament scope:** both men’s and women’s tournaments in V1.
3. **Platform scope:** Windows, macOS, Linux.
4. **Offline behavior:** required in V1 (cache + stale indicator).
5. **Export:** CSV required in V1.
6. **Alternative stack:** Vite + TypeScript is viable; keep as optional architecture path.
