"use client";

import { useEffect, useId, useState } from "react";
import { useHydrated, useUserState } from "@/lib/store";
import { getAiAccessToken, saveAiLog, setAiAccessToken } from "@/lib/actions";
import { buildContext, contextSummary, resolveMode, type TutorScope } from "@/lib/ai/context";
import { classifyIntent, decide, INTENT_LABEL, type AiModeId, type Decision } from "@/lib/ai/policy";
import { STATUS_MESSAGE, type AiStatus } from "@/lib/ai/config";
import { Markdown } from "./Markdown";
import { cx } from "./ui";

type Turn =
  | { role: "user"; content: string; attemptedFirst: boolean }
  | { role: "assistant"; content: string; decision: Decision; refused: boolean; redacted?: boolean; logged?: boolean; question: string };

let statusPromise: Promise<AiStatus> | null = null;
function loadStatus(): Promise<AiStatus> {
  statusPromise ??= fetch("/api/ai", { cache: "no-store" })
    .then((r) => (r.ok ? (r.json() as Promise<AiStatus>) : Promise.reject(new Error(String(r.status)))))
    .catch(() => {
      statusPromise = null;
      return { configured: false, provider: "anthropic", model: "", reason: "unreachable" } as AiStatus;
    });
  return statusPromise;
}

const MODE_COPY: Record<AiModeId, { label: string; does: string }> = {
  learn: { label: "Learn", does: "Explains, asks questions, gives hints after your attempt. It will not write your solution." },
  build: { label: "Build", does: "Pairs with you on the part you ask about, within your AI tier. You decide and verify." },
  assess: { label: "Assess", does: "Only clarifies what the instructions mean. No approach, hints, answers or debugging." },
};

/**
 * The embedded Socratic tutor. Collapsed by default; opens in place on the page
 * it serves. What it may do is decided by lib/ai/policy.ts, checked here before
 * sending and enforced again on the server.
 */
