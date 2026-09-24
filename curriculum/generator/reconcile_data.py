# -*- coding: utf-8 -*-
"""Reconciliation layer for Roadmap OS.

Authority: MASTER_ROADMAP_VICTOR_2026_FINAL_2026-09-17.md (the master).
Source tags used in prerequisite edges:
  S79  = master section "Year-by-year master timeline" (stage-based)
  S101 = master section "Master learning sequence"
  S103 = master section "Immediate foundational block / dependency spine"
  GATE = explicit GATE line inside the phase text
  TEXT = explicit prerequisite text inside the phase or project text
  D5   = user decision 5 (enforced chain: Classical ML -> Docker/CI/CD/Cloud -> DL -> ML Eng/MLOps -> Transformers/LLMs)
  CKPT = master competency-checkpoint definition
"""

# ---------------------------------------------------------------- stages
STAGES = [
    # id, name, master basis, entry condition, exit gate
    ("S0", "Programming reset", "Master timeline 2026-2027, Stage 0; Mode A",
     "Day 1.", "G0 initial Python gate (master 14-day plan)"),
    ("S1", "Tooling and programming fluency", "Master timeline 2026-2027, Stage 1",
     "G0 passed.", "C1 Programmer"),
    ("S2", "First CS/data foundations", "Master timeline 2026-2027, Stage 2 ('only after Stage 1 is reliable')",
     "C1 passed.", "SG2 stage gate: DSA-fundamentals and SQL phase gates"),
    ("S3", "Mathematical/data foundations", "Master timeline 2026-2027, Stage 3",
     "SG2 passed.", "SG3 stage gate: data gate + statistics gate (master precondition for classical ML)"),
    ("S4", "Engineering foundation", "Master timeline 2026-2027, Stage 4",
     "SG3 passed.", "SG4 Foundation Reset exit"),
    ("S5", "Engineering + classical ML", "Master timeline 2027-2028 emphasis",
     "SG4 passed.", "SG5 stage exit (C2, C4, C3 all passed)"),
    ("S6", "Deep learning + ML engineering", "Master timeline 2028-2029 emphasis, minus attention/Transformers (moved to S7 by decision 5)",
     "SG5 passed (Docker/CI/CD/Cloud gates inside S5C are the D5 precondition).", "C5 ML engineer"),
    ("S7", "Transformers/LLMs + AI engineering + ML systems", "Master timeline 2029-2030 emphasis, plus attention/Transformers",
     "C5 passed (decision 5).", "C6 AI engineer, then SG7 systems exit"),
    ("S8", "Research + specialisation", "Master timeline 2030+; Phase 40 gate",
     "C5 passed, ideally C6 (Phase 40 GATE).", "Open-ended; C7 windows are calendar-driven"),
]

SUBSTAGES = {
    "S5A": ("CS and backend depth", "C2 CS foundation"),
    "S5B": ("Data and classical ML", "C4 Data scientist"),
    "S5C": ("Production engineering", "C3 Backend engineer"),
    "S6A": ("Deep learning", "SG6A deep-learning phase gates"),
    "S6B": ("ML engineering and MLOps", "C5 ML engineer"),
    "S7A": ("Transformers, LLMs, AI engineering", "C6 AI engineer"),
    "S7B": ("Systems depth", "SG7 systems exit"),
}

