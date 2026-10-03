# Persistence, backup and sync

All user progress is one `UserState` document (`types/state.ts`). Components never touch storage: they call `lib/actions.ts`, which mutates the store (`lib/store.ts`), which saves through a `PersistenceAdapter` (`lib/persistence/`).

## Browser storage keys

| Key | Holds | Notes |
|---|---|---|
| `roadmap-os:state:v1` | the live `UserState` document | Never rename. The `v1` in the key is not the schema version; `state.version` is. |
| `roadmap-os:snapshots:v1` | ring of the 5 newest automatic backups | Taken weekly and before import, restore, reset and schema migration. Dropped oldest-first only when the live document cannot be saved because storage is full; the newest is always kept. |
| `roadmap-os:quarantine:v1` | raw text of stored progress that could not be read, or had to be repaired (max 3) | Downloadable from Settings > Backup. Written before anything overwrites the original. |
| `roadmap-os:device:v1` | `{ lastExportAt, lastSnapshotAt }` | Per device; drives the "last exported" line and the 14-day nudge on Today. |

## Load path (`initStore`)

Every stored, cross-tab or imported document goes through `readDocument` (`lib/persistence/migrate.ts`): migrations first, then `sanitizeState` (`lib/persistence/sanitize.ts`), which preserves unknown fields, coerces obvious type slips, and drops (and reports) entries it cannot repair.

| Situation | Behaviour |
|---|---|
| Nothing stored | Start empty. |
| Valid document | Load as-is; nothing is written until the user changes something. |
| Malformed entries | Original quarantined, clean document loaded and saved, warning banner. |
| Unparseable JSON | Raw text quarantined, start empty, warning banner. If quarantine fails, saving is turned off. |
| Storage unreadable | Saving is turned off, so nothing is written over data that could not be read. |
| Newer schema | Shown read-only; this build never writes over it. |
| Older schema | Original snapshotted (`before-migration`), migrated, saved. |

Saves are debounced 300 ms and flushed on `pagehide` and `visibilitychange: hidden`. A failed save shows an app-wide banner with "Try again"; it is never silent.

## Schema migrations

`STATE_VERSION` in `types/state.ts` is the current schema. To change the schema: bump it, add `MIGRATIONS[oldVersion]` in `lib/persistence/migrate.ts` (pure, non-mutating, preserves unknown fields), and add a test using a real document of the old shape (`tests/fixtures/`). Optional fields that default cleanly (for example `TopicProgress.pastReviews`) do not need a version bump.

## Backup file format

`Settings > Backup > Export backup` writes `roadmap-os-backup-YYYY-MM-DD-HHMM.json`:

```json
{
  "app": "roadmap-os",
  "kind": "progress-backup",
  "schemaVersion": 1,
  "exportedAt": "2026-10-03T16:45:00.000Z",
  "curriculum": { "md5": "c85d55c0e1916af940605fe1467edc3c", "generated": "..." },
  "summary": { "ticks": 120, "topicsTracked": 14, "...": "..." },
  "readme": ["plain-English description of every field"],
  "state": { "...the UserState document..." }
}
```

Import accepts this envelope and the original bare-state export from before V2. Import always previews first (what the file contains vs what is in this browser, damaged entries, curriculum mismatch), takes an automatic backup of current progress, then replaces it. Files from a newer schema are refused.

## Cloud sync (not enabled; no credentials in the repo)

The adapter contract (`lib/persistence/adapter.ts`) is the only thing a cloud backend has to implement:

- `load()` returns `empty`, `found` (untrusted doc), `unreadable` (raw text), or `error`. Return `error` when the network or auth fails, so the store does not overwrite anything.
- `save(state)` returns `{ ok }` or `{ ok: false, error, quota? }`. Never swallow failures.
- `subscribe(cb)` (optional) pushes remote changes; payloads go through `readDocument`.

Planned setup (Supabase, per `.env.example`):

1. Create a Supabase project; enable email magic-link auth.
2. Table `user_state (user_id uuid primary key references auth.users, doc jsonb not null, schema_version int not null, updated_at timestamptz not null default now())` with row-level security `user_id = auth.uid()` for select/insert/update.
3. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` and in Vercel project environment variables.
4. Implement `lib/persistence/cloud.ts` against the contract, and return it from `getAdapter()` when signed in, keeping the browser adapter as the offline copy. Conflict policy to decide then: last-writer-wins on `updatedAt`, with an automatic snapshot of the losing side.

Automatic snapshots and quarantine stay device-local whichever adapter is active.
