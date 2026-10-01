import { Check, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUnlockPremium } from "@/hooks/useUnlockPremium";
import { useAuthStore } from "@/stores/authStore";
import { usePremiumAccess } from "@/stores/accessStore";

const PRICE_LABEL = import.meta.env.VITE_PREMIUM_PRICE_LABEL?.trim();

const PERKS = ["Every Premium template and Look", "One-time purchase, no subscription", "Yours to keep, on every device you sign in on"];

interface UnlockPremiumPanelProps {
  /** Where to come back to after paying, such as the editor page that needs Premium. */
  returnTo?: string;
  /** Hides the list of perks, for tight spaces. */
  compact?: boolean;
}

/**
 * The Unlock action, in all its states: signed out, ready, sending you to checkout, failed, and already owned.
 * Whether to show it is decided by the caller; what it does is decided by the server.
 */
export function UnlockPremiumPanel({ returnTo, compact }: UnlockPremiumPanelProps) {
  const signedIn = useAuthStore((s) => s.status === "authenticated");
  const { hasPremium, status, refresh } = usePremiumAccess();
  const { state, error, start } = useUnlockPremium(returnTo);

  if (hasPremium || state === "owned") {
    return (
      <p role="status" className="flex items-center gap-2 text-sm">
        <Check className="size-4 text-accent" aria-hidden="true" /> You already have Premium. Everything is unlocked.
      </p>
    );
  }

  const starting = state === "starting";
  return (
    <div className="space-y-4">
      {!compact && (
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          {PERKS.map((perk) => (
            <li key={perk} className="flex items-start gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" /> {perk}
            </li>
          ))}
        </ul>
      )}

      {signedIn ? (
        <Button size="lg" className="w-full sm:w-auto" onClick={() => void start()} disabled={starting} aria-busy={starting}>
          <Lock aria-hidden="true" /> {starting ? "Taking you to secure checkout…" : `Unlock Premium${PRICE_LABEL ? ` · ${PRICE_LABEL}` : ""}`}
        </Button>
      ) : (
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link to="/login" state={{ from: returnTo ?? "/pricing" }}>
            Log in to unlock Premium
          </Link>
        </Button>
      )}

      {state === "error" && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      {signedIn && status === "error" && (
        <p role="alert" className="text-sm text-muted-foreground">
          We couldn't check whether you already have Premium.{" "}
          <button type="button" className="underline underline-offset-4" onClick={() => void refresh()}>
            Check again
          </button>
        </p>
      )}
      <p className="text-xs text-muted-foreground">Secure payment by Stripe. We never see your card details.</p>
    </div>
  );
}
