import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { RsvpInfo } from "./RsvpInfo";

const html = (rsvp: Parameters<typeof RsvpInfo>[0]["rsvp"]) => renderToStaticMarkup(<RsvpInfo rsvp={rsvp} />);

describe("RsvpInfo", () => {
  it("renders nothing when RSVP is off, even with contact details", () => {
    expect(html({ enabled: false, contactEmail: "a@b.co" })).toBe("");
  });

  it("renders nothing when RSVP is on but there is nothing to show", () => {
    expect(html({ enabled: true })).toBe("");
  });

  it("shows the deadline and contact links", () => {
    const out = html({ enabled: true, deadline: "2026-05-01", contactName: "Ava", contactEmail: "ava@example.com", contactPhone: "+1 (555) 010-2000" });
    expect(out).toContain("Please reply by May 1, 2026.");
    expect(out).toContain('href="mailto:ava@example.com"');
    expect(out).toContain('href="tel:+15550102000"');
    expect(out).toContain("Ava: ava@example.com");
  });

  it("escapes host-provided text", () => {
    expect(html({ enabled: true, contactName: "<b>x</b>", contactEmail: "a@b.co" })).not.toContain("<b>x</b>");
  });
});
