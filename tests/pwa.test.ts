import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import manifest from "@/app/manifest";

describe("PWA", () => {
  it("has an installable manifest", () => {
    const m = manifest();
    expect(m).toMatchObject({ name: "Roadmap OS", start_url: "/", display: "standalone" });
    const sizes = (m.icons ?? []).map((i) => i.sizes);
    expect(sizes).toContain("192x192");
    expect(sizes).toContain("512x512");
    expect((m.icons ?? []).some((i) => i.purpose === "maskable")).toBe(true);
  });

  it("service worker is valid JavaScript, versions its caches and never touches user progress", () => {
    const src = readFileSync("public/sw.js", "utf8");
    expect(() => new Function(src)).not.toThrow();
    expect(src).toMatch(/const VERSION = "v\d+"/);
    expect(src).toContain("caches.delete");
    const code = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
    expect(code).not.toMatch(/localStorage|indexedDB/);
    expect(src).toContain('request.method !== "GET"');
  });
});
