import type { InvitationCategory } from "@/data/taxonomy";

export type { InvitationCategory };

export type InvitationStatus = "draft" | "published";

export interface InvitationContent {
  /** The occasion line. Weddings use it as a short lead-in ("Together with their families"); birthdays use it as the headline after the name ("turns 30"). */
  eventTitle: string;
  /** One or more names. Joined with "&" or "and" for couples: "Eleanor & James". */
  hostNames: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  /** 24-hour time, HH:mm. */
  time: string;
  venue: string;
  address: string;
  message: string;
  additionalDetails?: string;
}

export interface InvitationDesign {
  /** Font names resolved by `resolveFont` in `@/lib/fonts`. */
  headingFont: string;
  bodyFont: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  backgroundImage?: string;
  borderStyle?: string;
  /** Template-specific decoration toggles (for example "sprigs"). Unknown ids are ignored. */
  decorations?: string[];

  /** A second accent for richer palettes. */
  secondaryColor?: string;
  /** Script font for names and flourishes only. */
  scriptFont?: string;
  /** Kit frame drawn around the card. */
  frame?: { id: string; color?: string };
  /** Kit pattern drawn over the background. */
  pattern?: { id: string; color?: string; opacity?: number };
  /** Kit wash or texture drawn over the background color. */
  background?: { id: string; color?: string; opacity?: number };
  /** Editor hints only. Renderers always use the resolved values above. */
  paletteId?: string;
  fontPairingId?: string;
  presetId?: string;
}

export interface RSVPSettings {
  enabled: boolean;
  deadline?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  maxGuests?: number;
}

export interface Invitation {
  id: string;
  userId: string;
  title: string;
  slug: string;
  category: InvitationCategory;
  templateId: string;
  content: InvitationContent;
  design: InvitationDesign;
  rsvp: RSVPSettings;
  status: InvitationStatus;
  createdAt: string;
  updatedAt: string;
}

/** What a template component receives. Templates control presentation only. */
export interface TemplateProps {
  content: InvitationContent;
  design: InvitationDesign;
}

export type Attendance = "attending" | "declined";

/** One guest reply. Only the invitation's owner can read these. */
export interface RsvpReply {
  id: string;
  invitationId: string;
  guestName: string;
  guestEmail: string;
  attendance: Attendance;
  /** Everyone the reply covers, including the guest. Always 1 for a decline. */
  guestCount: number;
  message: string;
  createdAt: string;
}
