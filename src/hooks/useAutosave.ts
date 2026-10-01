import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createInvitation, PremiumRequiredError, releaseImage, SAVE_ERROR_MESSAGE, updateInvitation } from "@/lib/invitationApi";
import type { InvitationDraft } from "@/lib/invitation";
import { useAccessStore } from "@/stores/accessStore";
import { useAuthStore } from "@/stores/authStore";
import { useEditorStore } from "@/stores/editorStore";
import { useInvitationStore } from "@/stores/invitationStore";

export const AUTOSAVE_DELAY_MS = 1000;
export const AUTOSAVE_RETRY_MS = 5000;

type Snapshot = InvitationDraft;

const snapshot = (): Snapshot => {
  const { title, category, templateId, content, design, rsvp, status } = useInvitationStore.getState();
  return { title, category, templateId, content, design, rsvp, status };
};

const sameAs = (a: Snapshot, b: Snapshot) =>
  a.title === b.title && a.templateId === b.templateId && a.content === b.content && a.design === b.design && a.rsvp === b.rsvp;

/**
 * Debounced autosave for the invitation in `invitationStore`.
 * The first save creates the row and moves the URL from /editor/new to /editor/:id.
 * Edits made while a save is running are picked up by a follow-up save.
 */
export function useAutosave() {
  const navigate = useNavigate();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let saving = false;
    let disposed = false;
    // The background image stored in the database, so a replaced or removed upload can be cleaned up.
    const initial = useInvitationStore.getState();
    let savedImage = initial.id ? initial.design.backgroundImage : undefined;

    const schedule = (delay = AUTOSAVE_DELAY_MS) => {
      clearTimeout(timer);
      timer = setTimeout(() => void save(), delay);
    };

    async function save() {
      clearTimeout(timer);
      const editor = useEditorStore.getState();
      const user = useAuthStore.getState().user;
      if (!user || !editor.isDirty) return;
      if (saving) return schedule();

      saving = true;
      editor.setSaving(true);
      const saved = snapshot();
      const existingId = useInvitationStore.getState().id;
      let createdId: string | undefined;

      try {
        if (existingId) await updateInvitation(existingId, saved);
        else createdId = (await createInvitation(user.id, saved)).id;

        useEditorStore.getState().setSaveError(false);
        const newImage = saved.design.backgroundImage;
        if (savedImage && savedImage !== newImage) void releaseImage(user.id, savedImage, createdId ?? existingId ?? undefined);
        savedImage = newImage;
        if (createdId) useInvitationStore.getState().setId(createdId);
        // Only mark clean if nothing changed while saving; otherwise save again.
        if (sameAs(saved, snapshot())) useEditorStore.getState().setDirty(false);
        else schedule();
        if (createdId && !disposed) navigate(`/editor/${createdId}`, { replace: true });
      } catch (e) {
        if (e instanceof PremiumRequiredError) {
          // Retrying cannot help: ask the person to unlock Premium, and pause saving until they do.
          useEditorStore.getState().setSaveError(true);
          useEditorStore.getState().setPremiumRequired(true);
          // The server's answer is the truth: correct this browser's idea of the account's access.
          void useAccessStore.getState().refresh();
          return;
        }
        const wasFailing = useEditorStore.getState().saveError;
        useEditorStore.getState().setSaveError(true);
        if (!wasFailing) toast.error(e instanceof Error ? e.message : SAVE_ERROR_MESSAGE);
        if (!disposed) schedule(AUTOSAVE_RETRY_MS);
      } finally {
        saving = false;
        useEditorStore.getState().setSaving(false);
      }
    }

    const unsubscribe = useInvitationStore.subscribe((state, prev) => {
      if (
        state.title !== prev.title ||
        state.templateId !== prev.templateId ||
        state.content !== prev.content ||
        state.design !== prev.design ||
        state.rsvp !== prev.rsvp
      ) {
        schedule();
      }
    });

    // Coming back after a Premium refusal (for example from the unlock page): try the pending changes again.
    if (useEditorStore.getState().premiumRequired) {
      useEditorStore.getState().setPremiumRequired(false);
      useEditorStore.getState().setSaveError(false);
      schedule(100);
    }

    // Once access arrives (a purchase finished in another tab, or a refresh), saving resumes.
    const unsubscribeAccess = useAccessStore.subscribe((state, prev) => {
      if (state.hasPremium && !prev.hasPremium && useEditorStore.getState().premiumRequired) {
        useEditorStore.getState().setPremiumRequired(false);
        useEditorStore.getState().setSaveError(false);
        schedule(100);
      }
    });

    // Save promptly when the tab is hidden, and warn before closing with unsaved work.
    const onVisibility = () => document.visibilityState === "hidden" && void save();
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      const { isDirty, isSaving } = useEditorStore.getState();
      if (isDirty || isSaving) e.preventDefault();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      disposed = true;
      unsubscribe();
      unsubscribeAccess();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("beforeunload", onBeforeUnload);
      void save(); // flush pending edits when leaving the editor
    };
  }, [navigate]);
}
