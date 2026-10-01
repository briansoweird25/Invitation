import { describe, expect, it } from "vitest";
import { filterReplies, isRsvpClosed, maxGuestsFor, rsvpStats, rsvpSubmissionSchema } from "./rsvp";

const parse = (v: Record<string, unknown>, max = 4) => rsvpSubmissionSchema(max).safeParse({ guestName: "Sam", guestEmail: "", attendance: "attending", guestCount: "2", message: "", ...v });
const firstError = (v: Record<string, unknown>, max?: number) => {
  const r = parse(v, max);
  return r.success ? undefined : r.error.issues[0].message;
};

describe("rsvpSubmissionSchema", () => {
  it("accepts a valid reply, turning empty optional text into undefined", () => {
    const r = parse({});
    expect(r.success && r.data).toEqual({ guestName: "Sam", guestEmail: undefined, attendance: "attending", guestCount: 2, message: undefined });
  });

  it("trims the name and rejects an empty or overlong one", () => {
    const ok = parse({ guestName: "  Sam  " });
    expect(ok.success && ok.data.guestName).toBe("Sam");
    expect(firstError({ guestName: "   " })).toBe("Enter your name.");
    expect(firstError({ guestName: "x".repeat(121) })).toMatch(/120/);
  });

  it("validates the optional email only when given", () => {
    expect(firstError({ guestEmail: "nope" })).toMatch(/valid email/i);
    const ok = parse({ guestEmail: " sam@example.com " });
    expect(ok.success && ok.data.guestEmail).toBe("sam@example.com");
  });

  it("requires an attendance choice", () => {
    expect(firstError({ attendance: "" })).toBe("Choose whether you can come.");
    expect(firstError({ attendance: "maybe" })).toBe("Choose whether you can come.");
  });

  it("limits guests to the invitation's maximum and to whole numbers", () => {
    expect(firstError({ guestCount: "5" }, 4)).toMatch(/up to 4/);
    expect(firstError({ guestCount: "0" })).toBe("Enter at least 1.");
    expect(firstError({ guestCount: "1.5" })).toBe("Enter a whole number.");
    expect(parse({ guestCount: "4" }, 4).success).toBe(true);
  });

  it("stores one guest for a decline whatever the count says", () => {
    const r = parse({ attendance: "declined", guestCount: "3" });
    expect(r.success && r.data.guestCount).toBe(1);
  });

  it("limits the message length", () => {
    expect(firstError({ message: "x".repeat(1001) })).toMatch(/1000/);
  });
});

describe("maxGuestsFor", () => {
  it("uses the host's limit, clamped, and a default when unset", () => {
    expect(maxGuestsFor({ maxGuests: 6 })).toBe(6);
    expect(maxGuestsFor({ maxGuests: 500 })).toBe(50);
    expect(maxGuestsFor({ maxGuests: 0 })).toBe(1);
    expect(maxGuestsFor({})).toBe(10);
  });
});

describe("isRsvpClosed", () => {
  const now = new Date(2026, 4, 10, 15, 0);
  it("is open without a deadline or with an unreadable one", () => {
    expect(isRsvpClosed(undefined, now)).toBe(false);
    expect(isRsvpClosed("", now)).toBe(false);
    expect(isRsvpClosed("soon", now)).toBe(false);
  });
  it("accepts replies through the deadline day and closes the day after", () => {
    expect(isRsvpClosed("2026-05-11", now)).toBe(false);
    expect(isRsvpClosed("2026-05-10", now)).toBe(false);
    expect(isRsvpClosed("2026-05-09", now)).toBe(true);
  });
});

describe("rsvpStats and filterReplies", () => {
  const replies = [
    { attendance: "attending" as const, guestCount: 2 },
    { attendance: "attending" as const, guestCount: 3 },
    { attendance: "declined" as const, guestCount: 1 },
  ];
  it("counts replies, attendees and seats, leaving declines out of the guest total", () => {
    expect(rsvpStats(replies)).toEqual({ replies: 3, attending: 2, declined: 1, guests: 5 });
    expect(rsvpStats([])).toEqual({ replies: 0, attending: 0, declined: 0, guests: 0 });
  });
  it("filters by attendance", () => {
    expect(filterReplies(replies, "all")).toHaveLength(3);
    expect(filterReplies(replies, "attending")).toHaveLength(2);
    expect(filterReplies(replies, "declined")).toHaveLength(1);
  });
});
