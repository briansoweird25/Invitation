import { describe, expect, it } from "vitest";
import { stressContent } from "./testContent";

// The editor panels limit input length, so stress content must stay within those limits to be realistic.
const LIMITS = { hostNames: 80, eventTitle: 60, venue: 80, address: 120, message: 300, additionalDetails: 200 } as const;

describe("stress content", () => {
  it.each(["long", "unbroken", "empty", "baddate"] as const)("%s stays within the editor's length limits", (kind) => {
    const content = stressContent(kind);
    for (const [field, max] of Object.entries(LIMITS)) {
      expect(((content as unknown as Record<string, string | undefined>)[field] ?? "").length, field).toBeLessThanOrEqual(max);
    }
  });

  it("long content is close to the limits so it is a meaningful test", () => {
    const content = stressContent("long");
    expect(content.hostNames.length).toBeGreaterThan(60);
    expect(content.message.length).toBeGreaterThan(180);
  });
});
