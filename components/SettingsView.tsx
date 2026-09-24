"use client";

import { useTheme } from "next-themes";
import { useRef, useState, useSyncExternalStore } from "react";
import { useHydrated, useUserState, persistenceInfo, getState } from "@/lib/store";
import { importState, resetState, setCurrentWeek } from "@/lib/actions";
import { cx } from "./ui";

const noop = () => () => {};

export function SettingsView({ dataInfo }: { dataInfo: { md5: string; generated: string; counts: string } }) {
  const s = useUserState();
  const ready = useHydrated();
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const [week, setWeek] = useState<string>("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const file = useRef<HTMLInputElement>(null);
  const info = ready ? persistenceInfo() : null;

  const exportJson = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(getState(), null, 1)], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `roadmap-os-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg({ ok: true, text: "Exported. Keep the file somewhere safe; import it on another device to carry progress over." });
  };

  const onImport = async (f: File) => {
    if (!window.confirm("Importing replaces all progress in this browser with the file's contents. Continue?")) return;
    const r = importState(await f.text());
    setMsg(r.ok ? { ok: true, text: "Imported. Your progress now matches the file." } : { ok: false, text: r.error });
  };

  const btn = "rounded-md border border-rule bg-surface px-3 py-2 text-sm hover:border-accent";
  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-2 text-base font-semibold">Appearance</h2>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Theme">
          {["system", "light", "dark"].map((t) => (
            <button key={t} type="button" aria-pressed={mounted && theme === t} onClick={() => setTheme(t)} className={cx(btn, mounted && theme === t && "border-accent bg-accent-soft text-accent")}>
              {t === "system" ? "Match device" : t === "light" ? "Light" : "Dark"}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold">Current week</h2>
        <p className="mb-2 text-sm text-muted">The week Today and the dashboard work from. Completing the current week moves it forward automatically.</p>
        <form className="flex flex-wrap items-center gap-2" onSubmit={(e) => { e.preventDefault(); const n = Number(week); if (n >= 1 && n <= 206) { setCurrentWeek(n); setWeek(""); } }}>
          <span className="text-sm">Now: week {ready ? s.currentWeek : "…"}</span>
          <input type="number" min={1} max={206} value={week} onChange={(e) => setWeek(e.target.value)} placeholder="1–206" aria-label="New current week" className="w-24 rounded-md border border-rule bg-surface px-2 py-1.5 text-sm" />
          <button type="submit" className={btn}>Set week</button>
        </form>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold">Where your progress lives</h2>
        <p className="text-sm">{info ? info.description : "Loading."}</p>
        <p className="mt-1 text-sm text-muted">Until cloud sync is added, use export and import to move progress between your phone and laptop. Clearing browser data deletes local progress, so export regularly.</p>
        {ready && <p className="mt-1 text-xs text-muted">Last change {s.updatedAt.startsWith("1970") ? "never" : new Date(s.updatedAt).toLocaleString()}. {Object.keys(s.checks).length} items ticked, {Object.keys(s.notes).length} notes, {s.dsa.length} DSA problems.</p>}
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={exportJson} disabled={!ready} className={btn}>Export progress (JSON)</button>
          <button type="button" onClick={() => file.current?.click()} disabled={!ready} className={btn}>Import progress</button>
          <input ref={file} type="file" accept="application/json,.json" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void onImport(f); e.target.value = ""; }} />
        </div>
        {msg && <p role="status" className={cx("mt-3 rounded-md px-3 py-2 text-sm", msg.ok ? "bg-ok-soft text-ok" : "bg-danger-soft text-danger")}>{msg.text}</p>}
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold">Reset</h2>
        <p className="mb-2 text-sm text-muted">Deletes every tick, mastery stage, gate record, note and journal entry in this browser. The curriculum itself is untouched.</p>
        <button type="button" disabled={!ready} onClick={() => { if (window.confirm("Delete all progress in this browser? Export first if you might want it back.")) { resetState(); setMsg({ ok: true, text: "Progress reset." }); } }} className="rounded-md border border-danger/50 px-3 py-2 text-sm text-danger hover:bg-danger-soft">
          Reset all progress
        </button>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold">Curriculum data</h2>
        <p className="text-sm">{dataInfo.counts}</p>
        <p className="mt-1 text-xs text-muted">Master MD5 <span className="font-mono">{dataInfo.md5}</span>, generated {dataInfo.generated}.</p>
      </section>
    </div>
  );
}
