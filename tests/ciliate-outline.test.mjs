import { expect, it } from "vitest";
import {
  ciliateBoundary,
  ciliateCurves,
  ciliaRoots,
  ciliumTip,
} from "../src/ciliateOutline.mjs";
it("cilia attach to the same continuous body and beat outward without moving their roots", () => {
  ciliateCurves.forEach((curve, i) => {
    expect(ciliateBoundary(i / 4).position).toEqual(curve[0]);
    expect(curve[3]).toEqual(ciliateCurves[(i + 1) % 4][0]);
  });
  expect(ciliateBoundary(0)).toEqual(ciliateBoundary(1));
  const before = JSON.stringify(ciliaRoots);
  for (let t = 0; t < 8; t += 0.13) {
    ciliaRoots.forEach((root, i) => {
      expect(Math.hypot(...root.normal)).toBeCloseTo(1, 10);
      const tip = ciliumTip(root, i, t),
        delta = tip.map((v, k) => v - root.position[k]);
      expect(
        delta[0] * root.normal[0] + delta[1] * root.normal[1],
      ).toBeGreaterThan(1.3);
      expect(Math.hypot(...delta)).toBeLessThan(2.5);
    });
  }
  expect(JSON.stringify(ciliaRoots)).toBe(before);
  expect(ciliumTip(ciliaRoots[0], 0, 0)).not.toEqual(
    ciliumTip(ciliaRoots[0], 0, 0.1),
  );
});
