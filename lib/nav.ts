export type NavItem = { href: string; label: string };

export const NAV: { group: string; items: NavItem[] }[] = [
  { group: "Execute", items: [
    { href: "/today", label: "Today" },
    { href: "/", label: "Dashboard" },
    { href: "/weeks", label: "Weeks" },
    { href: "/timeline", label: "Timeline" },
  ] },
  { group: "Curriculum", items: [
    { href: "/curriculum", label: "Phases" },
    { href: "/checkpoints", label: "Checkpoints" },
    { href: "/graph", label: "Dependencies" },
    { href: "/projects", label: "Projects" },
    { href: "/resources", label: "Resources" },
  ] },
  { group: "Practice", items: [
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
  if (href === "/") return pathname === "/";
  const prefix: Record<string, string[]> = {
    "/curriculum": ["/curriculum", "/phases", "/topics", "/concepts"],
    "/weeks": ["/weeks"],
  };
  return (prefix[href] ?? [href]).some((p) => pathname === p || pathname.startsWith(p + "/"));
}