# ---------------------------------------------------------------- phase prerequisites (hard, phase level)
PREREQ = {
    "P01": [],
    "P02": [("P01", "S103")],
    "P03": [("P01", "S103")],
    "P04": [("P01", "S103"), ("P02", "S103"), ("P03", "S103")],
    "P05": [("P03", "S79"), ("P04", "S79"), ("P08", "S101")],
    "P06": [("P01", "S103"), ("P02", "S103"), ("P03", "S103")],
    "P07": [("P01", "S101")],
    "P08": [("P07", "S103"), ("P06", "S103"), ("P11", "S103")],
    "P09": [("P07", "S101"), ("P08", "S101"), ("P31", "S101")],
    "P10": [("P01", "S103"), ("P04", "S103"), ("P06", "S103")],
    "P11": [("P10", "S103"), ("P06", "S101")],
    "P12": [("P11", "TEXT"), ("P06", "TEXT")],
    "P13": [("P10", "S79"), ("P11", "S79"), ("P07", "S103"), ("P08", "S103")],
    "P14": [("P13", "S101")],
    "P15": [("P13", "S101")],
    "P16": [("P13", "S101"), ("P10", "S101")],
    "P17": [("P13", "TEXT"), ("P15", "TEXT")],
    "P18": [("P13", "TEXT"), ("P15", "TEXT"), ("P19", "TEXT"), ("P28", "TEXT")],
    "P19": [("P13", "S103"), ("P14", "S103"), ("P15", "S103"), ("P16", "S101"), ("P31", "D5"), ("P32", "D5")],
    "P20": [("P19", "S101")],
    "P21": [("P19", "S101")],
    "P22": [("P19", "S101"), ("P21", "S101"), ("P28", "D5"), ("P30", "D5")],
    "P23": [("P22", "S103")],
    "P24": [("P23", "S101"), ("P08", "TEXT"), ("P06", "TEXT")],
    "P25": [("P23", "S101")],
    "P26": [("P20", "TEXT"), ("P21", "TEXT"), ("P22", "TEXT")],
    "P27": [("P23", "S101"), ("P24", "S101"), ("P15", "TEXT")],
    "P28": [("P19", "D5"), ("P31", "S103"), ("P32", "S103"), ("P12", "TEXT")],
    "P29": [("P13", "S101"), ("P31", "S101"), ("P32", "S101")],
    "P30": [("P28", "S101"), ("P29", "S101"), ("P31", "TEXT")],
    "P31": [("P13", "D5"), ("P14", "D5"), ("P15", "D5"), ("P03", "TEXT"), ("P08", "TEXT")],
    "P32": [("P31", "S101")],
    "P33": [("P32", "TEXT")],
    "P34": [("P03", "TEXT"), ("P05", "TEXT"), ("P31", "TEXT"), ("P32", "TEXT")],
    "P35": [("P05", "S101"), ("P06", "TEXT"), ("P08", "TEXT")],
    "P36": [("P35", "S101"), ("P05", "TEXT")],
    "P37": [("P35", "S101"), ("P28", "S101"), ("P29", "S101"), ("P30", "S101"), ("P18", "TEXT"), ("P24", "TEXT")],
    "P38": [("P31", "TEXT"), ("P29", "TEXT")],
    "P39": [("P08", "TEXT")],
    "P40": [("C5", "GATE")],
    "P41": [("C5", "GATE")],
    "P42": [("C5", "GATE"), ("P29", "GATE")],
    "P43": [("P12", "GATE"), ("P08", "GATE"), ("P31", "GATE"), ("P28", "GATE")],
    "P44": [("P07", "GATE"), ("P08", "GATE"), ("P27", "GATE"), ("P29", "GATE")],
    "P45": [("P32", "GATE"), ("P29", "GATE")],
    "P46": [],
}

# component-level hard edges (component must first appear before dependent)
COMPONENT_EDGES = [
    ("P10.1d", "P13.5", "PCA in unsupervised learning needs eigen/SVD"),
    ("P10.2", "P16.0", "gradient descent (P16 item 2) needs calculus"),
    ("P10.5", "P16.0", "from-scratch optimisation needs optimisation basics"),
    ("P19.1", "P16.0#7", "simple neural network and backprop items belong with deep learning"),
    ("P05.2", "PR05", "WebSockets and networking before the chat backend"),
    ("P05.1", "PR05", "concurrency reasoning before the chat backend"),
    ("P06.3", "PR04", "Redis caching and rate limiting before the URL shortener"),
    ("P08.4", "C3", "authenticated API required by C3"),
    ("P31.1", "P29.1", "containerisation before the early serving segment"),
    ("P32.0", "P29.1", "cloud basics before the early serving segment"),
    ("P28.0", "P22.0", "decision 5: ML engineering before Transformers"),
    ("P30.4", "P22.0", "decision 5: MLOps before Transformers"),
    ("P32.1", "P19.0", "decision 5: Docker/CI/CD/Cloud before deep learning"),
]

# ---------------------------------------------------------------- phase unlock rules (derived; master GATE text quoted where it exists)
UNLOCK_NOTE = {
    "P02": "Supporting setup allowed from Day 1 only if trivial (master Day One section); formal study after G0.",
    "P04": "DSA becomes a maintenance track only after the programming foundation is dependable (master Section 0).",
    "P05": "OS, networking and database concepts are required by C2.",
    "P13": "Classical ML may begin only when the programming, data, and statistics gates are genuinely passing (master timeline).",
    "P19": "Decision 5: only after Classical ML and Docker/CI/CD/Cloud gates.",
    "P22": "Decision 5: formal study only after ML Engineering/MLOps (C5). Optional reading exposure allowed earlier; never a gate.",
    "P29": "Early segment (D1-D2, classical model) after Docker/Cloud per master sequence item 24; formal D3 after ML engineering.",
    "P34": "Master rule: Kubernetes stays deferred until Linux, networking, containers, deployment, and debugging are comfortable.",
}

