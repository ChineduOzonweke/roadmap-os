# V2 progress log (update after every phase)

Branch: v2   Baseline: main @ b922317

| Phase | Scope | Status | Commit |
|---|---|---|---|
| A | Audit + architecture map | done (see ROADMAP_OS_V2_AUDIT.md) | n/a |
| B | Data safety / persistence / export / import | done | 28f46a2 (pushed) |
| C | Today + daily execution engine | done | phase C commit |
| D | Review queue + mastery retention | not started | |
| E | Active Mode switcher | not started | |
| F | Project milestones + evidence | not started | |
| G | Portfolio / README export | not started | |
| H | Command palette + DSA enhancements | not started | |
| I | Graph pan/zoom + PWA | not started | |
| J | Socratic AI layer (provider abstraction only, no secrets) | not started | |

## Phase B summary
- Load path: every stored/synced/imported document goes through `readDocument` = migration registry (`lib/persistence/migrate.ts`) + hand-written validator/repair (`lib/persistence/sanitize.ts`). Unknown fields preserved at every level.
- Unparseable or partly malformed stored data is quarantined (`roadmap-os:quarantine:v1`) before anything overwrites it; if quarantine fails, or storage cannot be read, or the data is from a newer schema, the tab goes read-only. Banner explains; raw data is downloadable in Settings.
- Saves report failure (banner + "Try again"); flushed on `pagehide`/`visibilitychange`. On a full store, oldest automatic backups are dropped to make room for the live document; the newest is always kept, and non-quota failures never drop backups.
- Automatic local snapshots (`roadmap-os:snapshots:v1`, newest 5): weekly, and before import/restore/reset/migration. Restore and download from Settings. Replacing actions refuse to proceed if the pre-backup fails unless the user explicitly continues.
- Export: versioned, pretty-printed envelope `{app, kind, schemaVersion, exportedAt, curriculum, summary, readme, state}`. Import: preview (backup vs current, damaged entries, curriculum mismatch) then confirm; bare v1 exports still accepted; newer schemas refused.
- "Last exported" per device (`roadmap-os:device:v1`) in Settings; one-line nudge on Today after 14 days without an export.
- `setMastery` below Demonstrated no longer deletes review history: the finished cycle moves to optional `TopicProgress.pastReviews`.
- Settings: "Backup and restore" moved to the top. Docs: `docs/PERSISTENCE.md` (keys, load matrix, file format, cloud adapter contract and Supabase setup).
- Tests: Vitest 4 (`npm test`), 46 tests in `tests/` covering validation, migrations, export/import, backup ring and quota, browser adapter, store load/save/quarantine/read-only, actions (import/restore/reset backups, mastery history). A realistic v1 fixture is in `tests/fixtures/v1-state.json`.
- Verified in the browser pane against `next start` at 390 px and 1366 px: seeded v1 data loads unchanged with unknown fields kept; weekly snapshot taken; import preview, apply and before-import snapshot; truncated stored JSON shows the quarantine banner and recovered-data download; a simulated quota failure shows the save-failed banner.

## Phase C summary
- Schema v2 (first real migration, `MIGRATIONS[1]`): adds `sessions: DailySession[]`. Existing v1 data is snapshotted (`before-migration`) and then saved as v2; every existing field is untouched (tested with the v1 fixture and in the browser).
- `lib/today.ts` (pure, tested): `todayPlan` applies the cardinal rule: one primary block (next unticked items of this week's primary work), at most one supporting item, maintenance (due re-tests + DSA revisits), one project milestone (in-progress project first, else the project scheduled this week), blocking and this-week checkpoints, and "where you left off" from the last finished session's next step.
- Daily Work Unit engine: stages come from the master's `meta.dailyWorkUnit` (durations are data, not code) and are copied into each session when it starts, so later template changes never rewrite history. A "Short day" plan (45-55 min, debug folded into coding) covers busy days. Templates of other shapes are supported (`step-N` keys).
- Session runner on Today (`components/SessionRunner.tsx`): stage stepper (tap to jump), per-stage guidance tied to context (recall: last session's ticks and next step and due re-tests; study: focus items and topic link; code: this week's build and project; explain: one-tap "mark topic Explained"), stage notes, timers from timestamps (survive reload), Skip/Back/Stop. The final stage logs what was learned, where it stuck, the next step, and lets you tick focus items. Items ticked while a session runs are recorded on it.
- Completing creates a session record (stages with times and notes, log, ticked items), shown in "Recent sessions" on Today; stopping keeps the record as "stopped". No streaks or counts.
- Today layout: session card sits above "Up next"; "Also today" lists the single supporting item, maintenance, project milestone and this week's checkpoint. The old in-memory "Session plan" ticks are replaced by the persisted engine.
- Tests: 63 (added `tests/today.test.ts` and session action tests; v1 tests updated for the migration). Verified at 390 px and 1366 px against `next start`: v1 data migrated, session started, stage progress survived a reload, log saved, items ticked during the session recorded, finished state and history rendered, no console errors.

## Decisions and deviations
- STATE_VERSION stays 1 in Phase B: the only schema addition (`pastReviews`) is optional and backward compatible (older builds keep it via spread). The migration registry is in place, empty, and tested with synthetic migrations; the first real migration will come with Phase C/D state.
- Automatic backups and "last exported" are device-local metadata in separate keys, not part of `UserState`, so exports do not carry another device's backup history.
- Vitest 4 rather than 5 (peer `@types/node` conflict). No other dependency added.
- UI verification uses the desktop app's browser pane instead of Playwright, to avoid adding a dependency.
- `.claude/launch.json` (local `next start` on port 3123 for the browser pane) is not committed.
- Phase C: Active Mode is not yet an input to the Today plan; Phase E adds it to `todayPlan`. Reopening a finished stage keeps its first start time, so time spent can be overstated after jumping back.
- Phase C: when a project milestone's text is identical to this week's build text, Today shows it once (in the build section).

## Known limitations
- Automatic backups live in the same browser storage as progress: clearing site data removes both. Only exported files survive that; the Today nudge is the mitigation.
- Cross-tab edits within the 300 ms save window can be overwritten by another tab (last writer wins).
- Cloud sync is designed (adapter contract, Supabase steps in docs/PERSISTENCE.md) but not implemented: it needs a Supabase project and credentials.
