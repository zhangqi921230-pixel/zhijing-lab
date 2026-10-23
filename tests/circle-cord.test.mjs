import { it, expect } from "vitest";
import { circleCordPoint } from "../src/circleCord.mjs";

it("preserves arc length while unbending and reaches a straight circumference", () => {
  for (const radius of [1, 2.8, 5])
    for (const progress of [0, 0.1, 0.5, 0.9, 0.999999, 1]) {
      let length = 0,
        previous = circleCordPoint(radius, progress, 0);
      for (let i = 1; i <= 2048; i++) {
        const point = circleCordPoint(radius, progress, i / 2048);
        length += Math.hypot(point[0] - previous[0], point[1] - previous[1]);
        expect(point.every(Number.isFinite)).toBe(true);
        expect(point[1]).toBeGreaterThanOrEqual(-1e-9);
        expect(point[1]).toBeLessThan(2.4 * radius);
        previous = point;
      }
      expect(Math.abs(length - 2 * Math.PI * radius)).toBeLessThan(2e-5);
      const start = circleCordPoint(radius, progress, 0),
        end = circleCordPoint(radius, progress, 1);
      if (progress === 0)
        expect(Math.hypot(end[0] - start[0], end[1] - start[1])).toBeLessThan(
          1e-12,
        );
      if (progress === 1) {
        expect(end[0] - start[0]).toBeCloseTo(2 * Math.PI * radius, 12);
        expect(circleCordPoint(radius, progress, 0.5)[1]).toBe(0);
      }
    }
});
