"use client";

import { useState } from "react";

/**
 * Local editable copy of a stored value. When the stored value changes elsewhere
 * (another tab, an import), the draft follows it unless `hold` is true (the user
 * is mid-edit). Uses React's "adjust state when a prop changes" pattern instead
 * of an effect, so there is no extra render pass.
 */
export function useDraft(saved: string, hold = false): [string, (v: string) => void] {
  const [draft, setDraft] = useState(saved);
  const [seen, setSeen] = useState(saved);
  if (saved !== seen) {
    setSeen(saved);
    if (!hold) setDraft(saved);
  }
  return [draft, setDraft];
}
