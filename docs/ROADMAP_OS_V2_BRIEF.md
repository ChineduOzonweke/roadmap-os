# ROADMAP OS V2 IMPLEMENTATION BRIEF (verbatim from the owner)

You are taking ownership of an existing application called ROADMAP OS.

This is not a greenfield project. Treat the existing codebase, curriculum data, UX, architecture, and behavior as valuable existing work that must be understood and preserved before making changes.

## PRODUCT

Roadmap OS is a local-first Personal Learning Operating System for an ambitious university student progressing through:

Software Engineering → Machine Learning → AI / ML Systems Engineering

Live deployment: https://roadmap-os-lovat.vercel.app/

The master curriculum is the source of truth. The application is built around a 206-week execution roadmap containing approximately:

* 46 phases
* 153 component topics
* 1,483 concepts
* 9 macro-stages
* competency checkpoints and gates
* project ladder
* DSA journal
* career tracks
* dependency graph
* curated resources
* university-aware operating modes
* mastery stages
* depth taxonomy
* AI usage rules

The existing application is already functional. The objective of this task is NOT to replace it with a different product.

The objective is to evolve it from a strong curriculum/checklist system into a genuinely useful Learning Operating System.

---

# PHASE 0 — UNDERSTAND BEFORE CHANGING

(Completed: see ROADMAP_OS_V2_AUDIT.md. Re-verify against the repo; do not trust the audit blindly.)

Before editing code:

1. Read the entire repository structure.
2. Identify the framework, app architecture, routing structure, state-management approach, persistence approach, data model, and existing component system.
3. Identify where curriculum data lives and which files are authoritative.
4. Identify how progress, mastery, notes, DSA entries, projects, and other user state are persisted.
5. Inspect package.json and all important dependencies.
6. Inspect existing tests and determine what testing infrastructure already exists.
7. Inspect the current deployed application in the browser.
8. Inspect all major routes and verify what is actually implemented versus what the documentation claims.
9. Do NOT duplicate an existing feature just because it was listed in this specification.
10. Identify technical debt, architectural risks, and obvious regressions before making changes.

Create an internal implementation plan based on what the repository actually contains.

Do not rewrite functioning parts of the application unnecessarily.

---

# PRODUCT PRINCIPLES — THESE ARE NON-NEGOTIABLE

Roadmap OS must remain:

* curriculum-first
* evidence-driven
* local-first where practical
* mobile-friendly
* fast
* minimal
* engineering-focused
* anti-tutorial-hell
* anti-gamification-bloat
* university-aware
* mastery-oriented
* project-oriented
* compatible with long-term progression

Do NOT turn this into a generic productivity app.

Do NOT add meaningless streaks, points, badges, social feeds, leaderboards, or motivational noise.

Every feature must support actual learning, execution, retention, evidence, or career development.

Preserve the existing visual identity unless a change materially improves usability.

---

# CORE LEARNING MODEL

Preserve these mastery states:

0 = Not Started
1 = Learning
2 = Explained
3 = Practised
4 = Demonstrated
5 = Retained

Preserve the depth taxonomy D0–D5.

Preserve the Active-Path operating modes:

A = Foundation Reset
B = Normal Semester
C = Heavy Semester
D = Exams
E = Internship / SIWES
F = Breaks

Preserve the AI progression:

Tutor → Pair → Supervised Agent

Preserve the Learn / Build / Assess distinction.

Assessment mode must remain protected from AI-assisted cheating.

---

# PRIORITY 0 — DATA SAFETY AND PORTABILITY

This is the highest priority.

The application must never make the user's accumulated learning history fragile.

First understand the current localStorage / IndexedDB persistence model.

Implement a robust data portability system.

Required:

