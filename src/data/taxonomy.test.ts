import { describe, expect, it } from "vitest";
import { categories, FALLBACK_CATEGORY, isInvitationCategory, toInvitationCategory } from "./taxonomy";

describe("taxonomy", () => {
  it("lists the 13 categories with unique kebab-case ids", () => {
    expect(categories).toHaveLength(13);
    expect(new Set(categories).size).toBe(13);
    for (const c of categories) expect(c).toMatch(/^[a-z]+(-[a-z]+)*$/);
  });

  it("maps unknown stored categories to the fallback", () => {
    expect(toInvitationCategory("baby-shower")).toBe("baby-shower");
    expect(toInvitationCategory("space-party")).toBe(FALLBACK_CATEGORY);
    expect(toInvitationCategory(undefined)).toBe(FALLBACK_CATEGORY);
    expect(isInvitationCategory("wedding")).toBe(true);
    expect(isInvitationCategory("nope")).toBe(false);
  });
});
