import { describe, expect, it } from "vitest";
import { dateParts, fitSize, formatDate, formatTime, joinText, splitHostNames, whenWhere } from "./invitationFormat";

describe("invitationFormat", () => {
  it("parses ISO dates and rejects everything else", () => {
    expect(dateParts("2026-06-14")?.weekday).toBe("Sunday");
    expect(dateParts("next Saturday-ish")).toBeNull();
    expect(dateParts("")).toBeNull();
  });

  it("formats dates in every style and leaves unparseable text alone", () => {
    expect(formatDate("2026-06-14", "long")).toBe("Sunday, 14 June 2026");
    expect(formatDate("2026-06-14", "long-us")).toBe("Sunday, June 14");
    expect(formatDate("2026-06-14", "full-us")).toBe("June 14, 2026");
    expect(formatDate("2026-06-14", "month-day")).toBe("June 14");
    expect(formatDate("2026-06-14", "day-month")).toBe("14 June");
    expect(formatDate("2026-06-14", "short")).toBe("Sun 14 Jun");
    expect(formatDate("2026-06-14", "numeric")).toBe("14.06.26");
    expect(formatDate("soon", "long")).toBe("soon");
  });

  it("formats times", () => {
    expect(formatTime("16:00")).toBe("4 pm");
    expect(formatTime("16:30")).toBe("4:30 pm");
    expect(formatTime("00:15")).toBe("12:15 am");
    expect(formatTime("whenever")).toBe("whenever");
  });

  it("splits host names", () => {
    expect(splitHostNames("Eleanor & James")).toEqual(["Eleanor", "James"]);
    expect(splitHostNames("Eleanor and James")).toEqual(["Eleanor", "James"]);
    expect(splitHostNames("Maya")).toEqual(["Maya"]);
    expect(splitHostNames("")).toEqual([]);
  });

  it("joins only non-empty parts", () => {
    expect(joinText(["a", "", undefined, "b"])).toBe("a · b");
    expect(whenWhere({ time: "", venue: "Hall" })).toBe("Hall");
    expect(whenWhere({ time: "16:00", venue: "" })).toBe("4 pm");
  });

  it("shrinks long text but never below the floor", () => {
    expect(fitSize(10, "short", 8)).toBe("10.00cqw");
    expect(fitSize(10, "x".repeat(16), 8)).toBe("5.00cqw");
    expect(fitSize(10, "x".repeat(400), 8)).toBe("4.00cqw");
  });
});