1. Export all user state into a versioned JSON snapshot.
2. Import a previously exported snapshot.
3. Validate imported data before replacing current state.
4. Include a schema version.
5. Handle migrations between schema versions.
6. Provide clear backup timestamps.
7. Never silently destroy existing user data.
8. Provide a visible Backup / Export / Import area.
9. Make exported data human-readable enough that it can be recovered independently.
10. Ensure curriculum/source data is not accidentally mixed into mutable progress data.

If practical, implement automatic periodic backup generation or checkpoint/milestone backup prompts.

If external cloud credentials are required for cloud synchronization, do not invent credentials.

Instead:

* design a clean persistence/sync abstraction
* make local persistence fully reliable first
* prepare cloud synchronization behind an adapter/interface
* document the required environment variables and setup
* do not make core functionality dependent on an unavailable cloud service

---

# PRIORITY 1 — TODAY / DAILY EXECUTION WORKSPACE

Create or significantly improve the /today dashboard.

The dashboard should answer:

"What should I do right now?"

It should combine:

* current roadmap week
* current Active Mode
* primary learning block
* supporting block
* maintenance track
* active project milestone
* due reviews
* relevant checkpoint requirements
* current learning context

Respect the Cardinal Rule:

ONE primary learning block
AT MOST ONE supporting block
small maintenance track
ONE active project milestone

Do not overload the user.

Build an interactive Daily Work Unit.

Default structure:

10 min recall
30–45 min study
30–45 min coding / hands-on work
10–15 min test/debug
5–10 min verbal explanation
5 min logging

Do not hardcode durations in a way that prevents future configurability.

The user should be able to start a session and move through stages.

Persist session progress.

A completed session should create meaningful evidence/logging rather than merely incrementing a streak.

---

# PRIORITY 1 — AUTOMATED SPACED REVIEW

Operationalize the existing mastery model.

Create a review queue based on actual learning events.

Default review intervals:

2 days
7 days
30 days
90 days
180 days

Surface:

"Due for Review Today"

Each review should support an evidence-oriented outcome.

For example:

PASS:

* record review
* update next review date
* potentially advance mastery where appropriate

FAIL:

* record failure
* preserve history
* send the concept toward re-practice/foundation recovery
* schedule another review

Do not automatically mark concepts "Retained" merely because time passed.

Retention should depend on successful re-demonstration.

---

# PRIORITY 1 — ACTIVE MODE SWITCHER

Create a persistent, accessible Active Mode selector.

Modes:

A — Foundation Reset
B — Normal Semester
C — Heavy Semester
D — Exams
E — Internship / SIWES
F — Break

Changing the mode should change the recommended execution workload.

For example:

MODE D — EXAMS

* prioritize university work
* hide or de-emphasize nonessential roadmap work
* preserve lightweight maintenance
* surface review rather than new curriculum
* pause forward roadmap pressure where appropriate

MODE E — INTERNSHIP / SIWES

* prioritize internship tasks
* preserve small roadmap maintenance
* preserve project/career evidence where practical

The application should make mode changes feel like legitimate operating states, not failure states.

Persist the selected mode.

---

# PRIORITY 1 — PROJECT MILESTONES

Upgrade the project ladder so major projects have executable milestones.

Each project should support:

* milestones
* milestone status
* requirements
* evidence
* notes
* links
* GitHub repository
* screenshots / artifacts where appropriate
* technical decisions
* rejected alternatives
* failure points
* metrics
* completion criteria

Do not make every project identical if the existing data model suggests otherwise.

Start with the existing canonical projects and build a reusable milestone model.

Projects should move from:

"project listed in roadmap"

to:

"project that can actually be executed and evidenced."

---

# PRIORITY 2 — EVIDENCE SYSTEM

This is a major conceptual upgrade.

Roadmap OS should distinguish:

COMPLETION
from
PROOF OF COMPETENCY

Create a reusable evidence model where practical.

Examples:

* Git commit
* GitHub repository
* code exercise
* written explanation
* benchmark
* test result
* project artifact
* architecture diagram
* technical note
* re-test result
* screenshot
* deployed URL

