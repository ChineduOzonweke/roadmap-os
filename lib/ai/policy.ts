/**
 * Socratic tutor policy: deterministic, pure, shared by the client (to explain
 * what will happen) and the server route (which enforces it). The model never
 * decides what it is allowed to do; this module does.
 *
 * Inputs: AI mode (Learn / Build / Assess, master section 109), AI tier
 * (Tutor -> Pair -> Supervised agent), the classified intent of the request,
 * and whether the learner says they attempted it first.
 * Enforcement happens in three places:
 *  1. refusal before any model call (`decide`),
 *  2. the system prompt is generated from the decision (`systemPrompt`),
 *  3. the reply is filtered against the decision (`filterReply`).
 */

export type AiModeId = "learn" | "build" | "assess";
export type TierId = "T1" | "T2" | "T3";
export type Intent = "solution" | "debug" | "review" | "check" | "hint" | "clarify" | "design" | "explain" | "other";
export type Style = "socratic" | "guided" | "pair" | "clarify";

export type Decision = {
  allowed: boolean;
  intent: Intent;
  mode: AiModeId;
  tier: TierId;
  style: Style;
  /** Maximum lines of code the reply may contain (fenced blocks). 0 = none. */
  maxCodeLines: number;
  /** Behavioural rules appended to the system prompt. */
  rules: string[];
  /** Shown instead of a model reply when `allowed` is false. */
  refusal: string | null;
};

export const INTENT_LABEL: Record<Intent, string> = {
  solution: "asks for a solution or finished code",
  debug: "debugging an error",
  review: "feedback on own work",
  check: "checking understanding",
  hint: "asking for a hint",
  clarify: "clarifying instructions",
  design: "design or architecture",
  explain: "explanation",
  other: "general question",
};

