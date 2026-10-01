import { create } from "zustand";

export type EditorPanel = "looks" | "event" | "message" | "rsvp" | "typography" | "colors" | "background" | "decorations";
export type MobileSheet = "details" | "design" | "rsvp";

export const ZOOM_MIN = 0.75;
export const ZOOM_MAX = 1.5;
export const ZOOM_STEP = 0.25;

/** Temporary editor UI state. Invitation content lives in `invitationStore`. */
interface EditorState {
  openPanels: EditorPanel[];
  mobileSheet: MobileSheet | null;
  zoom: number;
  isDirty: boolean;
  isSaving: boolean;
  saveError: boolean;
  togglePanel: (panel: EditorPanel) => void;
  setMobileSheet: (sheet: MobileSheet | null) => void;
  setZoom: (zoom: number) => void;
  setDirty: (isDirty: boolean) => void;
  setSaving: (isSaving: boolean) => void;
  setSaveError: (saveError: boolean) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  openPanels: ["event", "looks"],
  mobileSheet: null,
  zoom: 1,
  isDirty: false,
  isSaving: false,
  saveError: false,
  togglePanel: (panel) =>
    set((s) => ({
      openPanels: s.openPanels.includes(panel) ? s.openPanels.filter((p) => p !== panel) : [...s.openPanels, panel],
    })),
  setMobileSheet: (mobileSheet) => set({ mobileSheet }),
  setZoom: (zoom) => set({ zoom: Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoom)) }),
  setDirty: (isDirty) => set({ isDirty }),
  setSaving: (isSaving) => set({ isSaving }),
  setSaveError: (saveError) => set({ saveError }),
}));
