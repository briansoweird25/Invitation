import { z } from "zod";
import type { RsvpReply } from "@/types/invitation";
import type { RsvpSubmission } from "./rsvp";
import { supabase } from "./supabase";
import { uuidSchema } from "./validation";

/** All database access for RSVP replies lives here. */

export const RSVP_SUBMIT_ERROR_MESSAGE = "We couldn't send your reply. Please try again.";
export const RSVP_CLOSED_MESSAGE = "This invitation is no longer accepting replies.";
export const RSVP_LIST_ERROR_MESSAGE = "We couldn't load the replies. Please try again.";

const FORBIDDEN = "42501";

function client() {
  if (!supabase) throw new Error("Supabase is not configured.");
  return supabase;
}

function fail(error: unknown, message: string): never {
  if (import.meta.env.DEV) console.error("[rsvps]", error);
  throw new Error(message);
}

/**
 * Sends a guest's reply. Anyone may do this for a published invitation with RSVPs on; the database policy decides.
 * The row is not read back, because guests cannot read replies.
 */
export async function submitRsvp(invitationId: string, reply: RsvpSubmission): Promise<void> {
  if (!uuidSchema.safeParse(invitationId).success) throw new Error(RSVP_SUBMIT_ERROR_MESSAGE);
  const { error } = await client()
    .from("rsvps")
    .insert({
      invitation_id: invitationId,
      guest_name: reply.guestName,
      guest_email: reply.guestEmail ?? null,
      attendance: reply.attendance,
      guest_count: reply.guestCount,
      message: reply.message ?? null,
    });
  if (!error) return;
  // Row level security answers 42501 when RSVPs are off, the invitation was unpublished, or the deadline passed.
  fail(error, error.code === FORBIDDEN ? RSVP_CLOSED_MESSAGE : RSVP_SUBMIT_ERROR_MESSAGE);
}

const replyRowSchema = z.object({
  id: z.string(),
  invitation_id: z.string(),
  guest_name: z.string(),
  guest_email: z.string().nullable(),
  attendance: z.enum(["attending", "declined"]),
  guest_count: z.number(),
  message: z.string().nullable(),
  created_at: z.string(),
});

/** The replies to one of the signed-in owner's invitations, newest first. Other people's rows are never returned. */
export async function listRsvps(invitationId: string): Promise<RsvpReply[]> {
  if (!uuidSchema.safeParse(invitationId).success) return [];
  const { data, error } = await client().from("rsvps").select().eq("invitation_id", invitationId).order("created_at", { ascending: false });
  if (error) fail(error, RSVP_LIST_ERROR_MESSAGE);
  return (data ?? []).flatMap((row) => {
    const parsed = replyRowSchema.safeParse(row);
    if (!parsed.success) return [];
    const r = parsed.data;
    return [{ id: r.id, invitationId: r.invitation_id, guestName: r.guest_name, guestEmail: r.guest_email ?? "", attendance: r.attendance, guestCount: r.guest_count, message: r.message ?? "", createdAt: r.created_at }];
  });
}
