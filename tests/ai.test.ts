import { describe, expect, it, vi } from "vitest";
import { emptyState, type UserState } from "@/types/state";
import { classifyIntent, decide, filterReply, systemPrompt, type Intent } from "@/lib/ai/policy";
import { buildContext, contextSummary, resolveMode } from "@/lib/ai/context";
import { publicStatus, readAiConfig, tokenMatches } from "@/lib/ai/config";
import { handleTutor, parseTutorRequest, type Provider } from "@/lib/ai/handler";
import { currentTier } from "@/lib/ai";

const TOKEN = "a-long-enough-token-123";
const CONFIG = readAiConfig({ ANTHROPIC_API_KEY: "sk-test", ROADMAP_AI_ACCESS_TOKEN: TOKEN });
const passed = () => ({ status: "passed" as const, criteria: {}, evidence: "" });

describe("intent classification", () => {
  const cases: [string, Intent][] = [
    ["Can you give me the full solution?", "solution"],
    ["write the function for me please", "solution"],
    ["explain recursion and give me the complete code", "solution"],
    ["I get a TypeError: undefined is not a function", "debug"],
    ["can you review my approach to this?", "review"],
    ["is this right: a stack is LIFO", "check"],
    ["I'm stuck, any hint?", "hint"],
    ["what does the instruction mean by 'in place'?", "clarify"],
    ["should I use Postgres or SQLite here, what are the trade-offs", "design"],
    ["why does quicksort degrade on sorted input", "explain"],
    ["hello", "other"],
  ];
  it.each(cases)("%s -> %s", (text, intent) => expect(classifyIntent(text)).toBe(intent));
});

describe("Learn policy", () => {
  it("refuses full solutions before any model call", () => {
    const d = decide({ mode: "learn", tier: "T3", intent: "solution", attemptedFirst: true });
    expect(d.allowed).toBe(false);
    expect(d.refusal).toMatch(/first attempt/);
  });
  it("allows explanations, hints and checks with little or no code", () => {
    expect(decide({ mode: "learn", tier: "T1", intent: "explain", attemptedFirst: false })).toMatchObject({ allowed: true, style: "socratic", maxCodeLines: 8 });
    expect(decide({ mode: "learn", tier: "T1", intent: "hint", attemptedFirst: true })).toMatchObject({ allowed: true, maxCodeLines: 0 });
    expect(decide({ mode: "learn", tier: "T1", intent: "check", attemptedFirst: false })).toMatchObject({ allowed: true, maxCodeLines: 0 });
  });
  it("asks for the learner's attempt before hinting or debugging", () => {
    const d = decide({ mode: "learn", tier: "T1", intent: "debug", attemptedFirst: false });
    expect(d.rules.join(" ")).toMatch(/ask what they tried/);
    expect(d.rules.join(" ")).toMatch(/Do not provide corrected code/);
    expect(decide({ mode: "learn", tier: "T1", intent: "debug", attemptedFirst: true }).rules.join(" ")).not.toMatch(/ask what they tried/);
  });
});

describe("Build policy and tier transitions", () => {
  it("Tier 1 refuses finished code but pairs on everything else", () => {
    expect(decide({ mode: "build", tier: "T1", intent: "solution", attemptedFirst: true }).allowed).toBe(false);
    expect(decide({ mode: "build", tier: "T1", intent: "debug", attemptedFirst: true })).toMatchObject({ allowed: true, style: "pair", maxCodeLines: 12 });
  });
  it("code limits grow with the tier", () => {
    expect(decide({ mode: "build", tier: "T2", intent: "solution", attemptedFirst: false })).toMatchObject({ allowed: true, maxCodeLines: 40 });
    expect(decide({ mode: "build", tier: "T3", intent: "solution", attemptedFirst: false })).toMatchObject({ allowed: true, maxCodeLines: 120 });
  });
  it("the tier follows the gates: C1 unlocks Pair, SG4 unlocks Supervised agent", () => {
    const s0 = emptyState();
    expect(currentTier(s0).id).toBe("T1");
    const s1: UserState = { ...s0, gates: { C1: passed() } };
    expect(currentTier(s1).id).toBe("T2");
    const s2: UserState = { ...s0, gates: { C1: passed(), SG4: passed() } };
    expect(currentTier(s2).id).toBe("T3");
    expect(buildContext(s1, {}).tier.id).toBe("T2");
  });
});

