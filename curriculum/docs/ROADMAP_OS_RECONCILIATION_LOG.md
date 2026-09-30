# ROADMAP OS — RECONCILIATION LOG

**Version:** v1.0 (2026-09-24)

## 1. Source status

| File | Status | Reason |
|---|---|---|
| `MASTER_ROADMAP_VICTOR_2026_FINAL_2026-09-17.md` | **Canonical curriculum authority** | Decision 1. MD5 `090f7c1c3e34bf04390f5c92373347d6`. |
| `VICTOR_MASTER_WEEKLY_EXECUTION_ROADMAP_2026_FINAL.md` | **Superseded as schedule content; role kept** | Decision 2: the execution layer is rebuilt from the master as `ROADMAP_OS_PHASE_WEEK_MAPPING.md`. MD5 `04214c8233b806aeb05afb34970b6849`. |
| `MASTER_ROADMAP_VICTOR_2026_FINAL_2026-09-17__1_.md` | Archived | Byte-identical duplicate of the master. |
| `01_FOUNDATION_AND_CORE_ENGINEERING.md` … `04_EXECUTION_CAREER_RESEARCH_AND_FINAL_REFERENCE.md` | Archived | Exact split of the master (concatenation is byte-identical). |
| `VICTOR_MASTER_EXECUTION_ROADMAP_2026-09.md` | Archived | Old day-by-day plan; superseded. |
| `VICTOR_MASTER_EXECUTION_ROADMAP_2026-09.pdf` | Archived | Rendering of the old plan. |

Archived files still sit in the Project's knowledge until they are removed from the Project's files. Until then they must not be used as a source.

## 2. Decisions applied

| # | Decision | How it was applied |
|---|---|---|
| 1 | Master is the curriculum authority. | All phase, component and concept content is generated from the master text; the curriculum file carries the master checksum. |
| 2 | Weekly roadmap is the execution layer under the master. | The old weekly file was not edited. Its schedule was rebuilt from master phases, dependencies and stage timeline. Conflicts resolved in the master's favour. |
| 3 | Duplicate, splits, old execution roadmap and PDF archived. | Marked archived above. They contribute nothing to the new files. |
| 4 | No compression into a 52-week Year 1. | S0–S4 (Foundation Reset) = CW001–CW046. Classical ML starts at CW072, deep learning at CW102, Transformers at CW139. |
| 5 | Enforced chain Classical ML → Docker/CI/CD/Cloud → DL → ML Eng/MLOps → Transformers/LLMs. | Encoded as phase prerequisites tagged D5 and component edges; validated automatically (0 violations). |
| 6 | 14-day Python plan is the formal initial Python gate. | G0 at CW002. Python fluency continues in S1 (P01.1b–P01.1d, P01.1f builds). C1 is the full programmer checkpoint at CW014. |
| 7 | Master's 7 checkpoints and 11 projects are the only canonical IDs. | C1–C7 and PR01–PR11 used throughout. Old gates (9-gate list, documentation milestones A–E) and the extra 'Deep-learning project' are not included. G0 and SG stage gates are process gates, not competency checkpoints. |
| 8 | Curriculum and university timelines modelled separately. | Curriculum weeks are undated active weeks. Graduation (2028) belongs to the calendar layer and does not shorten the curriculum. |
| 9 | Structure first, then weeks, then dates. | This release stops at the undated phase-to-week mapping. |
| 10 | Data-quality fixes. | See section 4. |
| 11 | Phase numbers are the primary identifiers. | IDs P01–P46 with component and concept sub-IDs; master section numbers and heading levels are ignored. |

## 3. Conflicts inside the master and how they were resolved

### Transformers vs ML engineering order

- **Conflict:** The master learning sequence lists Attention (28) and Transformers (29) before ML Engineering (30) and MLOps (31), and the 2028–2029 timeline bundles them. The dependency spine puts Transformers after ML Engineering/MLOps.
- **Resolution:** Decision 5 follows the spine. P22 starts at CW139, after C5. Attention reading is allowed as optional exposure at CW111 but is never gated.

### Model serving position

- **Conflict:** The learning sequence puts model serving (24) before PyTorch (25); decision 5 does not name serving.
- **Resolution:** P29 is split: an early D1–D2 segment serving a classical model (CW096, after Docker/Cloud) and the formal D3 pass after ML engineering (CW115–CW117).

### From-scratch ML needs deep learning for two items

