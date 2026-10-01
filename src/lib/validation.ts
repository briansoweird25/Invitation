import { z } from "zod";

export const emailSchema = z.email("Enter a valid email address.");

export const imageUrlSchema = z
  .url("Enter a valid link.")
  .refine((v) => /^https?:\/\//i.test(v), "The link must start with http:// or https://.");

/** Returns the first error message for a non-empty value, or undefined when valid or empty. */
export function fieldError(schema: z.ZodType, value: string | undefined): string | undefined {
  const v = value?.trim();
  if (!v) return undefined;
  const result = schema.safeParse(v);
  return result.success ? undefined : result.error.issues[0]?.message;
}

export const MAX_GUESTS_LIMIT = 50;
