import { expect, it } from "vitest";
import { polarPoint, projectileState } from "../src/visualModels.mjs";
it("polar Cartesian conversion preserves signed radius and cardioid cusp", () => {
  for (const shape of [0, 1, 2])
    for (const petals of [1, 2, 3, 4, 5, 6])
      for (let i = 0; i <= 120; i++) {
        const p = polarPoint({ shape, petals, radius: 2 }, (i * Math.PI) / 60);
        expect(p.x * p.x + p.y * p.y).toBeCloseTo(p.r * p.r, 10);
      }
  expect(polarPoint({ shape: 1, radius: 2 }, Math.PI).r).toBe(0);
  expect(polarPoint({ shape: 2, radius: 2, petals: 3 }, Math.PI / 3).r).toBe(
    -2,
  );
});
it("projectile landing, energy conservation, complementary angles and zero-duration boundary", () => {
  for (const gravity of [1.6, 9.8, 12])
    for (const angle of [0, 30, 45, 60, 90])
      for (const height of [0, 10, 15]) {
        const p = { gravity, angle, height, speed: 18 };
        expect(projectileState(p, 1).y).toBeCloseTo(0, 9);
        for (const progress of [0, 0.25, 0.5, 1]) {
          const q = projectileState(p, progress);
          expect(q.vx * q.vx + q.vy * q.vy + 2 * gravity * q.y).toBeCloseTo(
            324 + 2 * gravity * height,
            8,
          );
          expect(Number.isFinite(q.x)).toBe(true);
        }
      }
  const p = { gravity: 9.8, angle: 30, height: 0, speed: 18 };
  expect(projectileState(p, 1).range).toBeCloseTo(
    projectileState({ ...p, angle: 60 }, 1).range,
    10,
  );
  expect(projectileState({ ...p, angle: 0 }, 1).duration).toBe(0);
});
