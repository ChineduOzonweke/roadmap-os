import { ImageResponse } from "next/og";

/** App icon (brand mark on the accent colour), rendered to PNG at build time. */
export function pwaIcon(size: number, { maskable = false }: { maskable?: boolean } = {}) {
  // Maskable icons need the mark inside the central safe zone (~80%).
  const glyph = Math.round(size * (maskable ? 0.46 : 0.58));
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a5f6b", borderRadius: maskable ? 0 : Math.round(size * 0.2) }}>
        <svg width={glyph} height={glyph} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6" cy="18" r="2" />
          <circle cx="18" cy="6" r="2" />
          <path d="M8 18h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7" />
        </svg>
      </div>
    ),
    { width: size, height: size },
  );
}
