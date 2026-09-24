# -*- coding: utf-8 -*-
"""Export the canonical curriculum + reconciled 206-week mapping as JSON for the web app.

Run order (from repo root):  npm run data:build
  1. parse_master.py   master markdown -> _build/master_phases.json
  2. build_data.py     (imports engine + render) -> data/*.json and curriculum/docs/*.md

The app only reads data/*.json. Nothing in the UI hardcodes curriculum content.
"""
import json, re, os, datetime
from pathlib import Path
from collections import OrderedDict, defaultdict

import reconcile_data as R
import engine as E
import render as RD

HERE = Path(__file__).resolve().parent
DATA = HERE.parent.parent / "data"
DATA.mkdir(exist_ok=True)
L = RD.L


def dump(name, obj):
    p = DATA / name
    p.write_text(json.dumps(obj, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"  {name:22} {p.stat().st_size:>9,} bytes")


def md(lines):
    return "\n".join(RD.demote(lines)).strip()


def bullets(lines):
    out = []
    in_code = False
    for s in lines:
        if s.strip().startswith("```"):
            in_code = not in_code
            continue
        if in_code:
            continue
        m = re.match(r"^\s*(?:-|\d+\.)\s+(.*)$", s)
        if m:
            out.append(m.group(1).strip())
    return out


# ------------------------------------------------------------------ gates in order
GATE_ORDER = sorted(E.GATE_CW.items(), key=lambda x: x[1])  # [(id, cw)]


def required_gate_for_week(cw):
    prev = [g for g, gcw in GATE_ORDER if gcw < cw]
    return prev[-1] if prev else None


# ------------------------------------------------------------------ depth parsing
def depth_of(text):
    nums = [int(n) for n in re.findall(r"D(\d)", text or "")]
    if not nums:
        return None
    return {"min": min(nums), "max": max(nums), "raw": text.strip()}


def topic_depth(c):
    if depth_of(c["meta"]):
        return depth_of(c["meta"])
    if c.get("parent"):
        par = E.COMPS[c["parent"]]
        if depth_of(par["meta"]):
            return depth_of(par["meta"])
    ph = E.PHASES[c["phase"]]
    return depth_of(ph["target"]) if ";" not in ph["target"] else None


# ------------------------------------------------------------------ topics (components) + concepts
ON_DEMAND_GATE = {"P05.4": "C2", "P41.0": "C5", "P43.0": "C5", "P46.0": None}

first_week = {}
topic_weeks = defaultdict(list)
for w in E.WEEKS:
    for lane_key, lane in (("p", "primary"), ("s", "supporting")):
        for sl in w[lane_key]:
            k, cid, idx = E.parse_slice(sl)
            if k == "comp":
                ids = None if idx is None else [f"{cid}#{i}" for i in sorted(idx)]
                topic_weeks[cid].append({"cw": w["cw"], "lane": lane, "conceptIds": ids})
                first_week.setdefault(cid, w["cw"])
for a, b, sls, note in R.DSA_LANE:
    for sl in sls:
        k, cid, idx = E.parse_slice(sl)
        ids = None if idx is None else [f"{cid}#{i}" for i in sorted(idx)]
        topic_weeks[cid].append({"cw": a, "cwEnd": b, "lane": "dsa", "conceptIds": ids})
        if cid not in first_week or a < first_week[cid]:
            first_week[cid] = a

# predecessors from component edges
preds = defaultdict(list)
for a, b, why in R.COMPONENT_EDGES:
    target = b.split("#")[0]
    if target in E.COMPS:
        preds[target].append({"from": a, "to": b, "reason": why})

# mastery statements (gate-text components) apply to sibling topics
mastery_by_scope = defaultdict(list)
for cid, c in E.COMPS.items():
    if c["kind"] == "gate-text":
        scope = c.get("parent") or c["phase"]
        mastery_by_scope[scope].append(cid)

topics, concepts = [], []
for cid, c in E.COMPS.items():
    blocks, run = [], []
    in_code = False
    n = 0
    if c["kind"] != "concepts":
        txt = md(c["lines"])
        topics.append({
            "id": cid, "phaseId": c["phase"], "parentId": c.get("parent"), "title": c["title"],
            "label": E.comp_label(cid), "meta": c["meta"], "kind": c["kind"], "depth": topic_depth(c),
            "conceptIds": [], "blocks": [{"t": "md", "md": txt}] if txt else [], "weeks": topic_weeks.get(cid, []),
            "firstWeek": first_week.get(cid), "requiredGate": required_gate_for_week(first_week[cid]) if cid in first_week else None,
            "onDemand": None, "predecessors": [], "masteryStatements": [],
        })
        continue
    for s in c["lines"]:
        if s.strip().startswith("```"):
            in_code = not in_code
            run.append(s)
            continue
        m = E.ITEM_RE.match(s) if not in_code else None
        if m:
            n += 1
            if run:
                blocks.append({"t": "md", "md": md(run)})
                run = []
            if blocks and blocks[-1]["t"] == "concepts":
                blocks[-1]["ids"].append(f"{cid}#{n}")
            else:
                blocks.append({"t": "concepts", "ids": [f"{cid}#{n}"]})
            continue
        if not in_code and re.match(r"^#{1,6} ", s):
            s = "**" + re.sub(r"^#{1,6} ", "", s).strip() + "**"
        run.append(s)
    if run:
        txt = md(run)
        if txt:
            blocks.append({"t": "md", "md": txt})
    cids = [f"{cid}#{i}" for i in range(1, len(c["items"]) + 1)]
    for i, text in enumerate(c["items"], 1):
        concepts.append({"id": f"{cid}#{i}", "topicId": cid, "phaseId": c["phase"], "index": i, "text": text})
    on_demand = cid in R.ON_DEMAND
    fw = first_week.get(cid)
    req_gate = required_gate_for_week(fw) if fw else ON_DEMAND_GATE.get(cid)
    scope_keys = [k for k in (c.get("parent"), c["phase"]) if k]
    mastery = []
    for k in scope_keys:
        mastery += [x for x in mastery_by_scope.get(k, []) if x != cid]
    topics.append({
        "id": cid,
        "phaseId": c["phase"],
        "parentId": c.get("parent"),
        "title": c["title"],
        "label": E.comp_label(cid),
        "meta": c["meta"],
        "kind": c["kind"],
        "depth": topic_depth(c),
        "conceptIds": cids,
        "blocks": blocks,
        "weeks": topic_weeks.get(cid, []),
        "firstWeek": fw,
        "requiredGate": req_gate,
        "onDemand": R.ON_DEMAND.get(cid),
        "predecessors": preds.get(cid, []),
        "masteryStatements": sorted(set(mastery)),
    })

# concept -> weeks
concept_weeks = defaultdict(list)
for t in topics:
    for w in t["weeks"]:
        ids = w["conceptIds"] if w["conceptIds"] is not None else t["conceptIds"]
        for x in ids:
            concept_weeks[x].append(w["cw"])
for c in concepts:
    c["weeks"] = sorted(set(concept_weeks.get(c["id"], [])))
od_items = {}
for k, v in R.ON_DEMAND.items():
    if "#" in k:
        cid, rng = k.split("#")
        a, b = rng.split("-")
        for i in range(int(a), int(b) + 1):
            od_items[f"{cid}#{i}"] = v
for c in concepts:
    if c["id"] in od_items:
        c["onDemand"] = od_items[c["id"]]

# ------------------------------------------------------------------ phases
phase_desc = {}
for ph, lst in RD.RES_NOTES.items():
    for g, lab, txt in lst:
        if lab.lower() == "concept coverage" and ph not in phase_desc:
            phase_desc[ph] = txt
phases = []
for ph, p in E.PHASES.items():
    tids = [c["id"] for c in p["components"]]
    weeks = sorted({w["cw"] for t in topics if t["phaseId"] == ph for w in t["weeks"]})
    phases.append({
        "id": ph,
        "number": p["phase"],
        "title": E.NICE[ph],
        "masterTitle": p["title"],
        "description": phase_desc.get(ph, ""),
        "priority": RD.pri_label(ph),
        "target": p["target"] or "not stated in master",
        "depth": depth_of(p["target"]),
        "gate": p["gate"],
        "unlockNote": R.UNLOCK_NOTE.get(ph, ""),
        "prerequisites": [{"id": a, "source": t} for a, t in R.PREREQ.get(ph, [])],
        "stages": RD.stages_of_phase(ph),
        "placement": RD.placement(ph),
        "topicIds": tids,
        "weekRange": [weeks[0], weeks[-1]] if weeks else None,
        "masterSection": p["master_section"],
    })

# ------------------------------------------------------------------ checkpoints
ck_blocks = OrderedDict()
cur = None
for s in RD.section("85"):
    m = re.match(r"^## Checkpoint (\d) - (.+)$", s)
    if m:
        cur = f"C{m.group(1)}"
        ck_blocks[cur] = []
        continue
    if cur:
        ck_blocks[cur].append(s)

a = next(i for i, s in enumerate(L) if s.startswith("Before leaving the initial programming reset"))
b = next(i for i in range(a, len(L)) if L[i].startswith("If these still require"))
g0_criteria = bullets(L[a:b])
fg_a = next(i for i, s in enumerate(L) if s.startswith("### The first gate"))
fg_text = " ".join(x.strip() for x in L[fg_a + 1:fg_a + 4] if x.strip())

STAGE_GATE_DESC = {
    "SG2": ("DSA and SQL foundations", "DSA fundamentals (P04.1, P04.2, P04.5#1–7) and SQL/PostgreSQL basics (P06.1, P06.1a, P06.2).", ["P04.1", "P04.2", "P06.1", "P06.1a", "P06.2"]),
    "SG3": ("Data and statistics gates", "Data gate (P11.1–P11.3) + statistics gate (P10.3#1–16, P10.4#1–11). Master: classical ML may begin only when the programming, data, and statistics gates are genuinely passing.", ["P10.3", "P10.4", "P11.1", "P11.2", "P11.3"]),
    "SG4": ("Foundation Reset exit", "All S0–S4 components re-tested; PR01–PR03 complete.", ["PR01", "PR02", "PR03", "P07.5", "P08.3"]),
    "SG5": ("Stage 5 exit", "C2, C4 and C3 passed; PR04–PR07 complete.", ["C2", "C4", "C3", "PR07"]),
    "SG6A": ("Deep-learning gates", "Deep-learning phase gates (P19–P21).", ["P19.5", "P20.0", "P21.0"]),
    "SG7": ("Systems exit", "Systems depth phase gates (P35–P37, P42, P26).", ["P35.3", "P36.0", "P37.5", "P42.4", "P26.0"]),
}
gating_rule = bullets(RD.subsection0("0.9", "0.10"))

checkpoints = []
for cid, title, src, reqs in R.CHECKPOINTS:
    body = ck_blocks.get(cid, [])
    criteria, practical, note = [], "", ""
    if cid == "G0":
        criteria = g0_criteria
        practical = fg_text
    else:
        mode = None
        for s in body:
            if s.strip().startswith("Pass when you can"):
                mode = "c"; continue
            if s.startswith("### Practical gate"):
                mode = "p"; continue
            m = re.match(r"^\s*-\s+(.*)$", s)
            if mode == "c" and m:
                criteria.append(m.group(1).strip())
            elif mode == "p" and s.strip():
                practical = (practical + " " + s.strip()).strip()
            elif mode == "c" and s.strip() and not m:
                note = (note + " " + s.strip()).strip()
    checkpoints.append({
        "id": cid, "title": title, "kind": "initial" if cid == "G0" else "competency",
        "source": src, "gateWeek": E.GATE_CW.get(cid), "requires": reqs,
        "criteria": criteria, "practicalGate": practical, "note": R.CHECKPOINT_NOTES.get(cid, note),
    })
for sg, (title, desc, reqs) in STAGE_GATE_DESC.items():
    checkpoints.append({
        "id": sg, "title": title, "kind": "stage", "source": "Master phase-gating rule applied at a stage boundary",
        "gateWeek": E.GATE_CW[sg], "requires": reqs, "criteria": gating_rule, "practicalGate": desc, "note": "",
    })
order = {g: i for i, (g, _) in enumerate(GATE_ORDER)}
checkpoints.sort(key=lambda c: order.get(c["id"], 999))

# ------------------------------------------------------------------ projects
pnum = {"PR01": "53", "PR02": "54", "PR03": "55", "PR04": "56", "PR05": "57", "PR06": "58", "PR07": "59",
        "PR08": "60", "PR09": "61", "PR10": "62", "PR11": "63"}
qs_lines = RD.section("64")
quality = {"general": [], "ml": [], "ai": []}
mode = "general"
for s in qs_lines:
    if s.startswith("For ML projects"):
        mode = "ml"; continue
    if s.startswith("For AI projects"):
        mode = "ai"; continue
    m = re.match(r"^\s*(?:-|\d+\.)\s+(.*)$", s)
    if m:
        quality[mode].append(m.group(1).strip())
deep_dive = bullets(next((RD.section(x) for x in ["66.6"]), []) or [])
if not deep_dive:
    a = next(i for i, s in enumerate(L) if s.startswith("## 66.6"))
    b = next(i for i in range(a + 1, len(L)) if L[i].startswith("#"))
    deep_dive = bullets(L[a:b])
ML_PROJECTS = {"PR06", "PR07", "PR08", "PR09", "PR10", "PR11"}
AI_PROJECTS = {"PR10", "PR11"}
projects = []
for pid, title, reqs, ev in R.PROJECTS:
    body = RD.section(pnum[pid])
    prose = [s.strip() for s in body if s.strip() and not s.strip().endswith(":") and not re.match(r"^\s*(?:-|\d+\.)\s", s) and not s.startswith("```") and not s.startswith("#") and s.strip() != "---" and "→" not in s and "↓" not in s]
    ws = [w for w in E.WEEKS if w["proj"] == pid or pid in w["p"]]
    related = []
    for w in ws:
        for sl in w["p"] + w["s"]:
            k, cid, idx = E.parse_slice(sl)
            if k == "comp" and cid not in related:
                related.append(cid)
    for r_ in reqs:
        if r_ in E.COMPS and r_ not in related:
            related.append(r_)
    projects.append({
        "id": pid, "number": int(pid[2:]), "title": title,
        "purpose": prose[0] if prose else f"Canonical project {int(pid[2:])} of the master project ladder.",
        "requires": reqs, "evidenceFor": ev,
        "buildWeeks": [w["cw"] for w in ws],
        "milestones": [{"id": f"{pid}-M{i}", "cw": w["cw"], "text": w["b"]} for i, w in enumerate(ws, 1)],
        "relatedTopics": related,
        "skills": bullets(body),
        "bodyMd": md(body),
        "qualityProfile": ["general"] + (["ml"] if pid in ML_PROJECTS else []) + (["ai"] if pid in AI_PROJECTS else []),
    })

# ------------------------------------------------------------------ tracks
secs = {"T01": "65", "T02": "66", "T03": "67", "T04": "68", "T05": "69", "T06": "70", "T07": "71",
        "T08": "72", "T09": "73", "T10": "74", "T11": "75"}
tracks = []
for tid, name, _, act in R.TRACKS:
    body = RD.section(secs[tid], stop_at_sub=False) if tid == "T02" else RD.section(secs[tid])
    if tid == "T08":
        body = body + ["", "**International / cross-border career reality**", ""] + RD.section("72.1")
    items = bullets(body)
    tracks.append({"id": tid, "title": name, "activation": act, "bodyMd": md(body),
                   "items": [{"id": f"{tid}#{i}", "text": t} for i, t in enumerate(items, 1)]})

# portfolio stages from T09 text
portfolio = []
curst = None
for s in RD.section("73"):
    m = re.match(r"^## Stage ([A-D]) - (.+)$", s)
    if m:
        curst = {"id": f"PS-{m.group(1)}", "title": f"Stage {m.group(1)}: {m.group(2)}", "items": []}
        portfolio.append(curst); continue
    mm = re.match(r"^\s*-\s+(.*)$", s)
    if mm and curst:
        curst["items"].append(mm.group(1).strip())
a = next(i for i, s in enumerate(L) if s.startswith("## 66.5"))
b = next(i for i in range(a + 1, len(L)) if L[i].startswith("## "))
story_themes = bullets(L[a:b])

# ------------------------------------------------------------------ resources
resources = []
for rid, r in RD.REG.items():
    scope = r["scope"]
    ph = scope.split(" / ", 1)[0] if scope.startswith("P") else None
    group = scope.split(" / ", 1)[1] if " / " in scope else ""
    resources.append({"id": rid, "phaseId": ph, "group": group, "label": r["label"], "name": r["name"],
                      "url": r["url"] or None, "note": r["note"] or ""})
tools = [{"id": row[0], "name": row[1], "activation": row[2], "route": row[3], "url": row[4] if row[4].startswith("http") else None,
          "reference": row[4]} for row in RD.TOOL_ROWS]
# topic <-> resource association by group title
def norm_title(x):
    return x.lower().replace(" / ", " and ").strip()


title_to_topics = defaultdict(list)
for t in topics:
    title_to_topics[norm_title(t["title"])].append(t["id"])
resource_notes = []
for r in resources:
    ids = []
    if r["group"]:
        g = norm_title(r["group"])
        cands = [tid for tid in title_to_topics.get(g, [])]
        same = [tid for tid in cands if tid.startswith(r["phaseId"] + ".")] if r["phaseId"] else []
        ids = same or cands
        if cands and not same and r["phaseId"]:
            resource_notes.append(f"{r['id']}: master lists group '{r['group']}' under {r['phaseId']}; associated with {', '.join(cands)} by title.")
    r["topicIds"] = ids

# ------------------------------------------------------------------ weeks
def slice_obj(sl):
    k, cid, idx = E.parse_slice(sl)
    if k == "comp":
        return {"ref": sl, "kind": "topic", "topicId": cid,
                "conceptIds": None if idx is None else [f"{cid}#{i}" for i in sorted(idx)],
                "label": E.slice_label(sl)}
    if k == "project":
        return {"ref": sl, "kind": "project", "projectId": cid, "label": E.slice_label(sl)}
    return {"ref": sl, "kind": "activity", "activity": cid, "label": E.PSEUDO[cid]}

a = next(i for i, s in enumerate(L) if s.startswith("### First 14 days"))
day_plan = []
for s in L[a:a + 14]:
    m = re.match(r"^(Days? \d+(?:-\d+)?)\s+(.+)$", s)
    if m:
        day_plan.append({"days": m.group(1), "focus": m.group(2).strip()})

weeks = []
for w in E.WEEKS:
    lane, lnote, la, lb = E.dsa_lane_for(w["cw"])
    weeks.append({
        "cw": w["cw"], "stage": w["stage"], "mainStage": w["main_stage"], "type": w["type"],
        "primary": [slice_obj(s) for s in w["p"]],
        "supporting": [slice_obj(s) if s != "SETUP" else {"ref": "SETUP", "kind": "activity", "activity": "SETUP", "label": E.PSEUDO["SETUP"]} for s in w["s"]],
        "dsaLane": {"slices": [slice_obj(s) for s in lane], "note": lnote} if (lane or lnote) and w["cw"] >= 18 else None,
        "project": w["proj"] or None,
        "build": w["b"], "note": w["n"], "gate": w["g"] or None,
        "requiredGate": required_gate_for_week(w["cw"]),
        "conceptCount": w["concepts"],
        "dayPlan": ({"days": "1-7", "plan": day_plan} if w["cw"] == 1 else {"days": "8-14", "plan": day_plan} if w["cw"] == 2 else None),
    })

# ------------------------------------------------------------------ stages
stages = []
for sid, name, basis, entry, exitg in R.STAGES:
    ws = [w["cw"] for w in E.WEEKS if w["main_stage"] == sid]
    stages.append({"id": sid, "name": name, "basis": basis, "entry": entry, "exit": exitg, "range": [min(ws), max(ws)], "parent": None})
for sid, (name, ex) in R.SUBSTAGES.items():
    ws = [w["cw"] for w in E.WEEKS if w["stage"] == sid]
    stages.append({"id": sid, "name": name, "basis": "", "entry": "", "exit": ex, "range": [min(ws), max(ws)], "parent": sid[:2]})

# ------------------------------------------------------------------ meta
depth_model = []
cur = None
for s in RD.section("3"):
    m = re.match(r"^## D(\d) - (.+)$", s)
    if m:
        cur = {"level": int(m.group(1)), "name": m.group(2).strip(), "definition": ""}
        depth_model.append(cur); continue
    if s.startswith("###"):
        cur = None; continue
    if cur and s.strip():
        cur["definition"] = (cur["definition"] + " " + s.strip()).strip()
depth_notes = []
grab = False
for s in RD.section("3"):
    if s.startswith("### Important"):
        grab = True; continue
    if grab and s.strip():
        depth_notes.append(s.strip())

priority_model = []
for s in RD.section("4"):
    m = re.match(r"^## (\S+) (.+)$", s)
    if m:
        priority_model.append({"symbol": m.group(1), "name": m.group(2).title(), "definition": ""}); continue
    if priority_model and s.strip() and s.strip() != "---":
        priority_model[-1]["definition"] = (priority_model[-1]["definition"] + " " + s.strip()).strip()

evidence_loop = bullets(RD.subsection0("0.5", "0.6"))
MASTERY = [
    {"level": 0, "id": "not_started", "name": "Not started", "master": "No evidence yet."},
    {"level": 1, "id": "learning", "name": "Learning", "master": "Learn."},
    {"level": 2, "id": "explained", "name": "Explained", "master": "Explain without notes; reason through the mechanism where appropriate."},
    {"level": 3, "id": "practised", "name": "Practised", "master": "Implement a small version where educationally useful; solve targeted exercises/problems; use the mature library or real tool."},
    {"level": 4, "id": "demonstrated", "name": "Demonstrated", "master": "Build something with it; break or debug something involving it; document what you learned; pass the practical mastery check (phase-gating rule)."},
    {"level": 5, "id": "retained", "name": "Retained", "master": "Re-test it later (spaced-retest rule: 1-3 days, 7 days, 30 days, 90 days, 6 months)."},
]
daily_unit = []
for s in RD.section("83"):
    m = re.match(r"^([\d\-]+) min - (.+)$", s.strip())
    if m:
        daily_unit.append({"minutes": m.group(1), "step": m.group(2)})

meta = {
    "source": {"file": "curriculum/source/MASTER_ROADMAP_VICTOR_2026_FINAL_2026-09-17.md", "md5": RD.MD5,
               "version": RD.VERSION, "generated": datetime.date.today().isoformat()},
    "depthModel": depth_model, "depthNotes": depth_notes, "priorityModel": priority_model,
    "masteryStates": MASTERY, "evidenceLoop": evidence_loop, "phaseGatingRule": gating_rule,
    "spacedRetestDays": [2, 7, 30, 90, 180],
    "dailyWorkUnit": daily_unit,
    "operatingRulesMd": md(RD.subsection0("0.2", "0.12")),
    "weeklyModelMd": md(RD.section("81")), "monthlyReviewMd": md(RD.section("84")),
    "recoveryMd": md(RD.section("86.1")),
    "dependencySpine": ["Python", "Git + Linux / CLI", "DSA + SQL", "Statistics / Probability + Linear Algebra",
                        "NumPy / Pandas + EDA", "Software Engineering + Backend", "Classical ML", "Docker / CI/CD / Cloud",
                        "Deep Learning", "ML Engineering / MLOps", "Transformers / LLMs / AI Engineering"],
    "decision5": ["Classical ML (P13–P16)", "Docker / CI/CD / Cloud (P31, P32)", "Deep Learning (P19–P21)",
                  "ML Engineering / MLOps (P28–P30)", "Transformers / LLMs (P22–P27)"],
    "dsaLane": [{"from": a, "to": b, "slices": [slice_obj(s) for s in sls], "note": note} for a, b, sls, note in R.DSA_LANE],
    "onDemand": R.ON_DEMAND,
    "onDemandGates": ON_DEMAND_GATE,
    "gateOrder": [g for g, _ in GATE_ORDER],
    "quality": quality, "deepDiveQuestions": deep_dive, "portfolioStages": portfolio, "storyThemes": story_themes,
    "resourceNotes": resource_notes,
    "componentEdges": [{"from": a, "to": b, "reason": why} for a, b, why in R.COMPONENT_EDGES],
    "validation": {
        "conceptCoverage": list(E.report["coverage_items"]),
        "phaseDependencyViolations": len(E.report["phase_dependency_violations"]),
        "componentEdgeViolations": len(E.report["component_edge_violations"]),
        "checkpointViolations": len(E.report["checkpoint_violations"]),
        "projectViolations": len(E.report["project_violations"]),
    },
}


# ------------------------------------------------------------------ compact client index (shipped to the browser)
tmap = {t["id"]: t for t in topics}
def units_of(tid):
    t = tmap[tid]
    if t["kind"] != "concepts":
        return []
    return t["conceptIds"] if t["conceptIds"] else [tid]

def slice_units(s):
    if s["kind"] != "topic":
        return []
    t = tmap[s["topicId"]]
    if t["kind"] != "concepts":
        return []
    return s["conceptIds"] if s["conceptIds"] is not None else units_of(s["topicId"])

def short(s):
    if s["kind"] == "topic":
        t = tmap[s["topicId"]]
        rng = ""
        if s["conceptIds"]:
            idx = [int(x.split("#")[1]) for x in s["conceptIds"]]
            rng = f" #{idx[0]}–{idx[-1]}" if len(idx) > 1 else f" #{idx[0]}"
        return f"{t['id']} {t['label']}{rng}"
    return s["label"]

client_index = {
    "phases": [{"id": p["id"], "t": p["title"], "topics": [x for x in p["topicIds"] if tmap[x]["kind"] == "concepts"]} for p in phases],
    "topics": [{
        "id": t["id"], "p": t["phaseId"], "t": t["label"], "n": len(units_of(t["id"])), "w": t["firstWeek"], "g": t["requiredGate"],
        "od": bool(t["onDemand"]), "d": [t["depth"]["min"], t["depth"]["max"]] if t["depth"] else None,
        "pre": sorted({e["from"] for e in t["predecessors"] if e["from"] in tmap and "#" not in e["to"]}),
        "cpre": [[e["to"], e["from"]] for e in t["predecessors"] if "#" in e["to"] and e["from"] in tmap],
    } for t in topics if t["kind"] == "concepts"],
    "ct": {c["id"]: c["text"] for c in concepts},
    "weeks": [{
        "cw": w["cw"], "s": w["stage"], "ty": w["type"], "g": w["gate"], "rg": w["requiredGate"],
        "u": [u for sl in w["primary"] + w["supporting"] for u in slice_units(sl)],
        "pu": [u for sl in w["primary"] for u in slice_units(sl)],
        "t": " + ".join(short(sl) for sl in w["primary"]), "b": w["build"], "pj": w["project"],
    } for w in weeks],
    "gates": [{"id": c["id"], "t": c["title"], "k": c["kind"], "w": c["gateWeek"], "n": len(c["criteria"]), "r": c["requires"]} for c in checkpoints],
    "projects": [{"id": p["id"], "t": p["title"], "m": [m["id"] for m in p["milestones"]], "w": p["buildWeeks"]} for p in projects],
    "stages": [{"id": st["id"], "n": st["name"], "r": st["range"], "p": st["parent"]} for st in stages],
    "retest": meta["spacedRetestDays"],
}

print("writing data/ ...")
dump("meta.json", meta)
dump("stages.json", stages)
dump("phases.json", phases)
dump("topics.json", topics)
dump("concepts.json", concepts)
dump("checkpoints.json", checkpoints)
dump("projects.json", projects)
dump("tracks.json", tracks)
dump("resources.json", {"resources": resources, "tools": tools})
dump("weeks.json", weeks)
(DATA / "client-index.json").write_text(json.dumps(client_index, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
print(f"  client-index.json     {(DATA / 'client-index.json').stat().st_size:>9,} bytes")
print(f"phases {len(phases)}  topics {len(topics)}  concepts {len(concepts)}  weeks {len(weeks)}  checkpoints {len(checkpoints)}  projects {len(projects)}  tracks {len(tracks)}  resources {len(resources)}  tools {len(tools)}")
