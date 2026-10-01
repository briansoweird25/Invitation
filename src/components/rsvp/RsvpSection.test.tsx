import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { RsvpSection } from "./RsvpSection";

const ID = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
const now = new Date(2026, 4, 10);
const html = (rsvp: Parameters<typeof RsvpSection>[0]["rsvp"]) => renderToStaticMarkup(<RsvpSection invitationId={ID} rsvp={rsvp} now={now} />);

describe("RsvpSection", () => {
  it("renders nothing when RSVP is off, even with contact details", () => {
    expect(html({ enabled: false, contactEmail: "a@b.co" })).toBe("");
  });

  it("shows the form and the deadline while replies are open", () => {
    const out = html({ enabled: true, deadline: "2026-05-20" });
    expect(out).toContain("Please reply by May 20, 2026.");
    expect(out).toContain("Send RSVP");
  });

  it("shows the form even when the host gave no deadline or contact", () => {
    const out = html({ enabled: true });
    expect(out).toContain("Send RSVP");
    expect(out).not.toContain("Questions?");
  });

  it("replaces the form with a closed note after the deadline and keeps the contact", () => {
    const out = html({ enabled: true, deadline: "2026-05-01", contactEmail: "ava@example.com" });
    expect(out).toContain("Replies closed on May 1, 2026.");
    expect(out).not.toContain("Send RSVP");
    expect(out).toContain('href="mailto:ava@example.com"');
  });

  it("shows contact links and escapes host-provided text", () => {
    const out = html({ enabled: true, contactName: "<b>x</b>", contactEmail: "a@b.co", contactPhone: "+1 (555) 010-2000" });
    expect(out).toContain('href="tel:+15550102000"');
    expect(out).not.toContain("<b>x</b>");
  });

  it("offers the guest count only after choosing to attend (hidden by default)", () => {
    expect(html({ enabled: true, maxGuests: 4 })).not.toContain("rsvp-guestCount");
  });
});
