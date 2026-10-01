import { slugSchema } from "./validation";

/** "Ava & Noah" -> "ava-and-noah". Always returns a string that satisfies the database slug rules. */
export function slugify(text: string, fallback = "invitation"): string {
  const base = text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48)
    .replace(/-+$/, "");
  const slug = base.length >= 3 ? base : base ? `${base}-${fallback}` : fallback;
  return slugSchema.safeParse(slug).success ? slug : fallback;
}

/** A short random suffix used when a slug is already taken. */
export function withSuffix(slug: string): string {
  const suffix = Math.random().toString(36).slice(2, 6).padEnd(4, "0");
  return `${slug.slice(0, 50)}-${suffix}`;
}
