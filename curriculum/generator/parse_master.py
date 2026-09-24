"""Parse the canonical master roadmap into a normalized phase/component structure.

IDs are phase-based (P01..P46), never section-based. Section S maps to phase S-5.
Component IDs:
  - numbered master subsections (e.g. "9.1", "15.3")  -> P{phase}.{n}
  - unnumbered subsections in phases without numbered ones -> P{phase}.{n} sequential
  - content before the first component                   -> P{phase}.0 (core scope)
  - unnumbered subsections nested under a numbered component -> P{phase}.{n}{letter}
"""
import json, re, hashlib, string, os
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
BUILD = HERE / "_build"
BUILD.mkdir(exist_ok=True)

SRC = str(ROOT / "source" / "MASTER_ROADMAP_VICTOR_2026_FINAL_2026-09-17.md")
raw = open(SRC, encoding="utf-8").read()
L = raw.split("\n")

PHASE_RE = re.compile(r"^# (\d+)\. PHASE (\d+) - (.+)$")
NUM_COMP_RE = re.compile(r"^#{1,3} (\d+)\.(\d+) (.+)$")
TARGET_RE = re.compile(r"^#{1,3} (?:Priority: (\S+) \| )?Target: (.+)$")
GATE_RE = re.compile(r"^GATE: (.+)$")
PRIORITY_EMOJI = {"🔴": "CRITICAL", "🟠": "HIGH", "🟡": "USEFUL", "🟢": "OPTIONAL", "⚪": "DEFER"}

# phase region ends where the project ladder begins (section 52)
end_idx = next(i for i, s in enumerate(L) if s.startswith("# 52. PROJECT ARCHITECTURE"))

phases = []
cur_phase = None
cur_comp = None
in_code = False


def new_comp(pid, cid, title, meta=None, parent=None):
    return {"id": cid, "title": title, "meta": meta or "", "parent": parent, "lines": []}


def parse_meta(text):
    """Split 'Python - 🔴 long-term D4 | Entry target: D2' into title/meta."""
    if " - " in text:
        t, m = text.split(" - ", 1)
        return t.strip(), m.strip()
    return text.strip(), ""


for i in range(end_idx):
    s = L[i]
    if s.strip().startswith("```"):
        in_code = not in_code
    m = PHASE_RE.match(s) if not in_code else None
    if m:
        pnum = int(m.group(2))
        cur_phase = {
            "phase": pnum,
            "id": f"P{pnum:02d}",
            "title": m.group(3).strip(),
            "master_section": int(m.group(1)),
            "master_line": i + 1,
            "target": "",
            "priority": "",
            "gate": "",
            "components": [],
            "has_numbered": False,
        }
        phases.append(cur_phase)
        cur_comp = new_comp(pnum, f"P{pnum:02d}.0", "Core scope")
        cur_phase["components"].append(cur_comp)
        continue
    if cur_phase is None:
        continue
    if in_code or s.strip().startswith("```"):
        cur_comp["lines"].append(s)
        continue
    g = GATE_RE.match(s)
    if g:
        cur_phase["gate"] = g.group(1).strip()
        continue
    t = TARGET_RE.match(s)
    if t:
        cur_phase["target"] = t.group(2).strip()
        pr = t.group(1) or t.group(2)
        for e, name in PRIORITY_EMOJI.items():
            if e in pr:
                cur_phase["priority"] = cur_phase["priority"] or name
        continue
    n = NUM_COMP_RE.match(s)
    if n and int(n.group(1)) == cur_phase["master_section"]:
        cur_phase["has_numbered"] = True
        title, meta = parse_meta(n.group(3))
        cid = f"{cur_phase['id']}.{int(n.group(2))}"
        cur_comp = new_comp(cur_phase["phase"], cid, title, meta)
        cur_comp["letter_count"] = 0
        cur_phase["components"].append(cur_comp)
        continue
    h2 = re.match(r"^## (.+)$", s)
    if h2:
        title, meta = parse_meta(h2.group(1))
        if cur_phase["has_numbered"]:
            parent = cur_comp if cur_comp.get("parent") is None else next(
                c for c in cur_phase["components"] if c["id"] == cur_comp["parent"])
            # "Resources" directly under a phase-level list is phase-level
            parent["letter_count"] = parent.get("letter_count", 0) + 1
            letter = string.ascii_lowercase[parent["letter_count"] - 1]
            cur_comp = new_comp(cur_phase["phase"], f"{parent['id']}{letter}", title, meta, parent=parent["id"])
        else:
            k = sum(1 for c in cur_phase["components"] if c.get("parent") is None)
            cur_comp = new_comp(cur_phase["phase"], f"{cur_phase['id']}.{k}", title, meta)
        cur_phase["components"].append(cur_comp)
        continue
    if s.strip() == "---":
        continue
    cur_comp["lines"].append(s)

# tidy: strip leading/trailing blank lines, drop empty core-scope components
for p in phases:
    for c in p["components"]:
        while c["lines"] and not c["lines"][0].strip():
            c["lines"].pop(0)
        while c["lines"] and not c["lines"][-1].strip():
            c["lines"].pop()
    p["components"] = [c for c in p["components"] if c["lines"] or c["id"].count(".") and not c["id"].endswith(".0")]
    # priority from component meta if phase-level missing
    if not p["priority"]:
        for c in p["components"]:
            for e, name in PRIORITY_EMOJI.items():
                if e in c["meta"]:
                    p["priority"] = p["priority"] or name
    if not p["target"]:
        p["target"] = "; ".join(f"{c['title']}: {c['meta']}" for c in p["components"] if c["meta"] and c.get("parent") is None)

# bullet count for fidelity checks
master_bullets = sum(1 for s in L[:end_idx] if re.match(r"^\s*- ", s) and not s.strip().startswith("- [ ]"))
parsed_bullets = sum(1 for p in phases for c in p["components"] for s in c["lines"] if re.match(r"^\s*- ", s))
first_phase_line = phases[0]["master_line"]
master_phase_bullets = sum(1 for s in L[first_phase_line - 1:end_idx] if re.match(r"^\s*- ", s))

out = {
    "source": SRC.split("/")[-1],
    "source_md5": hashlib.md5(raw.encode("utf-8")).hexdigest(),
    "phases": phases,
    "check": {"master_phase_bullets": master_phase_bullets, "parsed_bullets": parsed_bullets},
}
json.dump(out, open(BUILD / "master_phases.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(phases), "phases; list lines master/parsed:", master_phase_bullets, parsed_bullets)
