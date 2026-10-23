import { it, expect } from "vitest";
import { circularState, shadowState } from "../src/observableModels.mjs";
it("shadow geometry preserves similarity across all selectable angles and heights", () => {
  for (const angle of [25, 45, 65])
    for (const pole of [1, 2, 3])
      for (const height of [4, 8, 10]) {
        const q = shadowState({ angle, pole, height }, 6);
        expect(q.large / q.small).toBeCloseTo(height / pole);
        expect(q.small * Math.tan((angle * Math.PI) / 180)).toBeCloseTo(pole);
        expect(q.progress).toBe(1);
      }
});
it("circle velocities are tangent, acceleration inward and period returns to initial position", () => {
  for (const radius of [1, 2, 3])
    for (const speed of [1, 2, 4])
      for (const mass of [0.5, 1, 3]) {
        const p = { radius, speed, mass };
        const q = circularState(p, 1.3),
          end = circularState(p, q.period);
        expect(q.x * q.vx + q.y * q.vy).toBeCloseTo(0);
        expect(q.x * q.ax + q.y * q.ay).toBeCloseTo(-speed * speed);
        expect(Math.hypot(q.vx, q.vy)).toBeCloseTo(speed);
        expect(q.force).toBeCloseTo((mass * speed * speed) / radius);
        expect(end.x).toBeCloseTo(radius);
        expect(end.y).toBeCloseTo(0);
      }
});