A concept marked Demonstrated should be capable of having evidence attached.

A project milestone should be capable of storing evidence.

Checkpoint completion should reference evidence wherever the current architecture allows.

Do not over-engineer this, but make "evidence" a first-class concept rather than an afterthought.

---

# PRIORITY 2 — PORTFOLIO / README EXPORT

Use project evidence to generate useful technical documentation.

Implement a project export that can produce a Markdown README or technical case-study draft from the project's recorded information.

Potential sections:

* Problem
* Goal
* Architecture
* Technical choices
* Implementation
* Experiments
* Metrics
* Failure points
* Debugging
* Rejected alternatives
* Lessons learned
* Future improvements
* Evidence
* Deployment

Do not produce generic AI-written fluff.

The export should primarily transform information already recorded by the user.

---

# PRIORITY 2 — COMMAND PALETTE

Implement or improve a global command palette.

Shortcut:

Ctrl + K on Windows/Linux
Cmd + K on macOS

It should allow fast navigation/search across:

* phases
* topics
* concepts
* checkpoints
* projects
* DSA entries
* notes
* resources

Prioritize speed and usefulness over visual complexity.

---

# PRIORITY 2 — DSA JOURNAL IMPROVEMENTS

Improve the DSA journal without turning it into a clone of LeetCode.

Useful features:

* problem metadata
* pattern
* difficulty
* attempt count
* mistake classification
* solution status
* explanation
* re-solve date
* spaced re-solve queue
* clean solve date

Implement re-solve intervals such as:

3 days
14 days
30 days

Previously failed problems should return until cleanly solved.

Do not make external LeetCode synchronization a hard dependency.

A good manual workflow is more important than third-party integration.

If integration is easy and stable within the existing architecture, it may be added later.

---

# PRIORITY 3 — DEPENDENCY GRAPH

Inspect the existing dependency graph.

If it is currently static, improve it only if the architecture supports doing so cleanly.

Potential functionality:

* pan
* zoom
* node selection
* completion state
* locked / available / in-progress / mastered status
* prerequisite highlighting
* downstream capability visualization

Do not spend disproportionate engineering effort here.

The graph is a supporting feature, not the core execution loop.

---

# PRIORITY 3 — PWA / OFFLINE

Assess whether turning Roadmap OS into a robust Progressive Web App is practical with the existing architecture.

If feasible:

* add manifest
* add service worker
* cache the curriculum/application shell
* ensure core curriculum browsing works offline
* ensure local progress works offline
* handle stale data safely

Do not compromise normal web performance to achieve this.

---

# PRIORITY 3 — EMBEDDED SOCRATIC AI

Only implement this after the deterministic workflow is stable.

The assistant must be context-aware.

It should read:

* current week
* current topic
* mastery state
* current Mode
* AI Tier
* Learn / Build / Assess state

AI behavior should change accordingly.

LEARN:

* explain
* ask questions
* provide hints
* check understanding
* avoid unnecessary full solutions

BUILD:

* act as a pair
* help debug
* inspect architecture
* provide focused guidance
* avoid taking over unnecessarily

ASSESS:

* do not solve assessment tasks
* do not provide complete answers
* do not provide direct hints that defeat the assessment
* primarily clarify instructions or interact only within explicitly allowed boundaries

The rules must be enforced by application context, not merely displayed as text.

If a full AI integration requires external API credentials, implement a clean provider abstraction and UI/state model without hardcoding secrets.

---

# UX REQUIREMENTS

The application must remain:

* excellent on mobile
* usable on desktop
* responsive
* keyboard accessible
* fast
* visually calm
* information-dense without becoming cluttered

The user frequently alternates between laptop and phone.

Do not design desktop-first and merely shrink it for mobile.

The Today dashboard is especially important on mobile.

---

# ARCHITECTURAL REQUIREMENTS

Before introducing major libraries:

