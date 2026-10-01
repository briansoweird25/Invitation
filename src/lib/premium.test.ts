import { describe, expect, it } from "vitest";
import { allTemplates, getTemplate, templateList } from "@/components/invitation/templateCatalog";
import { isPremiumPreset, lookIsLocked, lookIsPremiumOnFreeTemplate, startNeedsPremium, templateIsPremium } from "./premium";

describe("premium rules come from the catalog", () => {
  it("treats every Look of a premium template as premium", () => {
    const premium = templateList.filter((t) => t.tier === "premium");
    expect(premium.length).toBeGreaterThan(0);
    for (const t of premium) for (const p of t.presets) expect(isPremiumPreset(t, p)).toBe(true);
  });

  it("keeps the default Look of every free template free", () => {
    for (const t of templateList.filter((x) => x.tier === "free")) expect(isPremiumPreset(t, t.presets[0])).toBe(false);
  });

  it("has premium Looks on some free templates", () => {
    const withPremiumLook = templateList.filter((t) => t.tier === "free" && t.presets.some((p) => p.tier === "premium"));
    expect(withPremiumLook.length).toBeGreaterThan(0);
  });

  it("starting needs premium for a premium template or a premium Look, and never for an unknown template", () => {
    expect(startNeedsPremium("floral-wedding")).toBe(true);
    expect(startNeedsPremium("elegant-wedding")).toBe(false);
    expect(startNeedsPremium("elegant-wedding", "ivory-gold")).toBe(false);
    expect(startNeedsPremium("elegant-wedding", "midnight-foil")).toBe(true);
    expect(startNeedsPremium("no-such-template", "x")).toBe(false);
  });

  it("locks a premium Look on a free template only for people without access", () => {
    expect(lookIsLocked(false, "elegant-wedding", "midnight-foil")).toBe(true);
    expect(lookIsLocked(true, "elegant-wedding", "midnight-foil")).toBe(false);
    expect(lookIsLocked(false, "elegant-wedding", "ivory-gold")).toBe(false);
  });

  it("does not lock Looks inside an invitation that already uses a premium template", () => {
    expect(templateIsPremium("floral-wedding")).toBe(true);
    expect(lookIsPremiumOnFreeTemplate("floral-wedding", getTemplate("floral-wedding")!.presets[1].id)).toBe(false);
    expect(lookIsLocked(false, "floral-wedding", getTemplate("floral-wedding")!.presets[1].id)).toBe(false);
  });

  it("allTemplates includes every active template", () => {
    expect(allTemplates().length).toBeGreaterThanOrEqual(templateList.length);
  });
});