# ---------------------------------------------------------------- checkpoints
CHECKPOINTS = [
    # id, title, master source, components that must precede the gate week
    ("G0", "Initial Python gate", "Master Section 0 'Start here' 14-day plan and 'The first gate'",
     ["P01.1a"]),
    ("C1", "Programmer", "Master Competency Checkpoint 1",
     ["P01.1a", "P01.1b", "P02.1", "P07.4", "PR01"]),
    ("C2", "CS foundation", "Master Competency Checkpoint 2",
     ["P04.1", "P04.2", "P04.3", "P04.4", "P04.5", "P04.6", "P05.1", "P05.2", "P06.1", "P06.1c", "P06.1d"]),
    ("C3", "Backend engineer", "Master Competency Checkpoint 3",
     ["P08.1", "P08.2", "P08.3", "P08.4", "P06.2", "P07.3", "P39.2", "P31.1", "P31.2", "P32.1", "PR03", "PR04"]),
    ("C4", "Data scientist", "Master Competency Checkpoint 4",
     ["P06.1a", "P10.3", "P10.4", "P11.3", "P11.5", "P13.3", "P14.3", "P15.3", "PR06"]),
    ("C5", "ML engineer", "Master Competency Checkpoint 5",
     ["P28.0", "P29.3", "P30.2", "P30.4", "P38.1", "PR09"]),
    ("C6", "AI engineer", "Master Competency Checkpoint 6",
     ["P23.5", "P24.0", "P25.0", "P27.2", "P39.3", "PR10"]),
    ("C7", "Top-tier candidate", "Master Competency Checkpoint 7",
     ["P04.6", "P05.1", "P05.2", "P35.2"]),
]

CHECKPOINT_NOTES = {
    "G0": "Decision 6: the master's 14-day plan is the formal initial Python gate. Python fluency work continues afterwards; G0 does not certify proficiency.",
    "C7": "Interview readiness is trained near recruiting periods (master). C7 prep windows are placed by the calendar layer against real recruiting dates, using whatever checkpoints are passed by then. Technical floor: C2 + C3 + system-design fundamentals.",
}

# ---------------------------------------------------------------- projects (canonical IDs = master project ladder)
PROJECTS = [
    # id, title, requires (components/checkpoints), evidence for
    ("PR01", "CLI Tool", ["G0", "P02.1", "P07.3"], "C1"),
    ("PR02", "API Client / Automation Tool", ["P08.1", "P01.1d"], "Portfolio Stage A"),
    ("PR03", "Database-Backed API", ["P06.2", "P08.3", "P07.3"], "C3 (with auth added in S5A)"),
    ("PR04", "URL Shortener", ["P06.3", "P06.1d", "P35.1"], "C3"),
    ("PR05", "Real-Time Chat Backend", ["P05.1", "P05.2", "P08.4"], "C2/C3 depth"),
    ("PR06", "Analytics Platform", ["P11.3", "P12.0", "P06.2"], "C4"),
    ("PR07", "Fraud Detection Platform", ["P15.3", "P14.2", "P31.2", "P32.1", "P29.2"], "C4/C5 bridge; fintech flagship"),
    ("PR08", "Recommendation System", ["P18.0", "P29.3"], "C5 depth"),
    ("PR09", "ML Serving Platform", ["P28.0", "P29.3", "P30.4", "P38.1"], "C5"),
    ("PR10", "RAG Research Platform", ["P24.1", "P27.2", "P39.3", "P08.4"], "C6"),
    ("PR11", "Intelligent Financial Research Platform", ["C6", "P01.3", "P38.3", "P45.0"], "Capstone; C7 deep dives"),
]

# ---------------------------------------------------------------- continuous tracks (master sections 65-75)
TRACKS = [
    ("T01", "DSA / Interview preparation", "CONTINUOUS TRACK - DSA / INTERVIEW PREPARATION", "Primary block CW15-17, lane from CW18 (see DSA lane)."),
    ("T02", "FAANG / Top-tier tech", "CONTINUOUS TRACK - FAANG / TOP-TIER TECH", "Coding/CS parts ride the DSA lane; system design from S5A; ML system design from S7B; behavioural stories from first internship evidence."),
    ("T03", "Resume", "CONTINUOUS TRACK - RESUME", "Update at every stage exit gate."),
    ("T04", "GitHub", "CONTINUOUS TRACK - GITHUB", "From S1 (every build in Git)."),
    ("T05", "Open source", "CONTINUOUS TRACK - OPEN SOURCE", "Reading codebases from S5; contributions from S7."),
    ("T06", "Technical writing", "CONTINUOUS TRACK - TECHNICAL WRITING", "READMEs from PR01; writeups at every project and checkpoint."),
    ("T07", "Research", "CONTINUOUS TRACK - RESEARCH", "Light paper reading allowed earlier; full phase after C5 (Phase 40 gate)."),
    ("T08", "Internship strategy", "INTERNSHIP STRATEGY", "Calendar-driven; placements map into the curriculum (Mode E)."),
    ("T09", "Portfolio strategy by stage", "PORTFOLIO STRATEGY BY STAGE", "Portfolio Stage A after S4, B after S5, C after S6, D in S8."),
    ("T10", "Certification strategy", "CERTIFICATION STRATEGY", "Only with a concrete reason (master)."),
    ("T11", "What not to get distracted by", "WHAT NOT TO GET DISTRACTED BY", "Standing rule."),
]

