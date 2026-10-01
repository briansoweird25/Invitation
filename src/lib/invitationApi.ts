import { z } from "zod";
import { toInvitationCategory } from "@/data/taxonomy";
import type { Invitation } from "@/types/invitation";
import type { InvitationDraft } from "./invitation";
import { slugify, withSuffix } from "./slug";
import { ownedStoragePath, removeStoredFile } from "./storage";
import { supabase } from "./supabase";
import { invitationContentSchema, invitationDesignSchema, rsvpSettingsSchema, slugSchema, uuidSchema } from "./validation";

/** All database access for invitations lives here. Components and stores never call Supabase directly. */

export const SAVE_ERROR_MESSAGE = "We couldn't save your invitation. Please try again.";
export const LIST_ERROR_MESSAGE = "We couldn't load your invitations. Please try again.";
export const DELETE_ERROR_MESSAGE = "We couldn't delete your invitation. Please try again.";
export const PUBLISH_ERROR_MESSAGE = "We couldn't publish your invitation. Please try again.";
export const UNPUBLISH_ERROR_MESSAGE = "We couldn't unpublish your invitation. Please try again.";
export const PUBLISH_NEEDS_NAMES_MESSAGE = "Add the host names in the editor before publishing.";
export const PUBLIC_LOAD_ERROR_MESSAGE = "We couldn't load this invitation. Please try again.";
export const PREMIUM_REQUIRED_MESSAGE = "This template or Look is part of Premium. Unlock Premium to save it.";
export const LOAD_ERROR_MESSAGE = "We couldn't open your invitation. Please try again.";

const rowSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  template_id: z.string(),
  // Unknown categories fall back so one odd row never breaks the dashboard or the editor.
  category: z.string().transform(toInvitationCategory),
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

/** The database refuses Premium templates and Looks to accounts without a paid purchase (SQLSTATE PT402, HTTP 402). */
export class PremiumRequiredError extends Error {}

function isPremiumRequired(error: { code?: string; message?: string; status?: number }): boolean {
  return error.code === "PT402" || error.status === 402 || error.message === "premium_required";
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
  if (error) {
    if (isPremiumRequired(error)) throw new PremiumRequiredError(PREMIUM_REQUIRED_MESSAGE);
    fail(error, SAVE_ERROR_MESSAGE);
  }
  return toInvitation(data);
}

export async function updateInvitation(id: string, draft: InvitationDraft): Promise<void> {
  const { error } = await client().from("invitations").update(writableColumns(draft)).eq("id", id);
  if (error) {
    if (isPremiumRequired(error)) throw new PremiumRequiredError(PREMIUM_REQUIRED_MESSAGE);
    fail(error, SAVE_ERROR_MESSAGE);
  }
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

/** Newest first. A row that no longer matches the expected shape is skipped rather than breaking the list. */
export async function listOwnInvitations(userId: string): Promise<Invitation[]> {
  const { data, error } = await client().from("invitations").select().eq("user_id", userId).order("updated_at", { ascending: false });
  if (error) fail(error, LIST_ERROR_MESSAGE);
  return (data ?? []).flatMap((row) => {
    try {
      return [toInvitation(row)];
    } catch (e) {
      if (import.meta.env.DEV) console.error("[invitations] skipped malformed row", e);
      return [];
    }
  });
}

/**
 * Deletes an uploaded image once nothing else the user owns points at it.
 * Best effort: failures are logged and never block the caller.
 */
export async function releaseImage(userId: string, url: string | undefined, exceptInvitationId?: string): Promise<void> {
  const path = ownedStoragePath(url, userId);
  if (!path || !url) return;
  try {
    let query = client().from("invitations").select("id").eq("user_id", userId).eq("design->>backgroundImage", url).limit(1);
    if (exceptInvitationId) query = query.neq("id", exceptInvitationId);
    const { data, error } = await query;
    if (error) throw error;
    if (data.length === 0) await removeStoredFile(path);
  } catch (e) {
    if (import.meta.env.DEV) console.error("[invitations] image cleanup skipped", e);
  }
}

export async function deleteInvitation(userId: string, invitation: Invitation): Promise<void> {
  const { error } = await client().from("invitations").delete().eq("id", invitation.id).eq("user_id", userId);
  if (error) fail(error, DELETE_ERROR_MESSAGE);
  await releaseImage(userId, invitation.design.backgroundImage);
}

const UNIQUE_VIOLATION = "23505";
const MAX_SLUG_ATTEMPTS = 5;

/**
 * Publishes an invitation. The first publish picks a readable slug from the host names
 * and adds a short suffix if it is taken. The slug is kept when unpublishing, so the link stays stable.
 */
export async function publishInvitation(invitation: Invitation): Promise<Invitation> {
  if (!invitation.content.hostNames.trim()) throw new Error(PUBLISH_NEEDS_NAMES_MESSAGE);

  const existing = slugSchema.safeParse(invitation.slug).success ? invitation.slug : null;
  const base = slugify(invitation.content.hostNames, slugify(invitation.title));

  for (let attempt = 0; attempt < (existing ? 1 : MAX_SLUG_ATTEMPTS); attempt++) {
    const slug = existing ?? (attempt === 0 ? base : withSuffix(base));
    const { data, error } = await client()
      .from("invitations")
      .update({ status: "published", slug })
      .eq("id", invitation.id)
      .eq("user_id", invitation.userId)
      .select()
      .single();
    if (!error) return toInvitation(data);
    if (error.code !== UNIQUE_VIOLATION || existing) fail(error, PUBLISH_ERROR_MESSAGE);
  }
  return fail(new Error("Could not find a free slug"), PUBLISH_ERROR_MESSAGE);
}

export async function unpublishInvitation(invitation: Invitation): Promise<Invitation> {
  const { data, error } = await client()
    .from("invitations")
    .update({ status: "draft" })
    .eq("id", invitation.id)
    .eq("user_id", invitation.userId)
    .select()
    .single();
  if (error) fail(error, UNPUBLISH_ERROR_MESSAGE);
  return toInvitation(data);
}

/** What a guest may see. It leaves out the owner id and timestamps. */
export type PublicInvitation = Pick<Invitation, "id" | "title" | "slug" | "category" | "templateId" | "content" | "design" | "rsvp">;

const PUBLIC_COLUMNS = "id, title, slug, category, template_id, content, design, rsvp_settings";

const publicRowSchema = rowSchema.pick({ id: true, title: true, slug: true, category: true, template_id: true, content: true, design: true, rsvp_settings: true });

/**
 * Loads a published invitation by its slug for the public page. Anyone may call this, signed in or not.
 * Returns null when the slug is malformed, unknown or not published, so a draft can never be told apart from a missing page.
 * Throws a friendly error only when the request itself fails.
 */
export async function getPublishedInvitation(slug: string): Promise<PublicInvitation | null> {
  if (!slugSchema.safeParse(slug).success) return null;
  const { data, error } = await client().from("invitations").select(PUBLIC_COLUMNS).eq("slug", slug).eq("status", "published").maybeSingle();
  if (error) fail(error, PUBLIC_LOAD_ERROR_MESSAGE);
  if (!data) return null;
  const parsed = publicRowSchema.safeParse(data);
  if (!parsed.success) return fail(parsed.error, PUBLIC_LOAD_ERROR_MESSAGE);
  const row = parsed.data;
  return { id: row.id, title: row.title, slug: row.slug ?? slug, category: row.category, templateId: row.template_id, content: row.content, design: row.design, rsvp: row.rsvp_settings };
}
