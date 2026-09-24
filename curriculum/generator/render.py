# -*- coding: utf-8 -*-
import re, os, hashlib
from collections import OrderedDict, defaultdict
import reconcile_data as R
from engine import (NICE, short_label, PHASES, COMPS, WEEKS, GATE_CW, appear, phase_first, project_first, report,
                    slice_label, parse_slice, dsa_lane_for, comp_label, PSEUDO)

from pathlib import Path
_HERE = Path(__file__).resolve().parent
SRC = str(_HERE.parent / "source" / "MASTER_ROADMAP_VICTOR_2026_FINAL_2026-09-17.md")
RAW = open(SRC, encoding="utf-8").read()
L = RAW.split("\n")
MD5 = hashlib.md5(RAW.encode("utf-8")).hexdigest()
# MD5 of the archived weekly execution file, recorded for traceability (the file is not part of this repo)
WMD5 = "04214c8233b806aeb05afb34970b6849"
OUT = str(_HERE.parent / "docs")
os.makedirs(OUT, exist_ok=True)
VERSION = "v1.0 (2026-09-24)"
PRI = {"CRITICAL": "🔴 Critical", "HIGH": "🟠 High", "USEFUL": "🟡 Useful", "OPTIONAL": "🟢 Optional", "DEFER": "⚪ Defer"}


# ---------------------------------------------------------------- master section extraction
SEC_RE = re.compile(r"^# (\d+(?:\.\d+)?)\.? ([A-Z0-9\"“].*)$")


def section(num, stop_at_sub=True):
    """Lines of master section `num` (e.g. '85', '72.1'), excluding its header."""
    start = None
    in_code = False
    for i, s in enumerate(L):
        if s.strip().startswith("```"):
            in_code = not in_code
        if in_code:
            continue
        m = SEC_RE.match(s)
        if m and start is None and m.group(1) == num:
            start = i + 1
            continue
        if start is not None and m:
            n = m.group(1)
            if stop_at_sub or not n.startswith(num + "."):
                return L[start:i]
    return L[start:] if start is not None else []


def subsection0(first, last_exclusive):
    """Section 0 subsections: '## 0.2' up to '## 0.12'."""
    a = next(i for i, s in enumerate(L) if s.startswith(f"## {first} "))
    b = next(i for i, s in enumerate(L) if s.startswith(f"## {last_exclusive} "))
    return L[a:b]


def demote(lines, base=4):
    """Normalise headings inside verbatim blocks to bold lines so they never break the file hierarchy."""
    out, in_code = [], False
    for s in lines:
        if s.strip().startswith("```"):
            in_code = not in_code
            out.append(s); continue
        if not in_code and re.match(r"^#{1,6} ", s):
            txt = re.sub(r"^#{1,6} ", "", s).strip()
            txt = txt.strip("*")
            out.append(f"**{txt}**")
            continue
        if not in_code and s.strip() == "---":
            continue
        out.append(s)
    while out and not out[0].strip(): out.pop(0)
    while out and not out[-1].strip(): out.pop()
    # collapse 3+ blank lines
    res = []
    for s in out:
        if not s.strip() and res and not res[-1].strip():
            continue
        res.append(s)
    return res


# ---------------------------------------------------------------- resource registry
def parse_resources():
    a = next(i for i, s in enumerate(L) if re.match(r"^#+ 76\.3 GLOBAL", s))
    b = next(i for i, s in enumerate(L) if s.startswith("# 76.4 PHASE-BY-PHASE"))
    c = next(i for i, s in enumerate(L) if s.startswith("# 76.5 TOOL"))
    d = next(i for i, s in enumerate(L) if s.startswith("# 76.6 RESOURCE RULES"))
    glob = []
    cur = None
    for s in L[a + 1:b]:
        if s.startswith("### "):
            cur = {"name": s[4:].strip(), "label": "", "url": "", "note": ""}
            glob.append(cur)
        elif cur is not None and re.match(r"^https?://", s.strip()):
            cur["url"] = s.strip()
        elif cur is not None and s.strip() and not cur["label"] and re.match(r"^[A-Z /+]+$", s.strip()):
            cur["label"] = s.strip()
        elif cur is not None and s.strip() and s.strip() != "---":
            cur["note"] = (cur["note"] + " " + s.strip()).strip()
    per = OrderedDict()
    notes = defaultdict(list)
    ph = None; group = ""
    last = None
    for s in L[b + 1:c]:
        m = re.match(r"^## PHASE (\d+) - (.+)$", s)
        if m:
            ph = f"P{int(m.group(1)):02d}"; group = ""; per.setdefault(ph, []); continue
        if s.startswith("### "):
            group = s[4:].strip(); continue
        m = re.match(r"^- \*\*(.+?):\*\* ?(.*)$", s)
        if m and ph:
            url = ""
            txt = m.group(2).strip()
            u = re.search(r"https?://\S+", txt)
            if u:
                url = u.group(0); txt = txt.replace(url, "").strip()
            last = {"group": group, "label": m.group(1).strip(), "name": txt, "url": url}
            per[ph].append(last); continue
        if last is not None and re.match(r"^\s+https?://", s):
            last["url"] = s.strip(); continue
        m = re.match(r"^\*\*(.+?):\*\* ?(.*)$", s)
        if m and ph:
            notes[ph].append((group, m.group(1), m.group(2)))
    tools = []
    for s in L[c + 1:d]:
        if s.startswith("|") and not s.startswith("|---") and "Technology" not in s:
            cells = [x.strip() for x in s.strip("|").split("|")]
            tools.append(cells)
    return glob, per, notes, tools


