import { useCallback, useEffect, useState } from "react";
import { listOwnInvitations } from "@/lib/invitationApi";
import { useEditorStore } from "@/stores/editorStore";
import type { Invitation } from "@/types/invitation";

type ListStatus = "loading" | "ready" | "error";

/** The signed-in user's invitations, newest first, plus helpers to apply changes without refetching. */
export function useInvitationList(userId: string | undefined) {
  const [status, setStatus] = useState<ListStatus>("loading");
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  const reload = useCallback(
    async ({ silent = false } = {}) => {
      if (!userId) return;
      if (!silent) setStatus("loading");
      try {
        setInvitations(await listOwnInvitations(userId));
        setStatus("ready");
      } catch {
        // A failed background refresh keeps what is already on screen.
        if (!silent) setStatus("error");
      }
    },
    [userId],
  );

  useEffect(() => {
    void reload();
  }, [reload]);

  // Arriving from the editor can race its final save, so refresh once that save finishes.
  useEffect(
    () =>
      useEditorStore.subscribe((state, prev) => {
        if (prev.isSaving && !state.isSaving) void reload({ silent: true });
      }),
    [reload],
  );

  const replaceOne = useCallback(
    (updated: Invitation) => setInvitations((list) => list.map((i) => (i.id === updated.id ? updated : i))),
    [],
  );
  const removeOne = useCallback((id: string) => setInvitations((list) => list.filter((i) => i.id !== id)), []);

  return { status, invitations, reload, replaceOne, removeOne };
}
