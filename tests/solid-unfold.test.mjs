import { expect, it } from "vitest";
import {
  unfoldedPoint,
  unfoldedNormal,
  unfoldedLightness,
  solidUnfoldScale,
  projectUnfoldPoint,
} from "../src/solidUnfold.mjs";
const distance = (a, b) => Math.hypot(...a.map((v, i) => v - b[i]));
it("larger fixed framing keeps every unfolding stage inside the illustration area", () => {
  for (const kind of ["cone", "cylinder"])
    for (const r of [0.5, 1.2, 2])
      for (const h of [1, 2.5, 4]) {
        const scale = solidUnfoldScale(kind, r, h);
        let widest = 0,
          tallest = 0;
        for (let t = 0; t <= 100; t++) {
          let minX = Infinity,
            maxX = -Infinity,
            minY = Infinity,
            maxY = -Infinity;
          for (let u = 0; u <= 72; u++)
            for (const v of [0, 1]) {
              const [x, y] = projectUnfoldPoint(
                unfoldedPoint(kind, r, h, t / 100, u / 72, v),
              );
              minX = Math.min(minX, x);
              maxX = Math.max(maxX, x);
              minY = Math.min(minY, y);
              maxY = Math.max(maxY, y);
            }
          widest = Math.max(widest, (maxX - minX) * scale);
          tallest = Math.max(tallest, (maxY - minY) * scale);
        }
        expect(widest).toBeLessThanOrEqual(440.00001);
        expect(tallest).toBeLessThanOrEqual(220.00001);
        expect(scale).toBeGreaterThan(
          kind === "cone"
            ? 105 / Math.hypot(r, h)
            : 320 / Math.max(2 * Math.PI * r, h * 1.8),
        );
      }
});
it("连续展开保持局部弧长、母线长度与正交关系", () => {
  for (const kind of ["cone", "cylinder"])
    for (const [r, h] of [
      [0.5, 4],
      [2, 1],
      [1.2, 2.5],
    ])
      for (const t of [0, 0.25, 0.5, 0.99, 1]) {
        const p = (u, v) => unfoldedPoint(kind, r, h, t, u, v);
        const du = 1e-5,
          u = 0.35,
          v = 0.7;
        expect(distance(p(u + du, v), p(u - du, v)) / (2 * du)).toBeCloseTo(
          2 * Math.PI * r * (kind === "cone" ? v : 1),
          6,
        );
        expect(distance(p(u, 1), p(u, 0))).toBeCloseTo(
          kind === "cone" ? Math.hypot(r, h) : h,
          10,
        );
        const a = p(u + du, v).map((x, i) => (x - p(u - du, v)[i]) / (2 * du));
        const b = p(u, v + du).map((x, i) => (x - p(u, v - du)[i]) / (2 * du));
        expect(a.reduce((s, x, i) => s + x * b[i], 0)).toBeCloseTo(0, 6);
        if (t === 0) expect(distance(p(0, v), p(1, v))).toBeCloseTo(0, 10);
        if (t === 1)
          expect(kind === "cone" ? p(u, v)[1] : p(u, v)[2]).toBeCloseTo(0, 10);
      }
});

it("surface normals stay perpendicular while unfolded planes have uniform lighting", () => {
  for (const kind of ["cone", "cylinder"])
    for (const [r, h] of [
      [0.5, 4],
      [2, 1],
    ])
      for (const t of [0, 0.5, 1]) {
        const shades = [];
        for (const u of [0.1, 0.3, 0.5, 0.7, 0.9]) {
          const n = unfoldedNormal(kind, r, h, t, u);
          expect(Math.hypot(...n)).toBeCloseTo(1, 10);
          for (const [du, dv] of [
            [1e-5, 0],
            [0, 1e-5],
          ]) {
            const a = unfoldedPoint(kind, r, h, t, u + du, 0.6 + dv);
            const b = unfoldedPoint(kind, r, h, t, u - du, 0.6 - dv);
            expect(
              n.reduce((sum, x, i) => sum + (x * (a[i] - b[i])) / 2e-5, 0),
            ).toBeCloseTo(0, 6);
          }
          shades.push(unfoldedLightness(kind, r, h, t, u));
        }
        if (t === 1)
          expect(Math.max(...shades) - Math.min(...shades)).toBeLessThan(1e-10);
      }
});
