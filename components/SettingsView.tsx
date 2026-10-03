"use client";

import { useTheme } from "next-themes";
import { useState, useSyncExternalStore } from "react";
import { useHydrated, useUserState } from "@/lib/store";
import { setCurrentWeek, setFlag } from "@/lib/actions";
import { BackupPanel } from "./BackupPanel";
import { SHOW_REFS_FLAG } from "./Ref";

const noop = () => () => {};

export function SettingsView({ dataInfo }: { dataInfo: { md5: string; generated: string; counts: string } }) {
  const s = useUserState();
  const ready = useHydrated();
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const [week, setWeek] = useState<string>("");
  const btn = "btn btn-secondary btn-sm";
  return (
    <div className="space-y-8">
      <section id="backup" className="scroll-mt-20">
        <h2 className="mb-2 text-base font-semibold">Backup and restore</h2>
        <BackupPanel curriculum={{ md5: dataInfo.md5, generated: dataInfo.generated }} />
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold">Appearance</h2>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Theme">
          {["system", "light", "dark"].map((t) => (
            <button key={t} type="button" aria-pressed={mounted && theme === t} onClick={() => setTheme(t)} className="chip">
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
          <input type="number" min={1} max={206} value={week} onChange={(e) => setWeek(e.target.value)} placeholder="1–206" aria-label="New current week" className="w-auto w-24 input" />
          <button type="submit" className={btn}>Set week</button>
        </form>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold">Reference codes</h2>
        <label className="flex min-h-11 cursor-pointer items-start gap-3">
          <input type="checkbox" className="mt-0.5 shrink-0" disabled={!ready} checked={ready && !!s.flags[SHOW_REFS_FLAG]} onChange={(e) => setFlag(SHOW_REFS_FLAG, e.target.checked)} />
          <span className="text-sm">
            <span className="block font-medium">Show reference codes</span>
            <span className="text-muted">Adds the roadmap&apos;s internal codes (P13.2, C3, SG4, PR07) next to names, for cross-checking with the master roadmap. Off by default.</span>
          </span>
        </label>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold">Curriculum data</h2>
        <p className="text-sm">{dataInfo.counts}</p>
        <p className="mt-1 text-xs text-muted">Master MD5 <span className="font-mono">{dataInfo.md5}</span>, generated {dataInfo.generated}.</p>
      </section>
    </div>
  );
}
