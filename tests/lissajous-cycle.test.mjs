import { expect, it } from "vitest";
import { lissajousCycle, lissajousPoint } from "../src/oscillationModels.mjs";
it("common period repeats position and velocity for every allowed frequency pair", () => {
  for (let fx = 1; fx <= 4; fx++)
    for (let fy = 1; fy <= 4; fy++)
      for (const phase of [0, 45, 90, 180]) {
        const p = { fx, fy, phase, height: 0.7 },
          q = lissajousCycle(p);
        expect(Number.isInteger(q.xCycles)).toBe(true);
        expect(Number.isInteger(q.yCycles)).toBe(true);
        for (const t of [0, 0.31, 1.2]) {
          const a = lissajousPoint(p, t),
            b = lissajousPoint(p, t + q.period);
          expect(a.x).toBeCloseTo(b.x, 9);
          expect(a.y).toBeCloseTo(b.y, 9);
          expect(Math.cos((fx * t * Math.PI) / 3)).toBeCloseTo(
            Math.cos((fx * (t + q.period) * Math.PI) / 3),
            9,
          );
          expect(
            Math.cos((fy * t * Math.PI) / 3 + (phase * Math.PI) / 180),
          ).toBeCloseTo(
            Math.cos(
              (fy * (t + q.period) * Math.PI) / 3 + (phase * Math.PI) / 180,
            ),
            9,
          );
        }
      }
});
it("scaled ratios change repeat time while initial phase does not", () => {
  expect(lissajousCycle({ fx: 1, fy: 2 }).period).toBe(6);
  expect(lissajousCycle({ fx: 2, fy: 4 }).period).toBe(3);
  expect(lissajousCycle({ fx: 3, fy: 3 }).period).toBe(2);
  expect(lissajousCycle({ fx: 2, fy: 3, phase: 90 }).period).toBe(6);
});
