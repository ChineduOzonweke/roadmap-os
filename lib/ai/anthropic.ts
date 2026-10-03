import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { Provider } from "./handler";

/**
 * Anthropic provider (server only: imported by app/api/ai/route.ts, never by
 * client code, so the key cannot reach the browser). Non-streaming: tutor
 * replies are short by policy.
 */
export function anthropicProvider(apiKey: string): Provider {
  const client = new Anthropic({ apiKey, maxRetries: 2, timeout: 60_000 });
  return async ({ model, system, messages }) => {
    try {
      const res = await client.beta.messages.create({
        model,
        max_tokens: 2000,
        system,
        messages,
        output_config: { effort: "medium" },
        // Server-side refusal fallback, routed by refusal category.
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
      });
      if (res.stop_reason === "refusal") return { ok: true, text: "", refused: true };
      const text = res.content.map((b) => (b.type === "text" ? b.text : "")).join("").trim();
      return { ok: true, text, refused: false };
    } catch (e) {
      if (e instanceof Anthropic.AuthenticationError || e instanceof Anthropic.PermissionDeniedError) return { ok: false, error: "provider_auth" };
      if (e instanceof Anthropic.RateLimitError) return { ok: false, error: "rate_limited" };
      if (e instanceof Anthropic.APIConnectionError) return { ok: false, error: "network" };
      if (e instanceof Anthropic.APIError) return { ok: false, error: "provider_error", detail: String(e.status) };
      return { ok: false, error: "provider_error" };
    }
  };
}
