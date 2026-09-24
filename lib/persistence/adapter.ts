import type { UserState } from "@/types/state";

/**
 * Storage boundary for user progress. The app never touches storage directly;
 * it talks to one adapter. Today: browser storage. Next stage: a Supabase
 * adapter that loads/saves the same UserState document for the signed-in user,
 * so progress follows you across devices.
 */
export interface PersistenceAdapter {
  readonly kind: "browser" | "cloud";
  readonly description: string;
  load(): Promise<UserState | null>;
  save(state: UserState): Promise<void>;
  /** Optional: notify when state changes elsewhere (another tab or device). */
  subscribe?(onRemoteChange: (state: UserState) => void): () => void;
}
