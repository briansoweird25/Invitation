import { create } from "zustand";
import { createInvitationDraft } from "@/lib/invitation";
import type {
  Invitation,
  InvitationCategory,
  InvitationContent,
  InvitationDesign,
  InvitationStatus,
  RSVPSettings,
} from "@/types/invitation";
import { useEditorStore } from "./editorStore";

/** The invitation being edited. The editor writes here and the renderer reads from here. */
interface InvitationState {
  /** Null until the first save creates the row. */
  id: string | null;
  title: string;
  templateId: string;
  category: InvitationCategory;
  content: InvitationContent;
  design: InvitationDesign;
  rsvp: RSVPSettings;
  status: InvitationStatus;
  init: (templateId: string, presetId?: string, category?: string) => void;
  load: (invitation: Invitation) => void;
  setId: (id: string) => void;
  setTitle: (title: string) => void;
  updateContent: (patch: Partial<InvitationContent>) => void;
  updateDesign: (patch: Partial<InvitationDesign>) => void;
  /** Replaces the whole design, for applying a preset. */
  setDesign: (design: InvitationDesign) => void;
  updateRsvp: (patch: Partial<RSVPSettings>) => void;
}

const markDirty = () => useEditorStore.getState().setDirty(true);

export const useInvitationStore = create<InvitationState>((set) => ({
  id: null,
  ...createInvitationDraft("elegant-wedding"),
  init: (templateId, presetId, category) => {
    set({ id: null, ...createInvitationDraft(templateId, presetId, category) });
    useEditorStore.getState().setDirty(false);
  },
  load: (invitation) => {
    set({
      id: invitation.id,
      title: invitation.title,
      templateId: invitation.templateId,
      category: invitation.category,
      content: invitation.content,
      design: invitation.design,
      rsvp: invitation.rsvp,
      status: invitation.status,
    });
    useEditorStore.getState().setDirty(false);
  },
  setId: (id) => set({ id }),
  setTitle: (title) => {
    set({ title });
    markDirty();
  },
  updateContent: (patch) => {
    set((s) => ({ content: { ...s.content, ...patch } }));
    markDirty();
  },
  updateDesign: (patch) => {
    set((s) => ({ design: { ...s.design, ...patch } }));
    markDirty();
  },
  setDesign: (design) => {
    set({ design });
    markDirty();
  },
  updateRsvp: (patch) => {
    set((s) => ({ rsvp: { ...s.rsvp, ...patch } }));
    markDirty();
  },
}));