export function Tutor({ scope = {}, className }: { scope?: TutorScope; className?: string }) {
  const s = useUserState();
  const ready = useHydrated();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<AiStatus | null>(null);
  const [requested, setRequested] = useState<AiModeId | null>(null);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [hasToken, setHasToken] = useState(false);
  const inputId = useId();

  useEffect(() => {
    if (!open) return;
    let live = true;
    loadStatus().then((st) => live && setStatus(st));
    // Device-local token lives with backups metadata; read it once the panel opens.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasToken(!!getAiAccessToken());
    return () => { live = false; };
  }, [open]);

  if (!ready) return null;
  const ctx = buildContext(s, scope);
  const res = resolveMode(s, scope, requested);
  const mode = res.mode;
  const buildAllowed = resolveMode(s, scope, "build").mode === "build";

  const switchMode = (m: AiModeId) => {
    if (res.locked) return;
    // Entering or leaving Assess starts a clean conversation, so help from one mode never carries into the other.
    if ((m === "assess") !== (mode === "assess")) setTurns([]);
    setRequested(m);
  };

  const ask = async () => {
    const question = draft.trim();
    if (!question || busy) return;
    const decision = decide({ mode, tier: ctx.tier.id, intent: classifyIntent(question), attemptedFirst: attempted });
    const userTurn: Turn = { role: "user", content: question, attemptedFirst: attempted };
    setDraft("");
    setError(null);
    if (!decision.allowed) {
      setTurns((t) => [...t, userTurn, { role: "assistant", content: decision.refusal ?? "", decision, refused: true, question }]);
      return;
    }
    if (!status?.configured) {
      setTurns((t) => [...t, userTurn]);
      setError(status ? STATUS_MESSAGE[status.reason ?? "missing_api_key"] ?? "The tutor is unavailable." : "Checking whether the tutor is set up…");
      return;
    }
    setTurns((t) => [...t, userTurn]);
    setBusy(true);
    try {
      const history = turns.map((t) => ({ role: t.role, content: t.content }));
      const r = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-roadmap-ai-token": getAiAccessToken() },
        body: JSON.stringify({ message: question, history, mode, tier: ctx.tier.id, attemptedFirst: attempted, context: contextSummary(ctx) }),
      });
      const body = await r.json().catch(() => null);
      if (!r.ok || !body || body.kind === "error") {
        setError(body?.message ?? `The tutor request failed (${r.status}).`);
        if (r.status === 401) setHasToken(false);
        return;
      }
      setTurns((t) => [...t, { role: "assistant", content: body.text, decision: body.decision, refused: body.kind === "refused", redacted: body.redacted, question }]);
    } catch {
      setError("Could not reach the tutor. You may be offline; everything else keeps working.");
    } finally {
      setBusy(false);
    }
  };

  const logTurn = (i: number) => {
    const t = turns[i];
    if (t.role !== "assistant") return;
    const prev = turns[i - 1];
    saveAiLog({
      task: t.question.slice(0, 200),
      attemptedFirst: prev?.role === "user" ? prev.attemptedFirst : false,
      aiDid: t.refused ? `Tutor declined (${t.decision.mode}): ${INTENT_LABEL[t.decision.intent]}` : `Tutor (${t.decision.mode}, ${t.decision.tier}): ${INTENT_LABEL[t.decision.intent]}`,
      verified: "",
      aiErrorCaught: false,
      canDoAlone: "partly",
      missionId: null,
      source: "tutor",
      aiMode: t.decision.mode,
      tier: t.decision.tier,
      contextId: scope.topicId ?? scope.projectId ?? scope.gateId ?? ctx.topic?.id,
      intent: t.decision.intent,
      allowed: !t.refused,
    });
    setTurns((all) => all.map((x, j) => (j === i && x.role === "assistant" ? { ...x, logged: true } : x)));
  };

  const where = ctx.project?.title ?? ctx.checkpoint?.title ?? ctx.topic?.title ?? ctx.week.title;

  return (
    <section aria-label="Tutor" className={cx("card overflow-hidden", className)}>
      <button type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)} className="flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left hover:bg-surface-2/60">
        <span className="min-w-0 flex-1">
          <span className="block font-medium">Ask the tutor</span>
          <span className="block truncate text-sm text-muted">{MODE_COPY[mode].label} · {ctx.tier.title}{where ? ` · ${where}` : ""}</span>
        </span>
        <span className="shrink-0 text-xs text-accent">{open ? "Close" : "Open"}</span>
      </button>

      {open && (
        <div className="space-y-3 border-t border-rule px-4 py-4">
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Tutor mode">
            {(["learn", "build", "assess"] as AiModeId[]).map((m) => {
              const disabled = res.locked ? m !== "assess" : m === "build" && !buildAllowed;
              return (
                <button key={m} type="button" role="radio" aria-checked={mode === m} disabled={disabled} onClick={() => switchMode(m)} className="chip disabled:opacity-40">
                  {MODE_COPY[m].label}
                </button>
              );
            })}
          </div>
          <p className="text-sm">{MODE_COPY[mode].does}</p>
          <p className="text-xs text-muted">{res.reason}{!buildAllowed && !res.locked && mode !== "build" ? " Build unlocks at Practised or on a project." : ""}</p>

          {status && !status.configured && (
            <p className="rounded-lg bg-surface-2 px-3 py-2 text-sm text-muted">
              {STATUS_MESSAGE[status.reason ?? ""] ?? "The tutor could not be reached."} Policy checks still run here, so you can see what each mode allows. Setup: docs/AI.md.
            </p>
          )}
          {status?.configured && !hasToken && (
            <form className="flex flex-wrap items-end gap-2" onSubmit={(e) => { e.preventDefault(); if (setAiAccessToken(token)) { setHasToken(!!token.trim()); setToken(""); } }}>
              <label className="min-w-0 flex-1 text-sm">
                <span className="mb-1 block text-muted">Tutor access token (stays on this device, never exported)</span>
                <input type="password" autoComplete="off" className="input text-sm" value={token} onChange={(e) => setToken(e.target.value)} />
              </label>
              <button type="submit" className="btn btn-secondary btn-sm" disabled={!token.trim()}>Save</button>
            </form>
          )}

          {turns.length > 0 && (
            <ol className="space-y-3" aria-live="polite">
              {turns.map((t, i) => (
                <li key={i} className={cx("text-sm", t.role === "user" ? "pl-6" : "")}>
                  {t.role === "user" ? (
                    <p className="rounded-lg bg-surface-2 px-3 py-2"><span className="sr-only">You: </span>{t.content}</p>
                  ) : (
                    <div className={cx("rounded-lg px-3 py-2", t.refused ? "border border-warn/30 bg-warn-soft" : "border border-rule")}>
                      {t.refused ? <p>{t.content}</p> : <Markdown md={t.content} />}
                      <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-xs text-muted">
                        <span>{MODE_COPY[t.decision.mode].label} · {INTENT_LABEL[t.decision.intent]}{t.redacted ? " · code removed by policy" : ""}</span>
                        {t.logged ? <span>· logged</span> : <button type="button" className="text-accent hover:underline" onClick={() => logTurn(i)}>Log to AI practice</button>}
                      </p>
                    </div>
                  )}
                </li>
              ))}
            </ol>
          )}
          {busy && <p className="text-sm text-muted" role="status">Thinking…</p>}
          {error && <p className="text-sm text-danger" role="alert">{error}</p>}

          <form className="space-y-2" onSubmit={(e) => { e.preventDefault(); void ask(); }}>
            <label htmlFor={inputId} className="sr-only">Question for the tutor</label>
            <textarea
              id={inputId}
              rows={3}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); void ask(); } }}
              placeholder={mode === "assess" ? "Ask what an instruction means" : mode === "learn" ? "What are you trying to understand? Include your attempt." : "What part are you working on?"}
              className="input text-sm"
            />
            <div className="flex flex-wrap items-center gap-3">
              {mode !== "assess" && (
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={attempted} onChange={(e) => setAttempted(e.target.checked)} />
                  I attempted this first
                </label>
              )}
              <div className="ml-auto flex gap-2">
                {turns.length > 0 && <button type="button" className="btn btn-quiet btn-sm" onClick={() => { setTurns([]); setError(null); }}>Clear</button>}
                <button type="submit" className="btn btn-primary btn-sm" disabled={!draft.trim() || busy}>Ask</button>
              </div>
            </div>
          </form>
          <p className="text-xs text-faint">Conversations are not saved. Use “Log to AI practice” to keep a record of an exchange.</p>
        </div>
      )}
    </section>
  );
}
