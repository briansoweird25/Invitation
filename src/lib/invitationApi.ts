import { z } from "zod";
import type { Invitation } from "@/types/invitation";
import type { InvitationDraft } from "./invitation";
import { supabase } from "./supabase";
import { invitationContentSchema, invitationDesignSchema, rsvpSettingsSchema, uuidSchema } from "./validation";

/** All database access for invitations lives here. Components and stores never call Supabase directly. */

export const SAVE_ERROR_MESSAGE = "We couldn't save your invitation. Please try again.";
export const LOAD_ERROR_MESSAGE = "We couldn't open your invitation. Please try again.";

const rowSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  template_id: z.string(),
  category: z.enum(["wedding", "birthday"]),
  title: z.string(),
  slug: z.string().nullable(),
  content: invitationContentSchema,
  design: invitationDesignSchema,
  rsvp_settings: rsvpSettingsSchema,
  status: z.enum(["draft", "published"]),
  created_at: z.string(),
  updated_at: z.string(),
});

function toInvitation(raw: unknown): Invitation {
  const row = rowSchema.parse(raw);
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    slug: row.slug ?? "",
    category: row.category,
    templateId: row.template_id,
    content: row.content,
    design: row.design,
    rsvp: row.rsvp_settings,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function client() {
  if (!supabase) throw new Error("Supabase is not configured.");
  return supabase;
}

function fail(error: unknown, message: string): never {
  if (import.meta.env.DEV) console.error("[invitations]", error);
  throw new Error(message);
}

/** Columns the editor is allowed to write. Status and slug are managed by publishing. */
function writableColumns(draft: InvitationDraft) {
  return {
    template_id: draft.templateId,
    category: draft.category,
    title: draft.title.trim() || "Untitled invitation",
    content: draft.content,
    design: draft.design,
    rsvp_settings: draft.rsvp,
  };
}

export async function createInvitation(userId: string, draft: InvitationDraft): Promise<Invitation> {
  const { data, error } = await client()
    .from("invitations")
    .insert({ user_id: userId, ...writableColumns(draft) })
    .select()
    .single();
  if (error) fail(error, SAVE_ERROR_MESSAGE);
  return toInvitation(data);
}

export async function updateInvitation(id: string, draft: InvitationDraft): Promise<void> {
  const { error } = await client().from("invitations").update(writableColumns(draft)).eq("id", id);
  if (error) fail(error, SAVE_ERROR_MESSAGE);
}

/**
 * Loads an invitation for editing. The owner filter matters: published invitations are
 * publicly readable, but only their owner may open them in the editor.
 * Returns null when the id is malformed, missing, or belongs to someone else.
 */
export async function getOwnInvitation(id: string, userId: string): Promise<Invitation | null> {
  if (!uuidSchema.safeParse(id).success) return null;
  const { data, error } = await client().from("invitations").select().eq("id", id).eq("user_id", userId).maybeSingle();
  if (error) fail(error, LOAD_ERROR_MESSAGE);
  if (!data) return null;
  try {
    return toInvitation(data);
  } catch (e) {
    return fail(e, LOAD_ERROR_MESSAGE);
  }
}
