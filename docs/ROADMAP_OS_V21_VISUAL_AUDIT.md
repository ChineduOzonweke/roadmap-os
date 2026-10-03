# Roadmap OS V2.1: visual audit and design system

Part 1 is the reconnaissance done before any visual change (production build, `next start`, light and dark, 360 / 390 / 430 / 768 / 1024 / 1366 / 1440 px). Part 2 records the decisions. Part 3 (appended as the work lands) records what changed.

## Part 1. Reconnaissance (before V2.1)

### Method
- Screenshots of Today, project detail, graph, DSA and settings at 390 px and 1366 px in light and dark.
- Automated sweep of 14 routes (Today, Weeks, topic, Projects, project detail, Evidence, DSA, Checkpoints, Career, Resources, Search, Graph, Settings, AI) at 360, 430, 768, 1024 and 1440 px: horizontal overflow and touch targets under 24 px.
- Code inventory of type sizes, radii, surfaces, weights, raw colours and icons across `app/` and `components/`.

### What already works (preserve)
- **A real token layer.** Colours are CSS variables (`--bg`, `--surface`, `--ink`, `--muted`, `--accent`, `--ok`, `--warn`, `--danger` with soft variants) mapped into Tailwind; light and dark are separately tuned, not inverted. Raw hex appears only in the PWA icon and `themeColor`.
- **Shared controls.** `.btn` variants, `.input`, `.chip`, `.card`, `.list-card`, one custom checkbox, one focus ring (`:focus-visible` 2 px accent), reduced-motion respected globally.
- **Calm content.** No decorative imagery, no gamification, colour mostly used for state.
- **Responsive basics.** No horizontal overflow at any tested width; bottom tab bar on phones, sidebar on desktop; 44 px minimum on primary controls.
- **One icon family** (14 hand-drawn stroke icons, consistent 1.75 stroke).

### Problems found

**Hierarchy (most important)**
- Today on a phone opens with three equal-weight boxes (Active Mode card, AI line card, session card) before any actual work; the day's mission sits below the fold.
- The lower half of Today is six identical disclosure cards (tutor, done this week, 14-day plan, recent sessions, notes, more): a wall of equal weight.
- Page titles are 28 px sans with the same weight as section headings relative to body; nothing feels editorial or intentional.
- Desktop pages use a `max-w-4xl` single column: long pages (project detail) leave ~40% of a 1366 px screen empty while the content scrolls for many screens.

**Cardification**
- 62 `card`/`list-card` uses, 65 `Disclosure` uses, 73 `bg-surface-2` fills, 20 ad-hoc `border border-rule`. Cards sit inside cards (session card containing bordered list items; review queue list inside a section inside a page of cards).
- Information that is a list (also-today rows, settings sections, project sections) is boxed rather than separated by space and rules.

**Typography**
- One sans family (IBM Plex Sans) at 11 distinct sizes, including five arbitrary ones (`text-[0.6875rem]`, `[0.9375rem]`, `[1.6rem]`, `[1.75rem]`, `[2rem]`).
- `font-medium` used 139 times as emphasis, flattening hierarchy; headings and labels compete.
- Mono is used inconsistently: some IDs mono, week numbers and metrics not.

**Colour and state**
- `warn` amber doubles as "in progress" (graph, status pills, project badges) and as "attention / overdue": two meanings for one colour.
- Learning states (mastery 0–5) have no colour language at all; only text labels.
- Accent petrol is fine but the palette reads grey-green and slightly dated in light mode.

**Radii and borders**
- Five radius values in use (sm, md, lg, xl, full) plus raw `rounded`; controls 8 px, lists 10 px, cards 14 px. Large radii make the UI feel soft and generic rather than technical.

**Interaction**
- Radio-style chips lacked a checked style (fixed in Phase J); several text buttons (DSA Edit/Delete, review Undo) are under 24 px tall.
- Disclosures have no open/close motion; the session stepper, mode change and completion states change instantly.

**Accessibility**
- Contrast of text tokens passes AA in both themes. Focus ring visible. Small targets: DSA Edit/Delete, career checklist rows rely on the 20 px checkbox only. Inline links in sentences are exempt.

**Per screen notes**
- Weeks / topic: dense but readable; checklist list-card works well (keep). Topic page stacks many disclosures.
- Projects: the record is now very rich; every group has equal weight; needs an at-a-glance summary and progressive depth.
- Evidence / DSA: functional; DSA stat card + filters + list feel generic dashboard.
- Graph: legible; node fills use the same amber for in-progress; edges thin in dark mode.
- Settings: long single column of sections; acceptable.
- AI: long explanatory page; tutor panel fits.

## Part 2. Decisions

### Direction
**Technical + editorial + quietly futuristic**: a research notebook for an engineer. Warm paper in light mode, a charcoal workstation in dark mode, ink-blue as the single accent, editorial serif only for display, mono for data. Hierarchy from type, space and rules rather than boxes.

### Typography

