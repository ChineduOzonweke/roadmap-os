import { readAiConfig, publicStatus } from "@/lib/ai/config";
import { handleTutor } from "@/lib/ai/handler";
import { anthropicProvider } from "@/lib/ai/anthropic";

// Reads environment variables per request; never statically rendered.
export const dynamic = "force-dynamic";

/** Whether the tutor is configured on this deployment (no secrets in the response). */
export function GET() {
  return Response.json(publicStatus(readAiConfig(process.env)), { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const config = readAiConfig(process.env);
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }
  const provider = config.configured ? anthropicProvider(config.apiKey) : async () => ({ ok: false as const, error: "provider_error" as const });
  const res = await handleTutor(config, request.headers.get("x-roadmap-ai-token"), body, provider);
  return Response.json(res.body, { status: res.status, headers: { "Cache-Control": "no-store" } });
}