GLOB, RES, RES_NOTES, TOOLS = parse_resources()
RES_ID = {}  # url -> id
REG = OrderedDict()
for i, g in enumerate(GLOB, 1):
    rid = f"RES-G{i:02d}"
    REG[rid] = dict(scope="Global navigation", label=g["label"] or "NAVIGATION", name=g["name"], url=g["url"], note=g["note"])
    if g["url"]: RES_ID.setdefault(g["url"], rid)
for ph, lst in RES.items():
    for k, r in enumerate(lst, 1):
        rid = f"RES-{ph}-{k:02d}"
        REG[rid] = dict(scope=ph + (f" / {r['group']}" if r["group"] else ""), label=r["label"], name=r["name"], url=r["url"], note="")
        if r["url"]: RES_ID.setdefault(r["url"], rid)
# URLs that live only in phase text (embedded Resources subsections, inline 'Reference:')
extra_by_phase = defaultdict(list)
for cid, c in COMPS.items():
    for s in c["lines"]:
        for u in re.findall(r"https?://[^\s)>\]*]+", s):
            u = u.rstrip(".,;:")
            if u not in RES_ID:
                ph = c["phase"]
                k = len(extra_by_phase[ph]) + 1
                rid = f"RES-{ph}-X{k}"
                # name: nearest bold line above
                name = ""
                idx = c["lines"].index(s)
                for back in range(idx - 1, max(-1, idx - 4), -1):
                    mm = re.match(r"^\*\*(.+)\*\*$", c["lines"][back].strip())
                    if mm: name = mm.group(1); break
                REG[rid] = dict(scope=ph, label="PHASE-TEXT", name=name or f"Referenced in {cid} {c['title']}", url=u, note=f"Found in master phase text ({cid}).")
                RES_ID[u] = rid
                extra_by_phase[ph].append(rid)
TOOL_ROWS = []
for k, t in enumerate(TOOLS, 1):
    TOOL_ROWS.append((f"TOOL-{k:02d}",) + tuple(t))


# ---------------------------------------------------------------- helpers for curriculum rendering
def render_component_lines(c):
    out, in_code, n = [], False, 0
    for s in c["lines"]:
        if s.strip().startswith("```"):
            in_code = not in_code; out.append(s); continue
        if in_code:
            out.append(s); continue
        m = re.match(r"^(\s*)(-|\d+\.)\s+(.*)$", s)
        if m:
            n += 1
            marker = m.group(2)
            out.append(f"{m.group(1)}{marker} `{c['id']}#{n}` {m.group(3)}")
            continue
        if re.match(r"^#{1,6} ", s):
            out.append("**" + re.sub(r"^#{1,6} ", "", s).strip() + "**"); continue
        out.append(s)
    while out and not out[0].strip(): out.pop(0)
    while out and not out[-1].strip(): out.pop()
    res = []
    for s in out:
        if not s.strip() and res and not res[-1].strip(): continue
        res.append(s)
    return res


def stages_of_phase(ph):
    st = []
    for w in WEEKS:
        for sl in w["p"] + w["s"]:
            k, cid, _ = parse_slice(sl)
            if k == "comp" and COMPS[cid]["phase"] == ph and w["stage"] not in st:
                st.append(w["stage"])
    for a, b, sls, _ in R.DSA_LANE:
        for sl in sls:
            k, cid, _ = parse_slice(sl)
            if COMPS[cid]["phase"] == ph and "DSA lane" not in st:
                st.append("DSA lane")
    return st


def comp_weeks(cid):
    ws = sorted({cw for cw, lane, idx in appear.get(cid, []) if lane in ("p", "s")})
    lane = [ (a, b) for (cw, ln, idx) in appear.get(cid, []) if ln == "dsa" for (a, b, sls, _) in R.DSA_LANE if a == cw]
    parts = []
    if ws: parts.append(", ".join(f"CW{w:03d}" for w in ws))
    for a, b in lane:
        parts.append(f"DSA lane CW{a:03d}–" + (f"CW{b:03d}" if b else "open"))
    if cid in R.ON_DEMAND: parts.append("on demand")
    for k in R.ON_DEMAND:
        if k.startswith(cid + "#"): parts.append(f"items {k.split('#')[1]} on demand")
    return "; ".join(parts) if parts else "—"


def cw(n): return f"CW{n:03d}"


EMO = {"🔴": "Critical", "🟠": "High", "🟡": "Useful", "🟢": "Optional", "⚪": "Defer"}


def pri_label(ph):
    p = PHASES[ph]
    t = p["target"]
    if not t:
        return "not stated in master"
    if ";" not in t:
        es = [e for ch in t for e in [ch] if e in EMO]
        if es:
            return "".join(dict.fromkeys(es)) + " " + "–".join(dict.fromkeys(EMO[e] for e in es))
    return PRI.get(p["priority"], "—")


def placement(ph):
    st = stages_of_phase(ph)
    if st:
        return ", ".join(st)
    return {"P41": "optional branch (after C5)", "P43": "on demand", "P46": "continuous (awareness from S4; detailed in PR07, PR11)"}.get(ph, "on demand")


