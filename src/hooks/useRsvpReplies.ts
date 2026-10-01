import { useCallback, useEffect, useState } from "react";
import { getOwnInvitation, LOAD_ERROR_MESSAGE } from "@/lib/invitationApi";
import { listRsvps, RSVP_LIST_ERROR_MESSAGE } from "@/lib/rsvpApi";
import type { Invitation, RsvpReply } from "@/types/invitation";

export type RepliesState =
  | { status: "loading" }
  | { status: "ready"; invitation: Invitation; replies: RsvpReply[] }
  | { status: "missing" }
  | { status: "error"; message: string };

/** One of the user's invitations together with its replies. A missing or foreign invitation reads as "missing". */
export function useRsvpReplies(invitationId: string | undefined, userId: string | undefined) {
  const [state, setState] = useState<RepliesState>({ status: "loading" });

  const load = useCallback(async () => {
    if (!invitationId || !userId) return;
    setState({ status: "loading" });
    try {
      const invitation = await getOwnInvitation(invitationId, userId);
      if (!invitation) return setState({ status: "missing" });
      setState({ status: "ready", invitation, replies: await listRsvps(invitation.id) });
    } catch (e) {
      setState({ status: "error", message: e instanceof Error ? e.message : RSVP_LIST_ERROR_MESSAGE || LOAD_ERROR_MESSAGE });
    }
  }, [invitationId, userId]);

  useEffect(() => {
    void load();
  }, [load]);

  return { state, reload: load };
}