// Order matters: the first match wins. Solution requests are detected first so
// "explain and give me the full code" is treated as a solution request.
const PATTERNS: [Intent, RegExp][] = [
  ["solution", /\b(give|show|write|tell|send)\s+(me\s+)?(the\s+|a\s+)?(full\s+|complete\s+|whole\s+|final\s+|working\s+)?(answer|solution|code|implementation)\b|\bsolve\s+(it|this|the|my)\b|\b(do|finish|complete)\s+(it|this|the\s+\w+)\s+for\s+me\b|\bwrite\s+(the|a|my)\s+(function|program|script|class|query|implementation|code)\b|\bjust\s+(the\s+)?(answer|code)\b|\bwhat\s+is\s+the\s+answer\b/i],
  ["debug", /\b(error|exception|traceback|stack\s*trace|bug|crash(es|ed)?|segfault|fails?|failing|doesn'?t\s+work|not\s+working|wrong\s+output|undefined\s+is\s+not)\b/i],
  ["review", /\b(review|critique|feedback\s+on|is\s+my\s+(code|solution|approach|implementation)|check\s+my\s+code)\b/i],
  ["check", /\b(check\s+my\s+(understanding|explanation|reasoning)|did\s+i\s+(get|understand)|is\s+(this|that|my\s+\w+)\s+(right|correct)|here'?s\s+my\s+explanation)\b/i],
  ["hint", /\b(hint|nudge|clue|stuck|where\s+(do|should)\s+i\s+start|how\s+do\s+i\s+start)\b/i],
  ["clarify", /\b(what\s+does\s+(the\s+)?(task|question|instruction|requirement|prompt)|what\s+do\s+they\s+mean|meaning\s+of\s+the\s+(task|question|instruction)|am\s+i\s+allowed|is\s+it\s+allowed|allowed\s+to\s+use|clarify|constraints?|instructions?|requirements?)\b/i],
  ["design", /\b(architecture|design|structure|trade-?offs?|should\s+i\s+use|which\s+(library|database|pattern|framework)|approach\s+for)\b/i],
  ["explain", /\b(explain|why|how\s+does|how\s+do|what\s+is|what\s+are|difference\s+between|understand|intuition)\b/i],
];

export function classifyIntent(text: string): Intent {
  for (const [intent, re] of PATTERNS) if (re.test(text)) return intent;
  return "other";
}

const CODE_LIMIT: Record<TierId, number> = { T1: 12, T2: 40, T3: 120 };

const ASSESS_REFUSAL =
  "Assess mode: this attempt is yours. The tutor can only clarify what the instructions mean, not help with the approach, the answer or debugging. Finish and record your own answer first; then switch to Learn for a review.";

export function decide(input: { mode: AiModeId; tier: TierId; intent: Intent; attemptedFirst: boolean }): Decision {
  const { mode, tier, intent, attemptedFirst } = input;
  const base = { intent, mode, tier, refusal: null as string | null };

  if (mode === "assess") {
    if (intent === "clarify") {
      return {
        ...base, allowed: true, style: "clarify", maxCodeLines: 0,
        rules: [
          "This is an assessment. Only restate or interpret what the instructions or constraints mean.",
          "Never suggest an approach, algorithm, data structure, fix, test case or partial answer, even indirectly.",
          "If the question goes beyond clarifying the instructions, say that it is outside what you can help with during an assessment.",
          "Write no code.",
        ],
      };
    }
    return { ...base, allowed: false, style: "clarify", maxCodeLines: 0, rules: [], refusal: ASSESS_REFUSAL };
  }

  if (mode === "learn") {
    if (intent === "solution") {
      return {
        ...base, allowed: false, style: "socratic", maxCodeLines: 0, rules: [],
        refusal: "Learn mode: the first attempt and the solution are yours. Write an attempt, however rough, then ask for a hint, an explanation of an error, or feedback on what you wrote.",
      };
    }
    const rules = [
      "Teach Socratically: explain briefly, then ask one question that makes the learner think.",
      "Do not write the solution to the learner's exercise. A worked example must be a different, smaller problem.",
    ];
    if ((intent === "hint" || intent === "debug") && !attemptedFirst) {
      rules.push("The learner has not said they attempted it. Before any hint, ask what they tried and what they expect to happen; give at most a conceptual nudge.");
    }
    if (intent === "debug") rules.push("Explain what the error means and where to look. Do not provide corrected code.");
    if (intent === "review") rules.push("Give feedback on the learner's own code: name issues and ask questions; do not rewrite it.");
    if (intent === "check") rules.push("Assess the learner's explanation: say what is right, what is missing or wrong, and ask a follow-up question.");
    const maxCodeLines = intent === "debug" ? 3 : intent === "review" ? 5 : intent === "hint" || intent === "check" ? 0 : 8;
    return { ...base, allowed: true, style: intent === "hint" || intent === "debug" ? "guided" : "socratic", maxCodeLines, rules };
  }

  // build: a pair, bounded by the tier
  if (intent === "solution" && tier === "T1") {
    return {
      ...base, allowed: false, style: "pair", maxCodeLines: 0, rules: [],
      refusal: "Tier 1 (Tutor): AI explains and reviews, you write the code. Ask about the design, an error, or for a review of what you wrote. Pair-level help unlocks with the Programmer checkpoint (C1).",
    };
  }
  const rules = [
    "Act as a pair programmer: focus on the specific part asked about and suggest the next step.",
    "Do not take over the whole task; the learner decides what to build and verifies everything they keep.",
    "When you suggest code, keep it to the part asked about and say how to test it.",
  ];
  if (tier === "T3") rules.push("You may draft larger pieces, but list what the learner must verify (tests, edge cases, behaviour).");
  return { ...base, allowed: true, style: "pair", maxCodeLines: CODE_LIMIT[tier], rules };
}

const FENCE = /```[^\n]*\n([\s\S]*?)```/g;

/** Enforce the code limit on a model reply. Code blocks over the limit are removed, not truncated. */
export function filterReply(text: string, d: Decision): { text: string; redacted: boolean } {
  let used = 0;
  let redacted = false;
  const out = text.replace(FENCE, (block, body: string) => {
    const lines = body.replace(/\n$/, "").split("\n").length;
    if (d.maxCodeLines === 0 || used + lines > d.maxCodeLines) {
      redacted = true;
      return "_[code removed: over what this mode allows]_";
    }
    used += lines;
    return block;
  });
  if (!redacted) return { text, redacted };
  const why = d.mode === "assess" ? "Assess mode allows no code." : `This mode allows up to ${d.maxCodeLines} lines of code per reply.`;
  return { text: `${out.trim()}\n\n_${why}_`, redacted };
}

/** System prompt generated from the decision and the learner's context summary. */
export function systemPrompt(d: Decision, contextSummary: string): string {
  const role = d.mode === "assess" ? "an exam invigilator who may only clarify instructions"
    : d.mode === "learn" ? "a Socratic tutor"
    : d.tier === "T1" ? "a tutor reviewing the learner's own build" : "a pair programmer";
  return [
    `You are ${role} inside Roadmap OS, a learning system for a university student working from software engineering towards ML and AI systems engineering.`,
    `Mode: ${d.mode}. AI tier: ${d.tier}. The request is classified as: ${INTENT_LABEL[d.intent]}.`,
    "Rules (enforced by the application; follow them exactly):",
    ...d.rules.map((r) => `- ${r}`),
    d.maxCodeLines === 0 ? "- Do not include code blocks." : `- At most ${d.maxCodeLines} lines of code in total, in fenced blocks.`,
    "- Be concise: a few short paragraphs at most. Plain language, no filler, no praise.",
    "- If the learner seems to be in an exam or graded task, tell them to switch to Assess mode.",
    "",
    "Learner context:",
    contextSummary.slice(0, 2000),
  ].join("\n");
}
