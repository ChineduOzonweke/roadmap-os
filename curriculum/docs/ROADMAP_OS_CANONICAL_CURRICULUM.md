# ROADMAP OS — CANONICAL CURRICULUM STRUCTURE

**Version:** v1.0 (2026-09-24)  
**Authority:** normalised from `MASTER_ROADMAP_VICTOR_2026_FINAL_2026-09-17.md` (MD5 `c85d55c0e1916af940605fe1467edc3c`).  
**Rule:** the master decides *what* is learned and the dependency order. If this file and the master ever disagree, the master wins and this file is regenerated. Every concept line below is the master's own text; only IDs, heading levels and grouping were added.  
**Scope:** curriculum structure only. Scheduling lives in `ROADMAP_OS_PHASE_WEEK_MAPPING.md`; decisions and fixes live in `ROADMAP_OS_RECONCILIATION_LOG.md`.

## Contents
- 1. Architecture and ID scheme
- 2. Stages
- 3. Dependency model
- 4. Competency checkpoints
- 5. Canonical projects
- 6. Continuous tracks
- 7. Operating rules (master text)
- 8. Phase catalogue (P01–P46)
- 9. Resource registry

## 1. Architecture and ID scheme

```text
Master curriculum (authority)
  → Phases            P01 … P46
  → Components        P13.2, P10.1d …
  → Concepts          P13.2#4 …
  → Competencies      G0, C1 … C7   (+ stage gates SG2 … SG7)
  → Dependencies      phase + component edges
  → Weekly execution  CW001 …  (curriculum weeks, undated)
  → Daily execution   generated from the week slice + master daily work unit
```

| ID form | Meaning | Rule |
|---|---|---|
| `P13` | Phase 13 | Primary curriculum identifier. Master **section** numbers are never used as IDs (Section N = Phase N−5). |
| `P13.2` | Component 2 of Phase 13 | Numbered master subsections keep their number; unnumbered ones are numbered in document order; `.0` = text before the first subsection. |
| `P10.1d` | Sub-component of P10.1 | Unnumbered subsection nested under a numbered component. |
| `P13.2#4` | Concept 4 of P13.2 | Every list line in the master phase text gets a stable concept ID. |
| `G0`, `C1`–`C7` | Checkpoints | G0 = initial Python gate (decision 6). C1–C7 = master competency checkpoints. |
| `SG2`… | Stage gates | Phase-gating rule applied at a stage boundary where the master defines no checkpoint. |
| `PR01`–`PR11` | Canonical projects | Master project ladder. No other projects are canonical. |
| `T01`–`T11` | Continuous tracks | Master continuous tracks and career-strategy sections. |
| `RES-…`, `TOOL-…` | Resources | One registry; weeks reference IDs, never raw URLs. |

## 2. Stages

Stages are the master's stage-based timeline. They are **not** calendar years (decision 8).

| Stage | Name | Master basis | Entry | Exit gate | Curriculum weeks |
|---|---|---|---|---|---|
| S0 | Programming reset | Master timeline 2026-2027, Stage 0; Mode A | Day 1. | G0 initial Python gate (master 14-day plan) | CW001–CW002 |
| S1 | Tooling and programming fluency | Master timeline 2026-2027, Stage 1 | G0 passed. | C1 Programmer | CW003–CW014 |
| S2 | First CS/data foundations | Master timeline 2026-2027, Stage 2 ('only after Stage 1 is reliable') | C1 passed. | SG2 stage gate: DSA-fundamentals and SQL phase gates | CW015–CW021 |
| S3 | Mathematical/data foundations | Master timeline 2026-2027, Stage 3 | SG2 passed. | SG3 stage gate: data gate + statistics gate (master precondition for classical ML) | CW022–CW033 |
| S4 | Engineering foundation | Master timeline 2026-2027, Stage 4 | SG3 passed. | SG4 Foundation Reset exit | CW034–CW046 |
| S5 | Engineering + classical ML | Master timeline 2027-2028 emphasis | SG4 passed. | SG5 stage exit (C2, C4, C3 all passed) | CW047–CW101 |
| S6 | Deep learning + ML engineering | Master timeline 2028-2029 emphasis, minus attention/Transformers (moved to S7 by decision 5) | SG5 passed (Docker/CI/CD/Cloud gates inside S5C are the D5 precondition). | C5 ML engineer | CW102–CW138 |
| S7 | Transformers/LLMs + AI engineering + ML systems | Master timeline 2029-2030 emphasis, plus attention/Transformers | C5 passed (decision 5). | C6 AI engineer, then SG7 systems exit | CW139–CW177 |
| S8 | Research + specialisation | Master timeline 2030+; Phase 40 gate | C5 passed, ideally C6 (Phase 40 GATE). | Open-ended; C7 windows are calendar-driven | CW178–CW206 (first pass; open-ended) |

| Sub-stage | Name | Exit | Curriculum weeks |
|---|---|---|---|
| S5A | CS and backend depth | C2 CS foundation | CW047–CW066 |
| S5B | Data and classical ML | C4 Data scientist | CW067–CW087 |
| S5C | Production engineering | C3 Backend engineer | CW088–CW101 |
| S6A | Deep learning | SG6A deep-learning phase gates | CW102–CW112 |
| S6B | ML engineering and MLOps | C5 ML engineer | CW113–CW138 |
| S7A | Transformers, LLMs, AI engineering | C6 AI engineer | CW139–CW161 |
| S7B | Systems depth | SG7 systems exit | CW162–CW177 |

## 3. Dependency model

### 3.1 Enforced chain (decision 5)

```text
Classical ML (P13–P16)
  → Docker / CI/CD / Cloud (P31, P32)
  → Deep Learning (P19–P21)
  → ML Engineering / MLOps (P28–P30)
  → Transformers / LLMs (P22–P27)
```

Later technologies may appear as **optional exposure** (reading only, never a gate) before their dependencies. The master's own dependency spine (master section 'Immediate foundational block') is the full backbone:

```text
Python → Git + Linux/CLI → DSA + SQL → Statistics/Probability + Linear Algebra → NumPy/Pandas + EDA
→ Software Engineering + Backend → Classical ML → Docker/CI/CD/Cloud → Deep Learning
→ ML Engineering/MLOps → Transformers/LLMs/AI Engineering
```

### 3.2 Phase prerequisites

Source tags: `S79` master timeline · `S101` master learning sequence · `S103` dependency spine · `GATE` phase GATE line · `TEXT` phase/project text · `D5` decision 5.

| Phase | Title | Priority | Target | Hard prerequisites | Placement |
|---|---|---|---|---|---|
| P01 | Programming Foundations | 🔴 Critical | Python: 🔴 long-term D4 / Entry target: D2; Java: 🟠 D2; JavaScript / TypeScript: 🟡 D2 | — | S0, S1, S3, S4, S5A, S5B, S7A |
| P02 | Git, GitHub, Development Environment | 🔴 Critical | Git: 🔴 D3; GitHub: 🔴 D3 | P01 `S103` | S1 |
| P03 | Linux / CLI | 🔴 Critical | Linux: 🔴 D3 | P01 `S103` | S1 |
| P04 | Data Structures & Algorithms | 🔴 Critical | D4 | P01 `S103`, P02 `S103`, P03 `S103` | S2, DSA lane |
| P05 | Core Computer Science | 🔴 Critical | Operating Systems: 🔴 D3; Networking: 🔴 D3; Computer Architecture: 🟠 D2–D3; Compilers and runtimes: 🟡 D2 | P03 `S79`, P04 `S79`, P08 `S101` | S5A, S6A |
| P06 | Databases | 🔴 Critical | Relational fundamentals: 🔴 D4; PostgreSQL: 🔴 D4; Redis: 🟠 D2–D3; NoSQL: 🟡 D1–D2 | P01 `S103`, P02 `S103`, P03 `S103` | S2, S5A |
| P07 | Software Engineering | 🔴 Critical | 🔴 D4 | P01 `S101` | S1, S4 |
| P08 | Backend Engineering | 🔴 Critical | 🔴 D3–D4 | P07 `S103`, P06 `S103`, P11 `S103` | S4, S5A |
| P09 | Software Architecture | 🟠 High | 🟠 D3 | P07 `S101`, P08 `S101`, P31 `S101` | S5C |
| P10 | Mathematics | 🔴 Critical | Linear Algebra: 🔴 D4; Calculus: 🔴 D3–D4; Probability: 🔴 D3–D4; Statistics: 🔴 D4; Optimisation: 🟠 D3–D4 | P01 `S103`, P04 `S103`, P06 `S103` | S3, S5B |
| P11 | Data Science | 🔴 Critical | 🔴 D3–D4 | P10 `S103`, P06 `S101` | S3, S5B |
| P12 | Data Engineering Foundation | 🟡🟠 Useful–High | 🟡–🟠 D2–D3 | P11 `TEXT`, P06 `TEXT` | S5B |
| P13 | Classical Machine Learning | 🔴 Critical | 🔴 D4 | P10 `S79`, P11 `S79`, P07 `S103`, P08 `S103` | S5B |
| P14 | Machine Learning Theory | 🔴 Critical | 🔴 D4 | P13 `S101` | S5B |
| P15 | Model Evaluation | 🔴 Critical | 🔴 D4 | P13 `S101` | S5B |
| P16 | From-Scratch ML Implementation | not stated in master | not stated in master | P13 `S101`, P10 `S101` | S5B, S6A |
| P17 | Time Series | 🟠 High | 🟠 D2–D3 | P13 `TEXT`, P15 `TEXT` | S5B, S6A |
| P18 | Recommender Systems | 🟠 High | 🟠 D3 | P13 `TEXT`, P15 `TEXT`, P19 `TEXT`, P28 `TEXT` | S6B |
| P19 | Deep Learning | 🔴 Critical | 🔴 D4 | P13 `S103`, P14 `S103`, P15 `S103`, P16 `S101`, P31 `D5`, P32 `D5` | S6A |
| P20 | Computer Vision | 🟡🟠 Useful–High | 🟡–🟠 D2–D3 | P19 `S101` | S6A |
| P21 | Sequence Models and NLP | 🟠 High | 🟠 D3 | P19 `S101` | S6A |
| P22 | Attention and Transformers | 🔴 Critical | 🔴 D4 | P19 `S101`, P21 `S101`, P28 `D5`, P30 `D5` | S7A |
| P23 | Modern LLM Engineering | 🔴 Critical | 🔴 D3–D4 | P22 `S103` | S7A |
| P24 | Retrieval-Augmented Generation | 🔴 Critical | 🔴 D3 | P23 `S101`, P08 `TEXT`, P06 `TEXT` | S7A |
| P25 | AI Agents | 🟠 High | 🟠 D2–D3 | P23 `S101` | S7A |
| P26 | Multimodal AI | 🟡🟠 Useful–High | 🟡–🟠 D2–D3 | P20 `TEXT`, P21 `TEXT`, P22 `TEXT` | S7B |
| P27 | AI Evaluation | 🔴 Critical | 🔴 D3 | P23 `S101`, P24 `S101`, P15 `TEXT` | S7A |
| P28 | ML Engineering | 🔴 Critical | 🔴 D4 | P19 `D5`, P31 `S103`, P32 `S103`, P12 `TEXT` | S6B |
| P29 | Model Serving | 🔴 Critical | 🔴 D3 | P13 `S101`, P31 `S101`, P32 `S101` | S5C, S6B |
| P30 | MLOps | 🔴 Critical | 🔴 D3–D4 | P28 `S101`, P29 `S101`, P31 `TEXT` | S6B |
| P31 | DevOps | 🟠 High | 🟠 D3 | P13 `D5`, P14 `D5`, P15 `D5`, P03 `TEXT`, P08 `TEXT` | S5C |
| P32 | Cloud | 🟠 High | 🟠 D2–D3 | P31 `S101` | S5C |
| P33 | Terraform / Infrastructure as Code | 🟡🟠 Useful–High | 🟡–🟠 D2–D3 | P32 `TEXT` | S6B |
| P34 | Kubernetes | 🟡 Useful | 🟡 D2 initially, D3 later | P03 `TEXT`, P05 `TEXT`, P31 `TEXT`, P32 `TEXT` | S6B |
| P35 | System Design | 🔴 Critical | 🔴 D3–D4 | P05 `S101`, P06 `TEXT`, P08 `TEXT` | S5A, S7B |
| P36 | Distributed Systems | 🟠 High | 🟠 D3 | P35 `S101`, P05 `TEXT` | S7B |
| P37 | ML System Design | 🔴 Critical | 🔴 D3–D4 | P35 `S101`, P28 `S101`, P29 `S101`, P30 `S101`, P18 `TEXT`, P24 `TEXT` | S7B |
| P38 | Observability | 🟠 High | 🟠 D3 | P31 `TEXT`, P29 `TEXT` | S6B |
| P39 | Security | 🔴 Critical | 🔴 D3 | P08 `TEXT` | S5A, S7A |
| P40 | Research Skills | 🟠 High | 🟠 D3 → D5 if specialization demands it | C5 `GATE` | S8 |
| P41 | Reinforcement Learning | 🟢 Optional | 🟢 D2 initially | C5 `GATE` | optional branch (after C5) |
| P42 | Advanced ML System Topics | 🟠🔴 High–Critical | 🟠–🔴 D3–D4 | C5 `GATE`, P29 `GATE` | S7B |
| P43 | Data / ML Infrastructure | 🟡🟠 Useful–High | 🟡–🟠 D2–D3 | P12 `GATE`, P08 `GATE`, P31 `GATE`, P28 `GATE` | on demand |
| P44 | AI Engineering as a Systems Discipline | 🔴 Critical | 🔴 D3–D4 | P07 `GATE`, P08 `GATE`, P27 `GATE`, P29 `GATE` | S7A |
| P45 | Cost Engineering | 🟡🟠 Useful–High | 🟡–🟠 D2–D3 | P32 `GATE`, P29 `GATE` | S6B |
| P46 | Product Thinking for Engineers | 🟡 Useful | 🟡 D2–D3 | — | continuous (awareness from S4; detailed in PR07, PR11) |

### 3.3 Component-level edges

| Before | After | Reason |
|---|---|---|
| P10.1d | P13.5 | PCA in unsupervised learning needs eigen/SVD |
| P10.2 | P16.0 | gradient descent (P16 item 2) needs calculus |
| P10.5 | P16.0 | from-scratch optimisation needs optimisation basics |
| P19.1 | P16.0#7 | simple neural network and backprop items belong with deep learning |
| P05.2 | PR05 | WebSockets and networking before the chat backend |
| P05.1 | PR05 | concurrency reasoning before the chat backend |
| P06.3 | PR04 | Redis caching and rate limiting before the URL shortener |
| P08.4 | C3 | authenticated API required by C3 |
| P31.1 | P29.1 | containerisation before the early serving segment |
| P32.0 | P29.1 | cloud basics before the early serving segment |
| P28.0 | P22.0 | decision 5: ML engineering before Transformers |
| P30.4 | P22.0 | decision 5: MLOps before Transformers |
| P32.1 | P19.0 | decision 5: Docker/CI/CD/Cloud before deep learning |

### 3.4 Unlock rules

- **P02** — Supporting setup allowed from Day 1 only if trivial (master Day One section); formal study after G0.
- **P04** — DSA becomes a maintenance track only after the programming foundation is dependable (master Section 0).
- **P05** — OS, networking and database concepts are required by C2.
- **P13** — Classical ML may begin only when the programming, data, and statistics gates are genuinely passing (master timeline).
- **P19** — Decision 5: only after Classical ML and Docker/CI/CD/Cloud gates.
- **P22** — Decision 5: formal study only after ML Engineering/MLOps (C5). Optional reading exposure allowed earlier; never a gate.
- **P29** — Early segment (D1-D2, classical model) after Docker/Cloud per master sequence item 24; formal D3 after ML engineering.
- **P34** — Master rule: Kubernetes stays deferred until Linux, networking, containers, deployment, and debugging are comfortable.
- **P40** — Master GATE: light paper reading may happen earlier, but the full research phase is unlocked after Checkpoint 5 and ideally Checkpoint 6. It must not compete with the foundational sequence.
- **P41** — Master GATE: optional branch. Do not enter before strong foundations and Checkpoint 5 unless a specific project or research direction requires it.
- **P42** — Master GATE: unlocked after Checkpoint 5 and meaningful model-serving experience.
- **P43** — Master GATE: learn on demand after the underlying data, backend, deployment, and ML lifecycle concepts are working.
- **P44** — Master GATE: unlocked after core software engineering, backend, model, evaluation, and deployment competencies are established.
- **P45** — Master GATE: learn through real deployed systems rather than as an early standalone subject.
- **P46** — Master GATE: awareness can begin early; detailed product engineering belongs alongside real projects and internships.

## 4. Competency checkpoints

### G0 — Initial Python gate

- **Source:** Master Section 0 'Start here' 14-day plan and 'The first gate'
- **Gate week:** CW002
- **Must precede the gate:** P01.1a
- **Note:** Decision 6: the master's 14-day plan is the formal initial Python gate. Python fluency work continues afterwards; G0 does not certify proficiency.

**First 14 days**

```text
Days 1-3   Functions, variables, expressions, input/output
Days 4-6   Conditionals and boolean reasoning
Days 7-9   Loops and iteration
Days 10-11 Strings and collections
Days 12-13 Functions, decomposition, small programs
Day 14     Exceptions, files, review, unseen test
```

This is not a promise that the foundation will be complete in 14 days. It is the **first review horizon**. Spend longer when the skill is not real yet.

**The first gate**

You leave the beginner runway only when you can independently write and explain the core Python capabilities listed in Phase 1, complete small unseen tasks, and debug ordinary mistakes.

**The rest of this document is the map. Your active path should contain only a small slice of it.**

### C1 — Programmer

- **Source:** Master Competency Checkpoint 1
- **Gate week:** CW014
- **Must precede the gate:** P01.1a, P01.1b, P02.1, P07.4, PR01

Pass when you can:

- write small Python programs without tutorials
- use `for` and `while` loops correctly
- write and call functions
- use lists and dictionaries naturally
- read/write simple files
- handle common exceptions
- debug a small program
- make meaningful Git commits

**Practical gate**

Complete 3 unseen beginner programming tasks in separate sessions with at most normal documentation lookup, and build one small CLI program without following a walkthrough. Do the unseen tasks with AI assistance off (Assess mode).

### C2 — CS foundation

- **Source:** Master Competency Checkpoint 2
- **Gate week:** CW066
- **Must precede the gate:** P04.1, P04.2, P04.3, P04.4, P04.5, P04.6, P05.1, P05.2, P06.1, P06.1c, P06.1d

Pass when you can:

- implement common data structures
- analyse basic time/space complexity
- solve standard beginner/intermediate DSA problems
- explain core OS, networking, and database concepts

**Practical gate**

Complete a mixed set of unseen DSA problems with at least 80% correctness over repeated attempts, explain the complexity of each solution, and implement the core structures yourself. AI assistance stays off for these problems (Assess mode).

### C3 — Backend engineer

- **Source:** Master Competency Checkpoint 3
- **Gate week:** CW095
- **Must precede the gate:** P08.1, P08.2, P08.3, P08.4, P06.2, P07.3, P39.2, P31.1, P31.2, P32.1, PR03, PR04

Pass when you can:

- build an authenticated API
- use PostgreSQL
- validate input
- write tests
- handle errors
- document an API
- deploy an application
- work in an unfamiliar codebase with an AI assistant: fix a bug and add a small feature, explain every accepted change, and name at least one AI mistake you caught
- run a coding agent on your own service with least privilege (a branch, no production credentials, reviewed commands) and describe exactly what it could access

**Practical gate**

Ship one small service with authentication, persistence, tests, API documentation, and a real deployment.

### C4 — Data scientist

- **Source:** Master Competency Checkpoint 4
- **Gate week:** CW087
- **Must precede the gate:** P06.1a, P10.3, P10.4, P11.3, P11.5, P13.3, P14.3, P15.3, PR06

Pass when you can:

- clean messy data
- perform EDA
- write SQL
- formulate statistical questions
- use uncertainty correctly
- build appropriate baselines/models
- evaluate them correctly
- communicate findings

**Practical gate**

Take an unfamiliar dataset, produce a reproducible analysis, answer at least five defensible questions, and explain the limitations of the conclusions.

### C5 — ML engineer

- **Source:** Master Competency Checkpoint 5
- **Gate week:** CW137
- **Must precede the gate:** P28.0, P29.3, P30.2, P30.4, P38.1, PR09

Pass when you can:

- build an ML training pipeline
- version data/model/code sensibly
- package a model
- serve it
- test it
- monitor key signals
- diagnose a failure

**Practical gate**

Ship one end-to-end ML service from data ingestion through inference and monitoring.

### C6 — AI engineer

- **Source:** Master Competency Checkpoint 6
- **Gate week:** CW161
- **Must precede the gate:** P23.5, P24.0, P25.0, P27.2, P39.3, PR10

Pass when you can:

- build LLM applications
- implement RAG
- use tools safely
- evaluate retrieval and generation
- handle failures and cost constraints
- include indirect prompt-injection cases (instructions hidden in retrieved content or tool output) in the evaluation set

**Practical gate**

Build an evaluated AI system with a documented evaluation set, retrieval or tool-use tests, failure analysis, and basic observability.

### C7 — Top-tier candidate

- **Source:** Master Competency Checkpoint 7
- **Gate week:** calendar-driven (see note)
- **Must precede the gate:** P04.6, P05.1, P05.2, P35.2
- **Note:** Interview readiness is trained near recruiting periods (master). C7 prep windows are placed by the calendar layer against real recruiting dates, using whatever checkpoints are passed by then. Technical floor: C2 + C3 + system-design fundamentals.

Pass when you can:

- solve DSA problems under time pressure
- explain CS fundamentals clearly
- design systems
- explain serious projects deeply
- communicate trade-offs
- provide genuine behavioural evidence
- complete a timed AI-assisted code-comprehension session on an unfamiliar multi-file repository, and a timed AI-free DSA session, in the same week

Interview readiness is a separate performance skill and must be trained deliberately near recruiting periods.

### Stage gates

Where the master defines no checkpoint, a stage gate applies the master phase-gating rule (5–10 must-know capabilities, one artifact, a practical mastery check, later re-test) to the stage's components.

