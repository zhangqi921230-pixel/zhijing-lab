import { it, expect } from "vitest";
import { leverState, leverPoint } from "../src/leverModel.mjs";
import { calculate } from "../src/models.mjs";
it("杠杆平衡、力矩方向与限位后的约束相符", () => {
  const balanced = { f1: 10, l1: 1, f2: 5, l2: 2 };
  expect(leverState(balanced, 8).angle).toBe(0);
  for (const f1 of [1, 10, 20])
    for (const f2 of [1, 5, 20])
      for (const l1 of [0.2, 1, 2])
        for (const l2 of [0.2, 1, 2]) {
          const p = { f1, f2, l1, l2 },
            q = leverState(p, 8);
          expect(Math.abs(q.angle)).toBeLessThanOrEqual(20.000000001);
          expect(q.leftTorque - q.rightTorque + q.stopTorque).toBeCloseTo(
            q.inertia * q.alpha,
            10,
          );
          if (q.stopped) {
            expect(q.omega).toBe(0);
            expect(Math.sign(q.angle)).toBe(Math.sign(f1 * l1 - f2 * l2));
          }
          expect(calculate("lever", p, 8)[0].value).toBeCloseTo(
            q.leftTorque,
            12,
          );
        }
});
it("自由转动时机械能守恒，绘制挂点的水平投影等于力臂", () => {
  for (const p of [
    { f1: 10, l1: 1, f2: 5, l2: 1 },
    { f1: 1, l1: 2, f2: 20, l2: 0.2 },
    { f1: 20, l1: 2, f2: 1, l2: 0.2 },
  ])
    for (const t of [0.01, 0.05, 0.1, 0.2]) {
      const q = leverState(p, t);
      if (!q.stopped) expect(q.kinetic).toBeCloseTo(q.potentialDrop, 7);
      const left = leverPoint(-p.l1, q.theta),
        right = leverPoint(p.l2, q.theta);
      expect((360 - left[0]) / 140).toBeCloseTo(q.leftArm, 12);
      expect((right[0] - 360) / 140).toBeCloseTo(q.rightArm, 12);
      expect(Math.hypot(left[0] - 360, left[1] - 270)).toBeCloseTo(
        p.l1 * 140,
        12,
      );
    }
});
