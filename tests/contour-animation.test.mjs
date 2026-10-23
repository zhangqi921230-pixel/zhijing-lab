import { it, expect } from "vitest";
import { scanLevel } from "../src/contourAnimation.mjs";
it("scan progress is elapsed-time based, bounded, and monotonic", () => {
  expect(scanLevel(600, 1000, 200)).toBe(800);
  expect(scanLevel(600, 2500, 100)).toBe(850);
  expect(scanLevel(2390, 1000, 400)).toBe(2400);
  let previous = 100;
  for (const time of [0, 125, 250, 1800, 5600, 13000, 100000]) {
    const level = scanLevel(100, time, 200);
    expect(level).toBeGreaterThanOrEqual(previous);
    expect(level).toBeLessThanOrEqual(2400);
    expect(level % 10).toBe(0);
    previous = level;
  }
});
