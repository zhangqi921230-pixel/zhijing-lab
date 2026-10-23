import { it, expect } from "vitest";
import { dopplerArrivals, dopplerState } from "../src/motionModels.mjs";
it("arrival radii meet observers and intervals invert to Doppler frequencies", () => {
  for (const mach of [-0.75, -0.4, 0, 0.4, 0.75])
    for (const f of [0.5, 1, 2]) {
      const rows = dopplerArrivals(mach, f),
        q = dopplerState(mach, f, 0);
      rows.forEach((r, i) => {
        expect(r.emitted).toBeLessThanOrEqual(6);
        expect(2 * (r.right - r.emitted)).toBeCloseTo(
          Math.abs(12 - r.position),
          10,
        );
        expect(2 * (r.left - r.emitted)).toBeCloseTo(
          Math.abs(-12 - r.position),
          10,
        );
        if (i) {
          expect(1 / (r.right - rows[i - 1].right)).toBeCloseTo(
            q.rightFrequency,
            10,
          );
          expect(1 / (r.left - rows[i - 1].left)).toBeCloseTo(
            q.leftFrequency,
            10,
          );
        }
      });
    }
});
it("direction reversal swaps receiver schedules and first arrival is always six seconds", () => {
  const a = dopplerArrivals(0.4, 2),
    b = dopplerArrivals(-0.4, 2);
  expect(a[0].left).toBe(6);
  expect(a[0].right).toBe(6);
  a.forEach((r, i) => {
    expect(r.left).toBe(b[i].right);
    expect(r.right).toBe(b[i].left);
  });
});
