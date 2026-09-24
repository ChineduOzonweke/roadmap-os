# ROADMAP OS — RECONCILED PHASE-TO-WEEK MAPPING

**Version:** v1.0 (2026-09-24) · **Status:** reconciled, **undated** (decision 9).  
**Built from:** `ROADMAP_OS_CANONICAL_CURRICULUM.md` (master MD5 `2951e64c4a6cd61691e30420b1f98f10`).  
**Replaces as scheduling source:** `VICTOR_MASTER_WEEKLY_EXECUTION_ROADMAP_2026_FINAL.md` (rebuilt from the master; not an equal authority).

## 1. Units and lanes

- **Curriculum week (CW):** one week of *active* roadmap work at the master's normal-semester capacity (roughly 5–10 external hours; primary block + light maintenance). CW numbers are not calendar weeks.
- **Calendar anchoring comes later:** heavy-semester, exam and internship periods (master Modes C, D, E) pause CW advancement. The university timeline (graduation expected 2028) is a separate track and does not compress the curriculum (decision 8).
- **Advancement:** a CW is a target, not a deadline. A failed gate turns the next CW into a repair week (master foundation failure recovery).
- **Lanes per week:** Primary (always) · Supporting (only with spare capacity; at most one) · DSA lane (from CW018, only when capacity allows) · Project (build weeks are primary so projects happen even at low capacity).
- **Content per week:** each slice names master components and concept ranges. The concept text lives in the curriculum file under the same IDs, so no week can be thinner than its master content.
- **Daily layer:** CW001–CW002 use the master's 14-day plan as written. Every other week is broken into days with the master daily work unit (recall → learn one concept → code → debug/test → explain → record next step).

## 2. Stage overview

| Stage | Name | Weeks | Count | Exit gate |
|---|---|---|---|---|
| S0 | Programming reset | CW001–CW002 | 2 | G0 |
| S1 | Tooling and programming fluency | CW003–CW014 | 12 | C1 |
| S2 | First CS/data foundations | CW015–CW021 | 7 | SG2 |
| S3 | Mathematical/data foundations | CW022–CW033 | 12 | SG3 |
| S4 | Engineering foundation | CW034–CW046 | 13 | SG4 |
| S5A | CS and backend depth | CW047–CW066 | 20 | C2 |
| S5B | Data and classical ML | CW067–CW087 | 21 | C4 |
| S5C | Production engineering | CW088–CW101 | 14 | C3, SG5 |
| S6A | Deep learning | CW102–CW112 | 11 | SG6A |
| S6B | ML engineering and MLOps | CW113–CW138 | 26 | C5 |
| S7A | Transformers, LLMs, AI engineering | CW139–CW161 | 23 | C6 |
| S7B | Systems depth | CW162–CW177 | 16 | SG7 |
| S8 | Research + specialisation | CW178–CW206 | 29 | C7 calendar-driven |

Total: **206 curriculum weeks** to the end of the first S8 pass. Foundation Reset (S0–S4) = CW001–CW046; no classical ML, deep learning, Transformers, serving or MLOps appears before CW047 (decision 4).

### Gate sequence

```text
G0 CW002  →  C1 CW014  →  SG2 CW021  →  SG3 CW033  →  SG4 CW046  →  C2 CW066  →  C4 CW087  →  C3 CW095  →  SG5 CW101  →  SG6A CW112  →  C5 CW137  →  C6 CW161  →  SG7 CW177  →  C7 (calendar)
```

## 3. DSA lane (Phase 4 after its primary block)

| Weeks | Slices | Focus |
|---|---|---|
| CW018–CW021 | P04.2 Linear structures; P04.5 Algorithm families · #1–7 (linear search → recursion) | Re-test linear structures, hashing, search/sort (2-3 sessions/week). |
| CW022–CW033 | P04.3 Trees | Trees, heaps, priority queues, tries. |
| CW034–CW046 | P04.4 Graphs | Graphs. |
| CW047–CW066 | P04.5 Algorithm families · #8–13 (divide and conquer → bit manipulation); P04.6 Problem-solving patterns | Algorithm families and problem-solving patterns; target C2 at CW66. |
| CW067–CW101 | P04.7 Interview progression | Interview progression: easy to medium, mistake log (master DSA track). |
| CW102–open | — | Maintenance at C2 level; timed practice and mocks only inside calendar-placed C7 windows. |

## 4. Week-by-week mapping

### S0 — Programming reset

#### CW001 · S0

- **Primary:** P01.1a Python › Zero-level runway · #1–9 (print() → for); #14–16 (defining functions → return values); #27 (input/output)
- **Supporting:** Environment setup (editor, Python, terminal; Git repo only if trivial)
- **Build / evidence:** Five tiny programs; break one deliberately and fix it (master Day 1 work).
- **Note:** Days 1-7 of the master plan: Days 1-3 functions, variables, expressions, input/output; Days 4-6 conditionals and boolean reasoning; Day 7 loops begin.
- **Concepts scheduled:** 13

#### CW002 · S0 · GATE G0

