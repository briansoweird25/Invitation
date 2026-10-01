import { describe, expect, it } from "vitest";
import { fitScale, MIN_FIT_SCALE } from "./fit";

describe("fitScale", () => {
  it("leaves content that fits alone", () => {
    expect(fitScale(100, 80)).toBe(1);
    expect(fitScale(100, 100)).toBe(1);
  });

  it("shrinks content that is too tall in proportion", () => {
    expect(fitScale(100, 200)).toBeCloseTo(0.5);
    expect(fitScale(60, 80)).toBeCloseTo(0.75);
  });

  it("also shrinks content that is too wide", () => {
    expect(fitScale(100, 50, { availableWidth: 100, neededWidth: 125 })).toBeCloseTo(0.8);
  });

  it("uses the stricter of height and width", () => {
    expect(fitScale(100, 200, { availableWidth: 100, neededWidth: 125 })).toBeCloseTo(0.5);
    expect(fitScale(100, 110, { availableWidth: 100, neededWidth: 200 })).toBeCloseTo(0.5);
  });

  it("never goes below the minimum", () => {
    expect(fitScale(100, 1000)).toBe(MIN_FIT_SCALE);
    expect(fitScale(100, 1000, { min: 0.6 })).toBe(0.6);
  });

  it("ignores elements that are not laid out yet", () => {
    expect(fitScale(0, 100)).toBe(1);
    expect(fitScale(100, 0)).toBe(1);
    expect(fitScale(100, 100, { availableWidth: 0, neededWidth: 50 })).toBe(1);
  });
});
