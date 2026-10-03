import { pwaIcon } from "@/lib/pwaIcon";

export const dynamic = "force-static";

export function GET() {
  return pwaIcon(192);
}
