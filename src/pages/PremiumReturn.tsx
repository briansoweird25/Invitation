import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useSearchParams } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { RouteFallback } from "@/components/layout/RouteFallback";
import { UnlockPremiumPanel } from "@/components/premium/UnlockPremiumPanel";
import { Button } from "@/components/ui/button";
import { CONFIRM_ERROR_MESSAGE, confirmPremiumCheckout } from "@/lib/purchaseApi";
import { safeRedirectPath } from "@/lib/redirect";
import { usePremiumAccess } from "@/stores/accessStore";

type Confirm = "confirming" | "paid" | "pending" | "expired" | "error";

const POLL_MS = 3000;
const MAX_POLLS = 6;

function Shell({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <Container className="py-20 sm:py-28">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
        <h1 className="mt-3 font-serif text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl">{title}</h1>
        <div className="mt-6 space-y-6 text-muted-foreground">{children}</div>
      </div>
    </Container>
  );
}

function Actions({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap justify-center gap-3">{children}</div>;
}

/** Where Stripe sends people back to. The page only reports what the server confirms; it never decides that a payment succeeded. */
export default function PremiumReturn() {
  const { pathname } = useLocation();
  return pathname.endsWith("/cancelled") ? <Cancelled /> : <Success />;
}

function Cancelled() {
  const [params] = useSearchParams();
  const returnTo = safeRedirectPath(params.get("return_to"), "/templates");
  const { hasPremium, status } = usePremiumAccess();
  if (status === "unknown" || status === "loading") return <RouteFallback label="Checking your account…" />;

  if (hasPremium) {
    return (
      <Shell eyebrow="Premium" title="You already have Premium">
        <p>Everything is unlocked, so there is nothing to pay for.</p>
        <Actions>
          <Button asChild>
            <Link to={returnTo}>Continue</Link>
          </Button>
        </Actions>
      </Shell>
    );
  }
  return (
    <Shell eyebrow="Checkout cancelled" title="No payment was made">
      <p>You weren't charged. Premium is still waiting whenever you want it.</p>
      <div className="flex justify-center">
        <UnlockPremiumPanel returnTo={returnTo} compact />
      </div>
      <Actions>
        <Button asChild variant="secondary">
          <Link to={returnTo}>Keep browsing</Link>
        </Button>
      </Actions>
    </Shell>
  );
}

function Success() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const returnTo = safeRedirectPath(params.get("return_to"), "/templates");
  const { hasPremium, status, refresh } = usePremiumAccess();
  const [confirm, setConfirm] = useState<Confirm>("confirming");
  const [attempt, setAttempt] = useState(0);
  const polls = useRef(0);

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    setConfirm("confirming");
    polls.current = 0;

    async function check() {
      try {
        // The server asks Stripe about this session and records it if paid; the answer is what we show.
        const result = await confirmPremiumCheckout(sessionId!);
        if (cancelled) return;
        if (result === "paid") {
          await refresh();
          if (!cancelled) setConfirm("paid");
        } else if (result === "expired") setConfirm("expired");
        else if (++polls.current < MAX_POLLS) timer = setTimeout(() => void check(), POLL_MS);
        else setConfirm("pending");
      } catch {
        if (!cancelled) setConfirm("error");
      }
    }
    void check();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [sessionId, refresh, attempt]);

  // Visiting without a checkout: owners see their status, everyone else is sent to the plans.
  if (!sessionId) {
    if (status === "unknown" || status === "loading") return <RouteFallback label="Checking your account…" />;
    if (!hasPremium) return <Navigate to="/pricing" replace />;
    return (
      <Shell eyebrow="Premium" title="You already have Premium">
        <p>Everything is unlocked on this account.</p>
        <Actions>
          <Button asChild>
            <Link to={returnTo}>Continue</Link>
          </Button>
        </Actions>
      </Shell>
    );
  }

  if (confirm === "confirming") {
    return (
      <Shell eyebrow="One moment" title="Confirming your purchase">
        <p role="status" aria-live="polite">
          We're checking with our payment provider. This usually takes a few seconds.
        </p>
      </Shell>
    );
  }
  if (confirm === "paid") {
    return (
      <Shell eyebrow="Thank you" title="Premium unlocked">
        <p role="status">Every Premium template and Look is now available on your account. It's yours to keep, and it's here whenever you sign in.</p>
        <Actions>
          <Button asChild size="lg">
            <Link to={returnTo}>Continue</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link to="/dashboard">Go to dashboard</Link>
          </Button>
        </Actions>
      </Shell>
    );
  }
  if (confirm === "pending") {
    return (
      <Shell eyebrow="Almost there" title="Your payment is still processing">
        <p role="status">Some payments take a little longer to clear. Premium unlocks by itself once it does. You can check again now, or come back later; nothing is lost.</p>
        <Actions>
          <Button onClick={() => setAttempt((n) => n + 1)}>Check again</Button>
          <Button asChild variant="secondary">
            <Link to="/dashboard">Go to dashboard</Link>
          </Button>
        </Actions>
      </Shell>
    );
  }
  if (confirm === "expired") {
    return (
      <Shell eyebrow="Checkout expired" title="That checkout is no longer open">
        <p>You weren't charged. You can start again whenever you like.</p>
        <div className="flex justify-center">
          <UnlockPremiumPanel returnTo={returnTo} compact />
        </div>
      </Shell>
    );
  }
  return (
    <Shell eyebrow="Something went wrong" title="We couldn't confirm your purchase">
      <p role="alert">{CONFIRM_ERROR_MESSAGE} If you were charged, your Premium access will appear automatically once the payment is confirmed.</p>
      <Actions>
        <Button onClick={() => setAttempt((n) => n + 1)}>Try again</Button>
        <Button asChild variant="secondary">
          <Link to="/dashboard">Go to dashboard</Link>
        </Button>
      </Actions>
    </Shell>
  );
}