- **Primary:** P01.1a Python › Zero-level runway · #9–13 (for → continue); #17–26 (local vs global scope → nested structures); #28–39 (text files → Build a small program of roughly 100-200 lines without copying a walkthrough.)
- **Build / evidence:** Unseen test on Day 14 (includes the 100-200 line program, P01.1a#39).
- **Note:** Days 8-14: Days 8-9 loops; Days 10-11 strings and collections; Days 12-13 functions, decomposition, small programs; Day 14 exceptions, files, review, unseen test.
- **Concepts scheduled:** 27

### S1 — Tooling and programming fluency

#### CW003 · S1

- **Primary:** P01.1b Python › Core language · #1–13 (literals → default arguments) + P01.1f Python › Required implementations · #1 (CLI calculator)
- **Build / evidence:** Build 1: CLI calculator (P01.1f#1).
- **Note:** Fluency practice after G0; no new gate.
- **Concepts scheduled:** 14

#### CW004 · S1

- **Primary:** P01.1b Python › Core language · #14–27 (scopes → comprehensions) + P01.1f Python › Required implementations · #2 (File organiser)
- **Build / evidence:** Build 2: File organiser (P01.1f#2).
- **Concepts scheduled:** 15

#### CW005 · S1

- **Primary:** P02.1 Git
- **Build / evidence:** Recovery drills: deleted file, bad commit, merge conflict, earlier version.
- **Concepts scheduled:** 24

#### CW006 · S1

- **Primary:** P02.2 GitHub
- **Build / evidence:** Put Builds 1-2 on GitHub with README and .gitignore.
- **Concepts scheduled:** 13

#### CW007 · S1

- **Primary:** P03.1 Linux · #1–13 (filesystem hierarchy → shell scripts); #22–40 (pwd → xargs)
- **Build / evidence:** Shell navigation and text-tool exercises on your own files.
- **Concepts scheduled:** 32

#### CW008 · S1

- **Primary:** P03.1 Linux · #14–21 (package managers → cron awareness); #41–48 (curl → chown) + P03.1a Linux › Projects
- **Build / evidence:** One P03.1a project (shell automation or log filtering).
- **Concepts scheduled:** 21

#### CW009 · S1

- **Primary:** P01.1c Python › Intermediate Python · #1–9 (iterators → dataclasses) + P01.1f Python › Required implementations · #3 (Expense tracker)
- **Build / evidence:** Build 3: Expense tracker (P01.1f#3).
- **Concepts scheduled:** 10

#### CW010 · S1

- **Primary:** P01.1c Python › Intermediate Python · #10–18 (enums → structural typing concepts) + P01.1f Python › Required implementations · #4 (Log analyser)
- **Build / evidence:** Build 4: Log analyser (P01.1f#4).
- **Concepts scheduled:** 10

#### CW011 · S1

- **Primary:** P07.3 Testing + P07.4 Debugging
- **Build / evidence:** Add tests to Builds 3-4; debug one planted failure.
- **Note:** Entry depth D1-D2; P07 is revisited in S4.
- **Concepts scheduled:** 21

#### CW012 · S1

- **Primary:** P01.1d Python › Professional Python · #1–10 (virtual environments → environment variables) + P01.1f Python › Required implementations · #5 (CSV/JSON processor)
- **Build / evidence:** Build 5: CSV/JSON processor (P01.1f#5) as an installable package.
- **Concepts scheduled:** 11

#### CW013 · S1

- **Primary:** PR01 CLI Tool (build)
- **Build / evidence:** PR01 CLI Tool: design, implement, test.

#### CW014 · S1 · GATE C1

- **Primary:** PR01 CLI Tool (build)
- **Build / evidence:** PR01 finish; C1 practical gate: 3 unseen tasks in separate sessions + CLI program without walkthrough.

### S2 — First CS/data foundations

#### CW015 · S2

- **Primary:** P04.0 Data Structures & Algorithms (core scope) + P04.1 Complexity + P04.2 Linear structures · #1–3 (arrays → strings); #12–15 (memory trade-offs → locality)
- **Build / evidence:** Implement dynamic array; analyse costs.
- **Concepts scheduled:** 18

#### CW016 · S2

- **Primary:** P04.2 Linear structures · #4–9 (linked lists → deques)
- **Build / evidence:** Implement linked list, stack, queue, deque.
- **Concepts scheduled:** 6

#### CW017 · S2

- **Primary:** P04.2 Linear structures · #10–11 (hash tables → sets); #16 (collision handling) + P04.5 Algorithm families · #1–7 (linear search → recursion)
- **Build / evidence:** Implement hash table; binary search; merge sort and quicksort.
- **Concepts scheduled:** 10

#### CW018 · S2

- **Primary:** P06.1 Relational fundamentals + P06.1a Relational fundamentals › SQL mastery · #1–6 (SELECT → aggregate functions)
- **DSA lane:** P04.2, P04.5 #1–7
- **Build / evidence:** SQLBolt set + own queries on a sample database.
- **Concepts scheduled:** 18

#### CW019 · S2

- **Primary:** P06.1a Relational fundamentals › SQL mastery · #7–12 (joins → CASE)
- **DSA lane:** P04.2, P04.5 #1–7
- **Build / evidence:** Join/CTE/window exercises.
- **Concepts scheduled:** 6

#### CW020 · S2

- **Primary:** P06.1a Relational fundamentals › SQL mastery · #13–17 (string functions → materialised-view awareness) + P06.2 PostgreSQL
- **DSA lane:** P04.2, P04.5 #1–7
- **Build / evidence:** PostgreSQL install; load a dataset; P06.2 project 1 (SQL analytics exercises).
- **Concepts scheduled:** 10

#### CW021 · S2 · GATE SG2

- **Primary:** Consolidation: gate attempt, spaced re-tests, targeted repair
- **DSA lane:** P04.2, P04.5 #1–7
- **Build / evidence:** Unseen DSA set (linear structures, hashing, search/sort) + unseen SQL task; spaced re-tests of S0-S1.

### S3 — Mathematical/data foundations

#### CW022 · S3

- **Primary:** P10.3 Probability · #1–9 (sample spaces → CDF)
- **DSA lane:** P04.3
- **Build / evidence:** Problem set + Monte Carlo simulation in Python.
- **Concepts scheduled:** 9

#### CW023 · S3

- **Primary:** P10.3 Probability · #10–16 (expectation → central limit theorem)
- **DSA lane:** P04.3
- **Build / evidence:** Simulate LLN and CLT.
- **Concepts scheduled:** 7

#### CW024 · S3

- **Primary:** P10.4 Statistics · #1–6 (descriptive statistics → consistency)
- **DSA lane:** P04.3
- **Build / evidence:** Descriptive statistics and sampling on a real dataset.
- **Concepts scheduled:** 6

#### CW025 · S3

- **Primary:** P10.4 Statistics · #7–11 (confidence intervals → effect sizes)
- **DSA lane:** P04.3
- **Build / evidence:** Confidence intervals and a hypothesis test with power/effect size discussion.
- **Concepts scheduled:** 5

#### CW026 · S3

- **Primary:** P10.1a Linear Algebra › Foundations
- **DSA lane:** P04.3
- **Build / evidence:** Hand derivations + NumPy matrix operations.
- **Concepts scheduled:** 8

#### CW027 · S3

- **Primary:** P10.1b Linear Algebra › Vector spaces
- **DSA lane:** P04.3
- **Build / evidence:** Problem set.
- **Concepts scheduled:** 8

#### CW028 · S3

- **Primary:** P10.1c Linear Algebra › Geometry
- **DSA lane:** P04.3
- **Build / evidence:** Projections and orthogonality in NumPy.
- **Concepts scheduled:** 6

#### CW029 · S3

- **Primary:** P11.1 Core stack
- **DSA lane:** P04.3
- **Build / evidence:** NumPy and Pandas exercises on real data.
- **Concepts scheduled:** 5

#### CW030 · S3

- **Primary:** P11.1 Core stack + P01.1f Python › Required implementations · #7 (CLI data-analysis tool)
- **DSA lane:** P04.3
- **Build / evidence:** Build 7: CLI data-analysis tool (P01.1f#7).
- **Note:** Second pass on the core stack: Pandas depth and Matplotlib.
- **Concepts scheduled:** 6

#### CW031 · S3

- **Primary:** P11.2 Data workflow + P11.3 Data-quality reasoning · #1–6 (missing values → distributions)
- **DSA lane:** P04.3
- **Build / evidence:** Follow the master data workflow on one dataset.
- **Concepts scheduled:** 6

#### CW032 · S3

- **Primary:** P11.3 Data-quality reasoning · #7–12 (class imbalance → inconsistent categories)
- **DSA lane:** P04.3
- **Build / evidence:** Reproducible EDA report with data-quality checks.
- **Concepts scheduled:** 6

#### CW033 · S3 · GATE SG3

- **Primary:** Consolidation: gate attempt, spaced re-tests, targeted repair
- **DSA lane:** P04.3
- **Build / evidence:** Data gate (unseen EDA task) + statistics gate (unseen inference task); spaced re-tests.

### S4 — Engineering foundation

#### CW034 · S4

- **Primary:** P07.1 Code quality + P07.2 Principles
- **DSA lane:** P04.4
- **Build / evidence:** Refactor Builds 1-5 for code quality.
- **Concepts scheduled:** 15

#### CW035 · S4

- **Primary:** P07.3 Testing + P07.4 Debugging + P01.1d Python › Professional Python · #11–16 (secrets handling → debugging)
- **DSA lane:** P04.4
- **Build / evidence:** Linting, formatting, type checking, profiling on one build.
- **Note:** Second pass at D2-D3.
- **Concepts scheduled:** 27

#### CW036 · S4

- **Primary:** P07.5 Engineering workflow + P08.0 Backend Engineering (core scope) + P01.1f Python › Required implementations · #8 (reusable Python package)
- **DSA lane:** P04.4
- **Build / evidence:** Build 8: reusable Python package (P01.1f#8).
- **Concepts scheduled:** 10

#### CW037 · S4

- **Primary:** P08.1 HTTP
- **DSA lane:** P04.4
- **Build / evidence:** Inspect real HTTP traffic with curl and devtools.
- **Concepts scheduled:** 10

#### CW038 · S4

- **Primary:** P08.2 REST
- **DSA lane:** P04.4
- **Build / evidence:** Design a REST resource model on paper.
- **Concepts scheduled:** 10

#### CW039 · S4

- **Primary:** PR02 API Client / Automation Tool (build) + P01.1f Python › Required implementations · #6 (API client)
- **DSA lane:** P04.4
- **Build / evidence:** PR02 API Client: consume a public API with retries, rate limits, logging (P01.1f#6).
- **Concepts scheduled:** 1

#### CW040 · S4

- **Primary:** PR02 API Client / Automation Tool (build)
- **DSA lane:** P04.4
- **Build / evidence:** PR02 finish + README.

#### CW041 · S4

- **Primary:** P08.3 API design
- **DSA lane:** P04.4
- **Build / evidence:** API design exercise for PR03.
- **Concepts scheduled:** 9

#### CW042 · S4

- **Primary:** PR03 Database-Backed API (build) + P08.6 Backend projects · #1–4 (routing → testing)
- **DSA lane:** P04.4
- **Build / evidence:** PR03 Database-Backed API: routing, validation, database access.
- **Concepts scheduled:** 4

#### CW043 · S4

- **Primary:** PR03 Database-Backed API (build)
- **DSA lane:** P04.4
- **Build / evidence:** PR03 migrations and tests.

#### CW044 · S4

- **Primary:** PR03 Database-Backed API (build) + P01.1f Python › Required implementations · #9 (tested backend service)
- **DSA lane:** P04.4
- **Build / evidence:** PR03 finish + README (Build 9 P01.1f#9).
- **Concepts scheduled:** 1

#### CW045 · S4

- **Primary:** Consolidation: gate attempt, spaced re-tests, targeted repair
- **DSA lane:** P04.4
- **Build / evidence:** Spaced re-tests across S0-S4; repair loop (master foundation failure recovery).

#### CW046 · S4 · GATE SG4

- **Primary:** Consolidation: gate attempt, spaced re-tests, targeted repair
- **DSA lane:** P04.4
- **Build / evidence:** Foundation Reset exit review; portfolio Stage A update (T09).

### S5A — CS and backend depth

#### CW047 · S5A

- **Primary:** P05.2 Networking · #1–9 (packets → sockets)
- **Supporting:** P01.2 Java · #1–5 (syntax → constructors)
- **DSA lane:** P04.5 #8–13, P04.6
- **Build / evidence:** Simple socket programs.
- **Concepts scheduled:** 14

#### CW048 · S5A

- **Primary:** P05.2 Networking · #10–16 (DNS → sessions)
- **Supporting:** P01.2 Java · #6–10 (inheritance → composition)
- **DSA lane:** P04.5 #8–13, P04.6
- **Build / evidence:** Trace DNS + TLS for a real site.
- **Concepts scheduled:** 12

#### CW049 · S5A

- **Primary:** P05.2 Networking · #17–24 (proxies → local HTTP servers)
- **Supporting:** P01.2 Java · #11–15 (packages → streams)
- **DSA lane:** P04.5 #8–13, P04.6
- **Build / evidence:** Local HTTP server behind a reverse proxy.
- **Concepts scheduled:** 13

#### CW050 · S5A

- **Primary:** P05.1 Operating Systems · #1–6 (kernel vs user space → system calls); #22 (CPU scheduling concepts)
- **Supporting:** P01.2 Java · #16–20 (lambdas → threads)
- **DSA lane:** P04.5 #8–13, P04.6
- **Build / evidence:** Process monitor (P05.1 project idea).
- **Concepts scheduled:** 12

#### CW051 · S5A

- **Primary:** P05.1 Operating Systems · #7–14 (virtual memory → sockets awareness); #20–21 (memory allocation concepts → caching)
- **Supporting:** P01.2 Java · #21–26 (executors → JUnit)
- **DSA lane:** P04.5 #8–13, P04.6
- **Build / evidence:** File-descriptor and memory exploration exercises.
- **Concepts scheduled:** 16

#### CW052 · S5A

- **Primary:** P05.1 Operating Systems · #15–19 (synchronization → deadlocks); #23–26 (process monitor → file-system exploration tool)
- **Supporting:** P01.2 Java · #27–30 (OOP mastery → understanding enterprise systems)
- **DSA lane:** P04.5 #8–13, P04.6
- **Build / evidence:** Concurrency bugs: reproduce a race and a deadlock, then fix them.
- **Concepts scheduled:** 13

#### CW053 · S5A

- **Primary:** P06.1b Relational fundamentals › Database design
- **Supporting:** P01.1e Python › Deeper internals · #1–8 (object model → import machinery)
- **DSA lane:** P04.5 #8–13, P04.6
- **Build / evidence:** Schema design for PR03 v2 (P06.2 project 2).
- **Concepts scheduled:** 14

#### CW054 · S5A

- **Primary:** P06.1c Relational fundamentals › Transactions
- **Supporting:** P01.1e Python › Deeper internals · #9–15 (bytecode/interpreter concepts → current Python concurrency evolution)
- **DSA lane:** P04.5 #8–13, P04.6
- **Build / evidence:** Transaction-heavy exercise (P06.2 project 3).
- **Concepts scheduled:** 17

#### CW055 · S5A

- **Primary:** P06.1d Relational fundamentals › Performance + P06.2 PostgreSQL
- **DSA lane:** P04.5 #8–13, P04.6
- **Build / evidence:** Query optimisation exercise with EXPLAIN (P06.2 project 4).
- **Note:** Second pass on PostgreSQL at depth.
- **Concepts scheduled:** 16

#### CW056 · S5A

- **Primary:** P06.3 Redis + P06.1e Relational fundamentals › Distributed concepts + P06.4 NoSQL
- **DSA lane:** P04.5 #8–13, P04.6
- **Build / evidence:** Add Redis caching to PR03.
- **Concepts scheduled:** 19

#### CW057 · S5A

- **Primary:** P08.4 Identity + P08.6 Backend projects · #5–8 (users → roles) + P39.0 Security (core scope) + P39.1 General
- **DSA lane:** P04.5 #8–13, P04.6
- **Project:** PR03
- **Build / evidence:** Add users, password hashing, tokens, roles to PR03.
- **Concepts scheduled:** 22

#### CW058 · S5A

- **Primary:** P39.2 Common web risks + P08.5 Application infrastructure
- **DSA lane:** P04.5 #8–13, P04.6
- **Build / evidence:** Security review of PR03 against common web risks.
- **Concepts scheduled:** 15

#### CW059 · S5A

- **Primary:** P35.0 System Design (core scope) + P35.1 Standard design process + P35.2 Core concepts · #1–10 (availability → backpressure)
- **DSA lane:** P04.5 #8–13, P04.6
- **Build / evidence:** Design PR04 before building it.
- **Note:** System-design fundamentals at D1-D2 (master 2027-2028 list).
- **Concepts scheduled:** 22

#### CW060 · S5A

- **Primary:** PR04 URL Shortener (build) + P08.6 Backend projects · #9–13 (unique IDs → analytics)
- **DSA lane:** P04.5 #8–13, P04.6
- **Build / evidence:** PR04 URL Shortener: IDs, redirects, storage, constraints.
- **Concepts scheduled:** 5

#### CW061 · S5A

- **Primary:** PR04 URL Shortener (build) + P35.2 Core concepts · #11–19 (caching → observability)
- **DSA lane:** P04.5 #8–13, P04.6
- **Build / evidence:** PR04 cache, rate limiting, analytics.
- **Concepts scheduled:** 9

#### CW062 · S5A

- **Primary:** PR04 URL Shortener (build)
- **DSA lane:** P04.5 #8–13, P04.6
- **Build / evidence:** PR04 traffic, bottleneck, failure-mode and scaling analysis.

#### CW063 · S5A

- **Primary:** PR05 Real-Time Chat Backend (build) + P08.6 Backend projects · #14–17 (WebSockets → concurrency reasoning)
- **DSA lane:** P04.5 #8–13, P04.6
- **Build / evidence:** PR05 Real-Time Chat Backend: auth + WebSockets.
- **Concepts scheduled:** 4

#### CW064 · S5A

- **Primary:** PR05 Real-Time Chat Backend (build)
- **DSA lane:** P04.5 #8–13, P04.6
- **Build / evidence:** PR05 persistence, online/offline, retries.

#### CW065 · S5A

- **Primary:** PR05 Real-Time Chat Backend (build)
- **DSA lane:** P04.5 #8–13, P04.6
- **Build / evidence:** PR05 concurrency reasoning writeup.

#### CW066 · S5A · GATE C2

- **Primary:** Consolidation: gate attempt, spaced re-tests, targeted repair
- **DSA lane:** P04.5 #8–13, P04.6
- **Build / evidence:** C2 practical gate: mixed unseen DSA set, 80%+ over repeated attempts; explain OS, networking, database concepts.

### S5B — Data and classical ML

#### CW067 · S5B

- **Primary:** P11.4 Data projects + P11.5 Communication
- **DSA lane:** P04.7
- **Build / evidence:** Rewrite the S3 EDA as a stakeholder report.
- **Concepts scheduled:** 11

#### CW068 · S5B

- **Primary:** P12.0 Data Engineering Foundation (core scope) · #1–13 (ETL → basic orchestration)
- **DSA lane:** P04.7
- **Build / evidence:** Design the PR06 pipeline.
- **Concepts scheduled:** 13

#### CW069 · S5B

- **Primary:** PR06 Analytics Platform (build) + P12.1 Data engineering project
- **DSA lane:** P04.7
- **Build / evidence:** PR06 Analytics Platform v1: ingestion, validation, transformation, PostgreSQL.

#### CW070 · S5B

- **Primary:** PR06 Analytics Platform (build)
- **DSA lane:** P04.7
- **Build / evidence:** PR06 SQL + Python analysis, visualisation.

#### CW071 · S5B

- **Primary:** PR06 Analytics Platform (build)
- **DSA lane:** P04.7
- **Build / evidence:** PR06 v2 with batch scheduling and logging; data dictionary, findings, limitations.

#### CW072 · S5B

- **Primary:** P13.1 Problem formulation + P14.3 Baselines
- **DSA lane:** P04.7
- **Build / evidence:** Formulate 3 problems; build baselines first.
- **Concepts scheduled:** 11

#### CW073 · S5B

- **Primary:** P13.2 Regression + P10.4 Statistics · #12–13 (regression → ANOVA)
- **DSA lane:** P04.7
- **Build / evidence:** Regression on a real dataset.
- **Concepts scheduled:** 12

#### CW074 · S5B

- **Primary:** P13.3 Classification + P10.3 Probability · #17–20 (likelihood → Bayesian reasoning)
- **DSA lane:** P04.7
- **Build / evidence:** Classification on a real dataset; MLE derivation for logistic regression.
- **Concepts scheduled:** 11

#### CW075 · S5B

- **Primary:** P13.4 Boosting
- **DSA lane:** P04.7
- **Build / evidence:** Trees, ensembles, boosting comparison.
- **Concepts scheduled:** 6

#### CW076 · S5B

- **Primary:** P10.1d Linear Algebra › Advanced + P10.1e Linear Algebra › ML connections
- **DSA lane:** P04.7
- **Build / evidence:** Eigen/SVD in NumPy; PCA by hand on a small matrix.
- **Concepts scheduled:** 18

#### CW077 · S5B

- **Primary:** P13.5 Unsupervised learning
- **DSA lane:** P04.7
- **Build / evidence:** Clustering + PCA on a real dataset.
- **Concepts scheduled:** 6

#### CW078 · S5B

- **Primary:** P14.0 Machine Learning Theory (core scope)
- **DSA lane:** P04.7
- **Build / evidence:** Deliberately overfit, then regularise and cross-validate.
- **Concepts scheduled:** 13

#### CW079 · S5B

- **Primary:** P14.1 Feature engineering + P14.2 Leakage
- **DSA lane:** P04.7
- **Build / evidence:** Create leakage deliberately, then diagnose it.
- **Concepts scheduled:** 13

#### CW080 · S5B

- **Primary:** P15.1 Classification metrics + P15.2 Regression metrics
- **DSA lane:** P04.7
- **Build / evidence:** Metric exercises with error-cost reasoning.
- **Concepts scheduled:** 15

#### CW081 · S5B

- **Primary:** P15.3 Evaluation design + P15.4 Metric selection + P10.4 Statistics · #14–16 (experimental design → Bayesian statistics)
- **DSA lane:** P04.7
- **Build / evidence:** Write an evaluation plan before training; A/B test design.
- **Concepts scheduled:** 10

#### CW082 · S5B

- **Primary:** P10.2 Calculus
- **DSA lane:** P04.7
- **Build / evidence:** Derive gradients for linear and logistic loss.
- **Concepts scheduled:** 18

#### CW083 · S5B

- **Primary:** P10.5 Optimisation
- **DSA lane:** P04.7
- **Build / evidence:** Gradient descent variants on a toy objective.
- **Concepts scheduled:** 12

#### CW084 · S5B

- **Primary:** P16.0 From-Scratch ML Implementation (core scope) · #1–3 (Linear regression → Logistic regression); #9–14 (mathematical formulation → comparison with library implementation)
- **DSA lane:** P04.7
- **Build / evidence:** From scratch: linear regression, gradient descent, logistic regression.
- **Concepts scheduled:** 9

#### CW085 · S5B

- **Primary:** P16.0 From-Scratch ML Implementation (core scope) · #4–6 (k-means → Selected decision-tree components); #9–14 (mathematical formulation → comparison with library implementation) + P01.1f Python › Required implementations · #10 (small ML package)
- **DSA lane:** P04.7
- **Build / evidence:** From scratch: k-means, PCA, tree components; Build 10 small ML package (P01.1f#10).
- **Concepts scheduled:** 10

#### CW086 · S5B

- **Primary:** P17.0 Time Series (core scope) · #1–10 (temporal indexing → error evaluation)
- **DSA lane:** P04.7
- **Build / evidence:** Forecasting baseline with temporal cross-validation.
- **Concepts scheduled:** 10

#### CW087 · S5B · GATE C4

- **Primary:** Consolidation: gate attempt, spaced re-tests, targeted repair
- **DSA lane:** P04.7
- **Build / evidence:** C4 practical gate: unfamiliar dataset, reproducible analysis, 5 defensible questions, limitations, evaluated baseline/model.

### S5C — Production engineering

#### CW088 · S5C

- **Primary:** P31.0 DevOps (core scope) + P31.1 Docker · #1–5 (images → volumes)
- **DSA lane:** P04.7
- **Build / evidence:** Containerise PR03.
- **Concepts scheduled:** 19

#### CW089 · S5C

- **Primary:** P31.1 Docker · #6–9 (networks → environment configuration)
- **DSA lane:** P04.7
- **Build / evidence:** Compose PR03 + PostgreSQL + Redis.
- **Concepts scheduled:** 4

#### CW090 · S5C

- **Primary:** P31.2 CI/CD
- **DSA lane:** P04.7
- **Build / evidence:** CI pipeline: tests, lint, image build.
- **Concepts scheduled:** 7

#### CW091 · S5C

- **Primary:** P09.0 Software Architecture (core scope) · #1–8 (separation of concerns → service boundaries)
- **DSA lane:** P04.7
- **Build / evidence:** Refactor PR03 into layered design.
- **Concepts scheduled:** 8

#### CW092 · S5C

- **Primary:** P09.0 Software Architecture (core scope) · #9–14 (domain boundaries → architectural patterns) + P09.1 Design-pattern families + P09.2 Critical rule
- **DSA lane:** P04.7
- **Build / evidence:** Architecture note for PR04.
- **Concepts scheduled:** 14

#### CW093 · S5C

- **Primary:** P32.0 Cloud (core scope)
- **DSA lane:** P04.7
- **Build / evidence:** Cloud account, IAM, compute, managed database basics.
- **Concepts scheduled:** 14

#### CW094 · S5C

- **Primary:** P32.1 Required cloud project
- **DSA lane:** P04.7
- **Build / evidence:** Deploy PR03/PR04 with networking, identity, database, logs, monitoring, deployment automation.
- **Concepts scheduled:** 6

#### CW095 · S5C · GATE C3

- **Primary:** Consolidation: gate attempt, spaced re-tests, targeted repair
- **DSA lane:** P04.7
- **Build / evidence:** C3 practical gate: service with auth, persistence, tests, API docs, real deployment.

#### CW096 · S5C

- **Primary:** P29.1 Batch inference + P29.2 Online inference
- **DSA lane:** P04.7
- **Build / evidence:** Serve a classical model (batch + online) behind FastAPI.
- **Note:** Early serving segment at D1-D2 (master sequence item 24). Formal D3 serving is in S6B.
- **Concepts scheduled:** 12

#### CW097 · S5C

- **Primary:** PR07 Fraud Detection Platform (build)
- **DSA lane:** P04.7
- **Build / evidence:** PR07 Fraud Detection: data, validation, features, splits, baseline.
- **Note:** Master: if a fraud-detection project already exists, upgrade it instead of rebuilding.

#### CW098 · S5C

- **Primary:** PR07 Fraud Detection Platform (build)
- **DSA lane:** P04.7
- **Build / evidence:** PR07 model comparison, threshold choice, error costs (P46 reasoning).

#### CW099 · S5C

- **Primary:** PR07 Fraud Detection Platform (build)
- **DSA lane:** P04.7
- **Build / evidence:** PR07 API + deployment.

#### CW100 · S5C

- **Primary:** PR07 Fraud Detection Platform (build)
- **DSA lane:** P04.7
- **Build / evidence:** PR07 monitoring, drift discussion, temporal-leakage check.

#### CW101 · S5C · GATE SG5

- **Primary:** Consolidation: gate attempt, spaced re-tests, targeted repair
- **DSA lane:** P04.7
- **Build / evidence:** Stage 5 exit review; portfolio Stage B update (T09).

### S6A — Deep learning

#### CW102 · S6A

- **Primary:** P19.0 Deep Learning (core scope) + P19.1 Neural-network foundations
- **Supporting:** P05.3 Computer Architecture · #1–6 (CPU → cache)
- **Build / evidence:** Hand-compute forward pass of a tiny network.
- **Concepts scheduled:** 14

#### CW103 · S6A

- **Primary:** P19.2 Activations + P16.0 From-Scratch ML Implementation (core scope) · #7–8 (Simple neural network → Backpropagation)
- **Supporting:** P05.3 Computer Architecture · #7–12 (RAM → integer representation)
- **Build / evidence:** From scratch in NumPy: simple neural network + backpropagation.
- **Concepts scheduled:** 13

#### CW104 · S6A

- **Primary:** P19.3 Training · #1–6 (initialisation → momentum)
- **Supporting:** P05.3 Computer Architecture · #13–19 (floating-point awareness → compiled code can outperform interpreted code in appropriate workloads)
- **Build / evidence:** Custom training loop in PyTorch.
- **Concepts scheduled:** 13

#### CW105 · S6A

- **Primary:** P19.3 Training · #7–12 (Adam → early stopping)
- **Build / evidence:** Optimiser/regularisation ablation.
- **Concepts scheduled:** 6

#### CW106 · S6A

- **Primary:** P19.4 Failure modes
- **Build / evidence:** Reproduce and fix vanishing gradients and overfitting.
- **Concepts scheduled:** 7

#### CW107 · S6A

- **Primary:** P19.5 Required builds
- **Build / evidence:** All five required builds, with checkpointing.
- **Concepts scheduled:** 5

#### CW108 · S6A

- **Primary:** P20.0 Computer Vision (core scope) · #1–12 (image representation → segmentation awareness)
- **Build / evidence:** Image classifier.
- **Concepts scheduled:** 12

#### CW109 · S6A

- **Primary:** P20.0 Computer Vision (core scope) · #13–20 (LeNet → document/industrial image analysis)
- **Build / evidence:** Transfer-learning classifier.
- **Concepts scheduled:** 8

#### CW110 · S6A

- **Primary:** P21.0 Sequence Models and NLP (core scope) · #1–6 (sequences → RNNs)
- **Build / evidence:** Sequence classifier with embeddings.
- **Concepts scheduled:** 6

#### CW111 · S6A

- **Primary:** P21.0 Sequence Models and NLP (core scope) · #7–11 (hidden state → teacher forcing awareness) + P17.0 Time Series (core scope) · #11–15 (ARIMA awareness → deep-learning forecasting awareness)
- **Build / evidence:** LSTM/GRU comparison; forecasting 'later' items (P17 Later list).
- **Note:** Optional exposure only: reading on attention is allowed here but is not a gate (decision 5).
- **Concepts scheduled:** 10

#### CW112 · S6A · GATE SG6A

- **Primary:** Consolidation: gate attempt, spaced re-tests, targeted repair
- **Build / evidence:** Deep-learning phase gates; spaced re-tests of classical ML.

### S6B — ML engineering and MLOps

#### CW113 · S6B

- **Primary:** P28.0 ML Engineering (core scope) · #1–10 (project structure → experiment tracking) + P28.1 Standard lifecycle
- **Build / evidence:** Restructure PR07 as a reproducible training pipeline.
- **Concepts scheduled:** 10

#### CW114 · S6B

- **Primary:** P28.0 ML Engineering (core scope) · #11–21 (data versioning → retraining) + P28.2 Production questions
- **Build / evidence:** Answer the production questions for PR07.
- **Concepts scheduled:** 23

#### CW115 · S6B

- **Primary:** P29.1 Batch inference
- **Build / evidence:** Batch inference job at D3.
- **Note:** Formal serving pass at D3.
- **Concepts scheduled:** 5

#### CW116 · S6B

- **Primary:** P29.2 Online inference
- **Build / evidence:** Online inference: latency, batching, health checks.
- **Concepts scheduled:** 7

#### CW117 · S6B

- **Primary:** P29.3 Serving project
- **Build / evidence:** Serving project: versioned API, metrics, rollback plan.
- **Concepts scheduled:** 4

#### CW118 · S6B

- **Primary:** P30.1 Level 1
- **Build / evidence:** MLOps Level 1.
- **Concepts scheduled:** 5

#### CW119 · S6B

- **Primary:** P30.2 Level 2
- **Build / evidence:** MLOps Level 2.
- **Concepts scheduled:** 4

#### CW120 · S6B

- **Primary:** P30.3 Level 3
- **Build / evidence:** MLOps Level 3.
- **Concepts scheduled:** 4

#### CW121 · S6B

- **Primary:** P30.4 Level 4
- **Build / evidence:** MLOps Level 4: monitoring, drift, retraining.
- **Concepts scheduled:** 5

#### CW122 · S6B

- **Primary:** P38.0 Observability (core scope) + P38.1 Metrics
- **Build / evidence:** Metrics for the serving project.
- **Concepts scheduled:** 13

#### CW123 · S6B

- **Primary:** P38.2 Logging + P38.3 Tracing
- **Build / evidence:** Instrument one service; trace a request across components.
- **Concepts scheduled:** 8

#### CW124 · S6B

- **Primary:** P33.0 Terraform / Infrastructure as Code (core scope)
- **Build / evidence:** Provision one portfolio system with Terraform.
- **Concepts scheduled:** 13

#### CW125 · S6B

- **Primary:** P34.0 Kubernetes (core scope) · #1–11 (Linux → ConfigMaps)
- **Build / evidence:** Local cluster (Minikube/kind).
- **Concepts scheduled:** 11

#### CW126 · S6B

- **Primary:** P34.0 Kubernetes (core scope) · #12–18 (Secrets → namespaces)
- **Build / evidence:** Deploy the serving project to the local cluster.
- **Concepts scheduled:** 7

#### CW127 · S6B

- **Primary:** P18.0 Recommender Systems (core scope) · #1–7 (recommendation problem formulation → similarity)
- **Build / evidence:** Candidate generation + collaborative filtering prototype.
- **Concepts scheduled:** 7

#### CW128 · S6B

- **Primary:** P18.0 Recommender Systems (core scope) · #8–13 (cold start → online experimentation)
- **Build / evidence:** Offline evaluation of the prototype.
- **Concepts scheduled:** 6

#### CW129 · S6B

- **Primary:** PR08 Recommendation System (build)
- **Build / evidence:** PR08 Recommendation System: event ingestion, representations.

#### CW130 · S6B

- **Primary:** PR08 Recommendation System (build)
- **Build / evidence:** PR08 retrieval + ranking.

#### CW131 · S6B

- **Primary:** PR08 Recommendation System (build)
- **Build / evidence:** PR08 evaluation + serving API.

#### CW132 · S6B

- **Primary:** PR08 Recommendation System (build)
- **Build / evidence:** PR08 production design writeup.

#### CW133 · S6B

- **Primary:** PR09 ML Serving Platform (build)
- **Supporting:** P45.0 Cost Engineering (core scope) · #1–8 (compute cost → operational complexity)
- **Build / evidence:** PR09 ML Serving Platform: registry, model selection, versioning.
- **Concepts scheduled:** 8

#### CW134 · S6B

- **Primary:** PR09 ML Serving Platform (build)
- **Supporting:** P45.0 Cost Engineering (core scope) · #9–15 (tokens → model quality vs cost)
- **Build / evidence:** PR09 inference API, latency, batching.
- **Concepts scheduled:** 7

#### CW135 · S6B

- **Primary:** PR09 ML Serving Platform (build)
- **Build / evidence:** PR09 health checks + monitoring.

#### CW136 · S6B

- **Primary:** PR09 ML Serving Platform (build)
- **Build / evidence:** PR09 cost analysis + documentation.

#### CW137 · S6B · GATE C5

- **Primary:** Consolidation: gate attempt, spaced re-tests, targeted repair
- **Build / evidence:** C5 practical gate: end-to-end ML service from ingestion through inference and monitoring.

#### CW138 · S6B

- **Primary:** Consolidation: gate attempt, spaced re-tests, targeted repair
- **Build / evidence:** Buffer/repair; portfolio Stage C update (T09).

### S7A — Transformers, LLMs, AI engineering

#### CW139 · S7A

- **Primary:** P22.0 Attention and Transformers (core scope) · #1–8 (query → multi-head attention)
- **Build / evidence:** Scaled dot-product attention in NumPy.
- **Concepts scheduled:** 8

#### CW140 · S7A

- **Primary:** P22.0 Attention and Transformers (core scope) · #9–15 (positional information → autoregressive generation) + P22.1 Required understanding
- **Build / evidence:** Explain why attention works (required understanding).
- **Concepts scheduled:** 7

#### CW141 · S7A

- **Primary:** P22.2 Required build · #1–5 (token embeddings → feed-forward block)
- **Build / evidence:** Mini Transformer steps 1-5.
- **Concepts scheduled:** 5

#### CW142 · S7A

- **Primary:** P22.2 Required build · #6–10 (residual connections → text generation)
- **Build / evidence:** Mini Transformer steps 6-10: training loop + generation.
- **Concepts scheduled:** 5

#### CW143 · S7A

- **Primary:** P23.1 Tokenisation + P23.2 Embeddings
- **Supporting:** P01.3 JavaScript / TypeScript · #1–5 (variables → modules)
- **Build / evidence:** Tokeniser + embedding experiments.
- **Concepts scheduled:** 18

#### CW144 · S7A

- **Primary:** P23.3 Model lifecycle
- **Supporting:** P01.3 JavaScript / TypeScript · #6–10 (scope → event loop concepts)
- **Build / evidence:** Model lifecycle notes.
- **Concepts scheduled:** 12

#### CW145 · S7A

- **Primary:** P23.4 Fine-tuning
- **Supporting:** P01.3 JavaScript / TypeScript · #11–15 (HTTP requests → TypeScript types)
- **Build / evidence:** Small fine-tuning run (LoRA/PEFT).
- **Concepts scheduled:** 12

#### CW146 · S7A

- **Primary:** P23.5 Inference + P23.6 Tooling
- **Supporting:** P01.3 JavaScript / TypeScript · #16–19 (interfaces → basic React)
- **Build / evidence:** Inference benchmarking.
- **Concepts scheduled:** 12

#### CW147 · S7A

- **Primary:** P24.0 Retrieval-Augmented Generation (core scope) · #1–8 (document ingestion → hybrid retrieval)
- **Build / evidence:** Ingestion + chunking + hybrid retrieval prototype.
- **Concepts scheduled:** 8

#### CW148 · S7A

- **Primary:** P24.0 Retrieval-Augmented Generation (core scope) · #9–15 (vector indexes → generation metrics)
- **Build / evidence:** Reranking + citation grounding + retrieval metrics.
- **Concepts scheduled:** 7

#### CW149 · S7A

- **Primary:** P24.1 Failure modes
- **Build / evidence:** Reproduce each RAG failure mode.
- **Concepts scheduled:** 9

#### CW150 · S7A

- **Primary:** P27.0 AI Evaluation (core scope) + P27.1 Evaluation loop
- **Build / evidence:** Build a labelled evaluation set.
- **Concepts scheduled:** 11

#### CW151 · S7A

- **Primary:** P27.2 Evaluation levels
- **Build / evidence:** Regression suite across evaluation levels.

#### CW152 · S7A

- **Primary:** P25.0 AI Agents (core scope) · #1–7 (function calling → execution)
- **Build / evidence:** Deterministic tool use first.
- **Concepts scheduled:** 7

#### CW153 · S7A

- **Primary:** P25.0 AI Agents (core scope) · #8–13 (retries → evaluation)
- **Build / evidence:** Bounded agent loop with guardrails and evaluation.
- **Concepts scheduled:** 6

#### CW154 · S7A

- **Primary:** P39.3 AI security
- **Build / evidence:** Prompt-injection and data-leak threat model.
- **Concepts scheduled:** 9

#### CW155 · S7A

- **Primary:** P44.0 AI Engineering as a Systems Discipline (core scope)
- **Build / evidence:** AI system design note combining the S7A pieces.
- **Concepts scheduled:** 9

#### CW156 · S7A

- **Primary:** PR10 RAG Research Platform (build) + P24.2 Required project
- **Build / evidence:** PR10 RAG Research Platform: ingestion, parsing, chunking, embeddings.
- **Concepts scheduled:** 9

#### CW157 · S7A

- **Primary:** PR10 RAG Research Platform (build)
- **Build / evidence:** PR10 retrieval, reranking, generation, citations.

#### CW158 · S7A

- **Primary:** PR10 RAG Research Platform (build)
- **Build / evidence:** PR10 evaluation set + failure analysis.

#### CW159 · S7A

- **Primary:** PR10 RAG Research Platform (build)
- **Build / evidence:** PR10 auth, logging, security.

#### CW160 · S7A

- **Primary:** PR10 RAG Research Platform (build)
- **Build / evidence:** PR10 observability + cost notes.

#### CW161 · S7A · GATE C6

- **Primary:** Consolidation: gate attempt, spaced re-tests, targeted repair
- **Build / evidence:** C6 practical gate: evaluated AI system with evaluation set, retrieval/tool tests, failure analysis, observability.

### S7B — Systems depth

#### CW162 · S7B

- **Primary:** P35.1 Standard design process + P35.2 Core concepts · #1–10 (availability → backpressure)
- **Build / evidence:** Design exercise at D3.
- **Note:** Second pass at D3-D4.
- **Concepts scheduled:** 22

#### CW163 · S7B

- **Primary:** P35.2 Core concepts · #11–19 (caching → observability)
- **Build / evidence:** Capacity estimation drills.
- **Concepts scheduled:** 9

#### CW164 · S7B

- **Primary:** P35.3 Systems to design
- **Build / evidence:** Design two systems from the master list.
- **Concepts scheduled:** 10

#### CW165 · S7B

- **Primary:** P35.3 Systems to design
- **Build / evidence:** Design two more; compare trade-offs.
- **Concepts scheduled:** 10

#### CW166 · S7B

- **Primary:** P36.0 Distributed Systems (core scope) · #1–8 (distributed-system characteristics → quorum concepts)
- **Build / evidence:** MIT 6.5840 lab (as prerequisites permit).
- **Concepts scheduled:** 8

#### CW167 · S7B

- **Primary:** P36.0 Distributed Systems (core scope) · #9–15 (partitioning → fault tolerance)
- **Build / evidence:** Idempotency and retry experiments.
- **Concepts scheduled:** 7

#### CW168 · S7B

- **Primary:** P36.0 Distributed Systems (core scope) · #16–20 (consensus → event sourcing)
- **Build / evidence:** Replicated key-value store or Raft lab.
- **Concepts scheduled:** 5

#### CW169 · S7B

- **Primary:** P37.0 ML System Design (core scope) + P37.1 Recommendation system + P37.2 Fraud detection
- **Build / evidence:** Design and defend recommendation + fraud systems.
- **Concepts scheduled:** 12

#### CW170 · S7B

- **Primary:** P37.3 Search + P37.4 Model-serving platform + P37.5 RAG system
- **Build / evidence:** Design and defend search, serving platform, RAG systems.

#### CW171 · S7B

- **Primary:** P42.0 Advanced ML System Topics (core scope) + P42.1 Feature stores
- **Build / evidence:** Feature-store design for PR07.
- **Concepts scheduled:** 5

#### CW172 · S7B

- **Primary:** P42.2 Distributed training
- **Build / evidence:** Distributed-training concepts exercise.
- **Concepts scheduled:** 5

#### CW173 · S7B

- **Primary:** P42.3 Model optimisation
- **Build / evidence:** Quantisation/distillation experiment.
- **Concepts scheduled:** 6

#### CW174 · S7B

- **Primary:** P42.4 High-scale inference
- **Build / evidence:** High-scale inference analysis.
- **Concepts scheduled:** 8

#### CW175 · S7B

- **Primary:** P26.0 Multimodal AI (core scope) · #1–5 (vision-language models → multimodal tokenisation awareness)
- **Build / evidence:** Vision-language model exploration.
- **Concepts scheduled:** 5

#### CW176 · S7B

- **Primary:** P26.0 Multimodal AI (core scope) · #6–10 (multimodal retrieval → multimodal search)
- **Build / evidence:** One multimodal project from the master list.
- **Concepts scheduled:** 5

#### CW177 · S7B · GATE SG7

- **Primary:** Consolidation: gate attempt, spaced re-tests, targeted repair
- **Build / evidence:** Systems exit review.

### S8 — Research + specialisation

#### CW178 · S8

- **Primary:** P40.1 Reading papers
- **Build / evidence:** Read and annotate papers with the master question list.
- **Concepts scheduled:** 10

#### CW179 · S8

- **Primary:** P40.2 Reproduction ladder
- **Build / evidence:** Choose one paper to reproduce.

#### CW180 · S8

- **Primary:** P40.3 Experimental discipline
- **Build / evidence:** Experiment tracking discipline on the reproduction.
- **Concepts scheduled:** 9

#### CW181 · S8

- **Primary:** P40.4 Research writing
- **Build / evidence:** Write the reproduction report.
- **Concepts scheduled:** 8

#### CW182 · S8

- **Primary:** Paper reproduction (P40 reproduction ladder applied)
- **Build / evidence:** Paper reproduction, part 1 of 4.

#### CW183 · S8

- **Primary:** Paper reproduction (P40 reproduction ladder applied)
- **Build / evidence:** Paper reproduction, part 2 of 4.

#### CW184 · S8

- **Primary:** Paper reproduction (P40 reproduction ladder applied)
- **Build / evidence:** Paper reproduction, part 3 of 4.

#### CW185 · S8

- **Primary:** Paper reproduction (P40 reproduction ladder applied)
- **Build / evidence:** Paper reproduction, part 4 of 4.

#### CW186 · S8

- **Primary:** Specialisation work (master specialisation strategy)
- **Build / evidence:** Select one specialisation (master specialisation strategy).

#### CW187 · S8

- **Primary:** Specialisation work (master specialisation strategy)
- **Build / evidence:** Specialisation depth block 1 of 8 (content per chosen track).

#### CW188 · S8

- **Primary:** Specialisation work (master specialisation strategy)
- **Build / evidence:** Specialisation depth block 2 of 8 (content per chosen track).

#### CW189 · S8

- **Primary:** Specialisation work (master specialisation strategy)
- **Build / evidence:** Specialisation depth block 3 of 8 (content per chosen track).

#### CW190 · S8

- **Primary:** Specialisation work (master specialisation strategy)
- **Build / evidence:** Specialisation depth block 4 of 8 (content per chosen track).

#### CW191 · S8

- **Primary:** Specialisation work (master specialisation strategy)
- **Build / evidence:** Specialisation depth block 5 of 8 (content per chosen track).

#### CW192 · S8

- **Primary:** Specialisation work (master specialisation strategy)
- **Build / evidence:** Specialisation depth block 6 of 8 (content per chosen track).

#### CW193 · S8

- **Primary:** Specialisation work (master specialisation strategy)
- **Build / evidence:** Specialisation depth block 7 of 8 (content per chosen track).

#### CW194 · S8

- **Primary:** Specialisation work (master specialisation strategy)
- **Build / evidence:** Specialisation depth block 8 of 8 (content per chosen track).

#### CW195 · S8

- **Primary:** PR11 Intelligent Financial Research Platform (build)
- **Build / evidence:** PR11 Intelligent Financial Research Platform: requirements + architecture.

#### CW196 · S8

- **Primary:** PR11 Intelligent Financial Research Platform (build)
- **Build / evidence:** PR11 Intelligent Financial Research Platform: data service.

#### CW197 · S8

- **Primary:** PR11 Intelligent Financial Research Platform (build)
- **Build / evidence:** PR11 Intelligent Financial Research Platform: data service.

#### CW198 · S8

- **Primary:** PR11 Intelligent Financial Research Platform (build)
- **Build / evidence:** PR11 Intelligent Financial Research Platform: analytics service.

#### CW199 · S8

- **Primary:** PR11 Intelligent Financial Research Platform (build)
- **Build / evidence:** PR11 Intelligent Financial Research Platform: ML layer.

#### CW200 · S8

- **Primary:** PR11 Intelligent Financial Research Platform (build)
- **Build / evidence:** PR11 Intelligent Financial Research Platform: ML layer.

#### CW201 · S8

- **Primary:** PR11 Intelligent Financial Research Platform (build)
- **Build / evidence:** PR11 Intelligent Financial Research Platform: AI service: retrieval.

#### CW202 · S8

- **Primary:** PR11 Intelligent Financial Research Platform (build)
- **Build / evidence:** PR11 Intelligent Financial Research Platform: AI service: evaluation.

#### CW203 · S8

- **Primary:** PR11 Intelligent Financial Research Platform (build)
- **Build / evidence:** PR11 Intelligent Financial Research Platform: frontend (P01.3).

#### CW204 · S8

- **Primary:** PR11 Intelligent Financial Research Platform (build)
- **Build / evidence:** PR11 Intelligent Financial Research Platform: observability + security.

#### CW205 · S8

- **Primary:** PR11 Intelligent Financial Research Platform (build)
- **Build / evidence:** PR11 Intelligent Financial Research Platform: cost + performance reports.

#### CW206 · S8

- **Primary:** PR11 Intelligent Financial Research Platform (build)
- **Build / evidence:** PR11 Intelligent Financial Research Platform: documentation set + demo.

## 5. Tracks

- **T01 DSA / Interview preparation:** Primary block CW15-17, lane from CW18 (see DSA lane).
- **T02 FAANG / Top-tier tech:** Coding/CS parts ride the DSA lane; system design from S5A; ML system design from S7B; behavioural stories from first internship evidence.
- **T03 Resume:** Update at every stage exit gate.
- **T04 GitHub:** From S1 (every build in Git).
- **T05 Open source:** Reading codebases from S5; contributions from S7.
- **T06 Technical writing:** READMEs from PR01; writeups at every project and checkpoint.
- **T07 Research:** Light paper reading allowed earlier; full phase after C5 (Phase 40 gate).
- **T08 Internship strategy:** Calendar-driven; placements map into the curriculum (Mode E).
- **T09 Portfolio strategy by stage:** Portfolio Stage A after S4, B after S5, C after S6, D in S8.
- **T10 Certification strategy:** Only with a concrete reason (master).
- **T11 What not to get distracted by:** Standing rule.

## 6. On-demand and optional (not in the weekly spine)

- **P05.4:** OPTIONAL (🟡). Schedule only if a runtime/compiler need appears or in a specialisation.
- **P12.0#14-16:** Later technologies (Airflow, Spark, Kafka): learn on demand under Phase 43 when a real scaling/workflow problem appears (master Phase 12 and 43 text).
- **P41.0:** OPTIONAL branch (🟢). Gate: after C5 and only if a project or research direction requires it.
- **P43.0:** On demand after data, backend, deployment and ML-lifecycle concepts work (Phase 43 GATE).
- **P46.0:** Continuous: awareness from S4; detailed product reasoning inside PR07, PR11 and internships (Phase 46 GATE).

## 7. Validation report

- **Concept coverage:** 1440 of 1440 schedulable master concept lines are assigned to a week or lane (on-demand items excluded by rule). Uncovered: 0.
- **Phase prerequisite violations:** 0.
- **Component edge violations:** 0.
- **Checkpoint-before-requirement violations:** 0.
- **Project-before-requirement violations:** 0.
- **Decision 5 chain:** P13 first CW072 < P31 first CW088 < P32 cloud project CW094 < P19 first CW102 < P28 first CW113 < C5 CW137 < P22 first CW139

**Density** (master concept lines per study week; project and consolidation weeks excluded):

| Stage | Weeks | Study weeks | Min | Mean | Max |
|---|---|---|---|---|---|
| S0 | 2 | 2 | 13 | 20.0 | 27 |
| S1 | 12 | 10 | 10 | 17.1 | 32 |
| S2 | 7 | 6 | 6 | 11.3 | 18 |
| S3 | 12 | 11 | 5 | 6.5 | 9 |
| S4 | 13 | 6 | 9 | 13.5 | 27 |
| S5 | 55 | 38 | 4 | 12.8 | 22 |
| S6 | 37 | 26 | 4 | 8.7 | 23 |
| S7 | 39 | 32 | 0 | 8.2 | 22 |
| S8 | 29 | 4 | 0 | 6.8 | 10 |

Weeks with 0 list lines (CW151, CW170, CW179) carry master components written as diagrams or prose (evaluation levels, search/serving/RAG system flows, the reproduction ladder), not empty content.

## 8. Next step: calendar anchoring (not applied)

1. Choose the Week 1 start date.
2. Build the university timeline separately: semesters, exam windows, internship/SIWES periods, graduation (expected 2028).
3. For each calendar week assign a mode (A–F). Modes C/D pause CW advancement; Mode E maps internship work onto overlapping components; Mode F may run two CWs or a project push.
4. Place C7 preparation windows against real recruiting dates, using whichever checkpoints are passed by then.
5. Only then generate dated weeks and the daily layer.

