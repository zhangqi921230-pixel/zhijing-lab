import { it, expect } from "vitest";
import { solidAxialLayout } from "../src/solidAxialLayout.mjs";
it("preserves aspect and similarity ratios and keeps extremes within both plot areas", () => {
  for (const r of [0.5, 1.2, 2])
    for (const h of [1, 2.6, 4])
      for (const f of [0, 0.25, 0.5, 1]) {
        const p = solidAxialLayout(r, h, f);
        expect(p.r / p.h).toBeCloseTo(r / h, 12);
        expect(p.rho / p.r).toBeCloseTo(1 - f, 12);
        expect((185 - p.y) / p.h).toBeCloseTo(f, 12);
        expect(p.r).toBeLessThanOrEqual(55.000001);
        expect(p.top).toBeGreaterThanOrEqual(39.999999);
        expect(p.y).toBeGreaterThanOrEqual(p.top);
        expect(p.y).toBeLessThanOrEqual(185);
      }
});
