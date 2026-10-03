# Embedded Socratic tutor (Phase J)

The tutor is a collapsible panel on Today, topic, project and checkpoint pages and on `/ai`. Everything else in Roadmap OS works without it.

## How the rules are enforced

What the tutor may do is decided by code, not by the model:

| Layer | File | What it does |
|---|---|---|
| Context | `lib/ai/context.ts` | Builds the learner context (week, phase, topic + mastery, concept, project, checkpoint, Active Mode, AI tier, evidence count) and resolves Learn / Build / Assess. A checkpoint with status "attempting" forces Assess and locks it. Build needs the topic at Practised or higher, or a project. |
| Policy | `lib/ai/policy.ts` | Classifies the request (solution, debug, review, check, hint, clarify, design, explain, other) and decides: allowed or refused, response style, maximum lines of code, and the rules for the system prompt. |
| Server | `lib/ai/handler.ts`, `app/api/ai/route.ts` | Re-derives the decision from the request (never trusts the client), refuses before any provider call, sends the policy as the system prompt, filters the reply (code over the limit is removed; Assess allows none), and drops earlier turns in Assess. |

Policy matrix:

- **Learn**: explanations, Socratic questions, hints (after the learner says they attempted it; otherwise the tutor asks what they tried), error explanations without corrected code, feedback on their own code. Full solutions are refused. Up to 8 lines of example code (0 for hints and checks).
- **Build**: pair programming on the part asked about. Tier 1 (Tutor) refuses finished code; Tier 2 (Pair, after C1) allows focused code up to 40 lines; Tier 3 (Supervised agent, after SG4) up to 120 lines with a verification list.
- **Assess**: only clarifies what instructions or constraints mean. Every other request is refused without calling the provider; replies may contain no code.

The tier comes from passed checkpoints (`lib/ai.ts` `currentTier`), the same rule `/ai` shows.

## Setup (Vercel or local)

| Variable | Required | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | yes | Server-side only. Never sent to the browser. |
| `ROADMAP_AI_ACCESS_TOKEN` | yes, 16+ characters | Shared secret the browser sends in `x-roadmap-ai-token`, so a public deployment is not an open AI proxy that spends your credits. |
| `ROADMAP_AI_MODEL` | no | Defaults to `claude-opus-5-5`. |

1. Add the variables in Vercel (Project Settings > Environment Variables) or `.env.local`, then redeploy.
2. Open the tutor on any page; it asks once for the access token and keeps it on that device only (device metadata, not progress, so it is never in an export).

`GET /api/ai` reports whether the tutor is configured (no secrets). Requests use the server-side refusal fallback (`fallbacks: "default"`) and return calm errors for bad credentials, rate limits and network failures.

## Logging and privacy

Conversations are not stored. "Log to AI practice" on a reply adds an entry to the existing AI log with the question (first 200 characters), mode, tier, context id, classified intent and whether the policy allowed it. The provider receives only the question, the last few turns (none in Assess) and a context summary built from curriculum ids and progress states: no notes, journal text or evidence content.

## Limitations

- Mode and tier are computed in the browser from local progress and sent with the request; the server re-applies the policy to them but cannot verify progress it does not store. The access token, not the tier, is the security boundary.
- Intent classification is keyword-based and conservative. A request that hides a solution request in other wording is still bounded by the code limit and the mode's system rules.
- Replies are not streamed (they are short by policy).
