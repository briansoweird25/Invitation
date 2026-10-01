import { create } from "zustand";
import { fetchPremiumAccess } from "@/lib/purchaseApi";
import { useAuthStore } from "./authStore";

export type AccessStatus = "unknown" | "loading" | "ready" | "error";

interface AccessState {
  status: AccessStatus;
  hasPremium: boolean;
  /** Reads the signed-in user's access from the database. This is the only way `hasPremium` ever becomes true. */
  refresh: () => Promise<void>;
  reset: () => void;
}

/** Guards against a slow answer for a previous user landing after sign-out or a switch of account. */
let generation = 0;

/**
 * Whether the signed-in user owns Premium, as the database reports it. It is a convenience for the interface:
 * hiding or showing buttons. Changing it in the browser unlocks nothing, because the database refuses Premium
 * templates and Looks to anyone without a paid purchase.
 */
export const useAccessStore = create<AccessState>((set) => ({
  status: "unknown",
  hasPremium: false,
  async refresh() {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return set({ status: "unknown", hasPremium: false });
    const mine = ++generation;
    set((s) => ({ status: s.status === "ready" ? "ready" : "loading" }));
    try {
      const hasPremium = await fetchPremiumAccess(userId);
      if (mine === generation) set({ hasPremium, status: "ready" });
    } catch {
      if (mine === generation) set({ hasPremium: false, status: "error" });
    }
  },
  reset() {
    generation++;
    set({ status: "unknown", hasPremium: false });
  },
}));

export const usePremiumAccess = () => ({
  hasPremium: useAccessStore((s) => s.hasPremium),
  status: useAccessStore((s) => s.status),
  refresh: useAccessStore((s) => s.refresh),
});