| Font | Evaluated | Decision | Licence |
|---|---|---|---|
| Editorial Old (Pangram Pangram) | Strong editorial character, the user's explicit preference | Not embedded | Commercial; free licence is personal/trial only, web embedding needs a paid licence |
| Neue Montreal (Pangram Pangram) | Clean neo-grotesk for UI | Not embedded | Commercial, same terms |
| SF Pro (Apple) | Excellent UI face | Not embedded | Apple licence limits use to Apple platforms; no self-hosting |
| Inter (rsms) | Neutral, highly legible, great at small sizes, tabular figures | **Selected: UI and body** | SIL OFL 1.1 |
| Poppins | Geometric, friendly | Not selected: too round for a technical instrument | SIL OFL 1.1 |
| Instrument Serif (Instrument) | Sharp, high-contrast editorial display serif; closest free match to Editorial Old's character | **Selected: display only** (page titles, the day's mission, large figures) | SIL OFL 1.1 |
| IBM Plex Mono (IBM) | Already in the app | **Kept: technical** (ids, week numbers, metrics, code, timers) | SIL OFL 1.1 |

Three families total; IBM Plex Sans is removed. All are self-hosted through Fontsource packages (no runtime requests to font CDNs, builds stay reproducible offline).

Type scale (rem): 0.8125 meta · 0.875 secondary · 1 body · 1.125 section · 1.5 / 2.25 display (serif). Weights: 400 body, 500 labels, 600 section headings. Display serif is never bold and never used below 1.5 rem. Body measure capped near 70 ch.

### Colour

Directions evaluated:
- **A (SaaS indigo/cyan):** credible but generic; indigo-on-slate is the default SaaS look.
- **B (editorial paper, stone ink, burnt orange):** best base for long reading and the editorial personality, but an orange accent collides with the amber "attention" state a learning tool needs.
- **C (dark neon):** fails long reading and turns state colours into noise; rejected.
- **D (premium green and gold):** green accent collides with "done/retained"; gold reads luxury, not technical.

**Selected: B's paper and stone ink, with an ink-blue accent** (a fountain-pen blue: technical, scholarly, distinct from success, warning and danger).

Semantic tokens (light / dark):

| Token | Light | Dark | Role |
|---|---|---|---|
| `--bg` | #F7F5F0 | #0E0F11 | visual field (60%) |
| `--surface` | #FFFEFB | #16171A | raised content |
| `--surface-subtle` | #EFECE5 | #1C1D21 | wells, hovers |
| `--text-primary` (`--ink`) | #1C1917 | #ECE9E3 | text |
| `--text-secondary` (`--muted`) | #57534E | #A8A29E | secondary |
| `--text-muted` (`--faint`) | #6F6A64 | #8C8781 | metadata |
| `--border` (`--rule`) | #E4E0D8 | #26272B | hairlines |
| `--border-strong` | #C9C3B8 | #3A3B40 | stronger dividers |
| `--control-border` | #857E73 | #6B6D74 | input, select and checkbox outlines (>= 3:1 non-text contrast on every surface) |
| `--accent` | #2747A8 | #8EA6F2 | actions, focus, current |
| `--accent-strong` | #1C3685 | #B4C4F7 | pressed / emphasis |
| `--accent-subtle` | #E7ECF8 | #1A2140 | selected rows |
| `--success` (`--ok`) | #2F6B3F | #7FC995 | done, retained |
| `--warning` (`--warn`) | #8A5A0B | #E2B05A | due, attention |
| `--danger` | #A3312B | #EE8A80 | failure, destructive |
| `--info` | #2B5F8A | #8CC0E8 | neutral notices |
| `--focus` | = accent | = accent | focus ring |

Learning states use one hue ramp plus success, so mastery reads as progression, not a rainbow: not-started (outline, muted), learning / explained / practised (accent at increasing strength), demonstrated (solid accent), retained (success). Locked = dashed muted outline; available = accent outline; in-progress = accent fill (amber is no longer used for "in progress").

Contrast (computed): every text token is >= 4.5:1 on bg, surface and surface-subtle in both themes (ink 14-17:1, muted 6.5-7.6:1, faint 4.5-5.4:1, accent 7-8:1); white on accent 8.2:1, dark ink on dark accent 8.1:1. Control outlines use `--control-border` (3.3-4:1) because `--border-strong` (1.7:1) fails WCAG 1.4.11.

60-30-10: paper field, surfaces and navigation structure, ink-blue accent for actions and the current item only.

