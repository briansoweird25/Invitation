export type InvitationCategory = "wedding" | "birthday";

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
  /** Template-specific decoration keys. Unrecognized keys are ignored. */
  decorations?: string[];
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