# ---------------------------------------------------------------- DSA lane (Phase 4 after its primary block)
DSA_LANE = [
    (18, 21, ["P04.2", "P04.5:1-7"], "Re-test linear structures, hashing, search/sort (2-3 sessions/week)."),
    (22, 33, ["P04.3"], "Trees, heaps, priority queues, tries."),
    (34, 46, ["P04.4"], "Graphs."),
    (47, 66, ["P04.5:8-13", "P04.6"], "Algorithm families and problem-solving patterns; target C2 at CW66."),
    (67, 101, ["P04.7"], "Interview progression: easy to medium, mistake log (master DSA track)."),
    (102, None, [], "Maintenance at C2 level; timed practice and mocks only inside calendar-placed C7 windows."),
]

# ---------------------------------------------------------------- not scheduled as weekly primary work
ON_DEMAND = {
    "P05.4": "OPTIONAL (🟡). Schedule only if a runtime/compiler need appears or in a specialisation.",
    "P12.0#14-16": "Later technologies (Airflow, Spark, Kafka): learn on demand under Phase 43 when a real scaling/workflow problem appears (master Phase 12 and 43 text).",
    "P41.0": "OPTIONAL branch (🟢). Gate: after C5 and only if a project or research direction requires it.",
    "P43.0": "On demand after data, backend, deployment and ML-lifecycle concepts work (Phase 43 GATE).",
    "P46.0": "Continuous: awareness from S4; detailed product reasoning inside PR07, PR11 and internships (Phase 46 GATE).",
}

# ---------------------------------------------------------------- the curriculum-week schedule
# p = primary slices, s = supporting slices, b = build/evidence, g = gate, n = note
# slice syntax: "P10.3" (whole component) or "P10.3:1-9" or "P03.1:1-13,22-40"
W = []
def wk(stage, p, s=None, b="", g="", n="", proj=""):
    W.append(dict(stage=stage, p=p, s=s or [], b=b, g=g, n=n, proj=proj))

# S0 Programming reset (Mode A)
wk("S0", ["P01.1a:1-9,14-16,27"], ["SETUP"], b="Five tiny programs; break one deliberately and fix it (master Day 1 work).",
   n="Days 1-7 of the master plan: Days 1-3 functions, variables, expressions, input/output; Days 4-6 conditionals and boolean reasoning; Day 7 loops begin.")
wk("S0", ["P01.1a:9-13,17-26,28-39"], b="Unseen test on Day 14 (includes the 100-200 line program, P01.1a#39).", g="G0",
   n="Days 8-14: Days 8-9 loops; Days 10-11 strings and collections; Days 12-13 functions, decomposition, small programs; Day 14 exceptions, files, review, unseen test.")
