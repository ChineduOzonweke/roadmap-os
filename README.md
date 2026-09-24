# Roadmap OS

A personal learning operating system built on one canonical roadmap: Software Engineering to Machine Learning to AI/ML Engineering. It turns the master curriculum and its 206-week execution mapping into a working tool for deciding what to study, tracking checklists and mastery, passing gates, running projects, logging DSA practice, and preparing for a career.

It is a Next.js web app. Open it from a phone or a laptop through one URL.

## What is in it

| Area | Route | What it does |
| --- | --- | --- |
| Today | `/today` | Daily mission from the current week: next checklist items, build/evidence, DSA lane, spaced re-tests due, the master's daily work unit, week notes |
| Dashboard | `/` | Current week, stage and phase, current mission, next gate, active project, the 206-week execution map, progress, cleared topics, what comes next |
| Weeks | `/weeks`, `/weeks/[1-206]` | The execution layer: every week's primary, supporting and DSA-lane work, build/evidence, gate, completion |
| Timeline | `/timeline` | Stages S0–S8, gate sequence, dependency spine, decision-5 order |
| Curriculum | `/curriculum`, `/phases/P01..P46` | Phase explorer with stage/status filters, then phase pages with topics, prerequisites, dependents, checkpoints, projects, resources |
| Topics | `/topics/P13.2` | Checklist, "before you call this mastered" criteria, mastery stage, current vs target depth, evidence, spaced re-tests, prerequisites, unlocks, weeks, resources, projects, notes |
| Concepts | `/concepts/P13.2-4` | One checklist item with its schedule and notes (`#` in IDs becomes `-` in URLs) |
| Checkpoints | `/checkpoints`, `/checkpoints/C3` | G0, C1–C7 and stage gates: pass criteria, practical gate, evidence, what passing clears |
| Dependencies | `/graph` | Phase dependency graph with focus highlighting (upstream and downstream) and a list mode for phones |
| Projects | `/projects`, `/projects/PR07` | The 11 canonical projects: status, milestones from build weeks, master quality standard, deep-dive questions, repo link |
| Resources | `/resources` | Every resource and tool from the master resource map with the original URLs; filters and personal status |
| Search | `/search` | Global search across phases, topics, concepts, weeks, checkpoints, projects, resources, career content, your DSA journal and notes |
| DSA journal | `/dsa` | Problems tagged with canonical P04 patterns, mistake log, revisit scheduling, stats |
| Career | `/career` | The master's 11 career tracks as checklists, portfolio stages, behavioural story bank, applications log, C7 status |
| Notes | `/notes` | All notes in one place, filter, Markdown download |
| Guide | `/guide` | Status, unlock, mastery, depth and priority rules, plus the master operating rules |
| Settings | `/settings` | Theme, current week, export/import/reset progress, data version |

## Run it locally

Requirements: Node.js 20.9 or newer (Node 22 LTS recommended). Python 3 is only needed if you regenerate curriculum data.

```bash
npm install
npm run dev          # http://localhost:3000
```

Other scripts:

```bash
npm run build          # validates data first (prebuild), then prerenders ~1,940 static pages
npm run start          # serve the production build
npm run typecheck      # tsc --noEmit
npm run lint           # eslint
npm run data:validate  # integrity checks on data/*.json
npm run data:build     # regenerate data/*.json and curriculum/docs/*.md from the master
npm run check          # data:validate + typecheck + lint
```

No environment variables are needed. `.env.example` lists the ones the cloud-sync stage will add.

## Deploy to Vercel

1. Create an empty repository on GitHub (for example `roadmap-os`; private is fine). Do not add a README or .gitignore there.
2. From this folder:
   ```bash
   git remote add origin https://github.com/<your-username>/roadmap-os.git
   git branch -M main
   git push -u origin main
   ```
3. Go to vercel.com, sign in with GitHub, choose **Add New > Project**, and import the repository.
4. Keep the defaults: framework preset **Next.js**, build command `npm run build`, no environment variables. Click **Deploy**.
5. Vercel gives you a URL like `https://roadmap-os-<something>.vercel.app`. Open it on your phone and add it to the home screen if you like.

Every push to `main` redeploys automatically. If the curriculum data is ever invalid, the build stops at the validation step and the previous deployment stays live.

## Where progress is stored (read this)

Progress currently lives in the browser (`localStorage`, key `roadmap-os:state:v1`). That means **your phone and laptop do not share progress yet**, and clearing browser data deletes it.

Until cloud sync ships, use **Settings > Export progress** to download a JSON file and **Import progress** on the other device. Export regularly as a backup.

The code is structured for the next stage:

- All user data is one versioned, serialisable document (`types/state.ts`).
- Components never touch storage. They call actions (`lib/actions.ts`) on a small store (`lib/store.ts`), which saves through a `PersistenceAdapter` (`lib/persistence/adapter.ts`).
- `lib/persistence/index.ts` is the single switch point. Adding Supabase means writing a second adapter that loads and saves the same document for the signed-in user, plus a sign-in screen. No page or component changes.

## How the curriculum data works