### Shape, space, elevation, motion
- Radii: 4 px small (badges, inputs' inner elements), 6 px controls, 10 px surfaces, full only for chips and dots.
- Spacing: Tailwind's 4 px scale, used mostly at 4 / 8 / 12 / 16 / 24 / 32 / 48.
- Elevation: none for content; one soft shadow token for floating layers (palette, bottom bar, toasts).
- Borders: hairline rules separate list items; cards only for meaningful units (the session, the tutor, a project milestone list).
- Motion: 120 ms for hover/press, 180–220 ms ease-out for disclosure, stepper and dialog; native CSS only; `prefers-reduced-motion` disables all of it. No continuous animation.

### 3D / WebGL
Evaluated for the dependency graph. The graph is a layered DAG of ~50 nodes whose meaning is order and prerequisite paths; a 2D layered layout already shows that exactly, and depth would hide labels and edges and add a continuous render loop and a large dependency. **Decision: no Three.js / WebGL.** Graph character comes from 2D styling (stage bands, state-coded nodes, path emphasis).

## Part 3. What changed (V2.1)

| Phase | Commit | Result |
|---|---|---|
| UI-A | 3ce4974 | This audit and the decisions above |
| UI-B/C/D | ab5987e | Tokens, fonts, primitives, application shell |
| UI-E | c095e94 | Today, Weeks, Projects, project detail |
| UI-F | 11865f1 | Secondary screens |
| UI-G/H | final V2.1 commit | Motion, graph styling, consistency sweep |

### Design system as built
- **Tokens** (`app/globals.css`): legacy implementation names kept (`--bg`, `--surface`, `--surface-2`, `--ink`, `--muted`, `--faint`, `--rule`, `--accent`, `--ok`, `--warn`, `--danger`...) with the new values; semantic aliases (`--background`, `--surface-subtle`, `--text-primary/secondary/muted`, `--border`, `--accent-subtle/strong`, `--success`, `--warning`, `--info`, `--focus`, `--control-border`), learning-state ramp (`--state-not-started` ... `--state-retained`, `--state-locked/available/in-progress`), radii 4/6/10, `--elev-float`, `--dur-fast` 120 ms, `--dur-base` 200 ms, `--ease-out`.
- **Type roles**: `font-display` (Instrument Serif) for page titles, the day's mission, stage names and tier; `h-section` for section headings; `t-eyebrow` (mono, uppercase, tracked) for context and labels; `t-data` (mono, tabular) for week numbers, counts, timers and metrics; Inter for everything else.
- **Primitives** (`components/ui.tsx`): editorial `PageHeader`, `Disclosure` with `flat`, `DisclosureGroup` (one surface, hairline-separated), `MasteryMark`, plus CSS `.btn*`, `.input`, `.chip` (now with `aria-checked`), `.card`, `.list-card`, `.rule-list`, `.accent-rule-top/left`, checkbox, `.pop-in`, disclosure reveal.
- **Shell**: serif/mono wordmark, mono eyebrow nav groups, active item = ink text + 2 px accent rule, data-style week chip, content width 5xl, `shadow-float` only on floating layers, palette and sheets pop in.

### Screen changes
- **Today**: mono context line → serif mission → tally → one compact strip (Active Mode on phones, AI tier/mode) → the session as the only hero card (accent rule, serif heading) → primary checklist → reviews → hairline "Also today" → build → secondary sections on one grouped surface. The six-card wall and the stacked mode/AI cards are gone.
- **Project detail**: at-a-glance strip (milestones, criteria, evidence, quality) → main column (milestones, criteria, engineering record on one surface, evidence) and side column (status, links, quality). Header facts as eyebrow labels.
- **Projects / Weeks**: editorial index (mono numbers, serif stage names, mono ranges).
- **DSA**: glance strip for stats; text buttons became 36 px targets. **Settings**: hairline-separated sections. **Career / criteria / quality** rows: 40 px minimum. **AI, Progress, error, 404**: serif titles; consistent `h-section`.
- **State colour**: "in progress" = accent everywhere (graph, week map, project badge); amber only for due/attention; done/retained = green.
- **Graph**: stronger default edges, 200 ms path/node transitions on focus, recessed locked nodes, tighter radii. No 3D.

### Motion
CSS only: hover/press 120 ms; disclosure reveal, session stage change, palette, sheets, toasts and the logged-session state 160–200 ms ease-out; graph focus fades. Nothing loops. `prefers-reduced-motion: reduce` disables every transition and animation (rule verified in the built CSS). View Transitions were not used: Next 16 exposes them only behind an experimental flag.

### Accessibility
WCAG 2.2 AA targets: text contrast computed above (all >= 4.5:1), control outlines >= 3:1, visible 2 px accent focus ring (verified with real Tab presses), radio chips expose `aria-checked` with a visible state, dialogs (palette, sheets) keep their existing focus management, small text buttons enlarged, no horizontal overflow at 360–1440 px.

### Performance
Fonts: Inter variable latin ~48 KB, Instrument Serif latin ~21 KB, Plex Mono as before, all self-hosted with `unicode-range`; IBM Plex Sans removed. No new JavaScript libraries for the redesign, no WebGL, no continuous animation; pages remain statically prerendered.

### Known limitations and future work
- The week page still uses the full-width AI explanation card (intentional: it is the explanation surface).
- Remaining arbitrary sizes are the display-serif steps (2.125 / 2.625 rem page titles, 2.25–2.875 rem Today title, 1.5–1.75 rem sub-display); they could become named tokens.
- Possible next steps: a stage-banded graph layout, View Transitions once stable in Next.
