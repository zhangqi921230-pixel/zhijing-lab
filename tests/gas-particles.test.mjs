import { it, expect } from "vitest";
import { gasParticles, gasParticleState } from "../src/gasParticles.mjs";
it("compression preserves speed while heating scales it by square root of temperature", () => {
  for (const v of gasParticles) {
    const a = gasParticleState({ volume: 20, temperature: 300 }, 1, v);
    const b = gasParticleState({ volume: 10, temperature: 300 }, 1, v);
    const c = gasParticleState({ volume: 20, temperature: 600 }, 1, v);
    expect(Math.hypot(b.vx, b.vy)).toBeCloseTo(Math.hypot(a.vx, a.vy));
    expect(Math.hypot(c.vx, c.vy) / Math.hypot(a.vx, a.vy)).toBeCloseTo(
      Math.sqrt(2),
    );
    expect(b.verticalPeriod).toBeLessThan(a.verticalPeriod);
  }
});
it("particles remain inside all allowed vessels and reverse normal velocity at walls", () => {
  for (const volume of [5, 10, 20, 30])
    for (const temperature of [200, 600])
      for (const v of gasParticles)
        for (const t of [0, 0.1, 1, 10, 100]) {
          const s = gasParticleState({ volume, temperature }, t, v);
          expect(s.x).toBeGreaterThanOrEqual(191);
          expect(s.x).toBeLessThanOrEqual(396);
          expect(s.y).toBeGreaterThanOrEqual(384 - (volume / 30) * 260 - 1e-8);
          expect(s.y).toBeLessThanOrEqual(358 + 1e-8);
        }
  const p = { volume: 30, temperature: 300 },
    v = { x: 0.5, y: 0.5, vx: 0.1, vy: 0.1 };
  const before = gasParticleState(p, 4.99, v),
    after = gasParticleState(p, 5.01, v);
  expect(before.vy).toBeGreaterThan(0);
  expect(after.vy).toBeLessThan(0);
  expect(Math.abs(before.vy)).toBe(Math.abs(after.vy));
});