- **SG2** (CW021): DSA fundamentals (P04.1, P04.2, P04.5#1–7) and SQL/PostgreSQL basics (P06.1, P06.1a, P06.2).
- **SG3** (CW033): Data gate (P11.1–P11.3) + statistics gate (P10.3#1–16, P10.4#1–11). Master: classical ML may begin only when the programming, data, and statistics gates are genuinely passing.
- **SG4** (CW046): Foundation Reset exit: all S0–S4 components re-tested; PR01–PR03 complete.
- **SG5** (CW101): C2, C4 and C3 passed; PR04–PR07 complete.
- **SG6A** (CW112): Deep-learning phase gates (P19–P21).
- **SG7** (CW177): Systems depth phase gates (P35–P37, P42, P26).

## 5. Canonical projects

The master project ladder is the only canonical project list (decision 7). The old execution roadmap's 'Deep-learning project' is **not** canonical; deep-learning evidence comes from P19.5 required builds and P20.0 projects.

### PR01 — CLI Tool

- **Requires first:** G0, P02.1, P07.3
- **Evidence for:** C1
- **Build weeks:** CW013–CW014

Examples:

- expense tracker
- task manager
- file organiser
- log processor

Must demonstrate:

- Python
- functions
- data structures
- error handling
- Git
- testing

### PR02 — API Client / Automation Tool

- **Requires first:** P08.1, P01.1d
- **Evidence for:** Portfolio Stage A
- **Build weeks:** CW039–CW040

Build a CLI application consuming a public API.

Learn:

- HTTP
- JSON
- authentication basics
- retries
- errors
- rate limits
- logging

### PR03 — Database-Backed API

- **Requires first:** P06.2, P08.3, P07.3
- **Evidence for:** C3 (with auth added in S5A)
- **Build weeks:** CW042–CW057

Build a CRUD backend.

Required:

- PostgreSQL
- API
- validation
- migrations
- tests
- README

### PR04 — URL Shortener

- **Requires first:** P06.3, P06.1d, P35.1
- **Evidence for:** C3
- **Build weeks:** CW060–CW062

Requirements:

- short IDs
- redirect logic
- persistent storage
- unique constraints
- analytics
- rate limiting
- cache

Then analyse:

- expected traffic
- bottlenecks
- failure modes
- scaling path

### PR05 — Real-Time Chat Backend

- **Requires first:** P05.1, P05.2, P08.4
- **Evidence for:** C2/C3 depth
- **Build weeks:** CW063–CW065

Requirements:

- authentication
- WebSockets
- message persistence
- online/offline handling
- retries
- concurrency reasoning

Stretch:

- presence
- delivery status
- message pagination

### PR06 — Analytics Platform

- **Requires first:** P11.3, P12.0, P06.2
- **Evidence for:** C4
- **Build weeks:** CW069–CW071

Pipeline:

```text
Raw data
→ cleaning
→ validation
→ PostgreSQL
→ SQL analysis
→ Python analysis
→ visualisation
→ report
```

Required:

- reproducibility
- clear assumptions
- data dictionary
- findings
- limitations

### PR07 — Fraud Detection Platform

- **Requires first:** P15.3, P14.2, P31.2, P32.1, P29.2
- **Evidence for:** C4/C5 bridge; fintech flagship
- **Build weeks:** CW097–CW100

If you already have a fraud-detection project, do not automatically rebuild a near-duplicate. Treat the existing work as the starting artifact and upgrade it until it satisfies this project's engineering, evaluation, deployment, and monitoring requirements.

Pipeline:

```text
Data
→ validation
→ feature engineering
→ train/validation/test
→ baseline
→ model comparison
→ evaluation
→ API
→ deployment
→ monitoring
```

Required questions:

- How severe are false positives?
- What is the class imbalance?
- Is there temporal leakage?
- How does drift appear?
- How do you choose the threshold?

### PR08 — Recommendation System

- **Requires first:** P18.0, P29.3
- **Evidence for:** C5 depth
- **Build weeks:** CW129–CW132

Build:

- event ingestion
- user/item representations
- candidate retrieval
- ranking
- evaluation
- serving API

Then design the production version.

### PR09 — ML Serving Platform

- **Requires first:** P28.0, P29.3, P30.4, P38.1
- **Evidence for:** C5
- **Build weeks:** CW133–CW136

Goal: turn multiple models into a consistent serving system.

Learn:

- model registry
- model selection
- versioning
- inference API
- latency
- batching
- health checks
- monitoring

### PR10 — RAG Research Platform

- **Requires first:** P24.1, P27.2, P39.3, P08.4
- **Evidence for:** C6
- **Build weeks:** CW156–CW160

Build a system that accepts a body of documents and supports grounded research.

Required:

- ingestion
- parsing
- chunking
- embeddings
- retrieval
- reranking
- generation
- citations
- evaluation
- auth
- logging
- security

### PR11 — Intelligent Financial Research Platform

- **Requires first:** C6, P01.3, P38.3, P45.0
- **Evidence for:** Capstone; C7 deep dives
- **Build weeks:** CW195–CW206

A large end-to-end capstone combining:

- frontend
- backend
- authentication
- PostgreSQL
- analytics
- ML
- RAG
- evaluation
- Docker
- CI/CD
- cloud
- observability

Potential architecture:

```text
User
↓
API Gateway
├── User Service
├── Data Service
├── Analytics Service
└── AI Service
        ├── Retrieval
        ├── Model
        └── Evaluation

Data Service
→ ingestion
→ transformation
→ PostgreSQL / analytical storage
→ features

ML layer
→ training
→ evaluation
→ registry
→ serving

Observability
→ logs
→ metrics
→ traces
```

Required documentation:

- architecture diagram
- requirements
- API documentation
- data model
- model card
- evaluation report
- threat model
- performance report
- cost analysis
- deployment guide

### Project quality standard (master text)

For every serious project, produce:

1. Problem statement
2. Requirements
3. Architecture
4. Technology justification
5. Data model
6. Implementation
7. Tests
8. Error-handling strategy
9. Security considerations
10. Deployment
11. Monitoring
12. Performance analysis
13. Limitations
14. Future improvements
15. README

For ML projects additionally:

- dataset description
- target definition
- baseline
- split strategy
- metrics
- feature pipeline
- model comparison
- error analysis
- reproducibility information

For AI projects additionally:

- evaluation dataset
- retrieval evaluation
- hallucination/failure analysis
- prompt/tool security
- cost considerations

## 6. Continuous tracks

### T01 — DSA / Interview preparation

- **Activation:** Primary block CW15-17, lane from CW18 (see DSA lane).

Do not postpone DSA until job applications.

Keep it alive for years.

Early phase:

- 2–3 focused sessions per week

Intermediate phase:

- 3–5 sessions per week during interview preparation

Final recruiting phase:

- timed practice
- mocks
- review of weak patterns

Maintain a mistake log:

- what I missed
- why I missed it
- pattern involved
- better approach
- recurrence of mistake

### T02 — FAANG / Top-tier tech

- **Activation:** Coding/CS parts ride the DSA lane; system design from S5A; ML system design from S7B; behavioural stories from first internship evidence.

The dream requires preparation beyond merely knowing the stack.

**66.1 Coding interviews**

Required:

- DSA
- complexity
- communication
- clean implementation
- edge cases

**66.2 CS interviews**

Be prepared to discuss:

- OS
- networking
- databases
- concurrency
- memory
- systems

**66.3 System design**

Progress:

```text
single-service design
→ common distributed components
→ scaling
→ distributed systems
→ large-scale system design
→ ML system design
```

**66.4 ML system design**

Practice:

- recommendation
- search/ranking
- fraud
- ad prediction awareness
- real-time inference
- model-serving systems
- RAG
- LLM applications

**66.5 Behavioural**

Develop real stories around:

- ownership
- failure
- ambiguity
- conflict
- leadership
- teamwork
- difficult debugging
- impact
- technical trade-offs

Do not fabricate stories.

**66.6 Project deep dives**

For every serious project be able to answer:

- Why this problem?
- What were the constraints?
- Why this architecture?
- What alternatives did you reject?
- What broke?
- How did you debug it?
- What would you change at 10× scale?
- What metrics mattered?
- What did you personally implement?

### T03 — Resume

- **Activation:** Update at every stage exit gate.

Your resume should eventually demonstrate:

- technical depth
- measurable outcomes where genuine
- internships
- projects
- research/open-source evidence
- leadership where real

Avoid keyword stuffing.

A bullet should ideally communicate:

**action + technical method + outcome**

Do not claim scale, performance, or impact that was not actually achieved.

### T04 — GitHub

- **Activation:** From S1 (every build in Git).

Target qualities:

- readable code
- good README
- tests
- meaningful history
- issue tracking
- architecture notes
- project demos
- reproducibility

Better:

**five excellent repositories**

than:

**fifty tutorial clones.**

### T05 — Open source

- **Activation:** Reading codebases from S5; contributions from S7.

Progression:

```text
Read codebase
→ documentation improvement
→ small bug fix
→ feature
→ larger contribution
→ sustained contribution
```

Look for ecosystems adjacent to your actual roadmap.

Potential areas:

- Python
- PyTorch
- Hugging Face
- scikit-learn
- FastAPI
- data tooling

Quality matters more than contribution count.

### T06 — Technical writing

- **Activation:** READMEs from PR01; writeups at every project and checkpoint.

Write:

- project READMEs
- architecture notes
- experiment reports
- debugging writeups
- concept explanations
- research summaries

Recommended structure:

```text
Problem
→ context
→ approach
→ alternatives
→ implementation
→ result
→ failure
→ lesson
→ next step
```

Writing also forces precise thinking.

### T07 — Research

- **Activation:** Light paper reading allowed earlier; full phase after C5 (Phase 40 gate).

Progression:

```text
Paper
→ notes
→ implementation
→ reproduction
→ variation
→ experiment
```

Do not rush into “original research” before you can reproduce existing work.

### T08 — Internship strategy

- **Activation:** Calendar-driven; placements map into the curriculum (Mode E).

Internships are not merely CV decorations.

They should progressively increase exposure to:

- real codebases
- real users
- real constraints
- real teams
- production systems

Possible trajectory:

```text
University projects
→ first technical experience
→ stronger internship
→ SWE/ML experience
→ top-tier internship
→ new-grad opportunities
```

This is a strategy, not a guaranteed sequence.

**Internship evidence to seek**

- meaningful code contributions
- production exposure
- measurable improvements where genuine
- technical ownership
- debugging
- collaboration
- architecture exposure

**International / cross-border career reality**

For international students and candidates targeting opportunities outside their home country, technical strength is necessary but not always sufficient. Recruiting can also depend on:

- work authorization
- visa sponsorship
- employer location constraints
- relocation requirements
- internship eligibility
- remote-work eligibility
- timing and application windows

Do not let this become an early source of anxiety or a reason to stop building. Revisit it when targeting specific companies, countries, internships, postgraduate programmes, or work arrangements.

The roadmap should optimise first for transferable technical capability and evidence. Career logistics should then be checked against the actual opportunity.

### T09 — Portfolio strategy by stage

- **Activation:** Portfolio Stage A after S4, B after S5, C after S6, D in S8.

**Stage A - Beginner**

Show:

- clean code
- simple applications
- basic data work

**Stage B - Intermediate**

Show:

- backend
- databases
- testing
- deployment
- classical ML

**Stage C - Advanced**

Show:

- ML engineering
- systems
- deep learning
- MLOps
- serious projects

**Stage D - Elite-track candidate**

Show a coherent body of:

- strong projects
- internships
- research/open-source evidence
- DSA readiness
- system-design readiness
- communication

### T10 — Certification strategy

- **Activation:** Only with a concrete reason (master).

Certification hierarchy for this career:

**Highest practical evidence**

- strong internship
- production experience
- excellent project
- meaningful open source
- research output

**Useful selectively**

- cloud certification
- role-specific certification where a target employer values it

**Usually low priority**

- accumulating certificates without corresponding projects

Ask:

> What capability does this certificate prove?

If the answer is unclear, it is probably not a core priority.

### T11 — What not to get distracted by

- **Activation:** Standing rule.

**Framework collecting**

Do not become an encyclopaedia of frameworks.

**Premature microservices**

Learn good single-service design first.

**Premature Kubernetes**

Learn Linux, Docker, networking, and cloud first.

**Excessive frontend**

Build enough UI to make products usable.

**Prompt-only AI**

Prompting is a tool, not an engineering foundation.

**Technology hype**

Ask whether a new technology solves a problem you actually have.

**Tutorial addiction**

Courses are inputs. Projects and problem-solving are outputs.

**Over-mathematical rabbit holes**

Learn the mathematics that improves your understanding. Specialise deeper when your work requires it.

**Premature optimisation**

Measure first.

**Productivity-system obsession**

Planning is valuable. Excessive planning can become avoidance.

## 7. Operating rules (master text)

Verbatim from master Section 0 (subsections 0.2–0.11) and the weekly/daily/monthly execution model. The execution layer and the app's rule engine must implement these.

**0.2 THE CARDINAL RULE**

Do not try to learn the whole roadmap simultaneously.

At any given time, the execution layer should contain:

- **ONE primary learning block**
- **At most ONE supporting block** when capacity allows
- **A small maintenance track** only after the relevant foundation exists
- **ONE active project** only when academic load permits

During the true beginner reset, there may be **only one real learning block: programming**.

Everything else is reference material until the current gate is passed.

**0.3 ACTIVE-PATH MODES**

**Mode A - Foundation Reset**

Primary: programming fundamentals.

Supporting: environment setup and Git only as needed to support programming.

Not active: ML, deep learning, cloud, Kubernetes, advanced DSA, LLM engineering.

**Mode B - Normal Semester**

Primary: university obligations plus one roadmap module.

Supporting: one small secondary block if there is real capacity.

Maintenance: DSA after the programming gate.

Project: one active project milestone.

**Mode C - Heavy Semester**

Use this mode for roughly 10 or more substantial courses, multiple high-workload quantitative/programming courses, a major internship/SIWES workload, or repeated weeks where university work consumes most available study time.

Then use university as the priority. Keep only maintenance work outside school. The roadmap can pause.

A roadmap pause is **not failure**. It is correct scheduling.

**Mode D - Examination Period**

University preparation is primary. Pause new roadmap modules. DSA may be an optional 15-30 minute maintenance session only if it helps rather than distracts.

**Mode E - Internship / SIWES**

Treat genuine overlapping work as applied learning. Do not attempt to run the entire independent curriculum alongside a demanding placement.

**Mode F - Long Break / Low Academic Load**

Use extra capacity for deeper study, projects, DSA, deployment practice, and research reproduction while keeping the active path narrow.

**0.4 EXECUTION STATES**

Use:

- **NOW** - current focus
- **NEXT** - next dependency-respecting block
- **LATER** - important, but prerequisites are not ready
- **OPTIONAL** - valuable for a specialization, but not universally necessary
- **DEFER** - deliberately postponed to protect the core
- **MAINTENANCE** - previously learned material being retained

**0.5 EVIDENCE OF LEARNING**

A topic is not complete because you watched a video.

Default loop:

1. Learn.
2. Explain without notes.
3. Reason through the mechanism where appropriate.
4. Implement a small version where educationally useful.
5. Solve targeted exercises/problems.
6. Use the mature library or real tool.
7. Build something with it.
8. Break or debug something involving it.
9. Document what you learned.
10. Re-test it later.

**0.6 THE ANTI-TUTORIAL-HELL RULE**

Prefer:

**learn -> attempt -> get stuck -> consult -> fix -> explain**

over:

**watch -> watch -> watch -> watch -> maybe code later.**

**0.7 RESOURCE PROGRESSION RULE**

Resources are deliberately staged. The objective is not to use the most advanced resource as early as possible. The objective is to move from **guided learning to independent technical work**.

**Resource levels**

- **R0 - Orientation:** roadmap pages, overviews, terminology maps.
- **R1 - Beginner primary:** a structured course, textbook, or guided curriculum that teaches the subject in sequence.
- **R2 - Practice:** exercises, problem sets, coding challenges, labs, or notebooks.
- **R3 - Official reference:** language, framework, library, protocol, or platform documentation.
- **R4 - Deep reference:** university notes, advanced textbooks, architecture material, source-oriented explanations.
- **R5 - Primary sources:** specifications, standards, research papers, source code, benchmarks, design documents.
- **R6 - Real system:** production projects, incident reports, performance investigations, open-source contributions, and original experiments.

**Default progression**

```text
R0 orientation
     ↓
R1 structured learning
     ↓
R2 deliberate practice
     ↓
R3 official documentation becomes normal
     ↓
R4 deep technical references
     ↓
R5 specifications / source / papers
     ↓
R6 real systems and original work
```

At beginner level, a good course can save enormous time and prevent false confidence. Do not avoid excellent beginner material merely because it is beginner material. Later, as your competence increases, **documentation should gradually become the default place you learn exact behavior**.

**The resource stack for a major subject**

Use one active stack:

1. **Primary:** the resource you actually follow.
2. **Practice:** where you prove the concept.
3. **Official reference:** the authoritative place you check exact behavior.
4. **Deepening:** one serious source for deeper understanding.
5. **Implementation:** a concrete artifact that forces integration.

Do not create a primary-resource pile.

**What “best resource” means here**

There is no timeless universal best resource on the internet. A resource is selected because it is a strong fit for **your current level, desired depth, subject stability, learning objective, practice needs, and eventual engineering use**. When a subject is broad, multiple complementary resources are intentional rather than redundant.

**0.8 THE ANTI-FRAMEWORK-HOPPING RULE**

A new framework is not automatically a new learning priority. Learn concepts deeply, then learn frameworks as implementations of those concepts.

**0.9 PHASE-GATING RULE**

A later phase is unlocked by **capability evidence**, not calendar time.

For each phase:

- identify 5-10 must-know capabilities
- practise them without constant tutorial dependence
- produce at least one artifact
- pass a practical mastery check
- re-test later

Optional topics never block a core phase unless they become relevant to the chosen specialization.

**0.10 SPACED-RETEST RULE**

For major foundational capabilities, use this default review rhythm:

```text
Initial mastery
    ↓
1-3 days
    ↓
7 days
    ↓
30 days
    ↓
90 days
    ↓
6 months
```

The re-test should be active recall or a small unseen problem, not rereading notes. If a foundational skill repeatedly fails re-testing, temporarily bring it back into NOW.

**0.11 TIME-CAPACITY RULE**

Do not invent a workload your semester cannot support. Rough external-roadmap ceilings after university obligations:

- **0-5 hours/week:** one primary block only
- **5-10 hours/week:** one primary block + DSA maintenance after the programming gate
- **10-15 hours/week:** primary + DSA + one modest project milestone
- **15+ hours/week:** mainly for long breaks or unusually light periods

These are planning ranges, not quotas.

### Weekly execution model

A realistic baseline is more useful than an heroic schedule.

**Beginner reset**

Most external study time should go into the primary programming block. Do not force DSA, ML, mathematics, projects, and cloud into the same week.

**After the programming gate**

A typical allocation can become:

- **40-50%** primary subject
- **20-25%** DSA
- **15-20%** project/engineering
- **10-15%** mathematics, statistics, or review

These percentages only apply when capacity exists. University and internship obligations override them.

### Daily work unit

For a beginner, a useful session is:

```text
10 min - recall
30-45 min - learn one small concept
30-45 min - write code yourself
10-15 min - debug / test
5-10 min - explain from memory
5 min - record the next step
```

The exact duration can shrink on busy days. The important property is that **active coding happens during the session**.

### Monthly review

At the end of each month answer:

**Knowledge**

- What can I explain now that I could not explain before?

**Implementation**

- What can I build now?

**Problem solving**

- Which DSA patterns improved?

**Projects**

- What did I ship?

**Weaknesses**

- Where did I get stuck repeatedly?

**Roadmap**

- Is the sequence still sensible?

**Career**

- Did I create evidence of capability?

Do not restart the roadmap every month.

Adjust the active path, not the entire architecture.

### Foundation failure recovery

When a re-test shows a foundational gap, do not restart the entire roadmap.

Use this recovery loop:

```text
Identify exact broken capability
        ↓
Return to the smallest prerequisite
        ↓
Do 3-5 targeted exercises
        ↓
Build one tiny artifact
        ↓
Re-test from memory
        ↓
Return to the active phase
```

The objective is targeted repair, not repeated full-course resets.

## 8. Phase catalogue (P01–P46)

Each phase: metadata, master gate text, components with concept IDs, resources by registry ID, and where it is scheduled.

### P01 — Programming Foundations

- **Priority:** 🔴 Critical · **Target:** Python: 🔴 long-term D4 | Entry target: D2; Java: 🟠 D2; JavaScript / TypeScript: 🟡 D2
- **Prerequisites:** none
- **Scheduled in:** S0, S1, S3, S4, S5A, S5B, S7A

#### P01.1 Python — 🔴 long-term D4 | Entry target: D2 *(parent)*

**Role:** primary language for data, ML, AI, scripting, automation, research, and potentially backend work.

#### P01.1a Python › Zero-level runway — do not skip

*Scheduled:* CW001, CW002

Start here if loops, conditions, functions, and basic collections are not reliable from memory.

**Module A - First contact**

- `P01.1a#1` `print()`
- `P01.1a#2` variables and assignment
- `P01.1a#3` strings, integers, floats, booleans
- `P01.1a#4` arithmetic and comparisons
- `P01.1a#5` expressions and operator precedence

**Module B - Control flow**

Write small programs from memory using:

- `P01.1a#6` `if`
- `P01.1a#7` `elif`
- `P01.1a#8` `else`
- `P01.1a#9` `for`
- `P01.1a#10` `while`
- `P01.1a#11` `range()`
- `P01.1a#12` `break`
- `P01.1a#13` `continue`

**Module C - Functions**

- `P01.1a#14` defining functions
- `P01.1a#15` parameters and arguments
- `P01.1a#16` return values
- `P01.1a#17` local vs global scope
- `P01.1a#18` small helper functions

**Module D - Core data structures**

- `P01.1a#19` lists
- `P01.1a#20` tuples
- `P01.1a#21` dictionaries
- `P01.1a#22` sets
- `P01.1a#23` strings
- `P01.1a#24` indexing and slicing
- `P01.1a#25` mutation vs reassignment
- `P01.1a#26` nested structures

**Module E - Files, errors, and small programs**

- `P01.1a#27` input/output
- `P01.1a#28` text files
- `P01.1a#29` JSON/CSV at a basic level
- `P01.1a#30` exceptions
- `P01.1a#31` simple command-line programs

**Programming foundation gate**

Before moving into DSA-heavy work, you should be able to complete these without a tutorial:

1. `P01.1a#32` Write a `for` loop over a list and transform its values.
2. `P01.1a#33` Write a `while` loop with a clear termination condition.
3. `P01.1a#34` Write a function that validates input.
4. `P01.1a#35` Count frequencies with a dictionary.
5. `P01.1a#36` Filter data with a loop and a condition.
6. `P01.1a#37` Read a text file and summarise its contents.
7. `P01.1a#38` Handle an expected exception cleanly.
8. `P01.1a#39` Build a small program of roughly 100-200 lines without copying a walkthrough.

The requirement is independent execution, not speed.

#### P01.1b Python › Core language

*Scheduled:* CW003, CW004

Learn thoroughly:

- `P01.1b#1` literals
- `P01.1b#2` variables
- `P01.1b#3` expressions
- `P01.1b#4` operators
- `P01.1b#5` control flow
- `P01.1b#6` conditional statements
- `P01.1b#7` loops
- `P01.1b#8` pattern matching where relevant
- `P01.1b#9` functions
- `P01.1b#10` return values
- `P01.1b#11` arguments
- `P01.1b#12` positional and keyword arguments
- `P01.1b#13` default arguments
- `P01.1b#14` scopes
- `P01.1b#15` namespaces
- `P01.1b#16` imports
- `P01.1b#17` modules
- `P01.1b#18` packages
- `P01.1b#19` exceptions
- `P01.1b#20` file I/O
- `P01.1b#21` strings
- `P01.1b#22` bytes
- `P01.1b#23` lists
- `P01.1b#24` tuples
- `P01.1b#25` sets
- `P01.1b#26` dictionaries
- `P01.1b#27` comprehensions

#### P01.1c Python › Intermediate Python

*Scheduled:* CW009, CW010

- `P01.1c#1` iterators
- `P01.1c#2` generators
- `P01.1c#3` generator expressions
- `P01.1c#4` decorators
- `P01.1c#5` closures
- `P01.1c#6` higher-order functions
- `P01.1c#7` context managers
- `P01.1c#8` `with`
- `P01.1c#9` dataclasses
- `P01.1c#10` enums
- `P01.1c#11` properties
- `P01.1c#12` descriptors at awareness level
- `P01.1c#13` protocols
- `P01.1c#14` abstract base classes
- `P01.1c#15` type annotations
- `P01.1c#16` `typing`
- `P01.1c#17` generics
- `P01.1c#18` structural typing concepts

#### P01.1d Python › Professional Python

*Scheduled:* CW012, CW035

- `P01.1d#1` virtual environments
- `P01.1d#2` dependency management
- `P01.1d#3` package installation
- `P01.1d#4` packaging
- `P01.1d#5` `pyproject.toml`
- `P01.1d#6` test discovery
- `P01.1d#7` logging
- `P01.1d#8` configuration management
- `P01.1d#9` CLI design
- `P01.1d#10` environment variables
- `P01.1d#11` secrets handling
- `P01.1d#12` linting
- `P01.1d#13` formatting
- `P01.1d#14` static type checking
- `P01.1d#15` profiling
- `P01.1d#16` debugging

#### P01.1e Python › Deeper internals

*Scheduled:* CW053, CW054

Learn conceptually:

- `P01.1e#1` object model
- `P01.1e#2` references
- `P01.1e#3` identity vs equality
- `P01.1e#4` mutability
- `P01.1e#5` memory allocation concepts
- `P01.1e#6` reference counting
- `P01.1e#7` garbage collection
- `P01.1e#8` import machinery
- `P01.1e#9` bytecode/interpreter concepts
- `P01.1e#10` C extensions awareness
- `P01.1e#11` concurrency models
- `P01.1e#12` threads
- `P01.1e#13` processes
- `P01.1e#14` async event loops
- `P01.1e#15` current Python concurrency evolution

#### P01.1f Python › Required implementations

*Scheduled:* CW003, CW004, CW009, CW010, CW012, CW030, CW036, CW039, CW044, CW085

Build progressively:

1. `P01.1f#1` CLI calculator
2. `P01.1f#2` File organiser
3. `P01.1f#3` Expense tracker
4. `P01.1f#4` Log analyser
5. `P01.1f#5` CSV/JSON processor
6. `P01.1f#6` API client
7. `P01.1f#7` CLI data-analysis tool
8. `P01.1f#8` reusable Python package
9. `P01.1f#9` tested backend service
10. `P01.1f#10` small ML package

#### P01.1g Python › Mastery *(mastery statement)*

You should be able to start a medium-sized Python project without a tutorial, organise it sensibly, test it, debug it, document it, package it, and explain your design choices.

#### P01.2 Java — 🟠 D2

*Scheduled:* CW047, CW048, CW049, CW050, CW051, CW052

Java is a supporting language here. It reinforces object-oriented design and a second strongly typed ecosystem, but Python remains the primary language for the main trajectory.

Learn:

- `P01.2#1` syntax
- `P01.2#2` primitives/reference types
- `P01.2#3` classes
- `P01.2#4` objects
- `P01.2#5` constructors
- `P01.2#6` inheritance
- `P01.2#7` interfaces
- `P01.2#8` abstraction
- `P01.2#9` polymorphism
- `P01.2#10` composition
- `P01.2#11` packages
- `P01.2#12` exceptions
- `P01.2#13` collections
- `P01.2#14` generics
- `P01.2#15` streams
- `P01.2#16` lambdas
- `P01.2#17` functional interfaces
- `P01.2#18` records
- `P01.2#19` concurrency basics
- `P01.2#20` threads
- `P01.2#21` executors
- `P01.2#22` synchronization concepts
- `P01.2#23` JVM basics
- `P01.2#24` memory model awareness
- `P01.2#25` Maven/Gradle
- `P01.2#26` JUnit

Use Java for:

- `P01.2#27` OOP mastery
- `P01.2#28` DSA implementations
- `P01.2#29` selected backend work
- `P01.2#30` understanding enterprise systems

Do not build a second enormous career roadmap around Java unless your opportunities demand it.

#### P01.3 JavaScript / TypeScript — 🟡 D2

*Scheduled:* CW143, CW144, CW145, CW146

Purpose: understand the modern web well enough to build products and collaborate with frontend engineers.

Learn:

- `P01.3#1` variables
- `P01.3#2` functions
- `P01.3#3` objects
- `P01.3#4` arrays
- `P01.3#5` modules
- `P01.3#6` scope
- `P01.3#7` closures
- `P01.3#8` promises
- `P01.3#9` async/await
- `P01.3#10` event loop concepts
- `P01.3#11` HTTP requests
- `P01.3#12` JSON
- `P01.3#13` browser basics
- `P01.3#14` DOM awareness
- `P01.3#15` TypeScript types
- `P01.3#16` interfaces
- `P01.3#17` generics at basic level
- `P01.3#18` API consumption
- `P01.3#19` basic React

Do not turn frontend into the centre of the roadmap.

#### P01 resources

- *Concept coverage:* Python syntax, variables, expressions, conditionals, loops, functions, collections, strings, files, exceptions, modules, OOP introduction, testing introduction, typing introduction.
- *Resource progression:* do not replace CS50P with documentation on Day 1. Use the docs first for lookup, then increasingly for learning as fluency grows.
- `RES-P01-01` **CORE:** Harvard CS50P — https://cs50.harvard.edu/python/
- `RES-P01-02` **PRACTICE:** Exercism Python — https://exercism.org/tracks/python
- `RES-P01-03` **REFERENCE:** Python documentation — https://docs.python.org/3/
- `RES-P01-04` **DEEP:** Python language reference and later CPython implementation reading — https://docs.python.org/3/reference/
- `RES-P01-05` **IMPLEMENT:** command-line utilities, text/file processors, small automation scripts.
- `RES-P01-X1` **PHASE-TEXT:** CS50x - Introduction to Computer Science — https://cs50.harvard.edu/x/

*Master phase-text resource notes (P01.1h):*

**Primary - true beginner path**

**CS50's Introduction to Programming with Python (CS50P)**
https://cs50.harvard.edu/python/

Use this as the main guided course for the initial reset.

**Secondary - broader CS context**

**CS50x - Introduction to Computer Science**
https://cs50.harvard.edu/x/

Use later, not concurrently as a second full-time course, to deepen C, memory, algorithms, abstraction, and general CS.

**Official reference**

**Python documentation**
https://docs.python.org/3/

Use the official docs as the reference source rather than the first teaching resource for an absolute beginner.

**Later reference**

*Fluent Python* once basic fluency is established.

### P02 — Git, GitHub, Development Environment

- **Priority:** 🔴 Critical · **Target:** Git: 🔴 D3; GitHub: 🔴 D3
- **Prerequisites:** P01 (S103)
- **Unlock note:** Supporting setup allowed from Day 1 only if trivial (master Day One section); formal study after G0.
- **Scheduled in:** S1

#### P02.1 Git — 🔴 D3

*Scheduled:* CW005

Learn:

- `P02.1#1` repository structure
- `P02.1#2` working tree
- `P02.1#3` staging
- `P02.1#4` commits
- `P02.1#5` branches
- `P02.1#6` merge
- `P02.1#7` rebase
- `P02.1#8` remote repositories
- `P02.1#9` fetch
- `P02.1#10` pull
- `P02.1#11` push
- `P02.1#12` tags
- `P02.1#13` release points
- `P02.1#14` history inspection
- `P02.1#15` reverting
- `P02.1#16` resetting
- `P02.1#17` conflict resolution
- `P02.1#18` cherry-picking awareness
- `P02.1#19` stash
- `P02.1#20` bisect awareness

Practice recovery:

- `P02.1#21` accidentally delete a file
- `P02.1#22` create a bad commit
- `P02.1#23` make a merge conflict
- `P02.1#24` recover an earlier version

You should not fear Git internals.

#### P02.2 GitHub — 🔴 D3

*Scheduled:* CW006

Learn:

- `P02.2#1` repositories
- `P02.2#2` issues
- `P02.2#3` pull requests
- `P02.2#4` reviews
- `P02.2#5` project boards
- `P02.2#6` branch protection concepts
- `P02.2#7` Actions basics
- `P02.2#8` releases
- `P02.2#9` README writing
- `P02.2#10` repository organisation
- `P02.2#11` `.gitignore`
- `P02.2#12` secrets
- `P02.2#13` contribution workflows

#### P02.2a GitHub › Mastery *(mastery statement)*

You can collaborate in a real repository without treating Git as a mysterious sequence of incantations.

#### P02 resources

- *Concept coverage:* repositories, commits, branches, remotes, merge/rebase, conflicts, tags, pull requests, code review, GitHub workflows, SSH keys, editor/terminal workflow.
- `RES-P02-01` **CORE:** Pro Git — https://git-scm.com/book/en/v2
- `RES-P02-02` **PRACTICE:** GitHub Skills — https://skills.github.com/
- `RES-P02-03` **REFERENCE:** Git documentation — https://git-scm.com/docs
- `RES-P02-04` **DEEP:** Git internals/reference — https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain
- `RES-P02-05` **IMPLEMENT:** use Git on every roadmap project; recover from a deliberately created merge conflict.

### P03 — Linux / CLI

- **Priority:** 🔴 Critical · **Target:** Linux: 🔴 D3
- **Prerequisites:** P01 (S103)
- **Scheduled in:** S1

#### P03.1 Linux — 🔴 D3

*Scheduled:* CW007, CW008

Learn:

- `P03.1#1` filesystem hierarchy
- `P03.1#2` paths
- `P03.1#3` absolute vs relative paths
- `P03.1#4` permissions
- `P03.1#5` users
- `P03.1#6` groups
- `P03.1#7` processes
- `P03.1#8` environment variables
- `P03.1#9` standard input/output/error
- `P03.1#10` pipes
- `P03.1#11` redirection
- `P03.1#12` shell expansion
- `P03.1#13` shell scripts
- `P03.1#14` package managers
- `P03.1#15` process inspection
- `P03.1#16` logs
- `P03.1#17` system resource inspection
- `P03.1#18` networking commands
- `P03.1#19` SSH
- `P03.1#20` file transfer
- `P03.1#21` cron awareness

Core tools to become comfortable with:

- `P03.1#22` `pwd`
- `P03.1#23` `ls`
- `P03.1#24` `cd`
- `P03.1#25` `cp`
- `P03.1#26` `mv`
- `P03.1#27` `rm`
- `P03.1#28` `mkdir`
- `P03.1#29` `cat`
- `P03.1#30` `less`
- `P03.1#31` `head`
- `P03.1#32` `tail`
- `P03.1#33` `grep`
- `P03.1#34` `find`
- `P03.1#35` `sed`
- `P03.1#36` `awk`
- `P03.1#37` `sort`
- `P03.1#38` `uniq`
- `P03.1#39` `wc`
- `P03.1#40` `xargs`
- `P03.1#41` `curl`
- `P03.1#42` `wget`
- `P03.1#43` `ssh`
- `P03.1#44` `ps`
- `P03.1#45` `top`/`htop`
- `P03.1#46` `kill`
- `P03.1#47` `chmod`
- `P03.1#48` `chown`

#### P03.1a Linux › Projects

*Scheduled:* CW008

- `P03.1a#1` shell backup script
- `P03.1a#2` log-processing script
- `P03.1a#3` local monitoring script
- `P03.1a#4` deployment script
- `P03.1a#5` automated data-ingestion script

#### P03 resources

- *Concept coverage:* shell, files, permissions, processes, pipes, redirection, environment variables, SSH, text tools, package managers, process inspection, basic networking commands.
- `RES-P03-01` **CORE:** MIT Missing Semester — https://missing.csail.mit.edu/
- `RES-P03-02` **PRACTICE:** shell tasks in your own projects and Linux command exercises.
- `RES-P03-03` **REFERENCE:** `man` pages and GNU/Linux documentation.
- `RES-P03-04` **DEEP:** The Linux Programming Interface, then kernel documentation when needed.
- `RES-P03-05` **IMPLEMENT:** shell automation, log filtering, process inspection, SSH into a remote host.

### P04 — Data Structures & Algorithms

- **Priority:** 🔴 Critical · **Target:** D4
- **Prerequisites:** P01 (S103), P02 (S103), P03 (S103)
- **Unlock note:** DSA becomes a maintenance track only after the programming foundation is dependable (master Section 0).
- **Scheduled in:** S2, DSA lane

#### P04.0 Data Structures & Algorithms (core scope)

*Scheduled:* CW015

**Entry condition:** pass the programming foundation gate. DSA is not the first topic in this zero-reset plan.

This serves two purposes:

1. `P04.0#1` genuine computational thinking
2. `P04.0#2` demanding technical interviews

#### P04.1 Complexity

*Scheduled:* CW015

Master:

- `P04.1#1` Big O
- `P04.1#2` Big Theta
- `P04.1#3` Big Omega
- `P04.1#4` worst-case analysis
- `P04.1#5` average-case reasoning
- `P04.1#6` amortised analysis
- `P04.1#7` time complexity
- `P04.1#8` space complexity
- `P04.1#9` trade-offs

Do not only memorise complexity tables. Derive them from loops and operations.

#### P04.2 Linear structures

*Scheduled:* CW015, CW016, CW017; DSA lane CW018–CW021

Learn and implement:

- `P04.2#1` arrays
- `P04.2#2` dynamic arrays
- `P04.2#3` strings
- `P04.2#4` linked lists
- `P04.2#5` singly linked lists
- `P04.2#6` doubly linked lists
- `P04.2#7` stacks
- `P04.2#8` queues
- `P04.2#9` deques
- `P04.2#10` hash tables
- `P04.2#11` sets

Understand:

- `P04.2#12` memory trade-offs
- `P04.2#13` access cost
- `P04.2#14` insertion/deletion cost
- `P04.2#15` locality
- `P04.2#16` collision handling

#### P04.3 Trees

*Scheduled:* DSA lane CW022–CW033

- `P04.3#1` binary trees
- `P04.3#2` BSTs
- `P04.3#3` traversal
- `P04.3#4` inorder
- `P04.3#5` preorder
- `P04.3#6` postorder
- `P04.3#7` level-order
- `P04.3#8` recursion
- `P04.3#9` balanced-tree concepts
- `P04.3#10` heaps
- `P04.3#11` priority queues
- `P04.3#12` tries

#### P04.4 Graphs

*Scheduled:* DSA lane CW034–CW046

- `P04.4#1` directed graphs
- `P04.4#2` undirected graphs
- `P04.4#3` weighted graphs
- `P04.4#4` adjacency lists
- `P04.4#5` adjacency matrices
- `P04.4#6` BFS
- `P04.4#7` DFS
- `P04.4#8` connected components
- `P04.4#9` cycle detection
- `P04.4#10` topological sorting
- `P04.4#11` shortest path
- `P04.4#12` Dijkstra
- `P04.4#13` Bellman-Ford awareness
- `P04.4#14` union-find
- `P04.4#15` minimum spanning tree awareness

#### P04.5 Algorithm families

*Scheduled:* CW017; DSA lane CW018–CW021; DSA lane CW047–CW066

- `P04.5#1` linear search
- `P04.5#2` binary search
- `P04.5#3` sorting
- `P04.5#4` merge sort
- `P04.5#5` quicksort
- `P04.5#6` heap sort awareness
- `P04.5#7` recursion
- `P04.5#8` divide and conquer
- `P04.5#9` backtracking
- `P04.5#10` greedy algorithms
- `P04.5#11` dynamic programming
- `P04.5#12` graph algorithms
- `P04.5#13` bit manipulation

#### P04.6 Problem-solving patterns

*Scheduled:* DSA lane CW047–CW066

Become comfortable recognising:

- `P04.6#1` two pointers
- `P04.6#2` sliding window
- `P04.6#3` prefix sums
- `P04.6#4` hashing
- `P04.6#5` monotonic stack
- `P04.6#6` binary search on answer
- `P04.6#7` intervals
- `P04.6#8` fast/slow pointers
- `P04.6#9` tree DFS/BFS
- `P04.6#10` graph traversal
- `P04.6#11` topological ordering
- `P04.6#12` heap-based selection
- `P04.6#13` backtracking
- `P04.6#14` memoisation
- `P04.6#15` tabulation
- `P04.6#16` state compression awareness

#### P04.7 Interview progression

*Scheduled:* DSA lane CW067–CW101

```text
Learn pattern
↓
Implement pattern
↓
Easy problems
↓
Medium problems
↓
Selected hard problems
↓
Explain alternative solutions
↓
Timed solution
↓
Mock interview
```

The goal is pattern mastery, correctness, complexity reasoning, and communication rather than arbitrary problem counts.

**Planning benchmark**

A long-term range of roughly 200–300 carefully understood problems can be useful as a planning guide, but it is not a qualification threshold.

#### P04 resources

- *Concept coverage:* complexity, arrays, linked lists, stacks, queues, hashing, trees, heaps, tries, graphs, recursion, searching, sorting, greedy, backtracking, dynamic programming, graph algorithms, interview patterns.
- `RES-P04-01` **CORE:** MIT 6.006 Introduction to Algorithms — https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/
- `RES-P04-02` **PRACTICE:** NeetCode — https://neetcode.io/
- `RES-P04-03` **INTERVIEW:** LeetCode — https://leetcode.com/
- `RES-P04-04` **DEEP:** Introduction to Algorithms, Cormen et al.; MIT 6.006 notes/problem sets remain the working spine.
- `RES-P04-05` **IMPLEMENT:** implement core structures and selected algorithms yourself before using standard-library versions.

*Master phase-text resource notes (P04.7a):*

**Primary curriculum**

**MIT 6.006 - Introduction to Algorithms**
https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/

Use the lectures, notes, problem sets, and solutions as the conceptual spine.

**Practice companion**

**NeetCode**
https://neetcode.io/

Use for pattern-based and interview-oriented practice after learning the underlying concepts.

**Interview practice**

**LeetCode**
https://leetcode.com/

Use selectively for timed and interview-style practice. Do not optimise for raw problem count.

**Local reinforcement**

- university problem sets
- handwritten derivations
- your own implementations

### P05 — Core Computer Science

- **Priority:** 🔴 Critical · **Target:** Operating Systems: 🔴 D3; Networking: 🔴 D3; Computer Architecture: 🟠 D2–D3; Compilers and runtimes: 🟡 D2
- **Prerequisites:** P03 (S79), P04 (S79), P08 (S101)
- **Unlock note:** OS, networking and database concepts are required by C2.
- **Scheduled in:** S5A, S6A

#### P05.1 Operating Systems — 🔴 D3

*Scheduled:* CW050, CW051, CW052

Learn:

- `P05.1#1` kernel vs user space
- `P05.1#2` processes
- `P05.1#3` threads
- `P05.1#4` context switching
- `P05.1#5` scheduling
- `P05.1#6` system calls
- `P05.1#7` virtual memory
- `P05.1#8` paging
- `P05.1#9` page faults
- `P05.1#10` filesystems
- `P05.1#11` file descriptors
- `P05.1#12` IPC
- `P05.1#13` pipes
- `P05.1#14` sockets awareness
- `P05.1#15` synchronization
- `P05.1#16` mutexes
- `P05.1#17` semaphores
- `P05.1#18` race conditions
- `P05.1#19` deadlocks
- `P05.1#20` memory allocation concepts
- `P05.1#21` caching
- `P05.1#22` CPU scheduling concepts

Key question:

> What actually happens between the moment I run a program and the moment it produces output?

Project ideas:

- `P05.1#23` process monitor
- `P05.1#24` shell
- `P05.1#25` simple scheduler simulation
- `P05.1#26` file-system exploration tool

#### P05.2 Networking — 🔴 D3

*Scheduled:* CW047, CW048, CW049

Learn:

- `P05.2#1` packets
- `P05.2#2` frames awareness
- `P05.2#3` addressing
- `P05.2#4` IP
- `P05.2#5` routing concepts
- `P05.2#6` TCP
- `P05.2#7` UDP
- `P05.2#8` ports
- `P05.2#9` sockets
- `P05.2#10` DNS
- `P05.2#11` HTTP
- `P05.2#12` HTTPS
- `P05.2#13` TLS
- `P05.2#14` certificates awareness
- `P05.2#15` cookies
- `P05.2#16` sessions
- `P05.2#17` proxies
- `P05.2#18` reverse proxies
- `P05.2#19` load balancing
- `P05.2#20` WebSockets

Be able to explain:

```text
Browser
→ DNS
→ TCP
→ TLS
→ HTTP
→ reverse proxy
→ application
→ database
```

Practice with:

- `P05.2#21` `curl`
- `P05.2#22` browser devtools
- `P05.2#23` simple socket programs
- `P05.2#24` local HTTP servers

#### P05.3 Computer Architecture — 🟠 D2–D3

*Scheduled:* CW102, CW103, CW104

Learn:

- `P05.3#1` CPU
- `P05.3#2` registers
- `P05.3#3` instructions
- `P05.3#4` ALU
- `P05.3#5` control flow
- `P05.3#6` cache
- `P05.3#7` RAM
- `P05.3#8` storage
- `P05.3#9` memory hierarchy
- `P05.3#10` binary
- `P05.3#11` hexadecimal
- `P05.3#12` integer representation
- `P05.3#13` floating-point awareness
- `P05.3#14` hardware threads
- `P05.3#15` compilation vs interpretation

Understand why:

- `P05.3#16` caches exist
- `P05.3#17` memory access costs differ
- `P05.3#18` data structures affect locality
- `P05.3#19` compiled code can outperform interpreted code in appropriate workloads

#### P05.4 Compilers and runtimes — 🟡 D2

*Scheduled:* on demand

Learn conceptually:

- `P05.4#1` lexing
- `P05.4#2` parsing
- `P05.4#3` ASTs
- `P05.4#4` semantic analysis
- `P05.4#5` bytecode
- `P05.4#6` virtual machines
- `P05.4#7` interpreters
- `P05.4#8` compilers
- `P05.4#9` optimisation awareness
- `P05.4#10` runtime systems

Build a tiny interpreter eventually if the subject interests you or if you want deeper CS foundations.

#### P05 resources

- `RES-P05-01` Operating Systems · **CORE:** MIT 6.1810 Operating System Engineering — https://pdos.csail.mit.edu/6.S081/2026/
- `RES-P05-02` Operating Systems · **PRACTICE:** xv6 labs/homework.
- `RES-P05-03` Operating Systems · **REFERENCE:** xv6 book and course notes.
- `RES-P05-04` Operating Systems · **DEEP:** Operating Systems: Three Easy Pieces — https://pages.cs.wisc.edu/~remzi/OSTEP/
- `RES-P05-05` Networking · **CORE:** Stanford CS144 Computer Networking — https://cs144.github.io/
- `RES-P05-06` Networking · **PRACTICE:** networking labs, packet inspection, sockets.
- `RES-P05-07` Networking · **REFERENCE:** MDN HTTP documentation — https://developer.mozilla.org/en-US/docs/Web/HTTP
- `RES-P05-08` Networking · **DEEP:** Computer Networking: A Top-Down Approach; RFCs for exact protocol behavior.
- `RES-P05-09` Computer Architecture · **CORE:** UC Berkeley CS61C — https://cs61c.org/
- `RES-P05-10` Computer Architecture · **PRACTICE:** architecture exercises and low-level programming.
- `RES-P05-11` Computer Architecture · **REFERENCE:** course notes — https://notes.cs61c.org/
- `RES-P05-12` Computer Architecture · **DEEP:** Computer Organization and Design / Computer Architecture: A Quantitative Approach.
- `RES-P05-13` Compilers · **CORE:** Crafting Interpreters — https://craftinginterpreters.com/
- `RES-P05-14` Compilers · **PRACTICE:** build a small interpreter.
- `RES-P05-15` Compilers · **REFERENCE:** language specifications and runtime docs once relevant.
- `RES-P05-16` Compilers · **DEEP:** Engineering a Compiler; LLVM documentation.

### P06 — Databases

- **Priority:** 🔴 Critical · **Target:** Relational fundamentals: 🔴 D4; PostgreSQL: 🔴 D4; Redis: 🟠 D2–D3; NoSQL: 🟡 D1–D2
- **Prerequisites:** P01 (S103), P02 (S103), P03 (S103)
- **Scheduled in:** S2, S5A

#### P06.1 Relational fundamentals — 🔴 D4

*Scheduled:* CW018

Learn:

- `P06.1#1` relational model
- `P06.1#2` tables
- `P06.1#3` rows
- `P06.1#4` columns
- `P06.1#5` schemas
- `P06.1#6` primary keys
- `P06.1#7` foreign keys
- `P06.1#8` constraints
- `P06.1#9` relationships
- `P06.1#10` one-to-one
- `P06.1#11` one-to-many
- `P06.1#12` many-to-many

#### P06.1a Relational fundamentals › SQL mastery

*Scheduled:* CW018, CW019, CW020

- `P06.1a#1` SELECT
- `P06.1a#2` WHERE
- `P06.1a#3` ORDER BY
- `P06.1a#4` GROUP BY
- `P06.1a#5` HAVING
- `P06.1a#6` aggregate functions
- `P06.1a#7` joins
- `P06.1a#8` subqueries
- `P06.1a#9` CTEs
- `P06.1a#10` recursive CTE awareness
- `P06.1a#11` window functions
- `P06.1a#12` CASE
- `P06.1a#13` string functions
- `P06.1a#14` date/time handling
- `P06.1a#15` NULL semantics
- `P06.1a#16` views
- `P06.1a#17` materialised-view awareness

#### P06.1b Relational fundamentals › Database design

*Scheduled:* CW053

- `P06.1b#1` normalisation
- `P06.1b#2` functional dependencies
- `P06.1b#3` normal forms
- `P06.1b#4` denormalisation
- `P06.1b#5` schema evolution
- `P06.1b#6` migration strategy

#### P06.1c Relational fundamentals › Transactions

*Scheduled:* CW054

- `P06.1c#1` ACID
- `P06.1c#2` atomicity
- `P06.1c#3` consistency
- `P06.1c#4` isolation
- `P06.1c#5` durability
- `P06.1c#6` transaction boundaries
- `P06.1c#7` isolation levels
- `P06.1c#8` locks
- `P06.1c#9` deadlocks
- `P06.1c#10` race conditions

#### P06.1d Relational fundamentals › Performance

*Scheduled:* CW055

- `P06.1d#1` indexes
- `P06.1d#2` composite indexes
- `P06.1d#3` covering indexes
- `P06.1d#4` query planning
- `P06.1d#5` EXPLAIN
- `P06.1d#6` execution plans
- `P06.1d#7` sequential scans
- `P06.1d#8` index scans
- `P06.1d#9` cardinality
- `P06.1d#10` statistics
- `P06.1d#11` query optimisation

#### P06.1e Relational fundamentals › Distributed concepts

*Scheduled:* CW056

- `P06.1e#1` replication
- `P06.1e#2` read replicas
- `P06.1e#3` partitioning
- `P06.1e#4` sharding
- `P06.1e#5` consistency
- `P06.1e#6` availability
- `P06.1e#7` CAP reasoning
- `P06.1e#8` eventual consistency

#### P06.2 PostgreSQL — 🔴 D4

*Scheduled:* CW020, CW055

Use PostgreSQL as the primary relational database for practical work.

Projects:

1. `P06.2#1` SQL analytics exercises.
2. `P06.2#2` Schema design for an application.
3. `P06.2#3` Transaction-heavy application.
4. `P06.2#4` Query optimisation exercise.
5. `P06.2#5` PostgreSQL-backed API.

#### P06.3 Redis — 🟠 D2–D3

*Scheduled:* CW056

Learn:

- `P06.3#1` key-value model
- `P06.3#2` TTL
- `P06.3#3` caching
- `P06.3#4` session storage
- `P06.3#5` rate limiting
- `P06.3#6` simple queues
- `P06.3#7` pub/sub awareness

Do not use Redis merely because a project looks more sophisticated with Redis.

Know why the cache exists.

#### P06.4 NoSQL — 🟡 D1–D2

*Scheduled:* CW056

Understand categories:

- `P06.4#1` document stores
- `P06.4#2` key-value stores
- `P06.4#3` wide-column databases
- `P06.4#4` graph databases

Study specific products only when the project or job requires them.

#### P06 resources

- *Concept coverage:* relational model, SQL, schema design, normalisation, indexes, transactions, isolation, query planning, storage, replication, partitioning, NoSQL awareness, caching.
- `RES-P06-01` **CORE:** CMU 15-445/645 Intro to Database Systems — https://15445.courses.cs.cmu.edu/fall2026/
- `RES-P06-02` **BEGINNER PRACTICE:** SQLBolt — https://sqlbolt.com/
- `RES-P06-03` **REFERENCE:** PostgreSQL docs — https://www.postgresql.org/docs/current/
- `RES-P06-04` **DEEP:** Database Internals; CMU lecture material and labs.
- `RES-P06-05` **IMPLEMENT:** build a database-backed application; inspect `EXPLAIN`; benchmark an index/no-index query.
- `RES-P06-06` Redis · **REFERENCE:** Redis docs — https://redis.io/docs/latest/
- `RES-P06-07` Redis · **IMPLEMENT:** caching, rate limiting, session data, queues where justified.
- `RES-P06-08` NoSQL · **REFERENCE:** MongoDB docs for document databases — https://www.mongodb.com/docs/
- `RES-P06-09` NoSQL · **DEEP:** Database Internals and distributed database literature.
- `RES-P06-10` NoSQL · **RULE:** learn data-model tradeoffs before collecting databases by name.
- `RES-P06-X1` **PHASE-TEXT:** Referenced in P06.2a Resources — https://www.postgresql.org/docs/current/tutorial.html

*Master phase-text resource notes (P06.2a):*

PostgreSQL official documentation and tutorial:
https://www.postgresql.org/docs/current/tutorial.html

### P07 — Software Engineering

- **Priority:** 🔴 Critical · **Target:** 🔴 D4
- **Prerequisites:** P01 (S101)
- **Scheduled in:** S1, S4

#### P07.1 Code quality

*Scheduled:* CW034

Learn:

- `P07.1#1` readability
- `P07.1#2` naming
- `P07.1#3` cohesion
- `P07.1#4` coupling
- `P07.1#5` modularity
- `P07.1#6` abstraction
- `P07.1#7` interfaces
- `P07.1#8` composition
- `P07.1#9` refactoring
- `P07.1#10` error handling
- `P07.1#11` defensive programming where appropriate

#### P07.2 Principles

*Scheduled:* CW034

Learn:

- `P07.2#1` SOLID
- `P07.2#2` DRY
- `P07.2#3` KISS
- `P07.2#4` YAGNI

Do not turn principles into dogma.

Understand when an abstraction is useful and when it is overengineering.

#### P07.3 Testing

*Scheduled:* CW011, CW035

Learn:

- `P07.3#1` unit tests
- `P07.3#2` integration tests
- `P07.3#3` end-to-end tests
- `P07.3#4` test doubles
- `P07.3#5` mocks
- `P07.3#6` stubs
- `P07.3#7` fixtures
- `P07.3#8` contract testing
- `P07.3#9` property-based testing awareness
- `P07.3#10` regression tests
- `P07.3#11` test coverage interpretation

#### P07.4 Debugging

*Scheduled:* CW011, CW035

Become comfortable with:

- `P07.4#1` reproducing failures
- `P07.4#2` forming hypotheses
- `P07.4#3` isolating causes
- `P07.4#4` stack traces
- `P07.4#5` logs
- `P07.4#6` debuggers
- `P07.4#7` breakpoints
- `P07.4#8` assertions
- `P07.4#9` minimal reproduction cases
- `P07.4#10` regression testing

#### P07.5 Engineering workflow

*Scheduled:* CW036

- `P07.5#1` issues
- `P07.5#2` pull requests
- `P07.5#3` code review
- `P07.5#4` branch strategy
- `P07.5#5` release process
- `P07.5#6` changelogs
- `P07.5#7` semantic versioning
- `P07.5#8` documentation
- `P07.5#9` architecture decision records awareness

#### P07 resources

- *Concept coverage:* clean code, modularity, SOLID, cohesion/coupling, refactoring, testing, debugging, packaging, dependency management, versioning, code review, engineering workflow.
- `RES-P07-01` **CORE:** Google Engineering Practices — https://google.github.io/eng-practices/
- `RES-P07-02` **PRACTICE:** refactor your own projects; write tests before/after changes.
- `RES-P07-03` **REFERENCE:** language/tool documentation and Python Packaging User Guide — https://packaging.python.org/en/latest/
- `RES-P07-04` **TESTING REFERENCE:** pytest — https://docs.pytest.org/en/stable/
- `RES-P07-05` **DEEP:** Refactoring, Martin Fowler; Software Engineering at Google.
- `RES-P07-06` **IMPLEMENT:** every serious project gets tests, logging, documentation, dependency pinning, and a repeatable setup.
- `RES-P07-07` Java · **CORE/reference:** dev.java Learn Java — https://dev.java/learn/
- `RES-P07-08` Java · **PRACTICE:** university Java work and small independent Java programs.
- `RES-P07-09` Java · **TESTING:** JUnit 5 user guide — https://junit.org/junit5/docs/current/user-guide/
- `RES-P07-10` JavaScript · **CORE:** The Odin Project Full Stack JavaScript path — https://www.theodinproject.com/paths/2
- `RES-P07-11` JavaScript · **REFERENCE:** MDN JavaScript Guide — https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide
- `RES-P07-12` JavaScript · **TYPE SYSTEM:** TypeScript Handbook — https://www.typescriptlang.org/docs/handbook/
- `RES-P07-13` JavaScript · **IMPLEMENT:** browser application, then Node.js service where useful.

### P08 — Backend Engineering

- **Priority:** 🔴 Critical · **Target:** 🔴 D3–D4
- **Prerequisites:** P07 (S103), P06 (S103), P11 (S103)
- **Scheduled in:** S4, S5A

#### P08.0 Backend Engineering (core scope)

*Scheduled:* CW036

Primary practical direction:

**Python + FastAPI**

Secondary ecosystem:

**Java + Spring Boot**

#### P08.1 HTTP

*Scheduled:* CW037

Understand:

- `P08.1#1` request/response
- `P08.1#2` methods
- `P08.1#3` status codes
- `P08.1#4` headers
- `P08.1#5` content types
- `P08.1#6` cookies
- `P08.1#7` caching headers
- `P08.1#8` idempotency
- `P08.1#9` retries
- `P08.1#10` timeouts

#### P08.2 REST

*Scheduled:* CW038

Learn:

- `P08.2#1` resources
- `P08.2#2` resource naming
- `P08.2#3` verbs
- `P08.2#4` representation
- `P08.2#5` pagination
- `P08.2#6` filtering
- `P08.2#7` sorting
- `P08.2#8` versioning
- `P08.2#9` error conventions
- `P08.2#10` idempotency

#### P08.3 API design

*Scheduled:* CW041

- `P08.3#1` schema validation
- `P08.3#2` OpenAPI
- `P08.3#3` documentation
- `P08.3#4` consistent errors
- `P08.3#5` authentication
- `P08.3#6` authorisation
- `P08.3#7` rate limiting
- `P08.3#8` request size limits
- `P08.3#9` timeouts

#### P08.4 Identity

*Scheduled:* CW057

Learn concepts:

- `P08.4#1` password hashing
- `P08.4#2` sessions
- `P08.4#3` cookies
- `P08.4#4` JWT
- `P08.4#5` OAuth concepts
- `P08.4#6` RBAC
- `P08.4#7` least privilege

#### P08.5 Application infrastructure

*Scheduled:* CW058

- `P08.5#1` connection pooling
- `P08.5#2` background jobs
- `P08.5#3` queues
- `P08.5#4` caching
- `P08.5#5` asynchronous processing
- `P08.5#6` WebSockets
- `P08.5#7` scheduled jobs

#### P08.6 Backend projects

*Scheduled:* CW042, CW057, CW060, CW063

**Project A - CRUD API**

Demonstrate:

- `P08.6#1` routing
- `P08.6#2` validation
- `P08.6#3` database access
- `P08.6#4` testing

**Project B - Authenticated API**

Add:

- `P08.6#5` users
- `P08.6#6` password hashing
- `P08.6#7` sessions or token-based access
- `P08.6#8` roles

**Project C - URL shortener**

Add:

- `P08.6#9` unique IDs
- `P08.6#10` redirects
- `P08.6#11` database
- `P08.6#12` caching
- `P08.6#13` analytics

**Project D - Real-time chat backend**

Add:

- `P08.6#14` WebSockets
- `P08.6#15` authentication
- `P08.6#16` persistence
- `P08.6#17` concurrency reasoning

#### P08 resources

- *Concept coverage:* HTTP, REST, API design, validation, auth, sessions, JWT, OAuth/OIDC awareness, pagination, rate limits, error contracts, background jobs, queues, async work, WebSockets, caching, configuration, security.
- `RES-P08-01` **CORE:** FastAPI Tutorial — https://fastapi.tiangolo.com/tutorial/
- `RES-P08-02` **REFERENCE:** MDN HTTP — https://developer.mozilla.org/en-US/docs/Web/HTTP
- `RES-P08-03` **SECURITY:** OWASP Web Security Testing Guide / PortSwigger Academy — https://portswigger.net/web-security
- `RES-P08-04` **DEEP:** API Design Patterns; HTTP/RFC references.
- `RES-P08-05` **IMPLEMENT:** CRUD API → authenticated API → URL shortener → real-time backend.
- `RES-P08-06` Optional Java backend lane · **REFERENCE/IMPLEMENT:** Spring Boot — https://spring.io/projects/spring-boot

### P09 — Software Architecture

- **Priority:** 🟠 High · **Target:** 🟠 D3
- **Prerequisites:** P07 (S101), P08 (S101), P31 (S101)
- **Scheduled in:** S5C

#### P09.0 Software Architecture (core scope)

*Scheduled:* CW091, CW092

Progression:

```text
Script
→ structured program
→ modules
→ layered application
→ modular monolith
→ service-oriented architecture
→ microservices
→ distributed architecture
```

Learn:

- `P09.0#1` separation of concerns
- `P09.0#2` dependency inversion
- `P09.0#3` modularity
- `P09.0#4` interfaces
- `P09.0#5` adapters
- `P09.0#6` dependency injection
- `P09.0#7` repositories
- `P09.0#8` service boundaries
- `P09.0#9` domain boundaries
- `P09.0#10` event-driven architecture
- `P09.0#11` message-driven architecture
- `P09.0#12` synchronous vs asynchronous communication
- `P09.0#13` design patterns
- `P09.0#14` architectural patterns

#### P09.1 Design-pattern families

*Scheduled:* CW092

Awareness/working level:

- `P09.1#1` Strategy
- `P09.1#2` Factory
- `P09.1#3` Adapter
- `P09.1#4` Observer
- `P09.1#5` Decorator
- `P09.1#6` Command
- `P09.1#7` Repository
- `P09.1#8` Dependency Injection

Do not memorise pattern names without understanding the underlying design problem.

#### P09.2 Critical rule *(rule)*

Do not build microservices because they look impressive.

First learn to design a good single service.

#### P09 resources

- *Concept coverage:* modularity, boundaries, layered architecture, dependency inversion, adapters, DI, repositories, domain boundaries, event-driven systems, synchronous vs asynchronous communication, patterns.
- `RES-P09-01` **CORE:** Software Architecture in Practice / Martin Fowler architecture articles — https://martinfowler.com/architecture/
- `RES-P09-02` **REFERENCE:** AWS Well-Architected Framework — https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html
- `RES-P09-03` **DEEP:** Designing Data-Intensive Applications — https://dataintensive.net/
- `RES-P09-04` **IMPLEMENT:** refactor a monolith from script → modules → layered design; split services only when a real boundary appears.

### P10 — Mathematics

- **Priority:** 🔴 Critical · **Target:** Linear Algebra: 🔴 D4; Calculus: 🔴 D3–D4; Probability: 🔴 D3–D4; Statistics: 🔴 D4; Optimisation: 🟠 D3–D4
- **Prerequisites:** P01 (S103), P04 (S103), P06 (S103)
- **Scheduled in:** S3, S5B

#### P10.1 Linear Algebra — 🔴 D4 *(parent)*

#### P10.1a Linear Algebra › Foundations

*Scheduled:* CW026

- `P10.1a#1` scalars
- `P10.1a#2` vectors
- `P10.1a#3` matrices
- `P10.1a#4` matrix operations
- `P10.1a#5` matrix multiplication
- `P10.1a#6` transpose
- `P10.1a#7` inverse
- `P10.1a#8` systems of equations

#### P10.1b Linear Algebra › Vector spaces

*Scheduled:* CW027

- `P10.1b#1` subspaces
- `P10.1b#2` basis
- `P10.1b#3` dimension
- `P10.1b#4` rank
- `P10.1b#5` null space
- `P10.1b#6` column space
- `P10.1b#7` linear independence
- `P10.1b#8` linear transformations

#### P10.1c Linear Algebra › Geometry

*Scheduled:* CW028

- `P10.1c#1` inner product
- `P10.1c#2` norms
- `P10.1c#3` distances
- `P10.1c#4` orthogonality
- `P10.1c#5` projections
- `P10.1c#6` least-squares geometry

#### P10.1d Linear Algebra › Advanced

*Scheduled:* CW076

- `P10.1d#1` eigenvalues
- `P10.1d#2` eigenvectors
- `P10.1d#3` diagonalisation
- `P10.1d#4` positive-definite matrices
- `P10.1d#5` quadratic forms
- `P10.1d#6` SVD
- `P10.1d#7` PCA
- `P10.1d#8` tensor notation

#### P10.1e Linear Algebra › ML connections

*Scheduled:* CW076

You should know why linear algebra appears in:

- `P10.1e#1` regression
- `P10.1e#2` PCA
- `P10.1e#3` covariance
- `P10.1e#4` embeddings
- `P10.1e#5` neural-network layers
- `P10.1e#6` optimisation
- `P10.1e#7` attention

**Required practice**

Do numerical work by hand and with Python/NumPy.

Implement:

- `P10.1e#8` matrix operations
- `P10.1e#9` least squares
- `P10.1e#10` PCA

#### P10.2 Calculus — 🔴 D3–D4

*Scheduled:* CW082

Learn:

- `P10.2#1` functions
- `P10.2#2` limits
- `P10.2#3` continuity
- `P10.2#4` derivatives
- `P10.2#5` product rule
- `P10.2#6` quotient rule
- `P10.2#7` chain rule
- `P10.2#8` partial derivatives
- `P10.2#9` gradients
- `P10.2#10` directional derivatives
- `P10.2#11` Jacobians
- `P10.2#12` Hessians
- `P10.2#13` multivariable calculus

Connect directly to:

- `P10.2#14` gradient descent
- `P10.2#15` loss functions
- `P10.2#16` backpropagation
- `P10.2#17` optimisation
- `P10.2#18` sensitivity

You should be able to derive simple gradients rather than only recognise them.

#### P10.3 Probability — 🔴 D3–D4

*Scheduled:* CW022, CW023, CW074

Learn:

- `P10.3#1` sample spaces
- `P10.3#2` events
- `P10.3#3` conditional probability
- `P10.3#4` Bayes theorem
- `P10.3#5` independence
- `P10.3#6` random variables
- `P10.3#7` PMF
- `P10.3#8` PDF
- `P10.3#9` CDF
- `P10.3#10` expectation
- `P10.3#11` variance
- `P10.3#12` covariance
- `P10.3#13` conditional expectation
- `P10.3#14` common distributions
- `P10.3#15` law of large numbers
- `P10.3#16` central limit theorem

Then:

- `P10.3#17` likelihood
- `P10.3#18` maximum likelihood estimation
- `P10.3#19` MAP
- `P10.3#20` Bayesian reasoning

#### P10.4 Statistics — 🔴 D4

*Scheduled:* CW024, CW025, CW073, CW081

Learn:

- `P10.4#1` descriptive statistics
- `P10.4#2` sampling
- `P10.4#3` estimators
- `P10.4#4` bias
- `P10.4#5` variance
- `P10.4#6` consistency
- `P10.4#7` confidence intervals
- `P10.4#8` hypothesis testing
- `P10.4#9` p-values
- `P10.4#10` statistical power
- `P10.4#11` effect sizes
- `P10.4#12` regression
- `P10.4#13` ANOVA
- `P10.4#14` experimental design
- `P10.4#15` A/B testing
- `P10.4#16` Bayesian statistics

Important mindset:

> Statistics is not merely calculating summaries; it is reasoning under uncertainty.

#### P10.5 Optimisation — 🟠 D3–D4

*Scheduled:* CW083

Learn:

- `P10.5#1` objective functions
- `P10.5#2` feasible regions
- `P10.5#3` convexity
- `P10.5#4` local vs global minima
- `P10.5#5` constrained optimisation
- `P10.5#6` gradients
- `P10.5#7` gradient methods
- `P10.5#8` SGD
- `P10.5#9` momentum
- `P10.5#10` Adam
- `P10.5#11` learning-rate schedules
- `P10.5#12` regularisation

Connect this to model training.

#### P10 resources

- `RES-P10-01` Linear Algebra · **CORE:** MIT 18.06 / 18.06SC — https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/
- `RES-P10-02` Linear Algebra · **PRACTICE:** problem sets + hand derivations + NumPy.
- `RES-P10-03` Linear Algebra · **REFERENCE:** MIT notes and linear algebra reference material.
- `RES-P10-04` Linear Algebra · **DEEP:** Linear Algebra Done Right or equivalent rigorous text when research depth demands it.
- `RES-P10-05` Calculus · **CORE:** MIT 18.01SC Single Variable Calculus — https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/
- `RES-P10-06` Calculus · **SUPPLEMENT:** MIT 18.02 / multivariable calculus material when gradients/Jacobians become active.
- `RES-P10-07` Calculus · **DEEP:** Stewart or a rigorous alternative if needed for formal depth.
- `RES-P10-08` Probability · **CORE:** MIT probabilistic systems material — https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/
- `RES-P10-09` Probability · **PRACTICE:** problem sets, simulations, Monte Carlo experiments.
- `RES-P10-10` Probability · **DEEP:** Introduction to Probability, Blitzstein and Hwang.
- `RES-P10-11` Statistics · **CORE:** OpenIntro Statistics — https://www.openintro.org/book/os/
- `RES-P10-12` Statistics · **SUPPLEMENT:** An Introduction to Statistical Learning — https://www.statlearning.com/
- `RES-P10-13` Statistics · **REFERENCE:** statistical software documentation and formal statistical texts as needed.
- `RES-P10-14` Optimisation · **CORE:** selected MIT/Stanford optimisation material tied directly to ML.
- `RES-P10-15` Optimisation · **REFERENCE:** PyTorch optimisation documentation and algorithm references.
- `RES-P10-16` Optimisation · **DEEP:** Convex Optimization by Boyd and Vandenberghe when the target work requires formal convex analysis.

### P11 — Data Science

- **Priority:** 🔴 Critical · **Target:** 🔴 D3–D4
- **Prerequisites:** P10 (S103), P06 (S101)
- **Scheduled in:** S3, S5B

#### P11.1 Core stack

*Scheduled:* CW029, CW030

- `P11.1#1` Python
- `P11.1#2` NumPy
- `P11.1#3` Pandas
- `P11.1#4` SQL
- `P11.1#5` Matplotlib

#### P11.2 Data workflow

*Scheduled:* CW031

```text
Question
→ data acquisition
→ inspection
→ validation
→ cleaning
→ exploration
→ hypothesis formation
→ analysis
→ modelling if appropriate
→ evaluation
→ communication
```

#### P11.3 Data-quality reasoning

*Scheduled:* CW031, CW032

Inspect:

- `P11.3#1` missing values
- `P11.3#2` duplicates
- `P11.3#3` malformed records
- `P11.3#4` outliers
- `P11.3#5` anomalies
- `P11.3#6` distributions
- `P11.3#7` class imbalance
- `P11.3#8` leakage
- `P11.3#9` sampling problems
- `P11.3#10` selection bias
- `P11.3#11` temporal leakage
- `P11.3#12` inconsistent categories

#### P11.4 Data projects

*Scheduled:* CW067

Build:

- `P11.4#1` public-data investigation
- `P11.4#2` time-series investigation
- `P11.4#3` business KPI analysis
- `P11.4#4` experiment analysis
- `P11.4#5` data-quality audit
- `P11.4#6` reproducible analytical report

#### P11.5 Communication

*Scheduled:* CW067

Learn to communicate:

- `P11.5#1` finding
- `P11.5#2` evidence
- `P11.5#3` uncertainty
- `P11.5#4` limitations
- `P11.5#5` recommendation when appropriate

Do not turn every analysis into a dashboard when a clear written finding is more appropriate.

#### P11 resources

- *Concept coverage:* NumPy, Pandas, data cleaning, joins, transformations, EDA, visualisation, statistical analysis, feature creation, reproducibility, communication.
- `RES-P11-01` **CORE:** Kaggle Learn for short guided practice — https://www.kaggle.com/learn
- `RES-P11-02` **REFERENCE:** NumPy docs — https://numpy.org/doc/
- `RES-P11-03` **REFERENCE:** Pandas docs — https://pandas.pydata.org/docs/
- `RES-P11-04` **REFERENCE:** Matplotlib docs — https://matplotlib.org/stable/
- `RES-P11-05` **PRACTICE:** real datasets, university datasets, analysis writeups.
- `RES-P11-06` **DEEP:** Practical Statistics for Data Scientists and your statistics coursework.

### P12 — Data Engineering Foundation

- **Priority:** 🟡🟠 Useful–High · **Target:** 🟡–🟠 D2–D3
- **Prerequisites:** P11 (TEXT), P06 (TEXT)
- **Scheduled in:** S5B

#### P12.0 Data Engineering Foundation (core scope)

*Scheduled:* CW068; items 14-16 on demand

The purpose is to understand how data moves through real systems.

Learn:

- `P12.0#1` ETL
- `P12.0#2` ELT
- `P12.0#3` batch processing
- `P12.0#4` streaming
- `P12.0#5` data ingestion
- `P12.0#6` schemas
- `P12.0#7` schema evolution
- `P12.0#8` data validation
- `P12.0#9` data lineage
- `P12.0#10` partitioning
- `P12.0#11` warehouses
- `P12.0#12` lakes
- `P12.0#13` basic orchestration

Later technologies:

- `P12.0#14` Airflow
- `P12.0#15` Spark
- `P12.0#16` Kafka

Learn each as a response to a real scaling or workflow problem.

#### P12.1 Data engineering project

*Scheduled:* CW069

Build:

```text
Raw source
→ ingestion
→ validation
→ transformation
→ PostgreSQL
→ analytical query
→ report
```

Then add a second version with batch scheduling and logging.

#### P12 resources

- *Concept coverage:* ingestion, ETL/ELT, batch processing, orchestration, data warehouses, streaming awareness, data quality, reproducibility.
- `RES-P12-01` **CORE:** Data Engineering Zoomcamp — https://datatalks.club/blog/data-engineering-zoomcamp.html
- `RES-P12-02` **REFERENCE:** Apache Airflow docs — https://airflow.apache.org/docs/
- `RES-P12-03` **REFERENCE:** Apache Spark docs — https://spark.apache.org/documentation/
- `RES-P12-04` **REFERENCE:** Apache Kafka docs — https://kafka.apache.org/documentation/
- `RES-P12-05` **OPTIONAL:** dbt docs for analytics engineering — https://docs.getdbt.com/
- `RES-P12-06` **IMPLEMENT:** raw source → validation → transformation → PostgreSQL → analytics query → report, then schedule and log it.

### P13 — Classical Machine Learning

- **Priority:** 🔴 Critical · **Target:** 🔴 D4
- **Prerequisites:** P10 (S79), P11 (S79), P07 (S103), P08 (S103)
- **Unlock note:** Classical ML may begin only when the programming, data, and statistics gates are genuinely passing (master timeline).
- **Scheduled in:** S5B

#### P13.1 Problem formulation

*Scheduled:* CW072

Before model selection ask:

- `P13.1#1` What is the target?
- `P13.1#2` What is the unit of prediction?
- `P13.1#3` What is the available data?
- `P13.1#4` What information exists at prediction time?
- `P13.1#5` What is the cost of errors?
- `P13.1#6` What baseline should I beat?
- `P13.1#7` What metric matters?

#### P13.2 Regression

*Scheduled:* CW073

Learn:

- `P13.2#1` linear regression
- `P13.2#2` polynomial regression
- `P13.2#3` Ridge
- `P13.2#4` Lasso
- `P13.2#5` Elastic Net

Understand:

- `P13.2#6` least squares
- `P13.2#7` residuals
- `P13.2#8` assumptions
- `P13.2#9` multicollinearity
- `P13.2#10` regularisation

#### P13.3 Classification

*Scheduled:* CW074

Learn:

- `P13.3#1` logistic regression
- `P13.3#2` kNN
- `P13.3#3` Naive Bayes
- `P13.3#4` SVM
- `P13.3#5` decision trees
- `P13.3#6` random forests
- `P13.3#7` gradient boosting

#### P13.4 Boosting

*Scheduled:* CW075

Understand:

- `P13.4#1` weak learners
- `P13.4#2` sequential correction
- `P13.4#3` residuals
- `P13.4#4` gradient boosting
- `P13.4#5` XGBoost
- `P13.4#6` LightGBM

Use mature implementations professionally after understanding the concepts.

#### P13.5 Unsupervised learning

*Scheduled:* CW077

- `P13.5#1` k-means
- `P13.5#2` hierarchical clustering
- `P13.5#3` DBSCAN
- `P13.5#4` Gaussian mixture models
- `P13.5#5` PCA
- `P13.5#6` dimensionality reduction

Understand assumptions and failure modes.

#### P13 resources

- *Concept coverage:* regression, classification, trees, ensembles, boosting, clustering, dimensionality reduction, problem formulation.
- `RES-P13-01` **CORE:** An Introduction to Statistical Learning — https://www.statlearning.com/
- `RES-P13-02` **PRACTICE / REFERENCE:** scikit-learn User Guide — https://scikit-learn.org/stable/user_guide.html
- `RES-P13-03` **DEEP:** Stanford CS229 — https://cs229.stanford.edu/
- `RES-P13-04` **IMPLEMENT:** baseline → feature engineering → model comparison → evaluation report.

### P14 — Machine Learning Theory

- **Priority:** 🔴 Critical · **Target:** 🔴 D4
- **Prerequisites:** P13 (S101)
- **Scheduled in:** S5B

#### P14.0 Machine Learning Theory (core scope)

*Scheduled:* CW078

Learn:

- `P14.0#1` bias
- `P14.0#2` variance
- `P14.0#3` overfitting
- `P14.0#4` underfitting
- `P14.0#5` regularisation
- `P14.0#6` cross-validation
- `P14.0#7` hyperparameter tuning
- `P14.0#8` feature selection
- `P14.0#9` feature engineering
- `P14.0#10` leakage
- `P14.0#11` distribution shift
- `P14.0#12` imbalance
- `P14.0#13` calibration

#### P14.1 Feature engineering

*Scheduled:* CW079

Learn:

- `P14.1#1` categorical encoding
- `P14.1#2` scaling
- `P14.1#3` transformations
- `P14.1#4` interaction features
- `P14.1#5` date/time features
- `P14.1#6` text-derived features
- `P14.1#7` missingness indicators
- `P14.1#8` domain-driven features

#### P14.2 Leakage

*Scheduled:* CW079

Be able to distinguish:

- `P14.2#1` harmless preprocessing
- `P14.2#2` train/test leakage
- `P14.2#3` target leakage
- `P14.2#4` temporal leakage
- `P14.2#5` duplicate leakage

#### P14.3 Baselines

*Scheduled:* CW072

Every ML project should have a baseline.

Examples:

- `P14.3#1` majority class
- `P14.3#2` mean predictor
- `P14.3#3` linear model
- `P14.3#4` simple heuristic

Do not jump directly to the fanciest model.

#### P14 resources

- *Concept coverage:* bias/variance, regularisation, generalisation, feature engineering, leakage, distribution shift, imbalance, calibration, baselines.
- `RES-P14-01` **CORE:** Stanford CS229 lectures/notes — https://cs229.stanford.edu/
- `RES-P14-02` **REFERENCE:** scikit-learn User Guide — https://scikit-learn.org/stable/user_guide.html
- `RES-P14-03` **DEEP:** The Elements of Statistical Learning — https://hastie.su.domains/ElemStatLearn/
- `RES-P14-04` **IMPLEMENT:** deliberately create leakage, imbalance, and overfitting failures and diagnose them.

### P15 — Model Evaluation

- **Priority:** 🔴 Critical · **Target:** 🔴 D4
- **Prerequisites:** P13 (S101)
- **Scheduled in:** S5B

#### P15.1 Classification metrics

*Scheduled:* CW080

Understand:

- `P15.1#1` accuracy
- `P15.1#2` precision
- `P15.1#3` recall
- `P15.1#4` specificity
- `P15.1#5` F1
- `P15.1#6` ROC-AUC
- `P15.1#7` PR-AUC
- `P15.1#8` log loss
- `P15.1#9` confusion matrix
- `P15.1#10` calibration

#### P15.2 Regression metrics

*Scheduled:* CW080

- `P15.2#1` MAE
- `P15.2#2` MSE
- `P15.2#3` RMSE
- `P15.2#4` R²
- `P15.2#5` MAPE awareness

#### P15.3 Evaluation design

*Scheduled:* CW081

Learn:

- `P15.3#1` train/validation/test separation
- `P15.3#2` cross-validation
- `P15.3#3` grouped splits
- `P15.3#4` temporal splits
- `P15.3#5` stratification
- `P15.3#6` confidence intervals where useful
- `P15.3#7` uncertainty

#### P15.4 Metric selection

*Scheduled:* CW081

Always ask:

> What type of error matters operationally?

Not merely:

> Which metric gives the biggest number?

#### P15 resources

- *Concept coverage:* classification metrics, regression metrics, splits, cross-validation, temporal/grouped splits, calibration, uncertainty, operational metrics.
- `RES-P15-01` **CORE:** ISLR + CS229 statistical learning material.
- `RES-P15-02` **REFERENCE:** scikit-learn metrics/model_selection docs — https://scikit-learn.org/stable/modules/classes.html
- `RES-P15-03` **DEEP:** statistical decision theory and experiment design when research work demands it.
- `RES-P15-04` **IMPLEMENT:** write an evaluation plan before training; justify the metric using the error costs.

### P16 — From-Scratch ML Implementation

- **Priority:** not stated in master · **Target:** not stated in master
- **Prerequisites:** P13 (S101), P10 (S101)
- **Scheduled in:** S5B, S6A

#### P16.0 From-Scratch ML Implementation (core scope)

*Scheduled:* CW084, CW085, CW103

Implement selected algorithms with NumPy before relying entirely on libraries.

Required candidates:

1. `P16.0#1` Linear regression
2. `P16.0#2` Gradient descent
3. `P16.0#3` Logistic regression
4. `P16.0#4` k-means
5. `P16.0#5` PCA
6. `P16.0#6` Selected decision-tree components
7. `P16.0#7` Simple neural network
8. `P16.0#8` Backpropagation

For every implementation document:

- `P16.0#9` mathematical formulation
- `P16.0#10` data flow
- `P16.0#11` computational complexity
- `P16.0#12` assumptions
- `P16.0#13` limitations
- `P16.0#14` comparison with library implementation

Then transition to scikit-learn for robust workflows.

#### P16 resources

- *Concept coverage:* linear regression, gradient descent, logistic regression, k-means, PCA, tree components, simple neural network, backpropagation.
- `RES-P16-01` **CORE:** CS229 notes + your mathematics notes.
- `RES-P16-02` **PRACTICE:** NumPy-only implementations.
- `RES-P16-03` **REFERENCE:** NumPy docs — https://numpy.org/doc/
- `RES-P16-04` **DEEP:** numerical optimisation and linear algebra references as gaps appear.
- `RES-P16-05` **IMPLEMENT:** compare your implementation with scikit-learn/PyTorch behavior and complexity.

### P17 — Time Series

- **Priority:** 🟠 High · **Target:** 🟠 D2–D3
- **Prerequisites:** P13 (TEXT), P15 (TEXT)
- **Scheduled in:** S5B, S6A

#### P17.0 Time Series (core scope)

*Scheduled:* CW086, CW111

Useful for Data Science, finance, operations, forecasting, and many production settings.

Learn:

- `P17.0#1` temporal indexing
- `P17.0#2` trend
- `P17.0#3` seasonality
- `P17.0#4` stationarity
- `P17.0#5` autocorrelation
- `P17.0#6` lag features
- `P17.0#7` rolling windows
- `P17.0#8` temporal cross-validation
- `P17.0#9` forecasting baselines
- `P17.0#10` error evaluation

Later:

- `P17.0#11` ARIMA awareness
- `P17.0#12` state-space awareness
- `P17.0#13` exponential smoothing
- `P17.0#14` machine-learning forecasting
- `P17.0#15` deep-learning forecasting awareness

Critical rule:

Never randomly split a genuinely temporal dataset in a way that leaks future information into the past.

#### P17 resources

- *Concept coverage:* trend, seasonality, stationarity, forecasting, validation, lags, autoregressive models, modern ML forecasting awareness.
- `RES-P17-01` **CORE:** Forecasting: Principles and Practice — https://otexts.com/fpp3/
- `RES-P17-02` **PRACTICE:** forecasting experiments with temporal validation.
- `RES-P17-03` **REFERENCE:** statsmodels time-series docs — https://www.statsmodels.org/stable/tsa.html
- `RES-P17-04` **DEEP:** advanced forecasting literature when needed.

### P18 — Recommender Systems

- **Priority:** 🟠 High · **Target:** 🟠 D3
- **Prerequisites:** P13 (TEXT), P15 (TEXT), P19 (TEXT), P28 (TEXT)
- **Scheduled in:** S6B

#### P18.0 Recommender Systems (core scope)

*Scheduled:* CW127, CW128

This is an important bridge between ML and systems.

Learn:

- `P18.0#1` recommendation problem formulation
- `P18.0#2` candidate generation
- `P18.0#3` ranking
- `P18.0#4` collaborative filtering
- `P18.0#5` content-based approaches
- `P18.0#6` embeddings
- `P18.0#7` similarity
- `P18.0#8` cold start
- `P18.0#9` implicit feedback
- `P18.0#10` explicit feedback
- `P18.0#11` negative sampling
- `P18.0#12` offline evaluation
- `P18.0#13` online experimentation

Architecture:

```text
User activity
→ event ingestion
→ feature generation
→ candidate generation
→ ranking
→ serving
→ feedback
```

Project:

Build a recommendation system, then design how it would evolve from a local prototype into a production system.

#### P18 resources

- *Concept coverage:* collaborative filtering, content-based recommendation, ranking, retrieval, cold start, feedback loops, offline/online evaluation.
- `RES-P18-01` **CORE:** Google recommendation systems learning materials — https://developers.google.com/machine-learning/recommendation
- `RES-P18-02` **SUPPLEMENT:** Stanford recommender / large-scale ML material.
- `RES-P18-03` **REFERENCE:** TensorFlow Recommenders docs when implementing with that stack. — https://www.tensorflow.org/recommenders
- `RES-P18-04` **DEEP:** recommender-system literature and industry case studies.

### P19 — Deep Learning

- **Priority:** 🔴 Critical · **Target:** 🔴 D4
- **Prerequisites:** P13 (S103), P14 (S103), P15 (S103), P16 (S101), P31 (D5), P32 (D5)
- **Unlock note:** Decision 5: only after Classical ML and Docker/CI/CD/Cloud gates.
- **Scheduled in:** S6A

#### P19.0 Deep Learning (core scope)

*Scheduled:* CW102

Primary framework: PyTorch.

#### P19.1 Neural-network foundations

*Scheduled:* CW102

Learn:

- `P19.1#1` perceptron
- `P19.1#2` linear layer
- `P19.1#3` nonlinear activation
- `P19.1#4` MLP
- `P19.1#5` forward pass
- `P19.1#6` loss function
- `P19.1#7` backpropagation
- `P19.1#8` gradient descent

#### P19.2 Activations

*Scheduled:* CW103

Understand:

- `P19.2#1` sigmoid
- `P19.2#2` tanh
- `P19.2#3` ReLU
- `P19.2#4` variants of ReLU
- `P19.2#5` softmax

Understand why activation functions affect optimisation and expressiveness.

#### P19.3 Training

*Scheduled:* CW104, CW105

Learn:

- `P19.3#1` initialisation
- `P19.3#2` learning rates
- `P19.3#3` batch size
- `P19.3#4` epochs
- `P19.3#5` minibatch SGD
- `P19.3#6` momentum
- `P19.3#7` Adam
- `P19.3#8` schedulers
- `P19.3#9` weight decay
- `P19.3#10` dropout
- `P19.3#11` batch normalisation
- `P19.3#12` early stopping

#### P19.4 Failure modes

*Scheduled:* CW106

Understand:

- `P19.4#1` overfitting
- `P19.4#2` underfitting
- `P19.4#3` exploding gradients
- `P19.4#4` vanishing gradients
- `P19.4#5` unstable training
- `P19.4#6` poor initialisation
- `P19.4#7` data problems

#### P19.5 Required builds

*Scheduled:* CW107

- `P19.5#1` linear regression in PyTorch
- `P19.5#2` MLP classifier
- `P19.5#3` custom training loop
- `P19.5#4` experiment comparison
- `P19.5#5` model checkpointing

#### P19 resources

- *Concept coverage:* perceptrons, MLPs, activations, loss, backpropagation, optimisers, regularisation, dropout, normalisation, initialisation, failure modes.
- `RES-P19-01` **CORE:** MIT 6.S191 Introduction to Deep Learning — https://introtodeeplearning.com/
- `RES-P19-02` **PRACTICE / REFERENCE:** PyTorch tutorials — https://docs.pytorch.org/tutorials/
- `RES-P19-03` **DEEP:** Deep Learning, Goodfellow et al.; Dive into Deep Learning — https://d2l.ai/
- `RES-P19-04` **IMPLEMENT:** hand-compute a small forward/backprop example, then build the same idea in PyTorch.

### P20 — Computer Vision

- **Priority:** 🟡🟠 Useful–High · **Target:** 🟡–🟠 D2–D3
- **Prerequisites:** P19 (S101)
- **Scheduled in:** S6A

#### P20.0 Computer Vision (core scope)

*Scheduled:* CW108, CW109

Learn:

- `P20.0#1` image representation
- `P20.0#2` convolution
- `P20.0#3` kernels
- `P20.0#4` padding
- `P20.0#5` stride
- `P20.0#6` pooling
- `P20.0#7` CNNs
- `P20.0#8` augmentation
- `P20.0#9` transfer learning
- `P20.0#10` image classification
- `P20.0#11` object detection awareness
- `P20.0#12` segmentation awareness

Conceptual architecture progression:

- `P20.0#13` LeNet
- `P20.0#14` AlexNet
- `P20.0#15` VGG
- `P20.0#16` ResNet

The objective is historical and conceptual understanding, not architecture memorisation.

Projects:

- `P20.0#17` image classifier
- `P20.0#18` transfer-learning classifier
- `P20.0#19` detection project
- `P20.0#20` document/industrial image analysis

#### P20 resources

- *Concept coverage:* CNNs, convolutions, pooling, augmentation, transfer learning, detection, segmentation, vision transformers awareness.
- `RES-P20-01` **CORE:** Stanford CS231n — https://cs231n.stanford.edu/
- `RES-P20-02` **REFERENCE:** PyTorch vision tutorials and torchvision docs.
- `RES-P20-03` **DEEP:** modern vision papers once fundamentals are strong.

### P21 — Sequence Models and NLP

- **Priority:** 🟠 High · **Target:** 🟠 D3
- **Prerequisites:** P19 (S101)
- **Scheduled in:** S6A

#### P21.0 Sequence Models and NLP (core scope)

*Scheduled:* CW110, CW111

Learn:

- `P21.0#1` sequences
- `P21.0#2` tokens
- `P21.0#3` vocabulary
- `P21.0#4` embeddings
- `P21.0#5` sequence classification
- `P21.0#6` RNNs
- `P21.0#7` hidden state
- `P21.0#8` LSTM
- `P21.0#9` GRU
- `P21.0#10` sequence-to-sequence
- `P21.0#11` teacher forcing awareness

Then move toward attention and Transformers.

#### P21 resources

- *Concept coverage:* tokenisation concepts, sequence modelling, RNNs, LSTMs/GRUs, language modelling, embeddings, NLP pipelines.
- `RES-P21-01` **CORE:** Stanford CS224N — https://web.stanford.edu/class/cs224n/
- `RES-P21-02` **REFERENCE:** Hugging Face NLP/Transformers docs. — https://huggingface.co/docs/transformers/
- `RES-P21-03` **DEEP:** NLP research papers and selected chapters of Speech and Language Processing.

### P22 — Attention and Transformers

- **Priority:** 🔴 Critical · **Target:** 🔴 D4
- **Prerequisites:** P19 (S101), P21 (S101), P28 (D5), P30 (D5)
- **Unlock note:** Decision 5: formal study only after ML Engineering/MLOps (C5). Optional reading exposure allowed earlier; never a gate.
- **Scheduled in:** S7A

#### P22.0 Attention and Transformers (core scope)

*Scheduled:* CW139, CW140

This is a major conceptual milestone.

Learn:

- `P22.0#1` query
- `P22.0#2` key
- `P22.0#3` value
- `P22.0#4` attention scores
- `P22.0#5` scaled dot-product attention
- `P22.0#6` softmax
- `P22.0#7` masking
- `P22.0#8` multi-head attention
- `P22.0#9` positional information
- `P22.0#10` residual connections
- `P22.0#11` layer normalisation
- `P22.0#12` feed-forward blocks
- `P22.0#13` encoder
- `P22.0#14` decoder
- `P22.0#15` autoregressive generation

#### P22.1 Required understanding *(mastery statement)*

You should be able to explain why attention works as a mechanism for selecting and combining information.

#### P22.2 Required build

*Scheduled:* CW141, CW142

Implement a small Transformer from scratch.

Suggested progression:

1. `P22.2#1` token embeddings
2. `P22.2#2` positional representation
3. `P22.2#3` single-head attention
4. `P22.2#4` multi-head attention
5. `P22.2#5` feed-forward block
6. `P22.2#6` residual connections
7. `P22.2#7` layer normalization
8. `P22.2#8` causal masking
9. `P22.2#9` training loop
10. `P22.2#10` text generation

The model can be tiny. The purpose is understanding.

#### P22 resources

- *Concept coverage:* queries/keys/values, self-attention, multi-head attention, masking, positional encoding, encoder/decoder architectures, training objectives.
- `RES-P22-01` **CORE:** Stanford CS224N + Hugging Face course. — https://huggingface.co/docs/course/chapter1/1
- `RES-P22-02` **SUPPLEMENT:** The Illustrated Transformer — https://jalammar.github.io/illustrated-transformer/
- `RES-P22-03` **REFERENCE:** Transformer implementation/documentation in Hugging Face.
- `RES-P22-04` **IMPLEMENT:** implement a small attention block and a miniature transformer before fine-tuning large models.

### P23 — Modern LLM Engineering

- **Priority:** 🔴 Critical · **Target:** 🔴 D3–D4
- **Prerequisites:** P22 (S103)
- **Scheduled in:** S7A

#### P23.1 Tokenisation

*Scheduled:* CW143

Learn:

- `P23.1#1` tokens
- `P23.1#2` token IDs
- `P23.1#3` vocabulary
- `P23.1#4` subword tokenisation
- `P23.1#5` BPE
- `P23.1#6` WordPiece awareness
- `P23.1#7` sequence length
- `P23.1#8` context window

#### P23.2 Embeddings

*Scheduled:* CW143

Learn:

- `P23.2#1` representation
- `P23.2#2` vector similarity
- `P23.2#3` cosine similarity
- `P23.2#4` semantic search
- `P23.2#5` dense retrieval

#### P23.3 Model lifecycle

*Scheduled:* CW144

Understand:

- `P23.3#1` pretraining
- `P23.3#2` next-token prediction
- `P23.3#3` fine-tuning
- `P23.3#4` instruction tuning
- `P23.3#5` preference optimisation
- `P23.3#6` RLHF concepts
- `P23.3#7` parameter-efficient fine-tuning

#### P23.4 Fine-tuning

*Scheduled:* CW145

Learn:

- `P23.4#1` LoRA
- `P23.4#2` PEFT
- `P23.4#3` dataset formatting
- `P23.4#4` evaluation splits
- `P23.4#5` overfitting
- `P23.4#6` catastrophic forgetting awareness
- `P23.4#7` training-cost reasoning

#### P23.5 Inference

*Scheduled:* CW146

Learn:

- `P23.5#1` batching
- `P23.5#2` throughput
- `P23.5#3` latency
- `P23.5#4` KV cache
- `P23.5#5` quantisation
- `P23.5#6` context management
- `P23.5#7` serving
- `P23.5#8` model routing awareness

#### P23.6 Tooling

*Scheduled:* CW146

Use the Hugging Face ecosystem as a core reference point.

Reference:
https://huggingface.co/docs/transformers

Do not become a wrapper-only LLM developer.

#### P23 resources

- *Concept coverage:* tokenisers, embeddings, pretraining concepts, instruction tuning, fine-tuning, LoRA/PEFT, quantisation, inference, model serving, Hugging Face ecosystem.
- `RES-P23-01` **CORE:** Hugging Face Course — https://huggingface.co/course/
- `RES-P23-02` **REFERENCE:** Transformers, Datasets, Tokenizers, Accelerate docs. — https://huggingface.co/docs/accelerate/
- `RES-P23-03` **DEEP:** Full Stack Deep Learning — https://fullstackdeeplearning.com/
- `RES-P23-04` **RECHECK:** model-serving and inference libraries change quickly. Read current release docs when implementing.
- `RES-P23-X1` **PHASE-TEXT:** Referenced in P23.6 Tooling — https://huggingface.co/docs/transformers

### P24 — Retrieval-Augmented Generation

- **Priority:** 🔴 Critical · **Target:** 🔴 D3
- **Prerequisites:** P23 (S101), P08 (TEXT), P06 (TEXT)
- **Scheduled in:** S7A

#### P24.0 Retrieval-Augmented Generation (core scope)

*Scheduled:* CW147, CW148

Understand RAG as an information-retrieval system plus a generation system.

```text
Documents
→ parsing
→ cleaning
→ chunking
→ metadata
→ embedding/indexing
→ query
→ retrieval
→ filtering
→ reranking
→ context assembly
→ LLM
→ answer
→ evaluation
```

Learn:

- `P24.0#1` document ingestion
- `P24.0#2` parsing
- `P24.0#3` chunking strategies
- `P24.0#4` overlap
- `P24.0#5` metadata
- `P24.0#6` dense retrieval
- `P24.0#7` sparse retrieval
- `P24.0#8` hybrid retrieval
- `P24.0#9` vector indexes
- `P24.0#10` reranking
- `P24.0#11` query rewriting
- `P24.0#12` context compression
- `P24.0#13` citation grounding
- `P24.0#14` retrieval metrics
- `P24.0#15` generation metrics

#### P24.1 Failure modes

*Scheduled:* CW149

- `P24.1#1` bad parsing
- `P24.1#2` wrong chunk boundaries
- `P24.1#3` poor retrieval
- `P24.1#4` irrelevant retrieval
- `P24.1#5` context overload
- `P24.1#6` hallucination
- `P24.1#7` stale documents
- `P24.1#8` access-control failures
- `P24.1#9` prompt injection

#### P24.2 Required project

*Scheduled:* CW156

Build a production-style document research system with:

- `P24.2#1` ingestion
- `P24.2#2` indexing
- `P24.2#3` retrieval
- `P24.2#4` reranking
- `P24.2#5` generation
- `P24.2#6` citations
- `P24.2#7` evaluation
- `P24.2#8` authentication
- `P24.2#9` logging

#### P24 resources

- *Concept coverage:* ingestion, chunking, embeddings, retrieval, hybrid retrieval, reranking, context construction, citations, freshness, evaluation, failure modes.
- `RES-P24-01` **CORE:** Full Stack Deep Learning material on LLM applications — https://fullstackdeeplearning.com/
- `RES-P24-02` **REFERENCE:** LlamaIndex docs — https://docs.llamaindex.ai/
- `RES-P24-03` **SUPPLEMENT:** Haystack docs when a comparison is useful — https://docs.haystack.deepset.ai/
- `RES-P24-04` **DEEP:** information retrieval fundamentals and vector-search documentation.
- `RES-P24-05` **IMPLEMENT:** a retrieval system with an evaluation set, not a “chat with PDF” demo only.

### P25 — AI Agents

- **Priority:** 🟠 High · **Target:** 🟠 D2–D3
- **Prerequisites:** P23 (S101)
- **Scheduled in:** S7A

#### P25.0 AI Agents (core scope)

*Scheduled:* CW152, CW153

Learn the spectrum:

```text
Deterministic function
→ tool call
→ workflow
→ stateful workflow
→ planning
→ agent
→ multi-step agent
→ multi-agent system
```

Learn:

- `P25.0#1` function calling
- `P25.0#2` tool definitions
- `P25.0#3` schema validation
- `P25.0#4` state
- `P25.0#5` memory
- `P25.0#6` planning
- `P25.0#7` execution
- `P25.0#8` retries
- `P25.0#9` timeouts
- `P25.0#10` tool errors
- `P25.0#11` guardrails
- `P25.0#12` observability
- `P25.0#13` evaluation

Critical principle:

> An agent is not automatically better than a deterministic workflow.

Use agents when the problem benefits from flexible decision-making.

Avoid creating agent complexity where a normal program is clearer and more reliable.

#### P25 resources

- *Concept coverage:* tool use, planning, state, memory, orchestration, structured outputs, failure handling, retries, human-in-the-loop, agent evaluation.
- `RES-P25-01` **CORE:** Hugging Face Agents Course — https://huggingface.co/learn/agents-course/
- `RES-P25-02` **REFERENCE:** LangGraph documentation when using graph-based orchestration — https://docs.langchain.com/oss/python/langgraph/
- `RES-P25-03` **SUPPLEMENT:** provider-specific agent SDK documentation when a project calls for it.
- `RES-P25-04` **DEEP:** agent reliability/evaluation research and production case studies.
- `RES-P25-05` **IMPLEMENT:** deterministic tool-use first, then bounded agent loops.

### P26 — Multimodal AI

- **Priority:** 🟡🟠 Useful–High · **Target:** 🟡–🟠 D2–D3
- **Prerequisites:** P20 (TEXT), P21 (TEXT), P22 (TEXT)
- **Scheduled in:** S7B

#### P26.0 Multimodal AI (core scope)

*Scheduled:* CW175, CW176

Learn conceptually:

- `P26.0#1` vision-language models
- `P26.0#2` image embeddings
- `P26.0#3` speech/text relationships
- `P26.0#4` audio models
- `P26.0#5` multimodal tokenisation awareness
- `P26.0#6` multimodal retrieval
- `P26.0#7` document intelligence

Potential projects:

- `P26.0#8` image question-answering system
- `P26.0#9` document understanding system
- `P26.0#10` multimodal search

Do not specialise here unless your later path points this way.

#### P26 resources

- *Concept coverage:* vision-language models, image/text alignment, audio/text awareness, multimodal preprocessing, inference pipelines.
- `RES-P26-01` **CORE:** Hugging Face task/model documentation. — https://huggingface.co/tasks
- `RES-P26-02` **FOUNDATIONS:** CS231n + CS224N.
- `RES-P26-03` **REFERENCE:** PyTorch and Transformers docs.
- `RES-P26-04` **DEEP:** current multimodal model papers.
- `RES-P26-05` **RECHECK:** this is a fast-moving research area; refresh the model/tool section before serious work.

### P27 — AI Evaluation

- **Priority:** 🔴 Critical · **Target:** 🔴 D3
- **Prerequisites:** P23 (S101), P24 (S101), P15 (TEXT)
- **Scheduled in:** S7A

#### P27.0 AI Evaluation (core scope)

*Scheduled:* CW150

AI systems need tests.

Learn to evaluate:

- `P27.0#1` correctness
- `P27.0#2` relevance
- `P27.0#3` groundedness
- `P27.0#4` factual consistency
- `P27.0#5` hallucination
- `P27.0#6` retrieval quality
- `P27.0#7` tool-use accuracy
- `P27.0#8` reliability
- `P27.0#9` latency
- `P27.0#10` cost
- `P27.0#11` safety

#### P27.1 Evaluation loop

*Scheduled:* CW150

```text
Define objective
→ define metric
→ build dataset
→ establish baseline
→ run system
→ analyse failures
→ improve
→ regression test
```

#### P27.2 Evaluation levels

*Scheduled:* CW151

**Unit level**

Does a component behave correctly?

**Retrieval level**

Did we retrieve the right evidence?

**Generation level**

Did the model answer appropriately?

**System level**

Does the whole product satisfy user requirements?

**Online level**

Does real-world use improve or degrade outcomes?

#### P27 resources

- *Concept coverage:* unit evaluation, retrieval evaluation, generation quality, groundedness, safety, regression tests, online monitoring, experiment design.
- `RES-P27-01` **CORE:** NIST AI Risk Management Framework — https://www.nist.gov/itl/ai-risk-management-framework
- `RES-P27-02` **PRACTICE:** build a labelled evaluation set and regression suite for every serious AI project.
- `RES-P27-03` **REFERENCE:** framework-specific evaluation docs (MLflow, provider APIs, task libraries) for the stack in use.
- `RES-P27-04` **DEEP:** evaluation and measurement papers; benchmark methodology.

### P28 — ML Engineering

- **Priority:** 🔴 Critical · **Target:** 🔴 D4
- **Prerequisites:** P19 (D5), P31 (S103), P32 (S103), P12 (TEXT)
- **Scheduled in:** S6B

#### P28.0 ML Engineering (core scope)

*Scheduled:* CW113, CW114

This is the bridge from ML practitioner to ML engineer.

Learn:

- `P28.0#1` project structure
- `P28.0#2` configuration
- `P28.0#3` reproducibility
- `P28.0#4` deterministic runs where possible
- `P28.0#5` data validation
- `P28.0#6` feature pipelines
- `P28.0#7` training pipelines
- `P28.0#8` evaluation pipelines
- `P28.0#9` inference pipelines
- `P28.0#10` experiment tracking
- `P28.0#11` data versioning
- `P28.0#12` model versioning
- `P28.0#13` model registry concepts
- `P28.0#14` model packaging
- `P28.0#15` API serving
- `P28.0#16` batch inference
- `P28.0#17` online inference
- `P28.0#18` model monitoring
- `P28.0#19` drift detection
- `P28.0#20` rollback
- `P28.0#21` retraining

#### P28.1 Standard lifecycle

*Scheduled:* CW113

```text
Data
→ validation
→ feature generation
→ training
→ experiment tracking
→ evaluation
→ model registry
→ packaging
→ deployment
→ inference
→ monitoring
→ drift
→ retraining
```

#### P28.2 Production questions

*Scheduled:* CW114

For every model ask:

- `P28.2#1` How is the model trained?
- `P28.2#2` What data version trained it?
- `P28.2#3` Which code version trained it?
- `P28.2#4` Which hyperparameters were used?
- `P28.2#5` What was the baseline?
- `P28.2#6` What metric improved?
- `P28.2#7` How is the model packaged?
- `P28.2#8` How is inference served?
- `P28.2#9` What is latency?
- `P28.2#10` How is failure handled?
- `P28.2#11` How is performance monitored?
- `P28.2#12` When is retraining triggered?

#### P28 resources

- *Concept coverage:* project structure, data validation, reproducibility, experiment tracking, configuration, training pipelines, tests, model lifecycle.
- `RES-P28-01` **CORE:** Made With ML MLOps Course — https://madewithml.com/courses/mlops/
- `RES-P28-02` **SUPPLEMENT:** Full Stack Deep Learning — https://fullstackdeeplearning.com/
- `RES-P28-03` **REFERENCE:** MLflow docs — https://mlflow.org/docs/latest/
- `RES-P28-04` **REFERENCE:** DVC docs — https://dvc.org/doc
- `RES-P28-05` **DEEP:** Google Rules of ML — https://developers.google.com/machine-learning/guides/rules-of-ml
- `RES-P28-06` **IMPLEMENT:** train → track → register → serve → monitor → reproduce.

### P29 — Model Serving

- **Priority:** 🔴 Critical · **Target:** 🔴 D3
- **Prerequisites:** P13 (S101), P31 (S101), P32 (S101)
- **Unlock note:** Early segment (D1-D2, classical model) after Docker/Cloud per master sequence item 24; formal D3 after ML engineering.
- **Scheduled in:** S5C, S6B

#### P29.1 Batch inference

*Scheduled:* CW096, CW115

Use when predictions can be generated periodically.

Understand:

- `P29.1#1` scheduling
- `P29.1#2` data snapshots
- `P29.1#3` output persistence
- `P29.1#4` idempotency
- `P29.1#5` reruns

#### P29.2 Online inference

*Scheduled:* CW096, CW116

Use when predictions must be returned in real time.

Understand:

- `P29.2#1` latency
- `P29.2#2` throughput
- `P29.2#3` concurrency
- `P29.2#4` timeouts
- `P29.2#5` autoscaling
- `P29.2#6` batching
- `P29.2#7` cold starts

#### P29.3 Serving project

*Scheduled:* CW117

Build:

```text
Client
→ API
→ validation
→ model
→ prediction
→ logging
→ metrics
```

Then add:

- `P29.3#1` Docker
- `P29.3#2` CI/CD
- `P29.3#3` cloud deployment
- `P29.3#4` monitoring

#### P29 resources

- *Concept coverage:* batch vs online inference, APIs, latency, throughput, scaling, model packaging, health checks, canaries, rollback.
- `RES-P29-01` **CORE:** FastAPI for service fundamentals — https://fastapi.tiangolo.com/tutorial/
- `RES-P29-02` **REFERENCE:** KServe docs for Kubernetes-native serving — https://kserve.github.io/website/
- `RES-P29-03` **REFERENCE:** vLLM docs for LLM inference — https://docs.vllm.ai/
- `RES-P29-04` **DEEP:** serving-system papers and performance investigations.
- `RES-P29-05` **IMPLEMENT:** deploy one model behind a versioned API with metrics and a rollback plan.

### P30 — MLOps

- **Priority:** 🔴 Critical · **Target:** 🔴 D3–D4
- **Prerequisites:** P28 (S101), P29 (S101), P31 (TEXT)
- **Scheduled in:** S6B

#### P30.1 Level 1

*Scheduled:* CW118

- `P30.1#1` Git
- `P30.1#2` environments
- `P30.1#3` packaging
- `P30.1#4` testing
- `P30.1#5` Docker

#### P30.2 Level 2

*Scheduled:* CW119

- `P30.2#1` data validation
- `P30.2#2` experiment tracking
- `P30.2#3` model registry
- `P30.2#4` CI/CD

#### P30.3 Level 3

*Scheduled:* CW120

- `P30.3#1` deployment
- `P30.3#2` monitoring
- `P30.3#3` drift
- `P30.3#4` observability

#### P30.4 Level 4

*Scheduled:* CW121

- `P30.4#1` orchestration
- `P30.4#2` feature stores
- `P30.4#3` distributed training
- `P30.4#4` advanced serving
- `P30.4#5` infrastructure automation

Do not learn tools without understanding the ML lifecycle they support.

#### P30 resources

- *Concept coverage:* orchestration, data/model versioning, registries, CI/CD, monitoring, drift, retraining, governance.
- `RES-P30-01` **CORE:** Made With ML — https://madewithml.com/courses/mlops/
- `RES-P30-02` **REFERENCE:** MLflow — https://mlflow.org/docs/latest/
- `RES-P30-03` **REFERENCE:** DVC — https://dvc.org/doc
- `RES-P30-04` **PRACTICE:** GitHub Actions + containerised pipeline.
- `RES-P30-05` **DEEP:** FSDL + production ML case studies.

### P31 — DevOps

- **Priority:** 🟠 High · **Target:** 🟠 D3
- **Prerequisites:** P13 (D5), P14 (D5), P15 (D5), P03 (TEXT), P08 (TEXT)
- **Scheduled in:** S5C

#### P31.0 DevOps (core scope)

*Scheduled:* CW088

Learn:

- `P31.0#1` Linux
- `P31.0#2` networking
- `P31.0#3` Git
- `P31.0#4` shell
- `P31.0#5` SSH
- `P31.0#6` processes
- `P31.0#7` logs
- `P31.0#8` containers
- `P31.0#9` CI/CD
- `P31.0#10` registries
- `P31.0#11` reverse proxies
- `P31.0#12` observability
- `P31.0#13` secrets
- `P31.0#14` deployment strategies

#### P31.1 Docker

*Scheduled:* CW088, CW089

Master:

- `P31.1#1` images
- `P31.1#2` containers
- `P31.1#3` Dockerfiles
- `P31.1#4` layers
- `P31.1#5` volumes
- `P31.1#6` networks
- `P31.1#7` Compose
- `P31.1#8` registries
- `P31.1#9` environment configuration

Reference:
https://docs.docker.com/get-started/

#### P31.2 CI/CD

*Scheduled:* CW090

Use GitHub Actions initially.

Build pipelines that:

1. `P31.2#1` install dependencies
2. `P31.2#2` run tests
3. `P31.2#3` lint
4. `P31.2#4` type-check
5. `P31.2#5` build
6. `P31.2#6` publish artifacts/images
7. `P31.2#7` deploy

Do not let CI become a ritual. Understand what each stage protects you from.

#### P31 resources

- *Concept coverage:* containers, Dockerfiles, Compose, registries, CI/CD, secrets, environment management, deployment workflows.
- `RES-P31-01` **CORE:** Docker Get Started — https://docs.docker.com/get-started/
- `RES-P31-02` **PRACTICE:** GitHub Actions — https://docs.github.com/en/actions
- `RES-P31-03` **REFERENCE:** Docker docs — https://docs.docker.com/
- `RES-P31-04` **DEEP:** Kubernetes and cloud architecture only after the fundamentals are real.
- `RES-P31-05` **IMPLEMENT:** containerise a project, test in CI, push an image, deploy it.

### P32 — Cloud

- **Priority:** 🟠 High · **Target:** 🟠 D2–D3
- **Prerequisites:** P31 (S101)
- **Scheduled in:** S5C

#### P32.0 Cloud (core scope)

*Scheduled:* CW093

Learn one provider deeply enough to deploy actual systems.

A reasonable first-provider strategy is AWS, but this is a recommendation, not a permanent requirement.

Learn cloud concepts:

- `P32.0#1` regions
- `P32.0#2` availability zones
- `P32.0#3` compute
- `P32.0#4` storage
- `P32.0#5` networking
- `P32.0#6` identity and access
- `P32.0#7` managed databases
- `P32.0#8` containers
- `P32.0#9` serverless
- `P32.0#10` load balancing
- `P32.0#11` DNS
- `P32.0#12` monitoring
- `P32.0#13` secrets
- `P32.0#14` cost management

Do not memorise service names without understanding the architecture behind them.

#### P32.1 Required cloud project

*Scheduled:* CW094

Deploy a real backend or ML inference service with:

- `P32.1#1` networking
- `P32.1#2` identity
- `P32.1#3` storage/database
- `P32.1#4` logs
- `P32.1#5` monitoring
- `P32.1#6` deployment automation

#### P32 resources

- *Concept coverage:* compute, networking, storage, IAM, managed databases, queues, serverless awareness, monitoring, cost.
- `RES-P32-01` **CORE:** AWS Skill Builder / cloud fundamentals — https://skillbuilder.aws/
- `RES-P32-02` **REFERENCE:** AWS documentation — https://docs.aws.amazon.com/
- `RES-P32-03` **ARCHITECTURE:** AWS Well-Architected Framework — https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html
- `RES-P32-04` **DEEP:** cloud architecture case studies and service-specific documentation.
- `RES-P32-05` **RULE:** learn one cloud deeply enough to deploy; understand the analogous concepts in others.

### P33 — Terraform / Infrastructure as Code

- **Priority:** 🟡🟠 Useful–High · **Target:** 🟡–🟠 D2–D3
- **Prerequisites:** P32 (TEXT)
- **Scheduled in:** S6B

#### P33.0 Terraform / Infrastructure as Code (core scope)

*Scheduled:* CW124

Learn:

- `P33.0#1` infrastructure as code
- `P33.0#2` configuration language
- `P33.0#3` providers
- `P33.0#4` resources
- `P33.0#5` variables
- `P33.0#6` outputs
- `P33.0#7` state
- `P33.0#8` plan
- `P33.0#9` apply
- `P33.0#10` modules
- `P33.0#11` environments
- `P33.0#12` secrets
- `P33.0#13` state security

Core workflow:

```text
Write
→ Plan
→ Apply
```

Terraform is designed to define, version, and manage infrastructure through declarative configuration and provider APIs. Reference:
https://developer.hashicorp.com/terraform/intro

Do not commit sensitive state or credentials.

#### P33 resources

- *Concept coverage:* providers, resources, variables, modules, state, plan/apply, remote state, drift, environment separation.
- `RES-P33-01` **CORE:** HashiCorp Terraform Tutorials — https://developer.hashicorp.com/terraform/tutorials
- `RES-P33-02` **REFERENCE:** Terraform docs — https://developer.hashicorp.com/terraform/docs
- `RES-P33-03` **DEEP:** Terraform internals and cloud-provider-specific patterns when required.
- `RES-P33-04` **IMPLEMENT:** provision the infrastructure for one portfolio system from code.
- `RES-P33-X1` **PHASE-TEXT:** Referenced in P33.0 Core scope — https://developer.hashicorp.com/terraform/intro

### P34 — Kubernetes

- **Priority:** 🟡 Useful · **Target:** 🟡 D2 initially, D3 later
- **Prerequisites:** P03 (TEXT), P05 (TEXT), P31 (TEXT), P32 (TEXT)
- **Unlock note:** Master rule: Kubernetes stays deferred until Linux, networking, containers, deployment, and debugging are comfortable.
- **Scheduled in:** S6B

#### P34.0 Kubernetes (core scope)

*Scheduled:* CW125, CW126

Prerequisites:

- `P34.0#1` Linux
- `P34.0#2` networking
- `P34.0#3` Docker
- `P34.0#4` cloud basics

Learn:

- `P34.0#5` cluster concepts
- `P34.0#6` control plane
- `P34.0#7` worker nodes
- `P34.0#8` Pods
- `P34.0#9` Deployments
- `P34.0#10` Services
- `P34.0#11` ConfigMaps
- `P34.0#12` Secrets
- `P34.0#13` Ingress
- `P34.0#14` Jobs
- `P34.0#15` health checks
- `P34.0#16` resource requests/limits
- `P34.0#17` autoscaling
- `P34.0#18` namespaces

Reference:
https://kubernetes.io/docs/concepts/

Understand the problem Kubernetes solves before memorising Kubernetes objects.

Do not learn Kubernetes merely because job descriptions contain the word.

#### P34 resources

- *Concept coverage:* pods, deployments, services, ingress, config, secrets, storage, scheduling, networking, observability, security.
- `RES-P34-01` **CORE:** Kubernetes Concepts and official tutorials — https://kubernetes.io/docs/concepts/
- `RES-P34-02` **PRACTICE:** Minikube/kind-based local cluster.
- `RES-P34-03` **REFERENCE:** Kubernetes docs — https://kubernetes.io/docs/home/
- `RES-P34-04` **DEEP:** Kubernetes architecture and scheduler/controller internals.
- `RES-P34-05` **RULE:** Kubernetes stays deferred until Linux, networking, containers, deployment, and debugging are comfortable.

### P35 — System Design

- **Priority:** 🔴 Critical · **Target:** 🔴 D3–D4
- **Prerequisites:** P05 (S101), P06 (TEXT), P08 (TEXT)
- **Scheduled in:** S5A, S7B

#### P35.0 System Design (core scope)

*Scheduled:* CW059

System-design progression:

```text
Single service
→ database
→ cache
→ queue
→ load balancer
→ replication
→ partitioning
→ scaling
→ distributed systems
→ reliability
→ observability
```

#### P35.1 Standard design process

*Scheduled:* CW059, CW162

1. `P35.1#1` Clarify requirements.
2. `P35.1#2` Separate functional and non-functional requirements.
3. `P35.1#3` Estimate scale.
4. `P35.1#4` Define API.
5. `P35.1#5` Define data model.
6. `P35.1#6` Draw high-level architecture.
7. `P35.1#7` Identify bottlenecks.
8. `P35.1#8` Discuss storage and caching.
9. `P35.1#9` Discuss failure modes.
10. `P35.1#10` Discuss scalability.
11. `P35.1#11` Discuss observability.
12. `P35.1#12` Explain trade-offs.

#### P35.2 Core concepts

*Scheduled:* CW059, CW061, CW162, CW163

- `P35.2#1` availability
- `P35.2#2` reliability
- `P35.2#3` latency
- `P35.2#4` throughput
- `P35.2#5` consistency
- `P35.2#6` durability
- `P35.2#7` idempotency
- `P35.2#8` retries
- `P35.2#9` timeouts
- `P35.2#10` backpressure
- `P35.2#11` caching
- `P35.2#12` queues
- `P35.2#13` replication
- `P35.2#14` partitioning
- `P35.2#15` sharding
- `P35.2#16` rate limiting
- `P35.2#17` load balancing
- `P35.2#18` CDN
- `P35.2#19` observability

#### P35.3 Systems to design

*Scheduled:* CW164, CW165

- `P35.3#1` URL shortener
- `P35.3#2` chat system
- `P35.3#3` notification system
- `P35.3#4` file storage service
- `P35.3#5` search system
- `P35.3#6` ride-sharing system
- `P35.3#7` recommendation platform
- `P35.3#8` fraud-detection platform
- `P35.3#9` ML serving platform
- `P35.3#10` RAG service

#### P35 resources

- *Concept coverage:* requirements, capacity, data flow, APIs, storage, caching, queues, consistency, partitioning, reliability, tradeoffs, diagrams.
- `RES-P35-01` **CORE:** Designing Data-Intensive Applications — https://dataintensive.net/
- `RES-P35-02` **PRACTICE:** System Design Primer — https://github.com/donnemartin/system-design-primer
- `RES-P35-03` **REFERENCE:** AWS Well-Architected Framework — https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html
- `RES-P35-04` **DEEP:** system-specific architecture papers and postmortems.
- `RES-P35-05` **IMPLEMENT:** design the architecture of your own projects before scaling them.

### P36 — Distributed Systems

- **Priority:** 🟠 High · **Target:** 🟠 D3
- **Prerequisites:** P35 (S101), P05 (TEXT)
- **Scheduled in:** S7B

#### P36.0 Distributed Systems (core scope)

*Scheduled:* CW166, CW167, CW168

Learn:

- `P36.0#1` distributed-system characteristics
- `P36.0#2` failure is normal
- `P36.0#3` network partitions
- `P36.0#4` replication
- `P36.0#5` leader/follower
- `P36.0#6` consistency models
- `P36.0#7` eventual consistency
- `P36.0#8` quorum concepts
- `P36.0#9` partitioning
- `P36.0#10` idempotency
- `P36.0#11` retries
- `P36.0#12` duplicate delivery
- `P36.0#13` ordering
- `P36.0#14` backpressure
- `P36.0#15` fault tolerance

Advanced awareness:

- `P36.0#16` consensus
- `P36.0#17` Raft
- `P36.0#18` distributed transactions
- `P36.0#19` exactly-once vs at-least-once
- `P36.0#20` event sourcing

Do not begin with advanced consensus before understanding basic distributed-system failure modes.

#### P36 resources

- *Concept coverage:* RPC, failure, time, replication, consensus, consistency, partitioning, sharding, distributed transactions, fault tolerance.
- `RES-P36-01` **CORE:** MIT 6.5840 Distributed Systems — https://pdos.csail.mit.edu/6.824/
- `RES-P36-02` **PRACTICE:** labs and paper questions where prerequisites permit.
- `RES-P36-03` **REFERENCE:** Raft resources — https://raft.github.io/
- `RES-P36-04` **DEEP:** Distributed Systems, Tanenbaum/van Steen or equivalent; original papers.
- `RES-P36-05` **IMPLEMENT:** replicated key-value store or selected distributed-systems lab.

### P37 — ML System Design

- **Priority:** 🔴 Critical · **Target:** 🔴 D3–D4
- **Prerequisites:** P35 (S101), P28 (S101), P29 (S101), P30 (S101), P18 (TEXT), P24 (TEXT)
- **Scheduled in:** S7B

#### P37.0 ML System Design (core scope)

*Scheduled:* CW169

This is where your software + ML combination becomes especially valuable.

#### P37.1 Recommendation system

*Scheduled:* CW169

```text
User events
→ event pipeline
→ feature generation
→ candidate generation
→ ranking
→ serving
→ feedback
```

Questions:

- `P37.1#1` What is computed offline?
- `P37.1#2` What is online?
- `P37.1#3` How fresh must data be?
- `P37.1#4` What is the latency budget?
- `P37.1#5` How do you evaluate ranking?
- `P37.1#6` How do you handle cold-start users?

#### P37.2 Fraud detection

*Scheduled:* CW169

```text
Transaction
→ ingestion
→ feature computation
→ model
→ risk score
→ policy/decision
→ logging
→ monitoring
```

Questions:

- `P37.2#1` latency
- `P37.2#2` false positives
- `P37.2#3` false negatives
- `P37.2#4` concept drift
- `P37.2#5` feedback delay
- `P37.2#6` adversarial behaviour

#### P37.3 Search

*Scheduled:* CW170

```text
Documents
→ indexing
→ query
→ retrieval
→ ranking
→ results
```

#### P37.4 Model-serving platform

*Scheduled:* CW170

```text
Client
→ gateway
→ routing
→ inference service
→ model
→ result
→ telemetry
```

#### P37.5 RAG system

*Scheduled:* CW170

```text
Documents
→ ingestion
→ indexing
→ retrieval
→ reranking
→ generation
→ evaluation
```

#### P37 resources

- *Concept coverage:* data pipelines, feature generation, training/serving split, batch/online inference, experimentation, monitoring, privacy, reliability.
- `RES-P37-01` **CORE:** Stanford CS329S Machine Learning Systems Design — https://web.stanford.edu/class/cs329s/
- `RES-P37-02` **DEEP:** Designing Machine Learning Systems, Chip Huyen — https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/
- `RES-P37-03` **REFERENCE:** cloud and serving documentation for the deployed architecture.
- `RES-P37-04` **IMPLEMENT:** design and defend a complete ML system from product requirement to monitoring.

### P38 — Observability

- **Priority:** 🟠 High · **Target:** 🟠 D3
- **Prerequisites:** P31 (TEXT), P29 (TEXT)
- **Scheduled in:** S6B

#### P38.0 Observability (core scope)

*Scheduled:* CW122

Learn the distinction between:

- `P38.0#1` logs
- `P38.0#2` metrics
- `P38.0#3` traces

#### P38.1 Metrics

*Scheduled:* CW122

Monitor:

- `P38.1#1` request count
- `P38.1#2` error rate
- `P38.1#3` latency
- `P38.1#4` throughput
- `P38.1#5` CPU
- `P38.1#6` memory
- `P38.1#7` model latency
- `P38.1#8` prediction distribution
- `P38.1#9` data freshness
- `P38.1#10` drift

#### P38.2 Logging

*Scheduled:* CW123

Logs should help answer:

- `P38.2#1` what happened?
- `P38.2#2` when?
- `P38.2#3` where?
- `P38.2#4` with what request/model version?

Do not log secrets or sensitive data carelessly.

#### P38.3 Tracing

*Scheduled:* CW123

Understand:

- `P38.3#1` request path
- `P38.3#2` service boundaries
- `P38.3#3` dependency latency
- `P38.3#4` bottleneck location

#### P38 resources

- *Concept coverage:* metrics, logs, traces, instrumentation, SLOs, alerting, debugging production behavior.
- `RES-P38-01` **CORE:** OpenTelemetry docs — https://opentelemetry.io/docs/
- `RES-P38-02` **REFERENCE:** Prometheus docs — https://prometheus.io/docs/
- `RES-P38-03` **REFERENCE:** Grafana docs — https://grafana.com/docs/
- `RES-P38-04` **DEEP:** Site Reliability Engineering — https://sre.google/sre-book/table-of-contents/
- `RES-P38-05` **IMPLEMENT:** instrument one service and trace a request across components.

### P39 — Security

- **Priority:** 🔴 Critical · **Target:** 🔴 D3
- **Prerequisites:** P08 (TEXT)
- **Scheduled in:** S5A, S7A

#### P39.0 Security (core scope)

*Scheduled:* CW057

Security is not a separate department in your mental model.

#### P39.1 General

*Scheduled:* CW057

Learn:

- `P39.1#1` authentication
- `P39.1#2` authorisation
- `P39.1#3` password hashing
- `P39.1#4` encryption concepts
- `P39.1#5` TLS
- `P39.1#6` secrets
- `P39.1#7` least privilege
- `P39.1#8` dependency security
- `P39.1#9` secure API design
- `P39.1#10` input validation
- `P39.1#11` threat modelling

#### P39.2 Common web risks

*Scheduled:* CW058

Understand:

- `P39.2#1` SQL injection
- `P39.2#2` XSS
- `P39.2#3` CSRF
- `P39.2#4` SSRF
- `P39.2#5` insecure direct object references
- `P39.2#6` broken access control
- `P39.2#7` credential leakage
- `P39.2#8` insecure dependencies

#### P39.3 AI security

*Scheduled:* CW154

Learn:

- `P39.3#1` prompt injection
- `P39.3#2` indirect prompt injection
- `P39.3#3` data exfiltration
- `P39.3#4` tool misuse
- `P39.3#5` retrieval poisoning
- `P39.3#6` malicious documents
- `P39.3#7` agent privilege escalation
- `P39.3#8` evaluation manipulation
- `P39.3#9` model abuse

#### P39 resources

- *Concept coverage:* authentication, authorisation, input validation, secrets, injection, SSRF, XSS, CSRF, supply chain, threat modelling, AI-specific attacks.
- `RES-P39-01` **CORE:** PortSwigger Web Security Academy — https://portswigger.net/web-security
- `RES-P39-02` **REFERENCE:** OWASP Top 10 — https://owasp.org/www-project-top-ten/
- `RES-P39-03` **AI SECURITY REFERENCE:** OWASP GenAI Security Project — https://genai.owasp.org/
- `RES-P39-04` **STANDARDS:** NIST AI RMF — https://www.nist.gov/itl/ai-risk-management-framework
- `RES-P39-05` **DEEP:** threat-modeling literature and security advisories for the systems actually deployed.

### P40 — Research Skills

- **Priority:** 🟠 High · **Target:** 🟠 D3 → D5 if specialization demands it
- **Prerequisites:** C5 (GATE)
- **Master GATE:** light paper reading may happen earlier, but the full research phase is unlocked after Checkpoint 5 and ideally Checkpoint 6. It must not compete with the foundational sequence.
- **Scheduled in:** S8

#### P40.1 Reading papers

*Scheduled:* CW178

For every paper ask:

1. `P40.1#1` What problem?
2. `P40.1#2` Why is it difficult?
3. `P40.1#3` What existed before?
4. `P40.1#4` What is novel?
5. `P40.1#5` What assumptions are being made?
6. `P40.1#6` What data is used?
7. `P40.1#7` What is the baseline?
8. `P40.1#8` What metric is used?
9. `P40.1#9` What experiments support the claim?
10. `P40.1#10` What are the limitations?

#### P40.2 Reproduction ladder

*Scheduled:* CW179

```text
Read
→ understand
→ implement
→ reproduce
→ validate
→ modify
→ ablate
→ benchmark
→ hypothesize
→ experiment
→ write
```

#### P40.3 Experimental discipline

*Scheduled:* CW180

Track:

- `P40.3#1` dataset version
- `P40.3#2` code version
- `P40.3#3` hyperparameters
- `P40.3#4` seeds
- `P40.3#5` hardware
- `P40.3#6` runtime
- `P40.3#7` metrics
- `P40.3#8` baselines
- `P40.3#9` experiment notes

#### P40.4 Research writing

*Scheduled:* CW181

Learn to structure:

- `P40.4#1` problem
- `P40.4#2` related work
- `P40.4#3` method
- `P40.4#4` experimental setup
- `P40.4#5` results
- `P40.4#6` ablation
- `P40.4#7` limitations
- `P40.4#8` conclusion

Potential goal:

Produce at least one research-quality reproduction before attempting original work.

#### P40 resources

- *Concept coverage:* reading papers, literature review, hypothesis, experiment design, reproduction, ablation, benchmarking, scientific writing.
- `RES-P40-01` **CORE:** papers from NeurIPS, ICML, ICLR, ACL, CVPR, MLSys, etc.
- `RES-P40-02` **DISCOVERY:** arXiv — https://arxiv.org/
- `RES-P40-03` **SUPPLEMENT:** Papers with Code / benchmark repositories where still relevant. — https://paperswithcode.com/
- `RES-P40-04` **DEEP:** original papers, official code repositories, supplementary material.
- `RES-P40-05` **IMPLEMENT:** reproduce one paper before attempting original research.

### P41 — Reinforcement Learning

- **Priority:** 🟢 Optional · **Target:** 🟢 D2 initially
- **Prerequisites:** C5 (GATE)
- **Master GATE:** optional branch. Do not enter before strong foundations and Checkpoint 5 unless a specific project or research direction requires it.
- **Scheduled in:** optional branch (after C5)

#### P41.0 Reinforcement Learning (core scope)

*Scheduled:* on demand

Learn only after strong foundations unless your specialization requires it.

Topics:

- `P41.0#1` Markov Decision Processes
- `P41.0#2` states
- `P41.0#3` actions
- `P41.0#4` rewards
- `P41.0#5` policies
- `P41.0#6` value functions
- `P41.0#7` Q-learning
- `P41.0#8` policy gradients
- `P41.0#9` actor-critic
- `P41.0#10` deep RL awareness

Potential project:

- `P41.0#11` simple grid-world agent

Do not let RL displace core software, ML, statistics, systems, or DSA work unless it becomes strategically relevant.

#### P41 resources

- *Concept coverage:* MDPs, value functions, Bellman equations, dynamic programming, Monte Carlo, TD learning, Q-learning, policy gradients, actor-critic awareness.
- `RES-P41-01` **CORE:** Reinforcement Learning: An Introduction, Sutton and Barto — http://incompleteideas.net/book/the-book-2nd.html
- `RES-P41-02` **SUPPLEMENT:** David Silver reinforcement learning lectures — https://www.davidsilver.uk/teaching/
- `RES-P41-03` **REFERENCE:** Gymnasium docs when implementing environments — https://gymnasium.farama.org/
- `RES-P41-04` **DEEP:** current RL papers once mathematics and deep learning foundations are strong.

### P42 — Advanced ML System Topics

- **Priority:** 🟠🔴 High–Critical · **Target:** 🟠–🔴 D3–D4
- **Prerequisites:** C5 (GATE), P29 (GATE)
- **Master GATE:** unlocked after Checkpoint 5 and meaningful model-serving experience.
- **Scheduled in:** S7B

#### P42.0 Advanced ML System Topics (core scope)

*Scheduled:* CW171

Study when the foundations are mature.

#### P42.1 Feature stores

*Scheduled:* CW171

Understand:

- `P42.1#1` offline features
- `P42.1#2` online features
- `P42.1#3` point-in-time correctness
- `P42.1#4` feature freshness
- `P42.1#5` serving requirements

#### P42.2 Distributed training

*Scheduled:* CW172

Understand conceptually:

- `P42.2#1` data parallelism
- `P42.2#2` model parallelism
- `P42.2#3` distributed optimisation
- `P42.2#4` communication overhead
- `P42.2#5` checkpointing

#### P42.3 Model optimisation

*Scheduled:* CW173

Learn:

- `P42.3#1` quantisation
- `P42.3#2` pruning awareness
- `P42.3#3` distillation
- `P42.3#4` batching
- `P42.3#5` caching
- `P42.3#6` compilation awareness

#### P42.4 High-scale inference

*Scheduled:* CW174

Reason about:

- `P42.4#1` throughput
- `P42.4#2` latency
- `P42.4#3` batching
- `P42.4#4` memory
- `P42.4#5` model size
- `P42.4#6` routing
- `P42.4#7` replicas
- `P42.4#8` autoscaling

#### P42 resources

- *Concept coverage:* feature stores, distributed training, model parallelism, inference optimisation, batching, accelerator utilisation.
- `RES-P42-01` **CORE:** PyTorch Distributed documentation — https://docs.pytorch.org/docs/stable/distributed.html
- `RES-P42-02` **REFERENCE:** Ray docs — https://docs.ray.io/
- `RES-P42-03` **REFERENCE:** DeepSpeed docs — https://www.deepspeed.ai/
- `RES-P42-04` **REFERENCE:** vLLM docs — https://docs.vllm.ai/
- `RES-P42-05` **DEEP:** systems papers, benchmark reports, accelerator architecture material.

### P43 — Data / ML Infrastructure

- **Priority:** 🟡🟠 Useful–High · **Target:** 🟡–🟠 D2–D3
- **Prerequisites:** P12 (GATE), P08 (GATE), P31 (GATE), P28 (GATE)
- **Master GATE:** learn on demand after the underlying data, backend, deployment, and ML lifecycle concepts are working.
- **Scheduled in:** on demand

#### P43.0 Data / ML Infrastructure (core scope)

*Scheduled:* on demand

Possible technologies:

- `P43.0#1` Airflow
- `P43.0#2` Spark
- `P43.0#3` Kafka
- `P43.0#4` data warehouses
- `P43.0#5` feature stores
- `P43.0#6` model registries

Do not collect technologies.

Learn them through real problems:

**Kafka**

Learn when events must be streamed reliably.

**Spark**

Learn when distributed batch computation becomes necessary.

**Airflow**

Learn when scheduled workflows need orchestration.

**Feature store**

Learn when feature consistency and serving become hard enough to require one.

#### P43 resources

- *Concept coverage:* Kafka, Spark, Airflow, feature stores, distributed ETL, online/offline feature serving.
- `RES-P43-01` **CORE:** Data Engineering Zoomcamp — https://datatalks.club/blog/data-engineering-zoomcamp.html
- `RES-P43-02` **REFERENCE:** Kafka — https://kafka.apache.org/documentation/
- `RES-P43-03` **REFERENCE:** Spark — https://spark.apache.org/documentation/
- `RES-P43-04` **REFERENCE:** Airflow — https://airflow.apache.org/docs/
- `RES-P43-05` **REFERENCE:** Feast — https://docs.feast.dev/
- `RES-P43-06` **IMPLEMENT:** streaming pipeline + batch pipeline + feature serving comparison.

### P44 — AI Engineering as a Systems Discipline

- **Priority:** 🔴 Critical · **Target:** 🔴 D3–D4
- **Prerequisites:** P07 (GATE), P08 (GATE), P27 (GATE), P29 (GATE)
- **Master GATE:** unlocked after core software engineering, backend, model, evaluation, and deployment competencies are established.
- **Scheduled in:** S7A

#### P44.0 AI Engineering as a Systems Discipline (core scope)

*Scheduled:* CW155

Modern AI engineering should combine:

- `P44.0#1` model understanding
- `P44.0#2` software engineering
- `P44.0#3` retrieval
- `P44.0#4` APIs
- `P44.0#5` data pipelines
- `P44.0#6` evaluation
- `P44.0#7` observability
- `P44.0#8` security
- `P44.0#9` cost management

A production AI system is not merely a prompt.

Think:

```text
User
↓
API
↓
Auth
↓
Application logic
↓
Retrieval / tools
↓
Model
↓
Validation
↓
Response
↓
Evaluation / telemetry
```

Every layer can fail.

#### P44 resources

- *Concept coverage:* model choice, prompting, structured outputs, tool use, RAG, agents, serving, evaluation, reliability, security, cost, observability.
- `RES-P44-01` **CORE:** Full Stack Deep Learning — https://fullstackdeeplearning.com/
- `RES-P44-02` **ECOSYSTEM REFERENCE:** Hugging Face docs/course — https://huggingface.co/docs
- `RES-P44-03` **IMPLEMENTATION REFERENCE:** provider/model/framework docs specific to the current architecture.
- `RES-P44-04` **DEEP:** production case studies, evaluation papers, serving-system documentation.
- `RES-P44-05` **RULE:** architecture and evaluation outrank prompt cleverness.

### P45 — Cost Engineering

- **Priority:** 🟡🟠 Useful–High · **Target:** 🟡–🟠 D2–D3
- **Prerequisites:** P32 (GATE), P29 (GATE)
- **Master GATE:** learn through real deployed systems rather than as an early standalone subject.
- **Scheduled in:** S6B

#### P45.0 Cost Engineering (core scope)

*Scheduled:* CW133, CW134

Learn to reason about:

- `P45.0#1` compute cost
- `P45.0#2` storage cost
- `P45.0#3` network cost
- `P45.0#4` model inference cost
- `P45.0#5` training cost
- `P45.0#6` database cost
- `P45.0#7` cache cost
- `P45.0#8` operational complexity

For AI:

- `P45.0#9` tokens
- `P45.0#10` context length
- `P45.0#11` model size
- `P45.0#12` batching
- `P45.0#13` caching
- `P45.0#14` model routing
- `P45.0#15` model quality vs cost

A technically elegant system that costs ten times more than necessary is not automatically a better engineering solution.

#### P45 resources

- *Concept coverage:* unit economics, token/GPU/CPU costs, storage, network costs, caching, batching, model choice, capacity planning.
- `RES-P45-01` **CORE:** cloud provider pricing documentation (start with AWS) — https://aws.amazon.com/pricing/
- `RES-P45-02` **ARCHITECTURE:** AWS Well-Architected cost optimisation pillar — https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/
- `RES-P45-03` **DEEP:** FinOps Foundation — https://www.finops.org/framework/
- `RES-P45-04` **IMPLEMENT:** add cost estimates and a cost-per-request measure to a deployed system.

### P46 — Product Thinking for Engineers

- **Priority:** 🟡 Useful · **Target:** 🟡 D2–D3
- **Prerequisites:** none
- **Master GATE:** awareness can begin early; detailed product engineering belongs alongside real projects and internships.
- **Scheduled in:** continuous (awareness from S4; detailed in PR07, PR11)

#### P46.0 Product Thinking for Engineers (core scope)

*Scheduled:* on demand

Learn to connect technical decisions to user needs.

Understand:

- `P46.0#1` requirements
- `P46.0#2` constraints
- `P46.0#3` user journeys
- `P46.0#4` success metrics
- `P46.0#5` trade-offs
- `P46.0#6` MVP thinking
- `P46.0#7` failure cost
- `P46.0#8` operational requirements

Before building ML ask:

- `P46.0#9` Can a rule solve this?
- `P46.0#10` Can search solve this?
- `P46.0#11` Is the data sufficient?
- `P46.0#12` What happens if the model is wrong?
- `P46.0#13` Who uses the result?

#### P46 resources

- *Concept coverage:* user problem, requirements, tradeoffs, metrics, MVP thinking, iteration, feedback, technical prioritisation.
- `RES-P46-01` **CORE:** product discovery through real project users and stakeholders.
- `RES-P46-02` **SUPPLEMENT:** Inspired, The Mom Test, and strong product requirement examples.
- `RES-P46-03` **REFERENCE:** your project's issue tracker, design docs, analytics, user interviews.
- `RES-P46-04` **IMPLEMENT:** write a one-page problem statement, success metric, constraints, and feedback plan before a significant build.

## 9. Resource registry

Single source for every URL. Weeks and phases reference `RES-`/`TOOL-` IDs. Links were checked by the master against public pages on 2026-09-17; fast-moving ecosystems are rechecked when the phase activates.

### 9.1 Global navigation

- `RES-G01` **roadmap.sh - map of the ecosystem** (CORE / NAVIGATION) — https://roadmap.sh/. Use role roadmaps for external cross-checking and discovery. Do not use roadmap.sh as the sole curriculum because its job is to map roles and technologies, not to teach every concept to the depth required here.
- `RES-G02` **MIT OpenCourseWare** (CORE / UNIVERSITY LIBRARY) — https://ocw.mit.edu/
- `RES-G03` **Harvard CS50 family** (CORE / BEGINNER CS SUPPORT) — https://cs50.harvard.edu/
- `RES-G04` **The Odin Project** (OPTIONAL / WEB ENGINEERING) — https://www.theodinproject.com/
- `RES-G05` **freeCodeCamp** (OPTIONAL / PRACTICE + WEB + PYTHON SUPPORT) — https://www.freecodecamp.org/learn/
- `RES-G06` **Coursera** (OPTIONAL / STRUCTURED SPECIALISATIONS) — https://www.coursera.org/. Use it when a specific course is genuinely better suited to a gap or when a credential itself has a concrete reason to exist. Do not turn the roadmap into certificate collection.

### 9.2 Phase resources

| ID | Scope | Label | Resource | URL |
|---|---|---|---|---|
| `RES-P01-01` | P01 | CORE | Harvard CS50P | https://cs50.harvard.edu/python/ |
| `RES-P01-02` | P01 | PRACTICE | Exercism Python | https://exercism.org/tracks/python |
| `RES-P01-03` | P01 | REFERENCE | Python documentation | https://docs.python.org/3/ |
| `RES-P01-04` | P01 | DEEP | Python language reference and later CPython implementation reading | https://docs.python.org/3/reference/ |
| `RES-P01-05` | P01 | IMPLEMENT | command-line utilities, text/file processors, small automation scripts. | — |
| `RES-P02-01` | P02 | CORE | Pro Git | https://git-scm.com/book/en/v2 |
| `RES-P02-02` | P02 | PRACTICE | GitHub Skills | https://skills.github.com/ |
| `RES-P02-03` | P02 | REFERENCE | Git documentation | https://git-scm.com/docs |
| `RES-P02-04` | P02 | DEEP | Git internals/reference | https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain |
| `RES-P02-05` | P02 | IMPLEMENT | use Git on every roadmap project; recover from a deliberately created merge conflict. | — |
| `RES-P03-01` | P03 | CORE | MIT Missing Semester | https://missing.csail.mit.edu/ |
| `RES-P03-02` | P03 | PRACTICE | shell tasks in your own projects and Linux command exercises. | — |
| `RES-P03-03` | P03 | REFERENCE | `man` pages and GNU/Linux documentation. | — |
| `RES-P03-04` | P03 | DEEP | The Linux Programming Interface, then kernel documentation when needed. | — |
| `RES-P03-05` | P03 | IMPLEMENT | shell automation, log filtering, process inspection, SSH into a remote host. | — |
| `RES-P04-01` | P04 | CORE | MIT 6.006 Introduction to Algorithms | https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/ |
| `RES-P04-02` | P04 | PRACTICE | NeetCode | https://neetcode.io/ |
| `RES-P04-03` | P04 | INTERVIEW | LeetCode | https://leetcode.com/ |
| `RES-P04-04` | P04 | DEEP | Introduction to Algorithms, Cormen et al.; MIT 6.006 notes/problem sets remain the working spine. | — |
| `RES-P04-05` | P04 | IMPLEMENT | implement core structures and selected algorithms yourself before using standard-library versions. | — |
| `RES-P05-01` | P05 / Operating Systems | CORE | MIT 6.1810 Operating System Engineering | https://pdos.csail.mit.edu/6.S081/2026/ |
| `RES-P05-02` | P05 / Operating Systems | PRACTICE | xv6 labs/homework. | — |
| `RES-P05-03` | P05 / Operating Systems | REFERENCE | xv6 book and course notes. | — |
| `RES-P05-04` | P05 / Operating Systems | DEEP | Operating Systems: Three Easy Pieces | https://pages.cs.wisc.edu/~remzi/OSTEP/ |
| `RES-P05-05` | P05 / Networking | CORE | Stanford CS144 Computer Networking | https://cs144.github.io/ |
| `RES-P05-06` | P05 / Networking | PRACTICE | networking labs, packet inspection, sockets. | — |
| `RES-P05-07` | P05 / Networking | REFERENCE | MDN HTTP documentation | https://developer.mozilla.org/en-US/docs/Web/HTTP |
| `RES-P05-08` | P05 / Networking | DEEP | Computer Networking: A Top-Down Approach; RFCs for exact protocol behavior. | — |
| `RES-P05-09` | P05 / Computer Architecture | CORE | UC Berkeley CS61C | https://cs61c.org/ |
| `RES-P05-10` | P05 / Computer Architecture | PRACTICE | architecture exercises and low-level programming. | — |
| `RES-P05-11` | P05 / Computer Architecture | REFERENCE | course notes | https://notes.cs61c.org/ |
| `RES-P05-12` | P05 / Computer Architecture | DEEP | Computer Organization and Design / Computer Architecture: A Quantitative Approach. | — |
| `RES-P05-13` | P05 / Compilers / Runtimes | CORE | Crafting Interpreters | https://craftinginterpreters.com/ |
| `RES-P05-14` | P05 / Compilers / Runtimes | PRACTICE | build a small interpreter. | — |
| `RES-P05-15` | P05 / Compilers / Runtimes | REFERENCE | language specifications and runtime docs once relevant. | — |
| `RES-P05-16` | P05 / Compilers / Runtimes | DEEP | Engineering a Compiler; LLVM documentation. | — |
| `RES-P06-01` | P06 | CORE | CMU 15-445/645 Intro to Database Systems | https://15445.courses.cs.cmu.edu/fall2026/ |
| `RES-P06-02` | P06 | BEGINNER PRACTICE | SQLBolt | https://sqlbolt.com/ |
| `RES-P06-03` | P06 | REFERENCE | PostgreSQL docs | https://www.postgresql.org/docs/current/ |
| `RES-P06-04` | P06 | DEEP | Database Internals; CMU lecture material and labs. | — |
| `RES-P06-05` | P06 | IMPLEMENT | build a database-backed application; inspect `EXPLAIN`; benchmark an index/no-index query. | — |
| `RES-P06-06` | P06 / Redis | REFERENCE | Redis docs | https://redis.io/docs/latest/ |
| `RES-P06-07` | P06 / Redis | IMPLEMENT | caching, rate limiting, session data, queues where justified. | — |
| `RES-P06-08` | P06 / NoSQL | REFERENCE | MongoDB docs for document databases | https://www.mongodb.com/docs/ |
| `RES-P06-09` | P06 / NoSQL | DEEP | Database Internals and distributed database literature. | — |
| `RES-P06-10` | P06 / NoSQL | RULE | learn data-model tradeoffs before collecting databases by name. | — |
| `RES-P07-01` | P07 | CORE | Google Engineering Practices | https://google.github.io/eng-practices/ |
| `RES-P07-02` | P07 | PRACTICE | refactor your own projects; write tests before/after changes. | — |
| `RES-P07-03` | P07 | REFERENCE | language/tool documentation and Python Packaging User Guide | https://packaging.python.org/en/latest/ |
| `RES-P07-04` | P07 | TESTING REFERENCE | pytest | https://docs.pytest.org/en/stable/ |
| `RES-P07-05` | P07 | DEEP | Refactoring, Martin Fowler; Software Engineering at Google. | — |
| `RES-P07-06` | P07 | IMPLEMENT | every serious project gets tests, logging, documentation, dependency pinning, and a repeatable setup. | — |
| `RES-P07-07` | P07 / Java | CORE/reference | dev.java Learn Java | https://dev.java/learn/ |
| `RES-P07-08` | P07 / Java | PRACTICE | university Java work and small independent Java programs. | — |
| `RES-P07-09` | P07 / Java | TESTING | JUnit 5 user guide | https://junit.org/junit5/docs/current/user-guide/ |
| `RES-P07-10` | P07 / JavaScript / TypeScript | CORE | The Odin Project Full Stack JavaScript path | https://www.theodinproject.com/paths/2 |
| `RES-P07-11` | P07 / JavaScript / TypeScript | REFERENCE | MDN JavaScript Guide | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide |
| `RES-P07-12` | P07 / JavaScript / TypeScript | TYPE SYSTEM | TypeScript Handbook | https://www.typescriptlang.org/docs/handbook/ |
| `RES-P07-13` | P07 / JavaScript / TypeScript | IMPLEMENT | browser application, then Node.js service where useful. | — |
| `RES-P08-01` | P08 | CORE | FastAPI Tutorial | https://fastapi.tiangolo.com/tutorial/ |
| `RES-P08-02` | P08 | REFERENCE | MDN HTTP | https://developer.mozilla.org/en-US/docs/Web/HTTP |
| `RES-P08-03` | P08 | SECURITY | OWASP Web Security Testing Guide / PortSwigger Academy | https://portswigger.net/web-security |
| `RES-P08-04` | P08 | DEEP | API Design Patterns; HTTP/RFC references. | — |
| `RES-P08-05` | P08 | IMPLEMENT | CRUD API → authenticated API → URL shortener → real-time backend. | — |
| `RES-P08-06` | P08 / Optional Java backend lane | REFERENCE/IMPLEMENT | Spring Boot | https://spring.io/projects/spring-boot |
| `RES-P09-01` | P09 | CORE | Software Architecture in Practice / Martin Fowler architecture articles | https://martinfowler.com/architecture/ |
| `RES-P09-02` | P09 | REFERENCE | AWS Well-Architected Framework | https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html |
| `RES-P09-03` | P09 | DEEP | Designing Data-Intensive Applications | https://dataintensive.net/ |
| `RES-P09-04` | P09 | IMPLEMENT | refactor a monolith from script → modules → layered design; split services only when a real boundary appears. | — |
| `RES-P10-01` | P10 / Linear Algebra | CORE | MIT 18.06 / 18.06SC | https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/ |
| `RES-P10-02` | P10 / Linear Algebra | PRACTICE | problem sets + hand derivations + NumPy. | — |
| `RES-P10-03` | P10 / Linear Algebra | REFERENCE | MIT notes and linear algebra reference material. | — |
| `RES-P10-04` | P10 / Linear Algebra | DEEP | Linear Algebra Done Right or equivalent rigorous text when research depth demands it. | — |
| `RES-P10-05` | P10 / Calculus | CORE | MIT 18.01SC Single Variable Calculus | https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/ |
| `RES-P10-06` | P10 / Calculus | SUPPLEMENT | MIT 18.02 / multivariable calculus material when gradients/Jacobians become active. | — |
| `RES-P10-07` | P10 / Calculus | DEEP | Stewart or a rigorous alternative if needed for formal depth. | — |
| `RES-P10-08` | P10 / Probability | CORE | MIT probabilistic systems material | https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/ |
| `RES-P10-09` | P10 / Probability | PRACTICE | problem sets, simulations, Monte Carlo experiments. | — |
| `RES-P10-10` | P10 / Probability | DEEP | Introduction to Probability, Blitzstein and Hwang. | — |
| `RES-P10-11` | P10 / Statistics | CORE | OpenIntro Statistics | https://www.openintro.org/book/os/ |
| `RES-P10-12` | P10 / Statistics | SUPPLEMENT | An Introduction to Statistical Learning | https://www.statlearning.com/ |
| `RES-P10-13` | P10 / Statistics | REFERENCE | statistical software documentation and formal statistical texts as needed. | — |
| `RES-P10-14` | P10 / Optimisation | CORE | selected MIT/Stanford optimisation material tied directly to ML. | — |
| `RES-P10-15` | P10 / Optimisation | REFERENCE | PyTorch optimisation documentation and algorithm references. | — |
| `RES-P10-16` | P10 / Optimisation | DEEP | Convex Optimization by Boyd and Vandenberghe when the target work requires formal convex analysis. | — |
| `RES-P11-01` | P11 | CORE | Kaggle Learn for short guided practice | https://www.kaggle.com/learn |
| `RES-P11-02` | P11 | REFERENCE | NumPy docs | https://numpy.org/doc/ |
| `RES-P11-03` | P11 | REFERENCE | Pandas docs | https://pandas.pydata.org/docs/ |
| `RES-P11-04` | P11 | REFERENCE | Matplotlib docs | https://matplotlib.org/stable/ |
| `RES-P11-05` | P11 | PRACTICE | real datasets, university datasets, analysis writeups. | — |
| `RES-P11-06` | P11 | DEEP | Practical Statistics for Data Scientists and your statistics coursework. | — |
| `RES-P12-01` | P12 | CORE | Data Engineering Zoomcamp | https://datatalks.club/blog/data-engineering-zoomcamp.html |
| `RES-P12-02` | P12 | REFERENCE | Apache Airflow docs | https://airflow.apache.org/docs/ |
| `RES-P12-03` | P12 | REFERENCE | Apache Spark docs | https://spark.apache.org/documentation/ |
| `RES-P12-04` | P12 | REFERENCE | Apache Kafka docs | https://kafka.apache.org/documentation/ |
| `RES-P12-05` | P12 | OPTIONAL | dbt docs for analytics engineering | https://docs.getdbt.com/ |
| `RES-P12-06` | P12 | IMPLEMENT | raw source → validation → transformation → PostgreSQL → analytics query → report, then schedule and log it. | — |
| `RES-P13-01` | P13 | CORE | An Introduction to Statistical Learning | https://www.statlearning.com/ |
| `RES-P13-02` | P13 | PRACTICE / REFERENCE | scikit-learn User Guide | https://scikit-learn.org/stable/user_guide.html |
| `RES-P13-03` | P13 | DEEP | Stanford CS229 | https://cs229.stanford.edu/ |
| `RES-P13-04` | P13 | IMPLEMENT | baseline → feature engineering → model comparison → evaluation report. | — |
| `RES-P14-01` | P14 | CORE | Stanford CS229 lectures/notes | https://cs229.stanford.edu/ |
| `RES-P14-02` | P14 | REFERENCE | scikit-learn User Guide | https://scikit-learn.org/stable/user_guide.html |
| `RES-P14-03` | P14 | DEEP | The Elements of Statistical Learning | https://hastie.su.domains/ElemStatLearn/ |
| `RES-P14-04` | P14 | IMPLEMENT | deliberately create leakage, imbalance, and overfitting failures and diagnose them. | — |
| `RES-P15-01` | P15 | CORE | ISLR + CS229 statistical learning material. | — |
| `RES-P15-02` | P15 | REFERENCE | scikit-learn metrics/model_selection docs | https://scikit-learn.org/stable/modules/classes.html |
| `RES-P15-03` | P15 | DEEP | statistical decision theory and experiment design when research work demands it. | — |
| `RES-P15-04` | P15 | IMPLEMENT | write an evaluation plan before training; justify the metric using the error costs. | — |
| `RES-P16-01` | P16 | CORE | CS229 notes + your mathematics notes. | — |
| `RES-P16-02` | P16 | PRACTICE | NumPy-only implementations. | — |
| `RES-P16-03` | P16 | REFERENCE | NumPy docs | https://numpy.org/doc/ |
| `RES-P16-04` | P16 | DEEP | numerical optimisation and linear algebra references as gaps appear. | — |
| `RES-P16-05` | P16 | IMPLEMENT | compare your implementation with scikit-learn/PyTorch behavior and complexity. | — |
| `RES-P17-01` | P17 | CORE | Forecasting: Principles and Practice | https://otexts.com/fpp3/ |
| `RES-P17-02` | P17 | PRACTICE | forecasting experiments with temporal validation. | — |
| `RES-P17-03` | P17 | REFERENCE | statsmodels time-series docs | https://www.statsmodels.org/stable/tsa.html |
| `RES-P17-04` | P17 | DEEP | advanced forecasting literature when needed. | — |
| `RES-P18-01` | P18 | CORE | Google recommendation systems learning materials | https://developers.google.com/machine-learning/recommendation |
| `RES-P18-02` | P18 | SUPPLEMENT | Stanford recommender / large-scale ML material. | — |
| `RES-P18-03` | P18 | REFERENCE | TensorFlow Recommenders docs when implementing with that stack. | https://www.tensorflow.org/recommenders |
| `RES-P18-04` | P18 | DEEP | recommender-system literature and industry case studies. | — |
| `RES-P19-01` | P19 | CORE | MIT 6.S191 Introduction to Deep Learning | https://introtodeeplearning.com/ |
| `RES-P19-02` | P19 | PRACTICE / REFERENCE | PyTorch tutorials | https://docs.pytorch.org/tutorials/ |
| `RES-P19-03` | P19 | DEEP | Deep Learning, Goodfellow et al.; Dive into Deep Learning | https://d2l.ai/ |
| `RES-P19-04` | P19 | IMPLEMENT | hand-compute a small forward/backprop example, then build the same idea in PyTorch. | — |
| `RES-P20-01` | P20 | CORE | Stanford CS231n | https://cs231n.stanford.edu/ |
| `RES-P20-02` | P20 | REFERENCE | PyTorch vision tutorials and torchvision docs. | — |
| `RES-P20-03` | P20 | DEEP | modern vision papers once fundamentals are strong. | — |
| `RES-P21-01` | P21 | CORE | Stanford CS224N | https://web.stanford.edu/class/cs224n/ |
| `RES-P21-02` | P21 | REFERENCE | Hugging Face NLP/Transformers docs. | https://huggingface.co/docs/transformers/ |
| `RES-P21-03` | P21 | DEEP | NLP research papers and selected chapters of Speech and Language Processing. | — |
| `RES-P22-01` | P22 | CORE | Stanford CS224N + Hugging Face course. | https://huggingface.co/docs/course/chapter1/1 |
| `RES-P22-02` | P22 | SUPPLEMENT | The Illustrated Transformer | https://jalammar.github.io/illustrated-transformer/ |
| `RES-P22-03` | P22 | REFERENCE | Transformer implementation/documentation in Hugging Face. | — |
| `RES-P22-04` | P22 | IMPLEMENT | implement a small attention block and a miniature transformer before fine-tuning large models. | — |
| `RES-P23-01` | P23 | CORE | Hugging Face Course | https://huggingface.co/course/ |
| `RES-P23-02` | P23 | REFERENCE | Transformers, Datasets, Tokenizers, Accelerate docs. | https://huggingface.co/docs/accelerate/ |
| `RES-P23-03` | P23 | DEEP | Full Stack Deep Learning | https://fullstackdeeplearning.com/ |
| `RES-P23-04` | P23 | RECHECK | model-serving and inference libraries change quickly. Read current release docs when implementing. | — |
| `RES-P24-01` | P24 | CORE | Full Stack Deep Learning material on LLM applications | https://fullstackdeeplearning.com/ |
| `RES-P24-02` | P24 | REFERENCE | LlamaIndex docs | https://docs.llamaindex.ai/ |
| `RES-P24-03` | P24 | SUPPLEMENT | Haystack docs when a comparison is useful | https://docs.haystack.deepset.ai/ |
| `RES-P24-04` | P24 | DEEP | information retrieval fundamentals and vector-search documentation. | — |
| `RES-P24-05` | P24 | IMPLEMENT | a retrieval system with an evaluation set, not a “chat with PDF” demo only. | — |
| `RES-P25-01` | P25 | CORE | Hugging Face Agents Course | https://huggingface.co/learn/agents-course/ |
| `RES-P25-02` | P25 | REFERENCE | LangGraph documentation when using graph-based orchestration | https://docs.langchain.com/oss/python/langgraph/ |
| `RES-P25-03` | P25 | SUPPLEMENT | provider-specific agent SDK documentation when a project calls for it. | — |
| `RES-P25-04` | P25 | DEEP | agent reliability/evaluation research and production case studies. | — |
| `RES-P25-05` | P25 | IMPLEMENT | deterministic tool-use first, then bounded agent loops. | — |
| `RES-P26-01` | P26 | CORE | Hugging Face task/model documentation. | https://huggingface.co/tasks |
| `RES-P26-02` | P26 | FOUNDATIONS | CS231n + CS224N. | — |
| `RES-P26-03` | P26 | REFERENCE | PyTorch and Transformers docs. | — |
| `RES-P26-04` | P26 | DEEP | current multimodal model papers. | — |
| `RES-P26-05` | P26 | RECHECK | this is a fast-moving research area; refresh the model/tool section before serious work. | — |
| `RES-P27-01` | P27 | CORE | NIST AI Risk Management Framework | https://www.nist.gov/itl/ai-risk-management-framework |
| `RES-P27-02` | P27 | PRACTICE | build a labelled evaluation set and regression suite for every serious AI project. | — |
| `RES-P27-03` | P27 | REFERENCE | framework-specific evaluation docs (MLflow, provider APIs, task libraries) for the stack in use. | — |
| `RES-P27-04` | P27 | DEEP | evaluation and measurement papers; benchmark methodology. | — |
| `RES-P28-01` | P28 | CORE | Made With ML MLOps Course | https://madewithml.com/courses/mlops/ |
| `RES-P28-02` | P28 | SUPPLEMENT | Full Stack Deep Learning | https://fullstackdeeplearning.com/ |
| `RES-P28-03` | P28 | REFERENCE | MLflow docs | https://mlflow.org/docs/latest/ |
| `RES-P28-04` | P28 | REFERENCE | DVC docs | https://dvc.org/doc |
| `RES-P28-05` | P28 | DEEP | Google Rules of ML | https://developers.google.com/machine-learning/guides/rules-of-ml |
| `RES-P28-06` | P28 | IMPLEMENT | train → track → register → serve → monitor → reproduce. | — |
| `RES-P29-01` | P29 | CORE | FastAPI for service fundamentals | https://fastapi.tiangolo.com/tutorial/ |
| `RES-P29-02` | P29 | REFERENCE | KServe docs for Kubernetes-native serving | https://kserve.github.io/website/ |
| `RES-P29-03` | P29 | REFERENCE | vLLM docs for LLM inference | https://docs.vllm.ai/ |
| `RES-P29-04` | P29 | DEEP | serving-system papers and performance investigations. | — |
| `RES-P29-05` | P29 | IMPLEMENT | deploy one model behind a versioned API with metrics and a rollback plan. | — |
| `RES-P30-01` | P30 | CORE | Made With ML | https://madewithml.com/courses/mlops/ |
| `RES-P30-02` | P30 | REFERENCE | MLflow | https://mlflow.org/docs/latest/ |
| `RES-P30-03` | P30 | REFERENCE | DVC | https://dvc.org/doc |
| `RES-P30-04` | P30 | PRACTICE | GitHub Actions + containerised pipeline. | — |
| `RES-P30-05` | P30 | DEEP | FSDL + production ML case studies. | — |
| `RES-P31-01` | P31 | CORE | Docker Get Started | https://docs.docker.com/get-started/ |
| `RES-P31-02` | P31 | PRACTICE | GitHub Actions | https://docs.github.com/en/actions |
| `RES-P31-03` | P31 | REFERENCE | Docker docs | https://docs.docker.com/ |
| `RES-P31-04` | P31 | DEEP | Kubernetes and cloud architecture only after the fundamentals are real. | — |
| `RES-P31-05` | P31 | IMPLEMENT | containerise a project, test in CI, push an image, deploy it. | — |
| `RES-P32-01` | P32 | CORE | AWS Skill Builder / cloud fundamentals | https://skillbuilder.aws/ |
| `RES-P32-02` | P32 | REFERENCE | AWS documentation | https://docs.aws.amazon.com/ |
| `RES-P32-03` | P32 | ARCHITECTURE | AWS Well-Architected Framework | https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html |
| `RES-P32-04` | P32 | DEEP | cloud architecture case studies and service-specific documentation. | — |
| `RES-P32-05` | P32 | RULE | learn one cloud deeply enough to deploy; understand the analogous concepts in others. | — |
| `RES-P33-01` | P33 | CORE | HashiCorp Terraform Tutorials | https://developer.hashicorp.com/terraform/tutorials |
| `RES-P33-02` | P33 | REFERENCE | Terraform docs | https://developer.hashicorp.com/terraform/docs |
| `RES-P33-03` | P33 | DEEP | Terraform internals and cloud-provider-specific patterns when required. | — |
| `RES-P33-04` | P33 | IMPLEMENT | provision the infrastructure for one portfolio system from code. | — |
| `RES-P34-01` | P34 | CORE | Kubernetes Concepts and official tutorials | https://kubernetes.io/docs/concepts/ |
| `RES-P34-02` | P34 | PRACTICE | Minikube/kind-based local cluster. | — |
| `RES-P34-03` | P34 | REFERENCE | Kubernetes docs | https://kubernetes.io/docs/home/ |
| `RES-P34-04` | P34 | DEEP | Kubernetes architecture and scheduler/controller internals. | — |
| `RES-P34-05` | P34 | RULE | Kubernetes stays deferred until Linux, networking, containers, deployment, and debugging are comfortable. | — |
| `RES-P35-01` | P35 | CORE | Designing Data-Intensive Applications | https://dataintensive.net/ |
| `RES-P35-02` | P35 | PRACTICE | System Design Primer | https://github.com/donnemartin/system-design-primer |
| `RES-P35-03` | P35 | REFERENCE | AWS Well-Architected Framework | https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html |
| `RES-P35-04` | P35 | DEEP | system-specific architecture papers and postmortems. | — |
| `RES-P35-05` | P35 | IMPLEMENT | design the architecture of your own projects before scaling them. | — |
| `RES-P36-01` | P36 | CORE | MIT 6.5840 Distributed Systems | https://pdos.csail.mit.edu/6.824/ |
| `RES-P36-02` | P36 | PRACTICE | labs and paper questions where prerequisites permit. | — |
| `RES-P36-03` | P36 | REFERENCE | Raft resources | https://raft.github.io/ |
| `RES-P36-04` | P36 | DEEP | Distributed Systems, Tanenbaum/van Steen or equivalent; original papers. | — |
| `RES-P36-05` | P36 | IMPLEMENT | replicated key-value store or selected distributed-systems lab. | — |
| `RES-P37-01` | P37 | CORE | Stanford CS329S Machine Learning Systems Design | https://web.stanford.edu/class/cs329s/ |
| `RES-P37-02` | P37 | DEEP | Designing Machine Learning Systems, Chip Huyen | https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/ |
| `RES-P37-03` | P37 | REFERENCE | cloud and serving documentation for the deployed architecture. | — |
| `RES-P37-04` | P37 | IMPLEMENT | design and defend a complete ML system from product requirement to monitoring. | — |
| `RES-P38-01` | P38 | CORE | OpenTelemetry docs | https://opentelemetry.io/docs/ |
| `RES-P38-02` | P38 | REFERENCE | Prometheus docs | https://prometheus.io/docs/ |
| `RES-P38-03` | P38 | REFERENCE | Grafana docs | https://grafana.com/docs/ |
| `RES-P38-04` | P38 | DEEP | Site Reliability Engineering | https://sre.google/sre-book/table-of-contents/ |
| `RES-P38-05` | P38 | IMPLEMENT | instrument one service and trace a request across components. | — |
| `RES-P39-01` | P39 | CORE | PortSwigger Web Security Academy | https://portswigger.net/web-security |
| `RES-P39-02` | P39 | REFERENCE | OWASP Top 10 | https://owasp.org/www-project-top-ten/ |
| `RES-P39-03` | P39 | AI SECURITY REFERENCE | OWASP GenAI Security Project | https://genai.owasp.org/ |
| `RES-P39-04` | P39 | STANDARDS | NIST AI RMF | https://www.nist.gov/itl/ai-risk-management-framework |
| `RES-P39-05` | P39 | DEEP | threat-modeling literature and security advisories for the systems actually deployed. | — |
| `RES-P40-01` | P40 | CORE | papers from NeurIPS, ICML, ICLR, ACL, CVPR, MLSys, etc. | — |
| `RES-P40-02` | P40 | DISCOVERY | arXiv | https://arxiv.org/ |
| `RES-P40-03` | P40 | SUPPLEMENT | Papers with Code / benchmark repositories where still relevant. | https://paperswithcode.com/ |
| `RES-P40-04` | P40 | DEEP | original papers, official code repositories, supplementary material. | — |
| `RES-P40-05` | P40 | IMPLEMENT | reproduce one paper before attempting original research. | — |
| `RES-P41-01` | P41 | CORE | Reinforcement Learning: An Introduction, Sutton and Barto | http://incompleteideas.net/book/the-book-2nd.html |
| `RES-P41-02` | P41 | SUPPLEMENT | David Silver reinforcement learning lectures | https://www.davidsilver.uk/teaching/ |
| `RES-P41-03` | P41 | REFERENCE | Gymnasium docs when implementing environments | https://gymnasium.farama.org/ |
| `RES-P41-04` | P41 | DEEP | current RL papers once mathematics and deep learning foundations are strong. | — |
| `RES-P42-01` | P42 | CORE | PyTorch Distributed documentation | https://docs.pytorch.org/docs/stable/distributed.html |
| `RES-P42-02` | P42 | REFERENCE | Ray docs | https://docs.ray.io/ |
| `RES-P42-03` | P42 | REFERENCE | DeepSpeed docs | https://www.deepspeed.ai/ |
| `RES-P42-04` | P42 | REFERENCE | vLLM docs | https://docs.vllm.ai/ |
| `RES-P42-05` | P42 | DEEP | systems papers, benchmark reports, accelerator architecture material. | — |
| `RES-P43-01` | P43 | CORE | Data Engineering Zoomcamp | https://datatalks.club/blog/data-engineering-zoomcamp.html |
| `RES-P43-02` | P43 | REFERENCE | Kafka | https://kafka.apache.org/documentation/ |
| `RES-P43-03` | P43 | REFERENCE | Spark | https://spark.apache.org/documentation/ |
| `RES-P43-04` | P43 | REFERENCE | Airflow | https://airflow.apache.org/docs/ |
| `RES-P43-05` | P43 | REFERENCE | Feast | https://docs.feast.dev/ |
| `RES-P43-06` | P43 | IMPLEMENT | streaming pipeline + batch pipeline + feature serving comparison. | — |
| `RES-P44-01` | P44 | CORE | Full Stack Deep Learning | https://fullstackdeeplearning.com/ |
| `RES-P44-02` | P44 | ECOSYSTEM REFERENCE | Hugging Face docs/course | https://huggingface.co/docs |
| `RES-P44-03` | P44 | IMPLEMENTATION REFERENCE | provider/model/framework docs specific to the current architecture. | — |
| `RES-P44-04` | P44 | DEEP | production case studies, evaluation papers, serving-system documentation. | — |
| `RES-P44-05` | P44 | RULE | architecture and evaluation outrank prompt cleverness. | — |
| `RES-P45-01` | P45 | CORE | cloud provider pricing documentation (start with AWS) | https://aws.amazon.com/pricing/ |
| `RES-P45-02` | P45 | ARCHITECTURE | AWS Well-Architected cost optimisation pillar | https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/ |
| `RES-P45-03` | P45 | DEEP | FinOps Foundation | https://www.finops.org/framework/ |
| `RES-P45-04` | P45 | IMPLEMENT | add cost estimates and a cost-per-request measure to a deployed system. | — |
| `RES-P46-01` | P46 | CORE | product discovery through real project users and stakeholders. | — |
| `RES-P46-02` | P46 | SUPPLEMENT | Inspired, The Mom Test, and strong product requirement examples. | — |
| `RES-P46-03` | P46 | REFERENCE | your project's issue tracker, design docs, analytics, user interviews. | — |
| `RES-P46-04` | P46 | IMPLEMENT | write a one-page problem statement, success metric, constraints, and feedback plan before a significant build. | — |
| `RES-P01-X1` | P01 | PHASE-TEXT | CS50x - Introduction to Computer Science | https://cs50.harvard.edu/x/ |
| `RES-P06-X1` | P06 | PHASE-TEXT | Referenced in P06.2a Resources | https://www.postgresql.org/docs/current/tutorial.html |
| `RES-P23-X1` | P23 | PHASE-TEXT | Referenced in P23.6 Tooling | https://huggingface.co/docs/transformers |
| `RES-P33-X1` | P33 | PHASE-TEXT | Referenced in P33.0 Core scope | https://developer.hashicorp.com/terraform/intro |

### 9.3 Tool / language registry

| ID | Technology / tool | Activation | Primary route | Official reference |
|---|---|---|---|---|
| `TOOL-01` | Python | Phase 1 | CS50P | https://docs.python.org/3/ |
| `TOOL-02` | Java | Phase 1/7 support | dev.java + university work | https://dev.java/learn/ |
| `TOOL-03` | JavaScript | Phase 7 onward | Odin / MDN | https://developer.mozilla.org/en-US/docs/Web/JavaScript |
| `TOOL-04` | TypeScript | Phase 7 onward | Odin + TS Handbook | https://www.typescriptlang.org/docs/handbook/ |
| `TOOL-05` | SQL | Phase 6 | SQLBolt + CMU | https://www.postgresql.org/docs/current/ |
| `TOOL-06` | PostgreSQL | Phase 6 | CMU DB course | https://www.postgresql.org/docs/current/ |
| `TOOL-07` | Redis | Phase 6/8 | project use + docs | https://redis.io/docs/latest/ |
| `TOOL-08` | MongoDB | Optional | docs + targeted tutorial | https://www.mongodb.com/docs/ |
| `TOOL-09` | Git | Phase 2 | Pro Git | https://git-scm.com/docs |
| `TOOL-10` | GitHub | Phase 2 | GitHub Skills | https://docs.github.com/ |
| `TOOL-11` | Linux | Phase 3 | Missing Semester | https://missing.csail.mit.edu/ |
| `TOOL-12` | Bash | Phase 3 | Missing Semester | shell manuals |
| `TOOL-13` | Docker | Phase 31 | Docker Get Started | https://docs.docker.com/ |
| `TOOL-14` | GitHub Actions | Phase 31 | GitHub Actions docs | https://docs.github.com/en/actions |
| `TOOL-15` | Terraform | Phase 33 | HashiCorp tutorials | https://developer.hashicorp.com/terraform/docs |
| `TOOL-16` | Kubernetes | Phase 34 | Kubernetes docs | https://kubernetes.io/docs/ |
| `TOOL-17` | NumPy | Phase 11+ | NumPy docs | https://numpy.org/doc/ |
| `TOOL-18` | Pandas | Phase 11+ | Pandas docs | https://pandas.pydata.org/docs/ |
| `TOOL-19` | Matplotlib | Phase 11+ | Matplotlib docs | https://matplotlib.org/stable/ |
| `TOOL-20` | scikit-learn | Phase 13+ | ISLR + User Guide | https://scikit-learn.org/stable/user_guide.html |
| `TOOL-21` | PyTorch | Phase 19+ | MIT 6.S191 + tutorials | https://docs.pytorch.org/ |
| `TOOL-22` | Hugging Face Transformers | Phase 22+ | HF Course | https://huggingface.co/docs/transformers/ |
| `TOOL-23` | Datasets | Phase 23+ | HF Course | https://huggingface.co/docs/datasets/ |
| `TOOL-24` | Tokenizers | Phase 23+ | HF Course | https://huggingface.co/docs/tokenizers/ |
| `TOOL-25` | Accelerate | Phase 23+ | HF Course | https://huggingface.co/docs/accelerate/ |
| `TOOL-26` | FastAPI | Phase 8/29 | FastAPI tutorial | https://fastapi.tiangolo.com/ |
| `TOOL-27` | Spring Boot | Optional Java backend | Spring official docs | https://spring.io/projects/spring-boot |
| `TOOL-28` | MLflow | Phase 28/30 | Made With ML + MLflow docs | https://mlflow.org/docs/latest/ |
| `TOOL-29` | DVC | Phase 28/30 | Made With ML + DVC docs | https://dvc.org/doc |
| `TOOL-30` | Airflow | Phase 12/43 | Zoomcamp | https://airflow.apache.org/docs/ |
| `TOOL-31` | Kafka | Phase 12/43 | Zoomcamp | https://kafka.apache.org/documentation/ |
| `TOOL-32` | Spark | Phase 12/43 | Zoomcamp | https://spark.apache.org/documentation/ |
| `TOOL-33` | Feast | Phase 43 | Feature store docs | https://docs.feast.dev/ |
| `TOOL-34` | OpenTelemetry | Phase 38 | Official docs | https://opentelemetry.io/docs/ |
| `TOOL-35` | Prometheus | Phase 38 | Official docs | https://prometheus.io/docs/ |
| `TOOL-36` | Grafana | Phase 38 | Official docs | https://grafana.com/docs/ |
| `TOOL-37` | vLLM | Phase 23/29/42 | official docs | https://docs.vllm.ai/ |
| `TOOL-38` | KServe | Phase 29 | official docs | https://kserve.github.io/website/ |
| `TOOL-39` | Ray | Phase 42 | official docs | https://docs.ray.io/ |
| `TOOL-40` | DeepSpeed | Phase 42 | official docs | https://www.deepspeed.ai/ |
| `TOOL-41` | LlamaIndex | Phase 24 | official docs | https://docs.llamaindex.ai/ |
| `TOOL-42` | LangGraph | Phase 25 | official docs | https://docs.langchain.com/oss/python/langgraph/ |
| `TOOL-43` | Gymnasium | Phase 41 | official docs | https://gymnasium.farama.org/ |

### 9.4 Resource rules (master text)

**76.1 RESOURCE STATUS LABELS**

- **CORE:** default resource for the active path.
- **PRACTICE:** used to force retrieval and problem solving.
- **REFERENCE:** authoritative lookup source.
- **DEEP:** use when the target depth requires more than the primary course.
- **IMPLEMENT:** use while building.
- **OPTIONAL:** useful, but not required for the common path.
- **RECHECK:** changing ecosystem; verify the current version when activated.

**76.2 RESOURCE SELECTION RULE**

For every major phase, the roadmap provides at least one deliberate path for:

1. **Learning** - how the concept is taught.
2. **Practice** - how the concept is exercised.
3. **Reference** - where exact behavior is verified.
4. **Depth** - where deeper theory is developed.
5. **Implementation** - what proves that the knowledge can be used.

A tiny concept does **not** need a separate course if it is naturally covered by the parent resource. For example, list slicing inherits coverage from the Python curriculum and Python reference; TCP headers inherit coverage from the networking curriculum and the relevant protocol references. This keeps the roadmap complete without creating a useless pile of hyperlinks.

**76.6 RESOURCE RULES FOR FAST-MOVING AI STACKS**

AI tooling changes faster than core CS material. Therefore:

- learn durable concepts first;
- use official documentation for exact APIs and supported versions;
- pin dependencies in projects;
- record the version used in README/setup files;
- treat framework-specific tutorials as disposable implementation knowledge;
- recheck model libraries, agent frameworks, serving systems, and evaluation tooling when you activate the phase rather than assuming a 2026 link remains current forever.

For fast-moving AI tools, **the concept survives longer than the interface**.

**76.7 WHAT TO DO WHEN A RESOURCE DISAPPEARS**

Do not let a broken link derail the curriculum.

```text
Broken resource
    ↓
Official replacement / current version
    ↓
Equivalent university course or textbook
    ↓
Practice + implementation
    ↓
Continue
```

The roadmap's competency gate is the invariant. The URL is not.

**77. RESOURCE OPERATING RULES**

**77.1 One active source**

Choose one primary learning source for the current phase. Two is acceptable when the subject genuinely needs two complementary modes, such as a theory course plus a coding environment.

**77.2 Documentation is not “advanced-only”**

Read official docs immediately for small lookups. Do not try to learn an entire ecosystem from reference documentation on Day 1. As competence increases, deliberately shift more of your learning load toward documentation.

**77.3 Practice must be independent**

A resource has failed its purpose when you can follow it but cannot reproduce the skill elsewhere. Practice must contain unseen tasks.

**77.4 Resource hoarding is a warning sign**

When you have three tabs open for competing courses on the same concept, close two. A small amount of friction is better than endless comparison.

**77.5 Resource reviews**

At every major phase boundary, record:

- primary resource used;
- practice source used;
- official reference;
- what the resource explained poorly;
- what was missing;
- what replaced it, if anything;
- version/date for fast-moving tools.

This turns the roadmap into a maintained learning system instead of a static document.

