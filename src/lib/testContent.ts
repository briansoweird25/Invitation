import type { InvitationContent } from "@/types/invitation";

/**
 * Content at (or near) the editor's maximum field lengths, for testing how templates cope with long text.
 * Lengths mirror the `maxLength` limits in the editor panels: names 80, headline 60, venue 80,
 * address 120, message 300, additional details 200.
 */
export type StressKind = "long" | "unbroken" | "empty" | "baddate";

const LONG_NAMES = "Alexandria Montgomery-Fitzgerald & Bartholomew Wellington-Smythe III of Kent";
const LONG_MESSAGE =
  "We would be absolutely delighted if you could join us for an unforgettable evening of food, music, dancing, laughter and wonderful memories with all of our closest friends and family members, near and far, old and new.";

export function stressContent(kind: StressKind): InvitationContent {
  const base: InvitationContent = {
    eventTitle: "Together with their large and loving families, we invite you",
    hostNames: LONG_NAMES,
    date: "2026-09-19",
    time: "17:00",
    venue: "The Royal Botanical Gardens Conservatory and Visitor Centre, Main Hall",
    address: "1234 Extraordinarily Long Boulevard, Suite 5678, Springfield, Greater Metropolitan Area",
    message: LONG_MESSAGE,
    additionalDetails: "Dress code: festive attire. Parking is available on the north side. Please arrive fifteen minutes early.",
  };
  switch (kind) {
    case "long":
      return base;
    case "unbroken":
      return { ...base, hostNames: "W".repeat(40), eventTitle: "M".repeat(40), venue: "I".repeat(60), message: "x".repeat(120), additionalDetails: "y".repeat(80) };
    case "empty":
      return { ...base, hostNames: "Al", eventTitle: "", venue: "", address: "", time: "", message: "", additionalDetails: undefined };
    case "baddate":
      return { ...base, date: "next Saturday-ish", hostNames: "Al", eventTitle: "" };
  }
}

export const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
