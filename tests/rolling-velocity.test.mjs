import { it, expect } from "vitest";
import { rollingPoint, rollingVelocity } from "../src/motionModels.mjs";
it("velocity matches trajectory derivative at every allowed radius and ratio", () => {
  for (const radius of [0.5, 1, 1.6])
    for (const ratio of [0, 0.5, 1, 1.5])
      for (const a of [0, 0.3, Math.PI / 2, Math.PI, 5]) {
        const h = 1e-5,
          omega = Math.PI / 3,
          left = rollingPoint(radius, ratio, a - h * omega),
          right = rollingPoint(radius, ratio, a + h * omega),
          q = rollingVelocity(radius, ratio, a);
        expect(q.vx).toBeCloseTo((right.x - left.x) / (2 * h), 7);
        expect(q.vy).toBeCloseTo((right.y - left.y) / (2 * h), 7);
      }
});
it("rim contact stops, top doubles center speed, and only exterior points reverse at bottom", () => {
  const bottom = rollingVelocity(1, 1, 0),
    top = rollingVelocity(1, 1, Math.PI);
  expect(bottom.speed).toBe(0);
  expect(top.speed).toBeCloseTo(2 * top.translation);
  expect(rollingVelocity(1, 0.5, 0).vx).toBeGreaterThan(0);
  expect(rollingVelocity(1, 1.4, 0).vx).toBeLessThan(0);
});