# S1 Tooling and programming fluency
wk("S1", ["P01.1b:1-13", "P01.1f:1"], b="Build 1: CLI calculator (P01.1f#1).", n="Fluency practice after G0; no new gate.")
wk("S1", ["P01.1b:14-27", "P01.1f:2"], b="Build 2: File organiser (P01.1f#2).")
wk("S1", ["P02.1"], b="Recovery drills: deleted file, bad commit, merge conflict, earlier version.")
wk("S1", ["P02.2"], b="Put Builds 1-2 on GitHub with README and .gitignore.")
wk("S1", ["P03.1:1-13,22-40"], b="Shell navigation and text-tool exercises on your own files.")
wk("S1", ["P03.1:14-21,41-48", "P03.1a"], b="One P03.1a project (shell automation or log filtering).")
wk("S1", ["P01.1c:1-9", "P01.1f:3"], b="Build 3: Expense tracker (P01.1f#3).")
wk("S1", ["P01.1c:10-18", "P01.1f:4"], b="Build 4: Log analyser (P01.1f#4).")
wk("S1", ["P07.3", "P07.4"], b="Add tests to Builds 3-4; debug one planted failure.", n="Entry depth D1-D2; P07 is revisited in S4.")
wk("S1", ["P01.1d:1-10", "P01.1f:5"], b="Build 5: CSV/JSON processor (P01.1f#5) as an installable package.")
wk("S1", ["PR01"], proj="PR01", b="PR01 CLI Tool: design, implement, test.")
wk("S1", ["PR01"], proj="PR01", g="C1", b="PR01 finish; C1 practical gate: 3 unseen tasks in separate sessions + CLI program without walkthrough.")
# S2 First CS/data foundations
wk("S2", ["P04.0", "P04.1", "P04.2:1-3,12-15"], b="Implement dynamic array; analyse costs.")
wk("S2", ["P04.2:4-9"], b="Implement linked list, stack, queue, deque.")
wk("S2", ["P04.2:10-11,16", "P04.5:1-7"], b="Implement hash table; binary search; merge sort and quicksort.")
wk("S2", ["P06.1", "P06.1a:1-6"], b="SQLBolt set + own queries on a sample database.")
wk("S2", ["P06.1a:7-12"], b="Join/CTE/window exercises.")
wk("S2", ["P06.1a:13-17", "P06.2"], b="PostgreSQL install; load a dataset; P06.2 project 1 (SQL analytics exercises).")
wk("S2", ["CONSOLIDATE"], g="SG2", b="Unseen DSA set (linear structures, hashing, search/sort) + unseen SQL task; spaced re-tests of S0-S1.")
# S3 Mathematical/data foundations
wk("S3", ["P10.3:1-9"], b="Problem set + Monte Carlo simulation in Python.")
wk("S3", ["P10.3:10-16"], b="Simulate LLN and CLT.")
wk("S3", ["P10.4:1-6"], b="Descriptive statistics and sampling on a real dataset.")
wk("S3", ["P10.4:7-11"], b="Confidence intervals and a hypothesis test with power/effect size discussion.")
wk("S3", ["P10.1a"], b="Hand derivations + NumPy matrix operations.")
wk("S3", ["P10.1b"], b="Problem set.")
wk("S3", ["P10.1c"], b="Projections and orthogonality in NumPy.")
wk("S3", ["P11.1"], b="NumPy and Pandas exercises on real data.")
wk("S3", ["P11.1", "P01.1f:7"], b="Build 7: CLI data-analysis tool (P01.1f#7).", n="Second pass on the core stack: Pandas depth and Matplotlib.")
wk("S3", ["P11.2", "P11.3:1-6"], b="Follow the master data workflow on one dataset.")
wk("S3", ["P11.3:7-12"], b="Reproducible EDA report with data-quality checks.")
wk("S3", ["CONSOLIDATE"], g="SG3", b="Data gate (unseen EDA task) + statistics gate (unseen inference task); spaced re-tests.")
# S4 Engineering foundation
wk("S4", ["P07.1", "P07.2"], b="Refactor Builds 1-5 for code quality.")
wk("S4", ["P07.3", "P07.4", "P01.1d:11-16"], b="Linting, formatting, type checking, profiling on one build.", n="Second pass at D2-D3.")
wk("S4", ["P07.5", "P08.0", "P01.1f:8"], b="Build 8: reusable Python package (P01.1f#8).")
wk("S4", ["P08.1"], b="Inspect real HTTP traffic with curl and devtools.")
wk("S4", ["P08.2"], b="Design a REST resource model on paper.")
wk("S4", ["PR02", "P01.1f:6"], proj="PR02", b="PR02 API Client: consume a public API with retries, rate limits, logging (P01.1f#6).")
wk("S4", ["PR02"], proj="PR02", b="PR02 finish + README.")
wk("S4", ["P08.3"], b="API design exercise for PR03.")
wk("S4", ["PR03", "P08.6:1-4"], proj="PR03", b="PR03 Database-Backed API: routing, validation, database access.")
wk("S4", ["PR03"], proj="PR03", b="PR03 migrations and tests.")
wk("S4", ["PR03", "P01.1f:9"], proj="PR03", b="PR03 finish + README (Build 9 P01.1f#9).")
wk("S4", ["CONSOLIDATE"], b="Spaced re-tests across S0-S4; repair loop (master foundation failure recovery).")
wk("S4", ["CONSOLIDATE"], g="SG4", b="Foundation Reset exit review; portfolio Stage A update (T09).")
# S5A CS and backend depth
wk("S5A", ["P05.2:1-9"], ["P01.2:1-5"], b="Simple socket programs.")
wk("S5A", ["P05.2:10-16"], ["P01.2:6-10"], b="Trace DNS + TLS for a real site.")
wk("S5A", ["P05.2:17-24"], ["P01.2:11-15"], b="Local HTTP server behind a reverse proxy.")
wk("S5A", ["P05.1:1-6,22"], ["P01.2:16-20"], b="Process monitor (P05.1 project idea).")
wk("S5A", ["P05.1:7-14,20-21"], ["P01.2:21-26"], b="File-descriptor and memory exploration exercises.")
wk("S5A", ["P05.1:15-19,23-26"], ["P01.2:27-30"], b="Concurrency bugs: reproduce a race and a deadlock, then fix them.")
wk("S5A", ["P06.1b"], ["P01.1e:1-8"], b="Schema design for PR03 v2 (P06.2 project 2).")
wk("S5A", ["P06.1c"], ["P01.1e:9-15"], b="Transaction-heavy exercise (P06.2 project 3).")
wk("S5A", ["P06.1d", "P06.2"], b="Query optimisation exercise with EXPLAIN (P06.2 project 4).", n="Second pass on PostgreSQL at depth.")
wk("S5A", ["P06.3", "P06.1e", "P06.4"], b="Add Redis caching to PR03.")
wk("S5A", ["P08.4", "P08.6:5-8", "P39.0", "P39.1"], proj="PR03", b="Add users, password hashing, tokens, roles to PR03.")
wk("S5A", ["P39.2", "P08.5"], b="Security review of PR03 against common web risks.")
wk("S5A", ["P35.0", "P35.1", "P35.2:1-10"], b="Design PR04 before building it.", n="System-design fundamentals at D1-D2 (master 2027-2028 list).")
wk("S5A", ["PR04", "P08.6:9-13"], proj="PR04", b="PR04 URL Shortener: IDs, redirects, storage, constraints.")
wk("S5A", ["PR04", "P35.2:11-19"], proj="PR04", b="PR04 cache, rate limiting, analytics.")
wk("S5A", ["PR04"], proj="PR04", b="PR04 traffic, bottleneck, failure-mode and scaling analysis.")
wk("S5A", ["PR05", "P08.6:14-17"], proj="PR05", b="PR05 Real-Time Chat Backend: auth + WebSockets.")
wk("S5A", ["PR05"], proj="PR05", b="PR05 persistence, online/offline, retries.")
wk("S5A", ["PR05"], proj="PR05", b="PR05 concurrency reasoning writeup.")
wk("S5A", ["CONSOLIDATE"], g="C2", b="C2 practical gate: mixed unseen DSA set, 80%+ over repeated attempts; explain OS, networking, database concepts.")
# S5B Data and classical ML
wk("S5B", ["P11.4", "P11.5"], b="Rewrite the S3 EDA as a stakeholder report.")
wk("S5B", ["P12.0:1-13"], b="Design the PR06 pipeline.")
wk("S5B", ["PR06", "P12.1"], proj="PR06", b="PR06 Analytics Platform v1: ingestion, validation, transformation, PostgreSQL.")
wk("S5B", ["PR06"], proj="PR06", b="PR06 SQL + Python analysis, visualisation.")
wk("S5B", ["PR06"], proj="PR06", b="PR06 v2 with batch scheduling and logging; data dictionary, findings, limitations.")
wk("S5B", ["P13.1", "P14.3"], b="Formulate 3 problems; build baselines first.")
wk("S5B", ["P13.2", "P10.4:12-13"], b="Regression on a real dataset.")
wk("S5B", ["P13.3", "P10.3:17-20"], b="Classification on a real dataset; MLE derivation for logistic regression.")
wk("S5B", ["P13.4"], b="Trees, ensembles, boosting comparison.")
wk("S5B", ["P10.1d", "P10.1e"], b="Eigen/SVD in NumPy; PCA by hand on a small matrix.")
wk("S5B", ["P13.5"], b="Clustering + PCA on a real dataset.")
wk("S5B", ["P14.0"], b="Deliberately overfit, then regularise and cross-validate.")
wk("S5B", ["P14.1", "P14.2"], b="Create leakage deliberately, then diagnose it.")
wk("S5B", ["P15.1", "P15.2"], b="Metric exercises with error-cost reasoning.")
wk("S5B", ["P15.3", "P15.4", "P10.4:14-16"], b="Write an evaluation plan before training; A/B test design.")
wk("S5B", ["P10.2"], b="Derive gradients for linear and logistic loss.")
wk("S5B", ["P10.5"], b="Gradient descent variants on a toy objective.")
wk("S5B", ["P16.0:1-3,9-14"], b="From scratch: linear regression, gradient descent, logistic regression.")
wk("S5B", ["P16.0:4-6,9-14", "P01.1f:10"], b="From scratch: k-means, PCA, tree components; Build 10 small ML package (P01.1f#10).")
wk("S5B", ["P17.0:1-10"], b="Forecasting baseline with temporal cross-validation.")
wk("S5B", ["CONSOLIDATE"], g="C4", b="C4 practical gate: unfamiliar dataset, reproducible analysis, 5 defensible questions, limitations, evaluated baseline/model.")
# S5C Production engineering (decision 5: after classical ML)
wk("S5C", ["P31.0", "P31.1:1-5"], b="Containerise PR03.")
wk("S5C", ["P31.1:6-9"], b="Compose PR03 + PostgreSQL + Redis.")
wk("S5C", ["P31.2"], b="CI pipeline: tests, lint, image build.")
wk("S5C", ["P09.0:1-8"], b="Refactor PR03 into layered design.")
wk("S5C", ["P09.0:9-14", "P09.1", "P09.2"], b="Architecture note for PR04.")
wk("S5C", ["P32.0"], b="Cloud account, IAM, compute, managed database basics.")
wk("S5C", ["P32.1"], b="Deploy PR03/PR04 with networking, identity, database, logs, monitoring, deployment automation.")
wk("S5C", ["CONSOLIDATE"], g="C3", b="C3 practical gate: service with auth, persistence, tests, API docs, real deployment.")
wk("S5C", ["P29.1", "P29.2"], b="Serve a classical model (batch + online) behind FastAPI.",
   n="Early serving segment at D1-D2 (master sequence item 24). Formal D3 serving is in S6B.")
