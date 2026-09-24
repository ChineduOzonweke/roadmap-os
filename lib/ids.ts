// ID helpers shared by server and client code (no data imports here).

/** Concept IDs contain '#', which cannot live in a URL path: P13.2#4 -> P13.2-4 */
export function conceptSlug(id: string) {
  return id.replace("#", "-");
}

export function conceptIdFromSlug(slug: string) {
  const s = decodeURIComponent(slug);
  const i = s.lastIndexOf("-");
  return i < 0 ? s : `${s.slice(0, i)}#${s.slice(i + 1)}`;
}

export function hrefFor(id: string): string | null {
  if (/^P\d\d$/.test(id)) return `/phases/${id}`;
  if (/^P\d\d\.\d+[a-z]?$/.test(id)) return `/topics/${id}`;
  if (/^P\d\d\.\d+[a-z]?#\d+$/.test(id)) return `/concepts/${conceptSlug(id)}`;
  if (/^(G0|C\d|SG\d[A-Z]?)$/.test(id)) return `/checkpoints/${id}`;
  if (/^PR\d\d$/.test(id)) return `/projects/${id}`;
  if (/^T\d\d$/.test(id)) return `/career#${id}`;
  return null;
}

export function cwLabel(cw: number) {
  return `Week ${cw}`;
}

export function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
