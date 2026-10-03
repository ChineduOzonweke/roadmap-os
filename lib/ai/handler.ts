import { classifyIntent, decide, filterReply, systemPrompt, type AiModeId, type Decision, type TierId } from "./policy";
import { publicStatus, STATUS_MESSAGE, tokenMatches, type AiConfig } from "./config";

/**
 * Server-side tutor request handling, independent of HTTP and of the provider
 * so it can be tested deterministically. app/api/ai/route.ts wires it up.
 */

export type ChatTurn = { role: "user" | "assistant"; content: string };
export type TutorRequest = { message: string; history: ChatTurn[]; mode: AiModeId; tier: TierId; attemptedFirst: boolean; context: string };

export type ProviderResult =
  | { ok: true; text: string; refused: boolean }
  | { ok: false; error: "provider_auth" | "rate_limited" | "network" | "provider_error"; detail?: string };

export type Provider = (input: { model: string; system: string; messages: ChatTurn[] }) => Promise<ProviderResult>;

export type TutorResponse =
  | { status: 200; body: { kind: "reply"; text: string; decision: Decision; redacted: boolean } | { kind: "refused"; text: string; decision: Decision } }
  | { status: 400 | 401 | 413 | 502 | 503; body: { kind: "error"; error: string; message: string } };

export const LIMITS = { message: 4000, turn: 4000, history: 8, context: 2000 } as const;

const MODES: AiModeId[] = ["learn", "build", "assess"];
const TIERS: TierId[] = ["T1", "T2", "T3"];

export function parseTutorRequest(body: unknown): { ok: true; value: TutorRequest } | { ok: false; status: 400 | 413; message: string } {
  if (!body || typeof body !== "object") return { ok: false, status: 400, message: "Expected a JSON object." };
  const b = body as Record<string, unknown>;
  if (typeof b.message !== "string" || !b.message.trim()) return { ok: false, status: 400, message: "Ask a question first." };
  if (b.message.length > LIMITS.message) return { ok: false, status: 413, message: `Keep questions under ${LIMITS.message} characters.` };
  if (!MODES.includes(b.mode as AiModeId)) return { ok: false, status: 400, message: "Unknown mode." };
  if (!TIERS.includes(b.tier as TierId)) return { ok: false, status: 400, message: "Unknown tier." };
  const history = (Array.isArray(b.history) ? b.history : [])
    .filter((t): t is ChatTurn => !!t && typeof t === "object" && (t.role === "user" || t.role === "assistant") && typeof t.content === "string")
    .slice(-LIMITS.history)
    .map((t) => ({ role: t.role, content: t.content.slice(0, LIMITS.turn) }));
  return {
    ok: true,
    value: {
      message: b.message.trim(),
      history,
      mode: b.mode as AiModeId,
      tier: b.tier as TierId,
      attemptedFirst: b.attemptedFirst === true,
      context: typeof b.context === "string" ? b.context.slice(0, LIMITS.context) : "",
    },
  };
}

const PROVIDER_MESSAGE: Record<string, string> = {
  provider_auth: "The AI provider rejected the server's credentials. Check ANTHROPIC_API_KEY.",
  rate_limited: "The AI provider is rate limiting requests. Try again in a minute.",
  network: "Could not reach the AI provider. Check the connection and try again.",
  provider_error: "The AI provider returned an error. Try again.",
};

export async function handleTutor(config: AiConfig, token: string | null, body: unknown, provider: Provider): Promise<TutorResponse> {
  if (!config.configured) {
    const s = publicStatus(config);
    return { status: 503, body: { kind: "error", error: "not_configured", message: STATUS_MESSAGE[s.reason ?? "missing_api_key"] } };
  }
  if (!tokenMatches(config.accessToken, token)) {
    return { status: 401, body: { kind: "error", error: "bad_token", message: "This device does not have the tutor access token. Add it in Settings > Tutor." } };
  }
  const parsed = parseTutorRequest(body);
  if (!parsed.ok) return { status: parsed.status, body: { kind: "error", error: "bad_request", message: parsed.message } };
  const req = parsed.value;

  // The policy is re-derived here from the request, never trusted from the client.
  const decision = decide({ mode: req.mode, tier: req.tier, intent: classifyIntent(req.message), attemptedFirst: req.attemptedFirst });
  if (!decision.allowed) return { status: 200, body: { kind: "refused", text: decision.refusal ?? "Not available in this mode.", decision } };

  // In Assess, earlier turns could carry help from another mode; send only the current question.
  const history = req.mode === "assess" ? [] : req.history;
  const result = await provider({ model: config.model, system: systemPrompt(decision, req.context), messages: [...history, { role: "user", content: req.message }] });
  if (!result.ok) return { status: 502, body: { kind: "error", error: result.error, message: PROVIDER_MESSAGE[result.error] } };
  if (result.refused) return { status: 200, body: { kind: "refused", text: "The AI provider declined to answer this request.", decision } };
  const filtered = filterReply(result.text, decision);
  return { status: 200, body: { kind: "reply", text: filtered.text, decision, redacted: filtered.redacted } };
}