# ================================================================ FILE 1: canonical curriculum
def build_curriculum():
    o = []
    A = o.append
    A("# ROADMAP OS — CANONICAL CURRICULUM STRUCTURE")
    A("")
    A(f"**Version:** {VERSION}  ")
    A(f"**Authority:** normalised from `MASTER_ROADMAP_VICTOR_2026_FINAL_2026-09-17.md` (MD5 `{MD5}`).  ")
    A("**Rule:** the master decides *what* is learned and the dependency order. If this file and the master ever disagree, the master wins and this file is regenerated. Every concept line below is the master's own text; only IDs, heading levels and grouping were added.  ")
    A("**Scope:** curriculum structure only. Scheduling lives in `ROADMAP_OS_PHASE_WEEK_MAPPING.md`; decisions and fixes live in `ROADMAP_OS_RECONCILIATION_LOG.md`.")
    A("")
    A("## Contents")
    for t in ["1. Architecture and ID scheme", "2. Stages", "3. Dependency model", "4. Competency checkpoints",
              "5. Canonical projects", "6. Continuous tracks", "7. Operating rules (master text)",
              "8. Phase catalogue (P01–P46)", "9. Resource registry"]:
        A(f"- {t}")
    A("")
    # 1
    A("## 1. Architecture and ID scheme")
    A("")
    A("```text")
    A("Master curriculum (authority)")
    A("  → Phases            P01 … P46")
    A("  → Components        P13.2, P10.1d …")
    A("  → Concepts          P13.2#4 …")
    A("  → Competencies      G0, C1 … C7   (+ stage gates SG2 … SG7)")
    A("  → Dependencies      phase + component edges")
    A("  → Weekly execution  CW001 …  (curriculum weeks, undated)")
    A("  → Daily execution   generated from the week slice + master daily work unit")
    A("```")
    A("")
    A("| ID form | Meaning | Rule |")
    A("|---|---|---|")
    A("| `P13` | Phase 13 | Primary curriculum identifier. Master **section** numbers are never used as IDs (Section N = Phase N−5). |")
    A("| `P13.2` | Component 2 of Phase 13 | Numbered master subsections keep their number; unnumbered ones are numbered in document order; `.0` = text before the first subsection. |")
    A("| `P10.1d` | Sub-component of P10.1 | Unnumbered subsection nested under a numbered component. |")
    A("| `P13.2#4` | Concept 4 of P13.2 | Every list line in the master phase text gets a stable concept ID. |")
    A("| `G0`, `C1`–`C7` | Checkpoints | G0 = initial Python gate (decision 6). C1–C7 = master competency checkpoints. |")
    A("| `SG2`… | Stage gates | Phase-gating rule applied at a stage boundary where the master defines no checkpoint. |")
    A("| `PR01`–`PR11` | Canonical projects | Master project ladder. No other projects are canonical. |")
    A("| `T01`–`T11` | Continuous tracks | Master continuous tracks and career-strategy sections. |")
    A("| `RES-…`, `TOOL-…` | Resources | One registry; weeks reference IDs, never raw URLs. |")
    A("")
    # 2
    A("## 2. Stages")
    A("")
    A("Stages are the master's stage-based timeline. They are **not** calendar years (decision 8).")
    A("")
    A("| Stage | Name | Master basis | Entry | Exit gate | Curriculum weeks |")
    A("|---|---|---|---|---|---|")
    for sid, name, basis, entry, exitg in R.STAGES:
        ws = [w["cw"] for w in WEEKS if w["main_stage"] == sid]
        rng = f"{cw(min(ws))}–{cw(max(ws))}" if ws else "—"
        if sid == "S8": rng += " (first pass; open-ended)"
        A(f"| {sid} | {name} | {basis} | {entry} | {exitg} | {rng} |")
    A("")
    A("| Sub-stage | Name | Exit | Curriculum weeks |")
    A("|---|---|---|---|")
    for sid, (name, ex) in R.SUBSTAGES.items():
        ws = [w["cw"] for w in WEEKS if w["stage"] == sid]
        A(f"| {sid} | {name} | {ex} | {cw(min(ws))}–{cw(max(ws))} |")
    A("")
    # 3
    A("## 3. Dependency model")
    A("")
    A("### 3.1 Enforced chain (decision 5)")
    A("")
    A("```text")
    A("Classical ML (P13–P16)")
    A("  → Docker / CI/CD / Cloud (P31, P32)")
    A("  → Deep Learning (P19–P21)")
    A("  → ML Engineering / MLOps (P28–P30)")
    A("  → Transformers / LLMs (P22–P27)")
    A("```")
    A("")
    A("Later technologies may appear as **optional exposure** (reading only, never a gate) before their dependencies. The master's own dependency spine (master section 'Immediate foundational block') is the full backbone:")
    A("")
    A("```text")
    A("Python → Git + Linux/CLI → DSA + SQL → Statistics/Probability + Linear Algebra → NumPy/Pandas + EDA")
    A("→ Software Engineering + Backend → Classical ML → Docker/CI/CD/Cloud → Deep Learning")
    A("→ ML Engineering/MLOps → Transformers/LLMs/AI Engineering")
    A("```")
    A("")
    A("### 3.2 Phase prerequisites")
    A("")
    A("Source tags: `S79` master timeline · `S101` master learning sequence · `S103` dependency spine · `GATE` phase GATE line · `TEXT` phase/project text · `D5` decision 5.")
    A("")
    A("| Phase | Title | Priority | Target | Hard prerequisites | Placement |")
    A("|---|---|---|---|---|---|")
    for ph, p in PHASES.items():
        reqs = ", ".join(f"{a} `{t}`" for a, t in R.PREREQ.get(ph, [])) or "—"
        pri = pri_label(ph)
        tgt = p["target"].replace("|", "/") or "not stated in master"
        st = placement(ph)
        A(f"| {ph} | {NICE[ph]} | {pri} | {tgt} | {reqs} | {st} |")
    A("")
    A("### 3.3 Component-level edges")
    A("")
    A("| Before | After | Reason |")
    A("|---|---|---|")
    for a, b, why in R.COMPONENT_EDGES:
        A(f"| {a} | {b} | {why} |")
    A("")
    A("### 3.4 Unlock rules")
    A("")
    for ph, p in PHASES.items():
        bits = []
        if p["gate"]: bits.append(f"Master GATE: {p['gate']}")
        if ph in R.UNLOCK_NOTE: bits.append(R.UNLOCK_NOTE[ph])
        if bits: A(f"- **{ph}** — " + " ".join(bits))
    A("")
    # 4
    A("## 4. Competency checkpoints")
    A("")
    ck = section("85")
    ck_blocks = OrderedDict()
    cur = None
    for s in ck:
        m = re.match(r"^## Checkpoint (\d) - (.+)$", s)
        if m:
            cur = f"C{m.group(1)}"; ck_blocks[cur] = []; continue
        if cur: ck_blocks[cur].append(s)
    first_gate = []
    grab = False
    for s in subsection0("0.12", "0.12") if False else []: pass
    a = next(i for i, s in enumerate(L) if s.startswith("### First 14 days"))
    b = next(i for i, s in enumerate(L) if s.startswith("# 1. NORTH STAR"))
    first_gate = L[a:b]
    for cid, title, src, reqs in R.CHECKPOINTS:
        gcw = GATE_CW.get(cid)
        A(f"### {cid} — {title}")
        A("")
        A(f"- **Source:** {src}")
        A(f"- **Gate week:** {cw(gcw) if gcw else 'calendar-driven (see note)'}")
        A(f"- **Must precede the gate:** {', '.join(reqs)}")
        if cid in R.CHECKPOINT_NOTES: A(f"- **Note:** {R.CHECKPOINT_NOTES[cid]}")
        A("")
        body = first_gate if cid == "G0" else ck_blocks.get(cid, [])
        for s in demote(body): A(s)
        A("")
    A("### Stage gates")
    A("")
    A("Where the master defines no checkpoint, a stage gate applies the master phase-gating rule (5–10 must-know capabilities, one artifact, a practical mastery check, later re-test) to the stage's components.")
    A("")
    for g, desc in [("SG2", "DSA fundamentals (P04.1, P04.2, P04.5#1–7) and SQL/PostgreSQL basics (P06.1, P06.1a, P06.2)."),
                    ("SG3", "Data gate (P11.1–P11.3) + statistics gate (P10.3#1–16, P10.4#1–11). Master: classical ML may begin only when the programming, data, and statistics gates are genuinely passing."),
                    ("SG4", "Foundation Reset exit: all S0–S4 components re-tested; PR01–PR03 complete."),
                    ("SG5", "C2, C4 and C3 passed; PR04–PR07 complete."),
                    ("SG6A", "Deep-learning phase gates (P19–P21)."),
                    ("SG7", "Systems depth phase gates (P35–P37, P42, P26).")]:
        A(f"- **{g}** ({cw(GATE_CW[g])}): {desc}")
    A("")
    # 5
    A("## 5. Canonical projects")
    A("")
    A("The master project ladder is the only canonical project list (decision 7). The old execution roadmap's 'Deep-learning project' is **not** canonical; deep-learning evidence comes from P19.5 required builds and P20.0 projects.")
    A("")
    pnum = {"PR01": "53", "PR02": "54", "PR03": "55", "PR04": "56", "PR05": "57", "PR06": "58", "PR07": "59",
            "PR08": "60", "PR09": "61", "PR10": "62", "PR11": "63"}
    for pid, title, reqs, ev in R.PROJECTS:
        ws = [w["cw"] for w in WEEKS if w["proj"] == pid or pid in w["p"]]
        A(f"### {pid} — {title}")
        A("")
        A(f"- **Requires first:** {', '.join(reqs)}")
        A(f"- **Evidence for:** {ev}")
        A(f"- **Build weeks:** {cw(min(ws))}–{cw(max(ws))}" if ws else "- **Build weeks:** —")
        A("")
        for s in demote(section(pnum[pid])): A(s)
        A("")
    A("### Project quality standard (master text)")
    A("")
    for s in demote(section("64")): A(s)
    A("")
    # 6
    A("## 6. Continuous tracks")
    A("")
    secs = {"T01": "65", "T02": "66", "T03": "67", "T04": "68", "T05": "69", "T06": "70", "T07": "71",
            "T08": "72", "T09": "73", "T10": "74", "T11": "75"}
    for tid, name, _, act in R.TRACKS:
        A(f"### {tid} — {name}")
        A("")
        A(f"- **Activation:** {act}")
        A("")
        body = section(secs[tid], stop_at_sub=False) if tid in ("T02",) else section(secs[tid])
        if tid == "T08":
            body = body + ["", "**International / cross-border career reality**", ""] + section("72.1")
        for s in demote(body): A(s)
        A("")
    # 7
    A("## 7. Operating rules (master text)")
    A("")
    A("Verbatim from master Section 0 (subsections 0.2–0.11) and the weekly/daily/monthly execution model. The execution layer and the app's rule engine must implement these.")
    A("")
    for s in demote(subsection0("0.2", "0.12")): A(s)
    A("")
    for num, name in [("81", "Weekly execution model"), ("83", "Daily work unit"), ("84", "Monthly review"), ("86.1", "Foundation failure recovery")]:
        A(f"### {name}")
        A("")
        for s in demote(section(num)): A(s)
        A("")
    # 8
    A("## 8. Phase catalogue (P01–P46)")
    A("")
    A("Each phase: metadata, master gate text, components with concept IDs, resources by registry ID, and where it is scheduled.")
    A("")
    for ph, p in PHASES.items():
        A(f"### {ph} — {NICE[ph]}")
        A("")
        A(f"- **Priority:** {pri_label(ph)} · **Target:** {p['target'] or 'not stated in master'}")
        A(f"- **Prerequisites:** {', '.join(f'{a} ({t})' for a, t in R.PREREQ.get(ph, [])) or 'none'}")
        if p["gate"]: A(f"- **Master GATE:** {p['gate']}")
        if ph in R.UNLOCK_NOTE: A(f"- **Unlock note:** {R.UNLOCK_NOTE[ph]}")
        A(f"- **Scheduled in:** {placement(ph)}")
        A("")
        for c in p["components"]:
            if c["kind"] == "resources":
                continue
            lab = comp_label(c["id"])
            meta = f" — {c['meta']}" if c["meta"] else ""
            kind = {"gate-text": " *(mastery statement)*", "rule": " *(rule)*", "parent": " *(parent)*"}.get(c["kind"], "")
            A(f"#### {c['id']} {lab}{meta}{kind}")
            A("")
            if c["kind"] == "concepts":
                A(f"*Scheduled:* {comp_weeks(c['id'])}")
                A("")
            for s in render_component_lines(c): A(s)
            A("")
        # resources
        A(f"#### {ph} resources")
        A("")
        rows = [(rid, r) for rid, r in REG.items() if r["scope"].split(" / ")[0] == ph]
        for g, lab, txt in RES_NOTES.get(ph, []):
            A(f"- *{(g + ' — ') if g else ''}{lab}:* {txt}")
        for rid, r in rows:
            grp = r["scope"].split(" / ")[1] + " · " if " / " in r["scope"] else ""
            url = f" — {r['url']}" if r["url"] else ""
            A(f"- `{rid}` {grp}**{r['label']}:** {r['name']}{url}")
        for c in p["components"]:
            if c["kind"] == "resources":
                A("")
                A(f"*Master phase-text resource notes ({c['id']}):*")
                A("")
                for s in demote(c["lines"]): A(s)
        A("")
    # 9
    A("## 9. Resource registry")
    A("")
    A("Single source for every URL. Weeks and phases reference `RES-`/`TOOL-` IDs. Links were checked by the master against public pages on 2026-09-17; fast-moving ecosystems are rechecked when the phase activates.")
    A("")
    A("### 9.1 Global navigation")
    A("")
    for rid, r in REG.items():
        if rid.startswith("RES-G"):
            A(f"- `{rid}` **{r['name']}** ({r['label']}) — {r['url']}" + (f". {r['note']}" if r["note"] else ""))
    A("")
    A("### 9.2 Phase resources")
    A("")
    A("| ID | Scope | Label | Resource | URL |")
    A("|---|---|---|---|---|")
    for rid, r in REG.items():
        if rid.startswith("RES-P"):
            A(f"| `{rid}` | {r['scope']} | {r['label']} | {r['name'].replace('|', '/')} | {r['url'] or '—'} |")
    A("")
    A("### 9.3 Tool / language registry")
    A("")
    A("| ID | Technology / tool | Activation | Primary route | Official reference |")
    A("|---|---|---|---|---|")
    for row in TOOL_ROWS:
        A("| `" + row[0] + "` | " + " | ".join(row[1:]) + " |")
    A("")
    A("### 9.4 Resource rules (master text)")
    A("")
    for num in ("76.1", "76.2", "76.6", "76.7"):
        body = section(num) if num in ("76.6", "76.7") else None
        if body is None:
            a = next(i for i, s in enumerate(L) if re.match(rf"^#+ {re.escape(num)} ", s))
            b = next(i for i in range(a + 1, len(L)) if L[i].startswith("## ") or L[i].startswith("# "))
            body = [L[a]] + L[a + 1:b]
            A(f"**{re.sub(r'^#+ ', '', L[a]).strip()}**")
            body = body[1:]
        else:
            A(f"**{re.sub(r'^#+ ', '', next(s for s in L if re.match(rf'^#+ {re.escape(num)} ', s))).strip()}**")
        A("")
        for s in demote(body): A(s)
        A("")
    A("**77. RESOURCE OPERATING RULES**")
    A("")
    for s in demote(section("77", stop_at_sub=False)): A(s)
    A("")
    return "\n".join(o) + "\n"