wk("S5C", ["PR07"], proj="PR07", b="PR07 Fraud Detection: data, validation, features, splits, baseline.",
   n="Master: if a fraud-detection project already exists, upgrade it instead of rebuilding.")
wk("S5C", ["PR07"], proj="PR07", b="PR07 model comparison, threshold choice, error costs (P46 reasoning).")
wk("S5C", ["PR07"], proj="PR07", b="PR07 API + deployment.")
wk("S5C", ["PR07"], proj="PR07", b="PR07 monitoring, drift discussion, temporal-leakage check.")
wk("S5C", ["CONSOLIDATE"], g="SG5", b="Stage 5 exit review; portfolio Stage B update (T09).")
# S6A Deep learning (decision 5: after Docker/CI/CD/Cloud)
wk("S6A", ["P19.0", "P19.1"], ["P05.3:1-6"], b="Hand-compute forward pass of a tiny network.")
wk("S6A", ["P19.2", "P16.0:7-8"], ["P05.3:7-12"], b="From scratch in NumPy: simple neural network + backpropagation.")
wk("S6A", ["P19.3:1-6"], ["P05.3:13-19"], b="Custom training loop in PyTorch.")
wk("S6A", ["P19.3:7-12"], b="Optimiser/regularisation ablation.")
wk("S6A", ["P19.4"], b="Reproduce and fix vanishing gradients and overfitting.")
wk("S6A", ["P19.5"], b="All five required builds, with checkpointing.")
wk("S6A", ["P20.0:1-12"], b="Image classifier.")
wk("S6A", ["P20.0:13-20"], b="Transfer-learning classifier.")
wk("S6A", ["P21.0:1-6"], b="Sequence classifier with embeddings.")
wk("S6A", ["P21.0:7-11", "P17.0:11-15"], b="LSTM/GRU comparison; forecasting 'later' items (P17 Later list).",
   n="Optional exposure only: reading on attention is allowed here but is not a gate (decision 5).")
