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

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password."),
});

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(80, "Use 80 characters or fewer."),
  email: emailSchema,
  password: z.string().min(8, "Use at least 8 characters.").max(72, "Use 72 characters or fewer."),
});

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

/** Validates form values. Returns the parsed data, or the first error message per field. */
export function validateForm<S extends z.ZodType>(
  schema: S,
  values: unknown,
): { data: z.infer<S>; errors?: undefined } | { data?: undefined; errors: FieldErrors<z.infer<S>> } {
  const result = schema.safeParse(values);
  if (result.success) return { data: result.data };
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0]);
    if (!(key in errors)) errors[key] = issue.message;
  }
  return { errors: errors as FieldErrors<z.infer<S>> };
}
