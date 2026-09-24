# -*- coding: utf-8 -*-
import json, re
from collections import defaultdict, OrderedDict
import reconcile_data as R

from pathlib import Path
D = json.load(open(Path(__file__).resolve().parent / "_build" / "master_phases.json", encoding="utf-8"))
PHASES = OrderedDict((p["id"], p) for p in D["phases"])
COMPS = OrderedDict()
for p in D["phases"]:
    for c in p["components"]:
        c["phase"] = p["id"]
        COMPS[c["id"]] = c

ITEM_RE = re.compile(r"^\s*(-|\d+\.)\s+(.*)$")
LABEL_RE = re.compile(r"^[A-Z][^:]{0,40}:$")


def comp_items(c):
    out, in_code = [], False
    for s in c["lines"]:
        if s.strip().startswith("```"):
            in_code = not in_code
            continue
        if in_code:
            continue
        m = ITEM_RE.match(s)
        if m:
            out.append(m.group(2).strip())
    return out


for c in COMPS.values():
    c["items"] = comp_items(c)
    t = c["title"].lower()
    if t == "resources":
        c["kind"] = "resources"
    elif t in ("mastery", "required understanding"):
        c["kind"] = "gate-text"
    elif t == "critical rule":
        c["kind"] = "rule"
    elif c["id"] in ("P01.1", "P10.1") and not c["items"]:
        c["kind"] = "parent"
    else:
        c["kind"] = "concepts"


NICE = {
 "P01": "Programming Foundations", "P02": "Git, GitHub, Development Environment", "P03": "Linux / CLI",
 "P04": "Data Structures & Algorithms", "P05": "Core Computer Science", "P06": "Databases", "P07": "Software Engineering",
 "P08": "Backend Engineering", "P09": "Software Architecture", "P10": "Mathematics", "P11": "Data Science",
 "P12": "Data Engineering Foundation", "P13": "Classical Machine Learning", "P14": "Machine Learning Theory",
 "P15": "Model Evaluation", "P16": "From-Scratch ML Implementation", "P17": "Time Series", "P18": "Recommender Systems",
 "P19": "Deep Learning", "P20": "Computer Vision", "P21": "Sequence Models and NLP", "P22": "Attention and Transformers",
 "P23": "Modern LLM Engineering", "P24": "Retrieval-Augmented Generation", "P25": "AI Agents", "P26": "Multimodal AI",
 "P27": "AI Evaluation", "P28": "ML Engineering", "P29": "Model Serving", "P30": "MLOps", "P31": "DevOps", "P32": "Cloud",
 "P33": "Terraform / Infrastructure as Code", "P34": "Kubernetes", "P35": "System Design", "P36": "Distributed Systems",
 "P37": "ML System Design", "P38": "Observability", "P39": "Security", "P40": "Research Skills",
 "P41": "Reinforcement Learning", "P42": "Advanced ML System Topics", "P43": "Data / ML Infrastructure",
 "P44": "AI Engineering as a Systems Discipline", "P45": "Cost Engineering", "P46": "Product Thinking for Engineers"}


def comp_label(cid):
    c = COMPS[cid]
    if c.get("parent"):
        return f"{COMPS[c['parent']]['title']} › {c['title']}"
    ph = NICE[c["phase"]]
    if c["title"] == "Core scope":
        return f"{ph} (core scope)"
    return c["title"]


PSEUDO = {"SETUP": "Environment setup (editor, Python, terminal; Git repo only if trivial)",
          "CONSOLIDATE": "Consolidation: gate attempt, spaced re-tests, targeted repair",
          "RESEARCH": "Paper reproduction (P40 reproduction ladder applied)",
          "SPECIALISE": "Specialisation work (master specialisation strategy)"}
PROJECT_TITLES = {pid: t for pid, t, _, _ in R.PROJECTS}


def parse_slice(sl):
    """returns (kind, id, set(indices) or None)"""
    if sl in PSEUDO:
        return ("pseudo", sl, None)
    if sl in PROJECT_TITLES:
        return ("project", sl, None)
    if ":" in sl:
        cid, rng = sl.split(":")
        idx = set()
        for part in rng.split(","):
            a, b = part.split("-") if "-" in part else (part, part)
            idx.update(range(int(a), int(b) + 1))
        return ("comp", cid, idx)
    return ("comp", sl, None)