# ================================================================ FILE 2: phase-to-week mapping
def build_mapping():
    o = []
    A = o.append
    A("# ROADMAP OS — RECONCILED PHASE-TO-WEEK MAPPING")
    A("")
    A(f"**Version:** {VERSION} · **Status:** reconciled, **undated** (decision 9).  ")
    A(f"**Built from:** `ROADMAP_OS_CANONICAL_CURRICULUM.md` (master MD5 `{MD5}`).  ")
    A("**Replaces as scheduling source:** `VICTOR_MASTER_WEEKLY_EXECUTION_ROADMAP_2026_FINAL.md` (rebuilt from the master; not an equal authority).")
    A("")
    A("## 1. Units and lanes")
    A("")
    A("- **Curriculum week (CW):** one week of *active* roadmap work at the master's normal-semester capacity (roughly 5–10 external hours; primary block + light maintenance). CW numbers are not calendar weeks.")
    A("- **Calendar anchoring comes later:** heavy-semester, exam and internship periods (master Modes C, D, E) pause CW advancement. The university timeline (graduation expected 2028) is a separate track and does not compress the curriculum (decision 8).")
    A("- **Advancement:** a CW is a target, not a deadline. A failed gate turns the next CW into a repair week (master foundation failure recovery).")
    A("- **Lanes per week:** Primary (always) · Supporting (only with spare capacity; at most one) · DSA lane (from CW018, only when capacity allows) · Project (build weeks are primary so projects happen even at low capacity).")
    A("- **Content per week:** each slice names master components and concept ranges. The concept text lives in the curriculum file under the same IDs, so no week can be thinner than its master content.")
    A("- **Daily layer:** CW001–CW002 use the master's 14-day plan as written. Every other week is broken into days with the master daily work unit (recall → learn one concept → code → debug/test → explain → record next step).")
    A("")
    A("## 2. Stage overview")
    A("")
    A("| Stage | Name | Weeks | Count | Exit gate |")
    A("|---|---|---|---|---|")
    order = ["S0", "S1", "S2", "S3", "S4", "S5A", "S5B", "S5C", "S6A", "S6B", "S7A", "S7B", "S8"]
    names = {s[0]: s[1] for s in R.STAGES}
    names.update({k: v[0] for k, v in R.SUBSTAGES.items()})
    for st in order:
        ws = [w for w in WEEKS if w["stage"] == st]
        gates = [w["g"] for w in ws if w["g"]]
        A(f"| {st} | {names[st]} | {cw(ws[0]['cw'])}–{cw(ws[-1]['cw'])} | {len(ws)} | {', '.join(gates) or ('C7 calendar-driven' if st == 'S8' else '—')} |")
    A("")
    A(f"Total: **{len(WEEKS)} curriculum weeks** to the end of the first S8 pass. Foundation Reset (S0–S4) = CW001–CW{max(w['cw'] for w in WEEKS if w['main_stage'] in ('S0','S1','S2','S3','S4')):03d}; no classical ML, deep learning, Transformers, serving or MLOps appears before CW{GATE_CW['SG4']+1:03d} (decision 4).")
    A("")
    A("### Gate sequence")
    A("")
    A("```text")
    seq = sorted(GATE_CW.items(), key=lambda x: x[1])
    A("  →  ".join(f"{g} {cw(n)}" for g, n in seq) + "  →  C7 (calendar)")
    A("```")
    A("")
    A("## 3. DSA lane (Phase 4 after its primary block)")
    A("")
    A("| Weeks | Slices | Focus |")
    A("|---|---|---|")
    for a, b, sls, note in R.DSA_LANE:
        A(f"| {cw(a)}–{cw(b) if b else 'open'} | {'; '.join(slice_label(s) for s in sls) or '—'} | {note} |")
    A("")
    A("## 4. Week-by-week mapping")
    A("")
    cur_stage = None
    for w in WEEKS:
        if w["stage"] != cur_stage:
            cur_stage = w["stage"]
            A(f"### {cur_stage} — {names[cur_stage]}")
            A("")
        head = f"#### {cw(w['cw'])} · {w['stage']}"
        if w["g"]: head += f" · GATE {w['g']}"
        A(head)
        A("")
        A("- **Primary:** " + " + ".join(slice_label(s) for s in w["p"]))
        if w["s"]:
            A("- **Supporting:** " + " + ".join(slice_label(s) if s != "SETUP" else PSEUDO["SETUP"] for s in w["s"]))
        lane, lnote, a, b = dsa_lane_for(w["cw"])
        if lane:
            A("- **DSA lane:** " + ", ".join(short_label(s) for s in lane))
        if w["proj"] and not any(parse_slice(s)[0] == "project" for s in w["p"]):
            A(f"- **Project:** {w['proj']}")
        if w["b"]: A(f"- **Build / evidence:** {w['b']}")
        if w["n"]: A("- **Note:** " + w["n"])
        if w["concepts"]: A(f"- **Concepts scheduled:** {w['concepts']}")
        A("")
    A("## 5. Tracks")
    A("")
    for tid, name, _, act in R.TRACKS:
        A(f"- **{tid} {name}:** {act}")
    A("")
    A("## 6. On-demand and optional (not in the weekly spine)")
    A("")
    for k, v in R.ON_DEMAND.items():
        A(f"- **{k}:** {v}")
    A("")
    A("## 7. Validation report")
    A("")
    cov = report["coverage_items"]
    A(f"- **Concept coverage:** {cov[0]} of {cov[1]} schedulable master concept lines are assigned to a week or lane (on-demand items excluded by rule). Uncovered: {len(report['coverage_uncovered'])}.")
    A(f"- **Phase prerequisite violations:** {len(report['phase_dependency_violations'])}.")
    A(f"- **Component edge violations:** {len(report['component_edge_violations'])}.")
    A(f"- **Checkpoint-before-requirement violations:** {len(report['checkpoint_violations'])}.")
    A(f"- **Project-before-requirement violations:** {len(report['project_violations'])}.")
    A("- **Decision 5 chain:** " + " < ".join(f"{lab} {cw(n)}" for lab, n in [
        ("P13 first", phase_first["P13"]), ("P31 first", phase_first["P31"]), ("P32 cloud project", min(c for c, l, i in appear["P32.1"])),
        ("P19 first", phase_first["P19"]), ("P28 first", phase_first["P28"]), ("C5", GATE_CW["C5"]), ("P22 first", phase_first["P22"])]))
    A("")
    A("**Density** (master concept lines per study week; project and consolidation weeks excluded):")
    A("")
    A("| Stage | Weeks | Study weeks | Min | Mean | Max |")
    A("|---|---|---|---|---|---|")
    for st, (n, ns, mn, mean, mx) in report["density"].items():
        A(f"| {st} | {n} | {ns} | {mn} | {mean} | {mx} |")
    A("")
    A("Weeks with 0 list lines (CW151, CW170, CW179) carry master components written as diagrams or prose (evaluation levels, search/serving/RAG system flows, the reproduction ladder), not empty content.")
    A("")
    A("## 8. Next step: calendar anchoring (not applied)")
    A("")
    A("1. Choose the Week 1 start date.")
    A("2. Build the university timeline separately: semesters, exam windows, internship/SIWES periods, graduation (expected 2028).")
    A("3. For each calendar week assign a mode (A–F). Modes C/D pause CW advancement; Mode E maps internship work onto overlapping components; Mode F may run two CWs or a project push.")
    A("4. Place C7 preparation windows against real recruiting dates, using whichever checkpoints are passed by then.")
    A("5. Only then generate dated weeks and the daily layer.")
    A("")
    return "\n".join(o) + "\n"


