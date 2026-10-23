import { it, expect } from "vitest";
import { inclineEnergy } from "../src/InclineEnergy.jsx";
import { incline } from "../src/advancedModels.mjs";
it("energy is conserved at release, halfway, before and after the stop", () => {
  for (const mu of [0, 0.1, 0.2])
    for (const mass of [0.5, 2, 4]) {
      const p = { angle: 35, mass, mu, muStatic: 0.3 },
        impact = incline(p, 0).impactTime;
      for (const t of [0, impact / Math.SQRT2, impact - 1e-7, impact, 8]) {
        const e = inclineEnergy(p, t);
        expect(e.remaining + e.kinetic + e.heat + e.collision).toBeCloseTo(
          e.total,
          10,
        );
        for (const v of Object.values(e)) expect(v).toBeGreaterThanOrEqual(0);
        if (t >= impact) {
          expect(e.kinetic).toBe(0);
          expect(e.collision).toBeGreaterThan(0);
        } else expect(e.collision).toBe(0);
      }
    }
});
it("static friction does no work and halfway uses distance rather than time", () => {
  const p = { angle: 15, mass: 2, mu: 0.1, muStatic: 0.3 },
    e = inclineEnergy(p, 8);
  expect(e.heat).toBe(0);
  expect(e.kinetic).toBe(0);
  expect(e.remaining).toBe(e.total);
  const sliding = { ...p, angle: 35 },
    impact = incline(sliding, 0).impactTime;
  const half = inclineEnergy(sliding, impact / Math.SQRT2);
  expect(half.remaining).toBeCloseTo(half.total / 2, 10);
});