def slice_label(sl):
    kind, cid, idx = parse_slice(sl)
    if kind == "pseudo":
        return PSEUDO[cid]
    if kind == "project":
        return f"{cid} {PROJECT_TITLES[cid]} (build)"
    c = COMPS[cid]
    base = f"{cid} {comp_label(cid)}"
    if idx is None:
        return base
    items = c["items"]
    ranges, run = [], []
    for i in sorted(idx):
        if run and i == run[-1] + 1:
            run.append(i)
        else:
            if run: ranges.append(run)
            run = [i]
    if run: ranges.append(run)
    parts = []
    for r_ in ranges:
        a, b = r_[0], r_[-1]
        ta, tb = items[a - 1], items[b - 1]
        ta = re.sub(r"`", "", ta); tb = re.sub(r"`", "", tb)
        parts.append(f"#{a}" + (f"–{b}" if b != a else "") + f" ({ta}" + (f" → {tb})" if b != a else ")"))
    return base + " · " + "; ".join(parts)


def short_label(sl):
    kind, cid, idx = parse_slice(sl)
    if kind != "comp" or idx is None:
        return cid
    s = sorted(idx); parts = []; run = [s[0]]
    for i in s[1:]:
        if i == run[-1] + 1: run.append(i)
        else: parts.append(run); run = [i]
    parts.append(run)
    return cid + " #" + ",".join(f"{r[0]}–{r[-1]}" if len(r) > 1 else f"{r[0]}" for r in parts)


def slice_count(sl):
    kind, cid, idx = parse_slice(sl)
    if kind != "comp":
        return 0
    n = len(COMPS[cid]["items"])
    return len(idx) if idx is not None else n


# ---------------------------------------------------------------- assign CW numbers
WEEKS = []
for i, w in enumerate(R.W, start=1):
    w = dict(w)
    w["cw"] = i
    w["main_stage"] = w["stage"][:2]
    WEEKS.append(w)
GATE_CW = {w["g"]: w["cw"] for w in WEEKS if w["g"]}


def dsa_lane_for(cw):
    for a, b, sl, note in R.DSA_LANE:
        if cw >= a and (b is None or cw <= b):
            return sl, note, a, b
    return [], "", None, None


# ---------------------------------------------------------------- appearances
appear = defaultdict(list)  # comp id -> list of (cw, lane, idxset)
phase_first = {}
project_first = {}
for w in WEEKS:
    for lane in ("p", "s"):
        for sl in w[lane]:
            kind, cid, idx = parse_slice(sl)
            if kind == "comp":
                appear[cid].append((w["cw"], lane, idx))
                ph = COMPS[cid]["phase"]
                phase_first.setdefault(ph, w["cw"])
            elif kind == "project":
                project_first.setdefault(cid, w["cw"])
for a, b, sls, _ in R.DSA_LANE:
    for sl in sls:
        kind, cid, idx = parse_slice(sl)
        appear[cid].append((a, "dsa", idx))

# on-demand coverage
on_demand_items = defaultdict(set)
on_demand_whole = set()
for key in R.ON_DEMAND:
    if "#" in key:
        cid, rng = key.split("#")
        a, b = rng.split("-")
        on_demand_items[cid].update(range(int(a), int(b) + 1))
    else:
        on_demand_whole.add(key)

report = OrderedDict()

# ---------------------------------------------------------------- coverage check
uncovered = []
covered_items_total = 0
schedulable_items_total = 0
for cid, c in COMPS.items():
    if c["kind"] != "concepts":
        continue
    n = len(c["items"])
    if cid in on_demand_whole:
        continue
    got = set()
    whole = False
    for cw, lane, idx in appear.get(cid, []):
        if idx is None:
            whole = True
        else:
            got |= idx
    got |= on_demand_items.get(cid, set())
    if whole:
        got = set(range(1, n + 1))
    schedulable_items_total += n - len(on_demand_items.get(cid, set()))
    covered_items_total += len(got - on_demand_items.get(cid, set()))
    if n == 0:
        if not appear.get(cid):
            uncovered.append((cid, "whole component (no list items)"))
    else:
        missing = sorted(set(range(1, n + 1)) - got)
        if missing:
            uncovered.append((cid, missing))
