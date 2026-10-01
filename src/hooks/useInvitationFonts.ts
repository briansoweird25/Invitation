import { useEffect } from "react";
import { ensureFontLoaded } from "@/lib/fonts";
import type { InvitationDesign } from "@/types/invitation";

/** Loads the fonts an invitation uses, once each, the first time they appear. */
export function useInvitationFonts(design: Pick<InvitationDesign, "headingFont" | "bodyFont" | "scriptFont">) {
  const { headingFont, bodyFont, scriptFont } = design;
  useEffect(() => {
    for (const name of [headingFont, bodyFont, scriptFont]) if (name) void ensureFontLoaded(name);
  }, [headingFont, bodyFont, scriptFont]);
}
