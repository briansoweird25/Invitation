import { useCallback, useState } from "react";
import { CHECKOUT_ERROR_MESSAGE, startPremiumCheckout } from "@/lib/purchaseApi";
import { useAccessStore } from "@/stores/accessStore";

export type UnlockState = "idle" | "starting" | "error" | "owned";

/**
 * Starts the one-time Premium checkout. The server decides: it either returns a Stripe Checkout URL to go to, or
 * says the account already owns Premium (for example from another device), in which case access is refreshed.
 */
export function useUnlockPremium(returnTo?: string) {
  const [state, setState] = useState<UnlockState>("idle");
  const [error, setError] = useState<string>();

  const start = useCallback(async () => {
    setState("starting");
    setError(undefined);
    try {
      const result = await startPremiumCheckout(returnTo);
      if (result.status === "owned") {
        await useAccessStore.getState().refresh();
        setState("owned");
        return;
      }
      // Leaves the app for Stripe. The state stays "starting" so the button cannot be pressed twice.
      window.location.assign(result.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : CHECKOUT_ERROR_MESSAGE);
      setState("error");
    }
  }, [returnTo]);

  return { state, error, start };
}
