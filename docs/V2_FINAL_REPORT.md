# Roadmap OS V2: final report

Branch `v2`, based on `main` @ `b922317`. One commit per phase; every phase was tested (`npm run check`, `npm test`, `npm run build`), checked in a browser against `next start` at phone and desktop widths, and pushed. Detailed per-phase notes: `docs/V2_PROGRESS.md`.

## 1. What already existed (V1)

A working Next.js 16 / React 19 app over a generated curriculum (46 phases, 153 topics with checklists, 1,483 concepts, 206 weeks, 14 gates, 11 projects): Today, weeks, topics, checkpoints, projects, resources, search, DSA journal, career, notes, `/ai` overlay, settings with basic JSON export/import. User state was one `UserState` document in localStorage behind a `PersistenceAdapter`. No tests, no migrations, no structured evidence, no review fail path, no operating modes, no PWA.

## 2. Completed phases

| Phase | Result | Commit |
|---|---|---|
| A | Audit verified and corrected | 108194a (docs) |
| B | Data safety: validation/repair, quarantine, save-failure banner, flush on hide, automatic local backups, versioned export, previewed import | 28f46a2 |
| C | Today plan (cardinal rule) and persisted Daily Work Unit sessions | fd135f7 |
| D | Evidence-based review queue; Retained only from the 30-day re-test; fail path with re-practice | 74cce48 |
| E | Active Mode A–F switcher driving Today's workload | 09129a7 |
| F | Executable project milestones, completion criteria, engineering record, first-class evidence, `/evidence` | 1b90924 |
| G | README / case-study export from the project record | d383372 |
| H | Ctrl/Cmd+K command palette; DSA attempt log and 3/14/30 re-solve queue | 21725af |
| I | Graph zoom/pan/legend; PWA (manifest, icons, service worker, offline page) | ed077e7 |
| J | Embedded Socratic tutor with enforced Learn/Build/Assess policy | 8087fee |
| Stabilization | Full-schema round-trip test, route audit, documentation | this report's commit |

## 3. Architecture changes

- **Persistence** (`lib/persistence/`): `kv.ts` (storage boundary), `sanitize.ts` (validator/repair, unknown fields preserved), `migrate.ts` (migration registry + `readDocument`), `portable.ts` (export envelope, import preview), `backups.ts` (snapshots, quarantine, device metadata), browser adapter returning load/save results instead of swallowing errors. `lib/store.ts` is a testable `createStore()` with save status, read-only protection and flush-on-hide.
- **Pure domain modules** (all unit-tested): `lib/today.ts` (plan + session stages), `lib/reviews.ts`, `lib/modes.ts`, `lib/evidence.ts`, `lib/projectSpec.ts`, `lib/portfolio.ts`, `lib/dsa.ts`, `lib/search.ts`, `lib/ai/{policy,context,config,handler}.ts`.
- **Server boundary:** `app/api/ai/route.ts` is the only dynamic route; `lib/ai/anthropic.ts` is `server-only`. Everything else remains statically prerendered.
- **PWA:** `app/manifest.ts`, build-time PNG icons via `next/og`, `public/sw.js`, `/offline`, production-only registration.

## 4. Schema and migrations

`STATE_VERSION` 1 → 4. Storage key `roadmap-os:state:v1` unchanged.

| Version | Adds | Migration |
|---|---|---|
| 2 | `sessions` | `MIGRATIONS[1]` |
| 3 | `activeMode` (null until chosen), `modeHistory` | `MIGRATIONS[2]` |
| 4 | `evidence` | `MIGRATIONS[3]` |

Optional, backward-compatible fields (no version bump): `TopicProgress.pastReviews`, `reviewLog`, `reviews.lapses/needsPractice`; `ProjectProgress.milestoneDetail/customMilestones/requirements/record`; `DsaProblem.attemptLog/cleanSolvedAt`; `AiLogEntry` tutor fields. Every upgrade snapshots the original document first (`before-migration`). Bare v1 exports still import. Device-local keys: `roadmap-os:snapshots:v1`, `roadmap-os:quarantine:v1`, `roadmap-os:device:v1` (last export, last snapshot, tutor access token).

