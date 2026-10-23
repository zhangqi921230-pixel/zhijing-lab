import { expect, it } from "vitest";
import { createAngleTransition } from "../src/angleTransition.mjs";
it("turns every objective pair along the shortest arc and stops at the exact angle", () => {
  const angles = [0, (-2 * Math.PI) / 3, (-4 * Math.PI) / 3];
  for (const from of angles)
    for (const to of angles) {
      const turn = createAngleTransition(from);
      turn.setTarget(to, 0);
      const middle = turn.sample(180),
        end = turn.sample(360);
      expect(Math.abs(end - from)).toBeLessThanOrEqual(Math.PI + 1e-9);
      expect(middle).toBeCloseTo((from + end) / 2, 8);
      expect(Math.cos(end)).toBeCloseTo(Math.cos(to), 8);
      expect(Math.sin(end)).toBeCloseTo(Math.sin(to), 8);
      expect(turn.active).toBe(false);
    }
});
it("retargets continuously, ignores equivalent targets, and supports reduced motion", () => {
  const turn = createAngleTransition(0);
  turn.setTarget((-2 * Math.PI) / 3, 0);
  const before = turn.sample(120);
  turn.setTarget((2 * Math.PI) / 3, 120);
  expect(turn.sample(120)).toBe(before);
  turn.setTarget((2 * Math.PI) / 3 + Math.PI * 2, 240);
  turn.sample(480);
  expect(turn.active).toBe(false);
  turn.setTarget(0, 500);
  expect(Math.cos(turn.sample(501, true))).toBeCloseTo(1, 8);
  expect(turn.active).toBe(false);
});
