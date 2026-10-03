export type NavItem = { href: string; label: string };

export const NAV: { group: string; items: NavItem[] }[] = [
  { group: "Learn", items: [
    { href: "/", label: "Today" },
    { href: "/progress", label: "Progress" },
    { href: "/weeks", label: "Weeks" },
  ] },
  { group: "Roadmap", items: [
    { href: "/curriculum", label: "Roadmap" },
    { href: "/checkpoints", label: "Checkpoints" },
    { href: "/projects", label: "Projects" },
    { href: "/resources", label: "Resources" },
    { href: "/timeline", label: "Timeline" },
    { href: "/graph", label: "Dependencies" },
  ] },
  { group: "Practice", items: [
    { href: "/ai", label: "Working with AI" },
    { href: "/evidence", label: "Evidence" },
    { href: "/dsa", label: "DSA journal" },
    { href: "/career", label: "Career" },
    { href: "/notes", label: "Notes" },
  ] },
  { group: "System", items: [
    { href: "/search", label: "Search" },
    { href: "/guide", label: "How it works" },
    { href: "/settings", label: "Settings" },
  ] },
];

export function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/" || pathname === "/today";
  const prefix: Record<string, string[]> = {
    "/curriculum": ["/curriculum", "/phases", "/topics", "/concepts"],
    "/weeks": ["/weeks"],
  };
  return (prefix[href] ?? [href]).some((p) => pathname === p || pathname.startsWith(p + "/"));
}
