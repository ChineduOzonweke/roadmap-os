/**
 * Provider configuration, validated from environment variables. Pure, so it is
 * testable and safe to import anywhere; the values themselves are only read on
 * the server (app/api/ai/route.ts).
 *
 *   ANTHROPIC_API_KEY         required to enable the tutor (server only)
 *   ROADMAP_AI_ACCESS_TOKEN   required: a shared secret the browser must send,
 *                             so a public deployment is not an open AI proxy
 *   ROADMAP_AI_MODEL          optional, defaults to DEFAULT_MODEL
 */

export const DEFAULT_MODEL = "claude-opus-5-5";

export type AiConfig =
  | { configured: true; provider: "anthropic"; model: string; apiKey: string; accessToken: string }
  | { configured: false; provider: "anthropic"; model: string; reason: "missing_api_key" | "missing_access_token" | "weak_access_token" };

export type AiStatus = { configured: boolean; provider: "anthropic"; model: string; reason?: string };

export function readAiConfig(env: Record<string, string | undefined>): AiConfig {
  const model = env.ROADMAP_AI_MODEL?.trim() || DEFAULT_MODEL;
  const apiKey = env.ANTHROPIC_API_KEY?.trim();
  const accessToken = env.ROADMAP_AI_ACCESS_TOKEN?.trim();
  if (!apiKey) return { configured: false, provider: "anthropic", model, reason: "missing_api_key" };
  if (!accessToken) return { configured: false, provider: "anthropic", model, reason: "missing_access_token" };
  if (accessToken.length < 16) return { configured: false, provider: "anthropic", model, reason: "weak_access_token" };
  return { configured: true, provider: "anthropic", model, apiKey, accessToken };
}

/** What the browser may know: never the key or the token. */
export function publicStatus(c: AiConfig): AiStatus {
  return c.configured ? { configured: true, provider: c.provider, model: c.model } : { configured: false, provider: c.provider, model: c.model, reason: c.reason };
}

export const STATUS_MESSAGE: Record<string, string> = {
  missing_api_key: "The tutor is not set up on this deployment: ANTHROPIC_API_KEY is not configured.",
  missing_access_token: "The tutor is not set up: ROADMAP_AI_ACCESS_TOKEN must be configured so the deployment is not an open AI proxy.",
  weak_access_token: "The tutor is not set up: ROADMAP_AI_ACCESS_TOKEN must be at least 16 characters.",
};

/** Constant-time comparison for the access token. */
export function tokenMatches(expected: string, given: string | null): boolean {
  if (!given || given.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ given.charCodeAt(i);
  return diff === 0;
}
