# V2 progress log (update after every phase)

Branch: v2   Baseline: main @ b922317

| Phase | Scope | Status | Commit |
|---|---|---|---|
| A | Audit + architecture map | done (see ROADMAP_OS_V2_AUDIT.md) | n/a |
| B | Data safety / persistence / export / import | done | 28f46a2 (pushed) |
| C | Today + daily execution engine | done | fd135f7 (pushed) |
| D | Review queue + mastery retention | done | 74cce48 (pushed) |
| E | Active Mode switcher | done | 09129a7 (pushed) |
| F | Project milestones + evidence | done | 1b90924 (pushed) |
| G | Portfolio / README export | done | d383372 (pushed) |
| H | Command palette + DSA enhancements | done | phase H commit |
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

## Phase D summary
- `lib/reviews.ts` (pure, tested): schedule from `demonstratedAt`/last re-test using the curriculum intervals [2, 7, 30, 90, 180]; `dueReviews`, `upcomingReviews`, `needsPractice`, `applyReview`, `undoReview`.
- PASS advances the step; mastery becomes Retained only when the pass lands on an interval of 30 days or more (`RETAIN_FROM_DAYS`, the CLAUDE.md default). Time passing never changes mastery.
- FAIL keeps history, drops Retained to Demonstrated (never lower automatically), resets to the 2-day interval, counts a lapse and flags the topic "re-practise" until the next pass.
- Every result is appended to `TopicProgress.reviewLog` with the previous mastery/schedule, so Undo is exact. Optional fields only (`reviewLog`, `reviews.lapses`, `reviews.needsPractice`): schema stays v2, validated in `sanitize.ts`.
- Today: "Due for review today" section in the main column (most overdue first, re-practise flag, which pass would promote to Retained, Pass / Fail with optional "what broke" note, undo line with next date). The DSA lane stays in the aside as "DSA practice".
- Topic page: re-test panel with the schedule bar, next due date, the 30-day rule, re-practise warning, pass/fail (early recording allowed), history and undo.
- Behaviour change: before Phase D the first passed re-test promoted Demonstrated to Retained; now that needs the 30-day re-test.
- Tests: 72. Verified at 390 px: due re-test listed, fail with note recorded and scheduled 2 days out, topic panel shows history and warning.

## Phase E summary
- Schema v3 (`MIGRATIONS[2]`): `activeMode: {id, since} | null` and `modeHistory: {id, since, until}[]`. The migration never guesses a mode: until one is chosen the app shows a labelled suggestion (A during the programming reset, weeks 1-2; B otherwise).
- `lib/modes.ts` (pure, tested): the six modes from master 0.3 with a policy each: primary block active/light/paused, supporting item on/off, project on/off, DSA on/optional/off, preferred session plan, and one calm note. `switchMode` closes the current period into history.
- `todayPlan` takes the policy: A = programming only (no supporting, project or DSA); B/F = full plan; C = light (2 optional items, short session, no project); D = new roadmap work paused (week kept, build hidden, review-only session: recall, re-test due topics, log; re-tests stay); E = light plus project/career evidence kept. Paused/light states use "waits for you" / "skipping is fine" wording, never failure language.
- Switcher (`components/ActiveMode.tsx`): in the desktop sidebar under the week, at the top of Today on phones, and in Settings with the history of earlier periods. Expands in place as a radio group; Escape closes and returns focus. Always labelled "Active Mode" to stay distinct from the AI learn/build/assess mode.
- Tests: 79. Verified at 390 px and 1366 px: v2 data migrated to v3 with no mode guessed, switcher opens, choosing Exams paused the primary block and the build, history recorded, sidebar layout fits.

## Phase F summary
- Schema v4 (`MIGRATIONS[3]`): `evidence: EvidenceItem[]` {kind, subject, title, url, detail}. Kinds: repository, commit/PR, exercise, written explanation, test result, benchmark/metric, architecture diagram, technical note, re-test result, screenshot/artifact, deployed URL, other. Subject = topic, project, milestone or checkpoint id. Existing free-text evidence (topic and gate) is untouched and still editable as "Evidence notes".
- Project record (optional `ProjectProgress` fields, validated): milestone status To do / Doing / Blocked / Done with notes and start/done times (Done keeps the v1 `milestones` flag in sync, so older views and counts agree); custom milestones; completion criteria parsed from each project's master spec (`lib/projectSpec.ts`: every headed bullet list except Examples, code blocks ignored; text-derived keys) plus the user's own definition of done; engineering record (problem, goal, architecture, implementation, experiments, failure points/debugging, lessons, future, decisions with rejected alternatives, metrics, deployed URL, other links).
- Projects are not identical: criteria come from each spec (PR01 "Must demonstrate", PR04 "Requirements" + "Then analyse", PR07 "Required questions", PR11 "Required documentation"...), and ML/AI projects lead with experiments and metrics.
- Evidence UI (`components/Evidence.tsx`): add/edit/delete (delete confirms) on milestones, the whole project (any milestone selectable), topics (with a "Demonstrated should be backed by proof" hint) and checkpoints. New `/evidence` page lists everything, filterable by kind, linked back to what it proves; added to the nav under Practice.
- Tests: 90 (requirement parser against the real `data/projects.json`, milestone status, subject labels, validation, v3->v4 migration, milestone/record/evidence actions). Verified in the browser: v3 data migrated to v4, milestone set to Doing (project moved to In progress), evidence added to a milestone and shown on the project list and `/evidence` with a link back, checkpoint and topic evidence sections render, no horizontal overflow at 390 px.

