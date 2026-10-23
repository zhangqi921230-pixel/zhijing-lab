import { it, expect } from "vitest";
import { displacementGrain } from "../src/displacementGrains.mjs";
it("deposited copper follows the thinning metal surface before release", () => {
  for (const metalFraction of [0.2, 0.5, 1])
    for (let i = 0; i < 100; i++) {
      const g = displacementGrain(i, 0.5, { metalFraction, settling: 0 });
      expect(Math.abs(g.z) - 0.034026 * g.scale).toBeCloseTo(
        0.0425 * metalFraction,
        10,
      );
      expect(Math.abs(g.x) + 0.034026 * g.scale).toBeLessThanOrEqual(0.12);
    }
});
it("released grains rest on the inner glass bottom and stay inside the vessel", () => {
  for (let i = 0; i < 100; i++) {
    const g = displacementGrain(i, 1, { metalFraction: 0, settling: 1 });
    expect(g.y - 0.034026 * g.scale).toBeCloseTo(0.21, 10);
    expect(Math.hypot(g.x, g.z) + 0.04 * g.scale).toBeLessThan(0.82);
  }
});
it("displayed copper volume scales with reaction extent and does not change during settling", () => {
  const sum = (f, t) =>
    Array.from(
      { length: 100 },
      (_, i) =>
        displacementGrain(i, f, { metalFraction: 0.01, settling: t }).scale **
        3,
    ).reduce((a, b) => a + b, 0);
  expect(sum(0.5, 0) / sum(1, 0)).toBeCloseTo(0.5, 10);
  expect(sum(0.5, 0)).toBeCloseTo(sum(0.5, 1), 10);
});
