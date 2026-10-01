import { create } from "zustand";
import type { TemplateId } from "@/components/invitation/templateRegistry";
import { createInvitationDraft } from "@/lib/invitation";
import type {
  InvitationCategory,
  InvitationContent,
  InvitationDesign,
  InvitationStatus,
  RSVPSettings,
} from "@/types/invitation";
import { useEditorStore } from "./editorStore";

/** The invitation being edited. The editor writes here and the renderer reads from here. */
interface InvitationState {
  title: string;
  templateId: string;
  category: InvitationCategory;
  content: InvitationContent;
  design: InvitationDesign;
  rsvp: RSVPSettings;
  status: InvitationStatus;
  init: (templateId: TemplateId) => void;
  setTitle: (title: string) => void;
  updateContent: (patch: Partial<InvitationContent>) => void;
  updateDesign: (patch: Partial<InvitationDesign>) => void;
  updateRsvp: (patch: Partial<RSVPSettings>) => void;
}

const markDirty = () => useEditorStore.getState().setDirty(true);

export const useInvitationStore = create<InvitationState>((set) => ({
  ...createInvitationDraft("elegant-wedding"),
  init: (templateId) => {
    set(createInvitationDraft(templateId));
    useEditorStore.getState().setDirty(false);
  },
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
  updateRsvp: (patch) => {
    set((s) => ({ rsvp: { ...s.rsvp, ...patch } }));
    markDirty();
  },
}));