describe("Assess policy", () => {
  it.each(["solution", "debug", "hint", "explain", "review", "check", "design", "other"] as Intent[])("refuses %s", (intent) => {
    const d = decide({ mode: "assess", tier: "T3", intent, attemptedFirst: true });
    expect(d.allowed).toBe(false);
    expect(d.refusal).toMatch(/Assess mode/);
  });
  it("only clarifies instructions, with no code", () => {
    const d = decide({ mode: "assess", tier: "T3", intent: "clarify", attemptedFirst: false });
    expect(d).toMatchObject({ allowed: true, style: "clarify", maxCodeLines: 0 });
    expect(systemPrompt(d, "Week 13")).toMatch(/Never suggest an approach/);
  });
});

describe("reply filter", () => {
  const reply = "Here:\n```python\na=1\nb=2\nc=3\nd=4\n```\nDone.";
  it("removes code over the limit and says why", () => {
    const d = decide({ mode: "learn", tier: "T1", intent: "debug", attemptedFirst: true }); // 3 lines
    const r = filterReply(reply, d);
    expect(r.redacted).toBe(true);
    expect(r.text).not.toContain("a=1");
    expect(r.text).toMatch(/up to 3 lines/);
  });
  it("keeps code within the limit untouched", () => {
    const d = decide({ mode: "build", tier: "T2", intent: "debug", attemptedFirst: true });
    expect(filterReply(reply, d)).toEqual({ text: reply, redacted: false });
  });
  it("strips every code block in Assess", () => {
    const d = decide({ mode: "assess", tier: "T3", intent: "clarify", attemptedFirst: false });
    const r = filterReply("```\nx\n```", d);
    expect(r.redacted).toBe(true);
    expect(r.text).toMatch(/Assess mode allows no code/);
  });
});

describe("mode resolution and context", () => {
  const base = emptyState(); // week 1, P01.1a, mastery 0
  it("defaults to Learn for a new topic and refuses Build until Practised", () => {
    expect(resolveMode(base, {}, null).mode).toBe("learn");
    expect(resolveMode(base, {}, "build")).toMatchObject({ mode: "learn", reason: expect.stringMatching(/Practised/) });
    const practised: UserState = { ...base, topics: { "P01.1a": { mastery: 3, depth: null, evidence: "", reviews: { count: 0 }, updatedAt: "" } } };
    expect(resolveMode(practised, {}, null).mode).toBe("build");
    expect(resolveMode(base, { projectId: "PR01" }, null).mode).toBe("build");
  });
  it("a checkpoint attempt in progress forces Assess and locks it", () => {
    const attempting: UserState = { ...base, gates: { G0: { status: "attempting", criteria: {}, evidence: "" } } };
    expect(resolveMode(attempting, { gateId: "G0" }, "learn")).toMatchObject({ mode: "assess", locked: true });
    expect(resolveMode(base, {}, "assess")).toMatchObject({ mode: "assess", locked: false });
  });
  it("builds a deterministic context summary without personal text", () => {
    const s: UserState = { ...base, notes: { "week:1": { text: "private diary", updatedAt: "" } } };
    const c = buildContext(s, { topicId: "P01.1a" });
    expect(c.topic).toMatchObject({ id: "P01.1a", masteryLabel: "Not started" });
    expect(c.activeMode.id).toBe("A");
    const text = contextSummary(c);
    expect(text).toMatch(/^Week 1 of 206/);
    expect(text).toMatch(/AI tier: Tutor/);
    expect(text).not.toContain("private diary");
    expect(contextSummary(buildContext(s, { topicId: "P01.1a" }))).toBe(text);
  });
});

