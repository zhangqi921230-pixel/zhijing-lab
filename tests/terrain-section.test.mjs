import { it, expect } from "vitest";
import {
  terrainSection,
  terrainSectionEndpoints,
  terrainHeightAt,
} from "../src/models.mjs";
it("rotated sections follow the exact piecewise planar terrain", () => {
  for (const angle of [0, 5, 35, 45, 85, 90])
    for (const position of [0, 25, 50, 75, 100]) {
      const points = terrainSection(position, angle);
      expect(points.length).toBeGreaterThan(2);
      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1],
          b = points[i];
        expect(
          terrainHeightAt((a[0] + b[0]) / 2, (a[2] + b[2]) / 2),
        ).toBeCloseTo((a[1] + b[1]) / 2, 6);
      }
      for (const endpoint of terrainSectionEndpoints(position, angle))
        for (const v of endpoint) expect(Math.abs(v)).toBeLessThanOrEqual(3);
    }
});
it("cardinal sections preserve A to B geographic direction", () => {
  expect(terrainSectionEndpoints(50, 0)).toEqual([
    [-3, 0],
    [3, 0],
  ]);
  const [a, b] = terrainSectionEndpoints(50, 90);
  expect(a[0]).toBeCloseTo(0);
  expect(a[1]).toBe(-3);
  expect(b[0]).toBeCloseTo(0);
  expect(b[1]).toBe(3);
});
