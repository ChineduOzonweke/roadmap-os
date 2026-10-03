@AGENTS.md

# Roadmap OS: working agreement for Claude Code

Roadmap OS is an existing, working, deployed app (https://roadmap-os-lovat.vercel.app/). It is NOT greenfield. Evolve it; do not rebuild it.

## Read these first, every session
@docs/ROADMAP_OS_V2_BRIEF.md
@docs/ROADMAP_OS_V2_AUDIT.md
@docs/V2_PROGRESS.md

## Hard rules
- Source of truth for curriculum: `curriculum/source/MASTER_ROADMAP_VICTOR_2026_FINAL_2026-09-17.md` (MD5 c85d55c0e1916af940605fe1467edc3c). This repo copy is NEWER than any copy elsewhere (it contains section 109, the AI overlay). Never replace it.
- Never hand-edit `data/*.json`. Change the master or `curriculum/generator/reconcile_data.py`, then `npm run data:build`. `data/meta.json` always differs by the generation date; revert that-only diff.
- Next.js here is v16 with breaking changes. Read the relevant guide in `node_modules/next/dist/docs/` before writing Next-specific code.
- User data is sacred. Storage key `roadmap-os:state:v1` stays. No schema change without a migration, a test, and backward compatibility with existing v1 data and v1 exports. Never silently reset or overwrite state. Preserve unknown fields.
- Persistence stays behind `PersistenceAdapter` (`lib/persistence/`). Components never touch storage; they call `lib/actions.ts`.
- "Active Mode" (A-F operating modes) is a different concept from the AI Learn/Build/Assess mode (`lib/ai.ts` `weekMode`). Keep the names distinct in code and UI.
- No streaks, points, badges, feeds, or motivational noise. Mobile-first: the owner uses the app ~90% on a phone.
- Avoid new dependencies. Allowed exception: Vitest as a dev dependency (there is currently no test runner).

## Workflow
- Work on branch `v2`, never directly on `main`. One commit per completed phase (or sub-phase), message `phase X: ...`. Vercel builds branch previews; `main` is production.
- Do not push, merge to main, or change Vercel config without asking.
- After each phase: `npm run check && npm test && npm run build`, then inspect the real UI at 390px and 1366px (Playwright against `next start`), then update `docs/V2_PROGRESS.md`.
- Proceed through phases B-J in order without asking between normal steps. Stop and ask only for: destructive/irreversible actions, risk to user data, credentials/billing/third-party auth, or a major architectural conflict with the product principles.
- Recommended default for reviews (owner may override): a passed re-test advances a topic to Retained only from the 30-day interval onward, not the 2-day one.

## Commands
npm run dev | npm run check (validate + typecheck + lint) | npm run build | npm run data:build