```
curriculum/source/MASTER_ROADMAP_VICTOR_2026_FINAL_2026-09-17.md   canonical source (MD5 2951e64c4a6cd61691e30420b1f98f10)
        |  curriculum/generator/parse_master.py
        v
curriculum/generator/_build/master_phases.json                    parsed phases, components, items
        |  reconcile_data.py (206-week schedule, gates, projects, edges)
        |  engine.py (ID assignment, dependency and coverage validation)
        |  build_data.py
        v
data/*.json  +  curriculum/docs/*.md                              app data and the canonical reference docs
        |  scripts/validate-data.mjs (runs before every build)
        v
Next.js app (reads data/ only; no curriculum text lives in components)
```

- The master is the curriculum authority. The 206-week schedule lives in `curriculum/generator/reconcile_data.py`.
- To change a topic title, prerequisite, resource or project: edit the master (or `reconcile_data.py` for scheduling), run `npm run data:build`, then `npm run build`. No UI component needs editing.
- The generator uses only the Python standard library and is deterministic: rerunning it on an unchanged master reproduces identical files (apart from the generation date in `data/meta.json`).
- `curriculum/docs/` holds the canonical curriculum, the phase-to-week mapping and the reconciliation log produced by the same generator.

### IDs

Stable IDs are used everywhere instead of section numbers or titles:

| Entity | Example | Count |
| --- | --- | --- |
| Phase | `P13` | 46 |
| Topic (component) | `P13.2`, `P10.1d` | 162 records, 153 with checklists |
| Checklist item (concept) | `P13.2#4` | 1,483 (1,440 scheduled, 43 on demand) |
| Week | `1` to `206` | 206 |
| Gate | `G0`, `C1`–`C7`, `SG2`–`SG7` | 14 |
| Project | `PR01`–`PR11` | 11 |
| Career track | `T01`–`T11` | 11 |
| Resource / tool | `RES-P04-03`, `TOOL-07` | 261 / 43 |

### Validation

`npm run data:validate` checks unique IDs across every collection; that every topic, concept, week slice, prerequisite, component edge, gate requirement, project reference and resource reference points at a real entity; that there are exactly 46 phases and 206 contiguous weeks; that the phase prerequisite graph has no cycles; that every non-optional concept is mapped to a week; that the 11 projects and 8 canonical checkpoints exist; and that every resource URL is well formed.

## Implementation decisions

These are the smallest decisions needed to implement the settled curriculum. None changes the curriculum.

- **Topic = component.** A topic page is a master component (for example `P13.2 Regression`); its checklist is the component's item list. Components the master lists without items get a single "worked through this component" check.
- **Mastery is separate from checking.** Stages follow the master evidence loop: Not started, Learning, Explained, Practised, Demonstrated, Retained. A topic is *Mastered* only when its checklist is complete and it has reached Demonstrated. Recording a passed spaced re-test (1–3 days, 7, 30, 90 days, 6 months) moves it to Retained.
- **Depth.** D0–D5 use the master's definitions. Target depth comes from the component annotation, else its parent, else the phase. Current depth is set by you.
- **Unlocking.** A topic's required gate is the last gate before its first scheduled week. Named component edges (for example `P10.1d` before `P13.5`) are enforced directly. Phase prerequisites are shown on every page and are already respected by the validated schedule. On-demand topics: `P05.4` after C2, `P41` and `P43` after C5, `P46` always available. Locks never disable checkboxes: you can always see and record ahead; the lock tells you what is not yet your current work.
- **Weeks are undated.** Calendar dates will be attached later from a real Week 1 start date and your university calendar, which stays separate from the curriculum timeline.
- **Search** uses a static index generated at build time (`/search-index.json`), plus your own DSA entries, notes, stories and applications from the browser.

## Source inconsistency reported (not silently changed)

The master resource map lists the **Java** and **JavaScript / TypeScript** resource groups under Phase 7 (`RES-P07-07` to `RES-P07-13`), while those languages are topics `P01.2` and `P01.3`. The registry keeps them under P07 as written, and they also appear on the `P01.2` and `P01.3` topic pages by matching title. The validator prints this note on every run.

## Project structure

```
app/            routes (App Router); server components render curriculum content
components/     UI; files marked "use client" hold interactive progress widgets
lib/            data access (server), progress derivations, store, actions, persistence adapter
types/          curriculum and user-state types
data/           generated curriculum JSON (committed; the app's only curriculum input)
curriculum/     master source, generator, generated reference docs
scripts/        data validator
```

Server components render the static curriculum (about 1,940 pages are prerendered at build time). Only progress widgets run in the browser, backed by a compact index (`data/client-index.json`, about 30 KB gzipped).

## Quality checks run for this version

- `npm run data:validate`: OK, and seven deliberately corrupted datasets were each rejected with a precise message
- `npm run typecheck` and `npm run lint`: clean
- `npm run build`: succeeds, 1,941 routes prerendered
- Production server: all routes return 200, unknown IDs return 404, a crawl of every internal link in every generated page found no broken links, and all 133 unique canonical resource and tool URLs appear in the rendered app
- Headless browser at 390 px (Android phone width) and 1366 px, light and dark: no horizontal overflow, no console or hydration errors
- End-to-end: checklist persistence across reload, mastery and status, gate passing unlocking a topic, notes, DSA journal tagging, week completion, search, export/reset/import including a malformed import, theme persistence, mobile menu

## Next stage

1. Supabase project, email sign-in, and a Supabase persistence adapter storing the user-state document per user (with browser storage kept as an offline cache).
2. Week 1 anchor date and calendar view, reconciled with the UNILAG academic calendar.
3. Optional: installable PWA.