# ================================================================ FILE 3: reconciliation log
def build_log():
    o = []
    A = o.append
    A("# ROADMAP OS — RECONCILIATION LOG")
    A("")
    A(f"**Version:** {VERSION}")
    A("")
    A("## 1. Source status")
    A("")
    A("| File | Status | Reason |")
    A("|---|---|---|")
    A(f"| `MASTER_ROADMAP_VICTOR_2026_FINAL_2026-09-17.md` | **Canonical curriculum authority** | Decision 1. MD5 `{MD5}`. |")
    A(f"| `VICTOR_MASTER_WEEKLY_EXECUTION_ROADMAP_2026_FINAL.md` | **Superseded as schedule content; role kept** | Decision 2: the execution layer is rebuilt from the master as `ROADMAP_OS_PHASE_WEEK_MAPPING.md`. MD5 `{WMD5}`. |")
    A("| `MASTER_ROADMAP_VICTOR_2026_FINAL_2026-09-17__1_.md` | Archived | Byte-identical duplicate of the master. |")
    A("| `01_FOUNDATION_AND_CORE_ENGINEERING.md` … `04_EXECUTION_CAREER_RESEARCH_AND_FINAL_REFERENCE.md` | Archived | Exact split of the master (concatenation is byte-identical). |")
    A("| `VICTOR_MASTER_EXECUTION_ROADMAP_2026-09.md` | Archived | Old day-by-day plan; superseded. |")
    A("| `VICTOR_MASTER_EXECUTION_ROADMAP_2026-09.pdf` | Archived | Rendering of the old plan. |")
    A("")
    A("Archived files still sit in the Project's knowledge until they are removed from the Project's files. Until then they must not be used as a source.")
    A("")
    A("## 2. Decisions applied")
    A("")
    dec = [
        ("1", "Master is the curriculum authority.", "All phase, component and concept content is generated from the master text; the curriculum file carries the master checksum."),
        ("2", "Weekly roadmap is the execution layer under the master.", "The old weekly file was not edited. Its schedule was rebuilt from master phases, dependencies and stage timeline. Conflicts resolved in the master's favour."),
        ("3", "Duplicate, splits, old execution roadmap and PDF archived.", "Marked archived above. They contribute nothing to the new files."),
        ("4", "No compression into a 52-week Year 1.", f"S0–S4 (Foundation Reset) = CW001–CW{GATE_CW['SG4']:03d}. Classical ML starts at CW{phase_first['P13']:03d}, deep learning at CW{phase_first['P19']:03d}, Transformers at CW{phase_first['P22']:03d}."),
        ("5", "Enforced chain Classical ML → Docker/CI/CD/Cloud → DL → ML Eng/MLOps → Transformers/LLMs.", "Encoded as phase prerequisites tagged D5 and component edges; validated automatically (0 violations)."),
        ("6", "14-day Python plan is the formal initial Python gate.", "G0 at CW002. Python fluency continues in S1 (P01.1b–P01.1d, P01.1f builds). C1 is the full programmer checkpoint at CW014."),
        ("7", "Master's 7 checkpoints and 11 projects are the only canonical IDs.", "C1–C7 and PR01–PR11 used throughout. Old gates (9-gate list, documentation milestones A–E) and the extra 'Deep-learning project' are not included. G0 and SG stage gates are process gates, not competency checkpoints."),
        ("8", "Curriculum and university timelines modelled separately.", "Curriculum weeks are undated active weeks. Graduation (2028) belongs to the calendar layer and does not shorten the curriculum."),
        ("9", "Structure first, then weeks, then dates.", "This release stops at the undated phase-to-week mapping."),
        ("10", "Data-quality fixes.", "See section 4."),
        ("11", "Phase numbers are the primary identifiers.", "IDs P01–P46 with component and concept sub-IDs; master section numbers and heading levels are ignored."),
    ]
    A("| # | Decision | How it was applied |")
    A("|---|---|---|")
    for a, b, c in dec: A(f"| {a} | {b} | {c} |")
    A("")
    A("## 3. Conflicts inside the master and how they were resolved")
    A("")
    conf = [
        ("Transformers vs ML engineering order",
         "The master learning sequence lists Attention (28) and Transformers (29) before ML Engineering (30) and MLOps (31), and the 2028–2029 timeline bundles them. The dependency spine puts Transformers after ML Engineering/MLOps.",
         f"Decision 5 follows the spine. P22 starts at CW{phase_first['P22']:03d}, after C5. Attention reading is allowed as optional exposure at CW111 but is never gated."),
        ("Model serving position",
         "The learning sequence puts model serving (24) before PyTorch (25); decision 5 does not name serving.",
         "P29 is split: an early D1–D2 segment serving a classical model (CW096, after Docker/Cloud) and the formal D3 pass after ML engineering (CW115–CW117)."),
        ("From-scratch ML needs deep learning for two items",
         "P16 lists 'Simple neural network' and 'Backpropagation' alongside classical algorithms.",
         "P16 #1–6 and #9–14 run in S5B; #7–8 run with P19 in S6A (CW103)."),
        ("Mathematics spread across stages",
         "The timeline puts statistics, probability and linear algebra in the foundation year; the learning sequence puts calculus and optimisation after ML theory; PCA needs eigen/SVD.",
         "P10.3#1–16, P10.4#1–11 and P10.1a–c in S3; P10.1d–e before P13.5; P10.2 and P10.5 before P16; remaining statistics items (regression, ANOVA, experimental design, A/B, Bayesian) beside the matching ML weeks."),
        ("Software engineering placement",
         "The spine puts Software Engineering + Backend after NumPy/EDA; the learning sequence puts OOP + software engineering basics right after Linux.",
         "P07.3–P07.4 enter at D1–D2 in S1 (CW011) to support PR01 and C1; full P07 and P08 run in S4."),
        ("C3 deployment vs Docker timing",
         "C3 requires a real deployment, but decision 5 places Docker/CI/CD/Cloud after classical ML.",
         f"PR03 is built in S4; auth is added in S5A; C3 is passed in S5C (CW{GATE_CW['C3']:03d}) after containerisation, CI and the cloud project."),
        ("Recommender systems placement",
         "Phase 18 sits before deep learning in master numbering but needs embeddings and a serving API (PR08).",
         "P18 runs in S6B after P19 and P28–P29."),
        ("Phase 12 later technologies",
         "Airflow, Spark and Kafka are listed under Phase 12 and again under Phase 43 (on demand).",
         "P12.0#14–16 are on-demand under P43."),
        ("Java and JavaScript/TypeScript timing",
         "Both sit in Phase 1, but the tool registry activates Java as 'Phase 1/7 support' and JS/TS 'Phase 7 onward'.",
         "Java runs as a supporting block in S5A (CW047–CW052). JS/TS runs as a supporting block in S7A (CW143–CW146) before PR11's frontend."),
    ]
    for t, a, b in conf:
        A(f"### {t}")
        A("")
        A(f"- **Conflict:** {a}")
        A(f"- **Resolution:** {b}")
        A("")
    A("## 4. Data-quality fixes")
    A("")
    fixes = [
        ("Stale 'Week 1 checkpoint' label in Week 4 title", "Not carried over. Week titles are generated from component IDs; gate labels come only from the gate list."),
        ("Duplicated appendix blocks in the weekly file (navigation resources, tool registry, fast-moving AI rules, broken-resource rule)", "The execution layer no longer carries an appendix. All resources live once, in the curriculum file's registry."),
        ("Missing appendix A.2", "Appendix numbering retired with the appendix."),
        ("Stray master number '76.3' in the weekly appendix", "Retired with the appendix; master section numbers are not used as identifiers anywhere."),
        ("Inconsistent resource URLs (MIT 18.06 2010 page, pytorch.org/tutorials, CMU 15-445 root)", "Weeks reference registry IDs only. The registry uses the master's URLs: MIT 18.06SC Fall 2011, docs.pytorch.org/tutorials, CMU 15-445 fall2026."),
        ("Year 2–4 thinning (one concept line per week)", f"Every week now names master components and concept ranges. {report['coverage_items'][0]} of {report['coverage_items'][1]} master concept lines are scheduled; mean density per study week ranges from {min(v[3] for v in report['density'].values())} to {max(v[3] for v in report['density'].values())} concept lines by stage (old weekly file: 1 per week in Years 2–4)."),
        ("Master heading levels unreliable (38 'Target:' lines and subsections at H1)", "Parsed by section number and phase header, not by heading level. Output uses one consistent hierarchy."),
        ("Section numbers offset from phase numbers", "Phase IDs only (decision 11)."),
    ]
    A("| Issue | Fix |")
    A("|---|---|")
    for a, b in fixes: A(f"| {a} | {b} |")
    A("")
    A("## 5. Judgment calls to review")
    A("")
    A("- **Week budgets.** The master is stage-based and gives no durations. Budgets here scale with the master's depth targets and item counts, e.g. D4 components get two or more weeks and projects get three to five build weeks. They are targets; capability decides advancement.")
    A("- **Consolidation weeks.** Every gate week is a consolidation week (gate attempt, spaced re-tests, repair). One extra buffer week sits before SG4 and one after C5.")
    A("- **S8 length.** Research (8 weeks), specialisation (9) and PR11 (12) are a first pass only. The master treats specialisation as open-ended.")
    A("")
    A("## 6. Open inputs for the next step")
    A("")
    A("1. Week 1 start date.")
    A("2. University calendar: semester dates, exam windows, internship/SIWES periods.")
    A("3. Whether a university Java course covers P01.2 (frees the S5A supporting slot).")
    A("4. Whether an existing fraud-detection project will be upgraded for PR07, as the master allows.")
    A("")
    return "\n".join(o) + "\n"


if __name__ == "__main__":
    files = {
        "ROADMAP_OS_CANONICAL_CURRICULUM.md": build_curriculum(),
        "ROADMAP_OS_PHASE_WEEK_MAPPING.md": build_mapping(),
        "ROADMAP_OS_RECONCILIATION_LOG.md": build_log(),
    }
    for name, txt in files.items():
        txt = re.sub(r"\n{3,}", "\n\n", txt)
        open(os.path.join(OUT, name), "w", encoding="utf-8").write(txt)
        print(name, len(txt.split("\n")), "lines", len(txt.encode("utf-8")), "bytes")
    print("registry:", len(REG), "resources;", len(TOOL_ROWS), "tools; phase-text extras:", sum(len(v) for v in extra_by_phase.values()))
