# Roadmap OS: Phase A audit (completed 2026-10-03, against main @ b922317)

Verified: `npm run check` passes; `npm run build` passes (~1,940 static pages); re-running the generator reproduces committed data except the date in `data/meta.json`. Live URL could not be driven from the audit sandbox (proxy-blocked); verify against local `next start`.

## Architecture
- Next.js 16.3.6 App Router, React 19.2, Tailwind 4, next-themes, react-markdown. No state library, no test runner.
- Curriculum pages are static server components reading `data/*.json` via `lib/data.ts`. Client widgets read the compact `data/client-index.json` via `lib/progress.ts`.
- Curriculum pipeline: master .md -> `curriculum/generator/parse_master.py` -> `reconcile_data.py` (206-week schedule) -> `engine.py` -> `build_data.py` -> `data/*.json`; `scripts/validate-data.mjs` runs in `prebuild`.
- State: one `UserState` document (`types/state.ts`, STATE_VERSION=1) in a hand-rolled `useSyncExternalStore` store (`lib/store.ts`), mutated by `lib/actions.ts`, saved via `PersistenceAdapter` (`lib/persistence/`), localStorage key `roadmap-os:state:v1`, 300 ms debounced save, cross-tab sync via the `storage` event.
- UserState fields: checks, topics (mastery, depth, evidence, reviews{count,last}), gates, weeks, projects (status, milestones, quality, repoUrl), resources, flags, notes, dsa, stories, applications, aiLog.
- Routes: `/` and `/today` (Today), `/progress`, `/weeks`, `/weeks/[cw]`, `/timeline`, `/curriculum`, `/phases/[id]`, `/topics/[id]`, `/concepts/[slug]`, `/checkpoints`, `/checkpoints/[id]`, `/graph`, `/projects`, `/projects/[id]`, `/resources`, `/search`, `/search-index.json`, `/dsa`, `/career`, `/notes`, `/ai`, `/guide`, `/settings`.

## Data-safety defects to fix in Phase B
1. Corrupt stored JSON: `load()` returns null, app starts empty, the next save overwrites the recoverable raw data.
2. Save failures (quota/private mode) are swallowed silently; user believes progress is saved.
3. 300 ms debounce, no flush on `pagehide` / `visibilitychange`: last edits can be lost.
4. Import only checks for a `checks` key; no schema validation; replaces everything with no pre-import backup. Reset also takes no backup.
5. No migration system: `normalize()` always stamps `version: STATE_VERSION`. (Unknown fields do survive via spread; keep that.)
6. `setMastery` below 4 deletes review history.
7. `normalize()` shallow-copies arrays without validating elements; a malformed topic/DSA record can crash derived code.

## Gap analysis against the V2 brief
- Backup/import/export: basic JSON export/import in `components/SettingsView.tsx` only.
- Today (`components/Today.tsx`): strong. Shows current week, next 5 items, build, gate warning, AI line, due re-tests, DSA due, notes. The "Session plan" ticks (`meta.dailyWorkUnit`) are in-memory `useState` and reset on reload; nothing is recorded.
- Reviews (`dueReviews`/`recordReview` in `lib/progress.ts`, `lib/actions.ts`): topic-level, intervals from `idx.retest` = [2,7,30,90,180]; only a "Passed" button; no fail path, no history; first pass promotes mastery 4 -> 5.
- Active modes A-F: exist only as prose in `data/meta.json` `operatingRulesMd` (master section 0.3). No stored mode, no switcher.
- Projects: `data/projects.json` has ~2 generated milestones per project (id like PR01-M1, with cw, text), a quality profile, and `ProjectProgress` has only status/milestones/quality/repoUrl. Notes via `NotesEditor`. No per-milestone evidence/decisions/metrics.
- Evidence: free-text only (topic.evidence, gate.evidence, aiLog). No reusable model.
- Command palette: none. `components/SearchView.tsx` + `/search-index.json` + `data/client-index.json` can back it. Only keydown handler today is Escape in AppShell.
- DSA (`components/DsaJournal.tsx`): patterns, mistake log, attempts, status, manual `revisitOn` with +3/+7/+30 buttons. No attempt history, clean-solve date, or automatic queue.
- Graph (`components/DependencyGraph.tsx`): stage filter, node select, upstream/downstream highlight, list mode. No pan/zoom.
- PWA: none (no manifest, no service worker).
- Socratic AI: none. `/ai` shows overlay tiers/modes/missions and the AI log. `lib/ai.ts` derives tier (from gates) and Learn/Build mode (from topic mastery).

## Spot-check corrections (2026-10-03, on the Windows working copy, v2 @ 108194a)
All claims above re-verified against the code: architecture, state fields, routes, the seven data-safety defects and the gap analysis are accurate. Additions:
- The generator entry points are `parse_master.py` then `build_data.py` (which imports `reconcile_data`, `engine`, `render`); `npm run data:build` runs them via `python3`.
- With `core.autocrlf=true` the working copy of the master has CRLF line endings, so `md5sum` on disk gives `d19cf26d...`. The committed blob is `c85d55c0...`, and the generator reads in text mode (CRLF -> LF), so it still records the correct MD5. Do not "fix" the file; compare with `git show HEAD:<path> | md5sum`.
- No test runner and no Playwright package are installed (Playwright browsers are cached, the package is not). UI checks use the Claude desktop browser pane against `next start` rather than adding Playwright.
- Cross-tab sync replaces the whole document on every `storage` event, so an edit made in the 300 ms debounce window of one tab can be overwritten by another tab's save. Low risk with one user; noted, not changed.
- Vitest 5 requires `@types/node` >= 22; Vitest 4 is used to keep the existing `@types/node@20`.

## Planned approach for Phase B
Keep storage key. Add a migration registry (v1 -> v2) and hand-written validators (no new runtime deps). On parse failure, quarantine the raw string under a separate key instead of overwriting. Flush on pagehide/visibilitychange and surface save failures in the UI. Automatic snapshot before import/reset (ring buffer of a few snapshots in localStorage). Export a versioned envelope {app, schemaVersion, exportedAt, curriculumMd5, state}; still accept bare v1 exports. Show "last backup" in Settings and a gentle backup prompt. Add Vitest for store/migration/validator/scheduler tests. Prepare a cloud adapter interface (Supabase env vars already documented in `.env.example`) without making anything depend on it.