wk("S6A", ["CONSOLIDATE"], g="SG6A", b="Deep-learning phase gates; spaced re-tests of classical ML.")
# S6B ML engineering and MLOps
wk("S6B", ["P28.0:1-10", "P28.1"], b="Restructure PR07 as a reproducible training pipeline.")
wk("S6B", ["P28.0:11-21", "P28.2"], b="Answer the production questions for PR07.")
wk("S6B", ["P29.1"], b="Batch inference job at D3.", n="Formal serving pass at D3.")
wk("S6B", ["P29.2"], b="Online inference: latency, batching, health checks.")
wk("S6B", ["P29.3"], b="Serving project: versioned API, metrics, rollback plan.")
wk("S6B", ["P30.1"], b="MLOps Level 1.")
wk("S6B", ["P30.2"], b="MLOps Level 2.")
wk("S6B", ["P30.3"], b="MLOps Level 3.")
wk("S6B", ["P30.4"], b="MLOps Level 4: monitoring, drift, retraining.")
wk("S6B", ["P38.0", "P38.1"], b="Metrics for the serving project.")
wk("S6B", ["P38.2", "P38.3"], b="Instrument one service; trace a request across components.")
wk("S6B", ["P33.0"], b="Provision one portfolio system with Terraform.")
wk("S6B", ["P34.0:1-11"], b="Local cluster (Minikube/kind).")
wk("S6B", ["P34.0:12-18"], b="Deploy the serving project to the local cluster.")
wk("S6B", ["P18.0:1-7"], b="Candidate generation + collaborative filtering prototype.")
wk("S6B", ["P18.0:8-13"], b="Offline evaluation of the prototype.")
wk("S6B", ["PR08"], proj="PR08", b="PR08 Recommendation System: event ingestion, representations.")
wk("S6B", ["PR08"], proj="PR08", b="PR08 retrieval + ranking.")
wk("S6B", ["PR08"], proj="PR08", b="PR08 evaluation + serving API.")
wk("S6B", ["PR08"], proj="PR08", b="PR08 production design writeup.")
wk("S6B", ["PR09"], ["P45.0:1-8"], proj="PR09", b="PR09 ML Serving Platform: registry, model selection, versioning.")
wk("S6B", ["PR09"], ["P45.0:9-15"], proj="PR09", b="PR09 inference API, latency, batching.")
wk("S6B", ["PR09"], proj="PR09", b="PR09 health checks + monitoring.")
wk("S6B", ["PR09"], proj="PR09", b="PR09 cost analysis + documentation.")
wk("S6B", ["CONSOLIDATE"], g="C5", b="C5 practical gate: end-to-end ML service from ingestion through inference and monitoring.")
wk("S6B", ["CONSOLIDATE"], b="Buffer/repair; portfolio Stage C update (T09).")
# S7A Transformers, LLMs, AI engineering (decision 5: after C5)
wk("S7A", ["P22.0:1-8"], b="Scaled dot-product attention in NumPy.")
wk("S7A", ["P22.0:9-15", "P22.1"], b="Explain why attention works (required understanding).")
wk("S7A", ["P22.2:1-5"], b="Mini Transformer steps 1-5.")
wk("S7A", ["P22.2:6-10"], b="Mini Transformer steps 6-10: training loop + generation.")
wk("S7A", ["P23.1", "P23.2"], ["P01.3:1-5"], b="Tokeniser + embedding experiments.")
wk("S7A", ["P23.3"], ["P01.3:6-10"], b="Model lifecycle notes.")
wk("S7A", ["P23.4"], ["P01.3:11-15"], b="Small fine-tuning run (LoRA/PEFT).")
wk("S7A", ["P23.5", "P23.6"], ["P01.3:16-19"], b="Inference benchmarking.")
wk("S7A", ["P24.0:1-8"], b="Ingestion + chunking + hybrid retrieval prototype.")
wk("S7A", ["P24.0:9-15"], b="Reranking + citation grounding + retrieval metrics.")
wk("S7A", ["P24.1"], b="Reproduce each RAG failure mode.")
wk("S7A", ["P27.0", "P27.1"], b="Build a labelled evaluation set.")
wk("S7A", ["P27.2"], b="Regression suite across evaluation levels.")
wk("S7A", ["P25.0:1-7"], b="Deterministic tool use first.")
wk("S7A", ["P25.0:8-13"], b="Bounded agent loop with guardrails and evaluation.")
wk("S7A", ["P39.3"], b="Prompt-injection and data-leak threat model.")
wk("S7A", ["P44.0"], b="AI system design note combining the S7A pieces.")
wk("S7A", ["PR10", "P24.2"], proj="PR10", b="PR10 RAG Research Platform: ingestion, parsing, chunking, embeddings.")
wk("S7A", ["PR10"], proj="PR10", b="PR10 retrieval, reranking, generation, citations.")
wk("S7A", ["PR10"], proj="PR10", b="PR10 evaluation set + failure analysis.")
wk("S7A", ["PR10"], proj="PR10", b="PR10 auth, logging, security.")
wk("S7A", ["PR10"], proj="PR10", b="PR10 observability + cost notes.")
wk("S7A", ["CONSOLIDATE"], g="C6", b="C6 practical gate: evaluated AI system with evaluation set, retrieval/tool tests, failure analysis, observability.")
# S7B Systems depth
wk("S7B", ["P35.1", "P35.2:1-10"], b="Design exercise at D3.", n="Second pass at D3-D4.")
wk("S7B", ["P35.2:11-19"], b="Capacity estimation drills.")
wk("S7B", ["P35.3"], b="Design two systems from the master list.")
wk("S7B", ["P35.3"], b="Design two more; compare trade-offs.")
wk("S7B", ["P36.0:1-8"], b="MIT 6.5840 lab (as prerequisites permit).")
wk("S7B", ["P36.0:9-15"], b="Idempotency and retry experiments.")
wk("S7B", ["P36.0:16-20"], b="Replicated key-value store or Raft lab.")
wk("S7B", ["P37.0", "P37.1", "P37.2"], b="Design and defend recommendation + fraud systems.")
wk("S7B", ["P37.3", "P37.4", "P37.5"], b="Design and defend search, serving platform, RAG systems.")
wk("S7B", ["P42.0", "P42.1"], b="Feature-store design for PR07.")
wk("S7B", ["P42.2"], b="Distributed-training concepts exercise.")
wk("S7B", ["P42.3"], b="Quantisation/distillation experiment.")
wk("S7B", ["P42.4"], b="High-scale inference analysis.")
wk("S7B", ["P26.0:1-5"], b="Vision-language model exploration.")
wk("S7B", ["P26.0:6-10"], b="One multimodal project from the master list.")
wk("S7B", ["CONSOLIDATE"], g="SG7", b="Systems exit review.")
# S8 Research + specialisation
wk("S8", ["P40.1"], b="Read and annotate papers with the master question list.")
wk("S8", ["P40.2"], b="Choose one paper to reproduce.")
wk("S8", ["P40.3"], b="Experiment tracking discipline on the reproduction.")
wk("S8", ["P40.4"], b="Write the reproduction report.")
for i in range(4):
    wk("S8", ["RESEARCH"], b=f"Paper reproduction, part {i+1} of 4.")
wk("S8", ["SPECIALISE"], b="Select one specialisation (master specialisation strategy).")
for i in range(8):
    wk("S8", ["SPECIALISE"], b=f"Specialisation depth block {i+1} of 8 (content per chosen track).")
for i, t in enumerate(["requirements + architecture", "data service", "data service", "analytics service", "ML layer",
                       "ML layer", "AI service: retrieval", "AI service: evaluation", "frontend (P01.3)",
                       "observability + security", "cost + performance reports", "documentation set + demo"]):
    wk("S8", ["PR11"], proj="PR11", b=f"PR11 Intelligent Financial Research Platform: {t}.")