report["coverage_uncovered"] = uncovered
report["coverage_items"] = (covered_items_total, schedulable_items_total)

# ---------------------------------------------------------------- dependency check (phase level)
dep_violations = []
for ph, reqs in R.PREREQ.items():
    if ph not in phase_first:
        continue
    for rq, tag in reqs:
        if rq.startswith("C"):
            rcw = GATE_CW.get(rq)
        else:
            rcw = phase_first.get(rq)
        same_week_ok = False
        if rcw is not None and rcw == phase_first[ph] and not rq.startswith("C"):
            w = WEEKS[rcw - 1]
            order = [COMPS[parse_slice(x)[1]]["phase"] if parse_slice(x)[0] == "comp" else x for x in w["p"] + w["s"]]
            same_week_ok = rq in order and ph in order and order.index(rq) < order.index(ph)
        if rcw is None or (rcw >= phase_first[ph] and not same_week_ok):
            dep_violations.append((ph, phase_first[ph], rq, rcw, tag))
report["phase_dependency_violations"] = dep_violations

# ---------------------------------------------------------------- component edges
def first_of(ref):
    if ref in GATE_CW:
        return GATE_CW[ref]
    if ref in project_first:
        return project_first[ref]
    if "#" in ref:
        cid, i = ref.split("#")
        i = int(i)
        cws = [cw for cw, lane, idx in appear.get(cid, []) if idx is None or i in idx]
        return min(cws) if cws else None
    cws = [cw for cw, lane, idx in appear.get(ref, [])]
    return min(cws) if cws else None

edge_violations = []
for a, b, why in R.COMPONENT_EDGES:
    fa, fb = first_of(a), first_of(b)
    if fa is None or fb is None or fa >= fb:
        edge_violations.append((a, fa, b, fb, why))
report["component_edge_violations"] = edge_violations

# ---------------------------------------------------------------- checkpoint requirements
ckpt_violations = []
for cid, title, src, reqs in R.CHECKPOINTS:
    gcw = GATE_CW.get(cid)
    if gcw is None:
        continue
    for rq in reqs:
        f = first_of(rq)
        if f is None or f >= gcw:
            ckpt_violations.append((cid, gcw, rq, f))
report["checkpoint_violations"] = ckpt_violations

proj_violations = []
for pid, title, reqs, ev in R.PROJECTS:
    pf = project_first.get(pid)
    for rq in reqs:
        f = first_of(rq)
        if pf is None or f is None or f >= pf:
            proj_violations.append((pid, pf, rq, f))
report["project_violations"] = proj_violations

# ---------------------------------------------------------------- density
for w in WEEKS:
    w["concepts"] = sum(slice_count(s) for s in w["p"] + w["s"])
    kinds = {parse_slice(s)[0] for s in w["p"]}
    w["type"] = "project" if kinds == {"project"} or ("project" in kinds) else (
        "consolidation" if w["p"] == ["CONSOLIDATE"] else ("open" if kinds == {"pseudo"} else "study"))
dens = OrderedDict()
for st in [s[0] for s in R.STAGES]:
    ws = [w for w in WEEKS if w["main_stage"] == st and w["type"] == "study"]
    if ws:
        cs = [w["concepts"] for w in ws]
        dens[st] = (len([w for w in WEEKS if w["main_stage"] == st]), len(ws), min(cs), round(sum(cs) / len(cs), 1), max(cs))
report["density"] = dens

if __name__ == "__main__":
    print("weeks:", len(WEEKS), "gates:", GATE_CW)
    for k, v in report.items():
        print(k, ":", v if not isinstance(v, list) else (len(v), v[:40]))
    zero = [w["cw"] for w in WEEKS if w["type"] == "study" and w["concepts"] == 0]
    print("study weeks with 0 list items:", zero, [ (w['cw'], w['p']) for w in WEEKS if w['cw'] in zero])
