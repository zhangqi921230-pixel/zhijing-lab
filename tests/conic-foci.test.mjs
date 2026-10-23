import { it, expect } from "vitest";
import {
  conicFoci,
  conicSegments,
  conicPlanePoint,
  conicState,
} from "../src/conicGeometry.mjs";
it("foci satisfy plane membership and ellipse/hyperbola distance invariants", () => {
  for (const alpha of [20, 30, 45])
    for (const tilt of [0, 35, 75, 90]) {
      const p = { alpha, tilt, offset: 0.2 },
        q = conicState(p),
        f = conicFoci(p);
      expect(f.length).toBe(tilt === 0 ? 1 : 2);
      for (const focus of f)
        expect(q.c * focus.point[1] - q.s * focus.point[0]).toBeCloseTo(
          p.offset,
          12,
        );
      const A = q.k * q.k * q.s * q.s - q.c * q.c;
      const B = 2 * p.offset * q.s * q.c * (q.k * q.k + 1);
      const C = p.offset * p.offset * (q.k * q.k * q.c * q.c - q.s * q.s);
      const K = C - (B * B) / (4 * A);
      const target = 2 * Math.sqrt(-K / A);
      for (const [point] of conicSegments(p, 256)) {
        const [u, v] = conicPlanePoint(p, point);
        const a = Math.hypot(u - f[0].u, v),
          b = Math.hypot(u - f.at(-1).u, v);
        expect(A < 0 ? a + b : Math.abs(a - b)).toBeCloseTo(target, 9);
      }
    }
});
it("parabolic focus obeys focus/directrix distances and degenerate sections have none", () => {
  for (const alpha of [20, 30, 45]) {
    const p = { alpha, tilt: 90 - alpha, offset: 0.3 },
      q = conicState(p),
      f = conicFoci(p);
    expect(f.length).toBe(1);
    const B = 2 * p.offset * q.s * q.c * (q.k * q.k + 1);
    const C = p.offset * p.offset * (q.k * q.k * q.c * q.c - q.s * q.s);
    const directrix = -C / B - B / 4;
    for (const [point] of conicSegments(p, 256)) {
      const [u, v] = conicPlanePoint(p, point);
      expect(Math.hypot(u - f[0].u, v)).toBeCloseTo(
        Math.abs(u - directrix),
        10,
      );
    }
    expect(conicFoci({ ...p, offset: 0 })).toEqual([]);
  }
});
