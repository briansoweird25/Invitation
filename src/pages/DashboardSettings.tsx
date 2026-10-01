import { useState } from "react";
import { toast } from "sonner";
import { Container } from "@/components/layout/Container";
import { UnlockPremiumPanel } from "@/components/premium/UnlockPremiumPanel";
import { Button } from "@/components/ui/button";
import { displayName, useAuthStore } from "@/stores/authStore";
import { useAccessStore, usePremiumAccess } from "@/stores/accessStore";

export default function DashboardSettings() {
  const user = useAuthStore((s) => s.user);
  const { hasPremium, status, refresh } = usePremiumAccess();
  const [checking, setChecking] = useState(false);

  // Premium belongs to the account, so it returns by itself on sign-in. This re-reads it on demand, for a purchase made a moment ago elsewhere.
  async function check() {
    setChecking(true);
    await refresh();
    setChecking(false);
    const { status: after, hasPremium: has } = useAccessStore.getState();
    if (after === "error") toast.error("We couldn't check your Premium access. Please try again.");
    else toast.success(has ? "Premium is active on your account" : "No Premium purchase found on this account");
  }

  return (
    <Container className="py-14 sm:py-20">
      <h1 className="font-serif text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl">Settings</h1>
      <p className="mt-3 text-sm text-muted-foreground">Signed in as {displayName(user)}.</p>

      <section aria-labelledby="premium-heading" className="mt-12 max-w-xl border-t pt-8">
        <h2 id="premium-heading" className="font-serif text-2xl font-medium">
          Premium
        </h2>
        {status === "ready" && hasPremium ? (
          <p className="mt-3 text-sm" role="status">
            Premium is active on this account. Every Premium template and Look is unlocked, on any device you sign in on.
          </p>
        ) : (
          <div className="mt-4">
            <UnlockPremiumPanel returnTo="/dashboard/settings" compact />
          </div>
        )}
        <Button variant="ghost" size="sm" className="mt-4 -ml-3" onClick={() => void check()} disabled={checking}>
          {checking ? "Checking…" : "Check my purchase"}
        </Button>
      </section>
    </Container>
  );
}
