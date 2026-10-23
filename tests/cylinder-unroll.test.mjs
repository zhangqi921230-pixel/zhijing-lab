import { it, expect } from "vitest";
import { unrolledPoint } from "../src/cylinderUnroll.mjs";
it("unrolling preserves material arc length at every intermediate curvature", () => {
  for (const radius of [1, 2, 3])
    for (const progress of [0, 0.1, 0.5, 0.9, 0.999999, 1]) {
      const length = 2 * Math.PI * radius;
      let measured = 0,
        previous = unrolledPoint(radius, -length / 2, progress);
      for (let i = 1; i <= 4096; i++) {
        const next = unrolledPoint(radius, length * (i / 4096 - 0.5), progress);
        measured += Math.hypot(next.x - previous.x, next.z - previous.z);
        previous = next;
      }
      expect(measured / length).toBeCloseTo(1, 6);
      // An extrusion through height h has surface area arc length times h.
      expect((measured * 6) / (2 * Math.PI * radius * 6)).toBeCloseTo(1, 6);
    }
});
it("the seam starts closed and ends at opposite ends of an exact circumference-wide rectangle", () => {
  const r = 2,
    s = Math.PI * r;
  const startA = unrolledPoint(r, -s, 0),
    startB = unrolledPoint(r, s, 0);
  expect(startA.x).toBeCloseTo(startB.x);
  expect(startA.z).toBeCloseTo(startB.z);
  expect(unrolledPoint(r, s, 1)).toEqual({ x: s, z: 0 });
  expect(unrolledPoint(r, -s, 1)).toEqual({ x: -s, z: 0 });
});
