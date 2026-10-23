import { it, expect } from "vitest";
import {
  volcanoProfile,
  volcanoPoint,
  volcanoShell,
} from "../src/VolcanoSurface.js";
it("rounded profile preserves knot heights, monotonic segments and continuous slopes", () => {
  const knots = [
    [0.16, 1.55],
    [0.45, 2.02],
    [0.7, 2.18],
    [0.95, 1.75],
    [1.4, 0.95],
    [2.25, -0.1],
    [3.1, -0.7],
  ];
  knots.forEach(([r, y]) => expect(volcanoProfile(r)).toBeCloseTo(y, 12));
  for (let i = 0; i < knots.length - 1; i++) {
    const [r0, y0] = knots[i],
      [r1, y1] = knots[i + 1];
    let previous = y0;
    for (let j = 1; j <= 100; j++) {
      const y = volcanoProfile(r0 + ((r1 - r0) * j) / 100);
      expect((y - previous) * Math.sign(y1 - y0)).toBeGreaterThanOrEqual(
        -1e-12,
      );
      previous = y;
    }
  }
  for (const [r] of knots.slice(1, -1)) {
    const e = 1e-6,
      left = (volcanoProfile(r) - volcanoProfile(r - e)) / e,
      right = (volcanoProfile(r + e) - volcanoProfile(r)) / e;
    expect(Math.abs(left - right)).toBeLessThan(0.0001);
  }
});
it("irregular terrain keeps periodic seam, invertible footprint and fixed mesh budget", () => {
  for (let i = 0; i < 60; i++) {
    const a = (i * Math.PI) / 30;
    let previous = 0;
    for (let j = 1; j <= 100; j++) {
      const r = (3.1 * j) / 100,
        p = volcanoPoint(r, a),
        next = volcanoPoint(r, a + 2 * Math.PI);
      expect(p.distanceTo(next)).toBeLessThan(1e-10);
      const radial = Math.hypot(p.x, p.z);
      expect(radial).toBeGreaterThan(previous);
      previous = radial;
    }
  }
  const shell = volcanoShell(0, 2 * Math.PI);
  expect(shell.attributes.position.count).toBe(81 * 129);
  expect(shell.index.count).toBe(80 * 128 * 6);
  shell.dispose();
});

it("cutaway closure and outer shell share texture coordinates at their seam", () => {
  const main = volcanoShell(0.15 * Math.PI, 1.55 * Math.PI),
    cap = volcanoShell(1.7 * Math.PI, 0.45 * Math.PI, 40);
  for (let j = 0; j <= 80; j++) {
    expect(main.attributes.uv.getX(j * 129 + 128)).toBeCloseTo(
      cap.attributes.uv.getX(j * 41),
      6,
    );
    expect(main.attributes.uv.getY(j * 129 + 128)).toBeCloseTo(
      cap.attributes.uv.getY(j * 41),
      6,
    );
  }
  main.dispose();
  cap.dispose();
});
