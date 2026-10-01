import { useCallback, useEffect, useState } from "react";
import { getPublishedInvitation, PUBLIC_LOAD_ERROR_MESSAGE, type PublicInvitation } from "@/lib/invitationApi";

export type PublishedState =
  | { status: "loading" }
  | { status: "ready"; invitation: PublicInvitation }
  | { status: "missing" }
  | { status: "error"; message: string };

/** Loads the published invitation for a slug. `retry` reloads after an error. */
export function usePublishedInvitation(slug: string | undefined) {
  const [state, setState] = useState<PublishedState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });
    getPublishedInvitation(slug ?? "").then(
      (invitation) => !cancelled && setState(invitation ? { status: "ready", invitation } : { status: "missing" }),
      (e: unknown) => !cancelled && setState({ status: "error", message: e instanceof Error ? e.message : PUBLIC_LOAD_ERROR_MESSAGE }),
    );
    return () => {
      cancelled = true;
    };
  }, [slug, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { state, retry };
}