## 5. Testing

- 144 Vitest tests in `tests/`: validation and repair, migrations (real v1 fixture), export/import (legacy and a full v4 document round trip), backups and quota handling, browser adapter, store load/save/quarantine/read-only, actions, Today planner and sessions, reviews, Active Modes, projects/evidence, portfolio export, DSA scheduling, search, PWA manifest and service worker, tutor policy/context/config/handler (no live model calls).
- `npm run check` and `npm run build` pass (~1,950 static pages + `/api/ai`).
- Route audit against `next start`: every route type returns 200; unknown IDs 404. Client audit (390 px): no console errors, no hydration failures, no horizontal overflow.
- Browser verification per phase is recorded in `docs/V2_PROGRESS.md` (migrations on seeded v1 data, corrupt storage, quota failure, import preview, sessions across reload, review fail, mode switch, evidence, export, palette, DSA, offline with the server stopped, tutor states).

## 6. Known limitations

- Progress is per browser until cloud sync exists; automatic backups share that storage, so exported files are the real backup (Today nudges after 14 days).
- Cross-tab edits within the 300 ms save window: last writer wins.
- Offline covers visited and core pages, not the whole curriculum.
- Evidence artifacts (screenshots, files) are links, not uploads.
- The tutor needs `ANTHROPIC_API_KEY` and `ROADMAP_AI_ACCESS_TOKEN`; none are configured in this environment, so it runs in its "not configured" state (policy checks still run locally). Mode and tier are computed client-side; the access token is the security boundary.
- Reviews are topic-level (mastery is topic-level in the curriculum model).

## 7. Deployment notes

- Vercel builds `v2` previews automatically; `main` is production. No `next.config` or Vercel configuration changes were made.
- Optional environment variables: `ANTHROPIC_API_KEY`, `ROADMAP_AI_ACCESS_TOKEN` (16+ characters), `ROADMAP_AI_MODEL`.
- The service worker's cache version is `VERSION` in `public/sw.js`; pages are network-first, so a new deployment is picked up on the next online visit.

## 8. Remaining optional work

Cloud sync adapter; calendar anchoring of weeks; per-concept review if the curriculum ever defines per-concept mastery; richer offline ("save this phase for offline").

## 9. V2.1 visual redesign

Full record: `docs/ROADMAP_OS_V21_VISUAL_AUDIT.md` (reconnaissance, decisions, what changed).

- **Direction:** technical + editorial + quietly futuristic: warm paper (light) / charcoal workstation (dark), stone ink, one ink-blue accent; hierarchy from type, space and hairlines instead of boxes.
- **Typography:** Instrument Serif (display), Inter (UI/body), IBM Plex Mono (technical), all SIL OFL and self-hosted. Editorial Old and Neue Montreal (commercial web licences) and SF Pro (Apple-platform licence) were evaluated and not embedded; Instrument Serif carries the editorial character.
- **Colour:** semantic tokens with separately tuned light/dark values, computed contrast (text >= 4.5:1, control outlines >= 3:1), learning-state ramp; amber reserved for attention, accent for in-progress/current, green for done/retained.
- **Components:** editorial page header, grouped flat disclosures, glance strips, mastery mark, accent rules, refined controls; shell with serif/mono wordmark and accent-rule navigation.
- **Screens:** Today rebuilt around one hero session and a clear order; project detail with an at-a-glance strip and main/side columns; editorial indexes for Projects and Weeks; secondary screens aligned.
- **Motion:** CSS only, 120–200 ms, no loops, fully disabled under reduced motion. **3D:** evaluated for the graph and rejected (no comprehension gain, real cost).
- **Verification:** 24 routes x 360/1280 px with no errors or overflow; screenshots in both themes at phone and desktop widths; keyboard focus checked; palette, Active Mode, sessions, export and import re-tested on the redesigned build.

## 10. Release

`v2` is merged into `main` for production after the Vercel preview is confirmed healthy (see `docs/V2_PROGRESS.md` for the merge commit).
