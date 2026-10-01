import { describe, expect, it } from "vitest";
import { exportFileName } from "./exportName";

describe("exportFileName", () => {
  it("makes a clean lowercase hyphenated name", () => {
    expect(exportFileName("Ava & Noah's Wedding", "x", "png")).toBe("ava-and-noah-s-wedding.png");
    expect(exportFileName("  Our   Big Day!!  ", "x", "pdf")).toBe("our-big-day.pdf");
  });
  it("falls back to the host names, then to a generic name", () => {
    expect(exportFileName("", "Priya & Omar", "png")).toBe("priya-and-omar.png");
    expect(exportFileName("   ", "", "pdf")).toBe("invitation.pdf");
    expect(exportFileName("✨✨", "", "png")).toBe("invitation.png");
  });
  it("strips accents and never contains path characters", () => {
    const name = exportFileName("Zoë/Émile: ../../etc", "", "png");
    expect(name).toBe("zoe-emile-etc.png");
    expect(name).not.toMatch(/[\\/:*?"<>|\s]/);
  });
  it("keeps long names to a sensible length", () => {
    expect(exportFileName("a".repeat(200), "", "png").length).toBeLessThanOrEqual(52);
  });
});