describe("provider configuration", () => {
  it("needs a key and a strong access token; the public status never leaks secrets", () => {
    expect(readAiConfig({})).toMatchObject({ configured: false, reason: "missing_api_key", model: "claude-opus-5-5" });
    expect(readAiConfig({ ANTHROPIC_API_KEY: "k" })).toMatchObject({ configured: false, reason: "missing_access_token" });
    expect(readAiConfig({ ANTHROPIC_API_KEY: "k", ROADMAP_AI_ACCESS_TOKEN: "short" })).toMatchObject({ configured: false, reason: "weak_access_token" });
    expect(readAiConfig({ ANTHROPIC_API_KEY: "k", ROADMAP_AI_ACCESS_TOKEN: TOKEN, ROADMAP_AI_MODEL: "claude-sonnet-5-5" })).toMatchObject({ configured: true, model: "claude-sonnet-5-5" });
    expect(JSON.stringify(publicStatus(CONFIG))).not.toMatch(/sk-test|a-long-enough/);
  });
  it("compares tokens exactly", () => {
    expect(tokenMatches(TOKEN, TOKEN)).toBe(true);
    expect(tokenMatches(TOKEN, TOKEN + "x")).toBe(false);
    expect(tokenMatches(TOKEN, null)).toBe(false);
  });
});

describe("tutor request handling", () => {
  const ok: Provider = vi.fn(async () => ({ ok: true as const, text: "Think about the base case. What happens when n is 0?", refused: false }));
  const body = (over: object = {}) => ({ message: "why does my recursion never stop", history: [], mode: "learn", tier: "T1", attemptedFirst: true, context: "Week 3", ...over });

  it("reports an unconfigured deployment without calling the provider", async () => {
    const p = vi.fn();
    const r = await handleTutor(readAiConfig({}), null, body(), p);
    expect(r).toMatchObject({ status: 503, body: { error: "not_configured" } });
    expect(p).not.toHaveBeenCalled();
  });

  it("rejects requests without the access token", async () => {
    expect((await handleTutor(CONFIG, "nope", body(), ok)).status).toBe(401);
  });

  it("validates input", async () => {
    expect(parseTutorRequest({ message: "", mode: "learn", tier: "T1" })).toMatchObject({ ok: false, status: 400 });
    expect(parseTutorRequest({ message: "x".repeat(5000), mode: "learn", tier: "T1" })).toMatchObject({ ok: false, status: 413 });
    expect(parseTutorRequest({ message: "hi", mode: "god", tier: "T1" })).toMatchObject({ ok: false });
    const p = parseTutorRequest({ message: "hi", mode: "learn", tier: "T1", history: Array.from({ length: 20 }, () => ({ role: "user", content: "x" })) });
    expect(p.ok && p.value.history).toHaveLength(8);
  });

  it("refuses by policy without calling the provider, even if the client claims otherwise", async () => {
    const p = vi.fn();
    const r = await handleTutor(CONFIG, TOKEN, body({ mode: "assess", message: "what's wrong with my loop, it throws an error" }), p);
    expect(r).toMatchObject({ status: 200, body: { kind: "refused" } });
    expect(p).not.toHaveBeenCalled();
  });

  it("sends the policy as the system prompt and filters the reply", async () => {
    const long: Provider = vi.fn(async () => ({ ok: true as const, text: "```\n" + "x\n".repeat(20) + "```", refused: false }));
    const r = await handleTutor(CONFIG, TOKEN, body(), long);
    expect(r.status).toBe(200);
    expect(r.body).toMatchObject({ kind: "reply", redacted: true });
    const call = (long as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(call.model).toBe("claude-opus-5-5");
    expect(call.system).toMatch(/Mode: learn/);
    expect(call.system).toMatch(/Week 3/);
    expect(call.messages.at(-1)).toEqual({ role: "user", content: "why does my recursion never stop" });
  });

  it("drops earlier turns in Assess so help from another mode does not leak in", async () => {
    const p = vi.fn<Provider>(async () => ({ ok: true as const, text: "It means modify the array without a copy.", refused: false }));
    await handleTutor(CONFIG, TOKEN, body({ mode: "assess", message: "what does the instruction 'in place' mean?", history: [{ role: "assistant", content: "use two pointers" }] }), p);
    expect(p.mock.calls[0][0].messages).toEqual([{ role: "user", content: "what does the instruction 'in place' mean?" }]);
  });

  it("maps provider failures and refusals to calm errors", async () => {
    const down: Provider = async () => ({ ok: false, error: "network" });
    expect(await handleTutor(CONFIG, TOKEN, body(), down)).toMatchObject({ status: 502, body: { error: "network" } });
    const refuse: Provider = async () => ({ ok: true, text: "", refused: true });
    expect(await handleTutor(CONFIG, TOKEN, body(), refuse)).toMatchObject({ status: 200, body: { kind: "refused" } });
  });
});