- **Conflict:** P16 lists 'Simple neural network' and 'Backpropagation' alongside classical algorithms.
- **Resolution:** P16 #1–6 and #9–14 run in S5B; #7–8 run with P19 in S6A (CW103).

### Mathematics spread across stages

- **Conflict:** The timeline puts statistics, probability and linear algebra in the foundation year; the learning sequence puts calculus and optimisation after ML theory; PCA needs eigen/SVD.
- **Resolution:** P10.3#1–16, P10.4#1–11 and P10.1a–c in S3; P10.1d–e before P13.5; P10.2 and P10.5 before P16; remaining statistics items (regression, ANOVA, experimental design, A/B, Bayesian) beside the matching ML weeks.

### Software engineering placement

- **Conflict:** The spine puts Software Engineering + Backend after NumPy/EDA; the learning sequence puts OOP + software engineering basics right after Linux.
- **Resolution:** P07.3–P07.4 enter at D1–D2 in S1 (CW011) to support PR01 and C1; full P07 and P08 run in S4.

### C3 deployment vs Docker timing

- **Conflict:** C3 requires a real deployment, but decision 5 places Docker/CI/CD/Cloud after classical ML.
- **Resolution:** PR03 is built in S4; auth is added in S5A; C3 is passed in S5C (CW095) after containerisation, CI and the cloud project.

### Recommender systems placement

- **Conflict:** Phase 18 sits before deep learning in master numbering but needs embeddings and a serving API (PR08).
- **Resolution:** P18 runs in S6B after P19 and P28–P29.

### Phase 12 later technologies

- **Conflict:** Airflow, Spark and Kafka are listed under Phase 12 and again under Phase 43 (on demand).
- **Resolution:** P12.0#14–16 are on-demand under P43.

### Java and JavaScript/TypeScript timing

- **Conflict:** Both sit in Phase 1, but the tool registry activates Java as 'Phase 1/7 support' and JS/TS 'Phase 7 onward'.
- **Resolution:** Java runs as a supporting block in S5A (CW047–CW052). JS/TS runs as a supporting block in S7A (CW143–CW146) before PR11's frontend.

## 4. Data-quality fixes

| Issue | Fix |
|---|---|
| Stale 'Week 1 checkpoint' label in Week 4 title | Not carried over. Week titles are generated from component IDs; gate labels come only from the gate list. |
| Duplicated appendix blocks in the weekly file (navigation resources, tool registry, fast-moving AI rules, broken-resource rule) | The execution layer no longer carries an appendix. All resources live once, in the curriculum file's registry. |
| Missing appendix A.2 | Appendix numbering retired with the appendix. |
| Stray master number '76.3' in the weekly appendix | Retired with the appendix; master section numbers are not used as identifiers anywhere. |
| Inconsistent resource URLs (MIT 18.06 2010 page, pytorch.org/tutorials, CMU 15-445 root) | Weeks reference registry IDs only. The registry uses the master's URLs: MIT 18.06SC Fall 2011, docs.pytorch.org/tutorials, CMU 15-445 fall2026. |
| Year 2–4 thinning (one concept line per week) | Every week now names master components and concept ranges. 1440 of 1440 master concept lines are scheduled; mean density per study week ranges from 6.5 to 20.0 concept lines by stage (old weekly file: 1 per week in Years 2–4). |
| Master heading levels unreliable (38 'Target:' lines and subsections at H1) | Parsed by section number and phase header, not by heading level. Output uses one consistent hierarchy. |
| Section numbers offset from phase numbers | Phase IDs only (decision 11). |

## 5. Judgment calls to review

- **Week budgets.** The master is stage-based and gives no durations. Budgets here scale with the master's depth targets and item counts, e.g. D4 components get two or more weeks and projects get three to five build weeks. They are targets; capability decides advancement.
- **Consolidation weeks.** Every gate week is a consolidation week (gate attempt, spaced re-tests, repair). One extra buffer week sits before SG4 and one after C5.
- **S8 length.** Research (8 weeks), specialisation (9) and PR11 (12) are a first pass only. The master treats specialisation as open-ended.

## 6. Open inputs for the next step

1. Week 1 start date.
2. University calendar: semester dates, exam windows, internship/SIWES periods.
3. Whether a university Java course covers P01.2 (frees the S5A supporting slot).
4. Whether an existing fraud-detection project will be upgraded for PR07, as the master allows.

