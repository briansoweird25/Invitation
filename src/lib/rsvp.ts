import { z } from "zod";
import type { Attendance, RsvpReply, RSVPSettings } from "@/types/invitation";
import { emailSchema, MAX_GUESTS_LIMIT } from "./validation";

export const RSVP_NAME_MAX = 120;
export const RSVP_EMAIL_MAX = 254;
export const RSVP_MESSAGE_MAX = 1000;
/** Offered when the host sets no limit, so a stray digit cannot book fifty seats. */
export const DEFAULT_MAX_GUESTS = 10;

/** The most guests one reply may cover for this invitation. */
export function maxGuestsFor(rsvp: Pick<RSVPSettings, "maxGuests">): number {
  const n = rsvp.maxGuests;
  return typeof n === "number" && Number.isFinite(n) ? Math.min(MAX_GUESTS_LIMIT, Math.max(1, Math.round(n))) : DEFAULT_MAX_GUESTS;
}

/** What a guest submits. Optional text arrives as an empty string from the form and becomes undefined. */
export function rsvpSubmissionSchema(maxGuests: number) {
  const optional = (max: number, message: string) =>
    z
      .string()
      .trim()
      .max(max, message)
      .transform((v) => v || undefined)
      .optional();
  return z
    .object({
      guestName: z.string().trim().min(1, "Enter your name.").max(RSVP_NAME_MAX, `Use ${RSVP_NAME_MAX} characters or fewer.`),
      guestEmail: z
        .string()
        .trim()
        .max(RSVP_EMAIL_MAX, "That email is too long.")
        .transform((v) => v || undefined)
        .pipe(emailSchema.optional()),
      attendance: z.enum(["attending", "declined"], { error: "Choose whether you can come." }),
      guestCount: z.coerce.number({ error: "Enter how many guests." }).int("Enter a whole number.").min(1, "Enter at least 1.").max(maxGuests, `This invitation allows up to ${maxGuests} guests per reply.`),
      message: optional(RSVP_MESSAGE_MAX, `Use ${RSVP_MESSAGE_MAX} characters or fewer.`),
    })
    .transform((v) => ({ ...v, guestCount: v.attendance === "declined" ? 1 : v.guestCount }));
}

export type RsvpSubmission = z.output<ReturnType<typeof rsvpSubmissionSchema>>;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * True when the reply-by date has passed. The deadline day itself still accepts replies, and a deadline that is
 * not a date means "no deadline". Uses the guest's local calendar day.
 */
export function isRsvpClosed(deadline: string | undefined, now: Date = new Date()): boolean {
  if (!deadline || !/^\d{4}-\d{2}-\d{2}$/.test(deadline)) return false;
  const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  return deadline < today;
}

export interface RsvpStats {
  replies: number;
  attending: number;
  declined: number;
  /** Seats the attending replies add up to. */
  guests: number;
}

export function rsvpStats(replies: Pick<RsvpReply, "attendance" | "guestCount">[]): RsvpStats {
  let attending = 0;
  let guests = 0;
  for (const r of replies) {
    if (r.attendance === "attending") {
      attending++;
      guests += r.guestCount;
    }
  }
  return { replies: replies.length, attending, declined: replies.length - attending, guests };
}

export type RsvpFilter = "all" | Attendance;

export function filterReplies<T extends Pick<RsvpReply, "attendance">>(replies: T[], filter: RsvpFilter): T[] {
  return filter === "all" ? replies : replies.filter((r) => r.attendance === filter);
}