## Phase G summary
- `lib/portfolio.ts` (pure, tested): `buildPortfolio(input, "readme" | "case-study")` turns the project record into Markdown. README: problem, architecture, technical choices (table), implementation, experiments, metrics (table), milestone status, what it demonstrates (met master criteria + own definition of done), known issues/debugging, future, evidence, links. Case study adds goal, rejected alternatives, lessons and a status line.
- Nothing is invented: empty sections are omitted and listed as "Not recorded yet"; empty decision/metric rows are skipped; table cells escape pipes, prose does not. Master purpose is only used as the README subtitle when no goal is written.
- Project page: "README and case study" section with format toggle, rendered preview (headings demoted so the draft does not add a second h1), raw Markdown view, Copy and Download .md.
- Tests: 93. Verified in the browser on PR03: output matched the recorded milestone states and evidence, gaps listed.
- `vitest.config.ts` renamed to `.mts` (silences the ESM/CommonJS warning).

## Phase H summary
- Command palette (`components/CommandPalette.tsx`): Ctrl+K / Cmd+K anywhere, plus a "Jump to… Ctrl K" button in the desktop sidebar. Empty query lists pages; typing searches pages, commands (export a backup, switch Active Mode A-F), the static curriculum index (phases, topics, concepts, weeks, checkpoints, projects, resources, career, guide; loaded lazily on first open) and personal records (notes, DSA problems, career entries, evidence, session logs). Combobox/listbox semantics, arrow keys, Enter, Esc, Tab kept inside, focus restored on close, closes on navigation.
- `lib/search.ts`: scoring, spelling folding, index loader and personal entries shared by `/search` and the palette (SearchView now imports it).
- DSA (`lib/dsa.ts`, pure, tested): per-attempt log (outcome clean / with help / not solved, mistake type from 8 categories, minutes, note) and last clean-solve date (optional fields, schema unchanged at v4). Re-solve queue 3 / 14 / 30 days: any non-clean attempt -> 3 days and the clean streak resets; clean solves -> 14, then 30; three consecutive clean solves retire the problem. `revisitOn` still holds the next date, so Today's DSA line keeps working; manual dates still editable.
- DSA journal UI: "Due to re-solve today" queue (not-yet-clean first, last outcome and mistake shown), "Log attempt" form, streak and last clean solve per problem, attempt history, mistakes counted by type in the mistake log. No LeetCode integration (manual workflow, per the brief).
- Tests: 100. Verified in the browser: palette opened with Ctrl+K, search found a concept and Enter navigated to it, a mode command switched to C, Esc closed; DSA problem logged, failed attempt recorded with mistake/minutes and re-solve 3 days out; no overflow at 390 px.

## Decisions and deviations
- STATE_VERSION stays 1 in Phase B: the only schema addition (`pastReviews`) is optional and backward compatible (older builds keep it via spread). The migration registry is in place, empty, and tested with synthetic migrations; the first real migration will come with Phase C/D state.
- Automatic backups and "last exported" are device-local metadata in separate keys, not part of `UserState`, so exports do not carry another device's backup history.
- Vitest 4 rather than 5 (peer `@types/node` conflict). No other dependency added.
- UI verification uses the desktop app's browser pane instead of Playwright, to avoid adding a dependency.
- `.claude/launch.json` (local `next start` on port 3123 for the browser pane) is not committed.
- Phase C: Active Mode is not yet an input to the Today plan; Phase E adds it to `todayPlan`. Reopening a finished stage keeps its first start time, so time spent can be overstated after jumping back.
- Phase H: the palette is keyboard-first; on phones the bottom-bar Search page (same search engine) stays the entry point. Command palette DOM behaviour is verified in the browser rather than unit-tested (no DOM test environment, to avoid adding dependencies).
- Phase F: screenshots and artifacts are stored as links, not files: browser storage (~5 MB, shared with automatic backups) cannot hold binaries safely. A cloud adapter could add file storage later.
- Phase F: checkpoint completion is not blocked on evidence (the gate criteria checklist stays the authority); the evidence list sits next to it.
- Phase E: mode descriptions are short paraphrases of master 0.3 kept in `lib/modes.ts` (the master prose lives in `meta.operatingRulesMd`, which is not structured per mode). Exams keeps the "Done this week" and notes sections so nothing is hidden irreversibly.
- Phase D: reviews stay topic-level (mastery is topic-level in the data model); concept-level review would need per-concept mastery, which the curriculum does not define.
- Phase C: when a project milestone's text is identical to this week's build text, Today shows it once (in the build section).

## Known limitations
- UI checks in the desktop app's browser pane can stall on the loading skeleton while the Claude window is hidden (React's streaming reveal waits for an animation frame). Not an app bug; see the memory note. Real browsers are unaffected.
- Automatic backups live in the same browser storage as progress: clearing site data removes both. Only exported files survive that; the Today nudge is the mitigation.
- Cross-tab edits within the 300 ms save window can be overwritten by another tab (last writer wins).
- Cloud sync is designed (adapter contract, Supabase steps in docs/PERSISTENCE.md) but not implemented: it needs a Supabase project and credentials.