1. Check whether an existing dependency already solves the problem.
2. Prefer the existing project's conventions.
3. Avoid unnecessary dependencies.
4. Do not replace the framework or state layer merely because another approach is fashionable.
5. Keep components modular.
6. Separate curriculum/source data from mutable user state.
7. Keep persistence logic isolated.
8. Keep review scheduling deterministic and testable.
9. Keep evidence models extensible.
10. Preserve backwards compatibility with existing stored data.

---

# TESTING AND VERIFICATION

After implementation, test the application at multiple levels.

At minimum:

* existing tests
* new unit tests for critical state transformations
* persistence tests
* import/export tests
* review scheduling tests
* mastery transition tests
* mode switching tests
* project milestone tests
* command palette behavior
* mobile layout
* desktop layout
* browser interaction with the deployed/local app

For critical changes:

1. make change
2. run tests
3. inspect actual UI
4. fix visual/functional regressions
5. repeat

Do not declare success merely because the TypeScript/build step passes.

---

# DATA SAFETY / MIGRATION RULE

This application contains valuable user progress.

Before changing persistence schemas:

* inspect existing stored state formats
* build migration logic
* never silently reset state
* never rename or delete existing data fields without migration
* preserve unknown fields where possible
* provide safe fallback behavior for malformed data

Treat data loss as a critical bug.

---

# DEPLOYMENT

At the end:

1. ensure production build succeeds
2. ensure lint/type checks succeed where configured
3. ensure tests pass
4. verify the primary routes
5. verify responsive behavior
6. verify persistence
7. verify backup/import
8. verify Today
9. verify reviews
10. verify modes
11. verify project milestones
12. verify no existing roadmap functionality was broken

Prepare the application so it can be deployed to the existing Vercel environment.

Do not alter deployment configuration unnecessarily.

---

# EXECUTION AUTHORITY

After completing PHASE 0 and understanding the repository, do not stop merely because an implementation plan has been created.

Use the plan to proceed autonomously through PHASES B–J in the stated priority order.

Do not ask for confirmation between normal implementation steps.

Continue implementing, testing, inspecting, and fixing each phase before moving to the next.

Pause and ask for confirmation only when:

* an action is genuinely destructive or difficult to reverse
* existing user data may be at risk
* external credentials, billing, or third-party account authorization are required
* a major architectural change is unavoidable and materially conflicts with the existing architecture or product principles

For ordinary repository operations such as reading files, editing code, installing ordinary development dependencies, running tests, running builds, inspecting the local application, inspecting the deployed application, and making normal Git commits, proceed without unnecessary interruption.

The goal is autonomous end-to-end implementation, not an audit-only response.

If a feature cannot be fully completed because of an external dependency, implement the maximum safe portion locally, document the exact limitation, and continue with the remaining phases rather than stopping the entire project.

# IMPORTANT IMPLEMENTATION STRATEGY

Do not attempt to blindly implement everything at once.

Use this sequence:

PHASE A — Repository audit + architecture map
PHASE B — Data safety / persistence / export / import
PHASE C — Today dashboard + daily execution engine
PHASE D — Review queue + mastery retention
PHASE E — Mode switcher
PHASE F — Project milestones + evidence
PHASE G — Portfolio export
PHASE H — Command palette + DSA enhancements
PHASE I — Graph improvements + PWA
PHASE J — Socratic AI layer

After each phase:

* test
* inspect
* fix regressions
* keep the application runnable

---

# FINAL DELIVERABLE

When finished, provide a concise implementation report containing:

1. What already existed.
2. What you changed.
3. What new architecture/models were introduced.
4. Which files/components/routes were changed.
5. What tests were added/run.
6. Any migrations performed.
7. Any remaining limitations.
8. Any features that could not be fully implemented because they require external credentials or services.
9. Recommended next steps.

Most importantly:

DO NOT optimize for the number of features completed.

Optimize for turning Roadmap OS into a reliable daily learning operating system without damaging the curriculum, data, UX, or underlying architecture.
