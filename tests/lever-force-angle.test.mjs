import { it, expect } from "vitest";
import { leverForceAngle } from "../src/leverForceAngle.mjs";
it("perpendicular foot lies on the force line and yields the cross-product torque", () => {
  for (const distance of [0.2, 1, 2])
    for (const force of [1, 5, 20])
      for (const angle of [0, 30, 60, 90, 150, 180]) {
        const q = leverForceAngle(distance, force, angle),
          [x, y] = q.foot,
          [vx, vy] = q.direction;
        expect(x * vx + y * vy).toBeCloseTo(0, 10);
        expect((x - distance) * vy - y * vx).toBeCloseTo(0, 10);
        expect(Math.hypot(x, y)).toBeCloseTo(q.arm, 10);
        expect(q.torque).toBeCloseTo(
          distance * force * Math.sin((angle * Math.PI) / 180),
          10,
        );
      }
  expect(leverForceAngle(2, 5, 0).torque).toBe(0);
  expect(leverForceAngle(2, 5, 180).torque).toBe(0);
  expect(leverForceAngle(2, 5, 90).torque).toBe(10);
  expect(leverForceAngle(2, 5, 30).torque).toBeCloseTo(
    leverForceAngle(2, 5, 150).torque,
    12,
  );
});
